import { expect, test } from '@playwright/test';
import { ReportingApi } from '@reportportal/agent-js-playwright';
import * as dotenv from 'dotenv';
dotenv.config();

// Load test data
const devTestData = JSON.parse(JSON.stringify(require('../../../data/dev/dataDev.json')));
const qaTestData = JSON.parse(JSON.stringify(require('../../../data/qa/dataQa.json')));

const env = process.env.ENV === 'qa' ? 'qa' : 'dev';
const testData = env === 'qa'
  ? qaTestData.MENU_DIRECTORY.SEARCHNAMEINVALID
  : devTestData.MENU_DIRECTORY.SEARCHNAMEINVALID;

// Validasi WEB_URL
if (!process.env.WEB_URL) {
  throw new Error('WEB_URL belum didefinisikan. Tambahkan di file .env');
}

// Jalankan test secara berurutan
test.describe.configure({ mode: "serial" });

test.describe('@flow', () => {
  test('Gagal mencari user berdasarkan nama - data tidak ditemukan', async ({ page, browserName }, testInfo) => {
    ReportingApi.setTestCaseId('TS-UI-DIR-003');

    ReportingApi.setDescription(`
      Test Step:
      1. Visit ke url OrangeHRM
      2. Klik menu Directory
      3. Isi nama yang tidak terdaftar di sistem: "${testData.name}"
      4. Klik tombol Search
      5. Validasi muncul pesan "Invalid" atau "No Records Found"
    `);

    ReportingApi.addAttributes([{ key: 'browser', value: browserName }]);

    await page.goto(process.env.WEB_URL);
    await page.getByRole('link', { name: 'Directory' }).click();

    // Isi nama dan beri delay kecil (simulasi delay internet / dropdown)
    const nameBox = page.getByRole('textbox', { name: 'Type for hints...' });
    await nameBox.fill(testData.name);
    await page.waitForTimeout(300); // delay kecil untuk jaga-jaga

    await page.getByRole('button', { name: 'Search' }).click();

    // Validasi muncul pesan invalid
    const invalidMessage = page.getByText('Invalid', { exact: false });
    await expect(invalidMessage).toBeVisible();

    const screenshot = await page.screenshot();
    await testInfo.attach("Screenshot", {
      body: screenshot,
      contentType: "image/png",
    });
  });
});
