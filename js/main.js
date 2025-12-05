// Esperar a que el DOM esté completamente cargado
document.addEventListener('DOMContentLoaded', () => {
    initializeApp();
});

function initializeApp() {
    console.log('Inicializando Analizador de Complejidades...');

    // Verificar conexión con backend
    checkBackendHealth();

    // Configurar event listeners
    setupEventListeners();

    // Configurar editor
    setupEditor();

    // Cargar ejemplo inicial (opcional)
    // loadInitialExample();

    console.log('Aplicación inicializada correctamente');
}

// ============================================
// VERIFICACIÓN DE BACKEND
// ============================================

async function checkBackendHealth() {
    const isHealthy = await apiService.checkHealth();

    if (isHealthy) {
        console.log('✓ Backend conectado correctamente');
        showBackendStatus(true);
    } else {
        console.warn('✗ Backend no disponible');
        showBackendStatus(false);
        analyzer.showError('Backend no disponible. Verifica que esté ejecutándose en ' + CONFIG.API_BASE_URL);
    }
}

function showBackendStatus(isConnected) {
    const header = document.querySelector('.header');
    if (!header) return;

    const statusIndicator = document.createElement('div');
    statusIndicator.style.cssText = `
    display: inline-block;
    width: 10px;
    height: 10px;
    border-radius: 50%;
    background: ${isConnected ? '#10b981' : '#ef4444'};
    margin-left: 1rem;
    box-shadow: 0 0 10px ${isConnected ? '#10b981' : '#ef4444'};
    animation: pulse 2s ease-in-out infinite;
  `;

    const title = header.querySelector('h1');
    if (title) {
        title.appendChild(statusIndicator);
    }
}

// ============================================
// CONFIGURACIÓN DE EVENT LISTENERS
// ============================================

function setupEventListeners() {
    // Botón de análisis
    const analyzeBtn = document.getElementById('analyze-btn');
    if (analyzeBtn) {
        analyzeBtn.addEventListener('click', handleAnalyze);
    }

    // Botón de limpiar
    const clearBtn = document.getElementById('clear-btn');
    if (clearBtn) {
        clearBtn.addEventListener('click', handleClear);
    }

    // Botón de cargar ejemplo
    const loadExampleBtn = document.getElementById('load-example');
    if (loadExampleBtn) {
        loadExampleBtn.addEventListener('click', handleLoadExample);
    }

    // Selector de tipo de código
    const codeTypeSelect = document.getElementById('code-type');
    if (codeTypeSelect) {
        codeTypeSelect.addEventListener('change', handleCodeTypeChange);
    }

    // Atajo de teclado: Ctrl/Cmd + Enter para analizar
    document.addEventListener('keydown', (e) => {
        if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
            e.preventDefault();
            handleAnalyze();
        }
    });

    // Atajo de teclado: Ctrl/Cmd + K para limpiar
    document.addEventListener('keydown', (e) => {
        if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
            e.preventDefault();
            handleClear();
        }
    });
}

// ============================================
// CONFIGURACIÓN DEL EDITOR
// ============================================

function setupEditor() {
    const codeInput = document.getElementById('code-input');
    if (!codeInput) return;

    // Contador de líneas y caracteres
    const editorInfo = document.createElement('div');
    editorInfo.className = 'editor-info';
    editorInfo.innerHTML = `
    <span>Líneas: <strong id="line-count">0</strong></span>
    <span>Caracteres: <strong id="char-count">0</strong></span>
  `;

    const editorSection = document.querySelector('.editor-section');
    if (editorSection) {
        editorSection.appendChild(editorInfo);
    }

    // Actualizar contador al escribir
    codeInput.addEventListener('input', () => {
        updateEditorStats(codeInput.value);
    });

    // Tab para indentación
    codeInput.addEventListener('keydown', (e) => {
        if (e.key === 'Tab') {
            e.preventDefault();
            const start = codeInput.selectionStart;
            const end = codeInput.selectionEnd;
            const value = codeInput.value;

            codeInput.value = value.substring(0, start) + '    ' + value.substring(end);
            codeInput.selectionStart = codeInput.selectionEnd = start + 4;
        }
    });

    // Placeholder dinámico
    updatePlaceholder(codeInput);
}

function updateEditorStats(code) {
    const stats = analyzer.getCodeStats(code);

    const lineCount = document.getElementById('line-count');
    const charCount = document.getElementById('char-count');

    if (lineCount) lineCount.textContent = stats.lines;
    if (charCount) charCount.textContent = stats.characters;
}

function updatePlaceholder(input) {
    const examples = [
        'function busquedaBinaria(arr, x)\n    izquierda = 0\n    derecha = n - 1\n    ...',
        'PARA i DESDE 0 HASTA n-1 HACER\n    ESCRIBIR i\nFIN PARA',
        'function mergeSort(arr, inicio, fin)\n    if inicio < fin then\n    ...'
    ];

    const randomExample = examples[Math.floor(Math.random() * examples.length)];
    input.placeholder = `Ingresa tu pseudocódigo aquí...\n\nEjemplo:\n${randomExample}`;
}

// ============================================
// HANDLERS DE EVENTOS
// ============================================

async function handleAnalyze() {
    const codeInput = document.getElementById('code-input');
    const codeTypeSelect = document.getElementById('code-type');

    if (!codeInput) return;

    const code = codeInput.value;
    const codeType = codeTypeSelect ? codeTypeSelect.value : 'pseudocode';

    // Validar código
    const validation = analyzer.validateCode(code);
    if (!validation.valid) {
        analyzer.showError(validation.message);
        return;
    }

    // Analizar
    const result = await analyzer.analyze(code, codeType);

    if (result) {
        console.log('Análisis completado:', result);
    }
}

function handleClear() {
    const codeInput = document.getElementById('code-input');
    if (codeInput) {
        // Animación de limpieza
        codeInput.style.transition = 'opacity 0.3s ease';
        codeInput.style.opacity = '0.5';

        setTimeout(() => {
            codeInput.value = '';
            codeInput.style.opacity = '1';
            updateEditorStats('');
            analyzer.clear();
            analyzer.showSuccess('Editor limpiado');
        }, 300);
    }
}

function handleLoadExample() {
    // Crear modal para seleccionar ejemplo
    showExampleModal();
}

function handleCodeTypeChange(e) {
    const codeType = e.target.value;
    console.log('Tipo de código cambiado a:', codeType);

    const codeInput = document.getElementById('code-input');
    if (codeInput && codeInput.value === '') {
        updatePlaceholder(codeInput);
    }
}

// ============================================
// MODAL DE EJEMPLOS
// ============================================

function showExampleModal() {
    // Crear overlay
    const overlay = document.createElement('div');
    overlay.className = 'modal-overlay fade-in';
    overlay.style.cssText = `
    position: fixed;
    top: 0;
    left: 0;
    width: 100vw;
    height: 100vh;
    background: rgba(0, 0, 0, 0.8);
    z-index: 999;
    display: flex;
    justify-content: center;
    align-items: center;
    backdrop-filter: blur(5px);
  `;

    // Crear modal
    const modal = document.createElement('div');
    modal.className = 'example-modal scale-in';
    modal.style.cssText = `
    background: var(--bg-card);
    border: 2px solid var(--primary-green);
    border-radius: 12px;
    padding: 2rem;
    max-width: 600px;
    width: 90%;
    max-height: 80vh;
    overflow-y: auto;
    box-shadow: 0 0 40px rgba(16, 185, 129, 0.5);
  `;

    // Título
    const title = document.createElement('h2');
    title.textContent = 'Selecciona un Ejemplo';
    title.style.cssText = `
    font-family: var(--font-retro);
    color: var(--primary-green);
    margin-bottom: 1.5rem;
    font-size: 1.2rem;
  `;
    modal.appendChild(title);

    // Lista de ejemplos
    const examplesList = getExamplesList();

    examplesList.forEach((example, index) => {
        const exampleItem = document.createElement('div');
        exampleItem.className = 'example-item hover-lift';
        exampleItem.style.cssText = `
      background: var(--bg-dark);
      padding: 1rem;
      border-radius: 8px;
      border-left: 3px solid var(--primary-green);
      margin-bottom: 1rem;
      cursor: pointer;
      transition: all 0.3s ease;
      animation: fadeInUp 0.3s ease;
      animation-delay: ${index * 0.05}s;
      animation-fill-mode: both;
    `;

        exampleItem.innerHTML = `
      <div style="color: var(--primary-green); font-weight: 600; margin-bottom: 0.3rem;">
        ${example.name}
      </div>
      <div style="color: var(--text-secondary); font-size: 0.9rem;">
        ${example.description}
      </div>
    `;

        exampleItem.addEventListener('click', () => {
            loadExampleCode(example.id);
            closeModal(overlay);
        });

        exampleItem.addEventListener('mouseenter', () => {
            exampleItem.style.background = 'rgba(16, 185, 129, 0.1)';
            exampleItem.style.transform = 'translateX(10px)';
        });

        exampleItem.addEventListener('mouseleave', () => {
            exampleItem.style.background = 'var(--bg-dark)';
            exampleItem.style.transform = 'translateX(0)';
        });

        modal.appendChild(exampleItem);
    });

    // Botón cerrar
    const closeBtn = document.createElement('button');
    closeBtn.textContent = 'Cancelar';
    closeBtn.style.cssText = `
    width: 100%;
    margin-top: 1rem;
    padding: 0.8rem;
    background: transparent;
    border: 2px solid var(--primary-green);
    color: var(--primary-green);
    border-radius: 6px;
    cursor: pointer;
    font-weight: 600;
    transition: all 0.3s ease;
  `;

    closeBtn.addEventListener('click', () => closeModal(overlay));
    modal.appendChild(closeBtn);

    overlay.appendChild(modal);
    document.body.appendChild(overlay);

    // Cerrar al hacer click fuera del modal
    overlay.addEventListener('click', (e) => {
        if (e.target === overlay) {
            closeModal(overlay);
        }
    });
}

function closeModal(overlay) {
    overlay.style.animation = 'fadeOut 0.3s ease';
    setTimeout(() => {
        document.body.removeChild(overlay);
    }, 300);
}

function loadExampleCode(exampleId) {
    const example = getExample(exampleId);
    if (!example) return;

    // Obtener tipo de código seleccionado
    const codeTypeSelect = document.getElementById('code-type');
    const codeType = codeTypeSelect ? codeTypeSelect.value : 'pseudocode';
    
    // Obtener código del tipo seleccionado
    const code = getExampleCode(exampleId, codeType);
    if (!code) return;

    const codeInput = document.getElementById('code-input');
    if (codeInput) {
        codeInput.value = code;
        updateEditorStats(code);
        analyzer.showSuccess(`Ejemplo cargado: ${example.name} (${codeType})`);

        // Scroll al editor
        codeInput.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
}

// ============================================
// FUNCIONES AUXILIARES
// ============================================

function loadInitialExample() {
    // Cargar ejemplo de búsqueda binaria por defecto
    const binarySearch = getExample('binary_search');
    if (binarySearch) {
        const codeInput = document.getElementById('code-input');
        if (codeInput) {
            // Usar pseudocode por defecto
            const code = getExampleCode('binary_search', 'pseudocode');
            codeInput.value = code;
            updateEditorStats(code);
        }
    }
}

// ============================================
// ANIMACIÓN DE FONDO (opcional)
// ============================================

function addBackgroundAnimation() {
    const scanline = document.createElement('div');
    scanline.className = 'scanline';
    document.body.appendChild(scanline);
}

// Activar animación de fondo (opcional)
// addBackgroundAnimation();

console.log('Frontend inicializado - Versión 1.0.0');
