const { test } = require('@playwright/test');
const { NewScientistPage } = require('../pages/newscientist.page');

test.describe('New Scientist Page - Web Suite', () => {
  test('Verify Dark mode is active on initial page load', async ({ page }) => {
    const ns = new NewScientistPage(page);
    await ns.open('load');
    await ns.expectDark();
  });

  test('Verify consent modal is dismissed after clicking "Got it"', async ({ page }) => {
    const ns = new NewScientistPage(page);
    await ns.open('load');
    await ns.dismissConsent();
  });

  test('Verify theme changes from Dark to Light and persists after page reload', async ({ page }) => {
    const ns = new NewScientistPage(page);
    await ns.open('load');
    await ns.expectDark();
    await ns.dismissConsent();
    await ns.toggleToLightAndAssert();
    await ns.reloadAndExpectLight();
  });
});
