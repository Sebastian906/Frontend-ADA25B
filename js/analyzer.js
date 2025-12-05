class Analyzer {
    constructor() {
        this.isAnalyzing = false;
        this.currentResult = null;
    }

    async analyze(code, codeType = 'pseudocode', algorithmName = '') {
        if (this.isAnalyzing) {
            console.warn('Ya hay un análisis en progreso');
            return null;
        }

        if (!code || code.trim() === '') {
            this.showError('Por favor, ingresa código para analizar');
            return null;
        }

        this.isAnalyzing = true;
        this.showLoading(true);
        this.hideResults();

        try {
            // Llamar al backend
            const result = await apiService.analyzeCode(code, codeType, algorithmName);

            if (result.success) {
                this.currentResult = result.data;
                this.displayResults(result.data);
                this.showSuccess('Análisis completado exitosamente');
                return result.data;
            } else {
                this.showError(`Error en el análisis: ${result.error}`);
                return null;
            }

        } catch (error) {
            console.error('Error durante el análisis:', error);
            this.showError('Error inesperado durante el análisis');
            return null;

        } finally {
            this.isAnalyzing = false;
            this.showLoading(false);
        }
    }

    displayResults(data) {
        // Mostrar sección de resultados
        const resultsSection = document.getElementById('results-section');
        if (resultsSection) {
            resultsSection.classList.remove('hidden');
            resultsSection.classList.add('fade-in-up');
        }

        // Mostrar complejidades
        console.log('→ Renderizando complejidades...');
        this.displayComplexity(data.complexity);

        // Mostrar patrones (si existen)
        console.log('→ Renderizando patrones...');
        if (data.patterns) {
            visualizer.renderPatterns(data.patterns);
        }

        // Renderizar análisis línea por línea
        console.log('→ Renderizando análisis línea por línea...');
        if (data.line_analysis && data.line_analysis.length > 0) {
            console.log(`  ✓ ${data.line_analysis.length} líneas encontradas`);
            analysisRenderer.renderLineAnalysis(data.line_analysis);
        } else {
            console.warn('  ⚠ No hay datos de line_analysis');
        }

        // Renderizar ecuación de recurrencia
        console.log('→ Renderizando ecuación de recurrencia...');
        if (data.recurrence) {
            console.log('  ✓ Recurrencia encontrada:', data.recurrence);
            analysisRenderer.renderRecurrence(data.recurrence, data.line_analysis);
        } else {
            console.warn('  ⚠ No hay datos de recurrence');
        }

        // Renderizar validación con Gemini
        console.log('→ Renderizando validación...');
        if (data.validation) {
            console.log('  ✓ Validación encontrada, score:', data.validation.overall_score);
            analysisRenderer.renderValidation(data.validation);
        } else {
            console.warn('  ⚠ No hay datos de validation');
        }

        // Mostrar diagrama
        console.log('→ Renderizando diagrama...');
        visualizer.renderDiagram(data);

        // Mostrar archivos generados
        console.log('→ Renderizando archivos...');
        if (data.files) {
            visualizer.renderFiles(data.files);
        }

        console.log('✓ Todos los resultados renderizados');

        // Scroll suave hacia resultados
        this.scrollToResults();
    }

    displayComplexity(complexity) {
        if (!complexity) return;

        // Big-O
        const bigOElement = document.getElementById('big-o');
        if (bigOElement) {
            bigOElement.textContent = complexity.big_o || 'N/A';
            this.animateValue(bigOElement);
        }

        // Omega
        const omegaElement = document.getElementById('omega');
        if (omegaElement) {
            omegaElement.textContent = complexity.omega || 'N/A';
            this.animateValue(omegaElement);
        }

        // Theta
        const thetaElement = document.getElementById('theta');
        if (thetaElement) {
            thetaElement.textContent = complexity.theta || 'N/A';
            this.animateValue(thetaElement);
        }

        // Explicación
        const explanationElement = document.getElementById('explanation');
        if (explanationElement && complexity.explanation) {
            explanationElement.textContent = complexity.explanation;
            explanationElement.classList.add('fade-in');
        }
    }

    animateValue(element) {
        element.style.opacity = '0';
        element.style.transform = 'scale(0.8)';

        setTimeout(() => {
            element.style.transition = 'all 0.5s ease';
            element.style.opacity = '1';
            element.style.transform = 'scale(1)';
        }, 100);
    }

    showLoading(show) {
        const loadingElement = document.getElementById('loading');
        const analyzeBtn = document.getElementById('analyze-btn');

        if (loadingElement) {
            if (show) {
                loadingElement.classList.remove('hidden');
                loadingElement.classList.add('fade-in');
            } else {
                loadingElement.classList.add('hidden');
            }
        }

        if (analyzeBtn) {
            if (show) {
                analyzeBtn.disabled = true;
                analyzeBtn.classList.add('btn-loading');
                analyzeBtn.textContent = 'Analizando...';
            } else {
                analyzeBtn.disabled = false;
                analyzeBtn.classList.remove('btn-loading');
                analyzeBtn.textContent = 'Analizar Algoritmo';
            }
        }
    }

    hideResults() {
        const resultsSection = document.getElementById('results-section');
        if (resultsSection) {
            resultsSection.classList.add('hidden');
        }
    }

    scrollToResults() {
        const resultsSection = document.getElementById('results-section');
        if (resultsSection) {
            setTimeout(() => {
                resultsSection.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }, 300);
        }
    }

    showError(message) {
        this.showNotification(message, 'error');
    }

    showSuccess(message) {
        this.showNotification(message, 'success');
    }

    showNotification(message, type = 'info') {
        // Crear notificación flotante
        const notification = document.createElement('div');
        notification.className = `notification notification-${type} fade-in-down`;
        notification.style.cssText = `
      position: fixed;
      top: 100px;
      right: 20px;
      z-index: 1000;
      padding: 1rem 1.5rem;
      border-radius: 8px;
      background: ${type === 'error' ? '#ef4444' : '#10b981'};
      color: white;
      font-weight: 600;
      box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
      max-width: 400px;
      animation: fadeInDown 0.5s ease;
    `;
        notification.textContent = message;

        document.body.appendChild(notification);

        // Auto-remover después de 4 segundos
        setTimeout(() => {
            notification.style.animation = 'fadeOut 0.5s ease';
            setTimeout(() => {
                document.body.removeChild(notification);
            }, 500);
        }, 4000);
    }

    clear() {
        // Limpiar resultados
        this.currentResult = null;
        this.hideResults();
        visualizer.clear();
        analysisRenderer.clear();

        // Limpiar valores
        const elements = ['big-o', 'omega', 'theta', 'explanation'];
        elements.forEach(id => {
            const element = document.getElementById(id);
            if (element) {
                element.textContent = '-';
            }
        });
    }

    exportResults() {
        if (!this.currentResult) {
            this.showError('No hay resultados para exportar');
            return;
        }

        const dataStr = JSON.stringify(this.currentResult, null, 2);
        const dataBlob = new Blob([dataStr], { type: 'application/json' });
        const url = URL.createObjectURL(dataBlob);

        const link = document.createElement('a');
        link.href = url;
        link.download = `analisis_${Date.now()}.json`;
        link.click();

        URL.revokeObjectURL(url);
        this.showSuccess('Resultados exportados exitosamente');
    }

    // Método auxiliar para validar código
    validateCode(code) {
        if (!code || code.trim() === '') {
            return { valid: false, message: 'El código está vacío' };
        }

        if (code.length < 10) {
            return { valid: false, message: 'El código es demasiado corto' };
        }

        if (code.length > 10000) {
            return { valid: false, message: 'El código es demasiado largo (máximo 10,000 caracteres)' };
        }

        return { valid: true, message: 'OK' };
    }

    // Método para obtener estadísticas del código
    getCodeStats(code) {
        const lines = code.split('\n').filter(line => line.trim() !== '');
        const chars = code.length;
        const words = code.split(/\s+/).filter(word => word.trim() !== '').length;

        return {
            lines: lines.length,
            characters: chars,
            words: words
        };
    }
}

// Instancia global
const analyzer = new Analyzer();