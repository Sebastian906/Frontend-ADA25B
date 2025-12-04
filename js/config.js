const CONFIG = {
    // URL del backend (CAMBIAR según tu entorno)
    API_BASE_URL: window.location.hostname === 'localhost'
        ? 'http://localhost:8000'
        : 'https://tu-backend.production.url',

    // Endpoints disponibles
    ENDPOINTS: {
        ANALYZE: '/analyze',
        ROOT: '/'
    },

    // Configuración de visualización
    VISUALIZATION: {
        MERMAID_THEME: 'dark',
        MAX_DIAGRAM_WIDTH: 800,
        ANIMATION_DURATION: 300
    },

    // Tipos de código soportados
    CODE_TYPES: {
        PYTHON: 'python',
        PSEUDOCODE: 'pseudocode'
    },

    // Mensajes del sistema
    MESSAGES: {
        ANALYZING: 'Analizando algoritmo...',
        SUCCESS: 'Análisis completado',
        ERROR: 'Error en el análisis',
        BACKEND_OFFLINE: 'Backend no disponible',
        EMPTY_CODE: 'Por favor, ingresa código para analizar',
        CODE_TOO_SHORT: 'El código es demasiado corto',
        CODE_TOO_LONG: 'El código es demasiado largo'
    },

    // Límites
    LIMITS: {
        MIN_CODE_LENGTH: 10,
        MAX_CODE_LENGTH: 10000
    },

    // Configuración de timeouts
    TIMEOUTS: {
        API_REQUEST: 30000,  // 30 segundos
        NOTIFICATION: 4000    // 4 segundos
    }
};

// Detección automática de entorno
if (typeof window !== 'undefined') {
    console.log('Entorno detectado:', window.location.hostname === 'localhost' ? 'Desarrollo' : 'Producción');
    console.log('Backend URL:', CONFIG.API_BASE_URL);
}