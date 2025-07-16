// pake lokasi ke 3 lihat diubah ga ama orang
import { expect, test } from '@playwright/test';
import { ReportingApi } from '@reportportal/agent-js-playwright';
import * as dotenv from 'dotenv';
dotenv.config();

// Load test data
const devTestData = JSON.parse(JSON.stringify(require('../../../data/dev/dataDev.json')));
const qaTestData = JSON.parse(JSON.stringify(require('../../../data/qa/dataQa.json')));

// Pilih berdasarkan ENV
const env = process.env.ENV === 'qa' ? 'qa' : 'dev';
const testData = env === 'qa'
  ? qaTestData.MENU_DIRECTORY.SEARCHLOCATIONVALID
  : devTestData.MENU_DIRECTORY.SEARCHLOCATIONVALID;

// Validasi WEB_URL
if (!process.env.WEB_URL) {
  throw new Error('WEB_URL belum didefinisikan di file .env');
}

// Jalankan test secara berurutan
test.describe.configure({ mode: "serial" });

test.describe('@flow', () => {
  test('Berhasil mencari user berdasarkan lokasi', async ({ page, browserName }, testInfo) => {
    ReportingApi.setTestCaseId('TS-UI-DIR-005');
    ReportingApi.setDescription(`
      Test Step:
      1. Visit ke url OrangeHRM
      2. Klik menu Directory
      3. Pilih lokasi: ${testData.location}
      4. Klik tombol Search
      5. Validasi hasil pencarian muncul:
         ${testData.expectedResults.join(', ')}
    `);
    ReportingApi.addAttributes([{ key: 'browser', value: browserName }]);

    await page.goto(process.env.WEB_URL);
    await page.getByRole('link', { name: 'Directory' }).click();

    // Lokasi dropdown biasanya di index ke-1 (kedua)
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
