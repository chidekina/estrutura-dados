// Trees (árvores)

//árvores são estruturas de dados não lineares usadas para organizar informações de forma hierárquica. Diferente de arrays ou listas, onde os dados são armazenados de maneira sequencial, uma árvore é composta por nós (nodes), onde cada nó pode ter zero ou mais nós filhos, formando uma estrutura ramificada.

// Características principais das árvores em JavaScript

// Nó raiz: É o nó principal da árvore, sem nenhum pai.
// Nós filhos: São nós descendentes de outro nó (nó pai).
// Folhas: Nós que não possuem filhos.
// Subárvore: Qualquer nó com seus descendentes forma uma subárvore.

class TreeNode {
    constructor(value) {
        this.value = value;
        this.children = [];
    }

    addChild(node) {
        this.children.push(node);
    }

    removeChild(value) {
        this.children = this.children.filter(child => child.value !== value);
    }
}

class Tree {
    constructor(rootValue) {
        this.root = new TreeNode(rootValue);
    }

    traverseDFS(callback) {
        function recurse(node) {
            callback(node);

            node.children.forEach(child => recurse(child));
        }

        recurse(this.root);
    }

    // Método para imprimir em formato de árvore
    printTree() {
        this.printTreeRecursive(this.root, "", true);
    }

    printTreeRecursive(node, prefix, isLast) {
        if (!node) return;

        // Imprime o nó atual com a formatação adequada
        console.log(prefix + (isLast ? "└── " : "├── ") + node.value);

        // Calcula o novo prefixo para os filhos
        const newPrefix = prefix + (isLast ? "    " : "│   ");

        // Imprime todos os filhos
        for (let i = 0; i < node.children.length; i++) {
            const isLastChild = i === node.children.length - 1;
            this.printTreeRecursive(node.children[i], newPrefix, isLastChild);
        }
    }

    // Versão alternativa com símbolos diferentes
    printTreeWithSymbols() {
        this.printTreeWithSymbolsRecursive(this.root, "", true);
    }

    printTreeWithSymbolsRecursive(node, prefix, isLast) {
        if (!node) return;

        // Símbolo para o nó atual
        const nodeSymbol = node.children.length === 0 ? "🍃" : "🌿";
        console.log(prefix + (isLast ? "└─ " : "├─ ") + nodeSymbol + " " + node.value);

        // Novo prefixo para os filhos
        const newPrefix = prefix + (isLast ? "   " : "│  ");

        // Imprime filhos
        for (let i = 0; i < node.children.length; i++) {
            const isLastChild = i === node.children.length - 1;
            this.printTreeWithSymbolsRecursive(node.children[i], newPrefix, isLastChild);
        }
    }

    // Versão com níveis (profundidade)
    printTreeWithLevels() {
        this.printTreeWithLevelsRecursive(this.root, 0);
    }

    printTreeWithLevelsRecursive(node, level) {
        if (!node) return;

        const indent = "  ".repeat(level);
        const levelInfo = `(nível ${level})`;
        console.log(`${indent}${node.value} ${levelInfo}`);

        // Imprime filhos no próximo nível
        node.children.forEach(child => {
            this.printTreeWithLevelsRecursive(child, level + 1);
        });
    }
}

const tree = new Tree('A');

const B = new TreeNode('B');
const C = new TreeNode('C');
const D = new TreeNode('D');
const E = new TreeNode('E');
const F = new TreeNode('F');
const G = new TreeNode('G');
const H = new TreeNode('H');

tree.root.addChild(B);
tree.root.addChild(C);
tree.root.addChild(D);

B.addChild(E);
B.addChild(F);

C.addChild(G);

G.addChild(H);

function printNode(node) {
    console.log(node.value);
}

tree.traverseDFS(printNode);

// Exemplo de impressão da árvore
console.log("\nÁrvore em formato de árvore:");
tree.printTree();

console.log("\nÁrvore com símbolos:");
tree.printTreeWithSymbols();

console.log("\nÁrvore com níveis:");
tree.printTreeWithLevels();

console.log("🌳 DIFERENTES FORMATOS DE VISUALIZAÇÃO DA ÁRVORE:");
console.log("=".repeat(60));

console.log("\n📋 1. Lista simples (DFS):");
tree.traverseDFS(printNode);

console.log("\n🌲 2. Formato de árvore tradicional:");
tree.printTree();

console.log("\n🎨 3. Formato com símbolos:");
tree.printTreeWithSymbols();

console.log("\n📊 4. Formato com níveis:");
tree.printTreeWithLevels();

console.log("\n📝 Estrutura da árvore criada:");
console.log("      A");
console.log("     /|\\");
console.log("    B C D");
console.log("   /| |");
console.log("  E F G");
console.log("      |");
console.log("      H");