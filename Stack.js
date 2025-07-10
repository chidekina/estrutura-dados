// Stack (Pilha)
// Uma stack (ou pilha) é uma estrutura de dados linear que segue o princípio LIFO (Last In, First Out), ou seja, o último elemento inserido é o primeiro a ser removido. Imagine uma pilha de pratos: você sempre coloca (empilha) um novo prato no topo e, quando precisa retirar, só pode pegar o prato que está por cima.

class Node {
    constructor(value) {
        this.value = value;
        this.next = null;
    }
}

class Stack {
    constructor() {
        this.top = null;
    }

    push(value) {
        const newNode = new Node(value);
        newNode.next = this.top;
        this.top = newNode;
    }

    pop() {
        if (!this.top) return null;

        const removedValue = this.top.value;
        this.top = this.top.next;

        return removedValue;
    }

    peek() {
        if (!this.top) return null;

        return this.top.value;
    }

    isEmpty() {
        return this.top === null;
    }

    size() {
        let count = 0;
        let currentNode = this.top;

        while (currentNode) {
            count++;
            currentNode = currentNode.next;
        }

        return count;
    }

    print() {
        let result = "TOP → ";
        let currentNode = this.top;

        while (currentNode) {
            result += currentNode.value + " → ";
            currentNode = currentNode.next;
        }

        result += "BOTTOM";
        console.log(result);
    }

    // Limpa toda a pilha
    clear() {
        this.top = null;
    }

    // Converte para array (do topo para a base)
    toArray() {
        const result = [];
        let currentNode = this.top;

        while (currentNode) {
            result.push(currentNode.value);
            currentNode = currentNode.next;
        }

        return result;
    }

    // Verifica se contém um valor
    contains(value) {
        let currentNode = this.top;

        while (currentNode) {
            if (currentNode.value === value) {
                return true;
            }
            currentNode = currentNode.next;
        }

        return false;
    }
}

// DEMONSTRAÇÃO E TESTES
console.log("📚 TESTANDO IMPLEMENTAÇÃO DE STACK (PILHA)");
console.log("=".repeat(50));

const stack = new Stack();

console.log("\n📍 TESTE 1: Stack vazia");
console.log(`Está vazia: ${stack.isEmpty()}`);
console.log(`Tamanho: ${stack.size()}`);
console.log(`Peek (topo): ${stack.peek()}`);
console.log(`Pop: ${stack.pop()}`);

console.log("\n📍 TESTE 2: Adicionando elementos (push)");
stack.push("Primeiro");
stack.push("Segundo");
stack.push("Terceiro");
stack.push("Quarto");

console.log("Stack após inserções:");
stack.print();
console.log(`Tamanho: ${stack.size()}`);

console.log("\n📍 TESTE 3: Operações de consulta");
console.log(`Peek (topo): ${stack.peek()}`);
console.log(`Contém 'Segundo': ${stack.contains("Segundo")}`);
console.log(`Contém 'Inexistente': ${stack.contains("Inexistente")}`);

console.log("\n📍 TESTE 4: Removendo elementos (pop)");
console.log(`Pop: ${stack.pop()}`);
console.log(`Pop: ${stack.pop()}`);

console.log("Stack após remoções:");
stack.print();
console.log(`Tamanho: ${stack.size()}`);

console.log("\n📍 TESTE 5: Conversão para array");
console.log(`Array (topo→base): [${stack.toArray().join(', ')}]`);

console.log("\n📍 TESTE 6: Exemplo prático - Validação de parênteses");
function validarParenteses(expressao) {
    const stackParenteses = new Stack();

    for (let char of expressao) {
        if (char === '(' || char === '[' || char === '{') {
            stackParenteses.push(char);
        } else if (char === ')' || char === ']' || char === '}') {
            if (stackParenteses.isEmpty()) return false;

            const ultimo = stackParenteses.pop();
            if ((char === ')' && ultimo !== '(') ||
                (char === ']' && ultimo !== '[') ||
                (char === '}' && ultimo !== '{')) {
                return false;
            }
        }
    }

    return stackParenteses.isEmpty();
}

const expressoes = [
    "(a + b)",
    "{[a + (b * c)]}",
    "((a + b)",
    "{[a + b)]}",
    ""
];

console.log("Validação de parênteses:");
expressoes.forEach(expr => {
    console.log(`  "${expr}": ${validarParenteses(expr) ? "✅ válida" : "❌ inválida"}`);
});

console.log("\n📍 TESTE 7: Limpeza da stack");
stack.clear();
console.log("Stack após limpeza:");
stack.print();
console.log(`Está vazia: ${stack.isEmpty()}`);

console.log("\n✅ TODOS OS TESTES CONCLUÍDOS!");
console.log("🎯 Stack implementada com sucesso - LIFO garantido!");
console.log("=".repeat(50));