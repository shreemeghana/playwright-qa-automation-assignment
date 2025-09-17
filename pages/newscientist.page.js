const { expect } = require('@playwright/test');

class NewScientistPage {
  /**
   * @param {import('@playwright/test').Page} page
   */
  constructor(page) {
    this.page = page;
    this.url = 'https://www.newscientist.com/';
    this.html = this.page.locator('html');
    this.consentModal = this.page.locator('.container_riSbm.desktop_NCa1E.level1-0-0-2'); 
    this.consentBtn = this.page.getByRole('button', { name: /Got it/i }).first();         
    this.appearanceToggle = this.page.locator('#appearance-toggle');
  }

  async open(waitUntil = 'load') {
    await this.page.goto(this.url, { waitUntil });
  }

  async expectDark() {          //Confirm that the <html> element has a class Dark added to it after the load event. 
    await expect(this.html).toHaveClass(/(^|\s)Dark(\s|$)/);
    const getColorScheme = await this.page.evaluate(() => localStorage.getItem('colourSchemeAppearance'));    //Confirm that a local storage key of colourSchemeAppearance has been set with a value of Dark
    expect(getColorScheme).toBe('Dark');
  }

  async dismissConsent() {
    await this.consentBtn.waitFor({ state: 'visible', timeout: 15000 });
    await Promise.all([
      this.consentModal.first().waitFor({ state: 'detached', timeout: 15000 }),   //Confirm that the modal is now removed from the DOM.
      this.consentBtn.click(),    //Click on the Got It button shown in the consent modal on page.
    ]);
  }

  async toggleToLightAndAssert() {
    await this.appearanceToggle.click();    //Locate the Appearance toggle (#appearance-toggle) and click it to force the theme to Light
    await expect(this.html).toHaveClass(/(^|\s)Light(\s|$)/);
    const getColorSchemeLight = await this.page.evaluate(() => localStorage.getItem('colourSchemeAppearance'));
    expect(getColorSchemeLight).toBe('Light');    //Confirm that the <html> element has now had a class of Light added to it and the Dark classname has been removed.
    await expect(this.html).not.toHaveClass(/(^|\s)Dark(\s|$)/);  //Confirm that the local storage key of colourSchemeAppearance has been updated with a value of Light
  }

  async reloadAndExpectLight() {      //Refresh the page, and confirm that the colour scheme override is working by confirming that the <html> element has a class of Light added to it after the load event.
    await this.page.reload({ waitUntil: 'load' });
    await expect(this.page.locator('html')).toHaveClass(/(^|\s)Light(\s|$)/);
  }
}

module.exports = { NewScientistPage };
