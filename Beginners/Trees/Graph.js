// Graphs (Grafos)

// Um grafo é uma estrutura de dados não-linear composta por vértices (nós) e arestas (conexões) que representam relacionamentos entre os elementos. Diferente de árvores, grafos podem ter ciclos e cada vértice pode estar conectado a qualquer número de outros vértices.

// Características principais
// Vértices (V): Os nós ou pontos do grafo
// Arestas (E): As conexões entre os vértices
// Direcionado: Arestas têm direção (A → B)
// Não-direcionado: Arestas são bidirecionais (A ↔ B)
// Peso: Arestas podem ter valores associados (distância, custo, etc.)
// Ciclo: Caminho que começa e termina no mesmo vértice

// Complexidades (para V vértices e E arestas):
// Busca em Largura (BFS): O(V + E)
// Busca em Profundidade (DFS): O(V + E)
// Dijkstra (menor caminho): O((V + E) log V)
// Adição de vértice: O(1)
// Adição de aresta: O(1)

class Graph {
    constructor(isDirected = false) {
        this.adjacencyList = new Map();
        this.isDirected = isDirected;
    }

    // Adiciona um vértice ao grafo
    addVertex(vertex) {
        if (!this.adjacencyList.has(vertex)) {
            this.adjacencyList.set(vertex, []);
        }
    }

    // Remove um vértice e todas suas conexões
    removeVertex(vertex) {
        if (!this.adjacencyList.has(vertex)) return false;

        // Remove todas as arestas que chegam a este vértice
        for (let [v, edges] of this.adjacencyList) {
            this.adjacencyList.set(v, edges.filter(edge => edge.vertex !== vertex));
        }

        // Remove o vértice
        this.adjacencyList.delete(vertex);
        return true;
    }

    // Adiciona uma aresta entre dois vértices
    addEdge(vertex1, vertex2, weight = 1) {
        // Adiciona os vértices se não existirem
        this.addVertex(vertex1);
        this.addVertex(vertex2);

        // Adiciona a aresta
        this.adjacencyList.get(vertex1).push({ vertex: vertex2, weight });

        // Se não é direcionado, adiciona a aresta reversa
        if (!this.isDirected) {
            this.adjacencyList.get(vertex2).push({ vertex: vertex1, weight });
        }
    }

    // Remove uma aresta
    removeEdge(vertex1, vertex2) {
        if (!this.adjacencyList.has(vertex1) || !this.adjacencyList.has(vertex2)) {
            return false;
        }

        // Remove a aresta vertex1 → vertex2
        this.adjacencyList.set(
            vertex1,
            this.adjacencyList.get(vertex1).filter(edge => edge.vertex !== vertex2)
        );

        // Se não é direcionado, remove a aresta reversa
        if (!this.isDirected) {
            this.adjacencyList.set(
                vertex2,
                this.adjacencyList.get(vertex2).filter(edge => edge.vertex !== vertex1)
            );
        }

        return true;
    }

    // Busca em Profundidade (DFS) - Depth-First Search
    depthFirstSearch(startVertex, callback) {
        if (!this.adjacencyList.has(startVertex)) return;

        const visited = new Set();
        const result = [];

        const dfs = (vertex) => {
            visited.add(vertex);
            result.push(vertex);
            if (callback) callback(vertex);

            const neighbors = this.adjacencyList.get(vertex);
            for (let edge of neighbors) {
                if (!visited.has(edge.vertex)) {
                    dfs(edge.vertex);
                }
            }
        };

        dfs(startVertex);
        return result;
    }

    // Busca em Largura (BFS) - Breadth-First Search
    breadthFirstSearch(startVertex, callback) {
        if (!this.adjacencyList.has(startVertex)) return;

        const visited = new Set();
        const queue = [startVertex];
        const result = [];

        visited.add(startVertex);

        while (queue.length > 0) {
            const vertex = queue.shift();
            result.push(vertex);
            if (callback) callback(vertex);

            const neighbors = this.adjacencyList.get(vertex);
            for (let edge of neighbors) {
                if (!visited.has(edge.vertex)) {
                    visited.add(edge.vertex);
                    queue.push(edge.vertex);
                }
            }
        }

        return result;
    }

    // Verifica se existe um caminho entre dois vértices
    hasPath(start, end) {
        if (!this.adjacencyList.has(start) || !this.adjacencyList.has(end)) {
            return false;
        }

        const visited = new Set();
        const stack = [start];

        while (stack.length > 0) {
            const vertex = stack.pop();
            
            if (vertex === end) return true;
            
            if (!visited.has(vertex)) {
                visited.add(vertex);
                const neighbors = this.adjacencyList.get(vertex);
                for (let edge of neighbors) {
                    stack.push(edge.vertex);
                }
            }
        }

        return false;
    }

    // Algoritmo de Dijkstra para menor caminho (apenas grafos com pesos positivos)
    dijkstra(startVertex) {
        const distances = new Map();
        const previous = new Map();
        const unvisited = new Set();

        // Inicializa distâncias
        for (let vertex of this.adjacencyList.keys()) {
            distances.set(vertex, vertex === startVertex ? 0 : Infinity);
            previous.set(vertex, null);
            unvisited.add(vertex);
        }

        while (unvisited.size > 0) {
            // Encontra o vértice não visitado com menor distância
            let currentVertex = null;
            let minDistance = Infinity;
            
            for (let vertex of unvisited) {
                if (distances.get(vertex) < minDistance) {
                    minDistance = distances.get(vertex);
                    currentVertex = vertex;
                }
            }

            if (currentVertex === null) break;

            unvisited.delete(currentVertex);

            // Atualiza distâncias dos vizinhos
            const neighbors = this.adjacencyList.get(currentVertex);
            for (let edge of neighbors) {
                const newDistance = distances.get(currentVertex) + edge.weight;
                
                if (newDistance < distances.get(edge.vertex)) {
                    distances.set(edge.vertex, newDistance);
                    previous.set(edge.vertex, currentVertex);
                }
            }
        }

        return { distances, previous };
    }

    // Reconstrói o caminho a partir do resultado do Dijkstra
    getPath(start, end) {
        const { distances, previous } = this.dijkstra(start);
        
        if (distances.get(end) === Infinity) return null;

        const path = [];
        let current = end;

        while (current !== null) {
            path.unshift(current);
            current = previous.get(current);
        }

        return {
            path,
            distance: distances.get(end)
        };
    }

    // Detecção de ciclos (para grafos não-direcionados)
    hasCycle() {
        const visited = new Set();
        const inRecStack = new Set();

        const dfs = (vertex, parent) => {
            visited.add(vertex);
            inRecStack.add(vertex);

            const neighbors = this.adjacencyList.get(vertex);
            for (let edge of neighbors) {
                const neighbor = edge.vertex;

                if (!visited.has(neighbor)) {
                    if (dfs(neighbor, vertex)) return true;
                } else if (inRecStack.has(neighbor) && neighbor !== parent) {
                    return true;
                }
            }

            inRecStack.delete(vertex);
            return false;
        };

        for (let vertex of this.adjacencyList.keys()) {
            if (!visited.has(vertex)) {
                if (dfs(vertex, null)) return true;
            }
        }

        return false;
    }

    // Conta o número de vértices
    getVertexCount() {
        return this.adjacencyList.size;
    }

    // Conta o número de arestas
    getEdgeCount() {
        let count = 0;
        for (let edges of this.adjacencyList.values()) {
            count += edges.length;
        }
        return this.isDirected ? count : count / 2;
    }

    // Obtém todos os vértices
    getVertices() {
        return Array.from(this.adjacencyList.keys());
    }

    // Obtém os vizinhos de um vértice
    getNeighbors(vertex) {
        return this.adjacencyList.has(vertex) 
            ? this.adjacencyList.get(vertex).map(edge => edge.vertex)
            : [];
    }

    // Obtém o grau de um vértice (número de conexões)
    getDegree(vertex) {
        return this.adjacencyList.has(vertex) 
            ? this.adjacencyList.get(vertex).length 
            : 0;
    }

    // Verifica se o grafo está conectado
    isConnected() {
        if (this.getVertexCount() === 0) return true;

        const vertices = this.getVertices();
        const visited = this.depthFirstSearch(vertices[0]);

        return visited.length === vertices.length;
    }

    // Imprime o grafo em formato visual
    printGraph() {
        console.log(`Grafo ${this.isDirected ? 'Direcionado' : 'Não-Direcionado'}:`);
        console.log(`Vértices: ${this.getVertexCount()}, Arestas: ${this.getEdgeCount()}`);
        console.log('─'.repeat(40));

        for (let [vertex, edges] of this.adjacencyList) {
            const connections = edges.map(edge => 
                edge.weight !== 1 ? `${edge.vertex}(${edge.weight})` : edge.vertex
            ).join(', ');
            
            const arrow = this.isDirected ? ' → ' : ' ↔ ';
            console.log(`${vertex}${arrow}[${connections}]`);
        }
    }

    // Imprime em formato de árvore (para visualização de DFS)
    printAsTree(startVertex) {
        if (!this.adjacencyList.has(startVertex)) return;

        const visited = new Set();
        
        const printRecursive = (vertex, prefix, isLast) => {
            console.log(prefix + (isLast ? "└── " : "├── ") + vertex);
            visited.add(vertex);

            const neighbors = this.adjacencyList.get(vertex)
                .filter(edge => !visited.has(edge.vertex))
                .map(edge => edge.vertex);

            neighbors.forEach((neighbor, index) => {
                const isLastChild = index === neighbors.length - 1;
                const newPrefix = prefix + (isLast ? "    " : "│   ");
                printRecursive(neighbor, newPrefix, isLastChild);
            });
        };

        console.log("Travessia DFS em formato de árvore:");
        printRecursive(startVertex, "", true);
    }

    // Converte para representação de matriz de adjacência
    toAdjacencyMatrix() {
        const vertices = this.getVertices();
        const size = vertices.length;
        const matrix = Array(size).fill().map(() => Array(size).fill(0));

        vertices.forEach((vertex1, i) => {
            const edges = this.adjacencyList.get(vertex1);
            edges.forEach(edge => {
                const j = vertices.indexOf(edge.vertex);
                if (j !== -1) {
                    matrix[i][j] = edge.weight;
                }
            });
        });

        return { matrix, vertices };
    }

    // Imprime matriz de adjacência
    printAdjacencyMatrix() {
        const { matrix, vertices } = this.toAdjacencyMatrix();
        
        console.log("Matriz de Adjacência:");
        console.log("     " + vertices.join("  "));
        
        matrix.forEach((row, i) => {
            console.log(`${vertices[i].padEnd(2)} | ${row.join("  ")}`);
        });
    }
}

// TESTES COMPLETOS DO GRAFO
console.log("🕸️  TESTANDO GRAFO COMPLETO");
console.log("=".repeat(60));

// Criando um grafo não-direcionado
const graph = new Graph(false);

// Adicionando vértices e arestas
graph.addEdge('A', 'B', 2);
graph.addEdge('A', 'C', 3);
graph.addEdge('B', 'D', 1);
graph.addEdge('C', 'D', 1);
graph.addEdge('C', 'E', 4);
graph.addEdge('D', 'E', 2);
graph.addEdge('D', 'F', 3);
graph.addEdge('E', 'F', 1);

console.log("📊 Grafo criado:");
graph.printGraph();

console.log("\n🔍 BUSCAS:");
console.log("DFS a partir de A:", graph.depthFirstSearch('A'));
console.log("BFS a partir de A:", graph.breadthFirstSearch('A'));

console.log("\n📈 ESTATÍSTICAS:");
console.log(`Vértices: ${graph.getVertexCount()}`);
console.log(`Arestas: ${graph.getEdgeCount()}`);
console.log(`Conectado: ${graph.isConnected()}`);
console.log(`Tem ciclo: ${graph.hasCycle()}`);

console.log("\n🎯 ANÁLISE DE VÉRTICES:");
graph.getVertices().forEach(vertex => {
    console.log(`${vertex}: grau=${graph.getDegree(vertex)}, vizinhos=[${graph.getNeighbors(vertex).join(', ')}]`);
});

console.log("\n🛣️  MENOR CAMINHO (Dijkstra de A para F):");
const pathResult = graph.getPath('A', 'F');
if (pathResult) {
    console.log(`Caminho: ${pathResult.path.join(' → ')}`);
    console.log(`Distância total: ${pathResult.distance}`);
} else {
    console.log("Nenhum caminho encontrado");
}

console.log("\n🌳 VISUALIZAÇÃO EM ÁRVORE (DFS de A):");
graph.printAsTree('A');

console.log("\n📋 MATRIZ DE ADJACÊNCIA:");
graph.printAdjacencyMatrix();

console.log("\n➡️  TESTANDO GRAFO DIRECIONADO:");
const directedGraph = new Graph(true);
directedGraph.addEdge('X', 'Y', 1);
directedGraph.addEdge('Y', 'Z', 1);
directedGraph.addEdge('Z', 'X', 1); // Cria um ciclo
directedGraph.printGraph();
console.log(`Tem ciclo: ${directedGraph.hasCycle()}`);

console.log("\n❌ TESTANDO REMOÇÕES:");
console.log("Removendo vértice C...");
graph.removeVertex('C');
graph.printGraph();

console.log("\n🔗 VERIFICAÇÃO DE CAMINHOS:");
console.log(`Caminho A → F: ${graph.hasPath('A', 'F')}`);
console.log(`Caminho A → C: ${graph.hasPath('A', 'C')}`);
