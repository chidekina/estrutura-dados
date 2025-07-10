// MEMOIZATION PASSO A PASSO - FIBONACCI

// Versão do memoize com logs detalhados
function memoizeDetailed(fn) {
    console.log("🏗️  Criando função memoizada...");
    const cache = new Map();
    console.log("📦 Cache criado (vazio):", cache);

    return function (...args) {
        console.log(`\n🔍 === CHAMADA DA FUNÇÃO MEMOIZADA ===`);
        console.log(`📥 Argumentos recebidos:`, args);

        const key = JSON.stringify(args);
        console.log(`🔑 Chave gerada: "${key}"`);

        console.log(`🗂️  Verificando se "${key}" existe no cache...`);
        console.log(`📋 Cache atual:`, Object.fromEntries(cache));

        if (cache.has(key)) {
            console.log(`✅ CACHE HIT! Encontrou "${key}" no cache`);
            const cachedResult = cache.get(key);
            console.log(`💾 Retornando valor do cache: ${cachedResult}`);
            console.log(`⚡ === FIM DA CHAMADA (CACHE) ===\n`);
            return cachedResult;
        }

        console.log(`❌ CACHE MISS! "${key}" não está no cache`);
        console.log(`🔄 Executando função original...`);

        const result = fn.apply(this, args);

        console.log(`🎯 Função retornou: ${result}`);
        console.log(`💾 Salvando no cache: "${key}" → ${result}`);
        cache.set(key, result);
        console.log(`📋 Cache atualizado:`, Object.fromEntries(cache));
        console.log(`🏁 === FIM DA CHAMADA (CALCULADO) ===\n`);

        return result;
    }
}

// Fibonacci original (para referência)
function fibOriginal(n) {
    console.log(`  📱 fibOriginal(${n}) chamado`);
    if (n <= 1) {
        console.log(`    ✅ Caso base: fib(${n}) = ${n}`);
        return n;
    }
    console.log(`    🔄 Calculando fib(${n - 1}) + fib(${n - 2})`);
    const result = fibOriginal(n - 1) + fibOriginal(n - 2);
    console.log(`    🎯 fib(${n}) = ${result}`);
    return result;
}

// Fibonacci memoizado
const fibMemoized = memoizeDetailed(function (n) {
    console.log(`  📱 fibMemoized(${n}) executando...`);
    if (n <= 1) {
        console.log(`    ✅ Caso base: fib(${n}) = ${n}`);
        return n;
    }
    console.log(`    🔄 Precisa calcular fib(${n - 1}) + fib(${n - 2})`);

    console.log(`    📞 Chamando fibMemoized(${n - 1})...`);
    const result1 = fibMemoized(n - 1);
    console.log(`    📞 Chamando fibMemoized(${n - 2})...`);
    const result2 = fibMemoized(n - 2);

    const result = result1 + result2;
    console.log(`    🎯 fib(${n}) = ${result1} + ${result2} = ${result}`);
    return result;
});

console.log("=".repeat(60));
console.log("🧪 DEMONSTRAÇÃO: MEMOIZATION NO FIBONACCI");
console.log("=".repeat(60));

console.log("\n🎬 Vamos calcular fibMemoized(3) passo a passo:");
console.log("📝 Isso vai chamar: fib(3) → fib(2) + fib(1) → (fib(1) + fib(0)) + fib(1)");

console.log("\n" + "🚀".repeat(20) + " INÍCIO " + "🚀".repeat(20));
const resultado = fibMemoized(3);
console.log("🎉".repeat(20) + " FIM " + "🎉".repeat(20));

console.log(`\n🏆 RESULTADO FINAL: fibMemoized(3) = ${resultado}`);

console.log("\n" + "=".repeat(60));
console.log("🔄 SEGUNDA CHAMADA - TUDO DEVE VIR DO CACHE:");
console.log("=".repeat(60));
const resultado2 = fibMemoized(3);
console.log(`🏆 RESULTADO FINAL: fibMemoized(3) = ${resultado2}`);

console.log("\n" + "=".repeat(60));
console.log("📊 COMPARAÇÃO DE EFICIÊNCIA:");
console.log("=".repeat(60));

console.log("\n🐌 SEM MEMOIZATION - fib(3):");
fibOriginal(3);

console.log("\n⚡ COM MEMOIZATION - fib(3) (já calculado):");
fibMemoized(3);
