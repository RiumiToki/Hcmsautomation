// Standarisasi Boilerplate Code
import { expect, test } from '@playwright/test';
import { ReportingApi } from '@reportportal/agent-js-playwright';

// baris ini berfungsi untuk menggunakan data testing
const devTestData = JSON.parse(JSON.stringify(require('../../../data/dev/dataDev.json')));
const dataDev = devTestData.MENU_DIRECTORY.SEARCHLOCATIONVALID;

const qaTestData = JSON.parse(JSON.stringify(require('../../../data/qa/dataQa.json')));
const dataQa = qaTestData.MENU_DIRECTORY.SEARCHLOCATIONVALID;

// baris ini berfungsi agar test yang dijalankan berurutan
test.describe.configure({ mode: "serial" });

test.describe('@flow', () => {
  test('Berhasil mencari user berdasarkan lokasi', async ({ page, browserName }, testInfo) => {
    ReportingApi.setTestCaseId('TS-UI-DIR-005');

    ReportingApi.setDescription(`
      Test Step :
      1. Visit ke url OrangeHRM
      2. Klik menu Directory
      3. Pilih lokasi: New York Sales Office
      4. Klik tombol Search
      5. Validasi hasil pencarian muncul (contoh: Peter Mac Anderson, Sania Shaheen)
    `);

    ReportingApi.addAttributes([{ key: 'browser', value: browserName }]);

    let testData = dataDev;
    if (process.env.ENV === 'qa') {
      testData = dataQa;
    }

    await page.goto(process.env.WEB_URL);
    await page.getByRole('link', { name: 'Directory' }).click();
    await page.locator('form i').nth(1).click();
    await page.getByRole('option', { name: testData.location }).click();
    await page.getByRole('button', { name: 'Search' }).click();

    for (const name of testData.expectedResults) {
      await expect(page.getByText(name)).toBeVisible();
    }

    const screenshot = await page.screenshot();
    await testInfo.attach("Screenshot", {
      body: screenshot,
      contentType: "image/png",
    });
  });
});
