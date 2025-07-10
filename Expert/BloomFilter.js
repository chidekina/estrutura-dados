/**
 * BLOOM FILTER - EXPERT MODULE
 * ============================
 * 
 * Um Bloom Filter é uma estrutura de dados probabilística space-efficient
 * usada para testar se um elemento pertence a um conjunto.
 * 
 * Características:
 * - Sem falsos negativos (se diz que não está, realmente não está)
 * - Pode ter falsos positivos (se diz que está, pode não estar)
 * - Extremamente eficiente em espaço
 * - Operações em O(k) onde k é o número de funções hash
 * 
 * Parâmetros importantes:
 * - m: tamanho do bit array
 * - n: número esperado de elementos
 * - k: número de funções hash
 * - p: taxa de falsos positivos desejada
 * 
 * Aplicações:
 * - Cache de bancos de dados
 * - Crawlers web (evitar duplicatas)
 * - Sistemas distribuídos (membros de cluster)
 * - Redes (roteamento, detecção de duplicatas)
 * - Blockchain (verificação rápida de transações)
 */

class BloomFilter {
    constructor(expectedElements, falsePositiveRate = 0.01) {
        this.expectedElements = expectedElements;
        this.falsePositiveRate = falsePositiveRate;

        // Calcula parâmetros ótimos
        this.m = this._calculateOptimalBitArraySize(expectedElements, falsePositiveRate);
        this.k = this._calculateOptimalHashFunctions(this.m, expectedElements);

        // Inicializa o bit array
        this.bitArray = new Array(this.m).fill(false);
        this.elementCount = 0;

        // Estatísticas
        this.addOperations = 0;
        this.lookupOperations = 0;
        this.estimatedFalsePositives = 0;

        console.log(`Bloom Filter criado: m=${this.m}, k=${this.k}, p=${falsePositiveRate}`);
    }

    /**
     * Calcula o tamanho ótimo do bit array
     * m = -(n * ln(p)) / (ln(2)^2)
     */
    _calculateOptimalBitArraySize(n, p) {
        return Math.ceil(-(n * Math.log(p)) / (Math.log(2) ** 2));
    }

    /**
     * Calcula o número ótimo de funções hash
     * k = (m/n) * ln(2)
     */
    _calculateOptimalHashFunctions(m, n) {
        return Math.max(1, Math.round((m / n) * Math.log(2)));
    }

    /**
     * Gera múltiplas funções hash usando a técnica de double hashing
     * h_i(x) = (h1(x) + i * h2(x)) mod m
     */
    _getHashes(item) {
        const str = typeof item === 'string' ? item : JSON.stringify(item);
        const hash1 = this._hash1(str);
        const hash2 = this._hash2(str);

        const hashes = [];
        for (let i = 0; i < this.k; i++) {
            const hash = (hash1 + i * hash2) % this.m;
            hashes.push(Math.abs(hash));
        }

        return hashes;
    }

    /**
     * Primeira função hash (FNV-1a modificada)
     */
    _hash1(str) {
        let hash = 2166136261; // FNV offset basis
        for (let i = 0; i < str.length; i++) {
            hash ^= str.charCodeAt(i);
            hash *= 16777619; // FNV prime
        }
        return Math.abs(hash);
    }

    /**
     * Segunda função hash (djb2)
     */
    _hash2(str) {
        let hash = 5381;
        for (let i = 0; i < str.length; i++) {
            hash = ((hash << 5) + hash) + str.charCodeAt(i);
        }
        return Math.abs(hash);
    }

    /**
     * Adiciona um elemento ao filtro
     */
    add(item) {
        const hashes = this._getHashes(item);

        for (const hash of hashes) {
            this.bitArray[hash] = true;
        }

        this.elementCount++;
        this.addOperations++;
    }

    /**
     * Verifica se um elemento pode estar no conjunto
     */
    contains(item) {
        const hashes = this._getHashes(item);
        this.lookupOperations++;

        for (const hash of hashes) {
            if (!this.bitArray[hash]) {
                return false; // Definitivamente não está
            }
        }

        // Pode estar (falso positivo possível)
        return true;
    }

    /**
     * Adiciona múltiplos elementos
     */
    addAll(items) {
        for (const item of items) {
            this.add(item);
        }
    }

    /**
     * Calcula a taxa de falsos positivos atual
     */
    getCurrentFalsePositiveRate() {
        const bitsSet = this.bitArray.filter(bit => bit).length;
        const ratio = bitsSet / this.m;
        return Math.pow(ratio, this.k);
    }

    /**
     * Estima quantos elementos únicos foram adicionados
     * Baseado na fórmula: n ≈ -(m/k) * ln(1 - X/m)
     * onde X é o número de bits setados
     */
    estimateElementCount() {
        const bitsSet = this.bitArray.filter(bit => bit).length;
        if (bitsSet === 0) return 0;
        if (bitsSet === this.m) return Infinity;

        const ratio = bitsSet / this.m;
        return Math.round(-(this.m / this.k) * Math.log(1 - ratio));
    }

    /**
     * Verifica se o filtro está saturado (muitos bits setados)
     */
    isSaturated(threshold = 0.5) {
        const bitsSet = this.bitArray.filter(bit => bit).length;
        return (bitsSet / this.m) > threshold;
    }

    /**
     * Obtém estatísticas detalhadas
     */
    getStats() {
        const bitsSet = this.bitArray.filter(bit => bit).length;
        const fillRatio = bitsSet / this.m;

        return {
            expectedElements: this.expectedElements,
            actualElements: this.elementCount,
            estimatedElements: this.estimateElementCount(),
            bitArraySize: this.m,
            hashFunctions: this.k,
            bitsSet: bitsSet,
            fillRatio: (fillRatio * 100).toFixed(2) + '%',
            designedFalsePositiveRate: (this.falsePositiveRate * 100).toFixed(2) + '%',
            currentFalsePositiveRate: (this.getCurrentFalsePositiveRate() * 100).toFixed(4) + '%',
            memoryUsage: `${Math.ceil(this.m / 8)} bytes`,
            addOperations: this.addOperations,
            lookupOperations: this.lookupOperations,
            isSaturated: this.isSaturated()
        };
    }

    /**
     * Cria uma cópia otimizada do filtro
     */
    optimize() {
        const actualElements = this.estimateElementCount();
        const optimized = new BloomFilter(actualElements, this.falsePositiveRate);

        // Não podemos transferir elementos (não temos lista), 
        // mas podemos sugerir reconstrução
        return optimized;
    }

    /**
     * Serializa o filtro para JSON
     */
    toJSON() {
        return {
            m: this.m,
            k: this.k,
            expectedElements: this.expectedElements,
            falsePositiveRate: this.falsePositiveRate,
            bitArray: this.bitArray,
            elementCount: this.elementCount
        };
    }

    /**
     * Cria filtro a partir de JSON
     */
    static fromJSON(data) {
        const filter = new BloomFilter(data.expectedElements, data.falsePositiveRate);
        filter.m = data.m;
        filter.k = data.k;
        filter.bitArray = data.bitArray;
        filter.elementCount = data.elementCount;
        return filter;
    }

    /**
     * Calcula a união de dois filtros (mesmo m e k)
     */
    union(other) {
        if (this.m !== other.m || this.k !== other.k) {
            throw new Error('Filtros incompatíveis para união');
        }

        const result = new BloomFilter(this.expectedElements, this.falsePositiveRate);
        result.m = this.m;
        result.k = this.k;

        for (let i = 0; i < this.m; i++) {
            result.bitArray[i] = this.bitArray[i] || other.bitArray[i];
        }

        return result;
    }

    /**
     * Calcula a interseção de dois filtros
     */
    intersection(other) {
        if (this.m !== other.m || this.k !== other.k) {
            throw new Error('Filtros incompatíveis para interseção');
        }

        const result = new BloomFilter(this.expectedElements, this.falsePositiveRate);
        result.m = this.m;
        result.k = this.k;

        for (let i = 0; i < this.m; i++) {
            result.bitArray[i] = this.bitArray[i] && other.bitArray[i];
        }

        return result;
    }

    /**
     * Visualização do filtro (para filtros pequenos)
     */
    print() {
        if (this.m > 100) {
            console.log('Filtro muito grande para visualização completa');
            console.log('Primeiros 100 bits:', this.bitArray.slice(0, 100).map(b => b ? '1' : '0').join(''));
            return;
        }

        console.log('Bloom Filter Bit Array:');
        const bits = this.bitArray.map(b => b ? '1' : '0').join('');

        // Quebra em linhas de 50 bits
        for (let i = 0; i < bits.length; i += 50) {
            console.log(bits.slice(i, i + 50));
        }
    }
}

/**
 * COUNTING BLOOM FILTER - Variação que suporta remoção
 */
class CountingBloomFilter {
    constructor(expectedElements, falsePositiveRate = 0.01, counterBits = 4) {
        this.expectedElements = expectedElements;
        this.falsePositiveRate = falsePositiveRate;
        this.counterBits = counterBits;
        this.maxCount = Math.pow(2, counterBits) - 1;

        // Calcula parâmetros
        this.m = Math.ceil(-(expectedElements * Math.log(falsePositiveRate)) / (Math.log(2) ** 2));
        this.k = Math.max(1, Math.round((this.m / expectedElements) * Math.log(2)));

        // Array de contadores em vez de bits
        this.counters = new Array(this.m).fill(0);
        this.elementCount = 0;
    }

    _getHashes(item) {
        const str = typeof item === 'string' ? item : JSON.stringify(item);
        const hash1 = this._hash1(str);
        const hash2 = this._hash2(str);

        const hashes = [];
        for (let i = 0; i < this.k; i++) {
            const hash = (hash1 + i * hash2) % this.m;
            hashes.push(Math.abs(hash));
        }

        return hashes;
    }

    _hash1(str) {
        let hash = 2166136261;
        for (let i = 0; i < str.length; i++) {
            hash ^= str.charCodeAt(i);
            hash *= 16777619;
        }
        return Math.abs(hash);
    }

    _hash2(str) {
        let hash = 5381;
        for (let i = 0; i < str.length; i++) {
            hash = ((hash << 5) + hash) + str.charCodeAt(i);
        }
        return Math.abs(hash);
    }

    add(item) {
        const hashes = this._getHashes(item);

        for (const hash of hashes) {
            if (this.counters[hash] < this.maxCount) {
                this.counters[hash]++;
            }
        }

        this.elementCount++;
    }

    remove(item) {
        if (!this.contains(item)) {
            return false; // Item definitivamente não está
        }

        const hashes = this._getHashes(item);

        // Verifica se todos os contadores são > 0
        for (const hash of hashes) {
            if (this.counters[hash] === 0) {
                return false; // Não pode remover
            }
        }

        // Remove (decrementa contadores)
        for (const hash of hashes) {
            this.counters[hash]--;
        }

        this.elementCount = Math.max(0, this.elementCount - 1);
        return true;
    }

    contains(item) {
        const hashes = this._getHashes(item);

        for (const hash of hashes) {
            if (this.counters[hash] === 0) {
                return false;
            }
        }

        return true;
    }

    getStats() {
        const nonZeroCounters = this.counters.filter(c => c > 0).length;

        return {
            expectedElements: this.expectedElements,
            actualElements: this.elementCount,
            arraySize: this.m,
            hashFunctions: this.k,
            counterBits: this.counterBits,
            maxCounterValue: this.maxCount,
            nonZeroCounters: nonZeroCounters,
            fillRatio: (nonZeroCounters / this.m * 100).toFixed(2) + '%',
            memoryUsage: `${this.m * this.counterBits / 8} bytes`,
            averageCounterValue: (this.counters.reduce((a, b) => a + b, 0) / this.m).toFixed(2)
        };
    }
}

// =====================================
// EXEMPLOS DE USO E DEMONSTRAÇÕES
// =====================================

console.log('=== DEMONSTRAÇÃO BLOOM FILTER ===\n');

// 1. Uso básico
console.log('1. USO BÁSICO:');
const filter = new BloomFilter(1000, 0.01); // 1000 elementos, 1% falsos positivos

// Adiciona elementos
const emails = [
    'user1@example.com',
    'user2@example.com',
    'user3@example.com',
    'admin@company.com',
    'test@domain.org'
];

filter.addAll(emails);

console.log('Emails adicionados:', emails);
console.log('\nTestes de pertencimento:');
console.log('user1@example.com está:', filter.contains('user1@example.com'));
console.log('unknown@test.com está:', filter.contains('unknown@test.com'));
console.log('admin@company.com está:', filter.contains('admin@company.com'));

console.log('\nEstatísticas:');
console.log(filter.getStats());

// 2. Teste de falsos positivos
console.log('\n2. TESTE DE FALSOS POSITIVOS:');
const testFilter = new BloomFilter(100, 0.05); // 5% falsos positivos

// Adiciona números de 1 a 50
for (let i = 1; i <= 50; i++) {
    testFilter.add(i);
}

// Testa números de 51 a 100 (não estão no filtro)
let falsePositives = 0;
const testRange = [];

for (let i = 51; i <= 100; i++) {
    const contains = testFilter.contains(i);
    testRange.push({ number: i, contains: contains });
    if (contains) falsePositives++;
}

console.log(`Falsos positivos encontrados: ${falsePositives}/50 (${(falsePositives / 50 * 100).toFixed(1)}%)`);
console.log('Taxa esperada de falsos positivos: 5%');

// =====================================
// COUNTING BLOOM FILTER DEMO
// =====================================

console.log('\n=== COUNTING BLOOM FILTER ===\n');

const countingFilter = new CountingBloomFilter(100, 0.01);

console.log('Adicionando e removendo elementos:');
countingFilter.add('apple');
countingFilter.add('banana');
countingFilter.add('cherry');

console.log('Após adicionar frutas:');
console.log('apple está:', countingFilter.contains('apple'));
console.log('banana está:', countingFilter.contains('banana'));
console.log('orange está:', countingFilter.contains('orange'));

console.log('\nRemovendo banana:');
countingFilter.remove('banana');
console.log('banana está:', countingFilter.contains('banana'));
console.log('apple ainda está:', countingFilter.contains('apple'));

console.log('\nEstatísticas do Counting Filter:');
console.log(countingFilter.getStats());

// =====================================
// CASOS DE USO PRÁTICOS
// =====================================

console.log('\n=== CASOS DE USO PRÁTICOS ===\n');

// 1. Cache de URL visitadas (Web Crawler)
console.log('1. WEB CRAWLER - URLs VISITADAS:');
class WebCrawler {
    constructor(expectedUrls = 10000) {
        this.visitedUrls = new BloomFilter(expectedUrls, 0.001); // 0.1% falsos positivos
        this.processedCount = 0;
        this.skippedCount = 0;
    }

    shouldVisit(url) {
        if (this.visitedUrls.contains(url)) {
            this.skippedCount++;
            return false; // Provavelmente já visitada
        }
        return true;
    }

    markVisited(url) {
        this.visitedUrls.add(url);
        this.processedCount++;
    }

    getStats() {
        return {
            processed: this.processedCount,
            skipped: this.skippedCount,
            efficiency: ((this.skippedCount / (this.processedCount + this.skippedCount)) * 100).toFixed(1) + '%',
            bloomStats: this.visitedUrls.getStats()
        };
    }
}

const crawler = new WebCrawler(1000);
const urls = [
    'https://example.com/page1',
    'https://example.com/page2',
    'https://test.com/home',
    'https://example.com/page1', // Duplicata
    'https://another.com/about',
    'https://test.com/home', // Duplicata
];

urls.forEach(url => {
    if (crawler.shouldVisit(url)) {
        console.log(`Visitando: ${url}`);
        crawler.markVisited(url);
    } else {
        console.log(`Pulando (já visitada): ${url}`);
    }
});

console.log('\nEstatísticas do Crawler:');
console.log(crawler.getStats());

// 2. Sistema de detecção de spam
console.log('\n2. DETECÇÃO DE SPAM:');
class SpamDetector {
    constructor() {
        this.spamEmails = new BloomFilter(10000, 0.01);
        this.spamDomains = new BloomFilter(1000, 0.05);
        this.loadSpamDatabase();
    }

    loadSpamDatabase() {
        // Simula carregamento de base de spam conhecida
        const knownSpamEmails = [
            'spam@badguy.com',
            'noreply@scammer.org',
            'offer@fakestore.net',
            'winner@lottery-scam.com'
        ];

        const knownSpamDomains = [
            'scammer.org',
            'fakestore.net',
            'badguy.com',
            'lottery-scam.com'
        ];

        this.spamEmails.addAll(knownSpamEmails);
        this.spamDomains.addAll(knownSpamDomains);
    }

    isSpam(email) {
        const domain = email.split('@')[1];

        return {
            email: this.spamEmails.contains(email),
            domain: this.spamDomains.contains(domain),
            isSpam: this.spamEmails.contains(email) || this.spamDomains.contains(domain)
        };
    }

    reportSpam(email) {
        this.spamEmails.add(email);
        const domain = email.split('@')[1];
        this.spamDomains.add(domain);
    }
}

const spamDetector = new SpamDetector();

const testEmails = [
    'user@gmail.com',
    'spam@badguy.com',
    'hello@scammer.org',
    'info@legitimate.com'
];

testEmails.forEach(email => {
    const result = spamDetector.isSpam(email);
    console.log(`${email}: ${result.isSpam ? 'SPAM' : 'OK'} (email: ${result.email}, domain: ${result.domain})`);
});

// 3. Sistema de cache de banco de dados
console.log('\n3. CACHE DE BANCO DE DADOS:');
class DatabaseCache {
    constructor() {
        this.existingKeys = new BloomFilter(50000, 0.01);
        this.cacheHits = 0;
        this.cacheMisses = 0;
        this.databaseQueries = 0;
    }

    // Simula verificação se chave existe antes de consultar DB
    keyExists(key) {
        if (!this.existingKeys.contains(key)) {
            // Definitivamente não existe - evita consulta ao DB
            this.cacheMisses++;
            return false;
        }

        // Pode existir - precisa consultar DB
        this.databaseQueries++;

        // Simula consulta real (50% chance de existir realmente)
        const actuallyExists = Math.random() > 0.5;

        if (actuallyExists) {
            this.cacheHits++;
        } else {
            this.cacheMisses++; // Falso positivo
        }

        return actuallyExists;
    }

    addKey(key) {
        this.existingKeys.add(key);
    }

    getStats() {
        const total = this.cacheHits + this.cacheMisses;
        return {
            cacheHits: this.cacheHits,
            cacheMisses: this.cacheMisses,
            databaseQueries: this.databaseQueries,
            hitRate: total > 0 ? (this.cacheHits / total * 100).toFixed(1) + '%' : '0%',
            queriesAvoided: this.cacheMisses - this.databaseQueries,
            bloomStats: this.existingKeys.getStats()
        };
    }
}

const dbCache = new DatabaseCache();

// Adiciona algumas chaves "existentes"
['user:1001', 'user:1002', 'product:5001', 'order:3001'].forEach(key => {
    dbCache.addKey(key);
});

// Testa várias consultas
const testKeys = [
    'user:1001',    // Existe
    'user:9999',    // Não existe
    'product:5001', // Existe  
    'product:9999', // Não existe
    'order:3001',   // Existe
    'session:1234'  // Não existe
];

testKeys.forEach(key => {
    const exists = dbCache.keyExists(key);
    console.log(`Chave ${key}: ${exists ? 'existe' : 'não existe'}`);
});

console.log('\nEstatísticas do Cache:');
console.log(dbCache.getStats());

// =====================================
// TESTE DE PERFORMANCE
// =====================================

console.log('\n=== TESTE DE PERFORMANCE ===\n');

function testBloomFilterPerformance() {
    const sizes = [1000, 10000, 100000];

    sizes.forEach(size => {
        console.log(`\nTestando com ${size} elementos:`);

        const filter = new BloomFilter(size, 0.01);

        // Teste de inserção
        const startAdd = performance.now();
        for (let i = 0; i < size; i++) {
            filter.add(`item_${i}`);
        }
        const endAdd = performance.now();

        // Teste de consulta
        const startLookup = performance.now();
        let found = 0;
        for (let i = 0; i < 1000; i++) {
            if (filter.contains(`item_${Math.floor(Math.random() * size)}`)) {
                found++;
            }
        }
        const endLookup = performance.now();

        console.log(`  Inserção: ${(endAdd - startAdd).toFixed(2)}ms`);
        console.log(`  1000 consultas: ${(endLookup - startLookup).toFixed(2)}ms`);
        console.log(`  Elementos encontrados: ${found}/1000`);

        const stats = filter.getStats();
        console.log(`  Uso de memória: ${stats.memoryUsage}`);
        console.log(`  Taxa de preenchimento: ${stats.fillRatio}`);
        console.log(`  Taxa de falsos positivos atual: ${stats.currentFalsePositiveRate}`);
    });
}

testBloomFilterPerformance();

// =====================================
// TESTES UNITÁRIOS
// =====================================

console.log('\n=== TESTES UNITÁRIOS ===\n');

function runBloomFilterTests() {
    console.log('Executando testes Bloom Filter...\n');

    // Teste 1: Elementos adicionados são encontrados
    const filter1 = new BloomFilter(100, 0.01);
    filter1.add('test');
    console.log('✓ Teste 1 - Elemento adicionado:', filter1.contains('test'));

    // Teste 2: Sem falsos negativos
    const filter2 = new BloomFilter(100, 0.01);
    const items = ['a', 'b', 'c', 'd', 'e'];
    filter2.addAll(items);
    const allFound = items.every(item => filter2.contains(item));
    console.log('✓ Teste 2 - Sem falsos negativos:', allFound);

    // Teste 3: Counting filter remove elementos
    const countingFilter = new CountingBloomFilter(50, 0.01);
    countingFilter.add('removeme');
    const removedSuccessfully = countingFilter.remove('removeme');
    console.log('✓ Teste 3 - Remoção counting filter:', removedSuccessfully);

    // Teste 4: União de filtros
    const filterA = new BloomFilter(50, 0.01);
    const filterB = new BloomFilter(50, 0.01);
    filterA.add('A');
    filterB.add('B');

    try {
        const union = filterA.union(filterB);
        console.log('✓ Teste 4 - União de filtros: OK');
    } catch (e) {
        console.log('✗ Teste 4 - União de filtros: Falhou');
    }

    // Teste 5: Serialização
    const filter5 = new BloomFilter(100, 0.01);
    filter5.add('serialize');
    const json = filter5.toJSON();
    const restored = BloomFilter.fromJSON(json);
    console.log('✓ Teste 5 - Serialização:', restored.contains('serialize'));

    console.log('\nTodos os testes Bloom Filter concluídos!');
}

runBloomFilterTests();

// Export para uso em outros módulos
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        BloomFilter,
        CountingBloomFilter,
        WebCrawler,
        SpamDetector,
        DatabaseCache
    };
}
