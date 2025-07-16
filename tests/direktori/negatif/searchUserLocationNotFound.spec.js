//pake lokasi pertama liat diubah ga ama orang
// Standarisasi Boilerplate Code
import { expect, test } from '@playwright/test';
import { ReportingApi } from '@reportportal/agent-js-playwright';
import * as dotenv from 'dotenv';
dotenv.config();

// Load external test data
const devTestData = require('../../../data/dev/dataDev.json');
const qaTestData = require('../../../data/qa/dataQa.json');

// Ambil data berdasarkan ENV
const testData =
  process.env.ENV === 'qa'
    ? qaTestData.MENU_DIRECTORY.SEARCHLOCATIONINVALID
    : devTestData.MENU_DIRECTORY.SEARCHLOCATIONINVALID;

// Validasi ENV
if (!process.env.WEB_URL) {
  throw new Error('WEB_URL belum didefinisikan. Tambahkan di file .env');
}

// Serial agar test dijalankan urut
test.describe.configure({ mode: "serial" });

test.describe('@flow', () => {
  test('Gagal mencari user berdasarkan lokasi - tidak ditemukan', async ({ page, browserName }, testInfo) => {
    ReportingApi.setTestCaseId('TS-UI-DIR-002');

    ReportingApi.setDescription(`
      Test Step:
      1. Visit ke url OrangeHRM
      2. Klik menu Directory
      3. Pilih lokasi (yang tidak ada datanya)
      4. Klik tombol Search
      5. Validasi muncul pesan "No Records Found"
    `);

    ReportingApi.addAttributes([{ key: 'browser', value: browserName }]);

    await page.goto(process.env.WEB_URL);
    await page.getByRole('link', { name: 'Directory' }).click();
    await page.locator('form i').nth(1).click();
    await page.getByRole('option', { name: testData.location }).click();
    await page.getByRole('button', { name: 'Search' }).click();
    await expect(page.getByText('InfoNo Records Found×')).toBeVisible();

    const screenshot = await page.screenshot();
    await testInfo.attach("Screenshot", {
      body: screenshot,
      contentType: "image/png",
    });
  });
});
