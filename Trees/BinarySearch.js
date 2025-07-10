// Busca Binária (Binary Search)

// A busca binária é um algoritmo eficiente para encontrar um elemento em um array ordenado.
// Funciona dividindo repetidamente o espaço de busca pela metade, comparando o elemento
// do meio com o valor procurado.

// Pré-requisito: O array DEVE estar ordenado
// Complexidade: O(log n) - muito mais eficiente que busca linear O(n)
// Espaço: O(1) - iterativa, O(log n) - recursiva

// IMPLEMENTAÇÃO ITERATIVA
function binarySearchIterative(arr, target) {
    let left = 0;
    let right = arr.length - 1;

    while (left <= right) {
        const mid = Math.floor((left + right) / 2);

        console.log(`🔍 Buscando ${target}: intervalo [${left}, ${right}], meio = ${mid}, valor = ${arr[mid]}`);

        if (arr[mid] === target) {
            console.log(`✅ Encontrado! ${target} está no índice ${mid}`);
            return mid;
        }

        if (arr[mid] < target) {
            left = mid + 1;
            console.log(`   ${arr[mid]} < ${target}, buscar na metade direita`);
        } else {
            right = mid - 1;
            console.log(`   ${arr[mid]} > ${target}, buscar na metade esquerda`);
        }
    }

    console.log(`❌ ${target} não encontrado no array`);
    return -1;
}

// IMPLEMENTAÇÃO RECURSIVA
function binarySearchRecursive(arr, target, left = 0, right = arr.length - 1) {
    if (left > right) {
        console.log(`❌ ${target} não encontrado no array`);
        return -1;
    }

    const mid = Math.floor((left + right) / 2);
    console.log(`🔍 Buscando ${target}: intervalo [${left}, ${right}], meio = ${mid}, valor = ${arr[mid]}`);

    if (arr[mid] === target) {
        console.log(`✅ Encontrado! ${target} está no índice ${mid}`);
        return mid;
    }

    if (arr[mid] < target) {
        console.log(`   ${arr[mid]} < ${target}, buscar na metade direita`);
        return binarySearchRecursive(arr, target, mid + 1, right);
    } else {
        console.log(`   ${arr[mid]} > ${target}, buscar na metade esquerda`);
        return binarySearchRecursive(arr, target, left, mid - 1);
    }
}

// BUSCA DO PRIMEIRO ELEMENTO (para elementos duplicados)
function findFirst(arr, target) {
    let left = 0;
    let right = arr.length - 1;
    let result = -1;

    while (left <= right) {
        const mid = Math.floor((left + right) / 2);

        if (arr[mid] === target) {
            result = mid;
            right = mid - 1; // Continue buscando à esquerda
        } else if (arr[mid] < target) {
            left = mid + 1;
        } else {
            right = mid - 1;
        }
    }

    return result;
}

// BUSCA DO ÚLTIMO ELEMENTO (para elementos duplicados)
function findLast(arr, target) {
    let left = 0;
    let right = arr.length - 1;
    let result = -1;

    while (left <= right) {
        const mid = Math.floor((left + right) / 2);

        if (arr[mid] === target) {
            result = mid;
            left = mid + 1; // Continue buscando à direita
        } else if (arr[mid] < target) {
            left = mid + 1;
        } else {
            right = mid - 1;
        }
    }

    return result;
}

// BUSCA POR INSERÇÃO (onde inserir elemento para manter ordem)
function searchInsertPosition(arr, target) {
    let left = 0;
    let right = arr.length - 1;

    while (left <= right) {
        const mid = Math.floor((left + right) / 2);

        if (arr[mid] < target) {
            left = mid + 1;
        } else {
            right = mid - 1;
        }
    }

    return left;
}

// DEMONSTRAÇÃO E TESTES
console.log("🔍 TESTANDO ALGORITMOS DE BUSCA BINÁRIA");
console.log("=".repeat(60));

const arrayOrdenado = [1, 3, 5, 7, 9, 11, 13, 15, 17, 19, 21, 23, 25];
console.log(`Array ordenado: [${arrayOrdenado.join(', ')}]`);

console.log("\n📍 TESTE 1: Busca Binária Iterativa");
console.log("-".repeat(40));
binarySearchIterative(arrayOrdenado, 13);

console.log("\n📍 TESTE 2: Busca Binária Recursiva");
console.log("-".repeat(40));
binarySearchRecursive(arrayOrdenado, 7);

console.log("\n📍 TESTE 3: Elemento não encontrado");
console.log("-".repeat(40));
binarySearchIterative(arrayOrdenado, 10);

console.log("\n📍 TESTE 4: Array com duplicatas");
console.log("-".repeat(40));
const arrayComDuplicatas = [1, 2, 2, 2, 3, 4, 4, 5, 5, 5, 5, 6];
console.log(`Array com duplicatas: [${arrayComDuplicatas.join(', ')}]`);

console.log("\nBuscando primeira ocorrência de 5:");
const primeiro = findFirst(arrayComDuplicatas, 5);
console.log(`Primeira ocorrência de 5: índice ${primeiro}`);

console.log("\nBuscando última ocorrência de 5:");
const ultimo = findLast(arrayComDuplicatas, 5);
console.log(`Última ocorrência de 5: índice ${ultimo}`);

console.log("\n📍 TESTE 5: Posição de inserção");
console.log("-".repeat(40));
const valoresParaInserir = [0, 2, 4, 6, 8, 26];

valoresParaInserir.forEach(valor => {
    const posicao = searchInsertPosition(arrayOrdenado, valor);
    console.log(`Para inserir ${valor}: posição ${posicao}`);
});

console.log("\n📍 TESTE 6: Comparação de Performance");
console.log("-".repeat(40));

// Array grande para testar performance
const arrayGrande = Array.from({ length: 1000000 }, (_, i) => i * 2);

function medirTempo(nome, funcao) {
    const inicio = performance.now();
    const resultado = funcao();
    const fim = performance.now();
    console.log(`${nome}: ${(fim - inicio).toFixed(4)}ms, resultado: ${resultado}`);
}

const target = 500000;

console.log(`Buscando ${target} em array de 1 milhão de elementos:`);

medirTempo("Busca Linear   ", () => {
    for (let i = 0; i < arrayGrande.length; i++) {
        if (arrayGrande[i] === target) return i;
    }
    return -1;
});

medirTempo("Busca Binária  ", () => {
    return binarySearchIterativeOptimized(arrayGrande, target);
});

// Versão otimizada sem logs para medição
function binarySearchIterativeOptimized(arr, target) {
    let left = 0;
    let right = arr.length - 1;

    while (left <= right) {
        const mid = Math.floor((left + right) / 2);

        if (arr[mid] === target) return mid;

        if (arr[mid] < target) {
            left = mid + 1;
        } else {
            right = mid - 1;
        }
    }

    return -1;
}

console.log("\n📊 ANÁLISE DE COMPLEXIDADE:");
console.log("-".repeat(40));
console.log("Busca Linear:   O(n) - no pior caso, verifica todos elementos");
console.log("Busca Binária:  O(log n) - divide o problema pela metade a cada passo");
console.log(`Para array de ${arrayGrande.length.toLocaleString()} elementos:`);
console.log(`- Busca Linear:  até ${arrayGrande.length.toLocaleString()} comparações`);
console.log(`- Busca Binária: até ${Math.ceil(Math.log2(arrayGrande.length))} comparações`);

console.log("\n✅ TODOS OS TESTES DE BUSCA BINÁRIA CONCLUÍDOS!");
console.log("🚀 Algoritmo fundamental para busca eficiente em dados ordenados!");
console.log("=".repeat(60));