import { allure } from 'allure-playwright';
import { Page } from '@playwright/test';

/**
 * Adjunta una captura de pantalla al reporte de Allure.
 * @param page Instancia de la página Playwright
 * @param nombre Nombre descriptivo para la captura
 */
export async function adjuntarCaptura(page: Page, nombre: string) {
  const buffer = await page.screenshot({ fullPage: true });
  await allure.attachment(nombre, buffer, 'image/png');
}
