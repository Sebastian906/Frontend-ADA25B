const ALGORITHM_EXAMPLES = {
    binary_search: {
        name: "Búsqueda Binaria",
        description: "Algoritmo logarítmico O(log n)",
        code: `function busquedaBinaria(arr, x)
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
end`
    },

    merge_sort: {
        name: "Merge Sort",
        description: "Divide y conquista O(n log n)",
        code: `function mergeSort(arr, inicio, fin)
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
end`
    },

    factorial: {
        name: "Factorial Recursivo",
        description: "Recursión lineal O(n)",
        code: `function factorial(n)
    if n <= 1 then
        return 1
    end
    return n * factorial(n - 1)
end`
    },

    fibonacci: {
        name: "Fibonacci Recursivo",
        description: "Recursión exponencial O(2^n)",
        code: `function fibonacci(n)
    if n <= 1 then
        return n
    end
    return fibonacci(n-1) + fibonacci(n-2)
end`
    },

    bubble_sort: {
        name: "Bubble Sort",
        description: "Algoritmo cuadrático O(n²)",
        code: `function bubbleSort(arr, n)
    for i = 0 to n-1 do
        for j = 0 to n-i-2 do
            if arr[j] > arr[j+1] then
                temp = arr[j]
                arr[j] = arr[j+1]
                arr[j+1] = temp
            end
        end
    end
end`
    },

    linear_search: {
        name: "Búsqueda Lineal",
        description: "Algoritmo lineal O(n)",
        code: `function busquedaLineal(arr, n, x)
    for i = 0 to n-1 do
        if arr[i] == x then
            return i
        end
    end
    return -1
end`
    },

    matrix_sum: {
        name: "Suma de Matriz",
        description: "Loops anidados O(n²)",
        code: `PARA i DESDE 0 HASTA n-1 HACER
    PARA j DESDE 0 HASTA n-1 HACER
        SI matriz[i][j] > 0 ENTONCES
            suma = suma + matriz[i][j]
        FIN SI
    FIN PARA
FIN PARA`
    },

    quick_sort: {
        name: "Quick Sort",
        description: "Divide y conquista O(n log n) promedio",
        code: `function quickSort(arr, low, high)
    if low < high then
        pi = partition(arr, low, high)
        quickSort(arr, low, pi - 1)
        quickSort(arr, pi + 1, high)
    end
end

function partition(arr, low, high)
    pivot = arr[high]
    i = low - 1
    
    for j = low to high - 1 do
        if arr[j] < pivot then
            i = i + 1
            swap(arr[i], arr[j])
        end
    end
    
    swap(arr[i + 1], arr[high])
    return i + 1
end`
    },

    dijkstra: {
        name: "Dijkstra (Camino más corto)",
        description: "Algoritmo de grafos O(V² o E log V)",
        code: `function dijkstra(graph, src)
    dist[src] = 0
    visited[src] = false
    
    for i = 0 to V-1 do
        u = minDistance(dist, visited)
        visited[u] = true
        
        for v = 0 to V-1 do
            if not visited[v] and graph[u][v] != 0 then
                if dist[u] + graph[u][v] < dist[v] then
                    dist[v] = dist[u] + graph[u][v]
                end
            end
        end
    end
    
    return dist
end`
    },

    dynamic_programming: {
        name: "Programación Dinámica (Fibonacci)",
        description: "DP memoization O(n)",
        code: `function fibonacciDP(n)
    dp[0] = 0
    dp[1] = 1
    
    for i = 2 to n do
        dp[i] = dp[i-1] + dp[i-2]
    end
    
    return dp[n]
end`
    }
};

// Función para obtener ejemplo por nombre
function getExample(exampleName) {
    return ALGORITHM_EXAMPLES[exampleName] || null;
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