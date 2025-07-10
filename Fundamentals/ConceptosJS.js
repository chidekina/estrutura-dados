/**
 * CONCEITOS FUNDAMENTAIS - JavaScript para Estruturas de Dados
 * ===========================================================
 * 
 * Este módulo cobre conceitos fundamentais de JavaScript que são essenciais
 * para entender e implementar estruturas de dados eficientemente.
 * 
 * Tópicos abordados:
 * - Classes e Objetos
 * - Tipos de dados primitivos e complexos
 * - Arrays e suas operações
 * - Tuplas e estruturas similares
 * - Funções e métodos
 * - Conceitos de referência vs valor
 * - Memory management básico
 * 
 * Autor: Algoritmos e Estruturas de Dados
 * Data: 2024
 */

console.log('='.repeat(80));
console.log('📚 CONCEITOS FUNDAMENTAIS - JavaScript para Estruturas de Dados');
console.log('='.repeat(80));

// =============================================
// 1. TIPOS DE DADOS PRIMITIVOS VS COMPLEXOS
// =============================================

console.log('\n🔢 1. TIPOS DE DADOS EM JAVASCRIPT');
console.log('─'.repeat(50));

// Tipos primitivos (valor)
const primitivos = {
    number: 42,
    string: "texto",
    boolean: true,
    undefined: undefined,
    null: null,
    symbol: Symbol('id'),
    bigint: 9007199254740991n
};

console.log('Tipos primitivos (passados por valor):');
for (const [tipo, valor] of Object.entries(primitivos)) {
    if (tipo === 'symbol') {
        console.log(`  ${tipo}: ${typeof valor} = ${valor.toString()}`);
    } else {
        console.log(`  ${tipo}: ${typeof valor} = ${valor}`);
    }
}

// Tipos complexos (referência)
const complexos = {
    object: { nome: 'João', idade: 25 },
    array: [1, 2, 3, 4, 5],
    function: function () { return 'Hello'; },
    date: new Date(),
    regexp: /[a-z]+/g
};

console.log('\nTipos complexos (passados por referência):');
for (const [tipo, valor] of Object.entries(complexos)) {
    console.log(`  ${tipo}: ${typeof valor} = ${valor}`);
}

// Demonstração de referência vs valor
console.log('\n🔗 Demonstração: Referência vs Valor');

// Primitivos (valor)
let a = 10;
let b = a;
a = 20;
console.log(`Primitivos - a: ${a}, b: ${b}`); // a: 20, b: 10

// Objetos (referência)
let obj1 = { x: 10 };
let obj2 = obj1;
obj1.x = 20;
console.log(`Objetos - obj1.x: ${obj1.x}, obj2.x: ${obj2.x}`); // ambos: 20

// =============================================
// 2. CLASSES E OBJETOS
// =============================================

console.log('\n🏗️ 2. CLASSES E OBJETOS');
console.log('─'.repeat(50));

// Definição de classe básica
class Pessoa {
    // Constructor
    constructor(nome, idade) {
        this.nome = nome;
        this._idade = idade;
        this._id = Math.random().toString(36).substr(2, 9); // Propriedade "privada"
    }

    // Método público
    apresentar() {
        return `Olá, eu sou ${this.nome} e tenho ${this.idade} anos.`;
    }

    // Getter
    get id() {
        return this._id;
    }

    // Setter
    set idade(novaIdade) {
        if (novaIdade >= 0 && novaIdade <= 150) {
            this._idade = novaIdade;
        } else {
            throw new Error('Idade inválida');
        }
    }

    // Getter para idade
    get idade() {
        return this._idade;
    }

    // Método estático
    static compararIdades(pessoa1, pessoa2) {
        return pessoa1.idade - pessoa2.idade;
    }

    // Método privado (convenção com #)
    #calcularAnoNascimento() {
        return new Date().getFullYear() - this.idade;
    }

    getAnoNascimento() {
        return this.#calcularAnoNascimento();
    }
}

// Demonstração de uso
const pessoa1 = new Pessoa('Ana', 28);
const pessoa2 = new Pessoa('Carlos', 35);

console.log('Criação de objetos:');
console.log(`  ${pessoa1.apresentar()}`);
console.log(`  ${pessoa2.apresentar()}`);

console.log('\nGetters e Setters:');
console.log(`  Informações: ${pessoa1.informacoes}`);
pessoa1.novaIdade = 29;
console.log(`  Nova idade: ${pessoa1.idade}`);

console.log('\nMétodos estáticos:');
console.log(`  Diferença de idade: ${Pessoa.compararIdades(pessoa2, pessoa1)} anos`);

// Herança
class Desenvolvedor extends Pessoa {
    constructor(nome, idade, linguagens = []) {
        super(nome, idade);
        this.linguagens = linguagens;
        this.projetos = [];
    }

    programar(linguagem) {
        if (this.linguagens.includes(linguagem)) {
            return `${this.nome} está programando em ${linguagem}`;
        } else {
            return `${this.nome} não conhece ${linguagem}`;
        }
    }

    adicionarProjeto(projeto) {
        this.projetos.push({
            nome: projeto,
            data: new Date(),
            id: this.projetos.length + 1
        });
    }

    // Override do método apresentar
    apresentar() {
        const apresentacaoBase = super.apresentar();
        return `${apresentacaoBase} Sou desenvolvedor e trabalho com: ${this.linguagens.join(', ')}`;
    }
}

const dev = new Desenvolvedor('Maria', 26, ['JavaScript', 'Python', 'Java']);
dev.adicionarProjeto('Sistema de Vendas');
dev.adicionarProjeto('App Mobile');

console.log('\nHerança:');
console.log(`  ${dev.apresentar()}`);
console.log(`  ${dev.programar('JavaScript')}`);
console.log(`  Projetos: ${dev.projetos.length}`);

// =============================================
// 3. OBJETOS AVANÇADOS E DESTRUCTURING
// =============================================

console.log('\n🎨 3. OBJETOS AVANÇADOS E DESTRUCTURING');
console.log('─'.repeat(50));

// Diferentes formas de criar objetos
console.log('Diferentes formas de criar objetos:');

// 1. Object literal
const objetoLiteral = {
    nome: 'João',
    idade: 30,
    cidade: 'São Paulo'
};

// 2. Constructor function
function PessoaConstructor(nome, idade) {
    this.nome = nome;
    this.idade = idade;
}

// 3. Object.create()
const prototypePessoa = {
    falar() {
        return `${this.nome} está falando`;
    }
};
const objetoCreate = Object.create(prototypePessoa);
objetoCreate.nome = 'Maria';

// 4. Class (ES6+)
class PessoaClass {
    constructor(nome, idade) {
        this.nome = nome;
        this.idade = idade;
    }
}

console.log('Object literal:', objetoLiteral);
console.log('Constructor function:', new PessoaConstructor('Pedro', 25));
console.log('Object.create:', objetoCreate);
console.log('ES6 Class:', new PessoaClass('Ana', 28));

// Destructuring de objetos
console.log('\n📦 Destructuring de objetos:');
const pessoa = { nome: 'Lucas', idade: 32, profissao: 'Desenvolvedor' };

// Básico
const { nome, idade } = pessoa;
console.log(`Nome: ${nome}, Idade: ${idade}`);

// Com renomeação
const { nome: nomeCompleto, profissao: trabalho } = pessoa;
console.log(`Nome completo: ${nomeCompleto}, Trabalho: ${trabalho}`);

// Com valores padrão
const { nome: n, salario = 'Não informado' } = pessoa;
console.log(`Nome: ${n}, Salário: ${salario}`);

// Nested destructuring
const usuario = {
    id: 1,
    dados: {
        nome: 'Sofia',
        endereco: {
            rua: 'Rua A',
            numero: 123
        }
    }
};

const { dados: { nome: nomeUsuario, endereco: { rua } } } = usuario;
console.log(`Usuário: ${nomeUsuario}, Rua: ${rua}`);

// =============================================
// 4. TUPLAS E ESTRUTURAS PERSONALIZADAS
// =============================================

console.log('\n🔗 4. TUPLAS E ESTRUTURAS PERSONALIZADAS');
console.log('─'.repeat(50));

// Implementação de Tupla personalizada
class Tupla {
    constructor(...elementos) {
        Object.freeze(elementos);
        this.elementos = elementos;
        this.length = elementos.length;

        // Torna os elementos acessíveis por índice
        elementos.forEach((elemento, index) => {
            this[index] = elemento;
        });

        Object.freeze(this);
    }

    get(index) {
        return this.elementos[index];
    }

    toArray() {
        return [...this.elementos];
    }

    map(fn) {
        return new Tupla(...this.elementos.map(fn));
    }

    filter(fn) {
        return this.elementos.filter(fn);
    }

    toString() {
        return `(${this.elementos.join(', ')})`;
    }

    equals(outraTupla) {
        if (!(outraTupla instanceof Tupla)) return false;
        if (this.length !== outraTupla.length) return false;

        return this.elementos.every((elem, index) =>
            elem === outraTupla.elementos[index]
        );
    }
}

// Par especializado (tupla de 2 elementos)
class Par extends Tupla {
    constructor(primeiro, segundo) {
        super(primeiro, segundo);
    }

    get primeiro() { return this[0]; }
    get segundo() { return this[1]; }
    get key() { return this[0]; }
    get value() { return this[1]; }

    swap() {
        return new Par(this.segundo, this.primeiro);
    }
}

// Tripla especializada (tupla de 3 elementos)
class Tripla extends Tupla {
    constructor(primeiro, segundo, terceiro) {
        super(primeiro, segundo, terceiro);
    }

    get primeiro() { return this[0]; }
    get segundo() { return this[1]; }
    get terceiro() { return this[2]; }
    get x() { return this[0]; }
    get y() { return this[1]; }
    get z() { return this[2]; }
}

// Exemplos de uso
console.log('Exemplos de Tuplas:');

const coordenada2D = new Par(10, 20);
console.log(`Coordenada 2D: ${coordenada2D}`);
console.log(`X: ${coordenada2D.primeiro}, Y: ${coordenada2D.segundo}`);

const coordenada3D = new Tripla(10, 20, 30);
console.log(`Coordenada 3D: ${coordenada3D}`);
console.log(`X: ${coordenada3D.x}, Y: ${coordenada3D.y}, Z: ${coordenada3D.z}`);

const pessoa_idade = new Par('Alice', 25);
console.log(`Pessoa: ${pessoa_idade.key}, Idade: ${pessoa_idade.value}`);

// Tupla com diferentes tipos
const mista = new Tupla('texto', 42, true, new Date());
console.log(`Tupla mista: ${mista}`);

// =============================================
// 5. HERANÇA E POLIMORFISMO
// =============================================

console.log('\n🧬 5. HERANÇA E POLIMORFISMO');
console.log('─'.repeat(50));

// Classe base
class Veiculo {
    constructor(marca, modelo, ano) {
        this.marca = marca;
        this.modelo = modelo;
        this.ano = ano;
        this.ligado = false;
    }

    ligar() {
        this.ligado = true;
        return `${this.marca} ${this.modelo} ligado!`;
    }

    desligar() {
        this.ligado = false;
        return `${this.marca} ${this.modelo} desligado!`;
    }

    acelerar() {
        if (!this.ligado) {
            return 'Precisa ligar o veículo primeiro!';
        }
        return 'Acelerando...';
    }

    // Método abstrato (para ser sobrescrito)
    getTipo() {
        throw new Error('Método getTipo() deve ser implementado');
    }
}

// Herança - Carro
class Carro extends Veiculo {
    constructor(marca, modelo, ano, portas) {
        super(marca, modelo, ano);
        this.portas = portas;
    }

    getTipo() {
        return 'Carro';
    }

    acelerar() {
        if (!this.ligado) {
            return 'Precisa ligar o carro primeiro!';
        }
        return `${this.marca} ${this.modelo} acelerando na estrada!`;
    }

    abrirPorta(numero) {
        if (numero >= 1 && numero <= this.portas) {
            return `Porta ${numero} aberta`;
        }
        return 'Porta inválida';
    }
}

// Herança - Moto
class Moto extends Veiculo {
    constructor(marca, modelo, ano, cilindradas) {
        super(marca, modelo, ano);
        this.cilindradas = cilindradas;
    }

    getTipo() {
        return 'Moto';
    }

    acelerar() {
        if (!this.ligado) {
            return 'Precisa ligar a moto primeiro!';
        }
        return `${this.marca} ${this.modelo} acelerando com ${this.cilindradas}cc!`;
    }

    empinar() {
        if (!this.ligado) {
            return 'Precisa ligar a moto primeiro!';
        }
        return 'Empinando a moto! 🏍️';
    }
}

// Demonstração de polimorfismo
const veiculos = [
    new Carro('Toyota', 'Corolla', 2022, 4),
    new Moto('Honda', 'CB 600F', 2021, 600),
    new Carro('Ford', 'Focus', 2020, 4)
];

console.log('Demonstração de polimorfismo:');
veiculos.forEach(veiculo => {
    veiculo.ligar();
    console.log(`${veiculo.getTipo()}: ${veiculo.acelerar()}`);
});

// =============================================
// 6. SYMBOLS E ITERADORES
// =============================================

console.log('\n🔮 6. SYMBOLS E ITERADORES');
console.log('─'.repeat(50));

// Symbols para propriedades únicas
const SIMBOLO_PRIVADO = Symbol('propriedadePrivada');
const SIMBOLO_ID = Symbol('id');

class MinhaClasse {
    constructor(valor) {
        this.valor = valor;
        this[SIMBOLO_PRIVADO] = 'dados secretos';
        this[SIMBOLO_ID] = Math.random();
    }

    getPrivado() {
        return this[SIMBOLO_PRIVADO];
    }

    getId() {
        return this[SIMBOLO_ID];
    }
}

const obj = new MinhaClasse('público');
console.log('Valor público:', obj.valor);
console.log('Valor privado:', obj.getPrivado());
console.log('ID único:', obj.getId());

// Implementando Iterator personalizado
class MinhaLista {
    constructor() {
        this.items = [];
    }

    add(item) {
        this.items.push(item);
    }

    // Implementa Symbol.iterator
    [Symbol.iterator]() {
        let index = 0;
        const items = this.items;

        return {
            next() {
                if (index < items.length) {
                    return { value: items[index++], done: false };
                } else {
                    return { done: true };
                }
            }
        };
    }

    // Implementa iterador reverso
    *reverse() {
        for (let i = this.items.length - 1; i >= 0; i--) {
            yield this.items[i];
        }
    }
}

const lista = new MinhaLista();
lista.add(1);
lista.add(2);
lista.add(3);

console.log('Iteração normal:');
for (const item of lista) {
    console.log(`  Item: ${item}`);
}

console.log('Iteração reversa:');
for (const item of lista.reverse()) {
    console.log(`  Item reverso: ${item}`);
}

// =============================================
// 7. CLOSURES E FACTORY FUNCTIONS
// =============================================

console.log('\n🏭 7. CLOSURES E FACTORY FUNCTIONS');
console.log('─'.repeat(50));

// Factory function com closure
function criarContador(inicial = 0) {
    let contador = inicial;

    return {
        incrementar() {
            return ++contador;
        },
        decrementar() {
            return --contador;
        },
        valor() {
            return contador;
        },
        reset() {
            contador = inicial;
            return contador;
        }
    };
}

// Factory para criar objetos com comportamento específico
function criarCalculadora() {
    const historico = [];

    return {
        somar(a, b) {
            const resultado = a + b;
            historico.push(`${a} + ${b} = ${resultado}`);
            return resultado;
        },
        subtrair(a, b) {
            const resultado = a - b;
            historico.push(`${a} - ${b} = ${resultado}`);
            return resultado;
        },
        multiplicar(a, b) {
            const resultado = a * b;
            historico.push(`${a} * ${b} = ${resultado}`);
            return resultado;
        },
        dividir(a, b) {
            if (b === 0) throw new Error('Divisão por zero!');
            const resultado = a / b;
            historico.push(`${a} / ${b} = ${resultado}`);
            return resultado;
        },
        getHistorico() {
            return [...historico];
        },
        limparHistorico() {
            historico.length = 0;
        }
    };
}

// Demonstrações
console.log('Contador com closure:');
const contador1 = criarContador(10);
const contador2 = criarContador(0);

console.log('Contador 1:', contador1.incrementar()); // 11
console.log('Contador 1:', contador1.incrementar()); // 12
console.log('Contador 2:', contador2.incrementar()); // 1
console.log('Contador 1 valor:', contador1.valor()); // 12

console.log('\nCalculadora com closure:');
const calc = criarCalculadora();
calc.somar(5, 3);
calc.multiplicar(4, 7);
calc.subtrair(10, 2);
console.log('Histórico:', calc.getHistorico());

// =============================================
// 8. PROXY E METAPROGRAMAÇÃO
// =============================================

console.log('\n🪞 8. PROXY E METAPROGRAMAÇÃO');
console.log('─'.repeat(50));

// Proxy para validação automática
function criarObjetoValidado(validadores) {
    return new Proxy({}, {
        set(target, property, value) {
            const validador = validadores[property];
            if (validador && !validador(value)) {
                throw new Error(`Valor inválido para ${property}: ${value}`);
            }
            target[property] = value;
            return true;
        },
        get(target, property) {
            if (property in target) {
                return target[property];
            } else {
                throw new Error(`Propriedade ${property} não existe`);
            }
        }
    });
}

// Proxy para logging automático
function criarObjetoComLog(obj) {
    return new Proxy(obj, {
        set(target, property, value) {
            console.log(`🔧 Definindo ${property} = ${value}`);
            target[property] = value;
            return true;
        },
        get(target, property) {
            console.log(`🔍 Acessando ${property}`);
            return target[property];
        }
    });
}

// Exemplos
console.log('Objeto com validação:');
const usuarioValidado = criarObjetoValidado({
    idade: value => typeof value === 'number' && value >= 0 && value <= 150,
    email: value => typeof value === 'string' && value.includes('@')
});

try {
    usuarioValidado.idade = 25;
    usuarioValidado.email = 'test@email.com';
    console.log('✅ Validação passou');
} catch (error) {
    console.log('❌ Erro de validação:', error.message);
}

console.log('\nObjeto com logging:');
const objComLog = criarObjetoComLog({ nome: 'João' });
objComLog.nome; // Acesso logado
objComLog.idade = 30; // Modificação logada

// =============================================
// 9. PERFORMANCE E MEMORY MANAGEMENT
// =============================================

console.log('\n⚡ 9. PERFORMANCE E MEMORY MANAGEMENT');
console.log('─'.repeat(50));

// Memoização para cache de resultados
function memoize(fn) {
    const cache = new Map();

    return function (...args) {
        const key = JSON.stringify(args);

        if (cache.has(key)) {
            console.log(`Cache hit para ${key}`);
            return cache.get(key);
        }

        console.log(`Calculando ${key}`);
        const result = fn.apply(this, args);
        cache.set(key, result);
        return result;
    };
}

// Função cara computacionalmente
function fibonacci(n) {
    if (n <= 1) return n;
    return fibonacci(n - 1) + fibonacci(n - 2);
}

const fibonacciMemoized = memoize(fibonacci);

console.log('Fibonacci sem memoização:');
console.time('fibonacci-normal');
fibonacci(30);
console.timeEnd('fibonacci-normal');

console.log('Fibonacci com memoização:');
console.time('fibonacci-memo-1');
fibonacciMemoized(30);
console.timeEnd('fibonacci-memo-1');

console.time('fibonacci-memo-2');
fibonacciMemoized(30); // Deve usar cache
console.timeEnd('fibonacci-memo-2');

// Weak References para evitar memory leaks
class CacheComWeakRef {
    constructor() {
        this.cache = new WeakMap();
    }

    set(obj, value) {
        this.cache.set(obj, value);
    }

    get(obj) {
        return this.cache.get(obj);
    }

    has(obj) {
        return this.cache.has(obj);
    }
}

const cache = new CacheComWeakRef();
let objeto1 = { id: 1 };
let objeto2 = { id: 2 };

cache.set(objeto1, 'dados para objeto1');
cache.set(objeto2, 'dados para objeto2');

console.log('Cache objeto1:', cache.get(objeto1));
console.log('Cache objeto2:', cache.get(objeto2));

// Quando objeto1 sair de escopo, será automaticamente removido do WeakMap
objeto1 = null;

// =============================================
// 10. ESTRUTURAS DE DADOS PERSONALIZADAS
// =============================================

console.log('\n🏗️ 10. ESTRUTURAS DE DADOS PERSONALIZADAS');
console.log('─'.repeat(50));

// Implementação de uma estrutura de dados customizada
class MultiMap {
    constructor() {
        this.map = new Map();
    }

    set(key, value) {
        if (!this.map.has(key)) {
            this.map.set(key, []);
        }
        this.map.get(key).push(value);
    }

    get(key) {
        return this.map.get(key) || [];
    }

    has(key) {
        return this.map.has(key);
    }

    delete(key, value = null) {
        if (!this.map.has(key)) return false;

        if (value === null) {
            return this.map.delete(key);
        } else {
            const values = this.map.get(key);
            const index = values.indexOf(value);
            if (index > -1) {
                values.splice(index, 1);
                if (values.length === 0) {
                    this.map.delete(key);
                }
                return true;
            }
            return false;
        }
    }

    keys() {
        return this.map.keys();
    }

    values() {
        const allValues = [];
        for (const valueArray of this.map.values()) {
            allValues.push(...valueArray);
        }
        return allValues;
    }

    size() {
        return this.map.size;
    }

    totalValues() {
        let total = 0;
        for (const values of this.map.values()) {
            total += values.length;
        }
        return total;
    }
}

// Exemplo de uso do MultiMap
console.log('MultiMap - uma chave, múltiplos valores:');
const multiMap = new MultiMap();

multiMap.set('frutas', 'maçã');
multiMap.set('frutas', 'banana');
multiMap.set('frutas', 'laranja');
multiMap.set('cores', 'azul');
multiMap.set('cores', 'vermelho');

console.log('Frutas:', multiMap.get('frutas'));
console.log('Cores:', multiMap.get('cores'));
console.log('Total de chaves:', multiMap.size());
console.log('Total de valores:', multiMap.totalValues());

// =============================================
// 11. PROGRAMAÇÃO FUNCIONAL EM JAVASCRIPT
// =============================================

console.log('\n🔄 11. PROGRAMAÇÃO FUNCIONAL');
console.log('─'.repeat(50));

// Higher-order functions
const operacoes = {
    somar: (a, b) => a + b,
    multiplicar: (a, b) => a * b,
    elevarAoPoder: (a, b) => Math.pow(a, b)
};

function aplicarOperacao(operacao, a, b) {
    return operacao(a, b);
}

// Currying
function curry(fn) {
    return function curried(...args) {
        if (args.length >= fn.length) {
            return fn.apply(this, args);
        } else {
            return function (...args2) {
                return curried.apply(this, args.concat(args2));
            };
        }
    };
}

const somarCurried = curry((a, b, c) => a + b + c);
const somar5 = somarCurried(5);
const somar5e3 = somar5(3);

console.log('Currying:');
console.log('somar5e3(2):', somar5e3(2)); // 5 + 3 + 2 = 10

// Compose e pipe
const compose = (...fns) => (value) => fns.reduceRight((acc, fn) => fn(acc), value);
const pipe = (...fns) => (value) => fns.reduce((acc, fn) => fn(acc), value);

const dobrar = x => x * 2;
const adicionar3 = x => x + 3;
const elevarAo2 = x => x ** 2;

const operacaoComposta = compose(elevarAo2, adicionar3, dobrar);
const operacaoPipe = pipe(dobrar, adicionar3, elevarAo2);

console.log('Compose vs Pipe:');
console.log('Compose (5):', operacaoComposta(5)); // ((5*2)+3)^2 = 169
console.log('Pipe (5):', operacaoPipe(5)); // ((5*2)+3)^2 = 169

// =============================================
// 12. TESTES E VALIDAÇÕES
// =============================================

console.log('\n🧪 12. SISTEMA DE TESTES SIMPLES');
console.log('─'.repeat(50));

// Sistema de testes simples
class SimpleTester {
    constructor() {
        this.tests = [];
        this.passed = 0;
        this.failed = 0;
    }

    test(description, fn) {
        this.tests.push({ description, fn });
    }

    expect(actual) {
        return {
            toBe: (expected) => {
                if (actual === expected) {
                    return { passed: true };
                } else {
                    return { passed: false, message: `Expected ${expected}, got ${actual}` };
                }
            },
            toEqual: (expected) => {
                if (JSON.stringify(actual) === JSON.stringify(expected)) {
                    return { passed: true };
                } else {
                    return { passed: false, message: `Expected ${JSON.stringify(expected)}, got ${JSON.stringify(actual)}` };
                }
            },
            toThrow: () => {
                try {
                    if (typeof actual === 'function') {
                        actual();
                    }
                    return { passed: false, message: 'Expected function to throw' };
                } catch (error) {
                    return { passed: true };
                }
            }
        };
    }

    run() {
        console.log(`Executando ${this.tests.length} testes...`);

        this.tests.forEach(({ description, fn }) => {
            try {
                const result = fn();
                if (result && result.passed === false) {
                    console.log(`❌ ${description}: ${result.message}`);
                    this.failed++;
                } else {
                    console.log(`✅ ${description}`);
                    this.passed++;
                }
            } catch (error) {
                console.log(`❌ ${description}: ${error.message}`);
                this.failed++;
            }
        });

        console.log(`\nResultados: ${this.passed} ✅ | ${this.failed} ❌`);
    }
}

// Executando testes
const tester = new SimpleTester();

tester.test('Tupla deve ser criada corretamente', () => {
    const tupla = new Tupla(1, 2, 3);
    return tester.expect(tupla.length).toBe(3);
});

tester.test('Par deve ter propriedades primeiro e segundo', () => {
    const par = new Par('a', 'b');
    return tester.expect(par.primeiro).toBe('a');
});

tester.test('MultiMap deve armazenar múltiplos valores', () => {
    const mm = new MultiMap();
    mm.set('test', 1);
    mm.set('test', 2);
    return tester.expect(mm.get('test')).toEqual([1, 2]);
});

tester.test('Memoização deve funcionar', () => {
    let calls = 0;
    const fn = memoize((x) => {
        calls++;
        return x * 2;
    });

    fn(5);
    fn(5);
    return tester.expect(calls).toBe(1);
});

tester.run();

console.log('\n✅ CONCEITOS FUNDAMENTAIS - Demonstração Completa!');
console.log('📊 Resumo:');
console.log('  • Tipos de dados: primitivos vs complexos');
console.log('  • Classes, objetos e herança');
console.log('  • Arrays e métodos funcionais');
console.log('  • Tuplas e estruturas customizadas');
console.log('  • Funções, closures e memoização');
console.log('  • Protótipos e herança prototípica');
console.log('  • Symbols, iterators e generators');
console.log('  • Programação assíncrona');
console.log('  • Performance e memory management');

console.log('\n🎯 Estes conceitos são fundamentais para:');
console.log('  • Implementar estruturas de dados eficientes');
console.log('  • Entender complexidade temporal e espacial');
console.log('  • Criar código limpo e reutilizável');
console.log('  • Otimizar performance de algoritmos');

// Export das principais classes e funções para uso em outros módulos
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        Pessoa,
        Desenvolvedor,
        Tupla,
        Par,
        Tripla,
        Veiculo,
        Carro,
        Moto,
        MultiMap,
        SimpleTester,
        memoize: memoize,
        criarContador,
        criarCalculadora
    };
}
