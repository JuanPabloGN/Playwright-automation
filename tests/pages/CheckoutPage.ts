import { Page, Locator } from '@playwright/test';

export class CheckoutPage {
  // readonly: no se puede reasignar fuera del constructor (chequeo de TypeScript en compilación, no en runtime)
  readonly page: Page;
  readonly firstNameInput: Locator;
  readonly lastNameInput: Locator;
  readonly postalCodeInput: Locator;
  readonly continueButton: Locator;
  readonly finishButton: Locator;
  readonly confirmationMessage: Locator; // expuesto para que el test haga expect() sobre él

  constructor(page: Page) {
    this.page = page;
    // Pantalla 1: formulario de datos
    this.firstNameInput = page.locator('[data-test="firstName"]');
    this.lastNameInput = page.locator('[data-test="lastName"]');
    this.postalCodeInput = page.locator('[data-test="postalCode"]');
    this.continueButton = page.locator('[data-test="continue"]');
    // Pantalla 2: resumen y confirmación
    this.finishButton = page.locator('[data-test="finish"]');
    this.confirmationMessage = page.getByText('Thank you for your order!');
  }

  async fillForm(firstName: string, lastName: string, postalCode: string) {
    await this.firstNameInput.fill(firstName);
    await this.lastNameInput.fill(lastName);
    await this.postalCodeInput.fill(postalCode);
  }

  async continue() {
    await this.continueButton.click();
  }

  async finish() {
    await this.finishButton.click();
  }
}
