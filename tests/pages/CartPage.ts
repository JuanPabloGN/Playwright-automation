import { Page, Locator } from '@playwright/test';

export class CartPage {
  // readonly: no se puede reasignar fuera del constructor (chequeo de TypeScript en compilación, no en runtime)
  readonly page: Page;
  readonly cartTitle: Locator;   // expuesto para que el test haga expect() sobre él
  readonly checkoutButton: Locator;

  constructor(page: Page) {
    this.page = page;
    this.cartTitle = page.getByText('Your Cart');
    this.checkoutButton = page.getByRole('button', { name: 'Checkout' });
  }

  async checkout() {
    await this.checkoutButton.click();
  }
}
