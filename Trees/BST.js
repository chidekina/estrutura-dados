// Binary Tree (BST)

// Uma árvore binária é uma estrutura de dados hierárquica composta por nós, onde cada nó pode ter até dois filhos: um à esquerda e outro à direita. Essa estrutura é muito utilizada para organizar dados de forma que facilite buscas, inserções e remoções eficientes.

// Características principais
// Raiz: O nó inicial da árvore.
// Filhos: Cada nó pode ter no máximo dois filhos (esquerda e direita).
// Folhas: Nós sem filhos.
// Subárvores: Cada filho pode ser a raiz de uma subárvore.
// Altura: Distância máxima da raiz até uma folha.

// Busca	
// Complexidade média: O(log n)
// Complexidade Pior caso:	O(n)

// Inserção
// Complexidade média: O(log n)
// Complexidade Pior caso:	O(n)

// Remoção
// Complexidade média: O(log n)
// Complexidade Pior caso:	O(n)

class Node {
    constructor(value) {
        this.value = value;
        this.left = null;
        this.right = null;
    }
}

class BinaryTree {
    constructor() {
        this.root = null;
    }

    insert(value) {
        const newNode = new Node(value);

        if (this.root === null) {
            this.root = newNode;
            return;
        }

        this.insertNode(this.root, newNode);
    }

    insertNode(currentNode, newNode) {
        if (newNode.value < currentNode.value) {
            if (currentNode.left === null) {
                currentNode.left = newNode;
            } else {
                this.insertNode(currentNode.left, newNode);
            }
        } else {
            if (currentNode.right === null) {
                currentNode.right = newNode;
            } else {
                this.insertNode(currentNode.right, newNode);
            }
        }
    }

    // Busca um valor na árvore
    search(value) {
        return this.searchNode(this.root, value);
    }

    searchNode(node, value) {
        if (node === null) return false;

        if (value === node.value) return true;

        if (value < node.value) {
            return this.searchNode(node.left, value);
        } else {
            return this.searchNode(node.right, value);
        }
    }

    // Encontra o valor mínimo na árvore
    findMin(node = this.root) {
        if (node === null) return null;

        while (node.left !== null) {
            node = node.left;
        }
        return node.value;
    }

    // Encontra o valor máximo na árvore
    findMax(node = this.root) {
        if (node === null) return null;

        while (node.right !== null) {
            node = node.right;
        }
        return node.value;
    }

    // Remove um nó da árvore
    remove(value) {
        this.root = this.removeNode(this.root, value);
    }

    removeNode(node, value) {
        if (node === null) return null;

        if (value < node.value) {
            node.left = this.removeNode(node.left, value);
        } else if (value > node.value) {
            node.right = this.removeNode(node.right, value);
        } else {
            // Nó encontrado! Casos de remoção:

            // Caso 1: Nó folha (sem filhos)
            if (node.left === null && node.right === null) {
                return null;
            }

            // Caso 2: Nó com apenas um filho
            if (node.left === null) return node.right;
            if (node.right === null) return node.left;

            // Caso 3: Nó com dois filhos
            // Encontra o sucessor in-order (menor valor da subárvore direita)
            const minRight = this.findMin(node.right);
            node.value = minRight;
            node.right = this.removeNode(node.right, minRight);
        }

        return node;
    }

    // Travessia pré-ordem (raiz, esquerda, direita)
    preOrderTraversal(node = this.root, result = []) {
        if (node !== null) {
            result.push(node.value);
            this.preOrderTraversal(node.left, result);
            this.preOrderTraversal(node.right, result);
        }
        return result;
    }

    // Travessia pós-ordem (esquerda, direita, raiz)
    postOrderTraversal(node = this.root, result = []) {
        if (node !== null) {
            this.postOrderTraversal(node.left, result);
            this.postOrderTraversal(node.right, result);
            result.push(node.value);
        }
        return result;
    }

    // Calcula a altura da árvore
    getHeight(node = this.root) {
        if (node === null) return -1;

        const leftHeight = this.getHeight(node.left);
        const rightHeight = this.getHeight(node.right);

        return Math.max(leftHeight, rightHeight) + 1;
    }

    // Conta o número total de nós
    countNodes(node = this.root) {
        if (node === null) return 0;

        return 1 + this.countNodes(node.left) + this.countNodes(node.right);
    }

    // Verifica se a árvore está balanceada
    isBalanced(node = this.root) {
        if (node === null) return true;

        const leftHeight = this.getHeight(node.left);
        const rightHeight = this.getHeight(node.right);

        const heightDiff = Math.abs(leftHeight - rightHeight);

        return heightDiff <= 1 &&
            this.isBalanced(node.left) &&
            this.isBalanced(node.right);
    }

    // Imprime a árvore em formato visual
    printTree() {
        this.printTreeRecursive(this.root, "", true);
    }

    printTreeRecursive(node, prefix, isLast) {
        if (node === null) return;

        console.log(prefix + (isLast ? "└── " : "├── ") + node.value);

        const children = [];
        if (node.left !== null) children.push({ node: node.left, label: "L" });
        if (node.right !== null) children.push({ node: node.right, label: "R" });

        children.forEach((child, index) => {
            const isLastChild = index === children.length - 1;
            const newPrefix = prefix + (isLast ? "    " : "│   ");
            this.printTreeRecursive(child.node, newPrefix, isLastChild);
        });
    }

    // Converte árvore para array ordenado
    toArray() {
        const result = [];
        this.inOrderHelper(this.root, result);
        return result;
    }

    inOrderHelper(node, result) {
        if (node !== null) {
            this.inOrderHelper(node.left, result);
            result.push(node.value);
            this.inOrderHelper(node.right, result);
        }
    }

    // Travessia in-order para impressão
    inOrderTraversal(node = this.root) {
        if (node !== null) {
            this.inOrderTraversal(node.left);
            console.log(node.value);
            this.inOrderTraversal(node.right);
        }
    }
}

let tree = new BinaryTree();

// TESTE COMPLETO DA BST
console.log("🌳 TESTANDO BINARY SEARCH TREE COMPLETA");
console.log("=".repeat(50));

// Inserindo valores
tree.insert(10);
tree.insert(5);
tree.insert(15);
tree.insert(3);
tree.insert(7);
tree.insert(12);
tree.insert(18);

console.log("📊 Árvore criada:");
tree.printTree();

console.log("\n🔍 BUSCAS:");
console.log(`Buscar 7: ${tree.search(7)}`);
console.log(`Buscar 20: ${tree.search(20)}`);

console.log("\n📈 ESTATÍSTICAS:");
console.log(`Altura: ${tree.getHeight()}`);
console.log(`Total de nós: ${tree.countNodes()}`);
console.log(`Mínimo: ${tree.findMin()}`);
console.log(`Máximo: ${tree.findMax()}`);
console.log(`Balanceada: ${tree.isBalanced()}`);

console.log("\n🔄 TRAVESSIAS:");
console.log(`In-order: [${tree.toArray().join(', ')}]`);
console.log(`Pré-order: [${tree.preOrderTraversal().join(', ')}]`);
console.log(`Pós-order: [${tree.postOrderTraversal().join(', ')}]`);

console.log("\n❌ TESTANDO REMOÇÃO:");
console.log("Removendo 5...");
tree.remove(5);
tree.printTree();
console.log(`Array após remoção: [${tree.toArray().join(', ')}]`);