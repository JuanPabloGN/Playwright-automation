import { Page, Locator } from '@playwright/test';

export class InventoryPage {
  readonly page: Page;
  readonly productsTitle: Locator;
  readonly firstAddToCartButton: Locator;
  readonly cartLink: Locator;

  constructor(page: Page) {
    this.page = page;
    this.productsTitle = page.getByText('Products');
    this.firstAddToCartButton = page.getByRole('button', { name: 'Add to cart' }).first();
    this.cartLink = page.locator('[data-test="shopping-cart-link"]');
  }

  async addFirstProductToCart() {
    await this.firstAddToCartButton.click();
  }

  async goToCart() {
    await this.cartLink.click();
  }
}
