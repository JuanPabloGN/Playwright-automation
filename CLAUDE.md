# Playwright-automation

Proyecto de portafolio de Juan (QA Automation → DevOps). Suite E2E sobre https://www.saucedemo.com con Playwright + TypeScript, reportes Allure y CI en GitHub Actions publicado en GitHub Pages.

Objetivo doble: (1) que el repo pese en el CV para roles de QA Automation / DevOps en Chile, y (2) que Juan aprenda haciendo. Lo segundo manda sobre lo primero.

## Cómo trabajar conmigo (modo aprendizaje)

- Soy el autor del código. Tú eres mentor senior, no el que escribe todo.
- Antes de cambiar algo no trivial, explícame en 3–5 líneas qué vas a hacer y por qué. Espera mi OK.
- Un cambio por vez, un commit por cambio. Nunca mezcles refactor + feature + CI en un commit.
- Después de cada cambio, dime qué pregunta me harían en una entrevista sobre eso y cómo responderla.
- Si pido "arréglalo", primero muéstrame la causa raíz y dame la opción de arreglarlo yo. Si insisto, hazlo.
- No agregues dependencias, carpetas ni abstracciones que no pedí. Si crees que falta algo, propónlo.
- Cuando corrijas algo mío, di qué estaba mal y cuál es la convención correcta, sin reescribir todo.
- Responde en español. Nombres de código, commits y comentarios en inglés.

## Stack

- Playwright + TypeScript. Gestor de paquetes: **npm** (no pnpm; borrar `pnpm-lock.yaml` si reaparece).
- Reportes: Allure (`allure-playwright` + `allure-commandline` como devDependency, usar `npx allure`).
- CI: GitHub Actions. Deploy de reportes a `gh-pages` con `peaceiris/actions-gh-pages`.
- Navegadores: chromium, firefox, webkit (proyectos en `playwright.config.ts`).
- Node 22 (local y CI). Playwright 1.52 se cuelga instalando navegadores con Node 26: en local usar `mise exec node@22 -- npx playwright ...` hasta fijar la versión en el repo.

## Estructura

```
tests/
  fixtures.ts          # fixtures que inyectan los Page Objects
  allure.helper.ts     # adjunta capturas a Allure (a reemplazar por test.step + screenshot: 'on')
  pages/               # Page Objects (una clase por página)
  *.spec.ts            # specs, en kebab-case: login.spec.ts, checkout.spec.ts
.github/workflows/     # CI
playwright.config.ts
```

## Convenciones

- Page Objects: locators y acciones. **Las aserciones van en el test, nunca en la página.**
- Fixtures para inyectar páginas; no instanciar Page Objects dentro del test.
- `test.step('Nombre del paso', async () => {...})` para cada etapa; nada de capturas manuales.
- Locators por rol/texto/`data-test` (`getByRole`, `getByTestId`). Evitar CSS frágil y XPath.
- Sin `waitForTimeout`. Usar aserciones web-first (`expect(locator).toBeVisible()`) y auto-wait.
- Credenciales y URLs por variables de entorno (`process.env`), con `.env.example` en el repo y `.env` en `.gitignore`.
- Archivos de spec en kebab-case, sin espacios ni mayúsculas.
- `allure-results/`, `allure-report/`, `playwright-report/`, `test-results/`, `screenshots/` en `.gitignore` y fuera del repo (`git rm -r --cached` si están trackeados).
- Commits en inglés, imperativo, con prefijo: `feat:`, `fix:`, `test:`, `ci:`, `chore:`, `docs:`.

## Comandos

```bash
npm ci
npx playwright install --with-deps
npx playwright test                       # todo
npx playwright test --project=chromium    # un navegador
npx playwright test tests/login.spec.ts   # un spec
npx playwright test --ui                  # modo UI para depurar
npx playwright codegen https://www.saucedemo.com
npx allure serve ./allure-results
```

## Estado actual y pendientes

Estado (nov 2026): limpieza del repo terminada (PR #1). Dos tests en `tests/checkout.spec.ts` (`tiene título`, `flujo de compra`), POM + fixtures implementados. CI en rojo: `ubuntu-latest` ya es Ubuntu 26.04 y Playwright 1.52 no lo soporta (se arregla en el ítem del workflow).

Orden sugerido. Cada ítem = una rama o PR pequeño:

- [x] **Limpieza del repo**: descripción y topics en GitHub, sacar `allure-results/` y `screenshots/` del tracking, borrar `pnpm-lock.yaml`, renombrar `Primera Compra.spec.ts` → `checkout.spec.ts`.
- [ ] **Arreglar el workflow** (ver sección CI). Es el ítem de más valor para el perfil DevOps.
- [ ] **test.step + screenshot: 'on'** en vez de `adjuntarCaptura`.
- [ ] **Aserciones de negocio** en el flujo de compra: badge del carrito = 1, producto correcto en el carrito, total correcto en el checkout.
- [ ] **Casos negativos de login**: `locked_out_user`, contraseña incorrecta, campos vacíos. Reemplaza `tiene título`.
- [ ] **Más escenarios**: ordenamiento de productos, agregar/quitar del carrito, validaciones del formulario de checkout. Meta: 10–15 tests.
- [ ] **Credenciales por env** + `.env.example`.
- [ ] **storageState**: proyecto `setup` que autentica una vez y lo reutiliza.
- [ ] **Tests de API** con `request` de Playwright (puede ser otra API pública si Saucedemo no expone una).
- [ ] **Dockerfile** con la imagen oficial `mcr.microsoft.com/playwright`.
- [ ] **README**: badge de CI, link directo al último reporte Allure, cómo correr local y en Docker.

## CI: problemas conocidos y diseño objetivo

Problemas del workflow actual:
1. La matriz define `browser` pero no se usa `--project=${{ matrix.browser }}`: cada job corre los 3 navegadores (9 ejecuciones).
2. Los 3 jobs suben un artifact con el mismo nombre `playwright-report`; en `upload-artifact@v4` eso falla.
3. Los 3 jobs publican en paralelo a la misma carpeta de `gh-pages`: carrera.
4. Allure y los deploys no corren cuando un test falla, que es cuando más se necesita el reporte.
5. Menores: `npm install -g --save-dev` contradictorio, sin `cache: npm`, `lts/*` sin fijar, timeout de 60 min, sin `permissions`.
6. `runs-on: ubuntu-latest` ahora es Ubuntu 26.04 y Playwright 1.52 no puede instalar navegadores ahí: el job falla en ~15 s sin correr tests (también en `main`).

Diseño objetivo:
- Job `test` con matriz `[chromium, firefox, webkit]`, `fail-fast: false`, `--project=${{ matrix.browser }}`, instala solo ese navegador, sube `allure-results-${{ matrix.browser }}`.
- Job `report` con `needs: test` e `if: ${{ !cancelled() }}`, descarga con `pattern: allure-results-*` y `merge-multiple: true`, genera Allure y publica una sola vez a `gh-pages` solo en push a `main`.
- `runs-on: ubuntu-24.04` fijado, `concurrency` por rama, `permissions: contents: write` solo en `report`, Node fijado (22), `cache: npm`, timeout 15 min.
- Verificar antes de aplicar que los nombres de proyecto en `playwright.config.ts` coincidan con la matriz.

## Qué debe poder contar Juan en una entrevista (checklist de aprendizaje)

- Por qué las aserciones van en el test y no en el Page Object.
- Qué es una fixture en Playwright y cómo se diferencia de `beforeEach`.
- Qué hace `auto-wait` y por qué `waitForTimeout` es un code smell.
- Diferencia entre `test.step`, `test.describe` y `test.beforeAll`.
- Qué es `storageState` y qué problema resuelve.
- Cómo funciona una matriz en GitHub Actions y por qué se separan `test` y `report`.
- Por qué `npm ci` y no `npm install` en CI.
- Qué hace `--with-deps` y por qué la imagen oficial de Playwright evita ese paso en Docker.
- Qué son los artifacts de Actions y en qué se diferencian de GitHub Pages.

## Para el CV

Descripción actual (actualizar cuando se cumplan los pendientes, agregando cantidad de tests, API y Docker):

> **Playwright Automation Framework** — github.com/JuanPabloGN/Playwright-automation
> Suite E2E en Playwright + TypeScript con Page Object Model y fixtures, ejecutada en 3 navegadores mediante GitHub Actions, con reportes Allure publicados automáticamente en GitHub Pages.
