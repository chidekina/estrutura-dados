// 🎬 DEMONSTRAÇÃO INTERATIVA DE TODAS AS ESTRUTURAS DE DADOS
// =========================================================

console.log("🎬 DEMONSTRAÇÃO COMPLETA - ESTRUTURAS DE DADOS");
console.log("=".repeat(60));

// Simulação das principais estruturas (sem importar os arquivos)

// 1. STACK (Pilha)
console.log("\n📚 1. STACK (PILHA) - LIFO");
console.log("-".repeat(30));

class SimpleStack {
    constructor() { this.items = []; }
    push(item) { this.items.push(item); }
    pop() { return this.items.pop(); }
    peek() { return this.items[this.items.length - 1]; }
    isEmpty() { return this.items.length === 0; }
    size() { return this.items.length; }
    print() { console.log(`Stack: [${this.items.join(', ')}] ← topo`); }
}

const stack = new SimpleStack();
console.log("Operações: push(A), push(B), push(C)");
stack.push('A');
stack.push('B');
stack.push('C');
stack.print();

console.log(`pop() retorna: ${stack.pop()}`);
stack.print();
console.log(`peek() mostra o topo: ${stack.peek()}`);

// 2. QUEUE (Fila)
console.log("\n🚶 2. QUEUE (FILA) - FIFO");
console.log("-".repeat(30));

class SimpleQueue {
    constructor() { this.items = []; }
    enqueue(item) { this.items.push(item); }
    dequeue() { return this.items.shift(); }
    front() { return this.items[0]; }
    isEmpty() { return this.items.length === 0; }
    size() { return this.items.length; }
    print() { console.log(`Queue: [${this.items.join(', ')}] ← entrada`); }
}

const queue = new SimpleQueue();
console.log("Operações: enqueue(1), enqueue(2), enqueue(3)");
queue.enqueue(1);
queue.enqueue(2);
queue.enqueue(3);
queue.print();

console.log(`dequeue() retorna: ${queue.dequeue()}`);
queue.print();
console.log(`front() mostra o primeiro: ${queue.front()}`);

// 3. LINKED LIST (Lista Ligada)
console.log("\n🔗 3. LINKED LIST (LISTA LIGADA)");
console.log("-".repeat(30));

class Node {
    constructor(data) {
        this.data = data;
        this.next = null;
    }
}

class SimpleLinkedList {
    constructor() {
        this.head = null;
        this.size = 0;
    }

    append(data) {
        const newNode = new Node(data);
        if (!this.head) {
            this.head = newNode;
        } else {
            let current = this.head;
            while (current.next) {
                current = current.next;
            }
            current.next = newNode;
        }
        this.size++;
    }

    print() {
        if (!this.head) {
            console.log("Lista vazia");
            return;
        }

        const values = [];
        let current = this.head;
        while (current) {
            values.push(current.data);
            current = current.next;
        }
        console.log(`LinkedList: [${values.join('] → [')}] → null`);
    }

    find(data) {
        let current = this.head;
        while (current) {
            if (current.data === data) return true;
            current = current.next;
        }
        return false;
    }
}

const linkedList = new SimpleLinkedList();
console.log("Operações: append('X'), append('Y'), append('Z')");
linkedList.append('X');
linkedList.append('Y');
linkedList.append('Z');
linkedList.print();
console.log(`find('Y'): ${linkedList.find('Y')}`);
console.log(`find('W'): ${linkedList.find('W')}`);

// 4. BINARY SEARCH TREE
console.log("\n🌳 4. BINARY SEARCH TREE (ÁRVORE BINÁRIA DE BUSCA)");
console.log("-".repeat(30));

class BSTNode {
    constructor(data) {
        this.data = data;
        this.left = null;
        this.right = null;
    }
}

class SimpleBST {
    constructor() {
        this.root = null;
    }

    insert(data) {
        this.root = this.insertNode(this.root, data);
    }

    insertNode(node, data) {
        if (!node) return new BSTNode(data);

        if (data < node.data) {
            node.left = this.insertNode(node.left, data);
        } else if (data > node.data) {
            node.right = this.insertNode(node.right, data);
        }
        return node;
    }

    inOrder() {
        const result = [];
        this.inOrderTraversal(this.root, result);
        return result;
    }

    inOrderTraversal(node, result) {
        if (node) {
            this.inOrderTraversal(node.left, result);
            result.push(node.data);
            this.inOrderTraversal(node.right, result);
        }
    }

    search(data) {
        return this.searchNode(this.root, data);
    }

    searchNode(node, data) {
        if (!node || node.data === data) return node !== null;

        if (data < node.data) {
            return this.searchNode(node.left, data);
        } else {
            return this.searchNode(node.right, data);
        }
    }

    printTree() {
        console.log("Árvore (in-order):", this.inOrder().join(' → '));
    }
}

const bst = new SimpleBST();
console.log("Inserindo: 10, 5, 15, 3, 7, 12, 18");
[10, 5, 15, 3, 7, 12, 18].forEach(num => bst.insert(num));
bst.printTree();
console.log(`Buscar 7: ${bst.search(7)}`);
console.log(`Buscar 20: ${bst.search(20)}`);

// 5. GRAPH (Grafo)
console.log("\n🕸️  5. GRAPH (GRAFO)");
console.log("-".repeat(30));

class SimpleGraph {
    constructor(isDirected = false) {
        this.adjacencyList = new Map();
        this.isDirected = isDirected;
    }

    addVertex(vertex) {
        if (!this.adjacencyList.has(vertex)) {
            this.adjacencyList.set(vertex, []);
        }
    }

    addEdge(vertex1, vertex2) {
        this.addVertex(vertex1);
        this.addVertex(vertex2);

        this.adjacencyList.get(vertex1).push(vertex2);

        if (!this.isDirected) {
            this.adjacencyList.get(vertex2).push(vertex1);
        }
    }

    bfs(startVertex) {
        const visited = new Set();
        const queue = [startVertex];
        const result = [];

        visited.add(startVertex);

        while (queue.length > 0) {
            const vertex = queue.shift();
            result.push(vertex);

            const neighbors = this.adjacencyList.get(vertex) || [];
            for (const neighbor of neighbors) {
                if (!visited.has(neighbor)) {
                    visited.add(neighbor);
                    queue.push(neighbor);
                }
            }
        }

        return result;
    }

    print() {
        console.log(`Grafo ${this.isDirected ? 'Direcionado' : 'Não-direcionado'}:`);
        for (const [vertex, neighbors] of this.adjacencyList) {
            const symbol = this.isDirected ? '→' : '↔';
            console.log(`  ${vertex} ${symbol} [${neighbors.join(', ')}]`);
        }
    }
}

const graph = new SimpleGraph(false);
console.log("Adicionando arestas: A-B, A-C, B-D, C-D");
graph.addEdge('A', 'B');
graph.addEdge('A', 'C');
graph.addEdge('B', 'D');
graph.addEdge('C', 'D');
graph.print();
console.log(`BFS a partir de A: [${graph.bfs('A').join(' → ')}]`);

// 6. MEMOIZATION
console.log("\n⚡ 6. MEMOIZATION (OTIMIZAÇÃO)");
console.log("-".repeat(30));

// Fibonacci sem cache (lento)
function fibonacciSlow(n) {
    if (n <= 1) return n;
    return fibonacciSlow(n - 1) + fibonacciSlow(n - 2);
}

// Fibonacci com cache (rápido)
function memoize(fn) {
    const cache = new Map();
    return function (...args) {
        const key = JSON.stringify(args);
        if (cache.has(key)) {
            console.log(`💾 Cache HIT para ${key}`);
            return cache.get(key);
        }
        console.log(`🔄 Calculando ${key}...`);
        const result = fn.apply(this, args);
        cache.set(key, result);
        return result;
    };
}

const fibonacciFast = memoize(function (n) {
    if (n <= 1) return n;
    return fibonacciFast(n - 1) + fibonacciFast(n - 2);
});

console.log("Calculando fibonacci(10) com memoization:");
const result = fibonacciFast(10);
console.log(`Resultado: ${result}`);

console.log("\nSegunda chamada (já no cache):");
const result2 = fibonacciFast(10);
console.log(`Resultado: ${result2}`);

// RESUMO FINAL
console.log("\n🎯 RESUMO COMPARATIVO");
console.log("=".repeat(60));

const structures = [
    { name: "Stack", access: "O(n)", insertion: "O(1)", deletion: "O(1)", use: "Undo, Call Stack" },
    { name: "Queue", access: "O(n)", insertion: "O(1)", deletion: "O(1)", use: "Job Processing" },
    { name: "LinkedList", access: "O(n)", insertion: "O(1)", deletion: "O(1)", use: "Dynamic Size" },
    { name: "BST", access: "O(log n)", insertion: "O(log n)", deletion: "O(log n)", use: "Sorted Data" },
    { name: "Graph", access: "O(V+E)", insertion: "O(1)", deletion: "O(V+E)", use: "Relationships" }
];

console.log("Estrutura  | Acesso   | Inserção | Remoção  | Uso Principal");
console.log("-".repeat(65));
structures.forEach(s => {
    console.log(`${s.name.padEnd(10)} | ${s.access.padEnd(8)} | ${s.insertion.padEnd(8)} | ${s.deletion.padEnd(8)} | ${s.use}`);
});

console.log("\n✅ DEMONSTRAÇÃO CONCLUÍDA!");
console.log("🎓 Todas as estruturas fundamentais foram apresentadas!");
console.log("=".repeat(60));
