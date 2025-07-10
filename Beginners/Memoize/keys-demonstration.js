// DEMONSTRAÇÃO: COMO AS KEYS SÃO CRIADAS

function demonstrarKeys() {
    console.log("🔑 DEMONSTRAÇÃO: CRIAÇÃO DE KEYS\n");

    // Simulando diferentes chamadas de função
    const exemplosChamadas = [
        [3],
        [2],
        [1],
        [0],
        [5, 10],
        ["hello", "world"],
        [true, false],
        [],
        [1, 2, 3]
    ];

    console.log("📝 Vamos ver como cada chamada gera sua key:\n");

    exemplosChamadas.forEach((args, index) => {
        console.log(`${index + 1}. Chamada: function(${args.join(', ')})`);
        console.log(`   args = [${args.join(', ')}]`);

        const key = JSON.stringify(args);
        console.log(`   key = JSON.stringify(args) = "${key}"`);
        console.log(`   🗂️  Esta key seria usada no cache.set("${key}", resultado)\n`);
    });
}

// Memoize com rastreamento de keys
function memoizeComKeys(fn) {
    const cache = new Map();
    let chamadaNumero = 0;

    return function (...args) {
        chamadaNumero++;
        console.log(`\n📞 === CHAMADA #${chamadaNumero} ===`);
        console.log(`📥 Argumentos: [${args.join(', ')}]`);

        // AQUI É ONDE A KEY É CRIADA!
        const key = JSON.stringify(args);
        console.log(`🔧 JSON.stringify([${args.join(', ')}]) = "${key}"`);
        console.log(`🔑 Key que será usada: "${key}"`);

        console.log(`🔍 Verificando se key "${key}" existe no cache...`);
        console.log(`📋 Keys no cache atual: [${Array.from(cache.keys()).join(', ')}]`);

        if (cache.has(key)) {
            console.log(`✅ ENCONTROU! Key "${key}" está no cache`);
            const valor = cache.get(key);
            console.log(`💾 Retornando valor salvo: ${valor}`);
            return valor;
        }

        console.log(`❌ NÃO ENCONTROU! Key "${key}" não está no cache`);
        console.log(`🔄 Executando função e salvando resultado...`);

        const result = fn.apply(this, args);

        console.log(`💾 Salvando: cache.set("${key}", ${result})`);
        cache.set(key, result);
        console.log(`📋 Cache agora tem keys: [${Array.from(cache.keys()).join(', ')}]`);

        return result;
    };
}

// Função simples para testar
const somaComCache = memoizeComKeys(function (a, b = 0) {
    console.log(`    🧮 Calculando ${a} + ${b} = ${a + b}`);
    return a + b;
});

console.log("=".repeat(60));
demonstrarKeys();

console.log("=".repeat(60));
console.log("🧪 TESTE PRÁTICO - VENDO AS KEYS EM AÇÃO");
console.log("=".repeat(60));

// Vamos fazer algumas chamadas para ver as keys sendo criadas
somaComCache(5);        // Key será "[5]"
somaComCache(3, 7);     // Key será "[3,7]"
somaComCache(5);        // Key será "[5]" - CACHE HIT!
somaComCache(3, 7);     // Key será "[3,7]" - CACHE HIT!
somaComCache(2, 2);     // Key será "[2,2]" - nova key

console.log("\n🎯 RESUMO: As keys são criadas convertendo os argumentos em string JSON!");
console.log("   function(5) → args=[5] → key='[5]'");
console.log("   function(3,7) → args=[3,7] → key='[3,7]'");
console.log("   function() → args=[] → key='[]'");
