// Trie (Árvore de Prefixos / Prefix Tree)

// Uma Trie é uma árvore de prefixos que armazena strings de forma eficiente,
// permitindo busca, inserção e remoção em O(m), onde m é o comprimento da string.
// É extremamente útil para autocompletar, verificação ortográfica e busca de prefixos.

// Características principais:
// - Cada nó representa um caractere
// - Caminhos da raiz às folhas formam palavras
// - Busca de prefixos muito eficiente
// - Compartilha prefixos comuns (economia de espaço)
// - Ideal para dicionários e autocompletar

class TrieNode {
    constructor() {
        this.children = {}; // Mapa de caracteres para nós filhos
        this.isEndOfWord = false; // Marca se é fim de uma palavra
        this.frequency = 0; // Quantas vezes a palavra foi inserida
    }
}

class Trie {
    constructor() {
        this.root = new TrieNode();
        this.wordCount = 0; // Total de palavras únicas
    }

    // Inserir palavra
    insert(word) {
        let current = this.root;

        for (let char of word.toLowerCase()) {
            if (!current.children[char]) {
                current.children[char] = new TrieNode();
            }
            current = current.children[char];
        }

        if (!current.isEndOfWord) {
            this.wordCount++;
        }

        current.isEndOfWord = true;
        current.frequency++;
    }

    // Buscar palavra completa
    search(word) {
        const node = this.searchNode(word.toLowerCase());
        return node !== null && node.isEndOfWord;
    }

    // Verificar se existe prefixo
    startsWith(prefix) {
        return this.searchNode(prefix.toLowerCase()) !== null;
    }

    // Buscar nó (método auxiliar)
    searchNode(word) {
        let current = this.root;

        for (let char of word) {
            if (!current.children[char]) {
                return null;
            }
            current = current.children[char];
        }

        return current;
    }

    // Obter todas as palavras com um prefixo
    getWordsWithPrefix(prefix) {
        const node = this.searchNode(prefix.toLowerCase());
        if (!node) return [];

        const words = [];
        this.dfs(node, prefix.toLowerCase(), words);
        return words.sort();
    }

    // DFS para coletar palavras
    dfs(node, currentWord, words) {
        if (node.isEndOfWord) {
            words.push({
                word: currentWord,
                frequency: node.frequency
            });
        }

        for (let char in node.children) {
            this.dfs(node.children[char], currentWord + char, words);
        }
    }

    // Autocompletar (retorna sugestões limitadas)
    autocomplete(prefix, maxSuggestions = 10) {
        const words = this.getWordsWithPrefix(prefix);
        return words
            .sort((a, b) => b.frequency - a.frequency) // Ordenar por frequência
            .slice(0, maxSuggestions)
            .map(item => item.word);
    }

    // Remover palavra
    delete(word) {
        return this.deleteHelper(this.root, word.toLowerCase(), 0);
    }

    deleteHelper(node, word, index) {
        if (index === word.length) {
            if (!node.isEndOfWord) return false;

            node.isEndOfWord = false;
            node.frequency = 0;
            this.wordCount--;

            // Retorna true se o nó não tem filhos (pode ser removido)
            return Object.keys(node.children).length === 0;
        }

        const char = word[index];
        const childNode = node.children[char];

        if (!childNode) return false;

        const shouldDeleteChild = this.deleteHelper(childNode, word, index + 1);

        if (shouldDeleteChild) {
            delete node.children[char];

            // Retorna true se este nó pode ser removido
            return !node.isEndOfWord && Object.keys(node.children).length === 0;
        }

        return false;
    }

    // Obter todas as palavras
    getAllWords() {
        const words = [];
        this.dfs(this.root, "", words);
        return words.sort((a, b) => a.word.localeCompare(b.word));
    }

    // Verificar se está vazia
    isEmpty() {
        return this.wordCount === 0;
    }

    // Obter número de palavras
    size() {
        return this.wordCount;
    }

    // Limpar trie
    clear() {
        this.root = new TrieNode();
        this.wordCount = 0;
    }

    // Encontrar palavra mais longa
    getLongestWord() {
        const words = this.getAllWords();
        if (words.length === 0) return null;

        return words.reduce((longest, current) =>
            current.word.length > longest.word.length ? current : longest
        );
    }

    // Contar nós total
    countNodes() {
        return this.countNodesHelper(this.root);
    }

    countNodesHelper(node) {
        let count = 1; // Conta o nó atual

        for (let char in node.children) {
            count += this.countNodesHelper(node.children[char]);
        }

        return count;
    }

    // Estatísticas da Trie
    getStats() {
        const words = this.getAllWords();
        const totalChars = words.reduce((sum, item) => sum + item.word.length, 0);
        const avgLength = words.length > 0 ? totalChars / words.length : 0;

        return {
            wordCount: this.wordCount,
            nodeCount: this.countNodes(),
            averageWordLength: avgLength.toFixed(2),
            longestWord: this.getLongestWord()?.word || null,
            totalFrequency: words.reduce((sum, item) => sum + item.frequency, 0)
        };
    }

    // Imprimir trie
    print() {
        console.log(`\n🌳 Trie (${this.wordCount} palavras)`);
        console.log("-".repeat(40));

        if (this.isEmpty()) {
            console.log("Trie vazia");
            return;
        }

        const words = this.getAllWords();
        words.forEach(item => {
            console.log(`  ${item.word} (freq: ${item.frequency})`);
        });
    }

    // Visualizar estrutura da trie
    printStructure() {
        console.log("\n🌲 Estrutura da Trie:");
        this.printNode(this.root, "", "");
    }

    printNode(node, prefix, char) {
        if (node.isEndOfWord) {
            console.log(`${prefix}${char} ✓ (freq: ${node.frequency})`);
        } else if (char) {
            console.log(`${prefix}${char}`);
        }

        const children = Object.keys(node.children).sort();
        children.forEach((childChar, index) => {
            const isLast = index === children.length - 1;
            const newPrefix = prefix + (char ? (isLast ? "    " : "│   ") : "");
            const connector = isLast ? "└── " : "├── ";

            this.printNode(
                node.children[childChar],
                newPrefix,
                connector + childChar
            );
        });
    }
}

// IMPLEMENTAÇÃO ESPECIALIZADA PARA AUTOCOMPLETAR
class AutocompleteEngine {
    constructor() {
        this.trie = new Trie();
        this.cache = new Map(); // Cache de buscas recentes
    }

    // Adicionar palavra ao dicionário
    addWord(word) {
        this.trie.insert(word);
        this.clearCache(); // Limpar cache quando há mudanças
    }

    // Adicionar múltiplas palavras
    addWords(words) {
        words.forEach(word => this.trie.insert(word));
        this.clearCache();
    }

    // Buscar sugestões com cache
    getSuggestions(prefix, maxResults = 5) {
        const cacheKey = `${prefix}_${maxResults}`;

        if (this.cache.has(cacheKey)) {
            console.log(`💾 Cache hit para "${prefix}"`);
            return this.cache.get(cacheKey);
        }

        const suggestions = this.trie.autocomplete(prefix, maxResults);
        this.cache.set(cacheKey, suggestions);

        // Limitar cache a 100 entradas
        if (this.cache.size > 100) {
            const firstKey = this.cache.keys().next().value;
            this.cache.delete(firstKey);
        }

        return suggestions;
    }

    // Limpar cache
    clearCache() {
        this.cache.clear();
    }

    // Simular busca com correção de erros básica
    findClosestMatches(word, maxDistance = 2) {
        const allWords = this.trie.getAllWords().map(item => item.word);
        const matches = [];

        for (let dictWord of allWords) {
            const distance = this.levenshteinDistance(word.toLowerCase(), dictWord);
            if (distance <= maxDistance) {
                matches.push({ word: dictWord, distance });
            }
        }

        return matches
            .sort((a, b) => a.distance - b.distance)
            .slice(0, 10)
            .map(item => item.word);
    }

    // Calcular distância de Levenshtein (edição)
    levenshteinDistance(str1, str2) {
        const matrix = [];

        for (let i = 0; i <= str2.length; i++) {
            matrix[i] = [i];
        }

        for (let j = 0; j <= str1.length; j++) {
            matrix[0][j] = j;
        }

        for (let i = 1; i <= str2.length; i++) {
            for (let j = 1; j <= str1.length; j++) {
                if (str2.charAt(i - 1) === str1.charAt(j - 1)) {
                    matrix[i][j] = matrix[i - 1][j - 1];
                } else {
                    matrix[i][j] = Math.min(
                        matrix[i - 1][j - 1] + 1,
                        matrix[i][j - 1] + 1,
                        matrix[i - 1][j] + 1
                    );
                }
            }
        }

        return matrix[str2.length][str1.length];
    }
}

// DEMONSTRAÇÃO E TESTES
console.log("🌳 TESTANDO TRIE (ÁRVORE DE PREFIXOS)");
console.log("=".repeat(60));

// Teste 1: Operações básicas
console.log("\n📍 TESTE 1: Operações básicas");
const trie = new Trie();

const palavras = [
    "casa", "carro", "cachorro", "gato", "gado", "game",
    "programar", "programa", "programador", "python", "javascript"
];

console.log("Inserindo palavras:");
palavras.forEach(palavra => {
    trie.insert(palavra);
    console.log(`  + ${palavra}`);
});

trie.print();

console.log("\n🔍 Testando buscas:");
const buscas = ["casa", "car", "programa", "java", "inexistente"];
buscas.forEach(busca => {
    console.log(`  "${busca}": ${trie.search(busca) ? '✅ encontrada' : '❌ não encontrada'}`);
});

console.log("\n🔍 Testando prefixos:");
const prefixos = ["ca", "prog", "py", "ga"];
prefixos.forEach(prefixo => {
    console.log(`  "${prefixo}": ${trie.startsWith(prefixo) ? '✅ existe' : '❌ não existe'}`);
});

// Teste 2: Autocompletar
console.log("\n📍 TESTE 2: Autocompletar");
const prefixosAuto = ["ca", "prog", "ga"];

prefixosAuto.forEach(prefixo => {
    const sugestoes = trie.autocomplete(prefixo);
    console.log(`"${prefixo}" → [${sugestoes.join(', ')}]`);
});

// Teste 3: Palavras com frequência
console.log("\n📍 TESTE 3: Frequência de palavras");
// Inserir algumas palavras múltiplas vezes
trie.insert("javascript");
trie.insert("javascript");
trie.insert("python");

console.log("\nPalavras por frequência:");
const todasPalavras = trie.getAllWords();
todasPalavras
    .sort((a, b) => b.frequency - a.frequency)
    .slice(0, 5)
    .forEach(item => {
        console.log(`  ${item.word}: ${item.frequency}x`);
    });

// Teste 4: Engine de Autocompletar
console.log("\n📍 TESTE 4: Engine de Autocompletar");
const autoEngine = new AutocompleteEngine();

const dicionario = [
    "algoritmo", "árvore", "array", "busca", "binária",
    "complexidade", "código", "compilador", "classe",
    "debug", "dados", "desenvolvimento", "estrutura",
    "função", "framework", "grafo", "heap", "hash",
    "javascript", "java", "json", "linguagem", "lista",
    "método", "memória", "objeto", "ordenação", "performance",
    "pilha", "programa", "programação", "python", "queue",
    "recursão", "stack", "teste", "trie", "variável"
];

autoEngine.addWords(dicionario);

console.log("🔍 Simulando autocompletar:");
const consultas = ["prog", "al", "ja"];
consultas.forEach(consulta => {
    const sugestoes = autoEngine.getSuggestions(consulta);
    console.log(`"${consulta}" → [${sugestoes.join(', ')}]`);
});

// Teste com cache
console.log("\n💾 Testando cache:");
autoEngine.getSuggestions("prog"); // Primeira vez
autoEngine.getSuggestions("prog"); // Segunda vez (cache hit)

// Teste 5: Correção de erros
console.log("\n📍 TESTE 5: Correção de erros");
const palavrasErradas = ["algoritm", "progrma", "javasript"];

palavrasErradas.forEach(palavra => {
    const correcoes = autoEngine.findClosestMatches(palavra);
    console.log(`"${palavra}" → sugestões: [${correcoes.slice(0, 3).join(', ')}]`);
});

// Teste 6: Performance
console.log("\n📍 TESTE 6: Análise de Performance");

function testarPerformanceTrie() {
    const bigTrie = new Trie();
    const n = 10000;

    // Gerar palavras aleatórias
    const palavrasAleatorias = [];
    for (let i = 0; i < n; i++) {
        const palavra = Math.random().toString(36).substring(2, 8);
        palavrasAleatorias.push(palavra);
    }

    // Inserção
    const inicioInsercao = performance.now();
    palavrasAleatorias.forEach(palavra => bigTrie.insert(palavra));
    const fimInsercao = performance.now();

    // Busca
    const inicioBusca = performance.now();
    for (let i = 0; i < 1000; i++) {
        const palavra = palavrasAleatorias[Math.floor(Math.random() * palavrasAleatorias.length)];
        bigTrie.search(palavra);
    }
    const fimBusca = performance.now();

    console.log(`Trie (${n} palavras):`);
    console.log(`  Inserção: ${(fimInsercao - inicioInsercao).toFixed(2)}ms`);
    console.log(`  1000 buscas: ${(fimBusca - inicioBusca).toFixed(2)}ms`);
    console.log(`  Estatísticas:`, bigTrie.getStats());
}

testarPerformanceTrie();

// Teste 7: Visualização da estrutura
console.log("\n📍 TESTE 7: Visualização da estrutura");
const smallTrie = new Trie();
["cat", "car", "card", "care", "careful"].forEach(word => smallTrie.insert(word));

smallTrie.printStructure();

console.log("\n✅ TODOS OS TESTES DE TRIE CONCLUÍDOS!");
console.log("🚀 Estrutura fundamental para autocompletar e busca de strings!");
console.log("=".repeat(60));
