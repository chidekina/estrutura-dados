/**
 * SEGMENT TREE (ÁRVORE DE SEGMENTOS) - ADVANCED MODULE
 * ===================================================
 * 
 * Uma Segment Tree é uma estrutura de dados em árvore que permite
 * consultas e atualizações eficientes em intervalos de um array.
 * 
 * Características:
 * - Consultas de intervalo em O(log n)
 * - Atualizações em O(log n)
 * - Construção em O(n)
 * - Espaço O(4n) no pior caso
 * 
 * Operações suportadas:
 * - Soma de intervalo
 * - Mínimo/Máximo de intervalo
 * - Atualização pontual
 * - Atualização de intervalo (com lazy propagation)
 * 
 * Casos de uso:
 * - Range Sum Queries (RSQ)
 * - Range Minimum/Maximum Queries (RMQ)
 * - Problemas de programação competitiva
 * - Sistemas de análise de dados em tempo real
 */

class SegmentTree {
    constructor(array, operation = 'sum') {
        this.n = array.length;
        this.operation = operation;
        this.tree = new Array(4 * this.n);
        this.lazy = new Array(4 * this.n).fill(0); // Para lazy propagation
        this.originalArray = [...array];

        this._setOperationFunctions(operation);
        this._build(array, 1, 0, this.n - 1);
    }

    /**
     * Define as funções baseadas na operação escolhida
     */
    _setOperationFunctions(operation) {
        switch (operation) {
            case 'sum':
                this.combine = (a, b) => a + b;
                this.identity = 0;
                break;
            case 'min':
                this.combine = (a, b) => Math.min(a, b);
                this.identity = Infinity;
                break;
            case 'max':
                this.combine = (a, b) => Math.max(a, b);
                this.identity = -Infinity;
                break;
            case 'gcd':
                this.combine = (a, b) => this._gcd(a, b);
                this.identity = 0;
                break;
            default:
                throw new Error('Operação não suportada');
        }
    }

    /**
     * Calcula o GCD de dois números
     */
    _gcd(a, b) {
        while (b !== 0) {
            [a, b] = [b, a % b];
        }
        return a;
    }

    /**
     * Constrói a árvore de segmentos
     */
    _build(array, node, start, end) {
        if (start === end) {
            // Nó folha
            this.tree[node] = array[start];
        } else {
            const mid = Math.floor((start + end) / 2);

            // Constrói recursivamente os filhos
            this._build(array, 2 * node, start, mid);
            this._build(array, 2 * node + 1, mid + 1, end);

            // Combina os valores dos filhos
            this.tree[node] = this.combine(
                this.tree[2 * node],
                this.tree[2 * node + 1]
            );
        }
    }

    /**
     * Atualiza um elemento específico
     */
    update(index, newValue) {
        if (index < 0 || index >= this.n) {
            throw new Error('Índice fora dos limites');
        }

        this.originalArray[index] = newValue;
        this._updatePoint(1, 0, this.n - 1, index, newValue);
    }

    _updatePoint(node, start, end, index, newValue) {
        if (start === end) {
            // Nó folha
            this.tree[node] = newValue;
        } else {
            const mid = Math.floor((start + end) / 2);

            if (index <= mid) {
                this._updatePoint(2 * node, start, mid, index, newValue);
            } else {
                this._updatePoint(2 * node + 1, mid + 1, end, index, newValue);
            }

            // Atualiza o nó atual
            this.tree[node] = this.combine(
                this.tree[2 * node],
                this.tree[2 * node + 1]
            );
        }
    }

    /**
     * Consulta um intervalo [left, right]
     */
    query(left, right) {
        if (left < 0 || right >= this.n || left > right) {
            throw new Error('Intervalo inválido');
        }

        return this._query(1, 0, this.n - 1, left, right);
    }

    _query(node, start, end, left, right) {
        if (right < start || end < left) {
            // Sem sobreposição
            return this.identity;
        }

        if (left <= start && end <= right) {
            // Sobreposição total
            return this.tree[node];
        }

        // Sobreposição parcial
        const mid = Math.floor((start + end) / 2);
        const leftResult = this._query(2 * node, start, mid, left, right);
        const rightResult = this._query(2 * node + 1, mid + 1, end, left, right);

        return this.combine(leftResult, rightResult);
    }

    /**
     * Atualização de intervalo com lazy propagation
     */
    updateRange(left, right, delta) {
        if (left < 0 || right >= this.n || left > right) {
            throw new Error('Intervalo inválido');
        }

        if (this.operation !== 'sum') {
            throw new Error('Atualização de intervalo só suportada para soma');
        }

        this._updateRange(1, 0, this.n - 1, left, right, delta);
    }

    _updateRange(node, start, end, left, right, delta) {
        // Aplica lazy propagation se necessário
        this._pushLazy(node, start, end);

        if (start > end || start > right || end < left) {
            return;
        }

        if (start >= left && end <= right) {
            // Sobreposição total
            this.tree[node] += delta * (end - start + 1);

            if (start !== end) {
                // Não é folha, marca filhos para lazy propagation
                this.lazy[2 * node] += delta;
                this.lazy[2 * node + 1] += delta;
            }
            return;
        }

        // Sobreposição parcial
        const mid = Math.floor((start + end) / 2);
        this._updateRange(2 * node, start, mid, left, right, delta);
        this._updateRange(2 * node + 1, mid + 1, end, left, right, delta);

        this.tree[node] = this.tree[2 * node] + this.tree[2 * node + 1];
    }

    /**
     * Aplica lazy propagation
     */
    _pushLazy(node, start, end) {
        if (this.lazy[node] !== 0) {
            this.tree[node] += this.lazy[node] * (end - start + 1);

            if (start !== end) {
                // Não é folha
                this.lazy[2 * node] += this.lazy[node];
                this.lazy[2 * node + 1] += this.lazy[node];
            }

            this.lazy[node] = 0;
        }
    }

    /**
     * Consulta de intervalo com lazy propagation
     */
    queryRange(left, right) {
        if (left < 0 || right >= this.n || left > right) {
            throw new Error('Intervalo inválido');
        }

        return this._queryRange(1, 0, this.n - 1, left, right);
    }

    _queryRange(node, start, end, left, right) {
        if (start > end || start > right || end < left) {
            return this.identity;
        }

        this._pushLazy(node, start, end);

        if (start >= left && end <= right) {
            return this.tree[node];
        }

        const mid = Math.floor((start + end) / 2);
        const leftResult = this._queryRange(2 * node, start, mid, left, right);
        const rightResult = this._queryRange(2 * node + 1, mid + 1, end, left, right);

        return this.combine(leftResult, rightResult);
    }

    /**
     * Encontra o primeiro índice onde a condição é verdadeira
     */
    findFirst(condition, value) {
        return this._findFirst(1, 0, this.n - 1, condition, value);
    }

    _findFirst(node, start, end, condition, value) {
        if (start === end) {
            return condition(this.tree[node], value) ? start : -1;
        }

        const mid = Math.floor((start + end) / 2);

        // Verifica primeiro no filho esquerdo
        if (condition(this.tree[2 * node], value)) {
            const result = this._findFirst(2 * node, start, mid, condition, value);
            if (result !== -1) return result;
        }

        // Se não encontrou na esquerda, verifica na direita
        return this._findFirst(2 * node + 1, mid + 1, end, condition, value);
    }

    /**
     * Obtém estatísticas da estrutura
     */
    getStats() {
        const usedNodes = this.tree.filter(x => x !== undefined).length;

        return {
            size: this.n,
            treeSize: this.tree.length,
            usedNodes: usedNodes,
            operation: this.operation,
            memoryUsage: `${(usedNodes * 8)} bytes (aproximado)`,
            height: Math.ceil(Math.log2(this.n)) + 1
        };
    }

    /**
     * Visualiza a árvore (para arrays pequenos)
     */
    print() {
        if (this.n > 16) {
            console.log('Árvore muito grande para visualização completa');
            console.log('Primeiros 16 nós da árvore:', this.tree.slice(1, 17));
            return;
        }

        console.log('Array original:', this.originalArray);
        console.log('Árvore de segmentos:');
        this._printTree(1, 0, this.n - 1, 0);
    }

    _printTree(node, start, end, depth) {
        const indent = '  '.repeat(depth);

        if (start === end) {
            console.log(`${indent}Folha[${start}]: ${this.tree[node]}`);
        } else {
            console.log(`${indent}Nó[${start}-${end}]: ${this.tree[node]}`);

            const mid = Math.floor((start + end) / 2);
            this._printTree(2 * node, start, mid, depth + 1);
            this._printTree(2 * node + 1, mid + 1, end, depth + 1);
        }
    }

    /**
     * Converte a árvore de volta para array
     */
    toArray() {
        const result = new Array(this.n);
        for (let i = 0; i < this.n; i++) {
            result[i] = this.query(i, i);
        }
        return result;
    }
}

// =====================================
// EXEMPLOS DE USO E DEMONSTRAÇÕES
// =====================================

console.log('=== DEMONSTRAÇÃO SEGMENT TREE ===\n');

// 1. Segment Tree para soma
console.log('1. SEGMENT TREE PARA SOMA:');
const arr1 = [1, 3, 5, 7, 9, 11];
const sumTree = new SegmentTree(arr1, 'sum');

console.log('Array original:', arr1);
sumTree.print();

console.log('\nConsultas de soma:');
console.log('Soma [0, 2]:', sumTree.query(0, 2)); // 1+3+5 = 9
console.log('Soma [1, 4]:', sumTree.query(1, 4)); // 3+5+7+9 = 24
console.log('Soma [2, 5]:', sumTree.query(2, 5)); // 5+7+9+11 = 32

console.log('\nApós atualizar índice 1 para 10:');
sumTree.update(1, 10);
console.log('Nova soma [0, 2]:', sumTree.query(0, 2)); // 1+10+5 = 16

// 2. Segment Tree para mínimo
console.log('\n2. SEGMENT TREE PARA MÍNIMO:');
const arr2 = [4, 2, 8, 1, 6, 3];
const minTree = new SegmentTree(arr2, 'min');

console.log('Array:', arr2);
console.log('Mínimo [0, 2]:', minTree.query(0, 2)); // min(4,2,8) = 2
console.log('Mínimo [1, 4]:', minTree.query(1, 4)); // min(2,8,1,6) = 1
console.log('Mínimo [3, 5]:', minTree.query(3, 5)); // min(1,6,3) = 1

// 3. Segment Tree para máximo
console.log('\n3. SEGMENT TREE PARA MÁXIMO:');
const maxTree = new SegmentTree(arr2, 'max');

console.log('Máximo [0, 2]:', maxTree.query(0, 2)); // max(4,2,8) = 8
console.log('Máximo [1, 4]:', maxTree.query(1, 4)); // max(2,8,1,6) = 8
console.log('Máximo [3, 5]:', maxTree.query(3, 5)); // max(1,6,3) = 6

// =====================================
// LAZY PROPAGATION DEMO
// =====================================

console.log('\n=== LAZY PROPAGATION ===\n');

const arr3 = [1, 2, 3, 4, 5];
const lazyTree = new SegmentTree(arr3, 'sum');

console.log('Array inicial:', arr3);
console.log('Soma [0, 4]:', lazyTree.queryRange(0, 4)); // 15

console.log('\nAdicionando 5 ao intervalo [1, 3]:');
lazyTree.updateRange(1, 3, 5);
console.log('Nova soma [0, 4]:', lazyTree.queryRange(0, 4)); // 15 + 5*3 = 30
console.log('Nova soma [1, 3]:', lazyTree.queryRange(1, 3)); // (2+3+4) + 5*3 = 24

// =====================================
// TESTE DE PERFORMANCE
// =====================================

console.log('\n=== TESTE DE PERFORMANCE ===\n');

function testSegmentTreePerformance() {
    const sizes = [1000, 5000, 10000];

    sizes.forEach(size => {
        console.log(`\nTestando com array de tamanho ${size}:`);

        // Cria array de teste
        const testArray = Array.from({ length: size }, (_, i) => i + 1);

        // Constrói a árvore
        const startBuild = performance.now();
        const segTree = new SegmentTree(testArray, 'sum');
        const endBuild = performance.now();

        // Testa consultas
        const startQuery = performance.now();
        for (let i = 0; i < 1000; i++) {
            const left = Math.floor(Math.random() * size / 2);
            const right = left + Math.floor(Math.random() * (size - left));
            segTree.query(left, right);
        }
        const endQuery = performance.now();

        // Testa atualizações
        const startUpdate = performance.now();
        for (let i = 0; i < 1000; i++) {
            const index = Math.floor(Math.random() * size);
            const newValue = Math.floor(Math.random() * 100);
            segTree.update(index, newValue);
        }
        const endUpdate = performance.now();

        console.log(`  Construção: ${(endBuild - startBuild).toFixed(2)}ms`);
        console.log(`  1000 consultas: ${(endQuery - startQuery).toFixed(2)}ms`);
        console.log(`  1000 atualizações: ${(endUpdate - startUpdate).toFixed(2)}ms`);

        const stats = segTree.getStats();
        console.log(`  Altura: ${stats.height}`);
        console.log(`  Nós usados: ${stats.usedNodes}/${stats.treeSize}`);
    });
}

testPerformance();

// =====================================
// CASOS DE USO PRÁTICOS
// =====================================

console.log('\n=== CASOS DE USO PRÁTICOS ===\n');

// 1. Sistema de análise de vendas
console.log('1. ANÁLISE DE VENDAS POR PERÍODO:');
const dailySales = [100, 150, 200, 120, 180, 90, 250]; // Vendas diárias
const salesTree = new SegmentTree(dailySales, 'sum');

console.log('Vendas da semana:', dailySales);
console.log('Vendas seg-qua:', salesTree.query(0, 2)); // 450
console.log('Vendas qui-dom:', salesTree.query(3, 6)); // 640
console.log('Vendas fin de semana:', salesTree.query(5, 6)); // 340

// 2. Monitoramento de temperatura
console.log('\n2. MONITORAMENTO DE TEMPERATURA:');
const temperatures = [22, 25, 28, 30, 27, 24, 21, 19]; // Temperaturas horárias
const tempMinTree = new SegmentTree(temperatures, 'min');
const tempMaxTree = new SegmentTree(temperatures, 'max');

console.log('Temperaturas:', temperatures);
console.log('Temp mín manhã (0-3h):', tempMinTree.query(0, 3)); // 22
console.log('Temp máx tarde (4-7h):', tempMaxTree.query(4, 7)); // 27

// 3. Análise de logs de servidor
console.log('\n3. ANÁLISE DE LOGS (requests/minuto):');
const requests = [45, 52, 38, 67, 89, 123, 98, 76, 54, 43];
const reqTree = new SegmentTree(requests, 'sum');

console.log('Requests:', requests);
console.log('Total primeiros 5 min:', reqTree.query(0, 4)); // 291
console.log('Pico de 3 min:', reqTree.query(3, 5)); // 279

// =====================================
// ALGORITMOS ESPECIALIZADOS
// =====================================

console.log('\n=== ALGORITMOS ESPECIALIZADOS ===\n');

// Range Minimum Query (RMQ)
class RMQ {
    constructor(array) {
        this.segTree = new SegmentTree(array, 'min');
    }

    query(left, right) {
        return this.segTree.query(left, right);
    }

    update(index, value) {
        this.segTree.update(index, value);
    }
}

console.log('RMQ (Range Minimum Query):');
const rmq = new RMQ([3, 1, 4, 1, 5, 9, 2, 6]);
console.log('Array: [3, 1, 4, 1, 5, 9, 2, 6]');
console.log('Min [0, 3]:', rmq.query(0, 3)); // 1
console.log('Min [2, 6]:', rmq.query(2, 6)); // 1
console.log('Min [4, 7]:', rmq.query(4, 7)); // 2

// =====================================
// TESTES UNITÁRIOS
// =====================================

console.log('\n=== TESTES UNITÁRIOS ===\n');

function runSegmentTreeTests() {
    console.log('Executando testes Segment Tree...\n');

    // Teste 1: Construção e consulta básica
    const tree1 = new SegmentTree([1, 2, 3, 4], 'sum');
    console.log('✓ Teste 1 - Construção:', tree1.query(0, 3) === 10);

    // Teste 2: Atualização pontual
    tree1.update(1, 5);
    console.log('✓ Teste 2 - Atualização:', tree1.query(0, 3) === 13);

    // Teste 3: Consultas de mínimo
    const tree2 = new SegmentTree([4, 2, 6, 1], 'min');
    console.log('✓ Teste 3 - Mínimo:', tree2.query(0, 3) === 1);

    // Teste 4: Consultas de máximo
    const tree3 = new SegmentTree([4, 2, 6, 1], 'max');
    console.log('✓ Teste 4 - Máximo:', tree3.query(0, 3) === 6);

    // Teste 5: Lazy propagation
    const tree4 = new SegmentTree([1, 1, 1, 1], 'sum');
    tree4.updateRange(0, 2, 2);
    console.log('✓ Teste 5 - Lazy propagation:', tree4.queryRange(0, 3) === 7);

    // Teste 6: Consultas de intervalo
    const tree5 = new SegmentTree([1, 2, 3, 4, 5], 'sum');
    console.log('✓ Teste 6 - Intervalos:',
        tree5.query(1, 3) === 9 && tree5.query(0, 1) === 3);

    console.log('\nTodos os testes Segment Tree concluídos!');
}

runSegmentTreeTests();

// Export para uso em outros módulos
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { SegmentTree, RMQ };
}
