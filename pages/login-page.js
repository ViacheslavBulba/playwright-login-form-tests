import { expect } from '@playwright/test';
import { BasePage } from './base-page';

export class LoginPage extends BasePage {

  constructor(page) {
    super(page);
    this.page = page;
    this.usernameInput = '//input[@id="username" or @name="username"]';
    this.passwordInput = '//input[@id="password" or @name="password"]';
    this.signInButton = '//*[@type="submit"]';
    this.showHidePasswordToggle = '//*[@id="password-visibility-toggle" or contains(@class,"toggle-password")]';
    this.forgotPasswordLink = '//*[contains(text(),"Forgot password?") or contains(text(),"Forgot Password")]';
  }

  async enterUsername(text) {
    console.log(`enter username [${text}]`);
    await this.page.locator(this.usernameInput).fill(text);
  }

  async enterPassword(text) {
    console.log(`enter password [${text}]`);
    await this.page.locator(this.passwordInput).fill(text);
  }

  async pressEnterInPasswordInputField() {
    console.log(`press enter in password input field`);
    await this.page.locator(this.passwordInput).press('Enter');
  }

  async clickOnSignInButton() {
    console.log(`click on sign in button`);
    await this.page.locator(this.signInButton).first().click();
  }

  async clickOnShowHidePasswordToggle() {
    console.log(`click on show/hide password toggle`);
    await this.page.locator(this.showHidePasswordToggle).first().click();
  }

  async clickOnForgotPasswordLink() {
    console.log(`click on forgot password link`);
    await this.page.locator(this.forgotPasswordLink).first().click();
  }
};