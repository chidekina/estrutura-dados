// Heap (Min-Heap e Max-Heap)

// Um Heap é uma árvore binária completa especializada que mantém a propriedade heap:
// - Min-Heap: o pai é sempre menor que os filhos
// - Max-Heap: o pai é sempre maior que os filhos
// É fundamental para filas de prioridade e algoritmo heapsort.

// Características principais:
// - Árvore binária completa (preenchida da esquerda para direita)
// - Inserção e remoção em O(log n)
// - Acesso ao mínimo/máximo em O(1)
// - Implementada eficientemente como array

// Índices em array:
// - Pai do índice i: Math.floor((i-1)/2)
// - Filho esquerdo de i: 2*i + 1
// - Filho direito de i: 2*i + 2

class MinHeap {
    constructor() {
        this.heap = [];
    }

    // Obter índice do pai
    getParentIndex(index) {
        return Math.floor((index - 1) / 2);
    }

    // Obter índice do filho esquerdo
    getLeftChildIndex(index) {
        return 2 * index + 1;
    }

    // Obter índice do filho direito
    getRightChildIndex(index) {
        return 2 * index + 2;
    }

    // Verificar se tem pai
    hasParent(index) {
        return this.getParentIndex(index) >= 0;
    }

    // Verificar se tem filho esquerdo
    hasLeftChild(index) {
        return this.getLeftChildIndex(index) < this.heap.length;
    }

    // Verificar se tem filho direito
    hasRightChild(index) {
        return this.getRightChildIndex(index) < this.heap.length;
    }

    // Obter valor do pai
    parent(index) {
        return this.heap[this.getParentIndex(index)];
    }

    // Obter valor do filho esquerdo
    leftChild(index) {
        return this.heap[this.getLeftChildIndex(index)];
    }

    // Obter valor do filho direito
    rightChild(index) {
        return this.heap[this.getRightChildIndex(index)];
    }

    // Trocar elementos
    swap(index1, index2) {
        [this.heap[index1], this.heap[index2]] = [this.heap[index2], this.heap[index1]];
    }

    // Obter o mínimo (raiz)
    peek() {
        if (this.heap.length === 0) return null;
        return this.heap[0];
    }

    // Remover e retornar o mínimo
    poll() {
        if (this.heap.length === 0) return null;

        const item = this.heap[0];
        this.heap[0] = this.heap[this.heap.length - 1];
        this.heap.pop();
        this.heapifyDown();
        return item;
    }

    // Adicionar elemento
    add(item) {
        this.heap.push(item);
        this.heapifyUp();
    }

    // Reorganizar para cima (após inserção)
    heapifyUp() {
        let index = this.heap.length - 1;

        while (this.hasParent(index) && this.parent(index) > this.heap[index]) {
            this.swap(this.getParentIndex(index), index);
            index = this.getParentIndex(index);
        }
    }

    // Reorganizar para baixo (após remoção)
    heapifyDown() {
        let index = 0;

        while (this.hasLeftChild(index)) {
            let smallerChildIndex = this.getLeftChildIndex(index);

            if (this.hasRightChild(index) &&
                this.rightChild(index) < this.leftChild(index)) {
                smallerChildIndex = this.getRightChildIndex(index);
            }

            if (this.heap[index] < this.heap[smallerChildIndex]) {
                break;
            } else {
                this.swap(index, smallerChildIndex);
            }

            index = smallerChildIndex;
        }
    }

    // Verificar se está vazio
    isEmpty() {
        return this.heap.length === 0;
    }

    // Obter tamanho
    size() {
        return this.heap.length;
    }

    // Limpar heap
    clear() {
        this.heap = [];
    }

    // Converter para array ordenado (heapsort)
    toSortedArray() {
        const result = [];
        const tempHeap = [...this.heap]; // Cópia para não modificar original

        while (!this.isEmpty()) {
            result.push(this.poll());
        }

        this.heap = tempHeap; // Restaurar heap original
        return result;
    }

    // Imprimir heap
    print() {
        console.log(`MinHeap: [${this.heap.join(', ')}]`);
        console.log(`Tamanho: ${this.size()}, Mínimo: ${this.peek()}`);
    }

    // Visualizar como árvore
    printAsTree() {
        if (this.isEmpty()) {
            console.log("Heap vazio");
            return;
        }

        console.log("\n🌳 Visualização da árvore:");
        this.printLevel(0, 0);
    }

    printLevel(index, level) {
        if (index >= this.heap.length) return;

        // Imprimir filho direito
        if (this.hasRightChild(index)) {
            this.printLevel(this.getRightChildIndex(index), level + 1);
        }

        // Imprimir nó atual
        console.log("  ".repeat(level) + "└── " + this.heap[index]);

        // Imprimir filho esquerdo
        if (this.hasLeftChild(index)) {
            this.printLevel(this.getLeftChildIndex(index), level + 1);
        }
    }
}

class MaxHeap extends MinHeap {
    // Reorganizar para cima (lógica invertida)
    heapifyUp() {
        let index = this.heap.length - 1;

        while (this.hasParent(index) && this.parent(index) < this.heap[index]) {
            this.swap(this.getParentIndex(index), index);
            index = this.getParentIndex(index);
        }
    }

    // Reorganizar para baixo (lógica invertida)
    heapifyDown() {
        let index = 0;

        while (this.hasLeftChild(index)) {
            let largerChildIndex = this.getLeftChildIndex(index);

            if (this.hasRightChild(index) &&
                this.rightChild(index) > this.leftChild(index)) {
                largerChildIndex = this.getRightChildIndex(index);
            }

            if (this.heap[index] > this.heap[largerChildIndex]) {
                break;
            } else {
                this.swap(index, largerChildIndex);
            }

            index = largerChildIndex;
        }
    }

    print() {
        console.log(`MaxHeap: [${this.heap.join(', ')}]`);
        console.log(`Tamanho: ${this.size()}, Máximo: ${this.peek()}`);
    }
}

// FILA DE PRIORIDADE usando Heap
class PriorityQueue {
    constructor(compareFn) {
        this.heap = [];
        this.compare = compareFn || ((a, b) => a.priority - b.priority);
    }

    enqueue(element, priority) {
        const node = { element, priority };
        this.heap.push(node);
        this.heapifyUp();
    }

    dequeue() {
        if (this.heap.length === 0) return null;

        const item = this.heap[0];
        this.heap[0] = this.heap[this.heap.length - 1];
        this.heap.pop();
        this.heapifyDown();
        return item.element;
    }

    heapifyUp() {
        let index = this.heap.length - 1;

        while (index > 0) {
            const parentIndex = Math.floor((index - 1) / 2);

            if (this.compare(this.heap[index], this.heap[parentIndex]) >= 0) break;

            [this.heap[index], this.heap[parentIndex]] = [this.heap[parentIndex], this.heap[index]];
            index = parentIndex;
        }
    }

    heapifyDown() {
        let index = 0;

        while (2 * index + 1 < this.heap.length) {
            const leftChildIndex = 2 * index + 1;
            const rightChildIndex = 2 * index + 2;
            let smallestIndex = leftChildIndex;

            if (rightChildIndex < this.heap.length &&
                this.compare(this.heap[rightChildIndex], this.heap[leftChildIndex]) < 0) {
                smallestIndex = rightChildIndex;
            }

            if (this.compare(this.heap[index], this.heap[smallestIndex]) <= 0) break;

            [this.heap[index], this.heap[smallestIndex]] = [this.heap[smallestIndex], this.heap[index]];
            index = smallestIndex;
        }
    }

    peek() {
        return this.heap.length > 0 ? this.heap[0].element : null;
    }

    isEmpty() {
        return this.heap.length === 0;
    }

    size() {
        return this.heap.length;
    }

    print() {
        console.log("Fila de Prioridade:");
        this.heap.forEach((node, index) => {
            console.log(`  [${index}] ${node.element} (prioridade: ${node.priority})`);
        });
    }
}

// HEAPSORT - Algoritmo de ordenação usando heap
function heapSort(arr) {
    const heap = new MaxHeap();

    // Adicionar todos os elementos ao heap
    arr.forEach(item => heap.add(item));

    const sorted = [];

    // Remover elementos em ordem decrescente
    while (!heap.isEmpty()) {
        sorted.unshift(heap.poll()); // Adicionar no início para ordem crescente
    }

    return sorted;
}

// DEMONSTRAÇÃO E TESTES
console.log("🔺 TESTANDO HEAPS COMPLETOS");
console.log("=".repeat(60));

// Teste 1: Min-Heap
console.log("\n📍 TESTE 1: Min-Heap");
const minHeap = new MinHeap();

const numeros = [4, 1, 3, 2, 16, 9, 10, 14, 8, 7];
console.log(`Inserindo: [${numeros.join(', ')}]`);

numeros.forEach(num => {
    minHeap.add(num);
    console.log(`Adicionado ${num}: ${minHeap.heap.join(' ')}`);
});

minHeap.print();
minHeap.printAsTree();

console.log("\n🔍 Removendo elementos:");
while (!minHeap.isEmpty()) {
    console.log(`Removido: ${minHeap.poll()}, Heap: [${minHeap.heap.join(', ')}]`);
}

// Teste 2: Max-Heap
console.log("\n📍 TESTE 2: Max-Heap");
const maxHeap = new MaxHeap();

numeros.forEach(num => maxHeap.add(num));
maxHeap.print();
maxHeap.printAsTree();

console.log("\n🔍 Removendo elementos:");
for (let i = 0; i < 3; i++) {
    console.log(`Removido: ${maxHeap.poll()}`);
    maxHeap.print();
}

// Teste 3: Fila de Prioridade
console.log("\n📍 TESTE 3: Fila de Prioridade (Hospital)");
const hospital = new PriorityQueue();

const pacientes = [
    { nome: "João", condicao: "Gripe", prioridade: 3 },
    { nome: "Maria", condicao: "Infarto", prioridade: 1 },
    { nome: "Pedro", condicao: "Dor de cabeça", prioridade: 5 },
    { nome: "Ana", condicao: "Acidente", prioridade: 1 },
    { nome: "Carlos", condicao: "Check-up", prioridade: 4 }
];

console.log("🏥 Chegada de pacientes:");
pacientes.forEach(p => {
    hospital.enqueue(p.nome, p.prioridade);
    console.log(`${p.nome} - ${p.condicao} (prioridade ${p.prioridade})`);
});

hospital.print();

console.log("\n👨‍⚕️ Atendimento por prioridade:");
while (!hospital.isEmpty()) {
    console.log(`Atendendo: ${hospital.dequeue()}`);
}

// Teste 4: HeapSort
console.log("\n📍 TESTE 4: HeapSort");
const arrayDesordenado = [64, 34, 25, 12, 22, 11, 90];
console.log(`Array original: [${arrayDesordenado.join(', ')}]`);

const arrayOrdenado = heapSort(arrayDesordenado);
console.log(`Array ordenado: [${arrayOrdenado.join(', ')}]`);

// Teste 5: Performance
console.log("\n📍 TESTE 5: Análise de Performance");

function testarPerformanceHeap() {
    const heap = new MinHeap();
    const n = 10000;

    // Inserção
    const inicioInsercao = performance.now();
    for (let i = 0; i < n; i++) {
        heap.add(Math.floor(Math.random() * 10000));
    }
    const fimInsercao = performance.now();

    // Remoção
    const inicioRemocao = performance.now();
    for (let i = 0; i < n / 2; i++) {
        heap.poll();
    }
    const fimRemocao = performance.now();

    console.log(`Heap (${n} elementos):`);
    console.log(`  Inserção: ${(fimInsercao - inicioInsercao).toFixed(2)}ms`);
    console.log(`  Remoção: ${(fimRemocao - inicioRemocao).toFixed(2)}ms`);
}

testarPerformanceHeap();

console.log("\n📊 Comparação com array ordenado:");
function testarArrayOrdenado() {
    const arr = [];
    const n = 10000;

    const inicio = performance.now();
    for (let i = 0; i < n; i++) {
        arr.push(Math.floor(Math.random() * 10000));
        arr.sort((a, b) => a - b); // Manter ordenado
    }
    const fim = performance.now();

    console.log(`Array ordenado (${n} elementos): ${(fim - inicio).toFixed(2)}ms`);
}

testarArrayOrdenado();

console.log("\n✅ TODOS OS TESTES DE HEAP CONCLUÍDOS!");
console.log("🚀 Estrutura fundamental para filas de prioridade e heapsort!");
console.log("=".repeat(60));
