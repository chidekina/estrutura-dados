/**
 * 🔍 VERIFICADOR DE PADRONIZAÇÃO DIDÁTICA
 * =======================================
 * 
 * Script para validar a qualidade didática e padronização de todos
 * os arquivos do projeto Estruturas de Dados.
 * 
 * Funciona como um sistema de tutoria automatizada, garantindo
 * que todos os arquivos sigam o padrão educacional definido.
 * 
 * Projeto: Estruturas de Dados - Tutor Digital
 * Desenvolvido com assistência de IA
 * Data: Julho 2025
 */

const fs = require('fs');
const path = require('path');

console.log('🔍 VERIFICADOR DE PADRONIZAÇÃO DIDÁTICA');
console.log('═'.repeat(70));

// =====================================================
// 📋 CONFIGURAÇÃO DA VALIDAÇÃO
// =====================================================

const CONFIG_VALIDACAO = {
    modulos: ['Fundamentals', 'Beginners', 'Intermediate', 'Advanced', 'Expert'],
    arquivos_especiais: ['README.md', 'PADRAO-DIDATICO.js', 'INDICE-COMPLETO.js'],
    extensoes_validas: ['.js', '.md'],
    min_linhas_codigo: 100,
    min_exemplos: 3,
    min_comentarios: 10
};

// =====================================================
// 🔧 FUNÇÕES DE VALIDAÇÃO
// =====================================================

class ValidadorProjeto {

    constructor() {
        this.resultados = {
            total_arquivos: 0,
            arquivos_validados: 0,
            pontuacao_media: 0,
            problemas_encontrados: [],
            sugestoes_melhoria: []
        };
    }

    async validarProjeto() {
        console.log('\n🚀 Iniciando validação completa do projeto...\n');

        // Validar estrutura de pastas
        await this.validarEstruturaPastas();

        // Validar módulos individualmente
        for (const modulo of CONFIG_VALIDACAO.modulos) {
            await this.validarModulo(modulo);
        }

        // Validar arquivos especiais
        await this.validarArquivosEspeciais();

        // Gerar relatório final
        this.gerarRelatorioFinal();
    }

    async validarEstruturaPastas() {
        console.log('📁 VALIDAÇÃO DA ESTRUTURA DE PASTAS');
        console.log('─'.repeat(50));

        const estruturaEsperada = {
            'Fundamentals': true,
            'Beginners': true,
            'Intermediate': true,
            'Advanced': true,
            'Expert': true
        };

        for (const pasta of Object.keys(estruturaEsperada)) {
            const caminho = path.join(process.cwd(), pasta);
            if (fs.existsSync(caminho)) {
                console.log(`✅ ${pasta}/ encontrada`);
                estruturaEsperada[pasta] = true;
            } else {
                console.log(`❌ ${pasta}/ NÃO encontrada`);
                estruturaEsperada[pasta] = false;
                this.resultados.problemas_encontrados.push(`Pasta ${pasta} ausente`);
            }
        }

        const todasEncontradas = Object.values(estruturaEsperada).every(Boolean);
        console.log(`\n📊 Estrutura de pastas: ${todasEncontradas ? 'COMPLETA' : 'INCOMPLETA'}`);
    }

    async validarModulo(nomeModulo) {
        console.log(`\n${this.getEmojiModulo(nomeModulo)} VALIDAÇÃO DO MÓDULO: ${nomeModulo.toUpperCase()}`);
        console.log('─'.repeat(50));

        const caminhoModulo = path.join(process.cwd(), nomeModulo);

        if (!fs.existsSync(caminhoModulo)) {
            console.log(`❌ Módulo ${nomeModulo} não encontrado`);
            return;
        }

        const arquivos = this.listarArquivosJS(caminhoModulo);
        console.log(`📄 Arquivos encontrados: ${arquivos.length}`);

        let pontuacaoModulo = 0;
        let totalArquivos = 0;

        for (const arquivo of arquivos) {
            const resultado = await this.validarArquivo(arquivo, nomeModulo);
            pontuacaoModulo += resultado.percentual;
            totalArquivos++;
        }

        const mediaModulo = totalArquivos > 0 ? Math.round(pontuacaoModulo / totalArquivos) : 0;
        console.log(`\n📊 Qualidade média do módulo: ${mediaModulo}%`);

        this.classificarQualidade(mediaModulo, nomeModulo);
    }

    async validarArquivo(caminhoArquivo, modulo) {
        const nomeArquivo = path.basename(caminhoArquivo);
        const conteudo = fs.readFileSync(caminhoArquivo, 'utf8');

        console.log(`\n  📄 Validando: ${nomeArquivo}`);

        const resultado = {
            arquivo: nomeArquivo,
            modulo: modulo,
            linhas: conteudo.split('\n').length,
            percentual: 0,
            detalhes: {}
        };

        // Validações específicas
        resultado.detalhes.cabecalho = this.validarCabecalho(conteudo);
        resultado.detalhes.teoria = this.validarTeoria(conteudo);
        resultado.detalhes.implementacao = this.validarImplementacao(conteudo);
        resultado.detalhes.exemplos = this.validarExemplos(conteudo);
        resultado.detalhes.documentacao = this.validarDocumentacao(conteudo);

        // Calcular pontuação
        const pontos = Object.values(resultado.detalhes).reduce((sum, item) => sum + item.pontos, 0);
        const total = Object.values(resultado.detalhes).reduce((sum, item) => sum + item.total, 0);
        resultado.percentual = total > 0 ? Math.round((pontos / total) * 100) : 0;

        // Mostrar resultado
        const emoji = resultado.percentual >= 80 ? '✅' : resultado.percentual >= 60 ? '⚠️' : '❌';
        console.log(`    ${emoji} Qualidade: ${resultado.percentual}% (${pontos}/${total} pontos)`);

        // Adicionar detalhes se baixa qualidade
        if (resultado.percentual < 70) {
            this.adicionarSugestoes(nomeArquivo, resultado.detalhes);
        }

        this.resultados.total_arquivos++;
        this.resultados.arquivos_validados++;

        return resultado;
    }

    validarCabecalho(conteudo) {
        const validacoes = {
            comentario_abertura: conteudo.includes('/**'),
            titulo_estrutura: /\* [A-Z].*-.*MODULE|\* [A-Z].*ESTRUTURA/.test(conteudo),
            separador: conteudo.includes('='.repeat(30)),
            descricao: conteudo.includes('Descrição') || conteudo.includes('descrição'),
            metadata: conteudo.includes('Projeto:') || conteudo.includes('Autor:')
        };

        const pontos = Object.values(validacoes).filter(Boolean).length;
        return { pontos, total: 5, validacoes };
    }

    validarTeoria(conteudo) {
        const validacoes = {
            explicacao_conceitual: conteudo.toLowerCase().includes('conceito') ||
                conteudo.toLowerCase().includes('teoria'),
            caracteristicas: conteudo.toLowerCase().includes('características') ||
                conteudo.toLowerCase().includes('propriedades'),
            complexidade: conteudo.includes('O(') || conteudo.toLowerCase().includes('complexidade'),
            casos_uso: conteudo.toLowerCase().includes('uso') ||
                conteudo.toLowerCase().includes('aplicação'),
            vantagens: conteudo.toLowerCase().includes('vantagem') ||
                conteudo.toLowerCase().includes('benefício')
        };

        const pontos = Object.values(validacoes).filter(Boolean).length;
        return { pontos, total: 5, validacoes };
    }

    validarImplementacao(conteudo) {
        const validacoes = {
            classe_principal: conteudo.includes('class '),
            constructor: conteudo.includes('constructor'),
            metodos_principais: (conteudo.match(/\w+\(/g) || []).length >= 5,
            comentarios_inline: (conteudo.match(/\/\//g) || []).length >= 10,
            tratamento_erros: conteudo.includes('throw') || conteudo.includes('Error')
        };

        const pontos = Object.values(validacoes).filter(Boolean).length;
        return { pontos, total: 5, validacoes };
    }

    validarExemplos(conteudo) {
        const validacoes = {
            secao_exemplos: conteudo.toLowerCase().includes('exemplo') ||
                conteudo.toLowerCase().includes('demonstração'),
            console_logs: (conteudo.match(/console\.log/g) || []).length >= 5,
            casos_teste: conteudo.toLowerCase().includes('teste') ||
                conteudo.toLowerCase().includes('test'),
            progressao: conteudo.toLowerCase().includes('básico') ||
                conteudo.toLowerCase().includes('avançado'),
            aplicacao_pratica: conteudo.toLowerCase().includes('prática') ||
                conteudo.toLowerCase().includes('real')
        };

        const pontos = Object.values(validacoes).filter(Boolean).length;
        return { pontos, total: 5, validacoes };
    }

    validarDocumentacao(conteudo) {
        const validacoes = {
            comentarios_detalhados: (conteudo.match(/\/\*[\s\S]*?\*\//g) || []).length >= 3,
            explicacoes_metodos: conteudo.includes('/**') && conteudo.includes('*/'),
            secoes_organizadas: (conteudo.match(/\/\/ ={5,}/g) || []).length >= 3,
            recursos_extras: conteudo.toLowerCase().includes('referência') ||
                conteudo.toLowerCase().includes('recurso'),
            export_module: conteudo.includes('module.exports') ||
                conteudo.includes('export')
        };

        const pontos = Object.values(validacoes).filter(Boolean).length;
        return { pontos, total: 5, validacoes };
    }

    async validarArquivosEspeciais() {
        console.log('\n📋 VALIDAÇÃO DE ARQUIVOS ESPECIAIS');
        console.log('─'.repeat(50));

        // Validar README.md
        await this.validarREADME();

        // Validar arquivos de índice
        await this.validarIndices();
    }

    async validarREADME() {
        const caminhoREADME = path.join(process.cwd(), 'README.md');

        if (!fs.existsSync(caminhoREADME)) {
            console.log('❌ README.md não encontrado');
            this.resultados.problemas_encontrados.push('README.md ausente');
            return;
        }

        const conteudo = fs.readFileSync(caminhoREADME, 'utf8');

        const validacoes = {
            titulo_principal: conteudo.includes('# '),
            badges: conteudo.includes('[!['),
            estrutura_projeto: conteudo.includes('Estrutura'),
            navegacao: conteudo.includes('navegação') || conteudo.includes('Navegação'),
            instalacao: conteudo.includes('install') || conteudo.includes('Como usar'),
            contribuicao: conteudo.includes('Contribu') || conteudo.includes('contribu'),
            licenca: conteudo.includes('Licença') || conteudo.includes('License'),
            ia_disclosure: conteudo.includes('IA') || conteudo.includes('AI')
        };

        const pontos = Object.values(validacoes).filter(Boolean).length;
        const percentual = Math.round((pontos / 8) * 100);

        const emoji = percentual >= 80 ? '✅' : '⚠️';
        console.log(`${emoji} README.md: ${percentual}% (${pontos}/8 elementos)`);
    }

    async validarIndices() {
        const arquivosIndice = [
            'INDICE-COMPLETO.js',
            'TESTE-FINAL.js',
            'PADRAO-DIDATICO.js'
        ];

        for (const arquivo of arquivosIndice) {
            const caminho = path.join(process.cwd(), arquivo);
            if (fs.existsSync(caminho)) {
                console.log(`✅ ${arquivo} encontrado`);
            } else {
                console.log(`⚠️ ${arquivo} não encontrado`);
                this.resultados.sugestoes_melhoria.push(`Criar ${arquivo}`);
            }
        }
    }

    listarArquivosJS(diretorio) {
        const arquivos = [];

        function lerDiretorio(dir) {
            const items = fs.readdirSync(dir);

            for (const item of items) {
                const caminhoCompleto = path.join(dir, item);
                const stat = fs.statSync(caminhoCompleto);

                if (stat.isDirectory()) {
                    lerDiretorio(caminhoCompleto);
                } else if (item.endsWith('.js')) {
                    arquivos.push(caminhoCompleto);
                }
            }
        }

        lerDiretorio(diretorio);
        return arquivos;
    }

    getEmojiModulo(modulo) {
        const emojis = {
            'Fundamentals': '🌱',
            'Beginners': '🌿',
            'Intermediate': '🌳',
            'Advanced': '🏔️',
            'Expert': '🚀'
        };
        return emojis[modulo] || '📁';
    }

    classificarQualidade(percentual, modulo) {
        if (percentual >= 90) {
            console.log(`🏆 ${modulo}: EXCELENTE qualidade didática`);
        } else if (percentual >= 80) {
            console.log(`✅ ${modulo}: BOA qualidade didática`);
        } else if (percentual >= 70) {
            console.log(`⚠️ ${modulo}: Qualidade ACEITÁVEL - melhorias recomendadas`);
        } else {
            console.log(`❌ ${modulo}: Qualidade BAIXA - correções necessárias`);
            this.resultados.problemas_encontrados.push(`${modulo}: baixa qualidade didática`);
        }
    }

    adicionarSugestoes(arquivo, detalhes) {
        const sugestoes = [];

        if (detalhes.cabecalho?.pontos < 3) {
            sugestoes.push('Melhorar cabeçalho com mais metadados');
        }
        if (detalhes.teoria?.pontos < 3) {
            sugestoes.push('Adicionar mais explicação teórica');
        }
        if (detalhes.exemplos?.pontos < 3) {
            sugestoes.push('Incluir mais exemplos práticos');
        }
        if (detalhes.documentacao?.pontos < 3) {
            sugestoes.push('Melhorar documentação e comentários');
        }

        if (sugestoes.length > 0) {
            this.resultados.sugestoes_melhoria.push({
                arquivo,
                sugestoes
            });
        }
    }

    gerarRelatorioFinal() {
        console.log('\n' + '═'.repeat(70));
        console.log('📊 RELATÓRIO FINAL DE PADRONIZAÇÃO DIDÁTICA');
        console.log('═'.repeat(70));

        console.log(`\n📈 ESTATÍSTICAS GERAIS:`);
        console.log(`  📄 Total de arquivos analisados: ${this.resultados.total_arquivos}`);
        console.log(`  ✅ Arquivos validados: ${this.resultados.arquivos_validados}`);
        console.log(`  ⚠️ Problemas encontrados: ${this.resultados.problemas_encontrados.length}`);
        console.log(`  💡 Sugestões de melhoria: ${this.resultados.sugestoes_melhoria.length}`);

        if (this.resultados.problemas_encontrados.length > 0) {
            console.log(`\n❌ PROBLEMAS ENCONTRADOS:`);
            this.resultados.problemas_encontrados.forEach((problema, i) => {
                console.log(`  ${i + 1}. ${problema}`);
            });
        }

        if (this.resultados.sugestoes_melhoria.length > 0) {
            console.log(`\n💡 SUGESTÕES DE MELHORIA:`);
            this.resultados.sugestoes_melhoria.forEach((item, i) => {
                if (typeof item === 'string') {
                    console.log(`  ${i + 1}. ${item}`);
                } else {
                    console.log(`  📄 ${item.arquivo}:`);
                    item.sugestoes.forEach(sugestao => {
                        console.log(`    • ${sugestao}`);
                    });
                }
            });
        }

        console.log(`\n🎯 PRÓXIMAS AÇÕES RECOMENDADAS:`);
        console.log(`  1. Corrigir problemas identificados`);
        console.log(`  2. Implementar sugestões de melhoria`);
        console.log(`  3. Padronizar cabeçalhos de arquivos`);
        console.log(`  4. Adicionar mais exemplos práticos`);
        console.log(`  5. Melhorar documentação inline`);

        console.log(`\n✨ PROJETO ${this.resultados.problemas_encontrados.length === 0 ? 'APROVADO' : 'PRECISA DE MELHORIAS'}!`);
    }
}

// =====================================================
// 🚀 EXECUÇÃO DA VALIDAÇÃO
// =====================================================

async function executarValidacao() {
    const validador = new ValidadorProjeto();
    await validador.validarProjeto();
}

// Executar se chamado diretamente
if (require.main === module) {
    executarValidacao().catch(console.error);
}

module.exports = { ValidadorProjeto, CONFIG_VALIDACAO };
