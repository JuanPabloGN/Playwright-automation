# Playwright-automation

Automatización de pruebas end-to-end para [Saucedemo](https://www.saucedemo.com/) usando [Playwright](https://playwright.dev/) y reportes visuales con [Allure](https://docs.qameta.io/allure/).

## Características
- Flujo completo de compra automatizado
- Captura de pantallas en pasos clave
- Reportes Allure con evidencia visual
- Pruebas en múltiples navegadores (Chromium, Firefox, Webkit)

## Estructura principal
- `tests/Primera Compra.spec.ts`: Prueba principal (título y flujo de compra)
- `tests/allure.helper.ts`: Helper para adjuntar capturas a Allure
- `playwright.config.ts`: Configuración de Playwright y Allure

## Instalación
1. Clona el repositorio:
   ```bash
   git clone https://github.com/JuanPabloGN/Playwright-automation.git
   cd Playwright-automation
   ```
2. Instala las dependencias:
   ```bash
   npm install
   ```

## Ejecución de pruebas
Ejecuta todas las pruebas automatizadas:
```bash
npx playwright test
```

## Visualización de reportes Allure

### Ver el historial de reportes
- **Reporte Playwright:**
  ```
  https://juanpablogn.github.io/Playwright-automation/playwright/<NÚMERO_RUN>/
  ```
- **Reporte Allure:**
  ```
  https://juanpablogn.github.io/Playwright-automation/allure/<NÚMERO_RUN>/
  ```
Donde `<NÚMERO_RUN>` es el número de ejecución del workflow (lo puedes ver en la lista de acciones de GitHub Actions).

### Ejemplo de acceso
Si el número de ejecución es 15:
- Playwright: https://juanpablogn.github.io/Playwright-automation/playwright/15/
- Allure: https://juanpablogn.github.io/Playwright-automation/allure/15/

**Nota:** El historial no se sobrescribe. Cada ejecución deja su propio reporte accesible públicamente.

---

## Visualización local de reportes


1. Ejecuta las pruebas para generar los resultados:
   ```bash
   npx playwright test
   ```
2. Sirve el reporte Allure:
   ```bash
   npx allure serve ./allure-results
   ```
   Esto abrirá el reporte en tu navegador.

## Personalización
- Modifica `tests/Primera Compra.spec.ts` para agregar o ajustar escenarios.
- Puedes agregar más capturas usando el helper `adjuntarCaptura`.

## Notas
- Solo se ejecutan los tests de `Primera Compra.spec.ts` por configuración.
- Carpeta `allure-results/` y capturas están ignoradas en `.gitignore`.

---

> Proyecto creado por JuanPabloGN para pruebas de automatización con Playwright y Allure.