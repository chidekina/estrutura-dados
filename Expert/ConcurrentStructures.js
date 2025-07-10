/**
 * CONCURRENT DATA STRUCTURES - EXPERT MODULE
 * ==========================================
 * 
 * Estruturas de dados thread-safe para programação concorrente.
 * Em JavaScript (single-threaded), simulamos concorrência com
 * Web Workers, async/await e demonstrações conceituais.
 * 
 * Conceitos implementados:
 * - Lock-free structures (CAS - Compare and Swap)
 * - Thread-safe collections
 * - Atomic operations
 * - Memory barriers (conceitual)
 * - Producer-Consumer patterns
 * 
 * Nota: JavaScript é single-threaded no main thread, mas
 * estes conceitos são fundamentais para linguagens multi-threaded
 * e sistemas distribuídos.
 */

/**
 * ATOMIC OPERATIONS (Simulação)
 * Simula operações atômicas que seriam hardware-level
 */
class AtomicInteger {
    constructor(value = 0) {
        this.value = value;
        this.operationCount = 0;
    }

    /**
     * Simula Compare-And-Swap (CAS)
     * Operação atômica fundamental para lock-free programming
     */
    compareAndSwap(expected, newValue) {
        this.operationCount++;

        // Em um sistema real, esta operação seria atômica no hardware
        if (this.value === expected) {
            this.value = newValue;
            return true;
        }
        return false;
    }

    /**
     * Incremento atômico
     */
    incrementAndGet() {
        let current, next;
        do {
            current = this.value;
            next = current + 1;
        } while (!this.compareAndSwap(current, next));

        return next;
    }

    /**
     * Decremento atômico
     */
    decrementAndGet() {
        let current, next;
        do {
            current = this.value;
            next = current - 1;
        } while (!this.compareAndSwap(current, next));

        return next;
    }

    /**
     * Adição atômica
     */
    addAndGet(delta) {
        let current, next;
        do {
            current = this.value;
            next = current + delta;
        } while (!this.compareAndSwap(current, next));

        return next;
    }

    get() {
        return this.value;
    }

    set(newValue) {
        this.value = newValue;
    }

    getOperationCount() {
        return this.operationCount;
    }
}

/**
 * LOCK-FREE STACK
 * Stack sem locks usando CAS operations
 */
class LockFreeStack {
    constructor() {
        this.head = null;
        this.size = new AtomicInteger(0);
        this.pushAttempts = 0;
        this.popAttempts = 0;
        this.casRetries = 0;
    }

    /**
     * Push lock-free usando CAS
     */
    push(data) {
        const newNode = { data: data, next: null };
        this.pushAttempts++;

        let currentHead;
        do {
            currentHead = this.head;
            newNode.next = currentHead;
            this.casRetries++;
        } while (!this._compareAndSwapHead(currentHead, newNode));

        this.size.incrementAndGet();
    }

    /**
     * Pop lock-free usando CAS
     */
    pop() {
        this.popAttempts++;

        let currentHead, nextHead;
        do {
            currentHead = this.head;
            if (currentHead === null) {
                return null; // Stack vazia
            }
            nextHead = currentHead.next;
            this.casRetries++;
        } while (!this._compareAndSwapHead(currentHead, nextHead));

        this.size.decrementAndGet();
        return currentHead.data;
    }

    /**
     * Simula CAS operation no ponteiro head
     */
    _compareAndSwapHead(expected, newValue) {
        if (this.head === expected) {
            this.head = newValue;
            return true;
        }
        return false;
    }

    peek() {
        const currentHead = this.head;
        return currentHead ? currentHead.data : null;
    }

    isEmpty() {
        return this.head === null;
    }

    getSize() {
        return this.size.get();
    }

    getStats() {
        return {
            size: this.getSize(),
            pushAttempts: this.pushAttempts,
            popAttempts: this.popAttempts,
            casRetries: this.casRetries,
            efficiency: this.casRetries > 0 ?
                ((this.pushAttempts + this.popAttempts) / this.casRetries).toFixed(2) : 'N/A'
        };
    }
}

/**
 * CONCURRENT QUEUE (Michael & Scott Algorithm)
 * Queue lock-free com dummy node
 */
class LockFreeQueue {
    constructor() {
        // Dummy node para simplificar algoritmo
        const dummy = { data: null, next: null };
        this.head = dummy;
        this.tail = dummy;
        this.size = new AtomicInteger(0);
        this.enqueueAttempts = 0;
        this.dequeueAttempts = 0;
        this.casRetries = 0;
    }

    /**
     * Enqueue lock-free
     */
    enqueue(data) {
        const newNode = { data: data, next: null };
        this.enqueueAttempts++;

        while (true) {
            const currentTail = this.tail;
            const currentNext = currentTail.next;

            if (currentTail === this.tail) { // Verifica se tail não mudou
                if (currentNext === null) {
                    // Tail está no último nó, tenta adicionar
                    if (this._compareAndSwapNext(currentTail, null, newNode)) {
                        break; // Sucesso
                    }
                } else {
                    // Tail não está no último nó, ajuda a mover
                    this._compareAndSwapTail(currentTail, currentNext);
                }
            }
            this.casRetries++;
        }

        // Move tail para o novo nó
        this._compareAndSwapTail(this.tail, newNode);
        this.size.incrementAndGet();
    }

    /**
     * Dequeue lock-free
     */
    dequeue() {
        this.dequeueAttempts++;

        while (true) {
            const currentHead = this.head;
            const currentTail = this.tail;
            const currentNext = currentHead.next;

            if (currentHead === this.head) { // Verifica se head não mudou
                if (currentHead === currentTail) {
                    if (currentNext === null) {
                        return null; // Queue vazia
                    }
                    // Ajuda a mover tail
                    this._compareAndSwapTail(currentTail, currentNext);
                } else {
                    if (currentNext === null) {
                        continue; // Inconsistência, tenta novamente
                    }

                    const data = currentNext.data;

                    // Tenta mover head
                    if (this._compareAndSwapHead(currentHead, currentNext)) {
                        this.size.decrementAndGet();
                        return data;
                    }
                }
            }
            this.casRetries++;
        }
    }

    _compareAndSwapHead(expected, newValue) {
        if (this.head === expected) {
            this.head = newValue;
            return true;
        }
        return false;
    }

    _compareAndSwapTail(expected, newValue) {
        if (this.tail === expected) {
            this.tail = newValue;
            return true;
        }
        return false;
    }

    _compareAndSwapNext(node, expected, newValue) {
        if (node.next === expected) {
            node.next = newValue;
            return true;
        }
        return false;
    }

    isEmpty() {
        return this.head === this.tail && this.head.next === null;
    }

    getSize() {
        return this.size.get();
    }

    getStats() {
        return {
            size: this.getSize(),
            enqueueAttempts: this.enqueueAttempts,
            dequeueAttempts: this.dequeueAttempts,
            casRetries: this.casRetries,
            efficiency: this.casRetries > 0 ?
                ((this.enqueueAttempts + this.dequeueAttempts) / this.casRetries).toFixed(2) : 'N/A'
        };
    }
}

/**
 * CONCURRENT HASH MAP
 * Hash map thread-safe com segmentação
 */
class ConcurrentHashMap {
    constructor(initialCapacity = 16, loadFactor = 0.75) {
        this.capacity = initialCapacity;
        this.loadFactor = loadFactor;
        this.segmentCount = 16; // Número de segmentos para reduzir contenção

        // Cada segmento tem seu próprio "lock" (simulado)
        this.segments = Array(this.segmentCount).fill().map(() => ({
            buckets: new Array(Math.ceil(initialCapacity / this.segmentCount)).fill(null),
            size: new AtomicInteger(0),
            locked: false
        }));

        this.totalSize = new AtomicInteger(0);
        this.operations = {
            puts: 0,
            gets: 0,
            removes: 0,
            lockWaits: 0
        };
    }

    /**
     * Hash function
     */
    _hash(key) {
        let hash = 0;
        const str = String(key);
        for (let i = 0; i < str.length; i++) {
            const char = str.charCodeAt(i);
            hash = ((hash << 5) - hash) + char;
            hash = hash & hash; // Convert to 32bit integer
        }
        return Math.abs(hash);
    }

    /**
     * Obtém o segmento para uma chave
     */
    _getSegment(key) {
        const hash = this._hash(key);
        return hash % this.segmentCount;
    }

    /**
     * Obtém o bucket dentro de um segmento
     */
    _getBucket(key, segment) {
        const hash = this._hash(key);
        return hash % segment.buckets.length;
    }

    /**
     * Simula lock de segmento
     */
    async _lockSegment(segmentIndex) {
        const segment = this.segments[segmentIndex];

        while (segment.locked) {
            this.operations.lockWaits++;
            await new Promise(resolve => setTimeout(resolve, 1)); // Simula espera
        }

        segment.locked = true;
    }

    /**
     * Simula unlock de segmento
     */
    _unlockSegment(segmentIndex) {
        this.segments[segmentIndex].locked = false;
    }

    /**
     * Put operation
     */
    async put(key, value) {
        this.operations.puts++;

        const segmentIndex = this._getSegment(key);
        const segment = this.segments[segmentIndex];

        await this._lockSegment(segmentIndex);

        try {
            const bucketIndex = this._getBucket(key, segment);
            let bucket = segment.buckets[bucketIndex];

            // Procura chave existente
            let current = bucket;
            while (current) {
                if (current.key === key) {
                    current.value = value;
                    return current; // Atualizou valor existente
                }
                current = current.next;
            }

            // Adiciona nova entrada
            const newEntry = {
                key: key,
                value: value,
                next: bucket
            };

            segment.buckets[bucketIndex] = newEntry;
            segment.size.incrementAndGet();
            this.totalSize.incrementAndGet();

            // Verifica se precisa redimensionar
            if (segment.size.get() > segment.buckets.length * this.loadFactor) {
                this._resizeSegment(segmentIndex);
            }

            return newEntry;
        } finally {
            this._unlockSegment(segmentIndex);
        }
    }

    /**
     * Get operation
     */
    async get(key) {
        this.operations.gets++;

        const segmentIndex = this._getSegment(key);
        const segment = this.segments[segmentIndex];

        // Read operations podem ser lock-free em muitas implementações
        const bucketIndex = this._getBucket(key, segment);
        let current = segment.buckets[bucketIndex];

        while (current) {
            if (current.key === key) {
                return current.value;
            }
            current = current.next;
        }

        return undefined;
    }

    /**
     * Remove operation
     */
    async remove(key) {
        this.operations.removes++;

        const segmentIndex = this._getSegment(key);
        const segment = this.segments[segmentIndex];

        await this._lockSegment(segmentIndex);

        try {
            const bucketIndex = this._getBucket(key, segment);
            let current = segment.buckets[bucketIndex];
            let previous = null;

            while (current) {
                if (current.key === key) {
                    if (previous) {
                        previous.next = current.next;
                    } else {
                        segment.buckets[bucketIndex] = current.next;
                    }

                    segment.size.decrementAndGet();
                    this.totalSize.decrementAndGet();
                    return current.value;
                }

                previous = current;
                current = current.next;
            }

            return undefined;
        } finally {
            this._unlockSegment(segmentIndex);
        }
    }

    /**
     * Redimensiona um segmento
     */
    _resizeSegment(segmentIndex) {
        const segment = this.segments[segmentIndex];
        const oldBuckets = segment.buckets;
        const newCapacity = oldBuckets.length * 2;

        segment.buckets = new Array(newCapacity).fill(null);

        // Reinsere todas as entradas
        for (const bucket of oldBuckets) {
            let current = bucket;
            while (current) {
                const next = current.next;
                const newBucketIndex = this._getBucket(current.key, segment);

                current.next = segment.buckets[newBucketIndex];
                segment.buckets[newBucketIndex] = current;

                current = next;
            }
        }
    }

    /**
     * Verifica se contém chave
     */
    async containsKey(key) {
        const value = await this.get(key);
        return value !== undefined;
    }

    size() {
        return this.totalSize.get();
    }

    isEmpty() {
        return this.totalSize.get() === 0;
    }

    getStats() {
        const segmentStats = this.segments.map((segment, index) => ({
            index: index,
            size: segment.size.get(),
            buckets: segment.buckets.length,
            loadFactor: (segment.size.get() / segment.buckets.length).toFixed(2)
        }));

        return {
            totalSize: this.size(),
            segmentCount: this.segmentCount,
            operations: this.operations,
            segments: segmentStats,
            averageLoadFactor: (segmentStats.reduce((sum, seg) =>
                sum + parseFloat(seg.loadFactor), 0) / this.segmentCount).toFixed(2)
        };
    }
}

/**
 * PRODUCER-CONSUMER com Bounded Buffer
 * Demonstra sincronização entre produtores e consumidores
 */
class BoundedBuffer {
    constructor(capacity = 10) {
        this.capacity = capacity;
        this.buffer = new Array(capacity);
        this.head = 0;
        this.tail = 0;
        this.count = new AtomicInteger(0);
        this.putWaits = 0;
        this.takeWaits = 0;
    }

    /**
     * Adiciona item ao buffer (bloqueia se cheio)
     */
    async put(item) {
        while (this.count.get() >= this.capacity) {
            this.putWaits++;
            await new Promise(resolve => setTimeout(resolve, 10));
        }

        this.buffer[this.tail] = item;
        this.tail = (this.tail + 1) % this.capacity;
        this.count.incrementAndGet();
    }

    /**
     * Remove item do buffer (bloqueia se vazio)
     */
    async take() {
        while (this.count.get() === 0) {
            this.takeWaits++;
            await new Promise(resolve => setTimeout(resolve, 10));
        }

        const item = this.buffer[this.head];
        this.buffer[this.head] = null;
        this.head = (this.head + 1) % this.capacity;
        this.count.decrementAndGet();

        return item;
    }

    /**
     * Tenta adicionar sem bloquear
     */
    tryPut(item) {
        if (this.count.get() >= this.capacity) {
            return false;
        }

        this.buffer[this.tail] = item;
        this.tail = (this.tail + 1) % this.capacity;
        this.count.incrementAndGet();
        return true;
    }

    /**
     * Tenta remover sem bloquear
     */
    tryTake() {
        if (this.count.get() === 0) {
            return null;
        }

        const item = this.buffer[this.head];
        this.buffer[this.head] = null;
        this.head = (this.head + 1) % this.capacity;
        this.count.decrementAndGet();

        return item;
    }

    size() {
        return this.count.get();
    }

    isFull() {
        return this.count.get() >= this.capacity;
    }

    isEmpty() {
        return this.count.get() === 0;
    }

    getStats() {
        return {
            capacity: this.capacity,
            currentSize: this.size(),
            putWaits: this.putWaits,
            takeWaits: this.takeWaits,
            utilization: (this.size() / this.capacity * 100).toFixed(1) + '%'
        };
    }
}

// =====================================
// EXEMPLOS DE USO E DEMONSTRAÇÕES
// =====================================

console.log('=== DEMONSTRAÇÃO CONCURRENT DATA STRUCTURES ===\n');

// 1. Atomic Operations
console.log('1. OPERAÇÕES ATÔMICAS:');
const atomic = new AtomicInteger(0);

console.log('Valor inicial:', atomic.get());
console.log('Increment and get:', atomic.incrementAndGet());
console.log('Add 5:', atomic.addAndGet(5));
console.log('Compare and swap (6 -> 10):', atomic.compareAndSwap(6, 10));
console.log('Valor final:', atomic.get());
console.log('Operações CAS realizadas:', atomic.getOperationCount());

// 2. Lock-Free Stack
console.log('\n2. LOCK-FREE STACK:');
const stack = new LockFreeStack();

// Simula operações concorrentes
const stackOps = ['push:A', 'push:B', 'pop', 'push:C', 'pop', 'push:D'];
stackOps.forEach(op => {
    if (op.startsWith('push:')) {
        const item = op.split(':')[1];
        stack.push(item);
        console.log(`Pushed: ${item}, Size: ${stack.getSize()}`);
    } else if (op === 'pop') {
        const item = stack.pop();
        console.log(`Popped: ${item}, Size: ${stack.getSize()}`);
    }
});

console.log('Stack stats:', stack.getStats());

// 3. Lock-Free Queue
console.log('\n3. LOCK-FREE QUEUE:');
const queue = new LockFreeQueue();

const queueOps = ['enqueue:1', 'enqueue:2', 'dequeue', 'enqueue:3', 'dequeue', 'dequeue'];
queueOps.forEach(op => {
    if (op.startsWith('enqueue:')) {
        const item = op.split(':')[1];
        queue.enqueue(item);
        console.log(`Enqueued: ${item}, Size: ${queue.getSize()}`);
    } else if (op === 'dequeue') {
        const item = queue.dequeue();
        console.log(`Dequeued: ${item}, Size: ${queue.getSize()}`);
    }
});

console.log('Queue stats:', queue.getStats());

// =====================================
// CONCURRENT HASH MAP DEMO
// =====================================

console.log('\n=== CONCURRENT HASH MAP ===\n');

async function demoConcurrentHashMap() {
    const map = new ConcurrentHashMap(8, 0.75);

    console.log('Inserindo dados:');
    await map.put('user:1', { name: 'Alice', age: 30 });
    await map.put('user:2', { name: 'Bob', age: 25 });
    await map.put('user:3', { name: 'Carol', age: 35 });

    console.log('user:1:', await map.get('user:1'));
    console.log('user:2:', await map.get('user:2'));
    console.log('user:999:', await map.get('user:999'));

    console.log('\nSimulando operações concorrentes:');

    // Simula múltiplas operações simultâneas
    const promises = [];
    for (let i = 0; i < 20; i++) {
        promises.push(map.put(`key:${i}`, `value:${i}`));
    }

    await Promise.all(promises);
    console.log('Inseridas 20 entradas concorrentemente');

    console.log('\nEstatísticas do Concurrent HashMap:');
    console.log(map.getStats());
}

// =====================================
// PRODUCER-CONSUMER DEMO
// =====================================

console.log('\n=== PRODUCER-CONSUMER PATTERN ===\n');

async function demoProducerConsumer() {
    const buffer = new BoundedBuffer(5);

    // Producer function
    const producer = async (id, items) => {
        for (let i = 0; i < items; i++) {
            const item = `Producer-${id}-Item-${i}`;
            await buffer.put(item);
            console.log(`Produced: ${item} (Buffer size: ${buffer.size()})`);
            await new Promise(resolve => setTimeout(resolve, Math.random() * 50));
        }
    };

    // Consumer function
    const consumer = async (id, items) => {
        for (let i = 0; i < items; i++) {
            const item = await buffer.take();
            console.log(`Consumer-${id} consumed: ${item} (Buffer size: ${buffer.size()})`);
            await new Promise(resolve => setTimeout(resolve, Math.random() * 100));
        }
    };

    console.log('Iniciando produtores e consumidores...');

    // Inicia produtores e consumidores concorrentemente
    const tasks = [
        producer(1, 3),
        producer(2, 3),
        consumer(1, 2),
        consumer(2, 2),
        consumer(3, 2)
    ];

    await Promise.all(tasks);

    console.log('\nEstatísticas do Buffer:');
    console.log(buffer.getStats());
}

// =====================================
// CASOS DE USO PRÁTICOS
// =====================================

console.log('\n=== CASOS DE USO PRÁTICOS ===\n');

// 1. Sistema de Cache Thread-Safe
class ThreadSafeCache {
    constructor(maxSize = 100) {
        this.cache = new ConcurrentHashMap(maxSize);
        this.accessCount = new AtomicInteger(0);
        this.hitCount = new AtomicInteger(0);
        this.maxSize = maxSize;
    }

    async get(key) {
        this.accessCount.incrementAndGet();
        const value = await this.cache.get(key);

        if (value !== undefined) {
            this.hitCount.incrementAndGet();
        }

        return value;
    }

    async put(key, value) {
        // Implementação simplificada - em produção teria LRU eviction
        return await this.cache.put(key, value);
    }

    getHitRate() {
        const accesses = this.accessCount.get();
        const hits = this.hitCount.get();
        return accesses > 0 ? (hits / accesses * 100).toFixed(2) + '%' : '0%';
    }

    async getStats() {
        return {
            size: this.cache.size(),
            maxSize: this.maxSize,
            hitRate: this.getHitRate(),
            totalAccesses: this.accessCount.get(),
            cacheStats: this.cache.getStats()
        };
    }
}

// 2. Task Scheduler Concorrente
class ConcurrentTaskScheduler {
    constructor(workerCount = 4, queueSize = 100) {
        this.taskQueue = new BoundedBuffer(queueSize);
        this.workerCount = workerCount;
        this.completedTasks = new AtomicInteger(0);
        this.failedTasks = new AtomicInteger(0);
        this.workers = [];
        this.isRunning = false;
    }

    async start() {
        this.isRunning = true;
        console.log(`Iniciando ${this.workerCount} workers...`);

        for (let i = 0; i < this.workerCount; i++) {
            this.workers.push(this._worker(i));
        }
    }

    async _worker(id) {
        while (this.isRunning) {
            try {
                const task = await this.taskQueue.take();
                if (task) {
                    console.log(`Worker ${id} executando: ${task.name}`);

                    try {
                        await task.execute();
                        this.completedTasks.incrementAndGet();
                        console.log(`Worker ${id} completou: ${task.name}`);
                    } catch (error) {
                        this.failedTasks.incrementAndGet();
                        console.log(`Worker ${id} falhou: ${task.name} - ${error.message}`);
                    }
                }
            } catch (error) {
                // Worker continua mesmo se houver erro
            }
        }
    }

    async submitTask(task) {
        return await this.taskQueue.put(task);
    }

    stop() {
        this.isRunning = false;
    }

    getStats() {
        return {
            workerCount: this.workerCount,
            queueSize: this.taskQueue.size(),
            completedTasks: this.completedTasks.get(),
            failedTasks: this.failedTasks.get(),
            queueStats: this.taskQueue.getStats()
        };
    }
}

// =====================================
// TESTE DE PERFORMANCE
// =====================================

console.log('\n=== TESTE DE PERFORMANCE ===\n');

async function testConcurrentPerformance() {
    const sizes = [100, 500, 1000];

    for (const size of sizes) {
        console.log(`\nTestando estruturas concorrentes com ${size} operações:`);

        // Teste Lock-Free Stack
        const stack = new LockFreeStack();
        const startStack = performance.now();

        for (let i = 0; i < size; i++) {
            stack.push(i);
        }
        for (let i = 0; i < size / 2; i++) {
            stack.pop();
        }

        const endStack = performance.now();

        // Teste Concurrent HashMap
        const map = new ConcurrentHashMap();
        const startMap = performance.now();

        const mapPromises = [];
        for (let i = 0; i < size; i++) {
            mapPromises.push(map.put(`key${i}`, `value${i}`));
        }
        await Promise.all(mapPromises);

        const endMap = performance.now();

        console.log(`  Lock-Free Stack: ${(endStack - startStack).toFixed(2)}ms`);
        console.log(`  Concurrent HashMap: ${(endMap - startMap).toFixed(2)}ms`);
        console.log(`  Stack CAS retries: ${stack.getStats().casRetries}`);
        console.log(`  HashMap lock waits: ${map.getStats().operations.lockWaits}`);
    }
}

// =====================================
// EXECUÇÃO DOS DEMOS
// =====================================

async function runAllDemos() {
    try {
        await demoConcurrentHashMap();
        await demoProducerConsumer();
        await testConcurrentPerformance();

        console.log('\n=== DEMO SISTEMAS PRÁTICOS ===\n');

        // Cache Thread-Safe
        const cache = new ThreadSafeCache(10);
        await cache.put('user:1', { name: 'Alice' });
        await cache.put('user:2', { name: 'Bob' });

        console.log('Cache user:1:', await cache.get('user:1'));
        console.log('Cache user:3:', await cache.get('user:3')); // Miss
        console.log('Cache stats:', await cache.getStats());

        // Task Scheduler
        const scheduler = new ConcurrentTaskScheduler(2, 10);
        await scheduler.start();

        // Submete algumas tarefas
        for (let i = 0; i < 5; i++) {
            await scheduler.submitTask({
                name: `Task-${i}`,
                execute: async () => {
                    await new Promise(resolve => setTimeout(resolve, Math.random() * 100));
                    if (Math.random() < 0.1) throw new Error('Random failure');
                }
            });
        }

        // Aguarda um pouco e verifica estatísticas
        await new Promise(resolve => setTimeout(resolve, 500));
        console.log('Scheduler stats:', scheduler.getStats());
        scheduler.stop();

    } catch (error) {
        console.error('Erro durante execução dos demos:', error);
    }
}

// =====================================
// TESTES UNITÁRIOS
// =====================================

console.log('\n=== TESTES UNITÁRIOS ===\n');

async function runConcurrentTests() {
    console.log('Executando testes Concurrent Structures...\n');

    // Teste 1: Atomic Integer
    const atomic = new AtomicInteger(5);
    const incremented = atomic.incrementAndGet();
    console.log('✓ Teste 1 - Atomic increment:', incremented === 6);

    // Teste 2: CAS operation
    const casSuccess = atomic.compareAndSwap(6, 10);
    console.log('✓ Teste 2 - CAS success:', casSuccess && atomic.get() === 10);

    // Teste 3: Lock-Free Stack
    const stack = new LockFreeStack();
    stack.push('test');
    const popped = stack.pop();
    console.log('✓ Teste 3 - Lock-free stack:', popped === 'test');

    // Teste 4: Lock-Free Queue
    const queue = new LockFreeQueue();
    queue.enqueue('item');
    const dequeued = queue.dequeue();
    console.log('✓ Teste 4 - Lock-free queue:', dequeued === 'item');

    // Teste 5: Concurrent HashMap
    const map = new ConcurrentHashMap();
    await map.put('key', 'value');
    const retrieved = await map.get('key');
    console.log('✓ Teste 5 - Concurrent HashMap:', retrieved === 'value');

    // Teste 6: Bounded Buffer
    const buffer = new BoundedBuffer(2);
    await buffer.put('item1');
    await buffer.put('item2');
    const taken = await buffer.take();
    console.log('✓ Teste 6 - Bounded Buffer:', taken === 'item1');

    console.log('\nTodos os testes Concurrent Structures concluídos!');
}

// Executa testes
runConcurrentTests().then(() => {
    // Executa demos
    runAllDemos();
});

// Export para uso em outros módulos
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        AtomicInteger,
        LockFreeStack,
        LockFreeQueue,
        ConcurrentHashMap,
        BoundedBuffer,
        ThreadSafeCache,
        ConcurrentTaskScheduler
    };
}
