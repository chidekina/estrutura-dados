/**
 * FENWICK TREE / BINARY INDEXED TREE (BIT) - ADVANCED MODULE
 * =========================================================
 * 
 * Uma Fenwick Tree (também conhecida como Binary Indexed Tree)
 * é uma estrutura de dados eficiente para:
 * - Calcular somas de prefixo
 * - Atualizar elementos individuais
 * - Consultas de intervalo em arrays
 * 
 * Vantagens sobre Segment Tree:
 * - Menor uso de memória (apenas n+1 elementos)
 * - Implementação mais simples
 * - Constantes menores nas operações
 * 
 * Complexidade:
 * - Construção: O(n log n)
 * - Atualização: O(log n)
 * - Consulta de soma: O(log n)
 * - Espaço: O(n)
 * 
 * Limitações:
 * - Funciona apenas com operações inversíveis (soma, XOR)
 * - Não suporta min/max diretamente
 * - Índices baseados em 1
 */

class FenwickTree {
    constructor(size) {
        if (Array.isArray(size)) {
            // Se receber um array, inicializa com os valores
            this.n = size.length;
            this.tree = new Array(this.n + 1).fill(0);
            this._buildFromArray(size);
        } else {
            // Se receber um número, cria árvore vazia
            this.n = size;
            this.tree = new Array(this.n + 1).fill(0);
        }
        this.operations = 0; // Contador para análise
    }

    /**
     * Constrói a árvore a partir de um array
     */
    _buildFromArray(array) {
        for (let i = 0; i < array.length; i++) {
            this.update(i + 1, array[i]); // Fenwick usa índices 1-based
        }
    }

    /**
     * Obtém o último bit setado (LSB - Least Significant Bit)
     * Propriedade fundamental da Fenwick Tree
     */
    _lsb(x) {
        return x & (-x);
    }

    /**
     * Atualiza o valor no índice especificado
     * @param {number} index - Índice (1-based)
     * @param {number} delta - Valor a ser adicionado
     */
    update(index, delta) {
        if (index < 1 || index > this.n) {
            throw new Error('Índice fora dos limites (1-based indexing)');
        }

        while (index <= this.n) {
            this.tree[index] += delta;
            index += this._lsb(index);
            this.operations++;
        }
    }

    /**
     * Calcula a soma do prefixo [1, index]
     * @param {number} index - Índice final (1-based)
     */
    prefixSum(index) {
        if (index < 0) return 0;
        if (index > this.n) index = this.n;

        let sum = 0;
        while (index > 0) {
            sum += this.tree[index];
            index -= this._lsb(index);
            this.operations++;
        }
        return sum;
    }

    /**
     * Calcula a soma do intervalo [left, right]
     * @param {number} left - Índice inicial (1-based)
     * @param {number} right - Índice final (1-based)
     */
    rangeSum(left, right) {
        if (left > right) return 0;
        return this.prefixSum(right) - this.prefixSum(left - 1);
    }

    /**
     * Obtém o valor no índice especificado
     * @param {number} index - Índice (1-based)
     */
    getValue(index) {
        return this.rangeSum(index, index);
    }

    /**
     * Define o valor no índice especificado
     * @param {number} index - Índice (1-based)
     * @param {number} value - Novo valor
     */
    setValue(index, value) {
        const currentValue = this.getValue(index);
        this.update(index, value - currentValue);
    }

    /**
     * Encontra o maior índice cuja soma de prefixo é <= target
     * Útil para busca binária na árvore
     */
    lowerBound(target) {
        let pos = 0;
        let sum = 0;

        // Começa com a maior potência de 2 <= n
        for (let jump = 1 << Math.floor(Math.log2(this.n)); jump > 0; jump >>= 1) {
            if (pos + jump <= this.n && sum + this.tree[pos + jump] <= target) {
                sum += this.tree[pos + jump];
                pos += jump;
            }
        }

        return pos;
    }

    /**
     * Encontra o k-ésimo menor elemento (1-indexado)
     * Assumindo que os valores são frequências
     */
    kthElement(k) {
        const pos = this.lowerBound(k - 1);
        return pos + 1;
    }

    /**
     * Converte para array normal (0-indexado)
     */
    toArray() {
        const result = [];
        for (let i = 1; i <= this.n; i++) {
            result.push(this.getValue(i));
        }
        return result;
    }

    /**
     * Obtém estatísticas da estrutura
     */
    getStats() {
        return {
            size: this.n,
            totalSum: this.prefixSum(this.n),
            operations: this.operations,
            memoryUsage: `${(this.n + 1) * 8} bytes`,
            efficiency: 'O(log n) por operação'
        };
    }

    /**
     * Visualiza a estrutura interna da árvore
     */
    print() {
        console.log('Array original:', this.toArray());
        console.log('Árvore Fenwick:', this.tree.slice(1));
        console.log('Estrutura binária:');

        for (let i = 1; i <= Math.min(this.n, 16); i++) {
            const binary = i.toString(2).padStart(8, '0');
            const lsb = this._lsb(i);
            const range = `[${i - lsb + 1}, ${i}]`;
            console.log(`  ${i}: ${binary} -> tree[${i}]=${this.tree[i]} (range: ${range})`);
        }
    }

    /**
     * Limpa a árvore
     */
    clear() {
        this.tree.fill(0);
        this.operations = 0;
    }
}

/**
 * FENWICK TREE 2D - Para consultas em matrizes
 */
class FenwickTree2D {
    constructor(rows, cols) {
        this.rows = rows;
        this.cols = cols;
        this.tree = Array(rows + 1).fill().map(() => Array(cols + 1).fill(0));
    }

    /**
     * Atualiza um elemento na posição (row, col)
     */
    update(row, col, delta) {
        for (let i = row; i <= this.rows; i += i & (-i)) {
            for (let j = col; j <= this.cols; j += j & (-j)) {
                this.tree[i][j] += delta;
            }
        }
    }

    /**
     * Consulta soma do retângulo [1,1] até [row, col]
     */
    query(row, col) {
        let sum = 0;
        for (let i = row; i > 0; i -= i & (-i)) {
            for (let j = col; j > 0; j -= j & (-j)) {
                sum += this.tree[i][j];
            }
        }
        return sum;
    }

    /**
     * Consulta soma do retângulo [r1,c1] até [r2,c2]
     */
    rangeQuery(r1, c1, r2, c2) {
        return this.query(r2, c2) - this.query(r1 - 1, c2) -
            this.query(r2, c1 - 1) + this.query(r1 - 1, c1 - 1);
    }
}

/**
 * RANGE UPDATE FENWICK TREE - Para atualizações de intervalo
 */
class RangeFenwickTree {
    constructor(size) {
        this.n = size;
        this.tree = new FenwickTree(size);
    }

    /**
     * Adiciona delta ao intervalo [left, right]
     */
    updateRange(left, right, delta) {
        this.tree.update(left, delta);
        if (right + 1 <= this.n) {
            this.tree.update(right + 1, -delta);
        }
    }

    /**
     * Obtém o valor no índice especificado
     */
    getValue(index) {
        return this.tree.prefixSum(index);
    }

    /**
     * Converte para array
     */
    toArray() {
        const result = [];
        for (let i = 1; i <= this.n; i++) {
            result.push(this.getValue(i));
        }
        return result;
    }
}

// =====================================
// EXEMPLOS DE USO E DEMONSTRAÇÕES
// =====================================

console.log('=== DEMONSTRAÇÃO FENWICK TREE ===\n');

// 1. Criação e operações básicas
console.log('1. OPERAÇÕES BÁSICAS:');
const arr = [1, 3, 5, 7, 9, 11];
const bit = new FenwickTree(arr);

console.log('Array original:', arr);
bit.print();

console.log('\nConsultas de soma:');
console.log('Soma prefixo até 3:', bit.prefixSum(3)); // 1+3+5 = 9
console.log('Soma intervalo [2,4]:', bit.rangeSum(2, 4)); // 3+5+7 = 15
console.log('Soma intervalo [1,6]:', bit.rangeSum(1, 6)); // Toda a soma = 36

console.log('\nAtualizações:');
console.log('Valor no índice 2:', bit.getValue(2)); // 3
bit.update(2, 2); // Adiciona 2 ao índice 2
console.log('Após adicionar 2 ao índice 2:', bit.getValue(2)); // 5
console.log('Nova soma total:', bit.prefixSum(6)); // 38

// 2. Definindo valores específicos
console.log('\n2. DEFININDO VALORES:');
bit.setValue(3, 10); // Define índice 3 como 10
console.log('Após definir índice 3 = 10:', bit.toArray());

// =====================================
// FENWICK TREE 2D DEMO
// =====================================

console.log('\n=== FENWICK TREE 2D ===\n');

const bit2d = new FenwickTree2D(4, 4);

console.log('Criando matriz 4x4 e inserindo valores:');
// Simula uma matriz pequena
const matrix = [
    [1, 2, 3, 4],
    [5, 6, 7, 8],
    [9, 10, 11, 12],
    [13, 14, 15, 16]
];

// Popula a Fenwick Tree 2D
for (let i = 0; i < 4; i++) {
    for (let j = 0; j < 4; j++) {
        bit2d.update(i + 1, j + 1, matrix[i][j]);
    }
}

console.log('Soma do retângulo [1,1] até [2,2]:', bit2d.rangeQuery(1, 1, 2, 2)); // 1+2+5+6 = 14
console.log('Soma do retângulo [2,2] até [4,4]:', bit2d.rangeQuery(2, 2, 4, 4)); // 6+7+8+10+11+12+14+15+16 = 99

// =====================================
// RANGE UPDATE DEMO
// =====================================

console.log('\n=== RANGE UPDATE FENWICK ===\n');

const rangeBit = new RangeFenwickTree(6);

console.log('Array inicial (todos zeros):', rangeBit.toArray());

console.log('Adicionando 5 ao intervalo [2, 4]:');
rangeBit.updateRange(2, 4, 5);
console.log('Resultado:', rangeBit.toArray());

console.log('Adicionando 3 ao intervalo [1, 3]:');
rangeBit.updateRange(1, 3, 3);
console.log('Resultado:', rangeBit.toArray());

// =====================================
// CASOS DE USO ESPECIALIZADOS
// =====================================

console.log('\n=== CASOS DE USO ESPECIALIZADOS ===\n');

// 1. Contador de inversões
console.log('1. CONTADOR DE INVERSÕES:');
function countInversions(arr) {
    const maxVal = Math.max(...arr);
    const bit = new FenwickTree(maxVal);
    let inversions = 0;

    for (let i = arr.length - 1; i >= 0; i--) {
        inversions += bit.prefixSum(arr[i] - 1);
        bit.update(arr[i], 1);
    }

    return inversions;
}

const testArr = [5, 3, 8, 1, 6];
console.log('Array:', testArr);
console.log('Número de inversões:', countInversions(testArr));

// 2. Sistema de ranking dinâmico
console.log('\n2. SISTEMA DE RANKING DINÂMICO:');
class DynamicRanking {
    constructor(maxScore = 1000) {
        this.maxScore = maxScore;
        this.bit = new FenwickTree(maxScore);
        this.players = new Map();
    }

    addPlayer(name, score) {
        if (this.players.has(name)) {
            // Remove score antigo
            const oldScore = this.players.get(name);
            this.bit.update(oldScore, -1);
        }

        this.players.set(name, score);
        this.bit.update(score, 1);
    }

    getRanking(score) {
        // Quantos jogadores têm score maior
        const higherScores = this.bit.rangeSum(score + 1, this.maxScore);
        return higherScores + 1; // Ranking começa em 1
    }

    getPlayersAbove(score) {
        return this.bit.rangeSum(score + 1, this.maxScore);
    }

    getTotalPlayers() {
        return this.bit.prefixSum(this.maxScore);
    }
}

const ranking = new DynamicRanking();
ranking.addPlayer('Alice', 850);
ranking.addPlayer('Bob', 720);
ranking.addPlayer('Carol', 950);
ranking.addPlayer('David', 680);

console.log('Ranking de Alice (850):', ranking.getRanking(850));
console.log('Ranking de Bob (720):', ranking.getRanking(720));
console.log('Jogadores acima de 700:', ranking.getPlayersAbove(700));
console.log('Total de jogadores:', ranking.getTotalPlayers());

// =====================================
// TESTE DE PERFORMANCE
// =====================================

console.log('\n=== TESTE DE PERFORMANCE ===\n');

function testFenwickPerformance() {
    const sizes = [1000, 5000, 10000];

    sizes.forEach(size => {
        console.log(`\nTestando com array de tamanho ${size}:`);

        // Cria array de teste
        const testArray = Array.from({ length: size }, (_, i) => i + 1);

        // Testa Fenwick Tree
        const startBuild = performance.now();
        const fenwick = new FenwickTree(testArray);
        const endBuild = performance.now();

        // Testa consultas
        const startQuery = performance.now();
        for (let i = 0; i < 1000; i++) {
            const left = Math.floor(Math.random() * size / 2) + 1;
            const right = left + Math.floor(Math.random() * (size - left + 1));
            fenwick.rangeSum(left, right);
        }
        const endQuery = performance.now();

        // Testa atualizações
        const startUpdate = performance.now();
        for (let i = 0; i < 1000; i++) {
            const index = Math.floor(Math.random() * size) + 1;
            const delta = Math.floor(Math.random() * 10) - 5;
            fenwick.update(index, delta);
        }
        const endUpdate = performance.now();

        console.log(`  Construção: ${(endBuild - startBuild).toFixed(2)}ms`);
        console.log(`  1000 consultas: ${(endQuery - startQuery).toFixed(2)}ms`);
        console.log(`  1000 atualizações: ${(endUpdate - startUpdate).toFixed(2)}ms`);

        const stats = fenwick.getStats();
        console.log(`  Memória: ${stats.memoryUsage}`);
        console.log(`  Operações realizadas: ${stats.operations}`);
    });
}

testFenwickPerformance();

// =====================================
// ALGORITMOS AVANÇADOS
// =====================================

console.log('\n=== ALGORITMOS AVANÇADOS ===\n');

// 1. Busca do k-ésimo elemento
console.log('1. K-ÉSIMO ELEMENTO:');
const freqBit = new FenwickTree(10);

// Adiciona frequências (simula contagem de elementos)
[1, 3, 2, 1, 4, 2, 3, 1, 2, 5].forEach((val, idx) => {
    freqBit.update(val, 1); // Incrementa frequência do valor
});

console.log('Frequências:', freqBit.toArray());
console.log('2º elemento mais frequente (posição):', freqBit.kthElement(2));
console.log('5º elemento mais frequente (posição):', freqBit.kthElement(5));

// 2. Compressão de coordenadas
console.log('\n2. COMPRESSÃO DE COORDENADAS:');
function compressCoordinates(arr) {
    const sorted = [...new Set(arr)].sort((a, b) => a - b);
    const compressed = new Map();

    sorted.forEach((val, idx) => {
        compressed.set(val, idx + 1); // 1-indexed para Fenwick
    });

    return { mapping: compressed, size: sorted.length };
}

const coords = [100, 50, 200, 50, 300, 100];
const compression = compressCoordinates(coords);
console.log('Coordenadas originais:', coords);
console.log('Mapeamento comprimido:', compression.mapping);

// =====================================
// TESTES UNITÁRIOS
// =====================================

console.log('\n=== TESTES UNITÁRIOS ===\n');

function runFenwickTests() {
    console.log('Executando testes Fenwick Tree...\n');

    // Teste 1: Construção e soma básica
    const tree1 = new FenwickTree([1, 2, 3, 4]);
    console.log('✓ Teste 1 - Construção:', tree1.prefixSum(4) === 10);

    // Teste 2: Atualização
    tree1.update(2, 3); // Adiciona 3 ao índice 2
    console.log('✓ Teste 2 - Atualização:', tree1.rangeSum(1, 4) === 13);

    // Teste 3: Consulta de intervalo
    const tree2 = new FenwickTree([1, 2, 3, 4, 5]);
    console.log('✓ Teste 3 - Intervalo:', tree2.rangeSum(2, 4) === 9);

    // Teste 4: Set value
    tree2.setValue(3, 10);
    console.log('✓ Teste 4 - Set value:', tree2.getValue(3) === 10);

    // Teste 5: Fenwick 2D
    const tree2d = new FenwickTree2D(3, 3);
    tree2d.update(1, 1, 5);
    tree2d.update(2, 2, 3);
    console.log('✓ Teste 5 - 2D:', tree2d.query(2, 2) === 8);

    // Teste 6: Range update
    const rangeTree = new RangeFenwickTree(5);
    rangeTree.updateRange(2, 4, 5);
    const arr = rangeTree.toArray();
    console.log('✓ Teste 6 - Range update:', arr[1] === 5 && arr[3] === 5);

    console.log('\nTodos os testes Fenwick Tree concluídos!');
}

runFenwickTests();

// Export para uso em outros módulos
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        FenwickTree,
        FenwickTree2D,
        RangeFenwickTree,
        DynamicRanking
    };
}
