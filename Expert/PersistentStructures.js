/**
 * ESTRUTURAS DE DADOS PERSISTENTES - Nível Expert
 * 
 * Implementações de estruturas de dados persistentes que preservam versões anteriores
 * após modificações, permitindo acesso a qualquer estado histórico.
 * 
 * Autor: Algoritmos e Estruturas de Dados
 * Data: 2024
 */

console.log('='.repeat(80));
console.log('🌟 ESTRUTURAS DE DADOS PERSISTENTES - Expert Level');
console.log('='.repeat(80));

/**
 * TEORIA: ESTRUTURAS PERSISTENTES
 * 
 * Estruturas persistentes mantêm versões anteriores quando modificadas.
 * - Persistência Parcial: apenas adicionar novas versões
 * - Persistência Total: modificar qualquer versão
 * - Compartilhamento estrutural otimiza memória
 */

// =============================================
// PERSISTENT STACK (Path Copying)
// =============================================

class PersistentStack {
    constructor(head = null, size = 0) {
        this.head = head;
        this.size = size;
        this.version = 0;
    }

    // Adiciona elemento criando nova versão
    push(value) {
        const newNode = {
            value: value,
            next: this.head
        };
        const newStack = new PersistentStack(newNode, this.size + 1);
        newStack.version = this.version + 1;
        return newStack;
    }

    // Remove elemento criando nova versão
    pop() {
        if (!this.head) {
            throw new Error("Stack is empty");
        }
        const newStack = new PersistentStack(this.head.next, this.size - 1);
        newStack.version = this.version + 1;
        return { stack: newStack, value: this.head.value };
    }

    // Visualiza o topo sem modificar
    peek() {
        return this.head ? this.head.value : null;
    }

    // Converte para array
    toArray() {
        const result = [];
        let current = this.head;
        while (current) {
            result.push(current.value);
            current = current.next;
        }
        return result;
    }

    isEmpty() {
        return this.size === 0;
    }

    getSize() {
        return this.size;
    }

    getVersion() {
        return this.version;
    }
}

// =============================================
// PERSISTENT ARRAY (Fat Node Method)
// =============================================

class PersistentArray {
    constructor() {
        this.versions = new Map();
        this.currentVersion = 0;
        this.data = new Map(); // Posição -> {versão -> valor}
        this.lengths = new Map(); // Versão -> tamanho
        this.lengths.set(0, 0);
    }

    // Define valor em posição específica
    set(index, value) {
        this.currentVersion++;

        if (!this.data.has(index)) {
            this.data.set(index, new Map());
        }

        this.data.get(index).set(this.currentVersion, value);

        // Atualiza tamanho
        const prevLength = this.lengths.get(this.currentVersion - 1) || 0;
        const newLength = Math.max(prevLength, index + 1);
        this.lengths.set(this.currentVersion, newLength);

        return this.currentVersion;
    }

    // Obtém valor em versão específica
    get(index, version = null) {
        version = version === null ? this.currentVersion : version;

        if (!this.data.has(index)) {
            return undefined;
        }

        const indexVersions = this.data.get(index);

        // Encontra a versão mais recente <= versão solicitada
        let latestVersion = -1;
        for (const v of indexVersions.keys()) {
            if (v <= version && v > latestVersion) {
                latestVersion = v;
            }
        }

        return latestVersion >= 0 ? indexVersions.get(latestVersion) : undefined;
    }

    // Adiciona elemento ao final
    push(value) {
        const currentLength = this.getLength();
        return this.set(currentLength, value);
    }

    // Obtém tamanho em versão específica
    getLength(version = null) {
        version = version === null ? this.currentVersion : version;

        let latestVersion = -1;
        for (const v of this.lengths.keys()) {
            if (v <= version && v > latestVersion) {
                latestVersion = v;
            }
        }

        return latestVersion >= 0 ? this.lengths.get(latestVersion) : 0;
    }

    // Converte versão para array
    toArray(version = null) {
        version = version === null ? this.currentVersion : version;
        const length = this.getLength(version);
        const result = [];

        for (let i = 0; i < length; i++) {
            result.push(this.get(i, version));
        }

        return result;
    }

    getAllVersions() {
        const versions = [];
        for (let v = 0; v <= this.currentVersion; v++) {
            versions.push({
                version: v,
                array: this.toArray(v),
                length: this.getLength(v)
            });
        }
        return versions;
    }
}

// =============================================
// PERSISTENT BINARY TREE (Path Copying)
// =============================================

class PersistentTreeNode {
    constructor(value, left = null, right = null) {
        this.value = value;
        this.left = left;
        this.right = right;
    }
}

class PersistentBinaryTree {
    constructor(root = null, version = 0) {
        this.root = root;
        this.version = version;
    }

    // Insere valor criando nova versão
    insert(value) {
        const newRoot = this._insertRec(this.root, value);
        return new PersistentBinaryTree(newRoot, this.version + 1);
    }

    _insertRec(node, value) {
        if (!node) {
            return new PersistentTreeNode(value);
        }

        // Cria novo nó (path copying)
        if (value < node.value) {
            return new PersistentTreeNode(
                node.value,
                this._insertRec(node.left, value),
                node.right // Reutiliza subárvore direita
            );
        } else if (value > node.value) {
            return new PersistentTreeNode(
                node.value,
                node.left, // Reutiliza subárvore esquerda
                this._insertRec(node.right, value)
            );
        }

        return node; // Valor já existe
    }

    // Busca valor
    search(value) {
        return this._searchRec(this.root, value);
    }

    _searchRec(node, value) {
        if (!node) return false;
        if (value === node.value) return true;
        if (value < node.value) return this._searchRec(node.left, value);
        return this._searchRec(node.right, value);
    }

    // Percurso em ordem
    inorder() {
        const result = [];
        this._inorderRec(this.root, result);
        return result;
    }

    _inorderRec(node, result) {
        if (node) {
            this._inorderRec(node.left, result);
            result.push(node.value);
            this._inorderRec(node.right, result);
        }
    }

    // Estatísticas da árvore
    getStats() {
        return {
            version: this.version,
            size: this.inorder().length,
            height: this._getHeight(this.root)
        };
    }

    _getHeight(node) {
        if (!node) return 0;
        return 1 + Math.max(this._getHeight(node.left), this._getHeight(node.right));
    }
}

// =============================================
// PERSISTENT HASHMAP (HAMT - Hash Array Mapped Trie)
// =============================================

class HAMTNode {
    constructor() {
        this.bitmap = 0; // Bitmap dos índices ocupados
        this.children = []; // Array de filhos
    }

    hasChild(index) {
        return (this.bitmap & (1 << index)) !== 0;
    }

    getChildIndex(index) {
        // Conta bits setados antes do índice
        const mask = (1 << index) - 1;
        return this._popcount(this.bitmap & mask);
    }

    _popcount(n) {
        let count = 0;
        while (n) {
            count += n & 1;
            n >>>= 1;
        }
        return count;
    }
}

class PersistentHashMap {
    constructor(root = null, size = 0, version = 0) {
        this.root = root || new HAMTNode();
        this.size = size;
        this.version = version;
    }

    // Hash simples para demonstração
    _hash(key) {
        let hash = 0;
        for (let i = 0; i < key.length; i++) {
            hash = ((hash << 5) - hash + key.charCodeAt(i)) & 0xffffffff;
        }
        return hash >>> 0; // Converte para unsigned
    }

    // Define chave-valor criando nova versão
    set(key, value) {
        const hash = this._hash(key.toString());
        const { node: newRoot, added } = this._setRec(this.root, key, value, hash, 0);
        const newSize = added ? this.size + 1 : this.size;
        return new PersistentHashMap(newRoot, newSize, this.version + 1);
    }

    _setRec(node, key, value, hash, level) {
        const index = (hash >>> (level * 5)) & 0x1f; // 5 bits por nível

        if (!node.hasChild(index)) {
            // Adiciona novo filho
            const newNode = new HAMTNode();
            newNode.bitmap = node.bitmap | (1 << index);
            newNode.children = [...node.children];

            const childIndex = node.getChildIndex(index);
            newNode.children.splice(childIndex, 0, { key, value });

            return { node: newNode, added: true };
        }

        const childIndex = node.getChildIndex(index);
        const child = node.children[childIndex];

        if (typeof child === 'object' && child.key !== undefined) {
            // É uma folha
            if (child.key === key) {
                // Atualiza valor existente
                const newNode = new HAMTNode();
                newNode.bitmap = node.bitmap;
                newNode.children = [...node.children];
                newNode.children[childIndex] = { key, value };
                return { node: newNode, added: false };
            } else {
                // Conflito - cria subárvore
                const newSubNode = new HAMTNode();
                const oldHash = this._hash(child.key.toString());

                // Recursivamente adiciona ambos os elementos
                const level1 = this._setRec(newSubNode, child.key, child.value, oldHash, level + 1);
                const level2 = this._setRec(level1.node, key, value, hash, level + 1);

                const newNode = new HAMTNode();
                newNode.bitmap = node.bitmap;
                newNode.children = [...node.children];
                newNode.children[childIndex] = level2.node;

                return { node: newNode, added: true };
            }
        } else {
            // É um nó interno
            const result = this._setRec(child, key, value, hash, level + 1);
            const newNode = new HAMTNode();
            newNode.bitmap = node.bitmap;
            newNode.children = [...node.children];
            newNode.children[childIndex] = result.node;

            return { node: newNode, added: result.added };
        }
    }

    // Obtém valor por chave
    get(key) {
        const hash = this._hash(key.toString());
        return this._getRec(this.root, key, hash, 0);
    }

    _getRec(node, key, hash, level) {
        const index = (hash >>> (level * 5)) & 0x1f;

        if (!node.hasChild(index)) {
            return undefined;
        }

        const childIndex = node.getChildIndex(index);
        const child = node.children[childIndex];

        if (typeof child === 'object' && child.key !== undefined) {
            return child.key === key ? child.value : undefined;
        } else {
            return this._getRec(child, key, hash, level + 1);
        }
    }

    // Verifica se tem chave
    has(key) {
        return this.get(key) !== undefined;
    }

    // Converte para objeto
    toObject() {
        const result = {};
        this._collectEntries(this.root, result);
        return result;
    }

    _collectEntries(node, result) {
        for (const child of node.children) {
            if (typeof child === 'object' && child.key !== undefined) {
                result[child.key] = child.value;
            } else {
                this._collectEntries(child, result);
            }
        }
    }

    getSize() {
        return this.size;
    }

    getVersion() {
        return this.version;
    }
}

// =============================================
// DEMONSTRAÇÕES E TESTES
// =============================================

console.log('\n📚 1. PERSISTENT STACK - Path Copying');
console.log('─'.repeat(50));

// Demonstração Persistent Stack
let stack1 = new PersistentStack();
console.log('Stack inicial:', stack1.toArray(), '(versão', stack1.getVersion() + ')');

let stack2 = stack1.push(10);
console.log('Após push(10):', stack2.toArray(), '(versão', stack2.getVersion() + ')');

let stack3 = stack2.push(20);
console.log('Após push(20):', stack3.toArray(), '(versão', stack3.getVersion() + ')');

let stack4 = stack3.push(30);
console.log('Após push(30):', stack4.toArray(), '(versão', stack4.getVersion() + ')');

// Stack original permanece inalterada
console.log('Stack original:', stack1.toArray(), '(versão', stack1.getVersion() + ')');
console.log('Stack intermediária:', stack2.toArray(), '(versão', stack2.getVersion() + ')');

// Pop em diferentes versões
const { stack: stack5, value } = stack4.pop();
console.log('Após pop():', stack5.toArray(), '- removido:', value);

console.log('\n📚 2. PERSISTENT ARRAY - Fat Node Method');
console.log('─'.repeat(50));

// Demonstração Persistent Array
const pArray = new PersistentArray();

console.log('Versão 0 (inicial):', pArray.toArray(0));

const v1 = pArray.push('A');
console.log('Versão', v1, '(push A):', pArray.toArray(v1));

const v2 = pArray.push('B');
console.log('Versão', v2, '(push B):', pArray.toArray(v2));

const v3 = pArray.set(0, 'X');
console.log('Versão', v3, '(set[0]=X):', pArray.toArray(v3));

const v4 = pArray.push('C');
console.log('Versão', v4, '(push C):', pArray.toArray(v4));

// Acesso a versões anteriores
console.log('\nHistórico de versões:');
pArray.getAllVersions().forEach(({ version, array, length }) => {
    console.log(`  Versão ${version}: [${array.join(', ')}] (tamanho: ${length})`);
});

console.log('\n📚 3. PERSISTENT BINARY TREE - Structural Sharing');
console.log('─'.repeat(50));

// Demonstração Persistent Tree
let tree1 = new PersistentBinaryTree();
console.log('Árvore inicial:', tree1.inorder(), tree1.getStats());

let tree2 = tree1.insert(10);
console.log('Após insert(10):', tree2.inorder(), tree2.getStats());

let tree3 = tree2.insert(5);
console.log('Após insert(5):', tree3.inorder(), tree3.getStats());

let tree4 = tree3.insert(15);
console.log('Após insert(15):', tree4.inorder(), tree4.getStats());

let tree5 = tree4.insert(3);
console.log('Após insert(3):', tree5.inorder(), tree5.getStats());

// Árvores anteriores permanecem inalteradas
console.log('\nVersões anteriores:');
console.log('Tree1:', tree1.inorder());
console.log('Tree2:', tree2.inorder());
console.log('Tree3:', tree3.inorder());
console.log('Tree4:', tree4.inorder());
console.log('Tree5 (atual):', tree5.inorder());

console.log('\n📚 4. PERSISTENT HASHMAP - HAMT');
console.log('─'.repeat(50));

// Demonstração Persistent HashMap
let map1 = new PersistentHashMap();
console.log('Map inicial:', map1.toObject(), '(versão', map1.getVersion() + ', tamanho:', map1.getSize() + ')');

let map2 = map1.set('nome', 'João');
console.log('Após set(nome, João):', map2.toObject(), '(versão', map2.getVersion() + ', tamanho:', map2.getSize() + ')');

let map3 = map2.set('idade', 25);
console.log('Após set(idade, 25):', map3.toObject(), '(versão', map3.getVersion() + ', tamanho:', map3.getSize() + ')');

let map4 = map3.set('cidade', 'São Paulo');
console.log('Após set(cidade, SP):', map4.toObject(), '(versão', map4.getVersion() + ', tamanho:', map4.getSize() + ')');

let map5 = map4.set('nome', 'Maria'); // Atualiza valor existente
console.log('Após set(nome, Maria):', map5.toObject(), '(versão', map5.getVersion() + ', tamanho:', map5.getSize() + ')');

// Maps anteriores permanecem inalterados
console.log('\nHistórico de versões:');
console.log('Map1:', map1.toObject());
console.log('Map2:', map2.toObject());
console.log('Map3:', map3.toObject());
console.log('Map4:', map4.toObject());
console.log('Map5:', map5.toObject());

// =============================================
// TESTES DE PERFORMANCE
// =============================================

console.log('\n📊 ANÁLISE DE PERFORMANCE');
console.log('─'.repeat(50));

function testPersistentStackPerformance() {
    console.log('\n🔧 Persistent Stack Performance:');

    const iterations = 1000;
    let stack = new PersistentStack();
    const versions = [];

    const start = Date.now();

    // Cria múltiplas versões
    for (let i = 0; i < iterations; i++) {
        stack = stack.push(i);
        if (i % 100 === 0) {
            versions.push(stack);
        }
    }

    const end = Date.now();

    console.log(`  ${iterations} pushes: ${end - start}ms`);
    console.log(`  Versões salvas: ${versions.length}`);
    console.log(`  Tamanho final: ${stack.getSize()}`);

    // Testa acesso a versões antigas
    const accessStart = Date.now();
    versions.forEach(v => v.peek());
    const accessEnd = Date.now();

    console.log(`  Acesso a versões antigas: ${accessEnd - accessStart}ms`);
}

function testPersistentArrayPerformance() {
    console.log('\n🔧 Persistent Array Performance:');

    const pArr = new PersistentArray();
    const iterations = 500;
    const versions = [];

    const start = Date.now();

    for (let i = 0; i < iterations; i++) {
        const version = pArr.push(`item${i}`);
        if (i % 50 === 0) {
            versions.push(version);
        }
    }

    const end = Date.now();

    console.log(`  ${iterations} pushes: ${end - start}ms`);
    console.log(`  Versões salvas: ${versions.length}`);
    console.log(`  Tamanho final: ${pArr.getLength()}`);

    // Testa acesso a versões históricas
    const accessStart = Date.now();
    versions.forEach(v => pArr.toArray(v));
    const accessEnd = Date.now();

    console.log(`  Reconstrução de versões: ${accessEnd - accessStart}ms`);
}

function testPersistentTreePerformance() {
    console.log('\n🔧 Persistent Tree Performance:');

    let tree = new PersistentBinaryTree();
    const iterations = 100;
    const versions = [];

    const start = Date.now();

    for (let i = 0; i < iterations; i++) {
        tree = tree.insert(Math.floor(Math.random() * 1000));
        if (i % 10 === 0) {
            versions.push(tree);
        }
    }

    const end = Date.now();

    console.log(`  ${iterations} inserts: ${end - start}ms`);
    console.log(`  Versões salvas: ${versions.length}`);
    console.log(`  Tamanho final: ${tree.getStats().size}`);
    console.log(`  Altura final: ${tree.getStats().height}`);

    // Testa busca em versões diferentes
    const searchStart = Date.now();
    versions.forEach(v => v.search(500));
    const searchEnd = Date.now();

    console.log(`  Buscas em versões históricas: ${searchEnd - searchStart}ms`);
}

// Executa testes de performance
testPersistentStackPerformance();
testPersistentArrayPerformance();
testPersistentTreePerformance();

// =============================================
// CASOS DE USO PRÁTICOS
// =============================================

console.log('\n🎯 CASOS DE USO PRÁTICOS');
console.log('─'.repeat(50));

// 1. Sistema de Controle de Versão Simples
console.log('\n1. Sistema de Controle de Versão:');
const documento = new PersistentArray();
const v1_doc = documento.push('# Título');
const v2_doc = documento.set(1, '## Introdução', v1_doc);
const v3_doc = documento.push('Conteúdo...', v2_doc);

console.log('  Versão 1:', documento.toArray(v1_doc));
console.log('  Versão 2:', documento.toArray(v2_doc));
console.log('  Versão 3:', documento.toArray(v3_doc));

// 2. Undo/Redo System
console.log('\n2. Sistema Undo/Redo:');
let estado = new PersistentHashMap();
let historico = [estado];

// Operações
estado = estado.set('x', 10);
historico.push(estado);

estado = estado.set('y', 20);
historico.push(estado);

estado = estado.set('x', 15);
historico.push(estado);

console.log('  Estado atual:', estado.toObject());
console.log('  Undo 1:', historico[historico.length - 2].toObject());
console.log('  Undo 2:', historico[historico.length - 3].toObject());

// 3. Snapshot de Configurações
console.log('\n3. Snapshots de Configuração:');
let config = new PersistentHashMap();
const snapshots = new Map();

config = config.set('theme', 'dark');
config = config.set('language', 'pt');
snapshots.set('v1.0', config);

config = config.set('theme', 'light');
config = config.set('notifications', true);
snapshots.set('v1.1', config);

console.log('  Config v1.0:', snapshots.get('v1.0').toObject());
console.log('  Config v1.1:', snapshots.get('v1.1').toObject());

console.log('\n✅ ESTRUTURAS PERSISTENTES - Demonstração Completa!');
console.log('📊 Complexidades:');
console.log('  - Stack Push/Pop: O(1)');
console.log('  - Array Get/Set: O(log n) amortizado');
console.log('  - Tree Insert/Search: O(log n)');
console.log('  - HashMap Get/Set: O(log n)');
console.log('🔬 Vantagens: Versionamento, Imutabilidade, Compartilhamento estrutural');
console.log('🎯 Usos: Undo/Redo, Controle de versão, Programação funcional');

export {
    PersistentStack,
    PersistentArray,
    PersistentBinaryTree,
    PersistentHashMap
};
