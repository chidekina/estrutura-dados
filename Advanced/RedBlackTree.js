/**
 * RED-BLACK TREE (ÁRVORE RUBRO-NEGRA) - ADVANCED MODULE
 * ====================================================
 * 
 * Uma árvore Red-Black é uma árvore binária de busca auto-balanceada
 * onde cada nó tem uma cor (vermelho ou preto) e segue regras específicas
 * para manter o balanceamento.
 * 
 * REGRAS DA ÁRVORE RED-BLACK:
 * 1. Todo nó é vermelho ou preto
 * 2. A raiz é sempre preta
 * 3. Todas as folhas (nós nulos) são pretas
 * 4. Se um nó é vermelho, ambos os filhos são pretos
 * 5. Todo caminho da raiz até uma folha tem o mesmo número de nós pretos
 * 
 * Complexidade:
 * - Busca: O(log n)
 * - Inserção: O(log n)
 * - Remoção: O(log n)
 * - Espaço: O(n)
 * 
 * Vantagens:
 * - Balanceamento automático
 * - Menos rotações que AVL na inserção
 * - Usada em muitas bibliotecas padrão (map, set)
 * 
 * Desvantagens:
 * - Implementação complexa
 * - Pode ser menos balanceada que AVL
 */

const RED = 'RED';
const BLACK = 'BLACK';

class RBNode {
    constructor(data, color = RED) {
        this.data = data;
        this.color = color;
        this.left = null;
        this.right = null;
        this.parent = null;
    }

    /**
     * Verifica se o nó é vermelho
     */
    isRed() {
        return this.color === RED;
    }

    /**
     * Verifica se o nó é preto
     */
    isBlack() {
        return this.color === BLACK;
    }

    /**
     * Obtém o avô do nó
     */
    grandparent() {
        return this.parent ? this.parent.parent : null;
    }

    /**
     * Obtém o tio do nó
     */
    uncle() {
        const gp = this.grandparent();
        if (!gp) return null;

        return this.parent === gp.left ? gp.right : gp.left;
    }

    /**
     * Obtém o irmão do nó
     */
    sibling() {
        if (!this.parent) return null;
        return this === this.parent.left ? this.parent.right : this.parent.left;
    }
}

class RedBlackTree {
    constructor() {
        this.root = null;
        this.size = 0;
        this.rotations = 0; // Contador para análise
        this.recolorings = 0; // Contador de recolorações
    }

    /**
     * Rotação à esquerda
     */
    rotateLeft(x) {
        this.rotations++;
        const y = x.right;

        x.right = y.left;
        if (y.left) {
            y.left.parent = x;
        }

        y.parent = x.parent;
        if (!x.parent) {
            this.root = y;
        } else if (x === x.parent.left) {
            x.parent.left = y;
        } else {
            x.parent.right = y;
        }

        y.left = x;
        x.parent = y;
    }

    /**
     * Rotação à direita
     */
    rotateRight(y) {
        this.rotations++;
        const x = y.left;

        y.left = x.right;
        if (x.right) {
            x.right.parent = y;
        }

        x.parent = y.parent;
        if (!y.parent) {
            this.root = x;
        } else if (y === y.parent.left) {
            y.parent.left = x;
        } else {
            y.parent.right = x;
        }

        x.right = y;
        y.parent = x;
    }

    /**
     * Insere um valor na árvore
     */
    insert(data) {
        // 1. Inserção BST normal
        const newNode = new RBNode(data, RED);

        if (!this.root) {
            this.root = newNode;
            this.root.color = BLACK; // Regra 2: raiz é preta
            this.size++;
            return this;
        }

        let current = this.root;
        let parent;

        while (current) {
            parent = current;
            if (data < current.data) {
                current = current.left;
            } else if (data > current.data) {
                current = current.right;
            } else {
                return this; // Valor já existe
            }
        }

        newNode.parent = parent;
        if (data < parent.data) {
            parent.left = newNode;
        } else {
            parent.right = newNode;
        }

        this.size++;

        // 2. Corrigir violações das propriedades Red-Black
        this._fixInsert(newNode);

        return this;
    }

    /**
     * Corrige violações após inserção
     */
    _fixInsert(node) {
        while (node.parent && node.parent.isRed()) {
            const parent = node.parent;
            const grandparent = parent.parent;

            if (parent === grandparent.left) {
                const uncle = grandparent.right;

                if (uncle && uncle.isRed()) {
                    // Caso 1: Tio é vermelho - recolorir
                    this.recolorings++;
                    parent.color = BLACK;
                    uncle.color = BLACK;
                    grandparent.color = RED;
                    node = grandparent;
                } else {
                    if (node === parent.right) {
                        // Caso 2: Nó é filho direito - rotação esquerda
                        node = parent;
                        this.rotateLeft(node);
                    }
                    // Caso 3: Rotação direita e recolorir
                    this.recolorings++;
                    node.parent.color = BLACK;
                    node.parent.parent.color = RED;
                    this.rotateRight(node.parent.parent);
                }
            } else {
                const uncle = grandparent.left;

                if (uncle && uncle.isRed()) {
                    // Caso 1: Tio é vermelho - recolorir
                    this.recolorings++;
                    parent.color = BLACK;
                    uncle.color = BLACK;
                    grandparent.color = RED;
                    node = grandparent;
                } else {
                    if (node === parent.left) {
                        // Caso 2: Nó é filho esquerdo - rotação direita
                        node = parent;
                        this.rotateRight(node);
                    }
                    // Caso 3: Rotação esquerda e recolorir
                    this.recolorings++;
                    node.parent.color = BLACK;
                    node.parent.parent.color = RED;
                    this.rotateLeft(node.parent.parent);
                }
            }
        }

        this.root.color = BLACK; // Garantir que a raiz seja preta
    }

    /**
     * Remove um valor da árvore
     */
    remove(data) {
        const node = this.search(data);
        if (!node) return this;

        this._removeNode(node);
        this.size--;
        return this;
    }

    _removeNode(node) {
        let nodeToDelete = node;
        let originalColor = nodeToDelete.color;
        let replacement;

        if (!node.left) {
            replacement = node.right;
            this._transplant(node, node.right);
        } else if (!node.right) {
            replacement = node.left;
            this._transplant(node, node.left);
        } else {
            // Nó com dois filhos
            nodeToDelete = this._minimum(node.right);
            originalColor = nodeToDelete.color;
            replacement = nodeToDelete.right;

            if (nodeToDelete.parent === node) {
                if (replacement) replacement.parent = nodeToDelete;
            } else {
                this._transplant(nodeToDelete, nodeToDelete.right);
                nodeToDelete.right = node.right;
                nodeToDelete.right.parent = nodeToDelete;
            }

            this._transplant(node, nodeToDelete);
            nodeToDelete.left = node.left;
            nodeToDelete.left.parent = nodeToDelete;
            nodeToDelete.color = node.color;
        }

        if (originalColor === BLACK && replacement) {
            this._fixRemove(replacement);
        }
    }

    /**
     * Substitui uma subárvore por outra
     */
    _transplant(u, v) {
        if (!u.parent) {
            this.root = v;
        } else if (u === u.parent.left) {
            u.parent.left = v;
        } else {
            u.parent.right = v;
        }

        if (v) {
            v.parent = u.parent;
        }
    }

    /**
     * Encontra o menor nó em uma subárvore
     */
    _minimum(node) {
        while (node.left) {
            node = node.left;
        }
        return node;
    }

    /**
     * Corrige violações após remoção
     */
    _fixRemove(node) {
        while (node !== this.root && node.isBlack()) {
            if (node === node.parent.left) {
                let sibling = node.parent.right;

                if (sibling.isRed()) {
                    sibling.color = BLACK;
                    node.parent.color = RED;
                    this.rotateLeft(node.parent);
                    sibling = node.parent.right;
                }

                if ((!sibling.left || sibling.left.isBlack()) &&
                    (!sibling.right || sibling.right.isBlack())) {
                    sibling.color = RED;
                    node = node.parent;
                } else {
                    if (!sibling.right || sibling.right.isBlack()) {
                        if (sibling.left) sibling.left.color = BLACK;
                        sibling.color = RED;
                        this.rotateRight(sibling);
                        sibling = node.parent.right;
                    }

                    sibling.color = node.parent.color;
                    node.parent.color = BLACK;
                    if (sibling.right) sibling.right.color = BLACK;
                    this.rotateLeft(node.parent);
                    node = this.root;
                }
            } else {
                let sibling = node.parent.left;

                if (sibling.isRed()) {
                    sibling.color = BLACK;
                    node.parent.color = RED;
                    this.rotateRight(node.parent);
                    sibling = node.parent.left;
                }

                if ((!sibling.right || sibling.right.isBlack()) &&
                    (!sibling.left || sibling.left.isBlack())) {
                    sibling.color = RED;
                    node = node.parent;
                } else {
                    if (!sibling.left || sibling.left.isBlack()) {
                        if (sibling.right) sibling.right.color = BLACK;
                        sibling.color = RED;
                        this.rotateLeft(sibling);
                        sibling = node.parent.left;
                    }

                    sibling.color = node.parent.color;
                    node.parent.color = BLACK;
                    if (sibling.left) sibling.left.color = BLACK;
                    this.rotateRight(node.parent);
                    node = this.root;
                }
            }
        }

        node.color = BLACK;
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
     * Verifica se a árvore satisfaz as propriedades Red-Black
     */
    isValidRedBlackTree() {
        if (!this.root) return true;

        // Verificar se a raiz é preta
        if (this.root.isRed()) return false;

        // Verificar outras propriedades
        return this._checkProperties(this.root) !== -1;
    }

    _checkProperties(node) {
        if (!node) return 1; // Folhas nulas são pretas

        // Propriedade 4: Nó vermelho não pode ter filhos vermelhos
        if (node.isRed()) {
            if ((node.left && node.left.isRed()) ||
                (node.right && node.right.isRed())) {
                return -1; // Violação
            }
        }

        const leftBlackHeight = this._checkProperties(node.left);
        const rightBlackHeight = this._checkProperties(node.right);

        // Verificar se há violação nos filhos
        if (leftBlackHeight === -1 || rightBlackHeight === -1) {
            return -1;
        }

        // Propriedade 5: Mesmo número de nós pretos em todos os caminhos
        if (leftBlackHeight !== rightBlackHeight) {
            return -1;
        }

        // Adicionar 1 se o nó atual é preto
        return leftBlackHeight + (node.isBlack() ? 1 : 0);
    }

    /**
     * Calcula a altura preta da árvore
     */
    getBlackHeight() {
        return this._calculateBlackHeight(this.root);
    }

    _calculateBlackHeight(node) {
        if (!node) return 0;

        const leftHeight = this._calculateBlackHeight(node.left);
        const blackAddition = node.isBlack() ? 1 : 0;

        return leftHeight + blackAddition;
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

    /**
     * Obtém estatísticas da árvore
     */
    getStats() {
        return {
            size: this.size,
            height: this._getHeight(this.root),
            blackHeight: this.getBlackHeight(),
            isValid: this.isValidRedBlackTree(),
            rotations: this.rotations,
            recolorings: this.recolorings,
            redNodes: this._countRedNodes(this.root),
            blackNodes: this._countBlackNodes(this.root)
        };
    }

    _getHeight(node) {
        if (!node) return 0;
        return 1 + Math.max(this._getHeight(node.left), this._getHeight(node.right));
    }

    _countRedNodes(node) {
        if (!node) return 0;
        const count = node.isRed() ? 1 : 0;
        return count + this._countRedNodes(node.left) + this._countRedNodes(node.right);
    }

    _countBlackNodes(node) {
        if (!node) return 0;
        const count = node.isBlack() ? 1 : 0;
        return count + this._countBlackNodes(node.left) + this._countBlackNodes(node.right);
    }

    /**
     * Visualiza a estrutura da árvore com cores
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
            const colorSymbol = node.isRed() ? '🔴' : '⚫';
            console.log(prefix + (isLast ? '└── ' : '├── ') +
                `${node.data} ${colorSymbol}`);

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
        this.recolorings = 0;
    }
}

// =====================================
// EXEMPLOS DE USO E DEMONSTRAÇÕES
// =====================================

console.log('=== DEMONSTRAÇÃO RED-BLACK TREE ===\n');

// Criando uma nova árvore Red-Black
const rb = new RedBlackTree();

console.log('1. INSERINDO VALORES');
const values = [10, 5, 15, 3, 7, 12, 18, 1, 4, 6, 8];
values.forEach(val => rb.insert(val));

console.log('Árvore após inserções:');
rb.print();
console.log('\nEstatísticas:', rb.getStats());

console.log('\n2. VERIFICANDO PROPRIEDADES RED-BLACK');
console.log('Árvore válida?', rb.isValidRedBlackTree());
console.log('InOrder (deve estar ordenado):', rb.inOrder());
console.log('Altura preta:', rb.getBlackHeight());

console.log('\n3. TESTANDO REMOÇÕES');
rb.remove(5);
console.log('Após remover 5:');
rb.print();
console.log('Ainda é válida?', rb.isValidRedBlackTree());

// =====================================
// COMPARAÇÃO COM AVL TREE
// =====================================

console.log('\n=== COMPARAÇÃO RED-BLACK vs AVL ===\n');

function compareTreePerformance() {
    const size = 1000;
    const values = Array.from({ length: size }, (_, i) => i + 1);

    console.log(`Comparando inserção de ${size} valores sequenciais:\n`);

    // Red-Black Tree
    const startRB = performance.now();
    const rbTree = new RedBlackTree();
    values.forEach(val => rbTree.insert(val));
    const endRB = performance.now();

    console.log('RED-BLACK TREE:');
    console.log(`  Tempo de inserção: ${(endRB - startRB).toFixed(2)}ms`);
    console.log(`  Altura: ${rbTree._getHeight(rbTree.root)}`);
    console.log(`  Altura preta: ${rbTree.getBlackHeight()}`);
    console.log(`  Rotações: ${rbTree.rotations}`);
    console.log(`  Recolorações: ${rbTree.recolorings}`);
    console.log(`  É válida: ${rbTree.isValidRedBlackTree()}`);

    // Simulação comparativa (conceitual)
    const theoreticalAVLHeight = Math.ceil(Math.log2(size));
    const rbHeight = rbTree._getHeight(rbTree.root);

    console.log(`\nCOMPARAÇÃO:`);
    console.log(`  Altura teórica ideal: ${theoreticalAVLHeight}`);
    console.log(`  Altura Red-Black: ${rbHeight}`);
    console.log(`  Diferença: ${rbHeight - theoreticalAVLHeight}`);
    console.log(`  Red-Black é mais relaxada que AVL`);
}

compareTreePerformance();

// =====================================
// CASOS DE USO PRÁTICOS
// =====================================

console.log('\n=== CASOS DE USO PRÁTICOS ===\n');

// 1. Implementação de Map/Dictionary
console.log('1. IMPLEMENTAÇÃO DE MAP:');
class RedBlackMap {
    constructor() {
        this.tree = new RedBlackTree();
    }

    set(key, value) {
        // Simplificado: apenas chave numérica
        const node = this.tree.search(key);
        if (node) {
            node.value = value;
        } else {
            this.tree.insert(key);
            const newNode = this.tree.search(key);
            newNode.value = value;
        }
    }

    get(key) {
        const node = this.tree.search(key);
        return node ? node.value : undefined;
    }

    has(key) {
        return this.tree.search(key) !== null;
    }

    keys() {
        return this.tree.inOrder();
    }
}

const map = new RedBlackMap();
map.set(10, 'Alice');
map.set(5, 'Bob');
map.set(15, 'Carol');

console.log('Chaves:', map.keys());
console.log('Valor da chave 10:', map.get(10));

// 2. Sistema de intervalos ordenados
console.log('\n2. SISTEMA DE AGENDAMENTO:');
const schedule = new RedBlackTree();
const appointments = [900, 1030, 1200, 1400, 1530]; // Horários em formato HHMM

appointments.forEach(time => schedule.insert(time));
console.log('Horários disponíveis:', schedule.inOrder());

// =====================================
// TESTES UNITÁRIOS
// =====================================

console.log('\n=== TESTES UNITÁRIOS ===\n');

function runRedBlackTests() {
    console.log('Executando testes Red-Black Tree...\n');

    // Teste 1: Inserção e propriedades básicas
    const tree1 = new RedBlackTree();
    tree1.insert(10).insert(5).insert(15);
    console.log('✓ Teste 1 - Inserção básica:', tree1.isValidRedBlackTree());

    // Teste 2: Raiz sempre preta
    const tree2 = new RedBlackTree();
    tree2.insert(1);
    console.log('✓ Teste 2 - Raiz preta:', tree2.root.isBlack());

    // Teste 3: Propriedades após múltiplas inserções
    const tree3 = new RedBlackTree();
    [1, 2, 3, 4, 5, 6, 7, 8, 9, 10].forEach(val => tree3.insert(val));
    console.log('✓ Teste 3 - Sequência 1-10:', tree3.isValidRedBlackTree());

    // Teste 4: Remoção mantém propriedades
    const tree4 = new RedBlackTree();
    [10, 5, 15, 3, 7, 12, 18].forEach(val => tree4.insert(val));
    tree4.remove(10);
    console.log('✓ Teste 4 - Remoção:', tree4.isValidRedBlackTree());

    // Teste 5: Altura limitada
    const tree5 = new RedBlackTree();
    for (let i = 1; i <= 100; i++) tree5.insert(i);
    const maxHeight = 2 * Math.ceil(Math.log2(tree5.size + 1));
    const actualHeight = tree5._getHeight(tree5.root);
    console.log('✓ Teste 5 - Altura limitada:', actualHeight <= maxHeight);

    console.log(`Altura real: ${actualHeight}, Máximo permitido: ${maxHeight}`);
    console.log('\nTodos os testes Red-Black concluídos!');
}

runRedBlackTests();

// Export para uso em outros módulos
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { RedBlackTree, RBNode, RED, BLACK };
}
