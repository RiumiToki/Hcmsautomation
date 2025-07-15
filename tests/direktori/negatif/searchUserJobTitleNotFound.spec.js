// Standarisasi Boilerplate Code
import { expect, test } from '@playwright/test';
import { ReportingApi } from '@reportportal/agent-js-playwright';

// baris ini berfungsi untuk menggunakan data testing
const devTestData = JSON.parse(JSON.stringify(require('../../../data/dev/dataDev.json')));
const dataDev = devTestData.MENU_DIRECTORY.SEARCHJOBTITLEINVALID;

const qaTestData = JSON.parse(JSON.stringify(require('../../../data/qa/dataQa.json')));
const dataQa = qaTestData.MENU_DIRECTORY.SEARCHJOBTITLEINVALID;

// baris ini berfungsi agar test yang dijalankan berurutan
test.describe.configure({ mode: "serial" });

test.describe('@flow', () => {
  test('Gagal mencari user berdasarkan job title - tidak ditemukan', async ({ page, browserName }, testInfo) => {
    ReportingApi.setTestCaseId('TS-UI-DIR-001');

    ReportingApi.setDescription(`
      Test Step :
      1. Visit ke url OrangeHRM
      2. Klik menu Directory
      3. Pilih job title (yang tidak ada datanya)
      4. Klik tombol Search
      5. Validasi muncul pesan "No Records Found"
    `);

    ReportingApi.addAttributes([{ key: 'browser', value: browserName }]);

    let testData = dataDev;
    if (process.env.ENV === 'qa') {
      testData = dataQa;
    }

    await page.goto(process.env.WEB_URL);
    await page.getByRole('link', { name: 'Directory' }).click();
    await page.locator('form i').first().click();
    await page.getByRole('option', { name: testData.jobTitle }).click();
    await page.getByRole('button', { name: 'Search' }).click();
    await expect(page.locator('div').filter({ hasText: /^No Records Found$/ }).nth(3)).toBeVisible();

    const screenshot = await page.screenshot();
    await testInfo.attach("Screenshot", {
      body: screenshot,
      contentType: "image/png",
    });
  });
});
