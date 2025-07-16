//pake job title yang keempat cek aja dlu takutnya namanya diubah cek juga orangnya jadi ilang ato ad
import { expect, test } from '@playwright/test';
import { ReportingApi } from '@reportportal/agent-js-playwright';
import * as dotenv from 'dotenv';
dotenv.config();

// Ambil data berdasarkan ENV
const devTestData = JSON.parse(JSON.stringify(require('../../../data/dev/dataDev.json')));
const qaTestData = JSON.parse(JSON.stringify(require('../../../data/qa/dataQa.json')));

const env = process.env.ENV === 'qa' ? 'qa' : 'dev';
const testData = env === 'qa'
  ? qaTestData.MENU_DIRECTORY.SEARCHJOBTITLEVALID
  : devTestData.MENU_DIRECTORY.SEARCHJOBTITLEVALID;

// Validasi WEB_URL
if (!process.env.WEB_URL) {
  throw new Error('WEB_URL belum didefinisikan di file .env');
}

// Test jalan secara berurutan
test.describe.configure({ mode: "serial" });

test.describe('@flow', () => {
  test('Berhasil mencari user berdasarkan job title', async ({ page, browserName }, testInfo) => {
    ReportingApi.setTestCaseId('TS-UI-DIR-004');
    ReportingApi.setDescription(`
      Test Step:
      1. Visit ke url OrangeHRM
      2. Klik menu Directory
      3. Pilih job title: ${testData.jobTitle}
      4. Klik tombol Search
      5. Validasi hasil pencarian muncul: ${testData.expectedResult}
    `);
    ReportingApi.addAttributes([{ key: 'browser', value: browserName }]);

    await page.goto(process.env.WEB_URL);
    await page.getByRole('link', { name: 'Directory' }).click();

    // Buka dropdown dan pilih job title
    await page.locator('form i').first().click();
    await page.getByRole('option', { name: testData.jobTitle }).click();

    await page.getByRole('button', { name: 'Search' }).click();

    // Validasi hasil
    await expect(page.getByText(testData.expectedResult)).toBeVisible();

    const screenshot = await page.screenshot();
    await testInfo.attach("Screenshot", {
      body: screenshot,
      contentType: "image/png",
    });
  });
});
