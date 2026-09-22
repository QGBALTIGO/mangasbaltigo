# Mangás Baltigo

Plataforma full-stack brasileira dedicada a **mangás, manhwas, manhuas e comics**, com catálogo integrado ao MangaBall, biblioteca pessoal e experiência de leitura responsiva.

## Experiência V62

A interface foi redesenhada com identidade própria da Baltigo, usando como referência padrões de descoberta de plataformas de leitura e a navegação escura/compacta de sites de streaming, sem copiar marcas ou assets de terceiros.

- home com busca central, destaque, atualizações e recomendações;
- catálogo MangaBall com busca, filtros por formato e paginação;
- página de obra com capa, sinopse, gêneros, status e capítulos;
- leitor interno vertical quando as páginas são expostas pelo HTML público da fonte;
- fallback seguro para a página original quando a leitura interna não está disponível;
- biblioteca, favoritos, comunidade, perfis e autenticação preservados da base existente;
- PWA e layout responsivo para celular, tablet e desktop.

## Rotas principais

- `/` — início;
- `/mangas` — catálogo;
- `/mangas/atualizacoes` — capítulos e obras atualizados;
- `/manga/:slug-:id` — detalhes da obra;
- `/manga/:slug-:id/capitulo/:numero` — leitor;
- `/minha-biblioteca` — biblioteca do usuário;
- `/comunidade` — comunidade;
- `/noticias` — notícias.

## API MangaBall

- `GET /api/mangaball/home`;
- `GET /api/mangaball/updates`;
- `GET /api/reading`;
- `GET /api/manga/:id`;
- `GET /api/manga/:id/chapter?number=...`.

A integração limita as requisições ao host configurado em `MANGABALL_ORIGIN`, aplica timeout/tamanho máximo, cache e não tenta contornar desafios ou proteções da fonte.

## Stack

Node.js 22, Fastify, PostgreSQL, Redis, Cheerio, Clerk, HTML/CSS/JavaScript, PWA e Playwright.

## Desenvolvimento

```bash
pnpm install
pnpm run check
pnpm run build:public
pnpm run validate:deploy
pnpm start
```

O GitHub Pages usa o caminho `/mangasbaltigo/`. A API pode ser configurada no workflow pela variável `PUBLIC_API_ORIGIN`.
