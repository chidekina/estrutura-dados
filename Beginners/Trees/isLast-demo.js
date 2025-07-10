// DEMONSTRAÇÃO: Quando isLast muda de true para false

class TreeNode {
    constructor(value) {
        this.value = value;
        this.children = [];
    }

    addChild(node) {
        this.children.push(node);
    }
}

class Tree {
    constructor(rootValue) {
        this.root = new TreeNode(rootValue);
    }

    // Versão com logs para mostrar quando isLast muda
    printTreeWithLogs() {
        console.log("🔍 RASTREANDO isLast:");
        this.printTreeRecursiveWithLogs(this.root, "", true, 0);
    }

    printTreeRecursiveWithLogs(node, prefix, isLast, depth) {
        if (!node) return;

        // Log do estado atual
        console.log(`${"  ".repeat(depth)}📍 Processando: ${node.value}, isLast: ${isLast}`);

        // Imprime o nó atual
        const symbol = isLast ? "└── " : "├── ";
        console.log(prefix + symbol + node.value);

        // Calcula novo prefixo
        const newPrefix = prefix + (isLast ? "    " : "│   ");

        // AQUI é onde isLast é calculado para cada filho!
        if (node.children.length > 0) {
            console.log(`${"  ".repeat(depth)}👥 ${node.value} tem ${node.children.length} filho(s):`);

            for (let i = 0; i < node.children.length; i++) {
                const isLastChild = i === node.children.length - 1;
                console.log(`${"  ".repeat(depth)}   Filho ${i}: ${node.children[i].value}, isLast será: ${isLastChild}`);

                this.printTreeRecursiveWithLogs(node.children[i], newPrefix, isLastChild, depth + 1);
            }
        } else {
            console.log(`${"  ".repeat(depth)}🍃 ${node.value} é uma folha (sem filhos)`);
        }
    }
}

// Criando uma árvore menor para exemplo
const tree = new Tree('A');
const B = new TreeNode('B');
const C = new TreeNode('C');
const D = new TreeNode('D');

tree.root.addChild(B);  // B será o primeiro filho (isLast = false)
tree.root.addChild(C);  // C será o meio (isLast = false)  
tree.root.addChild(D);  // D será o último filho (isLast = true)

console.log("🌳 ÁRVORE SIMPLES:");
console.log("A tem 3 filhos: B, C, D");
console.log("\nEstrutura:");
console.log("A");
console.log("├── B  ← isLast = false (não é o último)");
console.log("├── C  ← isLast = false (não é o último)");
console.log("└── D  ← isLast = true  (é o último!)");

console.log("\n" + "=".repeat(50));
tree.printTreeWithLogs();

console.log("\n" + "=".repeat(50));
console.log("📊 RESUMO:");
console.log("• Raiz A: isLast = true (é única)");
console.log("• Filho B: isLast = false (i=0, não é o último)");
console.log("• Filho C: isLast = false (i=1, não é o último)");
console.log("• Filho D: isLast = true  (i=2, é o último!)");

console.log("\n🔑 FÓRMULA:");
console.log("isLastChild = i === node.children.length - 1");
console.log("Para A com 3 filhos:");
console.log("• i=0: 0 === 2? false");
console.log("• i=1: 1 === 2? false");
console.log("• i=2: 2 === 2? true ✅");
