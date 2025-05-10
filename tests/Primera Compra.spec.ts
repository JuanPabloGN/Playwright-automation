import { test, expect } from '@playwright/test';
import { adjuntarCaptura } from './allure.helper';

test('tiene título', async ({ page }) => {
  await page.goto('https://www.saucedemo.com/');

  // Espera que el título contenga el texto.
  await expect(page).toHaveTitle(/Swag Labs/);
});

test('flujo de compra', async ({ page }) => {
  await page.goto('https://www.saucedemo.com/');

  // Ingresa las credenciales y haz login.
  await page.getByRole('textbox', { name: 'Username' }).fill('standard_user');
  await page.getByRole('textbox', { name: 'Password' }).fill('secret_sauce');
  await page.getByRole('button', { name: 'Login' }).click();

  // Captura de pantalla después del login y adjunta a Allure
  await adjuntarCaptura(page, 'Después de login');

  // Espera que la página tenga el texto "Products".
  await expect(page.getByText('Products')).toBeVisible();

  // Agrega el primer producto al carrito.
  await page.getByRole('button', { name: 'Add to cart' }).first().click();

  // Captura de pantalla después de agregar al carrito y adjunta a Allure
  await adjuntarCaptura(page, 'Después de agregar al carrito');

  // Ir al carrito usando el data-test correcto.
  await page.locator('[data-test="shopping-cart-link"]').click();

  // Captura de pantalla después de entrar al carrito y adjunta a Allure
  await adjuntarCaptura(page, 'Después de entrar al carrito');

  // Espera que la página tenga el texto "Your Cart".
  await expect(page.getByText('Your Cart')).toBeVisible();

  // Realiza el checkout.
  await page.getByRole('button', { name: 'Checkout' }).click();

  // Captura de pantalla después del checkout y adjunta a Allure
  await adjuntarCaptura(page, 'Después del checkout');

  // Llena el formulario de checkout.
await page.locator('[data-test="firstName"]').fill('John');
await page.locator('[data-test="lastName"]').fill('Doe');
await page.locator('[data-test="postalCode"]').fill('12345');

// Captura de pantalla después de completar el checkout y adjunta a Allure
await adjuntarCaptura(page, 'Después de completar el checkout');

// Haz clic en "Continue" para avanzar al resumen
await page.locator('[data-test="continue"]').click();

// Ahora haz clic en "Finish"
await page.locator('[data-test="finish"]').click();
  

  // Captura de pantalla después de finalizar el pago y adjunta a Allure
  await adjuntarCaptura(page, 'Después de finalizar el pago');


});
