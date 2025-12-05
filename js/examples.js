const ALGORITHM_EXAMPLES = {
    binary_search: {
        name: "Búsqueda Binaria",
        description: "Algoritmo logarítmico O(log n)",
        pseudocode: `function busquedaBinaria(arr, x)
    izquierda = 0
    derecha = n - 1
    
    while izquierda <= derecha do
        medio = (izquierda + derecha) / 2
        
        if arr[medio] == x then
            return medio
        end
        
        if arr[medio] < x then
            izquierda = medio + 1
        else
            derecha = medio - 1
        end
    end
    
    return -1
end`,
        python: `def busqueda_binaria(arr, x):
    izquierda = 0
    derecha = len(arr) - 1
    
    while izquierda <= derecha:
        medio = (izquierda + derecha) // 2
        
        if arr[medio] == x:
            return medio
        
        if arr[medio] < x:
            izquierda = medio + 1
        else:
            derecha = medio - 1
    
    return -1`
    },

    merge_sort: {
        name: "Merge Sort",
        description: "Divide y conquista O(n log n)",
        pseudocode: `function mergeSort(arr, inicio, fin)
    if inicio < fin then
        medio = (inicio + fin) / 2
        mergeSort(arr, inicio, medio)
        mergeSort(arr, medio + 1, fin)
        merge(arr, inicio, medio, fin)
    end
end

function merge(arr, inicio, medio, fin)
    n1 = medio - inicio + 1
    n2 = fin - medio
    
    for i = 0 to n1 do
        L[i] = arr[inicio + i]
    end
    
    for j = 0 to n2 do
        R[j] = arr[medio + 1 + j]
    end
    
    i = 0
    j = 0
    k = inicio
    
    while i < n1 and j < n2 do
        if L[i] <= R[j] then
            arr[k] = L[i]
            i = i + 1
        else
            arr[k] = R[j]
            j = j + 1
        end
        k = k + 1
    end
    
    while i < n1 do
        arr[k] = L[i]
        i = i + 1
        k = k + 1
    end
    
    while j < n2 do
        arr[k] = R[j]
        j = j + 1
        k = k + 1
    end
end`,
        python: `def merge_sort(arr):
    if len(arr) <= 1:
        return arr
    
    medio = len(arr) // 2
    izquierda = merge_sort(arr[:medio])
    derecha = merge_sort(arr[medio:])
    
    return merge(izquierda, derecha)

def merge(izq, der):
    resultado = []
    i = j = 0
    
    while i < len(izq) and j < len(der):
        if izq[i] <= der[j]:
            resultado.append(izq[i])
            i += 1
        else:
            resultado.append(der[j])
            j += 1
    
    resultado.extend(izq[i:])
    resultado.extend(der[j:])
    return resultado`
    },

    factorial: {
        name: "Factorial Recursivo",
        description: "Recursión lineal O(n)",
        pseudocode: `function factorial(n)
    if n <= 1 then
        return 1
    end
    return n * factorial(n - 1)
end`,
        python: `def factorial(n):
    if n <= 1:
        return 1
    return n * factorial(n - 1)`
    },

    fibonacci: {
        name: "Fibonacci Recursivo",
        description: "Recursión exponencial O(2^n)",
        pseudocode: `function fibonacci(n)
    if n <= 1 then
        return n
    end
    return fibonacci(n-1) + fibonacci(n-2)
end`,
        python: `def fibonacci(n):
    if n <= 1:
        return n
    return fibonacci(n - 1) + fibonacci(n - 2)`
    },

    nested_for: {
        name: "Loops Anidados",
        description: "Algoritmo cuadrático O(n²)",
        pseudocode: `for i = 0 to n-1 do
    for j = 0 to n-1 do
        if matriz[i][j] > 0 then
            suma = suma + matriz[i][j]
        end
    end
end`,
        python: `for i in range(n):
    for j in range(n):
        if matriz[i][j] > 0:
            suma = suma + matriz[i][j]`
    },

    for_simple: {
        name: "Búsqueda Lineal",
        description: "Algoritmo lineal O(n)",
        pseudocode: `for i = 0 to n-1 do
    if arr[i] == x then
        return i
    end
end
return -1`,
        python: `for i in range(len(arr)):
    if arr[i] == x:
        return i
return -1`
    },

    triple_for: {
        name: "Triple Bucle",
        description: "Algoritmo cúbico O(n³)",
        pseudocode: `for i = 0 to n-1 do
    for j = 0 to n-1 do
        for k = 0 to n-1 do
            if matriz[i][j][k] > 0 then
                suma = suma + matriz[i][j][k]
            end
        end
    end
end`,
        python: `for i in range(n):
    for j in range(n):
        for k in range(n):
            if matriz[i][j][k] > 0:
                suma = suma + matriz[i][j][k]`
    },

    while_n: {
        name: "While Logarítmico",
        description: "Algoritmo logarítmico O(log n)",
        pseudocode: `count = 0
while n > 0 do
    n = n / 2
    count = count + 1
end
return count`,
        python: `count = 0
while n > 0:
    n = n // 2
    count = count + 1
return count`
    },

    log_while: {
        name: "Logarithmic While",
        description: "Algoritmo logarítmico O(log n)",
        pseudocode: `i = 1
while i < n do
    i = i * 2
end`,
        python: `i = 1
while i < n:
    i = i * 2`
    },

    constant: {
        name: "Operación Constante",
        description: "Algoritmo constante O(1)",
        pseudocode: `x = 5
y = 10
z = x + y
return z`,
        python: `x = 5
y = 10
z = x + y
return z`
    },

    quick_sort: {
        name: "Quick Sort",
        description: "Divide y conquista O(n log n) promedio",
        pseudocode: `function quickSort(arr, low, high)
    if low < high then
        pi = partition(arr, low, high)
        quickSort(arr, low, pi - 1)
        quickSort(arr, pi + 1, high)
    end
end`,
        python: `def quick_sort(arr, low, high):
    if low < high:
        pi = partition(arr, low, high)
        quick_sort(arr, low, pi - 1)
        quick_sort(arr, pi + 1, high)

def partition(arr, low, high):
    pivot = arr[high]
    i = low - 1
    
    for j in range(low, high):
        if arr[j] < pivot:
            i += 1
            arr[i], arr[j] = arr[j], arr[i]
    
    arr[i + 1], arr[high] = arr[high], arr[i + 1]
    return i + 1`
    },

    linear_early_return: {
        name: "Búsqueda con Retorno Temprano",
        description: "Búsqueda lineal con salida rápida O(n)",
        pseudocode: `for i = 0 to n-1 do
    if arr[i] == target then
        return i
    end
    if arr[i] > threshold then
        return -1
    end
end`,
        python: `for i in range(len(arr)):
    if arr[i] == target:
        return i
    if arr[i] > threshold:
        return -1`
    }
};

// Función para obtener ejemplo por nombre
function getExample(exampleName) {
    return ALGORITHM_EXAMPLES[exampleName] || null;
}

// Función para obtener código del ejemplo según tipo
function getExampleCode(exampleName, codeType = 'pseudocode') {
    const example = getExample(exampleName);
    if (!example) return null;
    
    if (codeType === 'python' && example.python) {
        return example.python;
    } else if (codeType === 'pseudocode' && example.pseudocode) {
        return example.pseudocode;
    }
    
    // Fallback a pseudocode si no existe python
    return example.pseudocode || example.code || null;
}

// Función para obtener lista de ejemplos
function getExamplesList() {
    return Object.keys(ALGORITHM_EXAMPLES).map(key => ({
        id: key,
        name: ALGORITHM_EXAMPLES[key].name,
        description: ALGORITHM_EXAMPLES[key].description
    }));
}

// Función para cargar ejemplo aleatorio
function getRandomExample() {
    const keys = Object.keys(ALGORITHM_EXAMPLES);
    const randomKey = keys[Math.floor(Math.random() * keys.length)];
    return ALGORITHM_EXAMPLES[randomKey];
}