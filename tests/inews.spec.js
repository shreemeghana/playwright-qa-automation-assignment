const { test } = require('@playwright/test');
const { InewsPage } = require('../pages/inews.page');

test.describe('iNews Politics - GA Suite', () => {
  test('Verify GA "en" parameter changes from page_view to user_engagement with correct parameters', async ({ page }) => {
    const inews = new InewsPage(page);

    const prePromise = inews.waitForPageView(20000);
    await inews.open();
    const preQP = await prePromise;
    await inews.assertPreConsent(preQP);

    const postPromise = inews.waitForUserEngagement(45000);
    await inews.acceptConsent();
    const postQP = await postPromise;
    await inews.assertPostConsent(postQP);
  });
});
