// Lista ligada simples
// Uma lista ligada simples (ou lista encadeada simples) é uma estrutura de dados linear e dinâmica composta por uma sequência de elementos chamados nós. Cada nó contém dois campos principais:

// Valor: armazena o dado propriamente dito.

// Referência (ponteiro) para o próximo nó: indica onde está o próximo elemento da lista na memória.

// O último nó aponta para null (ou equivalente), indicando o fim da lista. Os nós podem estar espalhados em qualquer lugar da memória, pois o encadeamento é feito pelos ponteiros, não por posições contíguas.

// Lista Ligada Simples
// - Alocação de memória: Dinâmica (nós podem estar em qualquer lugar)
// - Crescimento: Fácil de expandir (basta criar novos nós)
// - Acesso a elementos: Sequencial (precisa percorrer a lista)
// - Inserção/Remoção: Rápida no início/fim, lenta no meio (precisa buscar)
// - Uso de memória: Mais eficiente para listas que mudam de tamanho

// Array
// - Alocação de memória: Estática ou dinâmica, mas contígua
// - Crescimento: Tamanho fixo (ou realocação custosa)
// - Acesso a elementos: Direto (índice)
// - Inserção/Remoção: Pode ser custosa (reorganiza elementos)
// - Uso de memória: Pode desperdiçar memória se pouco usada

class Node {
    constructor(value) {
        this.value = value;
        this.next = null;
        this.prev = null;
    };
};

new Node(10); // Exemplo com valor

class LinkedList {
    constructor() {
        this.head = null;
    };

    insertStart(value) {
        const newNode = new Node(value);
        newNode.next = this.head;
        this.head = newNode;
    };

    print() {
        let currentNode = this.head;
        let result = "";

        while (currentNode) {
            result += currentNode.value + " => ";
            currentNode = currentNode.next;
        };

        result += "null";
        console.log(result);
    };
};

// Lista ligada dupla
// Uma lista ligada dupla (ou lista duplamente ligada/encadeada) é uma estrutura de dados composta por uma sequência de elementos chamados nós. Cada nó armazena:

// Elemento (o dado em si)

// Ponteiro para o próximo nó (next)

// Ponteiro para o nó anterior (prev)

// Isso significa que cada nó conhece tanto o seu sucessor quanto o seu antecessor na lista, permitindo a navegação em ambas as direções.

// Estrutura de um elemento (nó) em uma lista ligada dupla

class DoubleLinkedList {
    constructor() {
        this.head = null;
        this.tail = null;
        this.length = 0;
    }

    insertStart(value) {
        const newNode = new Node(value);
        if (!this.head) {
            this.head = this.tail = newNode;
        } else {
            newNode.next = this.head;
            this.head.prev = newNode;
            this.head = newNode;
        }

        this.length++;
    }

    insertEnd(value) {
        const newNode = new Node(value);

        if (!this.head) {
            this.head = this.tail = newNode;
        } else {
            this.tail.next = newNode;
            newNode.prev = this.tail;
            this.tail = newNode;
        }

        this.length++;
    }

    insert(index, value) {
        if (index < 0 || index > this.length) throw new RangeError("Índice está fora dos limites.");
        if (index === 0) return this.insertStart(value);
        if (index === this.length) return this.insertEnd(value);

        let currentNode = this.head;

        for (let i = 0; i < index; i++) {
            currentNode = currentNode.next;
        }

        const newNode = new Node(value);
        const prevNode = currentNode.prev;

        prevNode.next = newNode;
        newNode.prev = prevNode;
        newNode.next = currentNode;
        currentNode.prev = newNode;

        this.length++;
    }

    remove(index) {
        if (index < 0 || index >= this.length) throw new RangeError("Índice está fora dos limites.");

        let removedNode;

        if (this.length === 1) {
            removedNode = this.head;
            this.head = this.tail = null;
        } else if (index === 0) {
            removedNode = this.head;
            this.head = this.head.next;
            this.head.prev = null;
        } else if (index === this.length - 1) {
            removedNode = this.tail;
            this.tail = this.tail.prev;
            this.tail.next = null;
        } else {
            let currentNode = this.head;

            for (let i = 0; i < index; i++) {
                currentNode = currentNode.next;
            }

            removedNode = currentNode;
            const { next, prev } = currentNode;
            prev.next = next;
            next.prev = prev;
        }

        this.length--;
        return removedNode.value; // Retorna o valor removido
    }

    // Busca um valor e retorna o índice (-1 se não encontrar)
    indexOf(value) {
        let currentNode = this.head;
        let index = 0;

        while (currentNode) {
            if (currentNode.value === value) {
                return index;
            }
            currentNode = currentNode.next;
            index++;
        }

        return -1;
    }

    // Retorna o valor no índice especificado
    get(index) {
        if (index < 0 || index >= this.length) throw new RangeError("Índice está fora dos limites.");

        let currentNode = this.head;
        for (let i = 0; i < index; i++) {
            currentNode = currentNode.next;
        }

        return currentNode.value;
    }

    // Verifica se a lista contém um valor
    contains(value) {
        return this.indexOf(value) !== -1;
    }

    // Limpa toda a lista
    clear() {
        this.head = null;
        this.tail = null;
        this.length = 0;
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

    print() {
        let result = "HEAD ⇄ ";
        let currentNode = this.head;

        while (currentNode) {
            result += currentNode.value + " ⇄ ";
            currentNode = currentNode.next;
        }

        result += "TAIL";
        console.log(result);
        console.log(`Length: ${this.length}`);
    }

    printReverse() {
        let result = "TAIL ⇄ ";
        let currentNode = this.tail;

        while (currentNode) {
            result += currentNode.value + " ⇄ ";
            currentNode = currentNode.prev;
        }

        result += "HEAD";
        console.log(result);
    }
};