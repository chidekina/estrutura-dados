// Hash Table (Tabela Hash)

// Uma Hash Table é uma estrutura de dados que implementa um array associativo,
// mapeando chaves para valores usando uma função hash. É uma das estruturas
// mais importantes na ciência da computação devido à sua eficiência.

// Características principais:
// - Busca, inserção e remoção em O(1) no caso médio
// - Usa função hash para mapear chaves para índices
// - Precisa lidar com colisões (quando chaves diferentes geram o mesmo hash)
// - Fator de carga afeta a performance

// Métodos de resolução de colisões:
// 1. Chaining (Encadeamento) - usa listas ligadas
// 2. Open Addressing (Endereçamento aberto) - busca próxima posição livre

class HashTable {
    constructor(size = 53) { // Número primo para melhor distribuição
        this.size = size;
        this.table = new Array(size);
        this.count = 0; // Número de elementos
    }

    // Função hash simples (método da divisão)
    hash(key) {
        let hash = 0;
        for (let i = 0; i < key.length; i++) {
            hash = (hash + key.charCodeAt(i) * i) % this.size;
        }
        return hash;
    }

    // Função hash melhorada (djb2)
    hashImproved(key) {
        let hash = 5381;
        for (let i = 0; i < key.length; i++) {
            hash = ((hash << 5) + hash) + key.charCodeAt(i);
        }
        return Math.abs(hash % this.size);
    }

    // Inserir/Atualizar (usando chaining)
    set(key, value) {
        const index = this.hashImproved(key);

        if (!this.table[index]) {
            this.table[index] = [];
        }

        const bucket = this.table[index];

        // Verificar se a chave já existe
        for (let i = 0; i < bucket.length; i++) {
            if (bucket[i][0] === key) {
                bucket[i][1] = value; // Atualizar valor existente
                return;
            }
        }

        // Adicionar nova entrada
        bucket.push([key, value]);
        this.count++;

        // Verificar se precisa redimensionar
        if (this.loadFactor() > 0.75) {
            this.resize();
        }
    }

    // Buscar valor
    get(key) {
        const index = this.hashImproved(key);
        const bucket = this.table[index];

        if (bucket) {
            for (let i = 0; i < bucket.length; i++) {
                if (bucket[i][0] === key) {
                    return bucket[i][1];
                }
            }
        }

        return undefined;
    }

    // Verificar se contém chave
    has(key) {
        return this.get(key) !== undefined;
    }

    // Remover entrada
    delete(key) {
        const index = this.hashImproved(key);
        const bucket = this.table[index];

        if (bucket) {
            for (let i = 0; i < bucket.length; i++) {
                if (bucket[i][0] === key) {
                    bucket.splice(i, 1);
                    this.count--;
                    return true;
                }
            }
        }

        return false;
    }

    // Obter todas as chaves
    keys() {
        const keys = [];
        for (let i = 0; i < this.table.length; i++) {
            if (this.table[i]) {
                for (let j = 0; j < this.table[i].length; j++) {
                    keys.push(this.table[i][j][0]);
                }
            }
        }
        return keys;
    }

    // Obter todos os valores
    values() {
        const values = [];
        for (let i = 0; i < this.table.length; i++) {
            if (this.table[i]) {
                for (let j = 0; j < this.table[i].length; j++) {
                    values.push(this.table[i][j][1]);
                }
            }
        }
        return values;
    }

    // Obter todos os pares chave-valor
    entries() {
        const entries = [];
        for (let i = 0; i < this.table.length; i++) {
            if (this.table[i]) {
                for (let j = 0; j < this.table[i].length; j++) {
                    entries.push([this.table[i][j][0], this.table[i][j][1]]);
                }
            }
        }
        return entries;
    }

    // Calcular fator de carga
    loadFactor() {
        return this.count / this.size;
    }

    // Redimensionar a tabela
    resize() {
        const oldTable = this.table;
        this.size = this.size * 2;
        this.table = new Array(this.size);
        this.count = 0;

        // Reinserir todos os elementos
        for (let i = 0; i < oldTable.length; i++) {
            if (oldTable[i]) {
                for (let j = 0; j < oldTable[i].length; j++) {
                    this.set(oldTable[i][j][0], oldTable[i][j][1]);
                }
            }
        }
    }

    // Limpar tabela
    clear() {
        this.table = new Array(this.size);
        this.count = 0;
    }

    // Verificar se está vazia
    isEmpty() {
        return this.count === 0;
    }

    // Obter tamanho
    getSize() {
        return this.count;
    }

    // Análise de distribuição
    getDistribution() {
        const distribution = {
            bucketsUsed: 0,
            maxChainLength: 0,
            totalChains: 0,
            emptyBuckets: 0,
            chainLengths: []
        };

        for (let i = 0; i < this.table.length; i++) {
            if (this.table[i] && this.table[i].length > 0) {
                distribution.bucketsUsed++;
                distribution.totalChains += this.table[i].length;
                distribution.chainLengths.push(this.table[i].length);

                if (this.table[i].length > distribution.maxChainLength) {
                    distribution.maxChainLength = this.table[i].length;
                }
            } else {
                distribution.emptyBuckets++;
            }
        }

        distribution.averageChainLength = distribution.totalChains / distribution.bucketsUsed || 0;
        distribution.loadFactor = this.loadFactor();

        return distribution;
    }

    // Imprimir tabela
    print() {
        console.log(`\n🗂️ Hash Table (Tamanho: ${this.size}, Elementos: ${this.count})`);
        console.log(`📊 Fator de carga: ${this.loadFactor().toFixed(3)}`);
        console.log("-".repeat(50));

        for (let i = 0; i < this.table.length; i++) {
            if (this.table[i] && this.table[i].length > 0) {
                const chain = this.table[i].map(([k, v]) => `${k}:${v}`).join(' → ');
                console.log(`[${i.toString().padStart(2, '0')}] ${chain}`);
            }
        }

        const dist = this.getDistribution();
        console.log(`\n📈 Estatísticas:`);
        console.log(`   Buckets usados: ${dist.bucketsUsed}/${this.size}`);
        console.log(`   Maior cadeia: ${dist.maxChainLength}`);
        console.log(`   Cadeia média: ${dist.averageChainLength.toFixed(2)}`);
    }
}

// IMPLEMENTAÇÃO COM OPEN ADDRESSING (LINEAR PROBING)
class HashTableOpenAddressing {
    constructor(size = 53) {
        this.size = size;
        this.keys = new Array(size);
        this.values = new Array(size);
        this.deleted = new Array(size).fill(false);
        this.count = 0;
    }

    hash(key) {
        let hash = 5381;
        for (let i = 0; i < key.length; i++) {
            hash = ((hash << 5) + hash) + key.charCodeAt(i);
        }
        return Math.abs(hash % this.size);
    }

    set(key, value) {
        if (this.count >= this.size * 0.75) {
            this.resize();
        }

        let index = this.hash(key);

        while (this.keys[index] !== undefined && this.keys[index] !== key && !this.deleted[index]) {
            index = (index + 1) % this.size;
        }

        if (this.keys[index] === undefined || this.deleted[index]) {
            this.count++;
        }

        this.keys[index] = key;
        this.values[index] = value;
        this.deleted[index] = false;
    }

    get(key) {
        let index = this.hash(key);

        while (this.keys[index] !== undefined) {
            if (this.keys[index] === key && !this.deleted[index]) {
                return this.values[index];
            }
            index = (index + 1) % this.size;
        }

        return undefined;
    }

    delete(key) {
        let index = this.hash(key);

        while (this.keys[index] !== undefined) {
            if (this.keys[index] === key && !this.deleted[index]) {
                this.deleted[index] = true;
                this.count--;
                return true;
            }
            index = (index + 1) % this.size;
        }

        return false;
    }

    resize() {
        const oldKeys = this.keys;
        const oldValues = this.values;
        const oldDeleted = this.deleted;

        this.size = this.size * 2;
        this.keys = new Array(this.size);
        this.values = new Array(this.size);
        this.deleted = new Array(this.size).fill(false);
        this.count = 0;

        for (let i = 0; i < oldKeys.length; i++) {
            if (oldKeys[i] !== undefined && !oldDeleted[i]) {
                this.set(oldKeys[i], oldValues[i]);
            }
        }
    }

    print() {
        console.log(`\n🗂️ Hash Table - Open Addressing (Tamanho: ${this.size}, Elementos: ${this.count})`);
        console.log("-".repeat(50));

        for (let i = 0; i < this.size; i++) {
            if (this.keys[i] !== undefined && !this.deleted[i]) {
                console.log(`[${i.toString().padStart(2, '0')}] ${this.keys[i]}:${this.values[i]}`);
            } else if (this.deleted[i]) {
                console.log(`[${i.toString().padStart(2, '0')}] [DELETED]`);
            }
        }
    }
}

// DEMONSTRAÇÃO E TESTES
console.log("🗂️ TESTANDO HASH TABLES COMPLETAS");
console.log("=".repeat(60));

// Teste 1: Hash Table com Chaining
console.log("\n📍 TESTE 1: Hash Table com Chaining");
const hashTable = new HashTable(7); // Tamanho pequeno para ver colisões

const dados = [
    ["nome", "João"],
    ["idade", 25],
    ["cidade", "São Paulo"],
    ["profissao", "Desenvolvedor"],
    ["email", "joao@email.com"],
    ["telefone", "11999999999"]
];

dados.forEach(([key, value]) => {
    hashTable.set(key, value);
    console.log(`Inserido: ${key} = ${value}`);
});

hashTable.print();

console.log("\n🔍 Testando buscas:");
console.log(`nome: ${hashTable.get("nome")}`);
console.log(`idade: ${hashTable.get("idade")}`);
console.log(`inexistente: ${hashTable.get("inexistente")}`);

console.log("\n📍 TESTE 2: Operações avançadas");
console.log(`Todas as chaves: [${hashTable.keys().join(', ')}]`);
console.log(`Todos os valores: [${hashTable.values().join(', ')}]`);

console.log("\n❌ Testando remoção:");
hashTable.delete("telefone");
console.log("Removido: telefone");
hashTable.print();

// Teste 3: Hash Table com Open Addressing
console.log("\n📍 TESTE 3: Hash Table com Open Addressing");
const hashTableOA = new HashTableOpenAddressing(7);

dados.forEach(([key, value]) => {
    hashTableOA.set(key, value);
});

hashTableOA.print();

// Teste 4: Análise de Performance
console.log("\n📍 TESTE 4: Análise de Performance");

function testarPerformance(estrutura, nome) {
    const inicio = performance.now();

    // Inserir 10000 elementos
    for (let i = 0; i < 10000; i++) {
        estrutura.set(`chave${i}`, `valor${i}`);
    }

    const fimInsercao = performance.now();

    // Buscar elementos
    for (let i = 0; i < 10000; i++) {
        estrutura.get(`chave${i}`);
    }

    const fimBusca = performance.now();

    console.log(`${nome}:`);
    console.log(`  Inserção: ${(fimInsercao - inicio).toFixed(2)}ms`);
    console.log(`  Busca: ${(fimBusca - fimInsercao).toFixed(2)}ms`);
}

const hashPerf = new HashTable(1000);
const hashPerfOA = new HashTableOpenAddressing(1000);

testarPerformance(hashPerf, "Chaining");
testarPerformance(hashPerfOA, "Open Addressing");

// Comparação com Map nativo
const mapNativo = new Map();
testarPerformance({
    set: (k, v) => mapNativo.set(k, v),
    get: (k) => mapNativo.get(k)
}, "Map Nativo");

console.log("\n📊 Análise de distribuição:");
console.log(hashPerf.getDistribution());

console.log("\n✅ TODOS OS TESTES DE HASH TABLE CONCLUÍDOS!");
console.log("🚀 Estrutura fundamental para busca eficiente!");
console.log("=".repeat(60));
