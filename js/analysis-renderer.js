class AnalysisRenderer {
    constructor() {
        this.lineAnalysisContainer = document.getElementById('line-analysis-container');
        this.recurrenceContainer = document.getElementById('recurrence-container');
        this.validationContainer = document.getElementById('validation-container');
    }

    renderLineAnalysis(lines) {
        console.log('renderLineAnalysis llamado con:', lines);

        if (!this.lineAnalysisContainer) {
            console.error('lineAnalysisContainer no encontrado');
            return;
        }

        if (!lines || lines.length === 0) {
            console.warn('⚠ No hay líneas para analizar');
            this.lineAnalysisContainer.innerHTML = `
            <div style="text-align: center; padding: 2rem; color: var(--text-muted);">
                No hay datos de análisis línea por línea
            </div>
        `;
            return;
        }

        console.log(`✓ Generando tabla con ${lines.length} líneas`);

        let html = `
        <table class="line-analysis-table fade-in">
            <thead>
                <tr>
                    <th>Línea</th>
                    <th>Código</th>
                    <th>Tipo</th>
                    <th>Ejecuciones</th>
                    <th>Costo Temporal</th>
                </tr>
            </thead>
            <tbody>
    `;

        lines.forEach((line, index) => {
            const lineNo = line.line || index + 1;
            const code = this.escapeHtml(line.raw || '');
            const type = this.formatType(line.type || 'unknown');
            const execCount = line.exec_count || '1';
            const timeCost = line.time_cost || 'O(1)';

            html += `
            <tr class="fade-in-up" style="animation-delay: ${index * 0.03}s">
                <td class="line-number">${lineNo}</td>
                <td class="line-code" title="${code}">${code}</td>
                <td>${type}</td>
                <td class="line-executions">${execCount}</td>
                <td class="line-cost">${timeCost}</td>
            </tr>
        `;
        });

        html += `
            </tbody>
        </table>
    `;

        this.lineAnalysisContainer.innerHTML = html;
        console.log('✓ Tabla de análisis línea por línea renderizada');
    }

    renderRecurrence(recurrenceInfo, lines) {
        console.log('renderRecurrence llamado con:', recurrenceInfo, lines);

        if (!this.recurrenceContainer) {
            console.error('recurrenceContainer no encontrado');
            return;
        }

        if (!recurrenceInfo || !recurrenceInfo.equation) {
            console.warn('⚠ No hay información de recurrencia');
            this.recurrenceContainer.innerHTML = `
            <div style="text-align: center; padding: 2rem; color: var(--text-muted);">
                No se detectó ecuación de recurrencia
            </div>
        `;
            return;
        }

        console.log('✓ Generando secciones de recurrencia');

        // Generar ecuación completa desde líneas
        const fullEquation = this.generateFullEquation(lines);
        const simplified = recurrenceInfo.simplified || recurrenceInfo.equation;

        let html = `
        <div class="recurrence-section fade-in">
            <div class="recurrence-title">Ecuación de Recurrencia Completa:</div>
            <div class="recurrence-equation">
                T(n) = ${fullEquation}
            </div>
        </div>

        <div class="recurrence-section fade-in" style="animation-delay: 0.1s">
            <div class="recurrence-title">Ecuación de Recurrencia Simplificada:</div>
            <div class="recurrence-equation">
                ${simplified}
            </div>
        </div>
    `;

        // Generar constantes
        const constants = this.extractConstants(lines);
        if (constants.length > 0) {
            html += `
            <div class="recurrence-section fade-in" style="animation-delay: 0.2s">
                <div class="recurrence-title">Constantes:</div>
                <div class="recurrence-constants">
        `;

            constants.forEach((constant, index) => {
                html += `
                <div class="constant-item fade-in" style="animation-delay: ${0.3 + index * 0.05}s">
                    <span class="constant-label">${constant.name}:</span>
                    <span class="constant-value">${constant.value}</span>
                </div>
            `;
            });

            html += `
                </div>
            </div>
        `;
        }

        this.recurrenceContainer.innerHTML = html;
        console.log('✓ Ecuación de recurrencia renderizada');
    }

    renderValidation(validation) {
        console.log('renderValidation llamado con:', validation);
        if (!this.validationContainer) {
            console.error('validationContainer no encontrado');
            return;
        }

        if (!validation) {
            console.warn('⚠ No hay datos de validación');
            this.validationContainer.innerHTML = `
            <div style="text-align: center; padding: 2rem; color: var(--text-muted);">
                No hay datos de validación disponibles
            </div>
        `;
            return;
        }

        console.log('✓ Generando secciones de validación');

        const score = validation.overall_score || 0;
        const rigor = validation.mathematical_rigor || 'LOW';
        const autoAnalysis = validation.auto_analysis || {};
        const complexity = autoAnalysis.complexity || {};

        let html = `
            <!-- Puntuación General -->
            <div class="validation-score fade-in">
                <div class="score-value">${score.toFixed(1)}<span style="font-size: 1.5rem; color: var(--text-secondary);">/100</span></div>
                <div class="score-label">Puntuación de Validación</div>
                <div style="margin-top: 1rem; color: var(--text-secondary);">
                    Rigor Matemático: <span style="color: ${this.getRigorColor(rigor)}; font-weight: 600;">${rigor}</span>
                </div>
            </div>

            <!-- Comparación de Complejidades -->
            <div class="fade-in" style="animation-delay: 0.1s; margin-top: 1rem;">
                <h4 style="color: var(--primary-green); margin-bottom: 1rem; font-family: var(--font-mono);">
                    COMPARACIÓN Y ANÁLISIS DE DISCREPANCIAS
                </h4>
                <table class="comparison-table">
                    <thead>
                        <tr>
                            <th>Notación</th>
                            <th>Automático</th>
                            <th>Gemini</th>
                            <th>¿Coincide?</th>
                        </tr>
                    </thead>
                    <tbody>
        `;

        // Big-O
        const geminiBigO = this.extractGeminiComplexity(validation, 'big_o');
        html += this.renderComparisonRow(
            'Big-O',
            complexity.big_o || 'N/A',
            geminiBigO,
            this.checkMatch(complexity.big_o, geminiBigO)
        );

        // Omega
        const geminiOmega = this.extractGeminiComplexity(validation, 'omega');
        html += this.renderComparisonRow(
            'Omega',
            complexity.omega || 'N/A',
            geminiOmega,
            this.checkMatch(complexity.omega, geminiOmega)
        );

        // Theta
        const geminiTheta = this.extractGeminiComplexity(validation, 'theta');
        html += this.renderComparisonRow(
            'Theta',
            complexity.theta || 'N/A',
            geminiTheta,
            this.checkMatch(complexity.theta, geminiTheta)
        );

        html += `
                    </tbody>
                </table>
            </div>
        `;

        // Errores críticos
        if (validation.critical_errors && validation.critical_errors.length > 0) {
            html += `
                <div class="errors-list fade-in" style="animation-delay: 0.2s;">
                    <h4 style="color: #ef4444; margin-bottom: 0.5rem; font-family: var(--font-mono);">
                        ⚠ ERRORES CRÍTICOS
                    </h4>
            `;
            validation.critical_errors.forEach(error => {
                html += `<div class="error-item">${this.escapeHtml(error)}</div>`;
            });
            html += `</div>`;
        }

        // Advertencias
        if (validation.warnings && validation.warnings.length > 0) {
            html += `
                <div class="errors-list fade-in" style="animation-delay: 0.3s;">
                    <h4 style="color: #fbbf24; margin-bottom: 0.5rem; font-family: var(--font-mono);">
                        ⚡ ADVERTENCIAS
                    </h4>
            `;
            validation.warnings.forEach(warning => {
                html += `<div class="warning-item">${this.escapeHtml(warning)}</div>`;
            });
            html += `</div>`;
        }

        // Correcciones
        if (validation.corrections && validation.corrections.length > 0) {
            html += `
                <div class="errors-list fade-in" style="animation-delay: 0.4s;">
                    <h4 style="color: var(--primary-green); margin-bottom: 0.5rem; font-family: var(--font-mono);">
                        ✓ CORRECCIONES SUGERIDAS
                    </h4>
            `;
            validation.corrections.forEach(correction => {
                html += `<div class="correction-item">${this.escapeHtml(correction)}</div>`;
            });
            html += `</div>`;
        }

        this.validationContainer.innerHTML = html;
        console.log('✓ Validación renderizada');
    }

    // ========== MÉTODOS AUXILIARES ==========

    generateFullEquation(lines) {
        if (!lines || lines.length === 0) return 'C';

        const parts = [];
        lines.forEach((line, index) => {
            const cost = line.time_cost || 'O(1)';
            const exec = line.exec_count || '1';

            if (exec === '1') {
                parts.push(`C${line.line || index + 1}`);
            } else {
                parts.push(`C${line.line || index + 1}*${exec}`);
            }
        });

        return parts.join(' + ');
    }

    extractConstants(lines) {
        if (!lines || lines.length === 0) return [];

        const constants = [];
        lines.forEach(line => {
            const cost = line.time_cost || 'O(1)';
            constants.push({
                name: `C${line.line}`,
                value: cost
            });
        });

        return constants;
    }

    extractGeminiComplexity(validation, type) {
        const details = validation.complexity_details || {};
        const geminiComplexities = details.gemini_complexities || {};
        return geminiComplexities[type] || 'N/A';
    }

    checkMatch(auto, gemini) {
        if (!auto || !gemini || gemini === 'N/A') return null;

        const autoClean = auto.toLowerCase().replace(/[^a-z0-9]/g, '');
        const geminiClean = gemini.toLowerCase().replace(/[^a-z0-9]/g, '');

        return autoClean === geminiClean;
    }

    renderComparisonRow(notation, auto, gemini, match) {
        const icon = match === null ? '—' : (match ? '✓' : '✗');
        const iconClass = match === null ? '' : (match ? 'match-true' : 'match-false');

        return `
            <tr>
                <td style="color: var(--primary-green); font-weight: 600;">${notation}</td>
                <td>${auto}</td>
                <td>${gemini}</td>
                <td class="match-icon ${iconClass}">${icon}</td>
            </tr>
        `;
    }

    getRigorColor(rigor) {
        const colors = {
            'HIGH': '#10b981',
            'MEDIUM': '#fbbf24',
            'LOW': '#ef4444'
        };
        return colors[rigor] || '#64748b';
    }

    formatType(type) {
        const types = {
            'for_loop': 'For Loop',
            'while_loop': 'While Loop',
            'if_statement': 'Condicional',
            'assignment': 'Asignación',
            'read': 'Lectura',
            'write': 'Escritura',
            'other': 'Otro'
        };
        return types[type] || type;
    }

    escapeHtml(text) {
        const map = {
            '&': '&amp;',
            '<': '&lt;',
            '>': '&gt;',
            '"': '&quot;',
            "'": '&#039;'
        };
        return text.replace(/[&<>"']/g, m => map[m]);
    }

    clear() {
        if (this.lineAnalysisContainer) this.lineAnalysisContainer.innerHTML = '';
        if (this.recurrenceContainer) this.recurrenceContainer.innerHTML = '';
        if (this.validationContainer) this.validationContainer.innerHTML = '';
    }
}

// Instancia global
const analysisRenderer = new AnalysisRenderer();