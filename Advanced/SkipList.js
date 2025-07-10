/**
 * SKIP LIST - Estrutura de Dados Probabilística - Nível Advanced/Expert
 * 
 * Implementação completa de Skip List com múltiplos níveis e busca eficiente.
 * Uma alternativa probabilística às árvores balanceadas.
 * 
 * Autor: Algoritmos e Estruturas de Dados
 * Data: 2024
 */

console.log('='.repeat(80));
console.log('🎲 SKIP LIST - Estrutura Probabilística');
console.log('='.repeat(80));

/**
 * TEORIA: SKIP LIST
 * 
 * Skip List é uma estrutura de dados probabilística que permite busca,
 * inserção e remoção em O(log n) esperado.
 * 
 * - Múltiplos níveis de listas ligadas
 * - Cada nível "pula" alguns elementos
 * - Probabilidade 1/2 de promover para próximo nível
 * - Alternativa simples às árvores AVL/Red-Black
 */

// =============================================
// SKIP LIST NODE
// =============================================

class SkipListNode {
    constructor(key, value, level) {
        this.key = key;
        this.value = value;
        this.forward = new Array(level + 1).fill(null);
    }
}

// =============================================
// SKIP LIST IMPLEMENTATION
// =============================================

class SkipList {
    constructor(maxLevel = 16, probability = 0.5) {
        this.maxLevel = maxLevel;
        this.probability = probability;
        this.level = 0;
        this.header = new SkipListNode(null, null, maxLevel);
        this.size = 0;
    }

    // Gera nível aleatório baseado na probabilidade
    randomLevel() {
        let level = 0;
        while (Math.random() < this.probability && level < this.maxLevel) {
            level++;
        }
        return level;
    }

    // Insere elemento na Skip List
    insert(key, value) {
        const update = new Array(this.maxLevel + 1);
        let current = this.header;

        // Encontra posição de inserção em cada nível
        for (let i = this.level; i >= 0; i--) {
            while (current.forward[i] && current.forward[i].key < key) {
                current = current.forward[i];
            }
            update[i] = current;
        }

        current = current.forward[0];

        // Se chave já existe, atualiza valor
        if (current && current.key === key) {
            current.value = value;
            return;
        }

        // Cria novo nó
        const newLevel = this.randomLevel();
        const newNode = new SkipListNode(key, value, newLevel);

        // Atualiza level da lista se necessário
        if (newLevel > this.level) {
            for (let i = this.level + 1; i <= newLevel; i++) {
                update[i] = this.header;
            }
            this.level = newLevel;
        }

        // Insere o nó
        for (let i = 0; i <= newLevel; i++) {
            newNode.forward[i] = update[i].forward[i];
            update[i].forward[i] = newNode;
        }

        this.size++;
    }

    // Busca elemento
    search(key) {
        let current = this.header;

        // Busca do nível mais alto para o mais baixo
        for (let i = this.level; i >= 0; i--) {
            while (current.forward[i] && current.forward[i].key < key) {
                current = current.forward[i];
            }
        }

        current = current.forward[0];
        return current && current.key === key ? current.value : null;
    }

    // Remove elemento
    delete(key) {
        const update = new Array(this.maxLevel + 1);
        let current = this.header;

        // Encontra nó a ser removido
        for (let i = this.level; i >= 0; i--) {
            while (current.forward[i] && current.forward[i].key < key) {
                current = current.forward[i];
            }
            update[i] = current;
        }

        current = current.forward[0];

        if (!current || current.key !== key) {
            return false;
        }

        // Remove o nó de todos os níveis
        for (let i = 0; i <= this.level; i++) {
            if (update[i].forward[i] !== current) break;
            update[i].forward[i] = current.forward[i];
        }

        // Atualiza level da lista
        while (this.level > 0 && !this.header.forward[this.level]) {
            this.level--;
        }

        this.size--;
        return true;
    }

    // Busca por range
    rangeSearch(minKey, maxKey) {
        const result = [];
        let current = this.header;

        // Vai para o primeiro elemento >= minKey
        for (let i = this.level; i >= 0; i--) {
            while (current.forward[i] && current.forward[i].key < minKey) {
                current = current.forward[i];
            }
        }

        current = current.forward[0];

        // Coleta elementos no range
        while (current && current.key <= maxKey) {
            result.push({ key: current.key, value: current.value });
            current = current.forward[0];
        }

        return result;
    }

    // Encontra K menores elementos
    findKSmallest(k) {
        const result = [];
        let current = this.header.forward[0];
        let count = 0;

        while (current && count < k) {
            result.push({ key: current.key, value: current.value });
            current = current.forward[0];
            count++;
        }

        return result;
    }

    // Encontra predecessor de uma chave
    predecessor(key) {
        let current = this.header;
        let predecessor = null;

        for (let i = this.level; i >= 0; i--) {
            while (current.forward[i] && current.forward[i].key < key) {
                current = current.forward[i];
                if (current.key !== null) {
                    predecessor = current;
                }
            }
        }

        return predecessor ? { key: predecessor.key, value: predecessor.value } : null;
    }

    // Encontra sucessor de uma chave
    successor(key) {
        let current = this.header;

        for (let i = this.level; i >= 0; i--) {
            while (current.forward[i] && current.forward[i].key <= key) {
                current = current.forward[i];
            }
        }

        current = current.forward[0];
        return current ? { key: current.key, value: current.value } : null;
    }

    // Converte para array ordenado
    toArray() {
        const result = [];
        let current = this.header.forward[0];

        while (current) {
            result.push({ key: current.key, value: current.value });
            current = current.forward[0];
        }

        return result;
    }

    // Visualiza estrutura da Skip List
    display() {
        console.log('\nEstrutura da Skip List:');
        for (let level = this.level; level >= 0; level--) {
            let current = this.header.forward[level];
            let line = `Nível ${level}: `;

            while (current) {
                line += `[${current.key}:${current.value}] -> `;
                current = current.forward[level];
            }
            line += 'NULL';
            console.log(line);
        }
    }

    // Estatísticas da Skip List
    getStats() {
        const levels = new Array(this.level + 1).fill(0);
        let current = this.header.forward[0];

        while (current) {
            for (let i = 0; i < current.forward.length; i++) {
                if (current.forward[i] !== null || i === 0) {
                    levels[i]++;
                } else {
                    break;
                }
            }
            current = current.forward[0];
        }

        return {
            size: this.size,
            maxLevel: this.maxLevel,
            currentLevel: this.level,
            probability: this.probability,
            levelsDistribution: levels,
            averageLevel: levels.reduce((sum, count, level) => sum + count * level, 0) / this.size || 0
        };
    }

    // Verifica integridade da estrutura
    validateStructure() {
        const issues = [];

        // Verifica ordenação
        let current = this.header.forward[0];
        let prevKey = null;

        while (current) {
            if (prevKey !== null && current.key <= prevKey) {
                issues.push(`Ordem violada: ${prevKey} >= ${current.key}`);
            }
            prevKey = current.key;
            current = current.forward[0];
        }

        // Verifica consistência dos níveis
        for (let level = 0; level <= this.level; level++) {
            current = this.header.forward[level];
            while (current) {
                if (level > 0 && !current.forward[level - 1]) {
                    issues.push(`Inconsistência no nível ${level} para chave ${current.key}`);
                }
                current = current.forward[level];
            }
        }

        return {
            isValid: issues.length === 0,
            issues: issues
        };
    }

    isEmpty() {
        return this.size === 0;
    }

    getSize() {
        return this.size;
    }
}

// =============================================
// DEMONSTRAÇÕES E TESTES
// =============================================

console.log('\n📚 1. OPERAÇÕES BÁSICAS');
console.log('─'.repeat(50));

// Demonstração básica
const skipList = new SkipList(4, 0.5);

console.log('Inserindo elementos: 3, 6, 7, 9, 12, 19, 17, 26, 21, 25');
const elements = [3, 6, 7, 9, 12, 19, 17, 26, 21, 25];
elements.forEach(val => skipList.insert(val, `valor_${val}`));

skipList.display();

console.log('\nArray ordenado:', skipList.toArray());
console.log('Tamanho:', skipList.getSize());

console.log('\n📚 2. OPERAÇÕES DE BUSCA');
console.log('─'.repeat(50));

// Testes de busca
console.log('Buscar 7:', skipList.search(7));
console.log('Buscar 15 (não existe):', skipList.search(15));

// Range search
console.log('Range [9, 21]:', skipList.rangeSearch(9, 21));

// K menores
console.log('3 menores elementos:', skipList.findKSmallest(3));

// Predecessor e sucessor
console.log('Predecessor de 20:', skipList.predecessor(20));
console.log('Sucessor de 20:', skipList.successor(20));

console.log('\n📚 3. OPERAÇÕES DE REMOÇÃO');
console.log('─'.repeat(50));

console.log('Removendo 7:', skipList.delete(7));
console.log('Removendo 15 (não existe):', skipList.delete(15));

console.log('\nApós remoções:');
skipList.display();
console.log('Array:', skipList.toArray());

console.log('\n📚 4. ESTATÍSTICAS E VALIDAÇÃO');
console.log('─'.repeat(50));

const stats = skipList.getStats();
console.log('Estatísticas:', stats);

const validation = skipList.validateStructure();
console.log('Validação:', validation.isValid ? 'Estrutura válida' : validation.issues);

// =============================================
// COMPARAÇÃO DE PERFORMANCE
// =============================================

console.log('\n📊 ANÁLISE DE PERFORMANCE');
console.log('─'.repeat(50));

function testSkipListPerformance() {
    console.log('\n🔧 Skip List Performance Test:');

    const sizes = [1000, 5000, 10000];

    sizes.forEach(size => {
        console.log(`\n  Testando com ${size} elementos:`);

        const sl = new SkipList();
        const elements = Array.from({ length: size }, () => Math.floor(Math.random() * size * 10));

        // Teste de inserção
        const insertStart = Date.now();
        elements.forEach((val, idx) => sl.insert(val, idx));
        const insertEnd = Date.now();

        // Teste de busca
        const searchStart = Date.now();
        for (let i = 0; i < 100; i++) {
            sl.search(elements[Math.floor(Math.random() * elements.length)]);
        }
        const searchEnd = Date.now();

        // Teste de remoção
        const deleteStart = Date.now();
        for (let i = 0; i < 100; i++) {
            sl.delete(elements[i]);
        }
        const deleteEnd = Date.now();

        console.log(`    Inserção: ${insertEnd - insertStart}ms`);
        console.log(`    Busca (100x): ${searchEnd - searchStart}ms`);
        console.log(`    Remoção (100x): ${deleteEnd - deleteStart}ms`);

        const finalStats = sl.getStats();
        console.log(`    Nível médio: ${finalStats.averageLevel.toFixed(2)}`);
        console.log(`    Nível máximo usado: ${finalStats.currentLevel}`);
    });
}

function compareWithArray() {
    console.log('\n🔧 Comparação: Skip List vs Array Ordenado:');

    const size = 5000;
    const elements = Array.from({ length: size }, () => Math.floor(Math.random() * size * 10));

    // Skip List
    const sl = new SkipList();
    const slStart = Date.now();
    elements.forEach((val, idx) => sl.insert(val, idx));
    const slEnd = Date.now();

    // Array ordenado
    const arr = [];
    const arrStart = Date.now();
    elements.forEach(val => {
        let pos = 0;
        while (pos < arr.length && arr[pos] < val) pos++;
        arr.splice(pos, 0, val);
    });
    const arrEnd = Date.now();

    console.log(`  Skip List: ${slEnd - slStart}ms`);
    console.log(`  Array ordenado: ${arrEnd - arrStart}ms`);

    // Teste de busca
    const searchElements = elements.slice(0, 100);

    const slSearchStart = Date.now();
    searchElements.forEach(val => sl.search(val));
    const slSearchEnd = Date.now();

    const arrSearchStart = Date.now();
    searchElements.forEach(val => arr.includes(val));
    const arrSearchEnd = Date.now();

    console.log(`  Busca Skip List: ${slSearchEnd - slSearchStart}ms`);
    console.log(`  Busca Array: ${arrSearchEnd - arrSearchStart}ms`);
}

// Executa testes de performance
testSkipListPerformance();
compareWithArray();

// =============================================
// CASOS DE USO PRÁTICOS
// =============================================

console.log('\n🎯 CASOS DE USO PRÁTICOS');
console.log('─'.repeat(50));

// 1. Índice de Base de Dados
console.log('\n1. Índice de Base de Dados:');
const dbIndex = new SkipList();

// Simula índice por ID
const users = [
    { id: 1001, name: 'Alice' },
    { id: 1005, name: 'Bob' },
    { id: 1010, name: 'Charlie' },
    { id: 1015, name: 'Diana' },
    { id: 1020, name: 'Eve' }
];

users.forEach(user => dbIndex.insert(user.id, user));

console.log('  Buscar usuário 1010:', dbIndex.search(1010));
console.log('  Usuários ID 1005-1015:', dbIndex.rangeSearch(1005, 1015));

// 2. Sistema de Rankings
console.log('\n2. Sistema de Rankings (Score):');
const ranking = new SkipList();

const players = [
    { score: 2500, name: 'Pro1' },
    { score: 2200, name: 'Pro2' },
    { score: 1800, name: 'Amateur1' },
    { score: 1500, name: 'Amateur2' },
    { score: 1200, name: 'Novice1' }
];

players.forEach(player => ranking.insert(player.score, player.name));

console.log('  Top 3 players:', ranking.findKSmallest(3));
console.log('  Players score 1500-2000:', ranking.rangeSearch(1500, 2000));

// 3. Cache com Timestamp
console.log('\n3. Cache com Timestamp:');
const cache = new SkipList();

const now = Date.now();
const cacheItems = [
    { key: 'user:123', timestamp: now - 1000, data: 'userData123' },
    { key: 'user:456', timestamp: now - 2000, data: 'userData456' },
    { key: 'user:789', timestamp: now - 3000, data: 'userData789' }
];

cacheItems.forEach(item => cache.insert(item.timestamp, item));

const cutoff = now - 2500;
console.log(`  Items mais antigos que ${cutoff}:`, cache.rangeSearch(0, cutoff));

// 4. Sugestões Autocomplete
console.log('\n4. Sistema de Sugestões:');
const suggestions = new SkipList();

const words = ['apple', 'application', 'apply', 'approach', 'approximate', 'banana', 'band', 'bank'];
words.forEach(word => suggestions.insert(word, word.length));

// Simula busca por prefixo "app"
const prefix = 'app';
const matches = suggestions.toArray().filter(item =>
    item.key.startsWith(prefix)
).slice(0, 3);

console.log(`  Sugestões para "${prefix}":`, matches);

console.log('\n✅ SKIP LIST - Demonstração Completa!');
console.log('📊 Complexidades:');
console.log('  - Busca: O(log n) esperado');
console.log('  - Inserção: O(log n) esperado');
console.log('  - Remoção: O(log n) esperado');
console.log('  - Espaço: O(n)');
console.log('🔬 Vantagens: Simples implementação, boa performance, probabilístico');
console.log('🎯 Usos: Índices DB, Rankings, Cache, Estruturas ordenadas');

export { SkipList, SkipListNode };
