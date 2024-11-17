import { expect, test } from '@playwright/test';
import { HomePage } from '../pages/home-page';
import { LoginPage } from '../pages/login-page';

const baseUrl = 'https://www.linkedin.com';
const loginPageUrl = `https://www.linkedin.com/login`;
const validEmail = 'test3452345877@gmail.com';
const validPassword = 'validPassword!';
const validPhoneNumberAsUsername = '+15551234567';
const validUsername = 'ValidUsername';
const textToPresentAfterSuccessfulLogin = 'Profile';
const errorMessageInvalidCredentials = 'This email and password combination is incorrect.';
const errorMessageEmptyUsername = 'Please enter an email address or phone number.';
const errorMessageEmptyPassword = 'Please enter a password.';
const errorMessageMinUsernameLength = 'The username you provided must have at least 6 characters.';
const errorMessageMinPasswordLength = 'The password you provided must have at least 6 characters.';
const errorMessageInvalidFormatUsername = 'Please enter a valid username.';

// 25 tests

test('click on sign in link on home page', async ({ page }) => {
  const homePage = new HomePage(page);
  const loginPage = new LoginPage(page);
  await homePage.goto(baseUrl);
  await homePage.clickOnSignInLink();
  await loginPage.waitForText('Forgot password?', 5);
  await loginPage.assertTextIsPresent('Forgot password?');
});

test('valid email and password', async ({ page }) => {
  const loginPage = new LoginPage(page);
  await loginPage.goto(loginPageUrl);
  await loginPage.enterUsername(validEmail);
  await loginPage.enterPassword(validPassword);
  await loginPage.clickOnSignInButton();
  await loginPage.waitForText(textToPresentAfterSuccessfulLogin, 5);
  await loginPage.assertTextIsPresent(textToPresentAfterSuccessfulLogin);
});

test('press enter instead of button', async ({ page }) => {
  const loginPage = new LoginPage(page);
  await loginPage.goto(loginPageUrl);
  await loginPage.enterUsername(validEmail);
  await loginPage.enterPassword(validPassword);
  await loginPage.pressEnterInPasswordInputField();
  await loginPage.waitForText(textToPresentAfterSuccessfulLogin, 5);
  await loginPage.assertTextIsPresent(textToPresentAfterSuccessfulLogin);
});

test('username in lower case', async ({ page }) => {
  const loginPage = new LoginPage(page);
  await loginPage.goto(loginPageUrl);
  await loginPage.enterUsername(validEmail.toLowerCase());
  await loginPage.enterPassword(validPassword);
  await loginPage.clickOnSignInButton();
  await loginPage.waitForText(textToPresentAfterSuccessfulLogin, 5);
  await loginPage.assertTextIsPresent(textToPresentAfterSuccessfulLogin);
});

test('username in upper case', async ({ page }) => {
  const loginPage = new LoginPage(page);
  await loginPage.goto(loginPageUrl);
  await loginPage.enterUsername(validEmail.toUpperCase());
  await loginPage.enterPassword(validPassword);
  await loginPage.clickOnSignInButton();
  await loginPage.waitForText(textToPresentAfterSuccessfulLogin, 5);
  await loginPage.assertTextIsPresent(textToPresentAfterSuccessfulLogin);
});

test('leading and trailing spaces in username', async ({ page }) => {
  const loginPage = new LoginPage(page);
  await loginPage.goto(loginPageUrl);
  await loginPage.enterUsername(' ' + validEmail + ' ');
  await loginPage.enterPassword(validPassword);
  await loginPage.clickOnSignInButton();
  await loginPage.waitForText(textToPresentAfterSuccessfulLogin, 5);
  await loginPage.assertTextIsPresent(textToPresentAfterSuccessfulLogin);
});

test('leading and trailing spaces in password', async ({ page }) => {
  const loginPage = new LoginPage(page);
  await loginPage.goto(loginPageUrl);
  await loginPage.enterUsername(validEmail);
  await loginPage.enterPassword(' ' + validPassword + ' ');
  await loginPage.clickOnSignInButton();
  await loginPage.waitForText(textToPresentAfterSuccessfulLogin, 5);
  await loginPage.assertTextIsPresent(textToPresentAfterSuccessfulLogin);
});

test('invalid password, then valid (typo in password)', async ({ page }) => {
  const loginPage = new LoginPage(page);
  await loginPage.goto(loginPageUrl);
  await loginPage.enterUsername(validEmail);
  await loginPage.enterPassword(validPassword + '1');
  await loginPage.clickOnSignInButton();
  await loginPage.assertTextIsPresent(errorMessageInvalidCredentials);
  await loginPage.enterPassword(validPassword);
  await loginPage.clickOnSignInButton();
  await loginPage.waitForText(textToPresentAfterSuccessfulLogin, 5);
  await loginPage.assertTextIsPresent(textToPresentAfterSuccessfulLogin);
});

test('invalid username, then valid (typo in username)', async ({ page }) => {
  const loginPage = new LoginPage(page);
  await loginPage.goto(loginPageUrl);
  await loginPage.enterUsername(validEmail + 'm');
  await loginPage.enterPassword(validPassword);
  await loginPage.clickOnSignInButton();
  await loginPage.assertTextIsPresent(errorMessageInvalidCredentials);
  await loginPage.enterUsername(validEmail);
  await loginPage.enterPassword(validPassword);
  await loginPage.clickOnSignInButton();
  await loginPage.waitForText(textToPresentAfterSuccessfulLogin, 5);
  await loginPage.assertTextIsPresent(textToPresentAfterSuccessfulLogin);
});

test('phone number as a username', async ({ page }) => {
  const loginPage = new LoginPage(page);
  await loginPage.goto(loginPageUrl);
  await loginPage.enterUsername(validPhoneNumberAsUsername);
  await loginPage.enterPassword(validPassword);
  await loginPage.clickOnSignInButton();
  await loginPage.waitForText(textToPresentAfterSuccessfulLogin, 5);
  await loginPage.assertTextIsPresent(textToPresentAfterSuccessfulLogin);
});

test('username (not email) as a username', async ({ page }) => {
  const loginPage = new LoginPage(page);
  await loginPage.goto(loginPageUrl);
  await loginPage.enterUsername(validUsername);
  await loginPage.enterPassword(validPassword);
  await loginPage.clickOnSignInButton();
  await loginPage.waitForText(textToPresentAfterSuccessfulLogin, 5);
  await loginPage.assertTextIsPresent(textToPresentAfterSuccessfulLogin);
});

test('empty username and password', async ({ page }) => {
  const loginPage = new LoginPage(page);
  await loginPage.goto(loginPageUrl);
  await loginPage.clickOnSignInButton();
  await loginPage.waitForText(errorMessageEmptyUsername, 3);
  await loginPage.assertTextIsPresent(errorMessageEmptyUsername);
});

test('empty username, not empty password', async ({ page }) => {
  const loginPage = new LoginPage(page);
  await loginPage.goto(loginPageUrl);
  await loginPage.enterPassword(validPassword);
  await loginPage.clickOnSignInButton();
  await loginPage.assertTextIsPresent(errorMessageEmptyUsername);
});

test('not empty username, empty password', async ({ page }) => {
  const loginPage = new LoginPage(page);
  await loginPage.goto(loginPageUrl);
  await loginPage.enterUsername(validEmail);
  await loginPage.clickOnSignInButton();
  await loginPage.assertTextIsPresent('Please enter a password.');
  await loginPage.assertTextIsMissing(errorMessageEmptyUsername);
});

test('show / hide password', async ({ page }) => {
  const password = '12345678';
  const loginPage = new LoginPage(page);
  await loginPage.goto(loginPageUrl);
  await loginPage.enterPassword(password);
  await expect(page.locator(loginPage.passwordInput)).toHaveValue(password);
  expect(await page.locator(loginPage.passwordInput).getAttribute('type')).toBe('password');
  await loginPage.clickOnShowHidePasswordToggle();
  await expect(page.locator(loginPage.passwordInput)).toHaveValue(password);
  expect(await page.locator(loginPage.passwordInput).getAttribute('type')).toBe('text');
  await loginPage.clickOnShowHidePasswordToggle();
  await expect(page.locator(loginPage.passwordInput)).toHaveValue(password);
  expect(await page.locator(loginPage.passwordInput).getAttribute('type')).toBe('password');
});

test('invalid username format', async ({ page }) => {
  const loginPage = new LoginPage(page);
  await loginPage.goto(loginPageUrl);
  await loginPage.enterUsername('aaa');
  await loginPage.enterPassword(validPassword);
  await loginPage.clickOnSignInButton();
  await loginPage.assertTextIsPresent(errorMessageInvalidFormatUsername);
});

test('click on forgot password link', async ({ page }) => {
  const loginPage = new LoginPage(page);
  await loginPage.goto(loginPageUrl);
  await loginPage.assertTextIsPresent('Forgot password?');
  await loginPage.clickOnForgotPasswordLink();
  await loginPage.assertTextIsPresent('send a verification code');
});

test('click on create new account link below login form', async ({ page }) => {
  const loginPage = new LoginPage(page);
  await loginPage.goto(loginPageUrl);
  await loginPage.clickOnText('Join now');
  await loginPage.waitSeconds(3);
  await loginPage.assertTextIsPresent('Password (6+ characters)');
});

test('sql injection', async ({ page }) => {
  const sqlInjection = 'SELECT * FROM Accounts; DROP TABLE Accounts;--';
  const loginPage = new LoginPage(page);
  await loginPage.goto(loginPageUrl);
  await loginPage.enterUsername(sqlInjection);
  await loginPage.enterPassword(sqlInjection);
  await loginPage.clickOnSignInButton();
  await loginPage.assertTextIsPresent(errorMessageInvalidFormatUsername);
});

test('html injection', async ({ page }) => {
  const htmlInjection = `</body>`;
  const loginPage = new LoginPage(page);
  await loginPage.goto(loginPageUrl);
  await loginPage.enterUsername(htmlInjection);
  await loginPage.enterPassword(htmlInjection);
  await loginPage.clickOnSignInButton();
  await loginPage.assertTextIsPresent(errorMessageInvalidFormatUsername);
});

test('email min length message', async ({ page }) => {
  const loginPage = new LoginPage(page);
  await loginPage.goto(loginPageUrl);
  await loginPage.enterUsername('a');
  await loginPage.enterPassword(validPassword);
  await loginPage.clickOnSignInButton();
  await loginPage.assertTextIsPresent(errorMessageMinUsernameLength);
});

test('password min length message', async ({ page }) => {
  const loginPage = new LoginPage(page);
  await loginPage.goto(loginPageUrl);
  await loginPage.enterUsername(validEmail);
  await loginPage.enterPassword('1');
  await loginPage.clickOnSignInButton();
  await loginPage.assertTextIsPresent(errorMessageMinPasswordLength);
});

test('long username and password - 50 chars', async ({ page }) => {
  const longUsername = 'Username901234567890Password901234567890@gmail.com';
  const longPassword = 'Password901234567890Password901234567890Password90';
  const loginPage = new LoginPage(page);
  await loginPage.goto(loginPageUrl);
  await loginPage.enterUsername(longUsername);
  await loginPage.enterPassword(longPassword);
  await expect(page.locator(loginPage.usernameInput)).toHaveValue(longUsername);
  await expect(page.locator(loginPage.passwordInput)).toHaveValue(longPassword);
});

test('keep me logged in - option is present', async ({ page }) => {
  const loginPage = new LoginPage(page);
  await loginPage.goto(loginPageUrl);
  await loginPage.assertTextIsPresent('Keep me logged in');
});

test('sign in with facebook, google, apple - options are present', async ({ page }) => {
  const loginPage = new LoginPage(page);
  await loginPage.goto(loginPageUrl);
  await loginPage.assertTextIsPresent('Sign in with Facebook');
  await loginPage.assertTextIsPresent('Sign in with Google');
  await loginPage.assertTextIsPresent('Sign in with Apple');
});