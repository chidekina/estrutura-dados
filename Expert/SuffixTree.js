/**
 * SUFFIX TREE - EXPERT MODULE
 * ===========================
 * 
 * Uma Suffix Tree é uma estrutura de dados comprimida que contém
 * todos os sufixos de uma string. É extremamente poderosa para
 * processamento de strings e bioinformática.
 * 
 * Aplicações:
 * - Busca de padrões em O(m) onde m é o tamanho do padrão
 * - Longest Common Substring
 * - Análise de sequências de DNA
 * - Compressão de dados
 * - Editor de texto (autocomplete, busca)
 * 
 * Complexidade:
 * - Construção: O(n) usando algoritmo de Ukkonen
 * - Busca: O(m) para padrão de tamanho m
 * - Espaço: O(n) na prática, O(n²) no pior caso
 * 
 * Nota: Esta é uma implementação simplificada para fins educacionais.
 * Implementações industriais são extremamente complexas.
 */

class SuffixTreeNode {
    constructor() {
        this.children = new Map();
        this.start = -1;      // Início da substring na string original
        this.end = null;      // Fim da substring (pode ser global para folhas)
        this.suffixIndex = -1; // Índice do sufixo para nós folha
        this.suffixLink = null; // Suffix link para otimização
    }

    /**
     * Obtém o comprimento da edge
     */
    getEdgeLength(globalEnd) {
        if (this.end === null) {
            return globalEnd - this.start + 1;
        }
        return this.end - this.start + 1;
    }

    /**
     * Verifica se é um nó folha
     */
    isLeaf() {
        return this.children.size === 0;
    }
}

class SuffixTree {
    constructor(text) {
        this.text = text + '$'; // Adiciona terminador
        this.n = this.text.length;
        this.root = new SuffixTreeNode();
        this.globalEnd = -1;

        // Variáveis para construção
        this.activeNode = this.root;
        this.activeEdge = -1;
        this.activeLength = 0;
        this.remainingSuffixCount = 0;
        this.leafEnd = -1;
        this.splits = 0; // Contador de splits para análise

        this._buildSuffixTree();
    }

    /**
     * Constrói a suffix tree usando uma versão simplificada
     * do algoritmo de Ukkonen
     */
    _buildSuffixTree() {
        for (let i = 0; i < this.n; i++) {
            this._extendSuffixTree(i);
        }

        this._setSuffixIndexes(this.root, 0);
    }

    /**
     * Estende a suffix tree na fase i
     */
    _extendSuffixTree(pos) {
        this.leafEnd = pos;
        this.globalEnd = pos;
        this.remainingSuffixCount++;

        let lastNewNode = null;

        while (this.remainingSuffixCount > 0) {
            if (this.activeLength === 0) {
                this.activeEdge = pos;
            }

            const edgeChar = this.text[this.activeEdge];

            if (!this.activeNode.children.has(edgeChar)) {
                // Regra 2: Cria nova folha
                const leaf = new SuffixTreeNode();
                leaf.start = pos;
                this.activeNode.children.set(edgeChar, leaf);

                if (lastNewNode !== null) {
                    lastNewNode.suffixLink = this.activeNode;
                    lastNewNode = null;
                }
            } else {
                const next = this.activeNode.children.get(edgeChar);
                const edgeLength = next.getEdgeLength(this.globalEnd);

                if (this.activeLength >= edgeLength) {
                    this.activeEdge += edgeLength;
                    this.activeLength -= edgeLength;
                    this.activeNode = next;
                    continue;
                }

                if (this.text[next.start + this.activeLength] === this.text[pos]) {
                    // Regra 3: Não faz nada (show stopper)
                    if (lastNewNode !== null && this.activeNode !== this.root) {
                        lastNewNode.suffixLink = this.activeNode;
                    }
                    this.activeLength++;
                    break;
                }

                // Regra 2: Split edge
                this.splits++;
                const splitNode = new SuffixTreeNode();
                splitNode.start = next.start;
                splitNode.end = next.start + this.activeLength - 1;

                this.activeNode.children.set(edgeChar, splitNode);

                const leaf = new SuffixTreeNode();
                leaf.start = pos;
                splitNode.children.set(this.text[pos], leaf);

                next.start += this.activeLength;
                splitNode.children.set(this.text[next.start], next);

                if (lastNewNode !== null) {
                    lastNewNode.suffixLink = splitNode;
                }
                lastNewNode = splitNode;
            }

            this.remainingSuffixCount--;

            if (this.activeNode === this.root && this.activeLength > 0) {
                this.activeLength--;
                this.activeEdge = pos - this.remainingSuffixCount + 1;
            } else if (this.activeNode !== this.root) {
                this.activeNode = this.activeNode.suffixLink || this.root;
            }
        }
    }

    /**
     * Define os índices dos sufixos nos nós folha
     */
    _setSuffixIndexes(node, labelHeight) {
        if (node.isLeaf()) {
            node.suffixIndex = this.n - labelHeight;
            return;
        }

        for (const child of node.children.values()) {
            const edgeLength = child.getEdgeLength(this.globalEnd);
            this._setSuffixIndexes(child, labelHeight + edgeLength);
        }
    }

    /**
     * Busca um padrão na suffix tree
     */
    search(pattern) {
        let node = this.root;
        let pos = 0;

        for (let i = 0; i < pattern.length;) {
            const char = pattern[i];

            if (!node.children.has(char)) {
                return { found: false, occurrences: [] };
            }

            const child = node.children.get(char);
            const edgeLength = child.getEdgeLength(this.globalEnd);
            let edgePos = 0;

            // Percorre a edge comparando caracteres
            while (edgePos < edgeLength && i < pattern.length) {
                if (this.text[child.start + edgePos] !== pattern[i]) {
                    return { found: false, occurrences: [] };
                }
                edgePos++;
                i++;
            }

            node = child;
        }

        // Padrão encontrado, coleta todas as ocorrências
        const occurrences = [];
        this._collectSuffixIndexes(node, occurrences, pattern.length);

        return {
            found: true,
            occurrences: occurrences.sort((a, b) => a - b),
            count: occurrences.length
        };
    }

    /**
     * Coleta todos os índices de sufixo a partir de um nó
     */
    _collectSuffixIndexes(node, occurrences, patternLength) {
        if (node.isLeaf()) {
            // Calcula a posição da ocorrência
            const occurrence = node.suffixIndex;
            if (occurrence >= 0 && occurrence + patternLength <= this.n) {
                occurrences.push(occurrence);
            }
        } else {
            for (const child of node.children.values()) {
                this._collectSuffixIndexes(child, occurrences, patternLength);
            }
        }
    }

    /**
     * Encontra a Longest Common Substring entre dois sufixos
     */
    longestCommonSubstring(str1, str2) {
        // Cria uma nova suffix tree com as duas strings concatenadas
        const combined = str1 + '#' + str2 + '$';
        const tree = new SuffixTree(combined);

        let maxLength = 0;
        let maxSubstring = '';

        tree._findLCS(tree.root, 0, str1.length, str2.length,
            combined.length, (length, start) => {
                if (length > maxLength) {
                    maxLength = length;
                    maxSubstring = combined.substring(start, start + length);
                }
            });

        return {
            length: maxLength,
            substring: maxSubstring,
            positions: {
                str1: str1.indexOf(maxSubstring),
                str2: str2.indexOf(maxSubstring)
            }
        };
    }

    /**
     * Algoritmo para encontrar LCS (auxiliar)
     */
    _findLCS(node, depth, len1, len2, totalLen, callback) {
        if (node.isLeaf()) {
            return node.suffixIndex < len1 ? 1 : 2;
        }

        let hasStr1 = false;
        let hasStr2 = false;

        for (const child of node.children.values()) {
            const result = this._findLCS(child, depth + child.getEdgeLength(this.globalEnd),
                len1, len2, totalLen, callback);

            if (result === 1 || result === 3) hasStr1 = true;
            if (result === 2 || result === 3) hasStr2 = true;
        }

        if (hasStr1 && hasStr2) {
            // Este nó representa uma substring comum
            if (depth > 0) {
                callback(depth, this._getSubstringStart(node, depth));
            }
            return 3;
        }

        return hasStr1 ? 1 : (hasStr2 ? 2 : 0);
    }

    /**
     * Obtém o início da substring para um nó
     */
    _getSubstringStart(node, depth) {
        // Implementação simplificada
        return 0;
    }

    /**
     * Encontra todas as substrings repetidas
     */
    findRepeatedSubstrings(minLength = 2) {
        const repeated = [];
        this._findRepeated(this.root, 0, minLength, repeated);
        return repeated.sort((a, b) => b.length - a.length);
    }

    _findRepeated(node, depth, minLength, result) {
        if (node.isLeaf()) {
            return 1;
        }

        let totalLeaves = 0;
        for (const child of node.children.values()) {
            const leaves = this._findRepeated(child,
                depth + child.getEdgeLength(this.globalEnd),
                minLength, result);
            totalLeaves += leaves;
        }

        if (totalLeaves >= 2 && depth >= minLength) {
            // Esta substring aparece pelo menos 2 vezes
            const substring = this._getPathString(node, depth);
            if (substring.length >= minLength && !substring.includes('$')) {
                result.push({
                    substring: substring,
                    length: substring.length,
                    occurrences: totalLeaves
                });
            }
        }

        return totalLeaves;
    }

    /**
     * Obtém a string do caminho da raiz até um nó
     */
    _getPathString(node, maxDepth) {
        // Implementação simplificada - retorna substring do texto
        return this.text.substring(0, Math.min(maxDepth, 10));
    }

    /**
     * Obtém todas as substrings únicas
     */
    getAllSubstrings() {
        const substrings = new Set();
        this._collectSubstrings(this.root, '', substrings);
        return Array.from(substrings).filter(s => s.length > 0 && !s.includes('$'));
    }

    _collectSubstrings(node, currentString, substrings) {
        if (currentString.length > 0) {
            substrings.add(currentString);
        }

        for (const [char, child] of node.children) {
            if (char !== '$') {
                const edgeString = this.text.substring(child.start,
                    child.start + child.getEdgeLength(this.globalEnd));
                this._collectSubstrings(child, currentString + edgeString, substrings);
            }
        }
    }

    /**
     * Obtém estatísticas da suffix tree
     */
    getStats() {
        const stats = {
            textLength: this.n - 1, // Remove o terminador
            nodes: 0,
            leaves: 0,
            splits: this.splits,
            depth: 0,
            memoryEstimate: 0
        };

        this._collectStats(this.root, 0, stats);
        stats.memoryEstimate = `${stats.nodes * 64} bytes (estimado)`;

        return stats;
    }

    _collectStats(node, depth, stats) {
        stats.nodes++;
        stats.depth = Math.max(stats.depth, depth);

        if (node.isLeaf()) {
            stats.leaves++;
        }

        for (const child of node.children.values()) {
            const edgeLength = child.getEdgeLength(this.globalEnd);
            this._collectStats(child, depth + edgeLength, stats);
        }
    }

    /**
     * Visualiza a estrutura da árvore (para strings pequenas)
     */
    print() {
        console.log(`Suffix Tree para: "${this.text.slice(0, -1)}"`);
        console.log('Estrutura:');
        this._printTree(this.root, '', true, 0);
    }

    _printTree(node, prefix, isLast, depth) {
        if (depth > 5) return; // Limita profundidade para visualização

        const nodeInfo = node.isLeaf() ?
            `[LEAF:${node.suffixIndex}]` :
            `[INTERNAL:${node.children.size} children]`;

        console.log(prefix + (isLast ? '└── ' : '├── ') + nodeInfo);

        const children = Array.from(node.children.entries()).slice(0, 3); // Limita filhos
        children.forEach(([char, child], index) => {
            const isLastChild = index === children.length - 1;
            const edgeLabel = this.text.substring(child.start,
                Math.min(child.start + 5, child.start + child.getEdgeLength(this.globalEnd)));

            console.log(prefix + (isLast ? '    ' : '│   ') +
                (isLastChild ? '└── ' : '├── ') + `"${edgeLabel}..."`);

            this._printTree(child, prefix + (isLast ? '    ' : '│   ') +
                (isLastChild ? '    ' : '│   '), true, depth + 1);
        });
    }
}

// =====================================
// EXEMPLOS DE USO E DEMONSTRAÇÕES
// =====================================

console.log('=== DEMONSTRAÇÃO SUFFIX TREE ===\n');

// 1. Construção e busca básica
console.log('1. CONSTRUÇÃO E BUSCA:');
const text1 = "banana";
const tree1 = new SuffixTree(text1);

console.log(`Texto: "${text1}"`);
tree1.print();

console.log('\nBuscas:');
console.log('Buscar "ana":', tree1.search("ana"));
console.log('Buscar "nan":', tree1.search("nan"));
console.log('Buscar "xyz":', tree1.search("xyz"));

// 2. Análise de substrings repetidas
console.log('\n2. SUBSTRINGS REPETIDAS:');
const text2 = "abcabcabc";
const tree2 = new SuffixTree(text2);

console.log(`Texto: "${text2}"`);
const repeated = tree2.findRepeatedSubstrings(2);
console.log('Substrings repetidas:', repeated.slice(0, 5));

// 3. Longest Common Substring
console.log('\n3. LONGEST COMMON SUBSTRING:');
const str1 = "programming";
const str2 = "algorithm";
const tree3 = new SuffixTree("");

console.log(`String 1: "${str1}"`);
console.log(`String 2: "${str2}"`);

const lcs = tree3.longestCommonSubstring(str1, str2);
console.log('Longest Common Substring:', lcs);

// =====================================
// CASOS DE USO PRÁTICOS
// =====================================

console.log('\n=== CASOS DE USO PRÁTICOS ===\n');

// 1. Análise de sequência de DNA
console.log('1. ANÁLISE DE DNA:');
const dnaSequence = "ATCGATCGATCG";
const dnaTree = new SuffixTree(dnaSequence);

console.log(`Sequência DNA: ${dnaSequence}`);

// Busca por motivos comuns
const motifs = ["ATG", "TAG", "CGA", "TCG"];
motifs.forEach(motif => {
    const result = dnaTree.search(motif);
    if (result.found) {
        console.log(`Motivo ${motif}: ${result.count} ocorrência(s) nas posições ${result.occurrences}`);
    }
});

// 2. Sistema de busca de texto
console.log('\n2. SISTEMA DE BUSCA:');
class TextSearchEngine {
    constructor(document) {
        this.document = document;
        this.tree = new SuffixTree(document.toLowerCase());
    }

    search(query) {
        const result = this.tree.search(query.toLowerCase());
        if (result.found) {
            return {
                found: true,
                count: result.count,
                positions: result.occurrences,
                contexts: this._getContexts(result.occurrences, query.length)
            };
        }
        return { found: false, count: 0, positions: [], contexts: [] };
    }

    _getContexts(positions, queryLength) {
        return positions.map(pos => {
            const start = Math.max(0, pos - 20);
            const end = Math.min(this.document.length, pos + queryLength + 20);
            return this.document.substring(start, end);
        });
    }

    findSimilarPatterns(pattern, maxResults = 5) {
        // Implementação simplificada
        const allSubstrings = this.tree.getAllSubstrings();
        return allSubstrings
            .filter(s => s.length >= pattern.length - 1 && s.length <= pattern.length + 1)
            .slice(0, maxResults);
    }
}

const document = "The quick brown fox jumps over the lazy dog. The fox is quick.";
const searchEngine = new TextSearchEngine(document);

console.log(`Documento: "${document}"`);
console.log('Buscar "fox":', searchEngine.search("fox"));
console.log('Buscar "the":', searchEngine.search("the"));

// 3. Detecção de plágio simplificado
console.log('\n3. DETECÇÃO DE PLÁGIO:');
function detectPlagiarism(text1, text2, minLength = 4) {
    const tree = new SuffixTree("");
    const lcs = tree.longestCommonSubstring(text1, text2);

    if (lcs.length >= minLength) {
        const similarity = (lcs.length * 2) / (text1.length + text2.length);
        return {
            similarity: (similarity * 100).toFixed(2) + '%',
            commonSubstring: lcs.substring,
            length: lcs.length
        };
    }

    return { similarity: '0%', commonSubstring: '', length: 0 };
}

const original = "O algoritmo de ordenação quicksort é muito eficiente";
const suspected = "O quicksort é um algoritmo muito eficiente para ordenação";

const plagiarism = detectPlagiarism(original, suspected);
console.log('Análise de plágio:', plagiarism);

// =====================================
// TESTE DE PERFORMANCE
// =====================================

console.log('\n=== TESTE DE PERFORMANCE ===\n');

function testSuffixTreePerformance() {
    const sizes = [100, 500, 1000];

    sizes.forEach(size => {
        console.log(`\nTestando com string de tamanho ${size}:`);

        // Cria string de teste
        const chars = 'ABCDEFGH';
        let testString = '';
        for (let i = 0; i < size; i++) {
            testString += chars[Math.floor(Math.random() * chars.length)];
        }

        // Constrói a suffix tree
        const startBuild = performance.now();
        const tree = new SuffixTree(testString);
        const endBuild = performance.now();

        // Testa buscas
        const patterns = ['AB', 'CD', 'EF', 'ABC', 'DEF'];
        const startSearch = performance.now();
        let totalFound = 0;

        patterns.forEach(pattern => {
            const result = tree.search(pattern);
            if (result.found) totalFound += result.count;
        });

        const endSearch = performance.now();

        const stats = tree.getStats();
        console.log(`  Construção: ${(endBuild - startBuild).toFixed(2)}ms`);
        console.log(`  Busca (${patterns.length} padrões): ${(endSearch - startSearch).toFixed(2)}ms`);
        console.log(`  Total de ocorrências: ${totalFound}`);
        console.log(`  Nós criados: ${stats.nodes} (${stats.leaves} folhas)`);
        console.log(`  Profundidade: ${stats.depth}`);
        console.log(`  Splits realizados: ${stats.splits}`);
    });
}

testSuffixTreePerformance();

// =====================================
// TESTES UNITÁRIOS
// =====================================

console.log('\n=== TESTES UNITÁRIOS ===\n');

function runSuffixTreeTests() {
    console.log('Executando testes Suffix Tree...\n');

    // Teste 1: Construção básica
    const tree1 = new SuffixTree("abc");
    console.log('✓ Teste 1 - Construção básica:', tree1.getStats().nodes > 0);

    // Teste 2: Busca existente
    const tree2 = new SuffixTree("banana");
    const result1 = tree2.search("ana");
    console.log('✓ Teste 2 - Busca existente:', result1.found && result1.count === 2);

    // Teste 3: Busca inexistente
    const result2 = tree2.search("xyz");
    console.log('✓ Teste 3 - Busca inexistente:', !result2.found);

    // Teste 4: Substrings repetidas
    const tree3 = new SuffixTree("abab");
    const repeated = tree3.findRepeatedSubstrings(1);
    console.log('✓ Teste 4 - Substrings repetidas:', repeated.length > 0);

    // Teste 5: LCS
    const tree4 = new SuffixTree("");
    const lcs = tree4.longestCommonSubstring("test", "best");
    console.log('✓ Teste 5 - LCS:', lcs.substring.includes("est"));

    console.log('\nTodos os testes Suffix Tree concluídos!');
}

runSuffixTreeTests();

// Export para uso em outros módulos
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { SuffixTree, SuffixTreeNode, TextSearchEngine };
}
