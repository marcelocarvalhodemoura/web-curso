# DevTrail — Sistema de Curso de Desenvolvimento de Software

Plataforma completa de ensino com **React** (frontend) e **Node.js** (backend), estruturada em 10 fases — do iniciante absoluto ao desenvolvedor júnior.

## Funcionalidades

- Trilha com 10 fases e 50+ aulas em Markdown
- Exercícios práticos e ferramentas recomendadas por fase
- Cadastro e login de alunos (JWT)
- Acompanhamento de progresso por aula e por fase
- Dashboard personalizado
- Interface moderna e responsiva

## Tecnologias

| Camada    | Stack                                      |
|-----------|--------------------------------------------|
| Frontend  | React 18, Vite, React Router, React Markdown |
| Backend   | Node.js, Express, SQLite (better-sqlite3)  |
| Auth      | JWT + bcryptjs                             |

## Início Rápido

### Pré-requisitos

- Node.js 18+

### Instalação

```bash
# Instalar dependências
npm run install:all

# Rodar backend + frontend simultaneamente
npm run dev
```

- **Frontend:** http://localhost:5173
- **Backend API:** http://localhost:3001

### Rodar separadamente

```bash
# Backend
cd backend && npm run dev

# Frontend (outro terminal)
cd frontend && npm run dev
```

## Estrutura do Projeto

```
web-curso/
├── backend/
│   ├── src/
│   │   ├── db/          # SQLite + schema
│   │   ├── routes/      # auth, phases, lessons, progress
│   │   ├── middleware/  # JWT auth
│   │   ├── seed.js      # Conteúdo das 10 fases
│   │   └── index.js
│   └── package.json
├── frontend/
│   ├── src/
│   │   ├── components/  # Layout
│   │   ├── context/     # AuthContext
│   │   ├── pages/       # Home, Dashboard, Fases, Aulas
│   │   └── services/    # API client
│   └── package.json
├── data/                # Banco SQLite (gerado automaticamente)
└── package.json
```

## API Endpoints

| Método | Rota                                      | Descrição              |
|--------|-------------------------------------------|------------------------|
| POST   | `/api/auth/register`                      | Cadastro               |
| POST   | `/api/auth/login`                         | Login                  |
| GET    | `/api/auth/me`                            | Usuário logado         |
| GET    | `/api/phases`                             | Listar fases           |
| GET    | `/api/phases/:slug`                       | Detalhe da fase        |
| GET    | `/api/phases/:slug/lessons/:lessonSlug`   | Conteúdo da aula       |
| POST   | `/api/phases/:slug/lessons/:lessonSlug/complete` | Marcar aula concluída |
| GET    | `/api/progress`                           | Progresso do aluno     |

## Trilha de Aprendizagem

| Fase | Título                          | Duração  |
|------|---------------------------------|----------|
| 1    | Alfabetização Digital e Lógica  | 4 sem    |
| 2    | Introdução à Programação        | 6 sem    |
| 3    | Ferramentas do Desenvolvedor    | 2 sem    |
| 4    | Desenvolvimento Web Básico      | 8 sem    |
| 5    | Banco de Dados                  | 4 sem    |
| 6    | Backend                         | 8 sem    |
| 7    | Frontend Moderno                | 8 sem    |
| 8    | Qualidade de Software           | 4 sem    |
| 9    | DevOps e Deploy                 | 4 sem    |
| 10   | Arquitetura e Mercado           | 4 sem    |

**Tempo total estimado:** 10 a 14 meses (1-2h/dia)

## Docker (opcional)

```bash
docker compose up --build
```

## Licença

MIT
# web-curso
