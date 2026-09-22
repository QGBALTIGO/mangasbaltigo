# AniNexus — Mangás

Plataforma full-stack brasileira dedicada exclusivamente a **mangás**.

## Foco do projeto

- catálogo e descoberta de mangás;
- busca exclusivamente por mangás e usuários;
- detalhes de obras com capítulos, volumes, gêneros, status e notas;
- biblioteca pessoal de leitura;
- progresso por capítulos e volumes;
- favoritos, avaliações e impressões;
- rankings e mangás em alta;
- comunidade, perfis e conquistas voltadas a leitores;
- notícias relacionadas a mangás;
- integração principal de catálogo com AniList em `Media(type: MANGA)`.

## Rotas principais

- `/` — início focado em mangás;
- `/mangas` — catálogo;
- `/manga/:slug-:id` — detalhes;
- `/meus-mangas` — biblioteca de leitura;
- `/minha-biblioteca` — biblioteca do usuário;
- `/comunidade` — comunidade;
- `/noticias` — notícias.

Rotas antigas de anime permanecem apenas como compatibilidade histórica e são redirecionadas para o catálogo de mangás no cliente.

## Stack

Node.js, Fastify, PostgreSQL, Redis opcional, AniList GraphQL, HTML/CSS/JavaScript e PWA.

## Desenvolvimento

Consulte `package.json` para os comandos disponíveis de desenvolvimento, testes, build e validação.
