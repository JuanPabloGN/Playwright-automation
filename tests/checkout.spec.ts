import { test, expect } from './fixtures';
import { adjuntarCaptura } from './allure.helper';

test('tiene título', async ({ loginPage }) => {
  await loginPage.goto();

  await expect(loginPage.page).toHaveTitle(/Swag Labs/);
});

test('flujo de compra', async ({ page, loginPage, inventoryPage, cartPage, checkoutPage }) => {
  await loginPage.goto();
  await loginPage.login('standard_user', 'secret_sauce');

  await adjuntarCaptura(page, 'Después de login');
  await expect(inventoryPage.productsTitle).toBeVisible();

  await inventoryPage.addFirstProductToCart();

  await adjuntarCaptura(page, 'Después de agregar al carrito');

  await inventoryPage.goToCart();

  await adjuntarCaptura(page, 'Después de entrar al carrito');
  await expect(cartPage.cartTitle).toBeVisible();

  await cartPage.checkout();

  await adjuntarCaptura(page, 'Después del checkout');

  await checkoutPage.fillForm('John', 'Doe', '12345');

  await adjuntarCaptura(page, 'Después de completar el checkout');

  await checkoutPage.continue();
  await checkoutPage.finish();

  await adjuntarCaptura(page, 'Después de finalizar el pago');
  await expect(checkoutPage.confirmationMessage).toBeVisible();
});
