const { expect } = require('@playwright/test');

class InewsPage {
  /**
   * @param {import('@playwright/test').Page} page
   */
  constructor(page) {
    this.page = page;


    this.url = 'https://inews.co.uk/category/news/politics';

    this.consentModal = this.page.locator('.container_So1Sx.desktop_cj6jt.level1-0-0-2');
    this.acceptBtn = this.page.getByRole('button', { name: /accept|agree|i accept/i }).first();
  }

  async open() {
    await this.page.goto(this.url, { waitUntil: 'domcontentloaded' }); //Navigate to https://inews.co.uk/category/news/politics in a mobile Chrome browser from the UK region.
  }


  static _isGACollect(u) {
    const url = new URL(u);
    const hostOk =
      url.hostname.endsWith('google-analytics.com') ||
      url.hostname.endsWith('analytics.google.com');
    const pathOk = url.pathname.endsWith('/g/collect');
    return hostOk && pathOk;
  }

  async waitForPageView(timeout = 15000) {  //Inspect the network requests to locate a request to https://www.google-analytics.com/g/collect with the en query parameter set to page_view
    const req = await this.page.waitForRequest((req) => {
      try {
        const url = new URL(req.url());
        const hostOk =
          url.hostname.endsWith('google-analytics.com') ||
          url.hostname.endsWith('analytics.google.com');
        const pathOk = url.pathname.endsWith('/g/collect');
        if (!hostOk || !pathOk) return false;
        return url.searchParams.get('en') === 'page_view';
      } catch { return false; }
    }, { timeout });

    return new URL(req.url()).searchParams;
  }

  async waitForUserEngagement(timeout = 45000) {    //Inspect the subsequent network requests to locate a request to https://www.google-analytics.com/g/collect with the en query parameter set to user_engagement
    const req = await this.page.waitForRequest((req) => {
      try {
        const url = new URL(req.url());
        const captureUrl = (
          url.hostname.endsWith('google-analytics.com') ||
          url.hostname.endsWith('analytics.google.com')
        ) && url.pathname.endsWith('/g/collect');
        return captureUrl && url.searchParams.get('en') === 'user_engagement';
      } catch { return false; }
    }, { timeout });

    return new URL(req.url()).searchParams;
  }


  async acceptConsent() {     //Now click on the Accept button shown in the consent modal on page. Confirm that the modal is now removed from the DOM.
    if (await this.acceptBtn.isVisible().catch(() => false)) {
      await Promise.all([
        this.consentModal.first().waitFor({ state: 'detached', timeout: 15000 }),
        this.acceptBtn.click(),
      ]);
    }
  }


  async assertPreConsent(qp) {
    expect(qp.get('ep.sub_channel_1')).toBe('news/politics');
    expect(qp.get('gcs')).toBe('G101');
    expect(qp.get('npa')).toBe('1');
    expect(qp.get('dl')).toContain('/category/news/politics');
  }

  async assertPostConsent(qp) {
    expect(qp.get('gcs')).toBe('G111');
    const npa = qp.get('npa');
    expect(npa === '0' || npa === null).toBeTruthy();
    expect(qp.get('ep.sub_channel_1')).toBe('news/politics');
  }
}

module.exports = { InewsPage };
