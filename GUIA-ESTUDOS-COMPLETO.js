/**
 * GUIA DE ESTUDOS PROGRESSIVO
 * Algoritmos e Estruturas de Dados - Roadmap Completo
 * 
 * Este guia fornece uma sequência estruturada de estudos, desde o nível
 * iniciante até expert, com exercícios práticos e projetos.
 * 
 * Autor: Algoritmos e Estruturas de Dados
 * Data: 2024
 */

console.log('='.repeat(100));
console.log('📚 GUIA DE ESTUDOS - ESTRUTURAS DE DADOS E ALGORITMOS');
console.log('='.repeat(100));

/**
 * METODOLOGIA DE ESTUDOS
 * 
 * 1. Teoria + Prática
 * 2. Implementação manual
 * 3. Análise de complexidade
 * 4. Casos de uso reais
 * 5. Exercícios progressivos
 */

// =============================================
// NÍVEL 1: BEGINNERS (4-6 semanas)
// =============================================

console.log('\n🌱 NÍVEL 1: BEGINNERS - FUNDAMENTOS');
console.log('─'.repeat(60));

const NIVEL_BEGINNERS = {
    semana1: {
        titulo: 'Fundamentos e Estruturas Lineares',
        topicos: [
            'Conceitos básicos: Complexidade de tempo e espaço',
            'Notação Big O, Omega e Theta',
            'Stack (Pilha) - LIFO',
            'Queue (Fila) - FIFO'
        ],
        arquivos: [
            'Beginners/Stack.js',
            'Beginners/Queue.js'
        ],
        exercicios: [
            'Implementar calculadora com parenteses usando Stack',
            'Simular impressora com Queue',
            'Converter notação infixa para pós-fixa',
            'Implementar deque (double-ended queue)'
        ],
        projetos: [
            'Sistema de navegação (back/forward) usando duas stacks',
            'Simulador de atendimento em banco com múltiplas filas'
        ]
    },

    semana2: {
        titulo: 'Listas Ligadas e Variações',
        topicos: [
            'Lista Simplesmente Ligada',
            'Lista Duplamente Ligada',
            'Lista Circular',
            'Operações: inserção, remoção, busca'
        ],
        arquivos: [
            'Beginners/Lists/SimplyLinkedList.js',
            'Beginners/Lists/LinkedList.js'
        ],
        exercicios: [
            'Reverter lista ligada iterativa e recursivamente',
            'Detectar ciclo em lista (Floyd\'s Algorithm)',
            'Merge de duas listas ordenadas',
            'Remover duplicatas de lista ordenada'
        ],
        projetos: [
            'Editor de texto simples com undo/redo',
            'Playlist de música com navegação bidirecional'
        ]
    },

    semana3: {
        titulo: 'Introdução às Árvores',
        topicos: [
            'Conceitos básicos de árvores',
            'Árvore Binária',
            'Traversals: preorder, inorder, postorder',
            'Busca Binária em arrays'
        ],
        arquivos: [
            'Beginners/Trees/Trees.js',
            'Beginners/Trees/BinarySearch.js'
        ],
        exercicios: [
            'Implementar todos os tipos de traversal',
            'Encontrar altura e largura da árvore',
            'Verificar se árvore é balanceada',
            'Busca binária iterativa e recursiva'
        ],
        projetos: [
            'Árvore genealógica com navegação',
            'Sistema de busca em catálogo ordenado'
        ]
    },

    semana4: {
        titulo: 'Árvore de Busca Binária (BST)',
        topicos: [
            'Propriedades da BST',
            'Inserção, busca e remoção',
            'Casos especiais na remoção',
            'Análise de complexidade'
        ],
        arquivos: [
            'Beginners/Trees/BST.js'
        ],
        exercicios: [
            'Validar se árvore é BST válida',
            'Encontrar k-ésimo menor elemento',
            'Converter BST para lista ligada',
            'Encontrar LCA (Lowest Common Ancestor)'
        ],
        projetos: [
            'Sistema de indexação de documentos',
            'Dicionário com busca rápida'
        ]
    },

    semana5: {
        titulo: 'Grafos - Conceitos Básicos',
        topicos: [
            'Representação: matriz e lista de adjacência',
            'DFS (Depth-First Search)',
            'BFS (Breadth-First Search)',
            'Componentes conectados'
        ],
        arquivos: [
            'Beginners/Trees/Graph.js'
        ],
        exercicios: [
            'Detectar ciclo em grafo direcionado/não-direcionado',
            'Encontrar caminho entre dois vértices',
            'Contar componentes conectados',
            'Ordenação topológica'
        ],
        projetos: [
            'Rede social simples com amizades',
            'Mapa de rotas entre cidades'
        ]
    },

    semana6: {
        titulo: 'Memoização e Introdução à DP',
        topicos: [
            'Conceitos de memoização',
            'Top-down vs Bottom-up',
            'Problemas clássicos: Fibonacci, Factorial',
            'Análise de trade-offs espaço-tempo'
        ],
        arquivos: [
            'Beginners/Memoize/memoization-demo.js',
            'Beginners/Memoize/memoization-step-by-step.js',
            'Beginners/Memoize/keys-demonstration.js'
        ],
        exercicios: [
            'Implementar memoização para problemas diversos',
            'Climbing stairs problem',
            'Coin change problem (versão simples)',
            'Longest increasing subsequence'
        ],
        projetos: [
            'Calculadora de sequências matemáticas otimizada',
            'Sistema de cache para funções custosas'
        ]
    }
};

// =============================================
// NÍVEL 2: INTERMEDIATE (6-8 semanas)
// =============================================

console.log('\n🌿 NÍVEL 2: INTERMEDIATE - ESTRUTURAS AVANÇADAS');
console.log('─'.repeat(60));

const NIVEL_INTERMEDIATE = {
    semana1_2: {
        titulo: 'Hash Tables e Funções Hash',
        topicos: [
            'Conceitos de hashing',
            'Funções hash: divisão, multiplicação, universal',
            'Tratamento de colisões: chaining, open addressing',
            'Load factor e rehashing'
        ],
        arquivos: [
            'Intermediate/HashTable.js'
        ],
        exercicios: [
            'Implementar diferentes funções hash',
            'Two sum problem usando hash table',
            'Group anagrams',
            'Frequency counter problems'
        ],
        projetos: [
            'Sistema de cache LRU',
            'Contador de palavras em textos grandes'
        ]
    },

    semana3_4: {
        titulo: 'Heaps e Priority Queues',
        topicos: [
            'Propriedades de Min/Max Heap',
            'Heapify up/down',
            'Priority Queue implementation',
            'Heap Sort algorithm'
        ],
        arquivos: [
            'Intermediate/Heap.js'
        ],
        exercicios: [
            'K largest/smallest elements',
            'Merge K sorted arrays',
            'Find median in stream',
            'Task scheduler problem'
        ],
        projetos: [
            'Sistema de prioridades para tarefas',
            'Simulador de emergency room'
        ]
    },

    semana5_6: {
        titulo: 'Trie (Prefix Tree)',
        topicos: [
            'Estrutura do Trie',
            'Inserção e busca de palavras',
            'Busca por prefixo',
            'Autocomplete e spell checker'
        ],
        arquivos: [
            'Intermediate/Trie.js'
        ],
        exercicios: [
            'Word search in 2D grid',
            'Longest common prefix',
            'Replace words problem',
            'Design search autocomplete system'
        ],
        projetos: [
            'Sistema de autocomplete para search engine',
            'Spell checker com sugestões'
        ]
    },

    semana7_8: {
        titulo: 'Revisão e Projetos Integradores',
        topicos: [
            'Combinação de estruturas',
            'Design patterns para estruturas de dados',
            'Análise de trade-offs',
            'Otimização de performance'
        ],
        exercicios: [
            'Design Twitter timeline',
            'LRU Cache implementation',
            'Design URL shortener',
            'Implement Redis-like key-value store'
        ],
        projetos: [
            'Mini database engine',
            'Sistema de recomendação básico'
        ]
    }
};

// =============================================
// NÍVEL 3: ADVANCED (8-10 semanas)
// =============================================

console.log('\n🌳 NÍVEL 3: ADVANCED - ESTRUTURAS ESPECIALIZADAS');
console.log('─'.repeat(60));

const NIVEL_ADVANCED = {
    semana1_2: {
        titulo: 'Árvores Balanceadas - AVL',
        topicos: [
            'Necessidade de balanceamento',
            'Fator de balanceamento',
            'Rotações: simples e duplas',
            'Inserção e remoção com rebalanceamento'
        ],
        arquivos: [
            'Advanced/AVLTree.js'
        ],
        exercicios: [
            'Implementar todas as rotações',
            'Converter BST não balanceada para AVL',
            'Range queries em AVL tree',
            'Persistent AVL tree'
        ],
        projetos: [
            'Sistema de indexação para base de dados',
            'Timeline ordenada para rede social'
        ]
    },

    semana3_4: {
        titulo: 'Red-Black Trees',
        topicos: [
            'Propriedades Red-Black',
            'Inserção com fixup',
            'Remoção com fixup',
            'Comparação com AVL'
        ],
        arquivos: [
            'Advanced/RedBlackTree.js'
        ],
        exercicios: [
            'Validar propriedades Red-Black',
            'Contar nós pretos em caminhos',
            'Implementar TreeMap usando RB Tree',
            'Interval tree usando RB Tree'
        ],
        projetos: [
            'Map/Dictionary implementation',
            'Sistema de intervalos para agenda'
        ]
    },

    semana5_6: {
        titulo: 'Segment Trees e Range Queries',
        topicos: [
            'Construção de Segment Tree',
            'Point updates e range queries',
            'Lazy propagation',
            'Variações: min, max, sum, XOR'
        ],
        arquivos: [
            'Advanced/SegmentTree.js'
        ],
        exercicios: [
            'Range minimum/maximum query',
            'Range sum with updates',
            '2D segment tree',
            'Persistent segment tree'
        ],
        projetos: [
            'Sistema de analytics com range queries',
            'Game leaderboard com updates rápidos'
        ]
    },

    semana7_8: {
        titulo: 'Fenwick Tree (Binary Indexed Tree)',
        topicos: [
            'Conceito de Binary Indexed Tree',
            'Operações de update e query',
            'Range updates',
            'Aplicações em counting'
        ],
        arquivos: [
            'Advanced/FenwickTree.js'
        ],
        exercicios: [
            'Count inversions in array',
            'Range sum queries',
            '2D Fenwick tree',
            'Coordinate compression'
        ],
        projetos: [
            'Sistema de ranking dinâmico',
            'Frequency analysis tool'
        ]
    },

    semana9_10: {
        titulo: 'Skip Lists',
        topicos: [
            'Estrutura probabilística',
            'Multiple levels',
            'Insert, delete, search',
            'Análise probabilística'
        ],
        arquivos: [
            'Advanced/SkipList.js'
        ],
        exercicios: [
            'Range queries em Skip List',
            'Concurrent Skip List',
            'K-th element queries',
            'Persistent Skip List'
        ],
        projetos: [
            'Database index alternativo',
            'Ordered map implementation'
        ]
    }
};

// =============================================
// NÍVEL 4: EXPERT (10-12 semanas)
// =============================================

console.log('\n🏔️ NÍVEL 4: EXPERT - ESTRUTURAS ESPECIALIZADAS');
console.log('─'.repeat(60));

const NIVEL_EXPERT = {
    semana1_3: {
        titulo: 'Suffix Trees e String Algorithms',
        topicos: [
            'Suffix Tree construction',
            'Ukkonen\'s algorithm',
            'Pattern matching',
            'Longest common substring'
        ],
        arquivos: [
            'Expert/SuffixTree.js'
        ],
        exercicios: [
            'All occurrences of pattern',
            'Longest repeated substring',
            'Suffix array construction',
            'LCP array construction'
        ],
        projetos: [
            'Full-text search engine',
            'Plagiarism detection system'
        ]
    },

    semana4_6: {
        titulo: 'Bloom Filters e Probabilistic Structures',
        topicos: [
            'Probabilistic membership testing',
            'Hash functions para Bloom Filter',
            'False positive analysis',
            'Counting Bloom Filter'
        ],
        arquivos: [
            'Expert/BloomFilter.js'
        ],
        exercicios: [
            'Optimal parameter selection',
            'Scalable Bloom Filter',
            'Cuckoo Filter implementation',
            'HyperLogLog for cardinality'
        ],
        projetos: [
            'Web crawler duplicate detection',
            'Cache system com Bloom Filter'
        ]
    },

    semana7_9: {
        titulo: 'Concurrent Data Structures',
        topicos: [
            'Lock-free programming',
            'Compare-and-swap operations',
            'ABA problem',
            'Memory ordering'
        ],
        arquivos: [
            'Expert/ConcurrentStructures.js'
        ],
        exercicios: [
            'Lock-free queue implementation',
            'Concurrent hash table',
            'Work-stealing queue',
            'Read-write locks'
        ],
        projetos: [
            'Multi-threaded task processor',
            'Concurrent cache system'
        ]
    },

    semana10_12: {
        titulo: 'Persistent Data Structures',
        topicos: [
            'Structural sharing',
            'Path copying',
            'Fat node method',
            'Persistent arrays e trees'
        ],
        arquivos: [
            'Expert/PersistentStructures.js'
        ],
        exercicios: [
            'Persistent hash map (HAMT)',
            'Persistent vector',
            'Undo/redo system',
            'Version control system'
        ],
        projetos: [
            'Functional programming library',
            'Version-controlled database'
        ]
    }
};

// =============================================
// PLANO DE ESTUDOS PERSONALIZADO
// =============================================

function gerarPlanoEstudos(nivelInicial = 'beginners', horasPorSemana = 10) {
    console.log('\n📅 PLANO DE ESTUDOS PERSONALIZADO');
    console.log('─'.repeat(60));

    const planos = {
        beginners: NIVEL_BEGINNERS,
        intermediate: NIVEL_INTERMEDIATE,
        advanced: NIVEL_ADVANCED,
        expert: NIVEL_EXPERT
    };

    const nivelSelecionado = planos[nivelInicial];
    if (!nivelSelecionado) {
        console.log('❌ Nível inválido. Use: beginners, intermediate, advanced, expert');
        return;
    }

    console.log(`🎯 Nível: ${nivelInicial.toUpperCase()}`);
    console.log(`⏰ Dedicação: ${horasPorSemana} horas/semana`);

    let semanaAtual = 1;
    for (const [periodo, conteudo] of Object.entries(nivelSelecionado)) {
        console.log(`\n📚 ${conteudo.titulo}`);
        console.log(`   Período: ${periodo} (Semana ${semanaAtual})`);

        console.log('   📖 Tópicos:');
        conteudo.topicos.forEach(topico => {
            console.log(`     • ${topico}`);
        });

        if (conteudo.arquivos) {
            console.log('   📁 Arquivos para estudar:');
            conteudo.arquivos.forEach(arquivo => {
                console.log(`     • ${arquivo}`);
            });
        }

        if (conteudo.exercicios) {
            console.log('   🏋️  Exercícios práticos:');
            conteudo.exercicios.slice(0, 2).forEach(exercicio => {
                console.log(`     • ${exercicio}`);
            });
            if (conteudo.exercicios.length > 2) {
                console.log(`     • ... e mais ${conteudo.exercicios.length - 2} exercícios`);
            }
        }

        if (conteudo.projetos) {
            console.log('   🎯 Projetos sugeridos:');
            conteudo.projetos.forEach(projeto => {
                console.log(`     • ${projeto}`);
            });
        }

        const horasEstimadas = Math.ceil(horasPorSemana * (periodo.includes('_') ? 2 : 1));
        console.log(`   ⏱️  Tempo estimado: ${horasEstimadas} horas`);

        semanaAtual += periodo.includes('_') ? 2 : 1;
    }
}

// =============================================
// RECURSOS E FERRAMENTAS
// =============================================

console.log('\n🛠️ RECURSOS E FERRAMENTAS RECOMENDADAS');
console.log('─'.repeat(60));

const RECURSOS = {
    livros: [
        '"Introduction to Algorithms" - Cormen, Leiserson, Rivest, Stein',
        '"Data Structures and Algorithms Made Easy" - Narasimha Karumanchi',
        '"Algorithm Design Manual" - Steven Skiena',
        '"Cracking the Coding Interview" - Gayle McDowell'
    ],
    plataformas: [
        'LeetCode - Exercícios práticos',
        'HackerRank - Challenges progressivos',
        'Codeforces - Competitive programming',
        'GeeksforGeeks - Tutoriais detalhados'
    ],
    ferramentas: [
        'Visual Studio Code - Editor com debugging',
        'Chrome DevTools - Profiling de performance',
        'Big-O Cheat Sheet - Referência rápida',
        'Algorithm Visualizer - Visualização de algoritmos'
    ],
    comunidades: [
        'Stack Overflow - Dúvidas técnicas',
        'Reddit r/algorithms - Discussões',
        'Discord/Slack groups - Estudo em grupo',
        'GitHub - Projetos open source'
    ]
};

console.log('📚 Livros recomendados:');
RECURSOS.livros.forEach(livro => console.log(`  • ${livro}`));

console.log('\n💻 Plataformas de prática:');
RECURSOS.plataformas.forEach(plataforma => console.log(`  • ${plataforma}`));

console.log('\n🔧 Ferramentas úteis:');
RECURSOS.ferramentas.forEach(ferramenta => console.log(`  • ${ferramenta}`));

console.log('\n👥 Comunidades:');
RECURSOS.comunidades.forEach(comunidade => console.log(`  • ${comunidade}`));

// =============================================
// DICAS DE ESTUDO
// =============================================

console.log('\n💡 DICAS PARA MAXIMIZAR O APRENDIZADO');
console.log('─'.repeat(60));

const DICAS_ESTUDO = [
    '🔄 Implemente cada estrutura do zero antes de ver a solução',
    '📊 Sempre analise a complexidade temporal e espacial',
    '🧪 Teste suas implementações com casos extremos',
    '📝 Mantenha um caderno de anotações com padrões',
    '🎯 Resolva problemas progressivamente mais difíceis',
    '⏰ Use técnica Pomodoro para manter foco',
    '👥 Participe de grupos de estudo ou code review',
    '🔧 Implemente em diferentes linguagens quando possível',
    '📈 Meça performance de suas implementações',
    '🎨 Desenhe estruturas no papel para visualizar melhor'
];

DICAS_ESTUDO.forEach(dica => console.log(`  ${dica}`));

// =============================================
// CHECKLIST DE PROGRESSO
// =============================================

console.log('\n✅ CHECKLIST DE PROGRESSO');
console.log('─'.repeat(60));

function gerarChecklist() {
    const checklist = {
        beginners: [
            'Entendo notação Big O e sei analisar complexidade',
            'Posso implementar Stack e Queue do zero',
            'Domino operações em listas ligadas',
            'Sei fazer traversals em árvores binárias',
            'Implemento BST com inserção, busca e remoção',
            'Entendo DFS e BFS em grafos',
            'Aplico memoização para otimizar recursões'
        ],
        intermediate: [
            'Implemento hash table com tratamento de colisões',
            'Construo min/max heap e priority queue',
            'Uso Trie para problemas de strings',
            'Combino estruturas para resolver problemas complexos'
        ],
        advanced: [
            'Implemento árvores AVL com rotações',
            'Construo Red-Black tree corretamente',
            'Uso Segment Tree para range queries',
            'Aplico Fenwick Tree para problemas de soma',
            'Entendo Skip List e sua análise probabilística'
        ],
        expert: [
            'Construo Suffix Tree usando algoritmo de Ukkonen',
            'Implemento Bloom Filter com análise de falsos positivos',
            'Programa estruturas lock-free e concurrent',
            'Crio estruturas persistentes com structural sharing'
        ]
    };

    for (const [nivel, items] of Object.entries(checklist)) {
        console.log(`\n${nivel.toUpperCase()}:`);
        items.forEach((item, index) => {
            console.log(`  ${index + 1}. [ ] ${item}`);
        });
    }
}

gerarChecklist();

// =============================================
// EXECUÇÃO DE EXEMPLO
// =============================================

console.log('\n' + '='.repeat(100));
console.log('🚀 EXEMPLO DE USO DO GUIA');
console.log('='.repeat(100));

// Gera plano personalizado para nível beginners
gerarPlanoEstudos('beginners', 10);

console.log('\n' + '='.repeat(100));
console.log('🎓 GUIA DE ESTUDOS - BOM APRENDIZADO!');
console.log('='.repeat(100));

console.log('\n📌 LEMBRETES IMPORTANTES:');
console.log('  • A prática constante é mais importante que a velocidade');
console.log('  • Entenda o "porquê" antes do "como"');
console.log('  • Implemente, teste, otimize, repita');
console.log('  • Não pule níveis - cada base é importante');
console.log('  • Mantenha consistência nos estudos');

export {
    NIVEL_BEGINNERS,
    NIVEL_INTERMEDIATE,
    NIVEL_ADVANCED,
    NIVEL_EXPERT,
    gerarPlanoEstudos,
    RECURSOS
};
