class ApiService {
    constructor() {
        this.baseUrl = CONFIG.API_BASE_URL;
        this.timeout = CONFIG.TIMEOUTS.API_REQUEST;
    }

    /**
     * Realiza una petición con timeout
     */
    async fetchWithTimeout(url, options = {}) {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), this.timeout);

        try {
            const response = await fetch(url, {
                ...options,
                signal: controller.signal
            });
            clearTimeout(timeoutId);
            return response;
        } catch (error) {
            clearTimeout(timeoutId);
            if (error.name === 'AbortError') {
                throw new Error('La solicitud excedió el tiempo de espera');
            }
            throw error;
        }
    }

    /**
     * Analiza código y retorna resultados
     * @param {string} code - Código a analizar
     * @param {string} codeType - Tipo de código ('python' o 'pseudocode')
     * @param {string} algorithmName - Nombre opcional del algoritmo
     * @returns {Promise<Object>} Resultado del análisis
     */
    async analyzeCode(code, codeType = 'pseudocode', algorithmName = '') {
        try {
            console.log('Enviando análisis al backend...');
            console.log('URL:', `${this.baseUrl}${CONFIG.ENDPOINTS.ANALYZE}`);
            console.log('Tipo de código:', codeType);

            const response = await this.fetchWithTimeout(
                `${this.baseUrl}${CONFIG.ENDPOINTS.ANALYZE}`,
                {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Accept': 'application/json'
                    },
                    body: JSON.stringify({
                        code: code,
                        code_type: codeType,
                        algorithm_name: algorithmName || ''
                    })
                }
            );

            // Verificar respuesta
            if (!response.ok) {
                const errorText = await response.text();
                console.error('Error del servidor:', errorText);
                throw new Error(`HTTP ${response.status}: ${response.statusText}`);
            }

            // Parsear JSON
            const data = await response.json();
            console.log('Respuesta del backend:', data);

            return {
                success: true,
                data: data
            };

        } catch (error) {
            console.error('Error al analizar código:', error);

            // Mensajes de error específicos
            let errorMessage = 'Error desconocido';

            if (error.message.includes('Failed to fetch') || error.message.includes('NetworkError')) {
                errorMessage = 'No se pudo conectar con el backend. Verifica que esté ejecutándose.';
            } else if (error.message.includes('timeout') || error.message.includes('tiempo')) {
                errorMessage = 'La solicitud tardó demasiado. El algoritmo puede ser muy complejo.';
            } else if (error.message.includes('HTTP')) {
                errorMessage = error.message;
            } else {
                errorMessage = error.message;
            }

            return {
                success: false,
                error: errorMessage
            };
        }
    }

    /**
     * Verifica el estado del backend
     * @returns {Promise<boolean>} True si el backend está disponible
     */
    async checkHealth() {
        try {
            console.log('Verificando estado del backend...');

            const response = await this.fetchWithTimeout(
                `${this.baseUrl}${CONFIG.ENDPOINTS.ROOT}`,
                {
                    method: 'GET',
                    headers: {
                        'Accept': 'application/json'
                    }
                }
            );

            if (!response.ok) {
                console.warn('Backend respondió con estado:', response.status);
                return false;
            }

            const data = await response.json();
            console.log('Respuesta del backend:', data);

            // Verificar mensaje esperado
            const isHealthy = data.message &&
                data.message.includes('Analizador de Complejidades') &&
                data.message.includes('Sistema Activo');

            if (isHealthy) {
                console.log('✓ Backend disponible y funcionando');
            } else {
                console.warn('Backend respondió, pero el mensaje no coincide:', data.message);
            }

            return isHealthy;

        } catch (error) {
            console.error('Error al verificar backend:', error);
            console.error('Detalles:', {
                url: `${this.baseUrl}${CONFIG.ENDPOINTS.ROOT}`,
                error: error.message
            });
            return false;
        }
    }

    /**
     * Obtiene información del algoritmo desde el backend
     * @param {string} algorithmName - Nombre del algoritmo
     * @returns {Promise<Object>} Información del algoritmo
     */
    async getAlgorithmInfo(algorithmName) {
        try {
            const response = await this.fetchWithTimeout(
                `${this.baseUrl}/algorithm/${algorithmName}`,
                {
                    method: 'GET',
                    headers: {
                        'Accept': 'application/json'
                    }
                }
            );

            if (!response.ok) {
                throw new Error(`HTTP ${response.status}`);
            }

            return await response.json();

        } catch (error) {
            console.error('Error al obtener información del algoritmo:', error);
            return null;
        }
    }
}

// Crear instancia global
const apiService = new ApiService();

// Log de inicialización
console.log('ApiService inicializado');
console.log('Backend URL:', CONFIG.API_BASE_URL);