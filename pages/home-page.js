import { expect } from '@playwright/test';
import { BasePage } from './base-page';

export class HomePage extends BasePage {

  constructor(page) {
    super(page);
    this.page = page;
    this.signInLink = '//*[normalize-space()="Sign in"]';
  }

  async clickOnSignInLink() {
    console.log(`click on sign in link`);
    await this.page.locator(this.signInLink).first().click();
  }
};