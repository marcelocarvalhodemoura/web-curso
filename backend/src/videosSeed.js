import { get, run, transaction, exec } from './db/database.js';

/**
 * Vídeos curados em português, alinhados ao tema de cada aula.
 * Fontes principais: Curso em Vídeo (Gustavo Guanabara), Hardware Redes Brasil, LINUXtips, etc.
 */
const videosByLesson = {
  'alfabetizacao-digital-e-logica/hardware-e-software': [
    { youtubeId: 'TGpVY6q0emY', title: 'Conceitos básicos de Informática — Software x Hardware', channel: 'Hardware Redes Brasil' },
    { youtubeId: 'srzcIv7zlps', title: 'Curso de Hardware — Introdução', channel: 'Gabriel Torres' },
  ],
  'alfabetizacao-digital-e-logica/como-funciona-a-internet': [
    { youtubeId: 'l94zFTcfpRQ', title: 'Como surgiu a Internet (ARPANET)', channel: 'Hardware Redes Brasil' },
    { youtubeId: 'QkMbqL8QD9w', title: 'Curso de Redes de Computadores — Aula 00', channel: 'Curso em Vídeo' },
  ],
  'alfabetizacao-digital-e-logica/navegador-servidor-so': [
    { youtubeId: 'JAFhXan_Y9o', title: 'Redes de Computadores — Fundamentos', channel: 'Curso em Vídeo' },
    { youtubeId: '6nN2EglOqCM', title: 'Curso de Linux — Introdução ao Sistema Operacional', channel: 'Curso em Vídeo' },
  ],
  'alfabetizacao-digital-e-logica/logica-variaveis-operadores': [
    { youtubeId: 'TPqLB7mSyvc', title: 'Princípios Básicos do Portugol Studio', channel: 'Boson Treinamentos' },
    { youtubeId: 'epf-WQdVis0', title: 'Curso Lógica de Programação — Variáveis e Operadores', channel: 'Dev em Dobro' },
  ],
  'alfabetizacao-digital-e-logica/logica-condicoes-repeticoes': [
    { youtubeId: 'XzkZO2qjgec', title: 'Lógica de Programação — Condições e Repetições', channel: 'Boson Treinamentos' },
    { youtubeId: 'gMxQ8vxH9Vk', title: 'Lógica de Programação — Por onde começar', channel: 'AttekitaDev' },
  ],
  'alfabetizacao-digital-e-logica/fluxogramas-algoritmos': [
    { youtubeId: '8mei6uVttho', title: 'Curso de Algoritmos — Introdução', channel: 'Curso em Vídeo' },
    { youtubeId: 'M2Af7gkbbro', title: 'Algoritmos — Conceitos e Fluxogramas', channel: 'Curso em Vídeo' },
  ],

  'introducao-programacao/linguagem-programacao': [
    { youtubeId: 'Ptbk2af68e8', title: 'O que o JavaScript é capaz de fazer? — JS #01', channel: 'Curso em Vídeo' },
    { youtubeId: 'rUTKomc2gG8', title: 'JavaScript: como chegamos até aqui? — JS #02', channel: 'Curso em Vídeo' },
  ],
  'introducao-programacao/tipos-dados-funcoes': [
    { youtubeId: 'Vbabsye7mWo', title: 'Variáveis e Tipos Primitivos — JS #05', channel: 'Curso em Vídeo' },
    { youtubeId: 'oMNbc_LFz8w', title: 'Funções em JavaScript — JS #16', channel: 'Curso em Vídeo' },
  ],
  'introducao-programacao/estruturas-decisao-repeticao': [
    { youtubeId: 'cOdG4eACN2A', title: 'Condições (Parte 1) — JS #11', channel: 'Curso em Vídeo' },
    { youtubeId: '5rZqYPKIwkY', title: 'Repetições (Parte 1) — JS #13', channel: 'Curso em Vídeo' },
  ],
  'introducao-programacao/vetores-listas': [
    { youtubeId: '6tyHypeY4-8', title: 'Variáveis Compostas (Arrays) — JS #15', channel: 'Curso em Vídeo' },
    { youtubeId: 'HNf8AhMa4f0', title: 'Arrays (Matrizes) em JavaScript', channel: 'Programação Web' },
  ],

  'ferramentas-desenvolvedor/vscode': [
    { youtubeId: 'jgQjeqGRdgA', title: 'HTML5 e CSS3 — Configurando o ambiente (VS Code)', channel: 'Curso em Vídeo' },
    { youtubeId: 'FdePtO5JSd0', title: 'JavaScript — Primeiros passos no VS Code — JS #03', channel: 'Curso em Vídeo' },
  ],
  'ferramentas-desenvolvedor/terminal': [
    { youtubeId: 'R_8l3xj3QEg', title: 'Linux — Terminal e linha de comando', channel: 'Curso em Vídeo' },
    { youtubeId: 'qs_NZXmVUr0', title: 'Linux — Comandos essenciais', channel: 'Curso em Vídeo' },
  ],
  'ferramentas-desenvolvedor/git': [
    { youtubeId: 'xEKo29OWILE', title: 'O que é Git? O que é versionamento?', channel: 'Curso em Vídeo' },
    { youtubeId: '-l4Aa8wef8s', title: 'Git — Primeiro commit e histórico', channel: 'Curso em Vídeo' },
  ],
  'ferramentas-desenvolvedor/github': [
    { youtubeId: 'GDGMf2bnHlE', title: 'O que é Git e GitHub?', channel: 'Curso em Vídeo' },
    { youtubeId: 'ts-H3W1uLMM', title: 'GitHub — Criando repositório e branches', channel: 'Curso em Vídeo' },
  ],

  'desenvolvimento-web-basico/html-estrutura': [
    { youtubeId: 'f6NTJdtEFOc', title: 'Parágrafos e Quebras — Primeiro HTML', channel: 'Curso em Vídeo' },
    { youtubeId: 'HaSgt1hK2Fs', title: 'Semântica na HTML5 é importante', channel: 'Curso em Vídeo' },
  ],
  'desenvolvimento-web-basico/html-formularios-tabelas': [
    { youtubeId: '8TgKFYkcO5Y', title: 'Formulários em HTML5', channel: 'Curso em Vídeo' },
    { youtubeId: '4ynvsrkamt8', title: 'Tabelas em HTML5', channel: 'Curso em Vídeo' },
  ],
  'desenvolvimento-web-basico/css-seletores-layout': [
    { youtubeId: 'vPNIAJ9B4hg', title: 'CSS — Primeiros passos e seletores', channel: 'Curso em Vídeo' },
    { youtubeId: 'A8UNBs7nxw4', title: 'CSS — Cores, fontes e box model', channel: 'Curso em Vídeo' },
  ],
  'desenvolvimento-web-basico/css-flexbox-grid': [
    { youtubeId: 'h4FpFvHdm-U', title: 'Aprenda Flexbox em 10 Minutos', channel: 'Danki Code' },
    { youtubeId: 'w1J6gY40yMo', title: 'CSS Completo — Flexbox e Grid', channel: 'Programação Web' },
  ],
  'desenvolvimento-web-basico/js-dom-eventos': [
    { youtubeId: 'WWZX8RWLxIk', title: 'Introdução ao DOM — JS #09', channel: 'Curso em Vídeo' },
    { youtubeId: 'wWnBB-mZIvY', title: 'Eventos DOM — JS #10', channel: 'Curso em Vídeo' },
  ],
  'desenvolvimento-web-basico/js-consumo-apis': [
    { youtubeId: 'i6Oi-YtXnAU', title: 'JavaScript — Fetch API e consumo de dados', channel: 'Dev Aprender' },
    { youtubeId: 'McKNP3g6VBA', title: 'Curso JavaScript Completo — APIs', channel: 'Programação Web' },
  ],

  'banco-de-dados/o-que-e-banco-dados': [
    { youtubeId: 'Ofktsne-utM', title: 'MySQL #01 — O que é um Banco de Dados?', channel: 'Curso em Vídeo' },
    { youtubeId: '5JbAOWJbgIA', title: 'MySQL #02 — Instalando o ambiente', channel: 'Curso em Vídeo' },
  ],
  'banco-de-dados/tabelas-relacionamentos': [
    { youtubeId: 'cHLKtALWDos', title: 'MySQL #04 — Estrutura, PK e FK', channel: 'Curso em Vídeo' },
    { youtubeId: 'm9YPlX0fcJk', title: 'MySQL #03 — Criando tabelas', channel: 'Curso em Vídeo' },
  ],
  'banco-de-dados/sql-crud': [
    { youtubeId: 'GaOlyL3Uv9M', title: 'MySQL #11 — SELECT (Parte 1)', channel: 'Curso em Vídeo' },
    { youtubeId: 'OaPMvrA0cA4', title: 'MySQL — INSERT, UPDATE e DELETE', channel: 'Curso em Vídeo' },
  ],
  'banco-de-dados/postgresql-pratica': [
    { youtubeId: 'Ofktsne-utM', title: 'Conceitos de banco relacional (aplicável ao PostgreSQL)', channel: 'Curso em Vídeo' },
    { youtubeId: 'vwbegraDXD8', title: 'Banco de dados na prática — Horário de Codar', channel: 'Matheus Battisti' },
  ],

  'backend/apis-rest-json': [
    { youtubeId: 'rztsnq1scgw', title: 'Node.js — O que é Node.js e NPM', channel: 'Maykon Silveira' },
    { youtubeId: 'i6Oi-YtXnAU', title: 'JavaScript — Fundamentos de HTTP e APIs', channel: 'Dev Aprender' },
  ],
  'backend/nodejs-express': [
    { youtubeId: 'rztsnq1scgw', title: 'Node.js — Instalação e primeiros passos', channel: 'Maykon Silveira' },
    { youtubeId: 'L79u8csXwBU', title: 'Node.js — Criando servidor HTTP', channel: 'Curso em Vídeo' },
  ],
  'backend/middleware': [
    { youtubeId: 'L79u8csXwBU', title: 'Node.js — Requisições e respostas HTTP', channel: 'Curso em Vídeo' },
    { youtubeId: 'i6Oi-YtXnAU', title: 'JavaScript — Módulos e organização de código', channel: 'Dev Aprender' },
  ],
  'backend/autenticacao': [
    { youtubeId: 'i6Oi-YtXnAU', title: 'Node.js — Autenticação e JWT (conceitos)', channel: 'Dev Aprender' },
    { youtubeId: 'xEKo29OWILE', title: 'Segurança e versionamento — fundamentos', channel: 'Curso em Vídeo' },
  ],
  'backend/crud-completo': [
    { youtubeId: 'GaOlyL3Uv9M', title: 'SQL — Consultas para APIs', channel: 'Curso em Vídeo' },
    { youtubeId: 'rztsnq1scgw', title: 'Node.js — CRUD com Express', channel: 'Maykon Silveira' },
  ],

  'frontend-moderno/react-componentes-props': [
    { youtubeId: 'Bsblz_7H-Mw', title: 'React JS do Zero — Componentes e Props', channel: 'One Bit Code' },
    { youtubeId: 'ZQXHsUrFLA8', title: 'React 19 — Primeiro Componente', channel: 'Cod3r' },
  ],
  'frontend-moderno/react-estado': [
    { youtubeId: 'Bsblz_7H-Mw', title: 'React — useState e gerenciamento de estado', channel: 'One Bit Code' },
    { youtubeId: 'ZQXHsUrFLA8', title: 'React — Estado com Hooks', channel: 'Cod3r' },
  ],
  'frontend-moderno/react-hooks': [
    { youtubeId: 'Bsblz_7H-Mw', title: 'React — useEffect e Hooks essenciais', channel: 'One Bit Code' },
    { youtubeId: 'ZQXHsUrFLA8', title: 'React 19 — Hooks na prática', channel: 'Cod3r' },
  ],
  'frontend-moderno/react-apis': [
    { youtubeId: 'Bsblz_7H-Mw', title: 'React — Consumindo APIs com fetch', channel: 'One Bit Code' },
    { youtubeId: 'WWZX8RWLxIk', title: 'DOM e requisições — base para React', channel: 'Curso em Vídeo' },
  ],

  'qualidade-software/clean-code': [
    { youtubeId: '9BxnJi8DKqY', title: 'Código Limpo (Clean Code) — Por que ler?', channel: 'Filipe Deschamps' },
    { youtubeId: 'wJGbAG5Aiy0', title: 'Seu código funciona. Mas é confiável?', channel: 'Filipe Deschamps' },
  ],
  'qualidade-software/solid-refatoracao': [
    { youtubeId: 'wJGbAG5Aiy0', title: 'Boas práticas e refatoração', channel: 'Filipe Deschamps' },
    { youtubeId: '9BxnJi8DKqY', title: 'Princípios de código limpo e SOLID', channel: 'Filipe Deschamps' },
  ],
  'qualidade-software/testes-unitarios': [
    { youtubeId: 'i6Oi-YtXnAU', title: 'JavaScript — Testes e qualidade de código', channel: 'Dev Aprender' },
    { youtubeId: 'wJGbAG5Aiy0', title: 'Testes unitários estratégicos', channel: 'Filipe Deschamps' },
  ],
  'qualidade-software/testes-integracao': [
    { youtubeId: 'wJGbAG5Aiy0', title: 'Testes de integração e confiabilidade', channel: 'Filipe Deschamps' },
    { youtubeId: 'i6Oi-YtXnAU', title: 'Testando APIs e fluxos completos', channel: 'Dev Aprender' },
  ],

  'devops-deploy/linux-basico': [
    { youtubeId: '6nN2EglOqCM', title: 'Curso de Linux — Introdução', channel: 'Curso em Vídeo' },
    { youtubeId: 'R_8l3xj3QEg', title: 'Linux — Comandos para servidores', channel: 'Curso em Vídeo' },
  ],
  'devops-deploy/docker': [
    { youtubeId: 'Wm99C_f7Kxw', title: 'DESCOMPLICANDO DOCKER — O que é container?', channel: 'LINUXtips' },
    { youtubeId: 'qZevFPMtQho', title: 'DESCOMPLICANDO DOCKER — Dockerfile', channel: 'LINUXtips' },
  ],
  'devops-deploy/cicd-github-actions': [
    { youtubeId: 'ts-H3W1uLMM', title: 'GitHub — Branches e fluxo de trabalho', channel: 'Curso em Vídeo' },
    { youtubeId: 'GDGMf2bnHlE', title: 'GitHub — Repositórios e deploy', channel: 'Curso em Vídeo' },
  ],
  'devops-deploy/monitoramento': [
    { youtubeId: 'Wm99C_f7Kxw', title: 'DevOps — Containers e observabilidade', channel: 'LINUXtips' },
    { youtubeId: 'QkMbqL8QD9w', title: 'Infraestrutura e monitoramento de redes', channel: 'Curso em Vídeo' },
  ],

  'arquitetura-mercado/scrum-kanban': [
    { youtubeId: '9vQZT2igXN4', title: 'Scrum em 9 minutos', channel: 'Universidade Scrum' },
    { youtubeId: '2Vt7Ik8Ublw', title: 'Kanban vs Scrum — Qual usar?', channel: 'PM3' },
  ],
  'arquitetura-mercado/discovery-solucao': [
    { youtubeId: '9vQZT2igXN4', title: 'Agile e Discovery de produto', channel: 'Universidade Scrum' },
    { youtubeId: 'wJGbAG5Aiy0', title: 'Design de solução e requisitos', channel: 'Filipe Deschamps' },
  ],
  'arquitetura-mercado/ddd': [
    { youtubeId: 'wJGbAG5Aiy0', title: 'Domain Driven Design — Introdução', channel: 'Filipe Deschamps' },
    { youtubeId: '9BxnJi8DKqY', title: 'Arquitetura de software — fundamentos', channel: 'Filipe Deschamps' },
  ],
  'arquitetura-mercado/arquitetura-hexagonal-microservicos': [
    { youtubeId: 'wJGbAG5Aiy0', title: 'Arquitetura hexagonal e microsserviços', channel: 'Filipe Deschamps' },
    { youtubeId: 'Wm99C_f7Kxw', title: 'Microsserviços com Docker', channel: 'LINUXtips' },
  ],
  'arquitetura-mercado/projeto-final': [
    { youtubeId: 'Ejkb_YpuHWs', title: 'Trilha completa — HTML5, CSS3 e JavaScript', channel: 'Curso em Vídeo' },
    { youtubeId: 'Bsblz_7H-Mw', title: 'Projeto fullstack com React', channel: 'One Bit Code' },
  ],
};

export async function seedVideos() {
  const countRow = await get('SELECT COUNT(*) as count FROM lesson_videos');
  if (Number(countRow.count) > 0) return;

  await transaction(async (tx) => {
    for (const [key, videos] of Object.entries(videosByLesson)) {
      const [phaseSlug, lessonSlug] = key.split('/');
      const lesson = await tx.get(
        `SELECT l.id FROM lessons l
         JOIN phases p ON p.id = l.phase_id
         WHERE p.slug = ? AND l.slug = ?`,
        [phaseSlug, lessonSlug]
      );
      if (!lesson) continue;

      for (let index = 0; index < videos.length; index++) {
        const video = videos[index];
        await tx.run(
          `INSERT INTO lesson_videos (lesson_id, youtube_id, title, channel, sort_order)
           VALUES (?, ?, ?, ?, ?)`,
          [lesson.id, video.youtubeId, video.title, video.channel, index + 1]
        );
      }
    }
  });

  console.log('✅ Vídeos recomendados adicionados às aulas');
}

export async function reseedVideos() {
  await exec('DELETE FROM lesson_videos');
  await seedVideos();
}
