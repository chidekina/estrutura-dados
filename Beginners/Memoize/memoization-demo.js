// Demonstração de Memoization

// Função memoize da imagem
function memoize(fn) {
    const cache = new Map();

    return function (...args) {
        const key = JSON.stringify(args);

        if (cache.has(key)) {
            console.log(`💾 Cache HIT para ${key}`);
            return cache.get(key);
        }

        console.log(`🔄 Calculando ${key}...`);
        const result = fn.apply(this, args);
        cache.set(key, result);
        return result;
    }
}

// Fibonacci SEM memoization (lenta)
function fibonacciSlow(n) {
    if (n <= 1) return n;
    return fibonacciSlow(n - 1) + fibonacciSlow(n - 2);
}

// Fibonacci COM memoization (rápida)
const fibonacciFast = memoize(function (n) {
    if (n <= 1) return n;
    return fibonacciFast(n - 1) + fibonacciFast(n - 2);
});

// Teste de performance
console.log("=== SEM MEMOIZATION ===");
console.time("Fibonacci(35) sem cache");
console.log("Resultado:", fibonacciSlow(35));
console.timeEnd("Fibonacci(35) sem cache");

console.log("\n=== COM MEMOIZATION ===");
console.time("Fibonacci(35) com cache");
console.log("Resultado:", fibonacciFast(35));
console.timeEnd("Fibonacci(35) com cache");

console.log("\n=== SEGUNDA CHAMADA (já no cache) ===");
console.time("Fibonacci(35) segunda vez");
console.log("Resultado:", fibonacciFast(35));
console.timeEnd("Fibonacci(35) segunda vez");

// Exemplo com diferentes argumentos
console.log("\n=== TESTANDO CACHE ===");
fibonacciFast(10);
fibonacciFast(15);
fibonacciFast(10); // Deve vir do cache
fibonacciFast(20);
fibonacciFast(15); // Deve vir do cache

// Versão detalhada para mostrar como funciona
function fibonacciDetailed(n, indent = "") {
    console.log(indent + `📱 Chamando fib(${n})`);

    if (n <= 1) {
        console.log(indent + `✅ Caso base: fib(${n}) = ${n}`);
        return n;
    }

    const result1 = fibonacciDetailed(n - 1, indent + "  ");
    const result2 = fibonacciDetailed(n - 2, indent + "  ");
    const total = result1 + result2;

    console.log(indent + `🔢 fib(${n}) = ${result1} + ${result2} = ${total}`);
    return total;
}

// Versão com cache visual
const fibonacciMemoizedDetailed = memoize(function (n, indent = "") {
    console.log(indent + `📱 Chamando fib(${n})`);

    if (n <= 1) {
        console.log(indent + `✅ Caso base: fib(${n}) = ${n}`);
        return n;
    }

    const result1 = fibonacciMemoizedDetailed(n - 1, indent + "  ");
    const result2 = fibonacciMemoizedDetailed(n - 2, indent + "  ");
    const total = result1 + result2;

    console.log(indent + `🔢 fib(${n}) = ${result1} + ${result2} = ${total}`);
    return total;
});

console.log("\n" + "=".repeat(50));
console.log("🐌 FIBONACCI SEM CACHE - fib(5)");
console.log("=".repeat(50));
fibonacciDetailed(5);

console.log("\n" + "=".repeat(50));
console.log("⚡ FIBONACCI COM CACHE - fib(5)");
console.log("=".repeat(50));
fibonacciMemoizedDetailed(5);
