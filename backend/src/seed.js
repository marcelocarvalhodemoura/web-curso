import { get, run, transaction, exec } from './db/database.js';

const phasesData = [
  {
    number: 1,
    title: 'Alfabetização Digital e Lógica',
    slug: 'alfabetizacao-digital-e-logica',
    objective: 'Entender como a tecnologia funciona e desenvolver raciocínio lógico.',
    duration_weeks: 4,
    expected_result: 'O participante consegue criar algoritmos simples.',
    project: null,
    lessons: [
      {
        title: 'O que é hardware e software',
        slug: 'hardware-e-software',
        type: 'content',
        content: `# Hardware e Software

## Hardware
Hardware é a parte **física** do computador — tudo que você pode tocar:
- **Processador (CPU):** o "cérebro" que executa instruções
- **Memória RAM:** armazena dados temporariamente enquanto o computador está ligado
- **Disco (SSD/HDD):** armazena arquivos permanentemente
- **Placa-mãe:** conecta todos os componentes
- **Periféricos:** teclado, mouse, monitor, impressora

## Software
Software é a parte **lógica** — programas e instruções que dizem ao hardware o que fazer:
- **Sistema operacional:** Windows, macOS, Linux
- **Aplicativos:** navegadores, editores de texto, jogos
- **Drivers:** fazem o SO se comunicar com o hardware

## A relação entre eles
O hardware sem software é apenas metal e plástico. O software sem hardware não tem onde rodar. Juntos, formam um sistema completo capaz de resolver problemas.`,
      },
      {
        title: 'Como funciona a internet',
        slug: 'como-funciona-a-internet',
        type: 'content',
        content: `# Como funciona a Internet

A internet é uma rede global de computadores conectados que trocam informações.

## Conceitos fundamentais
- **Protocolo:** regras de comunicação (ex: HTTP, TCP/IP)
- **IP:** endereço único de cada dispositivo na rede
- **DNS:** traduz nomes (google.com) em endereços IP
- **Roteadores:** direcionam dados entre redes
- **Servidores:** computadores que armazenam e entregam conteúdo

## Fluxo de uma requisição web
1. Você digita um endereço no navegador
2. O DNS resolve o nome para um IP
3. Seu computador envia uma requisição HTTP ao servidor
4. O servidor processa e retorna uma resposta (HTML, JSON, etc.)
5. O navegador renderiza o conteúdo na tela`,
      },
      {
        title: 'Navegador, servidor e sistema operacional',
        slug: 'navegador-servidor-so',
        type: 'content',
        content: `# Navegador, Servidor e Sistema Operacional

## Navegador (Browser)
Programa que interpreta páginas web. Exemplos: Chrome, Firefox, Safari, Edge.
- Renderiza HTML, CSS e JavaScript
- Armazena cookies e cache
- Gerencia abas e histórico

## Servidor
Computador (ou serviço na nuvem) que **fornece** recursos para outros:
- Servidor web: entrega páginas e APIs
- Servidor de banco de dados: armazena informações
- Servidor de email: envia e recebe mensagens

## Sistema Operacional (SO)
Software base que gerencia hardware e permite rodar outros programas:
- **Windows:** amplamente usado em desktops
- **macOS:** usado em computadores Apple
- **Linux:** muito usado em servidores e desenvolvimento

## Aplicativo
Programa criado para uma tarefa específica: WhatsApp, VS Code, Spotify. Pode ser web, mobile ou desktop.`,
      },
      {
        title: 'Lógica de Programação — Variáveis e Operadores',
        slug: 'logica-variaveis-operadores',
        type: 'content',
        content: `# Variáveis e Operadores

## Variáveis
Espaços na memória para armazenar valores que podem mudar:
\`\`\`
nome = "Maria"
idade = 25
altura = 1.68
\`\`\`

## Operadores Aritméticos
- \`+\` soma | \`-\` subtração | \`*\` multiplicação | \`/\` divisão | \`%\` resto

## Operadores de Comparação
- \`==\` igual | \`!=\` diferente | \`>\` maior | \`<\` menor | \`>=\` maior ou igual | \`<=\` menor ou igual

## Operadores Lógicos
- \`E (AND)\`: ambas condições verdadeiras
- \`OU (OR)\`: pelo menos uma verdadeira
- \`NÃO (NOT)\`: inverte o valor`,
      },
      {
        title: 'Lógica de Programação — Condições e Repetições',
        slug: 'logica-condicoes-repeticoes',
        type: 'content',
        content: `# Condições e Repetições

## Estruturas de Decisão (SE)
\`\`\`
SE idade >= 18 ENTÃO
  exibir "Maior de idade"
SENÃO
  exibir "Menor de idade"
FIM SE
\`\`\`

## Estruturas de Repetição
**ENQUANTO** — repete enquanto a condição for verdadeira:
\`\`\`
contador = 1
ENQUANTO contador <= 5 FAÇA
  exibir contador
  contador = contador + 1
FIM ENQUANTO
\`\`\`

**PARA** — repete um número definido de vezes:
\`\`\`
PARA i DE 1 ATÉ 10 FAÇA
  exibir i
FIM PARA
\`\`\``,
      },
      {
        title: 'Fluxogramas e Algoritmos',
        slug: 'fluxogramas-algoritmos',
        type: 'content',
        content: `# Fluxogramas e Algoritmos

## Algoritmo
Sequência finita de passos para resolver um problema.

**Exemplo — Média de notas:**
1. Receber 3 notas
2. Somar as notas
3. Dividir a soma por 3
4. Exibir o resultado

## Fluxograma
Representação visual de um algoritmo usando símbolos:
- **Oval:** início/fim
- **Retângulo:** processo (ação)
- **Losango:** decisão (condição)
- **Paralelogramo:** entrada/saída de dados
- **Setas:** fluxo de execução

## Ferramentas recomendadas
- **Portugol Studio:** pseudocódigo em português
- **Visualg:** fluxogramas e algoritmos visuais

Pratique criando algoritmos para problemas do dia a dia antes de partir para uma linguagem real.`,
      },
    ],
    exercises: [
      { title: 'Instalar programas', description: 'Instale o VS Code, um navegador moderno e o Git no seu computador.' },
      { title: 'Organizar arquivos e pastas', description: 'Crie uma estrutura de pastas para seus estudos: /cursos, /projetos, /exercicios.' },
      { title: 'Utilizar serviços em nuvem', description: 'Crie uma conta no Google Drive ou Dropbox e faça upload de um arquivo.' },
      { title: 'Criar contas em plataformas', description: 'Crie sua conta no GitHub e explore a interface.' },
      { title: 'Algoritmo da média', description: 'Escreva um algoritmo em Portugol que calcula a média de 4 notas e informa se o aluno foi aprovado (média >= 7).' },
    ],
    tools: [
      { name: 'Portugol Studio', url: 'https://github.com/UNIVALI-LITE/Portugol-Studio' },
      { name: 'Visualg', url: 'http://visualg3.com.br/' },
    ],
  },
  {
    number: 2,
    title: 'Introdução à Programação',
    slug: 'introducao-programacao',
    objective: 'Aprender os fundamentos da programação.',
    duration_weeks: 6,
    expected_result: 'Consegue criar programas simples sozinho.',
    project: null,
    lessons: [
      {
        title: 'O que é uma linguagem de programação',
        slug: 'linguagem-programacao',
        type: 'content',
        content: `# Linguagem de Programação

Uma linguagem de programação é um conjunto de regras e instruções que permite comunicar com o computador.

## Tipos de linguagens
- **Compiladas** (C, Go): código é traduzido inteiro antes de executar
- **Interpretadas** (JavaScript, Python): código é executado linha a linha
- **Híbridas** (Java): compila para bytecode, interpretado pela JVM

## Por que JavaScript?
- Roda no navegador e no servidor (Node.js)
- Sintaxe acessível para iniciantes
- Ecossistema enorme
- Base para desenvolvimento web moderno`,
      },
      {
        title: 'Tipos de dados e funções',
        slug: 'tipos-dados-funcoes',
        type: 'content',
        content: `# Tipos de Dados e Funções

## Tipos primitivos em JavaScript
\`\`\`javascript
let nome = "Ana";        // string
let idade = 30;          // number
let ativo = true;        // boolean
let valor;               // undefined
let vazio = null;        // null
\`\`\`

## Funções
Blocos reutilizáveis de código:
\`\`\`javascript
function saudacao(nome) {
  return "Olá, " + nome + "!";
}

const soma = (a, b) => a + b;

console.log(saudacao("João")); // Olá, João!
console.log(soma(3, 5));         // 8
\`\`\``,
      },
      {
        title: 'Estruturas de decisão e repetição',
        slug: 'estruturas-decisao-repeticao',
        type: 'content',
        content: `# Estruturas de Decisão e Repetição

## Decisão
\`\`\`javascript
const nota = 8.5;

if (nota >= 7) {
  console.log("Aprovado");
} else if (nota >= 5) {
  console.log("Recuperação");
} else {
  console.log("Reprovado");
}
\`\`\`

## Repetição
\`\`\`javascript
// for
for (let i = 0; i < 5; i++) {
  console.log(i);
}

// while
let contador = 0;
while (contador < 5) {
  console.log(contador);
  contador++;
}

// for...of (arrays)
const frutas = ["maçã", "banana", "uva"];
for (const fruta of frutas) {
  console.log(fruta);
}
\`\`\``,
      },
      {
        title: 'Vetores e listas (Arrays)',
        slug: 'vetores-listas',
        type: 'content',
        content: `# Vetores e Listas (Arrays)

Arrays armazenam múltiplos valores em uma única variável:

\`\`\`javascript
const numeros = [10, 20, 30, 40, 50];
const nomes = ["Ana", "Bruno", "Carla"];

// Acessar elementos (índice começa em 0)
console.log(numeros[0]); // 10

// Métodos úteis
numeros.push(60);           // adiciona ao final
numeros.pop();              // remove do final
const dobrados = numeros.map(n => n * 2);
const pares = numeros.filter(n => n % 2 === 0);
const soma = numeros.reduce((acc, n) => acc + n, 0);

console.log(numeros.length); // tamanho do array
\`\`\``,
      },
    ],
    exercises: [
      { title: 'Calculadora', description: 'Crie um programa que recebe dois números e uma operação (+, -, *, /) e exibe o resultado.' },
      { title: 'Conversor de moedas', description: 'Converta valores de Real para Dólar e Euro usando taxas fixas.' },
      { title: 'Sistema de notas escolares', description: 'Receba notas de 5 alunos, calcule médias e classifique cada um.' },
      { title: 'Jogo de adivinhação', description: 'O computador sorteia um número de 1 a 100. O jogador tenta adivinhar com dicas "maior" ou "menor".' },
    ],
    tools: [
      { name: 'Node.js', url: 'https://nodejs.org' },
      { name: 'MDN JavaScript', url: 'https://developer.mozilla.org/pt-BR/docs/Web/JavaScript' },
    ],
  },
  {
    number: 3,
    title: 'Ferramentas do Desenvolvedor',
    slug: 'ferramentas-desenvolvedor',
    objective: 'Aprender o ambiente de trabalho de um programador.',
    duration_weeks: 2,
    expected_result: 'Consegue versionar código sem ajuda.',
    project: null,
    lessons: [
      {
        title: 'VS Code — Editor de código',
        slug: 'vscode',
        type: 'content',
        content: `# Visual Studio Code

O VS Code é o editor mais popular entre desenvolvedores.

## Configuração essencial
- Instale extensões: ESLint, Prettier, GitLens, Live Server
- Configure o terminal integrado
- Aprenda atalhos: \`Ctrl+P\` (abrir arquivo), \`Ctrl+Shift+P\` (paleta de comandos)

## Recursos importantes
- **IntelliSense:** autocompletar código
- **Debugger:** depurar com breakpoints
- **Terminal integrado:** rodar comandos sem sair do editor
- **Multi-cursor:** editar várias linhas simultaneamente`,
      },
      {
        title: 'Terminal e linha de comando',
        slug: 'terminal',
        type: 'content',
        content: `# Terminal

O terminal permite interagir com o sistema operacional via texto.

## Comandos essenciais
\`\`\`bash
pwd          # diretório atual
ls           # listar arquivos
cd pasta     # entrar em pasta
cd ..        # voltar
mkdir nome   # criar pasta
touch arquivo.txt  # criar arquivo
rm arquivo   # remover arquivo
cp origem destino  # copiar
mv origem destino  # mover/renomear
\`\`\`

## No desenvolvimento
\`\`\`bash
npm init -y       # iniciar projeto Node
npm install pkg   # instalar dependência
node arquivo.js   # executar script
\`\`\``,
      },
      {
        title: 'Git — Controle de versão',
        slug: 'git',
        type: 'content',
        content: `# Git

Git rastreia mudanças no código ao longo do tempo.

## Comandos fundamentais
\`\`\`bash
git init                    # iniciar repositório
git status                  # ver estado dos arquivos
git add .                   # adicionar ao staging
git commit -m "mensagem"    # salvar snapshot
git log                     # histórico de commits
git branch feature-x        # criar branch
git checkout feature-x      # trocar de branch
git merge feature-x         # mesclar branch
\`\`\`

## Boas práticas
- Commits pequenos e frequentes
- Mensagens descritivas no imperativo ("adiciona login", não "adicionado login")
- Uma funcionalidade por branch`,
      },
      {
        title: 'GitHub — Hospedagem de código',
        slug: 'github',
        type: 'content',
        content: `# GitHub

Plataforma para hospedar repositórios Git e colaborar em projetos.

## Fluxo básico
\`\`\`bash
git remote add origin https://github.com/user/repo.git
git push -u origin main
git pull origin main
\`\`\`

## Conceitos
- **Repository (repo):** projeto versionado
- **Fork:** cópia de um repo de outra pessoa
- **Pull Request (PR):** solicitação para mesclar mudanças
- **Issues:** rastreamento de bugs e tarefas
- **Actions:** automação de CI/CD`,
      },
    ],
    exercises: [
      { title: 'Criar repositório', description: 'Crie um repositório no GitHub e faça o push de um projeto local.' },
      { title: 'Fazer commits', description: 'Pratique fazendo pelo menos 5 commits com mensagens descritivas.' },
      { title: 'Criar branches', description: 'Crie uma branch feature, faça alterações e mescle na main.' },
      { title: 'Resolver conflitos', description: 'Simule um conflito de merge entre duas branches e resolva manualmente.' },
    ],
    tools: [
      { name: 'VS Code', url: 'https://code.visualstudio.com' },
      { name: 'Git', url: 'https://git-scm.com' },
      { name: 'GitHub', url: 'https://github.com' },
    ],
  },
  {
    number: 4,
    title: 'Desenvolvimento Web Básico',
    slug: 'desenvolvimento-web-basico',
    objective: 'Entender como uma página web funciona.',
    duration_weeks: 8,
    expected_result: 'Consegue desenvolver páginas interativas.',
    project: 'Criar um site pessoal.',
    lessons: [
      {
        title: 'HTML — Estrutura da página',
        slug: 'html-estrutura',
        type: 'content',
        content: `# HTML — Estrutura da Página

HTML (HyperText Markup Language) define a estrutura do conteúdo.

\`\`\`html
<!DOCTYPE html>
<html lang="pt-BR">
<head>
  <meta charset="UTF-8">
  <title>Meu Site</title>
</head>
<body>
  <header><h1>Título Principal</h1></header>
  <nav><a href="#sobre">Sobre</a></nav>
  <main>
    <section id="sobre"><p>Conteúdo...</p></section>
  </main>
  <footer><p>&copy; 2025</p></footer>
</body>
</html>
\`\`\`

## Tags semânticas
\`header\`, \`nav\`, \`main\`, \`section\`, \`article\`, \`aside\`, \`footer\` — melhoram acessibilidade e SEO.`,
      },
      {
        title: 'HTML — Formulários e tabelas',
        slug: 'html-formularios-tabelas',
        type: 'content',
        content: `# Formulários e Tabelas

## Formulários
\`\`\`html
<form action="/enviar" method="POST">
  <label for="nome">Nome:</label>
  <input type="text" id="nome" name="nome" required>
  
  <label for="email">Email:</label>
  <input type="email" id="email" name="email">
  
  <button type="submit">Enviar</button>
</form>
\`\`\`

## Tabelas
\`\`\`html
<table>
  <thead>
    <tr><th>Nome</th><th>Idade</th></tr>
  </thead>
  <tbody>
    <tr><td>Ana</td><td>25</td></tr>
    <tr><td>Bruno</td><td>30</td></tr>
  </tbody>
</table>
\`\`\``,
      },
      {
        title: 'CSS — Seletores e layout',
        slug: 'css-seletores-layout',
        type: 'content',
        content: `# CSS — Seletores e Layout

CSS (Cascading Style Sheets) estiliza o HTML.

\`\`\`css
/* Seletores */
h1 { color: navy; }           /* elemento */
.classe { font-size: 18px; } /* classe */
#id { margin: 10px; }          /* id */

/* Box Model */
.caixa {
  margin: 20px;
  padding: 15px;
  border: 1px solid #ccc;
  width: 300px;
}
\`\`\`

## Unidades
- \`px\` — pixels fixos
- \`%\` — relativo ao pai
- \`rem\` / \`em\` — relativo à fonte
- \`vw\` / \`vh\` — relativo à viewport`,
      },
      {
        title: 'CSS — Flexbox e Grid',
        slug: 'css-flexbox-grid',
        type: 'content',
        content: `# Flexbox e Grid

## Flexbox — layout 1D
\`\`\`css
.container {
  display: flex;
  justify-content: center;  /* horizontal */
  align-items: center;      /* vertical */
  gap: 16px;
}
\`\`\`

## Grid — layout 2D
\`\`\`css
.grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 20px;
}
\`\`\`

## Responsividade
\`\`\`css
@media (max-width: 768px) {
  .grid { grid-template-columns: 1fr; }
}
\`\`\``,
      },
      {
        title: 'JavaScript — DOM e Eventos',
        slug: 'js-dom-eventos',
        type: 'content',
        content: `# Manipulação do DOM e Eventos

## DOM (Document Object Model)
\`\`\`javascript
const titulo = document.querySelector('h1');
titulo.textContent = 'Novo título';
titulo.style.color = 'blue';

const lista = document.createElement('li');
lista.textContent = 'Novo item';
document.querySelector('ul').appendChild(lista);
\`\`\`

## Eventos
\`\`\`javascript
const botao = document.querySelector('#meuBotao');

botao.addEventListener('click', () => {
  alert('Clicou!');
});

document.addEventListener('DOMContentLoaded', () => {
  console.log('Página carregada');
});
\`\`\``,
      },
      {
        title: 'JavaScript — Consumo de APIs',
        slug: 'js-consumo-apis',
        type: 'content',
        content: `# Consumo de APIs

\`\`\`javascript
// Fetch API
async function buscarUsuarios() {
  try {
    const response = await fetch('https://api.exemplo.com/users');
    const dados = await response.json();
    console.log(dados);
  } catch (erro) {
    console.error('Erro:', erro);
  }
}

// Exibir dados na página
async function carregarPosts() {
  const res = await fetch('https://jsonplaceholder.typicode.com/posts');
  const posts = await res.json();
  
  const container = document.querySelector('#posts');
  posts.slice(0, 5).forEach(post => {
    container.innerHTML += \`<article><h3>\${post.title}</h3><p>\${post.body}</p></article>\`;
  });
}
\`\`\``,
      },
    ],
    exercises: [
      { title: 'Página de perfil', description: 'Crie uma página HTML com suas informações pessoais usando tags semânticas.' },
      { title: 'Formulário de contato', description: 'Construa um formulário estilizado com validação básica em JavaScript.' },
      { title: 'Layout responsivo', description: 'Monte um layout com Flexbox/Grid que funcione em mobile e desktop.' },
      { title: 'Site pessoal', description: 'Projeto final: crie um site pessoal completo com HTML, CSS e JS consumindo uma API pública.' },
    ],
    tools: [
      { name: 'MDN Web Docs', url: 'https://developer.mozilla.org/pt-BR/' },
      { name: 'Can I Use', url: 'https://caniuse.com' },
    ],
  },
  {
    number: 5,
    title: 'Banco de Dados',
    slug: 'banco-de-dados',
    objective: 'Entender armazenamento de informações.',
    duration_weeks: 4,
    expected_result: 'Consegue modelar e consultar dados.',
    project: 'Sistema de cadastro de clientes.',
    lessons: [
      {
        title: 'O que é banco de dados',
        slug: 'o-que-e-banco-dados',
        type: 'content',
        content: `# Banco de Dados

Um banco de dados é um sistema organizado para armazenar, gerenciar e recuperar informações de forma persistente.

## Tipos
- **Relacional (SQL):** PostgreSQL, MySQL — dados em tabelas com relações
- **Não-relacional (NoSQL):** MongoDB, Redis — documentos, chave-valor

## Conceitos fundamentais
- **Tabela:** coleção de registros com mesma estrutura
- **Registro (row):** uma entrada na tabela
- **Campo (column):** um atributo do registro
- **Schema:** estrutura/definição das tabelas`,
      },
      {
        title: 'Tabelas e relacionamentos',
        slug: 'tabelas-relacionamentos',
        type: 'content',
        content: `# Tabelas e Relacionamentos

## Chave Primária (PK)
Identificador único de cada registro. Ex: \`id\` auto-incrementado.

## Chave Estrangeira (FK)
Referencia a PK de outra tabela, criando relacionamentos.

## Tipos de relacionamento
- **1:1** — um usuário tem um perfil
- **1:N** — um cliente tem vários pedidos
- **N:N** — alunos e disciplinas (tabela intermediária)

\`\`\`sql
CREATE TABLE clientes (
  id SERIAL PRIMARY KEY,
  nome VARCHAR(100) NOT NULL,
  email VARCHAR(100) UNIQUE
);

CREATE TABLE pedidos (
  id SERIAL PRIMARY KEY,
  cliente_id INTEGER REFERENCES clientes(id),
  valor DECIMAL(10,2),
  data_pedido TIMESTAMP DEFAULT NOW()
);
\`\`\``,
      },
      {
        title: 'SQL — SELECT, INSERT, UPDATE, DELETE',
        slug: 'sql-crud',
        type: 'content',
        content: `# SQL — Operações CRUD

## SELECT (Consultar)
\`\`\`sql
SELECT nome, email FROM clientes WHERE ativo = true;
SELECT * FROM pedidos ORDER BY data_pedido DESC LIMIT 10;
SELECT c.nome, COUNT(p.id) as total_pedidos
FROM clientes c LEFT JOIN pedidos p ON c.id = p.cliente_id
GROUP BY c.id;
\`\`\`

## INSERT (Inserir)
\`\`\`sql
INSERT INTO clientes (nome, email) VALUES ('Maria', 'maria@email.com');
\`\`\`

## UPDATE (Atualizar)
\`\`\`sql
UPDATE clientes SET email = 'novo@email.com' WHERE id = 1;
\`\`\`

## DELETE (Remover)
\`\`\`sql
DELETE FROM clientes WHERE id = 5;
\`\`\``,
      },
      {
        title: 'PostgreSQL na prática',
        slug: 'postgresql-pratica',
        type: 'content',
        content: `# PostgreSQL na Prática

PostgreSQL é um banco relacional robusto e open-source, ideal para aplicações reais.

## Instalação e acesso
\`\`\`bash
# Via Docker
docker run --name pg -e POSTGRES_PASSWORD=senha -p 5432:5432 -d postgres

# Conectar
psql -h localhost -U postgres
\`\`\`

## Boas práticas
- Use migrations para versionar o schema
- Indexe colunas frequentemente consultadas
- Nunca concatene strings em queries (use prepared statements)
- Faça backups regulares`,
      },
    ],
    exercises: [
      { title: 'Modelar tabelas', description: 'Desenhe o modelo ER de um sistema de biblioteca (livros, autores, empréstimos).' },
      { title: 'Queries básicas', description: 'Escreva queries SELECT com WHERE, ORDER BY e JOIN.' },
      { title: 'CRUD completo', description: 'Implemente INSERT, UPDATE e DELETE para a tabela de clientes.' },
      { title: 'Sistema de cadastro', description: 'Projeto: crie um sistema de cadastro de clientes com PostgreSQL.' },
    ],
    tools: [
      { name: 'PostgreSQL', url: 'https://www.postgresql.org' },
      { name: 'DBeaver', url: 'https://dbeaver.io' },
    ],
  },
  {
    number: 6,
    title: 'Backend',
    slug: 'backend',
    objective: 'Construir APIs.',
    duration_weeks: 8,
    expected_result: 'Consegue criar APIs completas.',
    project: 'Sistema de gestão de tarefas.',
    lessons: [
      {
        title: 'APIs REST e JSON',
        slug: 'apis-rest-json',
        type: 'content',
        content: `# APIs REST e JSON

## REST (Representational State Transfer)
Arquitetura para APIs web usando HTTP:

| Método   | Ação     | Exemplo              |
|----------|----------|----------------------|
| GET      | Listar   | GET /tarefas         |
| GET      | Buscar   | GET /tarefas/1       |
| POST     | Criar    | POST /tarefas        |
| PUT      | Atualizar| PUT /tarefas/1       |
| DELETE   | Remover  | DELETE /tarefas/1    |

## JSON
Formato padrão de troca de dados:
\`\`\`json
{
  "id": 1,
  "titulo": "Estudar Node.js",
  "concluida": false
}
\`\`\``,
      },
      {
        title: 'Node.js e Express',
        slug: 'nodejs-express',
        type: 'content',
        content: `# Node.js e Express

\`\`\`javascript
import express from 'express';

const app = express();
app.use(express.json());

const tarefas = [];

app.get('/api/tarefas', (req, res) => {
  res.json(tarefas);
});

app.post('/api/tarefas', (req, res) => {
  const tarefa = { id: Date.now(), ...req.body };
  tarefas.push(tarefa);
  res.status(201).json(tarefa);
});

app.listen(3000, () => console.log('API rodando na porta 3000'));
\`\`\``,
      },
      {
        title: 'Middleware',
        slug: 'middleware',
        type: 'content',
        content: `# Middleware

Funções que executam entre a requisição e a resposta:

\`\`\`javascript
// Logger
app.use((req, res, next) => {
  console.log(\`\${req.method} \${req.url}\`);
  next();
});

// Validação
function validarTarefa(req, res, next) {
  if (!req.body.titulo) {
    return res.status(400).json({ error: 'Título obrigatório' });
  }
  next();
}

app.post('/api/tarefas', validarTarefa, (req, res) => {
  // ...
});
\`\`\``,
      },
      {
        title: 'Autenticação',
        slug: 'autenticacao',
        type: 'content',
        content: `# Autenticação

## JWT (JSON Web Token)
\`\`\`javascript
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';

// Registro
const hash = await bcrypt.hash(senha, 10);

// Login
const token = jwt.sign({ userId: user.id }, SECRET, { expiresIn: '7d' });

// Middleware de proteção
function auth(req, res, next) {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) return res.status(401).json({ error: 'Não autorizado' });
  req.user = jwt.verify(token, SECRET);
  next();
}
\`\`\`

Proteja rotas sensíveis com middleware de autenticação.`,
      },
      {
        title: 'CRUD completo com banco de dados',
        slug: 'crud-completo',
        type: 'content',
        content: `# CRUD com Banco de Dados

\`\`\`javascript
import pg from 'pg';
const pool = new pg.Pool({ connectionString: process.env.DATABASE_URL });

app.get('/api/tarefas', async (req, res) => {
  const { rows } = await pool.query('SELECT * FROM tarefas ORDER BY id');
  res.json(rows);
});

app.post('/api/tarefas', auth, async (req, res) => {
  const { titulo, descricao } = req.body;
  const { rows } = await pool.query(
    'INSERT INTO tarefas (titulo, descricao, user_id) VALUES ($1, $2, $3) RETURNING *',
    [titulo, descricao, req.user.id]
  );
  res.status(201).json(rows[0]);
});
\`\`\`

Organize em camadas: routes → controllers → services → database.`,
      },
    ],
    exercises: [
      { title: 'API Hello World', description: 'Crie uma API Express com rota GET / que retorna JSON.' },
      { title: 'CRUD em memória', description: 'Implemente CRUD de tarefas usando array em memória.' },
      { title: 'Autenticação JWT', description: 'Adicione registro, login e proteção de rotas com JWT.' },
      { title: 'Gestão de tarefas', description: 'Projeto: API completa de gestão de tarefas com PostgreSQL.' },
    ],
    tools: [
      { name: 'Node.js', url: 'https://nodejs.org' },
      { name: 'Express', url: 'https://expressjs.com' },
      { name: 'Postman', url: 'https://www.postman.com' },
    ],
  },
  {
    number: 7,
    title: 'Frontend Moderno',
    slug: 'frontend-moderno',
    objective: 'Construir aplicações modernas.',
    duration_weeks: 8,
    expected_result: 'Consegue desenvolver aplicações SPA.',
    project: 'Frontend do sistema de tarefas.',
    lessons: [
      {
        title: 'React — Componentes e Props',
        slug: 'react-componentes-props',
        type: 'content',
        content: `# React — Componentes e Props

React é uma biblioteca para construir interfaces com componentes reutilizáveis.

\`\`\`jsx
function Saudacao({ nome, idade }) {
  return <h1>Olá, {nome}! Você tem {idade} anos.</h1>;
}

function App() {
  return (
    <div>
      <Saudacao nome="Maria" idade={25} />
      <Saudacao nome="João" idade={30} />
    </div>
  );
}
\`\`\`

Componentes são funções que retornam JSX — uma sintaxe que parece HTML mas é JavaScript.`,
      },
      {
        title: 'React — Estado (useState)',
        slug: 'react-estado',
        type: 'content',
        content: `# Estado com useState

\`\`\`jsx
import { useState } from 'react';

function Contador() {
  const [count, setCount] = useState(0);

  return (
    <div>
      <p>Contagem: {count}</p>
      <button onClick={() => setCount(count + 1)}>+1</button>
      <button onClick={() => setCount(count - 1)}>-1</button>
    </div>
  );
}
\`\`\`

O estado permite que componentes reajam a interações e dados dinâmicos.`,
      },
      {
        title: 'React — Hooks essenciais',
        slug: 'react-hooks',
        type: 'content',
        content: `# Hooks Essenciais

## useEffect — efeitos colaterais
\`\`\`jsx
useEffect(() => {
  document.title = \`Contagem: \${count}\`;
}, [count]); // re-executa quando count muda
\`\`\`

## useRef — referência ao DOM
\`\`\`jsx
const inputRef = useRef(null);
inputRef.current.focus();
\`\`\`

## Custom Hooks
\`\`\`jsx
function useFetch(url) {
  const [data, setData] = useState(null);
  useEffect(() => {
    fetch(url).then(r => r.json()).then(setData);
  }, [url]);
  return data;
}
\`\`\``,
      },
      {
        title: 'React — Consumo de APIs',
        slug: 'react-apis',
        type: 'content',
        content: `# Consumo de APIs no React

\`\`\`jsx
function ListaTarefas() {
  const [tarefas, setTarefas] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/tarefas', {
      headers: { Authorization: \`Bearer \${token}\` }
    })
      .then(res => res.json())
      .then(data => { setTarefas(data); setLoading(false); });
  }, []);

  if (loading) return <p>Carregando...</p>;

  return (
    <ul>
      {tarefas.map(t => (
        <li key={t.id}>{t.titulo}</li>
      ))}
    </ul>
  );
}
\`\`\``,
      },
    ],
    exercises: [
      { title: 'Componente de card', description: 'Crie um componente Card reutilizável com props para título e conteúdo.' },
      { title: 'Lista com estado', description: 'Construa uma lista de tarefas com adicionar e remover itens.' },
      { title: 'Formulário controlado', description: 'Crie um formulário de login com validação em React.' },
      { title: 'Frontend de tarefas', description: 'Projeto: frontend React completo consumindo a API de tarefas.' },
    ],
    tools: [
      { name: 'React', url: 'https://react.dev' },
      { name: 'Vite', url: 'https://vitejs.dev' },
    ],
  },
  {
    number: 8,
    title: 'Qualidade de Software',
    slug: 'qualidade-software',
    objective: 'Aprender boas práticas.',
    duration_weeks: 4,
    expected_result: 'Produz código mais confiável.',
    project: 'Cobertura de testes do sistema criado anteriormente.',
    lessons: [
      {
        title: 'Clean Code',
        slug: 'clean-code',
        type: 'content',
        content: `# Clean Code

Princípios para escrever código legível e manutenível:

- **Nomes significativos:** \`calcularMediaNotas()\` em vez de \`calc()\`
- **Funções pequenas:** uma responsabilidade por função
- **Sem comentários óbvios:** o código deve se explicar
- **DRY (Don't Repeat Yourself):** evite duplicação
- **Tratamento de erros:** falhe de forma clara e previsível

\`\`\`javascript
// Ruim
function p(d) { return d * 0.1; }

// Bom
function calcularDesconto(preco) {
  const TAXA_DESCONTO = 0.1;
  return preco * TAXA_DESCONTO;
}
\`\`\``,
      },
      {
        title: 'SOLID e Refatoração',
        slug: 'solid-refatoracao',
        type: 'content',
        content: `# SOLID

- **S** — Single Responsibility: uma classe, uma responsabilidade
- **O** — Open/Closed: aberto para extensão, fechado para modificação
- **L** — Liskov Substitution: subtipos devem ser substituíveis
- **I** — Interface Segregation: interfaces específicas
- **D** — Dependency Inversion: dependa de abstrações

## Refatoração
Melhorar código sem mudar comportamento:
- Extrair funções
- Renomear variáveis
- Remover código morto
- Simplificar condicionais`,
      },
      {
        title: 'Testes Unitários',
        slug: 'testes-unitarios',
        type: 'content',
        content: `# Testes Unitários com Jest/Vitest

\`\`\`javascript
// soma.js
export function soma(a, b) { return a + b; }

// soma.test.js
import { describe, it, expect } from 'vitest';
import { soma } from './soma';

describe('soma', () => {
  it('soma dois números positivos', () => {
    expect(soma(2, 3)).toBe(5);
  });

  it('soma com zero', () => {
    expect(soma(0, 5)).toBe(5);
  });
});
\`\`\`

Execute com \`npm test\`. Busque cobertura acima de 80% nas funções críticas.`,
      },
      {
        title: 'Testes de Integração',
        slug: 'testes-integracao',
        type: 'content',
        content: `# Testes de Integração

Testam a interação entre componentes/módulos:

\`\`\`javascript
import request from 'supertest';
import app from '../src/app.js';

describe('API Tarefas', () => {
  it('GET /api/tarefas retorna lista', async () => {
    const res = await request(app).get('/api/tarefas');
    expect(res.status).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
  });

  it('POST /api/tarefas cria tarefa', async () => {
    const res = await request(app)
      .post('/api/tarefas')
      .send({ titulo: 'Teste' });
    expect(res.status).toBe(201);
    expect(res.body.titulo).toBe('Teste');
  });
});
\`\`\``,
      },
    ],
    exercises: [
      { title: 'Refatorar função', description: 'Pegue uma função longa e refatore em funções menores com nomes claros.' },
      { title: 'Testes unitários', description: 'Escreva testes para as funções utilitárias do projeto de tarefas.' },
      { title: 'Testes de API', description: 'Crie testes de integração para os endpoints CRUD.' },
      { title: 'Cobertura de testes', description: 'Projeto: atinja pelo menos 70% de cobertura no sistema de tarefas.' },
    ],
    tools: [
      { name: 'Jest', url: 'https://jestjs.io' },
      { name: 'Vitest', url: 'https://vitest.dev' },
    ],
  },
  {
    number: 9,
    title: 'DevOps e Deploy',
    slug: 'devops-deploy',
    objective: 'Publicar aplicações.',
    duration_weeks: 4,
    expected_result: 'Consegue colocar aplicações em produção.',
    project: 'Publicar aplicação em VPS.',
    lessons: [
      {
        title: 'Linux básico para servidores',
        slug: 'linux-basico',
        type: 'content',
        content: `# Linux Básico

Comandos essenciais para administrar servidores:

\`\`\`bash
ssh usuario@servidor       # conectar remotamente
sudo apt update && upgrade  # atualizar pacotes
systemctl status nginx      # status de serviço
journalctl -u app -f        # logs em tempo real
ufw allow 80                # liberar porta no firewall
htop                        # monitorar processos
\`\`\`

Todo desenvolvedor deve se sentir confortável no terminal Linux.`,
      },
      {
        title: 'Docker',
        slug: 'docker',
        type: 'content',
        content: `# Docker

Containerização empacota aplicação + dependências.

\`\`\`dockerfile
# Dockerfile
FROM node:20-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --production
COPY . .
EXPOSE 3000
CMD ["node", "src/index.js"]
\`\`\`

\`\`\`yaml
# docker-compose.yml
services:
  app:
    build: .
    ports: ["3000:3000"]
    environment:
      DATABASE_URL: postgres://user:pass@db:5432/app
  db:
    image: postgres:16
    volumes: ["pgdata:/var/lib/postgresql/data"]
volumes:
  pgdata:
\`\`\``,
      },
      {
        title: 'CI/CD com GitHub Actions',
        slug: 'cicd-github-actions',
        type: 'content',
        content: `# CI/CD com GitHub Actions

\`\`\`yaml
name: CI
on: [push, pull_request]
jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with: { node-version: 20 }
      - run: npm ci
      - run: npm test
      - run: npm run build

  deploy:
    needs: test
    if: github.ref == 'refs/heads/main'
    runs-on: ubuntu-latest
    steps:
      - run: echo "Deploy para produção"
\`\`\`

Automatize testes e deploy a cada push.`,
      },
      {
        title: 'Monitoramento',
        slug: 'monitoramento',
        type: 'content',
        content: `# Monitoramento com Prometheus e Grafana

- **Prometheus:** coleta métricas (CPU, memória, requisições/seg)
- **Grafana:** dashboards visuais das métricas
- **Alertas:** notifica quando algo sai do normal

## Métricas importantes
- Tempo de resposta da API
- Taxa de erros (5xx)
- Uso de CPU e memória
- Conexões ativas no banco

Monitore antes que os usuários reportem problemas.`,
      },
    ],
    exercises: [
      { title: 'Containerizar app', description: 'Crie Dockerfile e docker-compose para o projeto de tarefas.' },
      { title: 'Pipeline CI', description: 'Configure GitHub Actions para rodar testes automaticamente.' },
      { title: 'Deploy em VPS', description: 'Publique a aplicação em um servidor Linux (DigitalOcean, AWS, etc.).' },
      { title: 'Monitoramento básico', description: 'Configure health check e logs estruturados na aplicação.' },
    ],
    tools: [
      { name: 'Docker', url: 'https://www.docker.com' },
      { name: 'GitHub Actions', url: 'https://github.com/features/actions' },
      { name: 'Grafana', url: 'https://grafana.com' },
    ],
  },
  {
    number: 10,
    title: 'Arquitetura e Mercado',
    slug: 'arquitetura-mercado',
    objective: 'Preparar para atuar profissionalmente.',
    duration_weeks: 4,
    expected_result: 'Pronto para atuar como desenvolvedor júnior.',
    project: 'Sistema completo: React + Node.js + PostgreSQL + Docker + CI/CD + Testes.',
    lessons: [
      {
        title: 'Scrum e Kanban',
        slug: 'scrum-kanban',
        type: 'content',
        content: `# Scrum e Kanban

## Scrum
Framework ágil com sprints (1-4 semanas):
- **Product Owner:** define prioridades
- **Scrum Master:** facilita o processo
- **Dev Team:** constrói o produto
- Cerimônias: Planning, Daily, Review, Retrospective

## Kanban
Visualize fluxo de trabalho com colunas:
\`Backlog → Em Progresso → Revisão → Concluído\`

Limite WIP (Work In Progress) para evitar multitarefa excessiva.`,
      },
      {
        title: 'Discovery e desenho de solução',
        slug: 'discovery-solucao',
        type: 'content',
        content: `# Discovery e Desenho de Solução

Antes de codar, entenda o problema:

1. **Entrevistas** com stakeholders
2. **Mapeamento** de jornada do usuário
3. **Prototipação** (Figma, wireframes)
4. **Definição** de requisitos funcionais e não-funcionais
5. **Estimativas** e priorização (MoSCoW, RICE)

Um bom desenvolvedor questiona requisitos antes de implementar.`,
      },
      {
        title: 'Domain Driven Design (DDD)',
        slug: 'ddd',
        type: 'content',
        content: `# Domain Driven Design

Modelagem focada no domínio do negócio:

- **Ubiquitous Language:** mesma linguagem entre devs e negócio
- **Bounded Contexts:** limites claros entre subdomínios
- **Entities:** objetos com identidade (Usuário, Pedido)
- **Value Objects:** objetos sem identidade (Email, Endereço)
- **Aggregates:** grupo de entidades com raiz agregada
- **Repositories:** abstração de persistência

DDD brilha em sistemas complexos de negócio.`,
      },
      {
        title: 'Arquitetura Hexagonal e Microsserviços',
        slug: 'arquitetura-hexagonal-microservicos',
        type: 'content',
        content: `# Arquitetura Hexagonal e Microsserviços

## Hexagonal (Ports & Adapters)
Separa lógica de negócio das infraestruturas:
- **Core:** regras de negócio puras
- **Ports:** interfaces (entrada/saída)
- **Adapters:** implementações (HTTP, DB, fila)

## Microsserviços
Aplicação dividida em serviços independentes:
- Cada serviço tem seu banco
- Comunicação via HTTP ou mensageria
- Deploy independente
- Complexidade operacional maior — use quando necessário`,
      },
      {
        title: 'Projeto Final — Sistema Completo',
        slug: 'projeto-final',
        type: 'project',
        content: `# Projeto Final

Construa um sistema completo integrando tudo que aprendeu:

## Requisitos
- **Frontend:** React com rotas, autenticação e CRUD
- **Backend:** Node.js + Express (ou NestJS) com API REST
- **Banco:** PostgreSQL com migrations
- **Docker:** containerização de todos os serviços
- **CI/CD:** pipeline com testes automatizados
- **Testes:** unitários e de integração

## Entregáveis
1. Repositório no GitHub com README completo
2. Docker Compose funcional (\`docker compose up\`)
3. Pipeline CI passando
4. Deploy acessível via URL

## Critérios de avaliação
- Código limpo e organizado
- Commits semânticos
- Documentação da API
- Cobertura de testes adequada

**Parabéns por chegar até aqui! Você está pronto para sua primeira oportunidade como desenvolvedor júnior.**`,
      },
    ],
    exercises: [
      { title: 'Mapear domínio', description: 'Escolha um problema real e mapeie entidades, value objects e bounded contexts.' },
      { title: 'Diagrama de arquitetura', description: 'Desenhe a arquitetura do projeto final com camadas e integrações.' },
      { title: 'Configurar CI/CD', description: 'Pipeline completo: lint → test → build → deploy.' },
      { title: 'Projeto final', description: 'Entregue o sistema completo com todos os requisitos da fase.' },
    ],
    tools: [
      { name: 'Figma', url: 'https://www.figma.com' },
      { name: 'Draw.io', url: 'https://draw.io' },
    ],
  },
];

export async function seedDatabase() {
  const countRow = await get('SELECT COUNT(*) as count FROM phases');
  if (Number(countRow.count) > 0) return;

  await transaction(async (tx) => {
    for (const phase of phasesData) {
      const result = await tx.run(
        `INSERT INTO phases (number, title, slug, objective, duration_weeks, expected_result, project, sort_order)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          phase.number,
          phase.title,
          phase.slug,
          phase.objective,
          phase.duration_weeks,
          phase.expected_result,
          phase.project,
          phase.number,
        ]
      );

      const phaseId = result.lastInsertRowid;

      for (let i = 0; i < phase.lessons.length; i++) {
        const lesson = phase.lessons[i];
        await tx.run(
          `INSERT INTO lessons (phase_id, title, slug, content, type, sort_order)
           VALUES (?, ?, ?, ?, ?, ?)`,
          [phaseId, lesson.title, lesson.slug, lesson.content, lesson.type, i + 1]
        );
      }

      for (let i = 0; i < phase.exercises.length; i++) {
        const ex = phase.exercises[i];
        await tx.run(
          `INSERT INTO exercises (phase_id, title, description, sort_order)
           VALUES (?, ?, ?, ?)`,
          [phaseId, ex.title, ex.description, i + 1]
        );
      }

      for (let i = 0; i < phase.tools.length; i++) {
        const tool = phase.tools[i];
        await tx.run(
          `INSERT INTO tools (phase_id, name, url, sort_order)
           VALUES (?, ?, ?, ?)`,
          [phaseId, tool.name, tool.url || null, i + 1]
        );
      }
    }
  });

  console.log('✅ Banco de dados populado com 10 fases do curso');
}
