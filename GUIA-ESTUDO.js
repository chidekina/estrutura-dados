// 📖 GUIA DE ESTUDO - ESTRUTURAS DE DADOS EM JAVASCRIPT
// ====================================================

console.log("📖 GUIA COMPLETO DE ESTRUTURAS DE DADOS");
console.log("=".repeat(60));

const guide = {
    overview: {
        title: "VISÃO GERAL",
        content: [
            "📊 Estruturas de Dados são formas de organizar e armazenar dados",
            "🎯 Cada estrutura tem vantagens específicas para diferentes problemas",
            "⚡ A escolha da estrutura correta pode melhorar drasticamente a performance",
            "🧠 Fundamentais para algoritmos eficientes e design de software"
        ]
    },

    linear: {
        title: "ESTRUTURAS LINEARES",
        structures: {
            "Stack (Pilha)": {
                principle: "LIFO - Last In, First Out",
                operations: ["push()", "pop()", "peek()", "isEmpty()"],
                complexity: "O(1) para todas as operações principais",
                useCase: "Histórico do navegador, desfazer operações, avaliação de expressões",
                visualization: "[bottom] [middle] [top] ← operações aqui",
                example: "Pilha de pratos: o último colocado é o primeiro a ser retirado"
            },

            "Queue (Fila)": {
                principle: "FIFO - First In, First Out",
                operations: ["enqueue()", "dequeue()", "front()", "isEmpty()"],
                complexity: "O(1) para todas as operações principais",
                useCase: "Fila de impressão, processamento de tarefas, BFS",
                visualization: "← saída [first] [second] [last] ← entrada",
                example: "Fila do banco: o primeiro a chegar é o primeiro a ser atendido"
            },

            "Linked List (Lista Ligada)": {
                principle: "Elementos conectados por ponteiros",
                operations: ["insert()", "remove()", "find()", "traverse()"],
                complexity: "O(1) inserção/remoção, O(n) busca",
                useCase: "Tamanho dinâmico, inserções frequentes no meio",
                visualization: "[data|next] → [data|next] → [data|null]",
                example: "Trem: cada vagão (nó) conectado ao próximo"
            }
        }
    },

    hierarchical: {
        title: "ESTRUTURAS HIERÁRQUICAS",
        structures: {
            "Tree (Árvore)": {
                principle: "Estrutura hierárquica com raiz e folhas",
                operations: ["insert()", "remove()", "traverse()", "search()"],
                complexity: "Varia conforme o tipo de árvore",
                useCase: "Sistemas de arquivos, organogramas, árvores de decisão",
                visualization: "     Root\n    /  |  \\\n   A   B   C\n  /|     |\n D E     F",
                example: "Árvore genealógica: ancestrais na raiz, descendentes nas folhas"
            },

            "BST (Binary Search Tree)": {
                principle: "Árvore binária onde esquerda < nó < direita",
                operations: ["insert()", "remove()", "search()", "traverse()"],
                complexity: "O(log n) média, O(n) pior caso",
                useCase: "Busca eficiente em dados ordenados, autocompletar",
                visualization: "    10\n   /  \\\n  5   15\n / \\  / \\\n3  7 12 18",
                example: "Dicionário: palavras organizadas alfabeticamente"
            }
        }
    },

    network: {
        title: "ESTRUTURAS DE REDE",
        structures: {
            "Graph (Grafo)": {
                principle: "Vértices conectados por arestas",
                operations: ["addVertex()", "addEdge()", "BFS()", "DFS()", "dijkstra()"],
                complexity: "O(V + E) para travessias",
                useCase: "Redes sociais, mapas, dependências entre módulos",
                visualization: "A ↔ B\n↓ ✗ ↓\nC ↔ D",
                example: "Rede social: pessoas (vértices) conectadas por amizade (arestas)"
            }
        }
    },

    optimization: {
        title: "TÉCNICAS DE OTIMIZAÇÃO",
        structures: {
            "Memoization": {
                principle: "Cache de resultados para evitar recálculos",
                operations: ["cache.get()", "cache.set()", "memoize()"],
                complexity: "Troca espaço por tempo",
                useCase: "Funções recursivas caras, cálculos repetitivos",
                visualization: "Input → Cache? → Yes: Return | No: Calculate & Store",
                example: "GPS: salva rotas calculadas para não recalcular sempre"
            }
        }
    },

    complexity: {
        title: "ANÁLISE DE COMPLEXIDADE",
        bigO: {
            "O(1)": "Constante - Operação sempre leva o mesmo tempo",
            "O(log n)": "Logarítmica - Divide o problema pela metade a cada etapa",
            "O(n)": "Linear - Tempo proporcional ao tamanho dos dados",
            "O(n log n)": "Log-linear - Algoritmos de ordenação eficientes",
            "O(n²)": "Quadrática - Loops aninhados, evitar quando possível",
            "O(2^n)": "Exponencial - Cresce muito rapidamente, geralmente ineficiente"
        },
        examples: {
            "O(1)": "Acessar elemento de array pelo índice",
            "O(log n)": "Busca binária, operações em BST balanceada",
            "O(n)": "Busca linear, traversal de lista ligada",
            "O(n log n)": "Merge sort, heap sort",
            "O(n²)": "Bubble sort, insertion sort",
            "O(2^n)": "Fibonacci recursivo sem cache"
        }
    },

    whenToUse: {
        title: "QUANDO USAR CADA ESTRUTURA",
        scenarios: {
            "Use Stack quando": [
                "Precisar de acesso LIFO (último a entrar, primeiro a sair)",
                "Implementar undo/redo",
                "Avaliar expressões matemáticas",
                "Navegar por histórico"
            ],
            "Use Queue quando": [
                "Precisar de acesso FIFO (primeiro a entrar, primeiro a sair)",
                "Processar tarefas em ordem",
                "Implementar breadth-first search",
                "Buffer de dados"
            ],
            "Use Linked List quando": [
                "O tamanho da coleção varia muito",
                "Inserções/remoções frequentes no meio",
                "Não sabe o tamanho máximo dos dados",
                "Implementar outras estruturas (stack, queue)"
            ],
            "Use Tree quando": [
                "Dados têm relacionamento hierárquico",
                "Busca eficiente em dados ordenados (BST)",
                "Representar decisões ou categorias",
                "Parsing de linguagens"
            ],
            "Use Graph quando": [
                "Modelar relacionamentos complexos",
                "Encontrar caminhos (GPS, redes)",
                "Analisar redes sociais",
                "Detectar dependências"
            ]
        }
    },

    algorithms: {
        title: "ALGORITMOS FUNDAMENTAIS",
        search: {
            "Linear Search": "O(n) - Verifica cada elemento sequencialmente",
            "Binary Search": "O(log n) - Divide e conquista em dados ordenados",
            "DFS (Depth-First)": "O(V+E) - Explora o mais profundo primeiro",
            "BFS (Breadth-First)": "O(V+E) - Explora nível por nível"
        },
        sort: {
            "Bubble Sort": "O(n²) - Compara elementos adjacentes",
            "Insertion Sort": "O(n²) - Insere cada elemento na posição correta",
            "Merge Sort": "O(n log n) - Divide e conquista estável",
            "Quick Sort": "O(n log n) média - Escolhe pivô e particiona"
        },
        graph: {
            "Dijkstra": "Caminho mais curto com pesos não-negativos",
            "A*": "Busca informada com heurística",
            "Floyd-Warshall": "Todos os pares de caminhos mais curtos",
            "Kruskal/Prim": "Árvore geradora mínima"
        }
    },

    implementation: {
        title: "DICAS DE IMPLEMENTAÇÃO",
        tips: [
            "🔧 Sempre implemente métodos utilitários (isEmpty, size, print)",
            "✅ Teste com casos extremos (listas vazias, árvores de um nó)",
            "📊 Considere tanto a complexidade de tempo quanto de espaço",
            "🚫 Valide entradas para evitar erros de runtime",
            "📝 Documente a complexidade de cada método",
            "🔄 Implemente métodos de travessia (para estruturas não-lineares)",
            "⚡ Use memoization para otimizar funções recursivas caras",
            "🧪 Crie testes unitários para todos os métodos",
            "📈 Meça performance com dados reais do seu projeto",
            "🔍 Implemente métodos de debug e visualização"
        ]
    },

    nextSteps: {
        title: "PRÓXIMOS PASSOS NO APRENDIZADO",
        intermediate: [
            "Hash Tables/HashMaps - O(1) busca, inserção e remoção",
            "Heaps (Min/Max) - Árvores binárias para prioridade",
            "Tries - Árvores de prefixos para strings",
            "Disjoint Set (Union-Find) - Para detectar componentes conectados"
        ],
        advanced: [
            "AVL Trees - Árvores auto-balanceadas",
            "Red-Black Trees - Árvores balanceadas com cores",
            "B-Trees - Árvores para sistemas de arquivos/bancos",
            "Segment Trees - Para consultas em intervalos",
            "Fenwick Trees - Árvores binárias indexadas"
        ],
        specialized: [
            "Bloom Filters - Testes probabilísticos de pertinência",
            "Skip Lists - Listas ligadas com múltiplos níveis",
            "Suffix Trees - Para processamento avançado de strings",
            "Persistent Data Structures - Estruturas imutáveis"
        ]
    }
};

// Exibir o guia
function displaySection(section, title) {
    console.log(`\n📌 ${title.toUpperCase()}`);
    console.log("-".repeat(50));

    if (Array.isArray(section)) {
        section.forEach(item => console.log(`  • ${item}`));
    } else if (typeof section === 'object') {
        Object.entries(section).forEach(([key, value]) => {
            if (typeof value === 'object' && !Array.isArray(value)) {
                console.log(`\n  🔸 ${key}:`);
                Object.entries(value).forEach(([k, v]) => {
                    if (Array.isArray(v)) {
                        console.log(`    ${k}: ${v.join(', ')}`);
                    } else {
                        console.log(`    ${k}: ${v}`);
                    }
                });
            } else if (Array.isArray(value)) {
                console.log(`\n  🔸 ${key}:`);
                value.forEach(item => console.log(`    • ${item}`));
            } else {
                console.log(`  ${key}: ${value}`);
            }
        });
    }
}

// Exibir todas as seções
displaySection(guide.overview.content, guide.overview.title);
displaySection(guide.linear.structures, guide.linear.title);
displaySection(guide.hierarchical.structures, guide.hierarchical.title);
displaySection(guide.network.structures, guide.network.title);
displaySection(guide.optimization.structures, guide.optimization.title);
displaySection(guide.complexity, guide.complexity.title);
displaySection(guide.whenToUse.scenarios, guide.whenToUse.title);
displaySection(guide.algorithms, guide.algorithms.title);
displaySection(guide.implementation.tips, guide.implementation.title);
displaySection(guide.nextSteps, guide.nextSteps.title);

console.log("\n" + "=".repeat(60));
console.log("🎓 GUIA COMPLETO - ESTRUTURAS DE DADOS DOMINADAS!");
console.log("📚 Use este guia como referência para seus estudos");
console.log("🚀 Continue praticando e implementando novas estruturas!");
console.log("=".repeat(60));
