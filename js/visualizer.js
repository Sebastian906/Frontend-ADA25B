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

        // Verificar si hay archivos de diagramas
        const files = result.files || [];
        const mdFile = files.find(f => f.endsWith('.md'));
        const svgFile = files.find(f => f.endsWith('.svg'));
        const pngFile = files.find(f => f.endsWith('.png'));

        // Si hay archivo Markdown con Mermaid
        if (mdFile) {
            this.renderFromMarkdown(result);
        }
        // Si hay SVG
        else if (svgFile) {
            this.renderSVG(svgFile);
        }
        // Si hay PNG
        else if (pngFile) {
            this.renderPNG(pngFile);
        }
        // Generar diagrama simple si no hay archivos
        else {
            this.renderSimpleDiagram(result);
        }
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

        let mermaidCode = 'graph TD\n';
        mermaidCode += '    Start[Inicio] --> Analyze[Análisis]\n';

        if (complexity.big_o) {
            mermaidCode += `    Analyze --> BigO[Big-O: ${complexity.big_o}]\n`;
        }

        if (complexity.omega) {
            mermaidCode += `    Analyze --> Omega[Omega: ${complexity.omega}]\n`;
        }

        if (complexity.theta) {
            mermaidCode += `    Analyze --> Theta[Theta: ${complexity.theta}]\n`;
        }

        mermaidCode += '    BigO --> End[Resultado]\n';
        mermaidCode += '    Omega --> End\n';
        mermaidCode += '    Theta --> End\n';

        mermaidCode += '\n    classDef greenBox fill:#10b981,stroke:#059669,stroke-width:2px,color:#000\n';
        mermaidCode += '    class BigO,Omega,Theta greenBox\n';

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

        if (!patterns || patterns.length === 0) {
            patternsList.innerHTML = `
        <div class="no-patterns" style="
          text-align: center;
          padding: 2rem;
          color: var(--text-muted);
          font-family: var(--font-mono);
        ">
          No se detectaron patrones algorítmicos específicos
        </div>
      `;
            return;
        }

        patterns.forEach((pattern, index) => {
            const patternDiv = document.createElement('div');
            patternDiv.className = 'pattern-badge fade-in-up';
            patternDiv.style.animationDelay = `${index * 0.1}s`;

            patternDiv.innerHTML = `
        <div class="pattern-name">${pattern.name || pattern.description}</div>
        <div class="pattern-complexity">${pattern.complexity || 'Complejidad no especificada'}</div>
        ${pattern.confidence ? `<div style="color: var(--text-muted); font-size: 0.85rem; margin-top: 0.3rem;">Confianza: ${pattern.confidence}</div>` : ''}
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