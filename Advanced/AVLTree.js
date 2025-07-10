/**
 * AVL TREE (ÁRVORE BALANCEADA) - ADVANCED MODULE
 * ==============================================
 * 
 * Uma árvore AVL é uma árvore binária de busca auto-balanceada onde
 * a diferença de altura entre as subárvores esquerda e direita
 * de qualquer nó é no máximo 1.
 * 
 * Complexidade:
 * - Busca: O(log n)
 * - Inserção: O(log n)
 * - Remoção: O(log n)
 * - Espaço: O(n)
 * 
 * Vantagens:
 * - Garantia de balanceamento
 * - Operações sempre O(log n)
 * - Ideal para aplicações que fazem muitas buscas
 * 
 * Desvantagens:
 * - Mais complexa que BST simples
 * - Overhead de balanceamento
 * - Mais memória por nó (fator de balanceamento)
 */

class AVLNode {
    constructor(data) {
        this.data = data;
        this.left = null;
        this.right = null;
        this.height = 1; // Altura do nó
    }
}

class AVLTree {
    constructor() {
        this.root = null;
        this.size = 0;
        this.rotations = 0; // Contador de rotações para análise
    }

    /**
     * Obtém a altura de um nó
     */
    getHeight(node) {
        return node ? node.height : 0;
    }

    /**
     * Calcula o fator de balanceamento de um nó
     * Fator = altura(esquerda) - altura(direita)
     */
    getBalanceFactor(node) {
        return node ? this.getHeight(node.left) - this.getHeight(node.right) : 0;
    }

    /**
     * Atualiza a altura de um nó
     */
    updateHeight(node) {
        if (node) {
            node.height = 1 + Math.max(this.getHeight(node.left), this.getHeight(node.right));
        }
    }

    /**
     * Rotação à direita
     *     y                x
     *    / \              / \
     *   x   T3    =>     T1  y
     *  / \                  / \
     * T1  T2               T2 T3
     */
    rotateRight(y) {
        this.rotations++;
        const x = y.left;
        const T2 = x.right;

        // Realiza a rotação
        x.right = y;
        y.left = T2;

        // Atualiza as alturas
        this.updateHeight(y);
        this.updateHeight(x);

        return x; // Nova raiz
    }

    /**
     * Rotação à esquerda
     *   x                  y
     *  / \                / \
     * T1  y      =>      x   T3
     *    / \            / \
     *   T2 T3          T1 T2
     */
    rotateLeft(x) {
        this.rotations++;
        const y = x.right;
        const T2 = y.left;

        // Realiza a rotação
        y.left = x;
        x.right = T2;

        // Atualiza as alturas
        this.updateHeight(x);
        this.updateHeight(y);

        return y; // Nova raiz
    }

    /**
     * Insere um valor na árvore
     */
    insert(data) {
        this.root = this._insertNode(this.root, data);
        return this;
    }

    _insertNode(node, data) {
        // 1. Inserção BST normal
        if (!node) {
            this.size++;
            return new AVLNode(data);
        }

        if (data < node.data) {
            node.left = this._insertNode(node.left, data);
        } else if (data > node.data) {
            node.right = this._insertNode(node.right, data);
        } else {
            return node; // Valor já existe
        }

        // 2. Atualiza a altura do nó atual
        this.updateHeight(node);

        // 3. Obtém o fator de balanceamento
        const balance = this.getBalanceFactor(node);

        // 4. Se o nó ficou desbalanceado, há 4 casos:

        // Caso Left Left
        if (balance > 1 && data < node.left.data) {
            return this.rotateRight(node);
        }

        // Caso Right Right
        if (balance < -1 && data > node.right.data) {
            return this.rotateLeft(node);
        }

        // Caso Left Right
        if (balance > 1 && data > node.left.data) {
            node.left = this.rotateLeft(node.left);
            return this.rotateRight(node);
        }

        // Caso Right Left
        if (balance < -1 && data < node.right.data) {
            node.right = this.rotateRight(node.right);
            return this.rotateLeft(node);
        }

        return node; // Nó já está balanceado
    }

    /**
     * Remove um valor da árvore
     */
    remove(data) {
        this.root = this._removeNode(this.root, data);
        return this;
    }

    _removeNode(node, data) {
        // 1. Remoção BST normal
        if (!node) return node;

        if (data < node.data) {
            node.left = this._removeNode(node.left, data);
        } else if (data > node.data) {
            node.right = this._removeNode(node.right, data);
        } else {
            // Nó encontrado
            this.size--;

            // Nó com apenas um filho ou sem filhos
            if (!node.left || !node.right) {
                const temp = node.left || node.right;

                if (!temp) {
                    // Sem filhos
                    node = null;
                } else {
                    // Um filho
                    node = temp;
                }
            } else {
                // Nó com dois filhos: encontra o sucessor inorder
                const temp = this._findMin(node.right);

                // Copia o valor do sucessor
                node.data = temp.data;

                // Remove o sucessor
                node.right = this._removeNode(node.right, temp.data);
            }
        }

        if (!node) return node;

        // 2. Atualiza a altura do nó atual
        this.updateHeight(node);

        // 3. Obtém o fator de balanceamento
        const balance = this.getBalanceFactor(node);

        // 4. Se o nó ficou desbalanceado, há 4 casos:

        // Caso Left Left
        if (balance > 1 && this.getBalanceFactor(node.left) >= 0) {
            return this.rotateRight(node);
        }

        // Caso Left Right
        if (balance > 1 && this.getBalanceFactor(node.left) < 0) {
            node.left = this.rotateLeft(node.left);
            return this.rotateRight(node);
        }

        // Caso Right Right
        if (balance < -1 && this.getBalanceFactor(node.right) <= 0) {
            return this.rotateLeft(node);
        }

        // Caso Right Left
        if (balance < -1 && this.getBalanceFactor(node.right) > 0) {
            node.right = this.rotateRight(node.right);
            return this.rotateLeft(node);
        }

        return node;
    }

    /**
     * Encontra o menor valor na árvore/subárvore
     */
    _findMin(node) {
        while (node.left) {
            node = node.left;
        }
        return node;
    }

    /**
     * Busca um valor na árvore
     */
    search(data) {
        return this._searchNode(this.root, data);
    }

    _searchNode(node, data) {
        if (!node || node.data === data) {
            return node;
        }

        if (data < node.data) {
            return this._searchNode(node.left, data);
        } else {
            return this._searchNode(node.right, data);
        }
    }

    /**
     * Verifica se a árvore está balanceada
     */
    isBalanced() {
        return this._checkBalance(this.root);
    }

    _checkBalance(node) {
        if (!node) return true;

        const balance = this.getBalanceFactor(node);

        return Math.abs(balance) <= 1 &&
            this._checkBalance(node.left) &&
            this._checkBalance(node.right);
    }

    /**
     * Percursos da árvore
     */
    inOrder() {
        const result = [];
        this._inOrder(this.root, result);
        return result;
    }

    _inOrder(node, result) {
        if (node) {
            this._inOrder(node.left, result);
            result.push(node.data);
            this._inOrder(node.right, result);
        }
    }

    preOrder() {
        const result = [];
        this._preOrder(this.root, result);
        return result;
    }

    _preOrder(node, result) {
        if (node) {
            result.push(node.data);
            this._preOrder(node.left, result);
            this._preOrder(node.right, result);
        }
    }

    postOrder() {
        const result = [];
        this._postOrder(this.root, result);
        return result;
    }

    _postOrder(node, result) {
        if (node) {
            this._postOrder(node.left, result);
            this._postOrder(node.right, result);
            result.push(node.data);
        }
    }

    /**
     * Obtém estatísticas da árvore
     */
    getStats() {
        return {
            size: this.size,
            height: this.getHeight(this.root),
            isBalanced: this.isBalanced(),
            rotations: this.rotations,
            minValue: this.size > 0 ? this._findMin(this.root).data : null,
            maxValue: this.size > 0 ? this._findMax(this.root).data : null
        };
    }

    _findMax(node) {
        while (node.right) {
            node = node.right;
        }
        return node;
    }

    /**
     * Visualiza a estrutura da árvore
     */
    print() {
        if (!this.root) {
            console.log('Árvore vazia');
            return;
        }
        this._printTree(this.root, '', true);
    }

    _printTree(node, prefix, isLast) {
        if (node) {
            console.log(prefix + (isLast ? '└── ' : '├── ') +
                node.data + ` (h:${node.height}, b:${this.getBalanceFactor(node)})`);

            const children = [node.left, node.right].filter(Boolean);
            children.forEach((child, index) => {
                const isLastChild = index === children.length - 1;
                this._printTree(child, prefix + (isLast ? '    ' : '│   '), isLastChild);
            });
        }
    }

    /**
     * Limpa a árvore
     */
    clear() {
        this.root = null;
        this.size = 0;
        this.rotations = 0;
    }
}

// =====================================
// EXEMPLOS DE USO E DEMONSTRAÇÕES
// =====================================

console.log('=== DEMONSTRAÇÃO AVL TREE ===\n');

// Criando uma nova árvore AVL
const avl = new AVLTree();

console.log('1. INSERINDO VALORES SEQUENCIAIS (PIOR CASO PARA BST NORMAL)');
const values = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
values.forEach(val => avl.insert(val));

console.log('Árvore após inserções:');
avl.print();
console.log('\nEstatísticas:', avl.getStats());

console.log('\n2. TESTANDO BALANCEAMENTO');
console.log('InOrder (deve estar ordenado):', avl.inOrder());
console.log('Árvore está balanceada?', avl.isBalanced());

console.log('\n3. BUSCAS');
console.log('Buscar 5:', avl.search(5) ? 'Encontrado' : 'Não encontrado');
console.log('Buscar 15:', avl.search(15) ? 'Encontrado' : 'Não encontrado');

console.log('\n4. REMOÇÕES');
avl.remove(5);
console.log('Após remover 5:');
avl.print();
console.log('Estatísticas:', avl.getStats());

// =====================================
// TESTE DE PERFORMANCE
// =====================================

console.log('\n=== TESTE DE PERFORMANCE ===\n');

function testPerformance() {
    const sizes = [1000, 5000, 10000];

    sizes.forEach(size => {
        console.log(`\nTestando com ${size} elementos:`);

        const avlTree = new AVLTree();
        const bstArray = []; // Simulando BST desbalanceada

        // Inserção
        const startInsert = performance.now();
        for (let i = 1; i <= size; i++) {
            avlTree.insert(i); // Pior caso: inserção sequencial
        }
        const endInsert = performance.now();

        // Busca
        const startSearch = performance.now();
        for (let i = 1; i <= 100; i++) {
            avlTree.search(Math.floor(Math.random() * size) + 1);
        }
        const endSearch = performance.now();

        console.log(`AVL Tree:`);
        console.log(`  Inserção: ${(endInsert - startInsert).toFixed(2)}ms`);
        console.log(`  Busca (100x): ${(endSearch - startSearch).toFixed(2)}ms`);
        console.log(`  Altura: ${avlTree.getHeight(avlTree.root)}`);
        console.log(`  Altura teórica ideal: ${Math.ceil(Math.log2(size))}`);
        console.log(`  Rotações realizadas: ${avlTree.rotations}`);
        console.log(`  Está balanceada: ${avlTree.isBalanced()}`);
    });
}

testPerformance();

// =====================================
// CASOS DE USO PRÁTICOS
// =====================================

console.log('\n=== CASOS DE USO PRÁTICOS ===\n');

// 1. Sistema de ranking/pontuação
console.log('1. SISTEMA DE RANKING:');
const ranking = new AVLTree();
const players = [
    { name: 'Alice', score: 1250 },
    { name: 'Bob', score: 980 },
    { name: 'Carol', score: 1100 },
    { name: 'David', score: 1350 },
    { name: 'Eve', score: 750 }
];

players.forEach(player => ranking.insert(player.score));
console.log('Scores ordenados:', ranking.inOrder());

// 2. Índice de banco de dados
console.log('\n2. ÍNDICE DE BANCO DE DADOS (IDs):');
const dbIndex = new AVLTree();
const ids = [101, 205, 89, 156, 78, 234, 45, 167, 290, 123];
ids.forEach(id => dbIndex.insert(id));

console.log('IDs indexados:', dbIndex.inOrder());
console.log('Buscar ID 156:', dbIndex.search(156) ? 'Encontrado' : 'Não encontrado');

// =====================================
// VALIDAÇÃO E TESTES UNITÁRIOS
// =====================================

console.log('\n=== VALIDAÇÃO E TESTES ===\n');

function runTests() {
    console.log('Executando testes unitários...\n');

    // Teste 1: Inserção e busca
    const tree1 = new AVLTree();
    tree1.insert(10).insert(5).insert(15);
    console.log('✓ Teste 1 - Inserção básica:', tree1.inOrder().join(',') === '5,10,15');

    // Teste 2: Balanceamento
    const tree2 = new AVLTree();
    [1, 2, 3, 4, 5].forEach(val => tree2.insert(val));
    console.log('✓ Teste 2 - Balanceamento:', tree2.isBalanced());

    // Teste 3: Remoção
    const tree3 = new AVLTree();
    [10, 5, 15, 3, 7, 12, 18].forEach(val => tree3.insert(val));
    tree3.remove(10);
    console.log('✓ Teste 3 - Remoção raiz:', !tree3.search(10) && tree3.isBalanced());

    // Teste 4: Rotações
    const tree4 = new AVLTree();
    [1, 2, 3].forEach(val => tree4.insert(val)); // Força rotação left-left
    console.log('✓ Teste 4 - Rotações:', tree4.rotations > 0);

    // Teste 5: Altura
    const tree5 = new AVLTree();
    [1, 2, 3, 4, 5, 6, 7].forEach(val => tree5.insert(val));
    const heightOk = tree5.getHeight(tree5.root) <= Math.ceil(Math.log2(tree5.size)) + 1;
    console.log('✓ Teste 5 - Altura balanceada:', heightOk);

    console.log('\nTodos os testes concluídos!');
}

runTests();

// Export para uso em outros módulos
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { AVLTree, AVLNode };
}
