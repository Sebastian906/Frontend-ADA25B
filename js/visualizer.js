class Visualizer {
    constructor() {
        this.diagramContainer = document.getElementById('diagram-container');
        this.initMermaid();
    }

    initMermaid() {
        // Configurar Mermaid.js
        if (typeof mermaid !== 'undefined') {
            mermaid.initialize({
                startOnLoad: false,
                theme: 'dark',
                themeVariables: {
                    primaryColor: '#10b981',
                    primaryTextColor: '#f1f5f9',
                    primaryBorderColor: '#059669',
                    lineColor: '#34d399',
                    secondaryColor: '#1e293b',
                    tertiaryColor: '#0f172a',
                    background: '#0f172a',
                    mainBkg: '#1e293b',
                    secondBkg: '#0f172a',
                    textColor: '#f1f5f9',
                    fontSize: '14px'
                }
            });
        }
    }

    renderDiagram(result) {
        if (!this.diagramContainer) return;

        this.diagramContainer.innerHTML = '';

        // ========== PRIORIDAD 1: Usar mermaid_code del backend ==========
        if (result.mermaid_code) {
            this.renderMermaidCode(result.mermaid_code);
            return;
        }

        // ========== PRIORIDAD 2: Verificar archivos ==========
        const files = result.files || [];
        const svgFile = files.find(f => f.endsWith('.svg'));
        const pngFile = files.find(f => f.endsWith('.png'));

        if (svgFile) {
            this.renderSVG(svgFile);
        } else if (pngFile) {
            this.renderPNG(pngFile);
        } else {
            // ========== PRIORIDAD 3: Generar diagrama simple ==========
            this.renderSimpleDiagram(result);
        }
    }

    // ========== NUEVO MÉTODO ==========
    renderMermaidCode(mermaidCode) {
        const wrapper = document.createElement('div');
        wrapper.className = 'mermaid-diagram fade-in';
        wrapper.style.cssText = `
        background: #0f172a;
        padding: 2rem;
        border-radius: 8px;
        border: 2px solid var(--primary-green);
        min-height: 400px;
        display: flex;
        justify-content: center;
        align-items: center;
    `;

        // Crear contenedor para Mermaid
        const mermaidContainer = document.createElement('div');
        mermaidContainer.className = 'mermaid';
        mermaidContainer.textContent = mermaidCode;

        wrapper.appendChild(mermaidContainer);
        this.diagramContainer.appendChild(wrapper);

        // Renderizar con Mermaid
        if (typeof mermaid !== 'undefined') {
            try {
                mermaid.run({
                    querySelector: '.mermaid'
                }).catch(err => {
                    console.error('Error renderizando Mermaid:', err);
                    this.showMermaidError(mermaidCode);
                });
            } catch (error) {
                console.error('Error al ejecutar Mermaid:', error);
                this.showMermaidError(mermaidCode);
            }
        }
    }

    // ========== MÉTODO PARA MOSTRAR ERROR ==========
    showMermaidError(mermaidCode) {
        if (!this.diagramContainer) return;

        this.diagramContainer.innerHTML = `
        <div style="
            background: #1e293b;
            padding: 2rem;
            border-radius: 8px;
            border: 2px solid #ef4444;
        ">
            <div style="color: #ef4444; font-weight: 600; margin-bottom: 1rem;">
                ⚠ Error al renderizar diagrama Mermaid
            </div>
            <details>
                <summary style="color: var(--text-secondary); cursor: pointer; margin-bottom: 1rem;">
                    Ver código Mermaid
                </summary>
                <pre style="
                    background: #000;
                    color: var(--primary-green);
                    padding: 1rem;
                    border-radius: 4px;
                    overflow-x: auto;
                    font-size: 0.85rem;
                ">${mermaidCode}</pre>
            </details>
        </div>
    `;
    }

    renderFromMarkdown(result) {
        // Extraer código Mermaid del resultado
        const mermaidCode = this.extractMermaidCode(result);

        if (mermaidCode) {
            const wrapper = document.createElement('div');
            wrapper.className = 'mermaid-diagram fade-in';
            wrapper.innerHTML = mermaidCode;
            this.diagramContainer.appendChild(wrapper);

            // Renderizar con Mermaid
            if (typeof mermaid !== 'undefined') {
                mermaid.run({
                    querySelector: '.mermaid-diagram'
                });
            }
        }
    }

    extractMermaidCode(result) {
        // Intentar extraer de diferentes fuentes
        if (result.mermaid_code) {
            return result.mermaid_code;
        }

        // Generar código Mermaid básico desde la estructura
        return this.generateMermaidFromStructure(result);
    }

    generateMermaidFromStructure(result) {
        // Generar diagrama de flujo simple basado en complejidad
        const complexity = result.complexity || {};

        let mermaidCode = 'flowchart TD\n';
        mermaidCode += '    Start([Inicio]) --> Analyze[Análisis]\n';

        if (complexity.big_o) {
            const bigOClean = complexity.big_o.replace(/[()]/g, '');
            mermaidCode += `    Analyze --> BigO["Big-O: ${bigOClean}"]\n`;
        }

        if (complexity.omega) {
            const omegaClean = complexity.omega.replace(/[()ΩΩ]/g, '');
            mermaidCode += `    Analyze --> Omega["Omega: ${omegaClean}"]\n`;
        }

        if (complexity.theta) {
            const thetaClean = complexity.theta.replace(/[()ΘΘ]/g, '');
            mermaidCode += `    Analyze --> Theta["Theta: ${thetaClean}"]\n`;
        }

        mermaidCode += '    BigO --> End([Resultado])\n';
        mermaidCode += '    Omega --> End\n';
        mermaidCode += '    Theta --> End\n';

        // Estilos corregidos
        mermaidCode += '\n    style BigO fill:#10b981,stroke:#059669,stroke-width:2px,color:#000\n';
        mermaidCode += '    style Omega fill:#10b981,stroke:#059669,stroke-width:2px,color:#000\n';
        mermaidCode += '    style Theta fill:#10b981,stroke:#059669,stroke-width:2px,color:#000\n';
        mermaidCode += '    style Start fill:#1e293b,stroke:#10b981,stroke-width:2px,color:#10b981\n';
        mermaidCode += '    style End fill:#1e293b,stroke:#10b981,stroke-width:2px,color:#10b981\n';

        return mermaidCode;
    }

    renderSVG(svgPath) {
        const img = document.createElement('img');
        img.src = svgPath;
        img.alt = 'AST Diagram';
        img.className = 'diagram-image fade-in';
        img.style.maxWidth = '100%';
        img.style.height = 'auto';
        this.diagramContainer.appendChild(img);
    }

    renderPNG(pngPath) {
        const img = document.createElement('img');
        img.src = pngPath;
        img.alt = 'AST Diagram';
        img.className = 'diagram-image fade-in';
        img.style.maxWidth = '100%';
        img.style.height = 'auto';
        this.diagramContainer.appendChild(img);
    }

    renderSimpleDiagram(result) {
        // Crear visualización simple de texto
        const wrapper = document.createElement('div');
        wrapper.className = 'simple-diagram';
        wrapper.style.cssText = `
      background: #000;
      padding: 2rem;
      border-radius: 8px;
      border: 2px solid var(--primary-green);
      font-family: var(--font-mono);
      color: var(--primary-green);
      line-height: 2;
      text-align: center;
    `;

        const complexity = result.complexity || {};

        wrapper.innerHTML = `
      <div style="margin-bottom: 1rem; font-size: 1.2rem;">
        ANÁLISIS DE COMPLEJIDAD
      </div>
      <div style="border-top: 1px solid var(--primary-green); padding-top: 1rem;">
        <div>Peor caso: ${complexity.big_o || 'N/A'}</div>
        <div>Mejor caso: ${complexity.omega || 'N/A'}</div>
        <div>Promedio: ${complexity.theta || 'N/A'}</div>
      </div>
    `;

        this.diagramContainer.appendChild(wrapper);
    }

    renderPatterns(patterns) {
        const patternsList = document.getElementById('patterns-list');
        if (!patternsList) return;

        patternsList.innerHTML = '';

        // Verificar si patterns es un array válido
        if (!Array.isArray(patterns) || patterns.length === 0) {
            patternsList.innerHTML = `
            <div class="no-patterns" style="
                text-align: center;
                padding: 2rem;
                color: var(--text-muted);
                font-family: var(--font-mono);
                background: var(--bg-dark);
                border-radius: 8px;
                border: 1px dashed var(--border-color);
            ">
                <div style="font-size: 2rem; margin-bottom: 1rem;">🔍</div>
                <div>No se detectaron patrones algorítmicos específicos</div>
                <div style="font-size: 0.85rem; margin-top: 0.5rem; opacity: 0.7;">
                    El algoritmo no coincide con patrones predefinidos
                </div>
            </div>
        `;
            return;
        }

        patterns.forEach((pattern, index) => {
            const patternDiv = document.createElement('div');
            patternDiv.className = 'pattern-badge fade-in-up';
            patternDiv.style.animationDelay = `${index * 0.1}s`;

            // Extraer información del patrón
            const name = pattern.name || pattern.description || 'Patrón desconocido';
            const description = pattern.description || '';
            const confidence = pattern.confidence || 'N/A';

            patternDiv.innerHTML = `
            <div class="pattern-name" style="
                color: var(--primary-green);
                font-weight: 600;
                font-size: 1rem;
                margin-bottom: 0.3rem;
            ">
                ${name}
            </div>
            ${description && description !== name ? `
                <div style="
                    color: var(--text-secondary);
                    font-size: 0.9rem;
                    margin-bottom: 0.3rem;
                ">
                    ${description}
                </div>
            ` : ''}
            <div style="
                color: var(--text-muted);
                font-size: 0.85rem;
                display: flex;
                align-items: center;
                gap: 0.5rem;
            ">
                <span>Confianza:</span>
                <span style="
                    color: var(--accent-green);
                    font-weight: 600;
                ">
                    ${confidence}
                </span>
            </div>
        `;

            patternsList.appendChild(patternDiv);
        });
    }

    renderFiles(files) {
        const filesList = document.getElementById('files-list');
        if (!filesList) return;

        filesList.innerHTML = '';

        if (!files || files.length === 0) {
            filesList.innerHTML = `
        <div style="
          text-align: center;
          padding: 1rem;
          color: var(--text-muted);
          font-family: var(--font-mono);
        ">
          No se generaron archivos adicionales
        </div>
      `;
            return;
        }

        const fileGrid = document.createElement('div');
        fileGrid.style.cssText = `
      display: grid;
      gap: 0.5rem;
    `;

        files.forEach((file, index) => {
            const fileName = file.split('/').pop();
            const fileExt = fileName.split('.').pop();

            const fileItem = document.createElement('div');
            fileItem.className = 'file-item fade-in';
            fileItem.style.cssText = `
        background: var(--bg-dark);
        padding: 0.8rem 1rem;
        border-radius: 6px;
        border-left: 3px solid var(--primary-green);
        display: flex;
        justify-content: space-between;
        align-items: center;
        transition: all 0.3s ease;
        animation-delay: ${index * 0.05}s;
      `;

            fileItem.innerHTML = `
        <div>
          <span style="color: var(--primary-green); font-weight: 600; margin-right: 0.5rem;">
            [${fileExt.toUpperCase()}]
          </span>
          <span style="color: var(--text-secondary); font-family: var(--font-mono); font-size: 0.9rem;">
            ${fileName}
          </span>
        </div>
        <a href="${file}" target="_blank" style="
          color: var(--accent-green);
          text-decoration: none;
          font-size: 0.85rem;
          padding: 0.3rem 0.8rem;
          border: 1px solid var(--accent-green);
          border-radius: 4px;
          transition: all 0.2s ease;
        ">
          Abrir
        </a>
      `;

            // Hover effect
            fileItem.addEventListener('mouseenter', () => {
                fileItem.style.background = 'rgba(16, 185, 129, 0.1)';
                fileItem.style.transform = 'translateX(5px)';
            });

            fileItem.addEventListener('mouseleave', () => {
                fileItem.style.background = 'var(--bg-dark)';
                fileItem.style.transform = 'translateX(0)';
            });

            fileGrid.appendChild(fileItem);
        });

        filesList.appendChild(fileGrid);
    }

    clear() {
        if (this.diagramContainer) {
            this.diagramContainer.innerHTML = '';
        }
    }
}

// Instancia global
const visualizer = new Visualizer();