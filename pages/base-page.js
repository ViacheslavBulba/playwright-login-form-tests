import { expect } from '@playwright/test';

export class BasePage {

  constructor(page) {
    this.page = page;
  }

  async goto(url) {
    console.log(`open page ${url}`);
    await this.page.goto(url);
  }

  async isAtLeastOneOfManyElementsVisible(locator) {
    let visibility = false;
    const elements = await this.page.locator(locator).all();
    // console.log(`found ${elements.length} elements for ${locator}`);
    for (let el of elements) {
      visibility = await el.isVisible();
      if (visibility) {
        break;
      }
    }
    return visibility;
  }

  async assertTextIsPresent(text) {
    console.log(`assert text [${text}] is visible`);
    let locator = `//*[text()="${text}"]`;
    let visibility = await this.isAtLeastOneOfManyElementsVisible(locator);
    if (!visibility) {
      locator = `//*[@value="${text}"]`;
      visibility = await this.isAtLeastOneOfManyElementsVisible(locator);
    }
    if (!visibility) {
      locator = `//*[contains(text(),"${text}")]`;
      visibility = await this.isAtLeastOneOfManyElementsVisible(locator);
    }
    if (!visibility) {
      locator = `//*[normalize-space()="${text}"]`;
      visibility = await this.isAtLeastOneOfManyElementsVisible(locator);
    }
    expect(visibility, `Cannot find text [${text}]`).toBe(true);
  }

  async assertTextIsMissing(text) {
    console.log(`assert text equals [${text}] is missing`);
    const locator = `//*[text()="${text}"]`;
    const visibility = await this.isAtLeastOneOfManyElementsVisible(locator);
    expect(visibility, `Text [${text}] should not be visible on the page`).toBe(false);
  }

  async getNumberOfElements(locator) {
    let result = 0;
    try {
      result = await this.page.locator(locator).count();
    } catch (error) { // Execution context was destroyed, most likely because of a navigation
      // console.log(`exception, wait and retry...`);
      await this.waitSeconds(5);
      result = await this.page.locator(locator).count();
    }
    return result;
  }

  async waitForElement(locator, seconds) {
    let found = false;
    for (let timerCount = 0; timerCount < seconds * 10; timerCount++) {
      if (await this.getNumberOfElements(locator) > 0) {
        found = true;
        return true;
      } else {
        await this.page.waitForTimeout(100);
      }
    }
    return found;
  }

  async waitForText(text, seconds) {
    const locator = `//*[normalize-space()="${text}"]`;
    await this.waitForElement(locator, seconds);
  }

  async clickOnFirstVisibleElement(locator) {
    const elements = await this.page.locator(locator).all();
    // console.log(`found ${elements.length} elements for [${locator}]`);
    let i = 1;
    for (let el of elements) {
      const isVisible = await el.isVisible();
      if (isVisible) {
        await el.click({ force: true, position: { x: 1, y: 1 } });
        return;
      } else {
        // console.log(`${i} instance is not visible`);
        i++;
      }
    }
    expect(false, `Cannot find and click on visible [${locator}]`).toBe(true);
  }

  async clickOnText(text) {
    console.log(`click on text [${text}]`);
    await this.waitForText(text, 3);
    const locatorTextEquals = `//*[text()="${text}"]`;
    const locatorValueEquals = `//*[@value="${text}"]`;
    const locatorTextContains = `//*[contains(text(),"${text}")]`;
    const locatorNormalizeSpace = `//*[normalize-space()="${text}"]`;
    if (await this.getNumberOfElements(locatorNormalizeSpace) > 0) {
      await this.page.locator(locatorNormalizeSpace).first().click();
    } else if (await this.getNumberOfElements(locatorTextEquals) > 0) {
      await this.clickOnFirstVisibleElement(locatorTextEquals);
    } else if (await this.getNumberOfElements(locatorValueEquals) > 0) {
      await this.clickOnFirstVisibleElement(locatorValueEquals);
    } else if (await this.getNumberOfElements(locatorTextContains) > 0) {
      await this.clickOnFirstVisibleElement(locatorTextContains);
    } else {
      expect(false, `Cannot find text [${text}]`).toBe(true);
    }
  }

  async waitSeconds(seconds) {
    await this.page.waitForTimeout(seconds * 1000);
  }

};