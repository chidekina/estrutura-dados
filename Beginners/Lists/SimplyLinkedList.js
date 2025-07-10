// Lista Ligada Simples (Simply Linked List)

// Uma lista ligada simples é uma estrutura de dados linear e dinâmica composta por nós. 
// Cada nó contém dois campos: o valor (dado) e uma referência para o próximo nó.
// O último nó aponta para null, indicando o fim da lista.

// Características principais:
// - Alocação dinâmica de memória
// - Tamanho variável
// - Acesso sequencial aos elementos
// - Inserção/remoção eficiente no início
// - Não permite acesso direto por índice

// Complexidades:
// Busca: O(n)
// Inserção no início: O(1)
// Inserção no final: O(n) sem referência à cauda
// Remoção no início: O(1)
// Remoção no final: O(n)

class Node {
    constructor(value) {
        this.value = value;
        this.next = null;
    }
}

class SimplyLinkedList {
    constructor() {
        this.head = null;
        this.size = 0;
    }

    // Insere um elemento no início da lista
    insertStart(value) {
        const newNode = new Node(value);
        newNode.next = this.head;
        this.head = newNode;
        this.size++;
    }

    // Insere um elemento no final da lista
    insertEnd(value) {
        const newNode = new Node(value);

        if (!this.head) {
            this.head = newNode;
        } else {
            let currentNode = this.head;
            while (currentNode.next) {
                currentNode = currentNode.next;
            }
            currentNode.next = newNode;
        }
        this.size++;
    }

    // Insere um elemento em uma posição específica
    insertAt(index, value) {
        if (index < 0 || index > this.size) {
            throw new Error("Índice fora dos limites");
        }

        if (index === 0) {
            this.insertStart(value);
            return;
        }

        const newNode = new Node(value);
        let currentNode = this.head;

        for (let i = 0; i < index - 1; i++) {
            currentNode = currentNode.next;
        }

        newNode.next = currentNode.next;
        currentNode.next = newNode;
        this.size++;
    }

    // Remove o primeiro elemento
    removeStart() {
        if (!this.head) return null;

        const removedValue = this.head.value;
        this.head = this.head.next;
        this.size--;
        return removedValue;
    }

    // Remove o último elemento
    removeEnd() {
        if (!this.head) return null;

        if (!this.head.next) {
            const removedValue = this.head.value;
            this.head = null;
            this.size--;
            return removedValue;
        }

        let currentNode = this.head;
        while (currentNode.next.next) {
            currentNode = currentNode.next;
        }

        const removedValue = currentNode.next.value;
        currentNode.next = null;
        this.size--;
        return removedValue;
    }

    // Remove elemento em posição específica
    removeAt(index) {
        if (index < 0 || index >= this.size) {
            throw new Error("Índice fora dos limites");
        }

        if (index === 0) {
            return this.removeStart();
        }

        let currentNode = this.head;
        for (let i = 0; i < index - 1; i++) {
            currentNode = currentNode.next;
        }

        const removedValue = currentNode.next.value;
        currentNode.next = currentNode.next.next;
        this.size--;
        return removedValue;
    }

    // Busca um valor na lista
    find(value) {
        let currentNode = this.head;
        let index = 0;

        while (currentNode) {
            if (currentNode.value === value) {
                return index;
            }
            currentNode = currentNode.next;
            index++;
        }

        return -1; // Não encontrado
    }

    // Verifica se a lista contém um valor
    contains(value) {
        return this.find(value) !== -1;
    }

    // Obtém valor por índice
    get(index) {
        if (index < 0 || index >= this.size) {
            throw new Error("Índice fora dos limites");
        }

        let currentNode = this.head;
        for (let i = 0; i < index; i++) {
            currentNode = currentNode.next;
        }

        return currentNode.value;
    }

    // Verifica se a lista está vazia
    isEmpty() {
        return this.head === null;
    }

    // Retorna o tamanho da lista
    getSize() {
        return this.size;
    }

    // Limpa a lista
    clear() {
        this.head = null;
        this.size = 0;
    }

    // Converte para array
    toArray() {
        const result = [];
        let currentNode = this.head;

        while (currentNode) {
            result.push(currentNode.value);
            currentNode = currentNode.next;
        }

        return result;
    }

    // Imprime a lista
    print() {
        if (!this.head) {
            console.log("Lista vazia");
            return;
        }

        let result = "HEAD → ";
        let currentNode = this.head;

        while (currentNode) {
            result += currentNode.value + " → ";
            currentNode = currentNode.next;
        }

        result += "null";
        console.log(result);
        console.log(`Tamanho: ${this.size}`);
    }

    // Reverte a lista
    reverse() {
        let previous = null;
        let current = this.head;
        let next = null;

        while (current) {
            next = current.next;
            current.next = previous;
            previous = current;
            current = next;
        }

        this.head = previous;
    }
}

// DEMONSTRAÇÃO E TESTES
console.log("🔗 TESTANDO LISTA LIGADA SIMPLES");
console.log("=".repeat(50));

const list = new SimplyLinkedList();

console.log("\n📍 TESTE 1: Inserções no início");
list.insertStart(10);
list.insertStart(20);
list.insertStart(30);
list.print();

console.log("\n📍 TESTE 2: Inserções no final");
list.insertEnd(40);
list.insertEnd(50);
list.print();

console.log("\n📍 TESTE 3: Inserção em posição específica");
list.insertAt(2, 25); // Insere 25 na posição 2
list.print();

console.log("\n📍 TESTE 4: Buscas");
console.log(`Buscar 25: índice ${list.find(25)}`);
console.log(`Buscar 100: índice ${list.find(100)}`);
console.log(`Contém 20: ${list.contains(20)}`);
console.log(`Elemento no índice 3: ${list.get(3)}`);

console.log("\n📍 TESTE 5: Remoções");
console.log(`Removido do início: ${list.removeStart()}`);
list.print();

console.log(`Removido do final: ${list.removeEnd()}`);
list.print();

console.log(`Removido do índice 1: ${list.removeAt(1)}`);
list.print();

console.log("\n📍 TESTE 6: Operações utilitárias");
console.log(`Array: [${list.toArray().join(', ')}]`);
console.log(`Tamanho: ${list.getSize()}`);
console.log(`Está vazia: ${list.isEmpty()}`);

console.log("\n📍 TESTE 7: Reversão da lista");
console.log("Lista antes da reversão:");
list.print();
list.reverse();
console.log("Lista após reversão:");
list.print();

console.log("\n📍 TESTE 8: Limpeza da lista");
list.clear();
console.log("Após limpar:");
list.print();
console.log(`Está vazia: ${list.isEmpty()}`);

console.log("\n✅ TODOS OS TESTES CONCLUÍDOS!");
console.log("=".repeat(50));
