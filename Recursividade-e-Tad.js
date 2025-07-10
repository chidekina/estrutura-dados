// Função Recursiva
// Uma função recursiva é uma função que, durante sua execução, faz uma chamada a si mesma, ou seja, ela se auto-invoca. Esse tipo de função é usado para resolver problemas dividindo-os em subproblemas menores do mesmo tipo, aplicando o conceito de divisão e conquista

// Uma função recursiva simples, como o cálculo do fatorial, tem complexidade O(n), pois faz uma chamada recursiva para cada valor de n até 1

const fatorial = (n) => {
    if (n === 0 || n === 1) return 1; // caso base
    else return n * fatorial(n - 1); // caso recursivo
};

const fibronacci = (n) => {
    if (n === 0) return 0;
    else if (n === 1) return 1;
    else return fibronacci(n - 1) + fibronacci(n - 2);
};

// Tipo Abstrato de Dados (TAD)
// O TAD não define como os dados são implementados internamente, mas sim o que pode ser feito com eles. Isso promove o encapsulamento e a separação entre a interface (o que o usuário pode fazer) e a implementação (como é feito por baixo dos panos)

// TAD Pilha (Stack)
function Stack() {
    let items = []; // encapsulamento dos dados

    this.push = function (element) {
        items.push(element);
    };

    this.pop = function () {
        if (this.isEmpty()) return undefined;
        return items.pop();
    };

    this.top = function () {
        if (this.isEmpty()) return undefined;
        return items[items.length - 1];
    };

    this.isEmpty = function () {
        return items.length === 0;
    };

    this.size = function () {
        return items.length;
    };

    this.clear = function () {
        items = [];
    };
}

// Uso do TAD Pilha
const stack = new Stack();
stack.push(10);
stack.push(20);
console.log(stack.top()); // 20
stack.pop();
console.log(stack.top()); // 10

const categorias = [
    {
        id: 1,
        name: "Eletronicos",
        children: [
            { id: 2, name: "Celulares", children: [] },
            {
                id: 3, name: "Computadores", children: [
                    { id: 4, name: "Tablets", children: [] }
                ]
            }
        ]
    },
    {
        id: 5,
        name: "Pratos",
        children: []
    }
]

// Resultado esperado:
// Eletronicos
//     Celulares
//     Computadores
//         Tablets
// Pratos

// Versão simples (atual)
const printCategories = (array, level = 0) => {
    for (let item of array) {
        console.log("  ".repeat(level) + item.name);

        if (item.children.length > 0) {
            printCategories(item.children, level + 1);
        }
    }
};

// Versão com cores e símbolos mais bonita
const printCategoriesStyled = (array, level = 0) => {
    const colors = {
        reset: '\x1b[0m',
        blue: '\x1b[34m',
        green: '\x1b[32m',
        yellow: '\x1b[33m',
        magenta: '\x1b[35m'
    };

    const levelColors = [colors.blue, colors.green, colors.yellow, colors.magenta];

    for (let item of array) {
        const color = levelColors[level] || colors.reset;
        const indent = "  ".repeat(level);
        const prefix = level > 0 ? "├─ " : "📁 ";

        console.log(color + indent + prefix + item.name + colors.reset);

        if (item.children.length > 0) {
            printCategoriesStyled(item.children, level + 1);
        }
    }
};

// Teste das duas versões
console.log("=== Versão Simples ===");
printCategories(categorias);

console.log("\n=== Versão Estilizada ===");
printCategoriesStyled(categorias);