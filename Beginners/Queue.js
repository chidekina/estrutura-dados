//Queue (Fila)
// Uma queue (ou fila) é uma estrutura de dados linear que segue o princípio FIFO (First In, First Out), ou seja, o primeiro elemento inserido é o primeiro a ser removido. Isso é semelhante a uma fila de pessoas em um banco ou supermercado: quem chega primeiro é atendido primeiro.

class Node {
    constructor(value) {
        this.value = value;
        this.prev = null;
        this.next = null;
    }
}

class Queue {
    constructor() {
        this.front = null;
        this.rear = null;
        this.size = 0;
    }

    enqueue(value) {
        const newNode = new Node(value);

        if (!this.front) {
            this.front = this.rear = newNode;
        } else {
            this.rear.next = newNode;
            this.rear = newNode;
        }

        this.size++;
    }

    dequeue() {
        if (!this.front) return null; 

        const removedValue = this.front.value;
        this.front = this.front.next;

        if (!this.front) {
            this.rear = null;
        }

        this.size--;
        return removedValue;
    }

    peek() {
        return this.front ? this.front.value : null;
    }

    isEmpty() {
        return this.front === null;
    }

    print() {
        let result = "FRONT → ";
        let currentNode = this.front;

        while (currentNode) {
            result += currentNode.value + " → ";
            currentNode = currentNode.next;
        }

        result += "REAR";
        console.log(result);
        console.log(`Size: ${this.size}`);
    }

    // Limpa toda a fila
    clear() {
        this.front = null;
        this.rear = null;
        this.size = 0;
    }

    // Converte para array (da frente para trás)
    toArray() {
        const result = [];
        let currentNode = this.front;

        while (currentNode) {
            result.push(currentNode.value);
            currentNode = currentNode.next;
        }

        return result;
    }

    // Verifica se contém um valor
    contains(value) {
        let currentNode = this.front;

        while (currentNode) {
            if (currentNode.value === value) {
                return true;
            }
            currentNode = currentNode.next;
        }

        return false;
    }

    // Retorna o tamanho da fila
    getSize() {
        return this.size;
    }
}

// DEMONSTRAÇÃO E TESTES
console.log("🚶 TESTANDO IMPLEMENTAÇÃO DE QUEUE (FILA)");
console.log("=".repeat(50));

const queue = new Queue();

console.log("\n📍 TESTE 1: Fila vazia");
console.log(`Está vazia: ${queue.isEmpty()}`);
console.log(`Tamanho: ${queue.getSize()}`);
console.log(`Peek (frente): ${queue.peek()}`);
console.log(`Dequeue: ${queue.dequeue()}`);

console.log("\n📍 TESTE 2: Adicionando elementos (enqueue)");
queue.enqueue("Cliente 1");
queue.enqueue("Cliente 2");
queue.enqueue("Cliente 3");
queue.enqueue("Cliente 4");

console.log("Fila após inserções:");
queue.print();

console.log("\n📍 TESTE 3: Operações de consulta");
console.log(`Peek (frente): ${queue.peek()}`);
console.log(`Contém 'Cliente 2': ${queue.contains("Cliente 2")}`);
console.log(`Contém 'Cliente 10': ${queue.contains("Cliente 10")}`);

console.log("\n📍 TESTE 4: Removendo elementos (dequeue)");
console.log(`Atendendo: ${queue.dequeue()}`);
console.log(`Atendendo: ${queue.dequeue()}`);

console.log("Fila após atendimentos:");
queue.print();

console.log("\n📍 TESTE 5: Conversão para array");
console.log(`Array (frente→trás): [${queue.toArray().join(', ')}]`);

console.log("\n📍 TESTE 6: Exemplo prático - Sistema de atendimento");
const filaAtendimento = new Queue();

// Simulando chegada de clientes
console.log("🏪 Simulação de fila de banco:");
const clientes = ["Ana", "Bruno", "Carlos", "Diana", "Eduardo"];

console.log("\n📥 Clientes chegando:");
clientes.forEach((cliente, index) => {
    filaAtendimento.enqueue(`${cliente} (Senha ${index + 1})`);
    console.log(`  ${cliente} entrou na fila`);
});

console.log("\nFila formada:");
filaAtendimento.print();

console.log("\n👨‍💼 Atendimento iniciado:");
while (!filaAtendimento.isEmpty()) {
    const clienteAtendido = filaAtendimento.dequeue();
    console.log(`  Atendendo: ${clienteAtendido}`);
    console.log(`  Restam ${filaAtendimento.getSize()} pessoas na fila`);
    
    if (!filaAtendimento.isEmpty()) {
        console.log(`  Próximo: ${filaAtendimento.peek()}`);
    }
    console.log();
}

console.log("📍 TESTE 7: Limpeza da fila");
queue.clear();
console.log("Fila após limpeza:");
queue.print();

console.log("\n✅ TODOS OS TESTES CONCLUÍDOS!");
console.log("🎯 Queue implementada com sucesso - FIFO garantido!");
console.log("=".repeat(50));