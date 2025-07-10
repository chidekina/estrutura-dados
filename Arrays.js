// Bubble Sort
// Bubble sort é um algoritmo de ordenação simples e bastante conhecido na ciência da computação. Ele funciona percorrendo repetidamente uma lista de elementos, comparando pares de elementos adjacentes e trocando-os de posição caso estejam na ordem errada. Esse processo é repetido até que não sejam necessárias mais trocas, indicando que a lista está ordenada

// A notação Big O do bubble sort é:

// Pior caso: 
// O (n ** 2)

// Caso médio: 
// O (n ** 2)

// Melhor caso: 
// O(n)

// O(n), quando a lista já está ordenada e o algoritmo é otimizado para interromper se não houver trocas


// Ordene um array em ordem crescente (sort)

const bubbleSort = (array) => {
    for (let i = 0; i < array.length; i++) {
        for (let j = 0; j < array.length - 1; i++) {
            if (array[j] > array[j + 1]) {
                const temp = array[j];

                array[j] = array[j + 1];
                array[j + 1] = temp;
            };
        };
    };
};
