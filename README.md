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
| Backend   | Node.js, Express, SQLite (Turso / local)   |
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

## Deploy Automático (GitHub -> Render)

Este projeto está preparado para deploy contínuo usando o `render.yaml` no plano **Free** do Render.

### Persistência de dados (gratuito)

No Render Free, o filesystem do container é efêmero — dados locais somem a cada restart. A solução é usar o **[Turso](https://turso.tech)** (SQLite na nuvem, plano gratuito permanente):

| Ambiente   | Banco de dados                          |
|------------|-----------------------------------------|
| Local      | Arquivo `data/curso.db` (automático)    |
| Produção   | Turso Cloud via variáveis de ambiente   |

#### Configurar Turso (uma vez)

1. Crie conta em [turso.tech](https://turso.tech) (sem cartão de crédito)
2. Instale a CLI: `brew install tursodatabase/tap/turso` (ou veja [docs](https://docs.turso.tech/cli))
3. Crie o banco:
   ```bash
   turso auth login
   turso db create devtrail
   turso db show devtrail --url      # copie a URL
   turso db tokens create devtrail   # copie o token
   ```
4. No Render, em **Environment** do serviço, adicione:
   - `TURSO_DATABASE_URL` = URL copiada (ex: `libsql://devtrail-xxx.turso.io`)
   - `TURSO_AUTH_TOKEN` = token gerado
5. Faça redeploy — o seed popula as fases automaticamente na primeira execução

Usuários cadastrados e progresso passam a persistir entre restarts e deploys.

### Fluxo de deploy

1. Você faz `git push origin main`
2. O GitHub Actions executa o workflow de deploy
3. O workflow dispara o deploy hook do Render
4. O Render faz build da imagem Docker e publica

### Configuração única do deploy hook

1. No Render, abra seu serviço e copie o **Deploy Hook URL**
2. No GitHub, acesse `Settings -> Secrets and variables -> Actions`
3. Crie o secret `RENDER_DEPLOY_HOOK_URL` com a URL copiada
4. Confirme que o workflow `.github/workflows/deploy-render.yml` está na branch `main`

Depois disso, cada push para `main` publica automaticamente a nova versão.

## Licença

MIT
# web-curso
