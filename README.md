# Mangás Baltigo

Plataforma web brasileira focada exclusivamente em **mangás, manhwas e manhuas**.

A experiência v62 combina referências de descoberta de plataformas de leitura modernas com uma identidade própria da Baltigo: interface escura, destaque visual para capas, atualizações rápidas, biblioteca pessoal e reader responsivo.

## Experiência principal

- home editorial com destaque, últimos capítulos, recomendados e títulos em alta;
- catálogo pesquisável com paginação;
- página de obra com sinopse, origem e capítulos;
- leitor interno vertical ou paginado quando a fonte pública expõe as imagens do capítulo;
- fallback explícito para a fonte original quando as páginas não estão disponíveis;
- biblioteca local e integração compatível com a camada de conta já existente;
- PWA e navegação móvel fixa;
- layout responsivo para celular, tablet e desktop.

## Fonte MangaBall

O catálogo principal é integrado ao MangaBall através de `lib/mangaball-provider.mjs`.

A integração utiliza requisições HTTP comuns e parsing do HTML público. Ela **não tenta contornar bloqueios, CAPTCHA ou proteções anti-bot**. O endpoint de capítulo aceita apenas um ID interno e um número de capítulo previamente encontrado na obra, evitando aceitar URLs arbitrárias fornecidas pelo cliente.

Rotas principais:

- `GET /api/mangaball/home`
- `GET /api/mangaball/updates`
- `GET /api/reading`
- `GET /api/manga/:id`
- `GET /api/manga/:id/chapter?number=...`

## Rotas do site

- `/` — início;
- `/mangas` — catálogo;
- `/mangas/atualizacoes` — capítulos recentes;
- `/manga/:slug-:id` — detalhes da obra;
- `/ler/:id/:capitulo` — reader;
- `/minha-biblioteca` — biblioteca.

No GitHub Pages, essas rotas são preservadas via `?p=` para funcionar em hospedagem estática.

## Stack

- Node.js 22 + Fastify;
- PostgreSQL;
- Redis opcional para cache;
- Cheerio para normalização da fonte;
- HTML/CSS/JavaScript sem framework no frontend;
- Playwright para E2E;
- PWA / Service Worker;
- GitHub Actions + GitHub Pages.

## Frontend v62

A camada ativa da nova experiência fica em:

- `preview-v62/mangas-baltigo-v62.js`
- `preview-v62/mangas-baltigo-v62.css`

Camadas antigas permanecem no repositório apenas enquanto funcionalidades herdadas são migradas e podem ser removidas progressivamente.

## Desenvolvimento

```bash
pnpm install
pnpm run check
pnpm start
```

Para montar o artefato estático:

```bash
PUBLIC_SITE_ORIGIN=https://qgbaltigo.github.io/mangasbaltigo \
PUBLIC_BASE_PATH=/mangasbaltigo/ \
pnpm run build:public

pnpm run validate:deploy
```

## Direitos de conteúdo

O software não concede direitos sobre obras, capas, traduções ou capítulos. Use fontes e conteúdos cuja distribuição e exibição sejam autorizadas pelos respectivos titulares.
