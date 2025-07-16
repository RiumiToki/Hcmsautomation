import { expect, test } from '@playwright/test';
import { ReportingApi } from '@reportportal/agent-js-playwright';
import * as dotenv from 'dotenv';
dotenv.config();

// Load test data
const devTestData = JSON.parse(JSON.stringify(require('../../../data/dev/dataDev.json')));
const qaTestData = JSON.parse(JSON.stringify(require('../../../data/qa/dataQa.json')));

const env = process.env.ENV === 'qa' ? 'qa' : 'dev';
const testData = env === 'qa'
  ? qaTestData.MENU_DIRECTORY.SEARCHNAMEVALID
  : devTestData.MENU_DIRECTORY.SEARCHNAMEVALID;

if (!process.env.WEB_URL) {
  throw new Error('WEB_URL belum didefinisikan di file .env');
}

// Jalankan test secara berurutan
test.describe.configure({ mode: "serial" });

test.describe('@flow', () => {
  test('Berhasil mencari user berdasarkan nama', async ({ page, browserName }, testInfo) => {
    ReportingApi.setTestCaseId('TS-UI-DIR-006');

    ReportingApi.setDescription(`
      Test Step:
      1. Visit ke url OrangeHRM
      2. Klik menu Directory
      3. Masukkan nama: ${testData.nameInput}
      4. Pilih dari dropdown: ${testData.nameDropdown}
      5. Klik tombol Search
      6. Validasi hasil pencarian: ${testData.expectedResult}
    `);

    ReportingApi.addAttributes([{ key: 'browser', value: browserName }]);

    await page.goto(process.env.WEB_URL);
    await page.getByRole('link', { name: 'Directory' }).click();

    // Isi kolom nama dan tunggu dropdown
    const nameBox = page.getByRole('textbox', { name: 'Type for hints...' });
    await nameBox.fill(testData.nameInput);

    // Tunggu dropdown muncul
    // Tunggu dropdown muncul (maks 5 detik)
const dropdownOption = page.getByRole('option', { name: testData.nameDropdown });

try {
  await dropdownOption.waitFor({ timeout: 5000 });
  await dropdownOption.click();
} catch (e) {
  console.warn(`⚠️ Dropdown "${testData.nameDropdown}" tidak muncul dalam 5 detik. Gunakan input default.`);
  await nameBox.press('Enter'); // fallback jika dropdown gagal muncul
}


    await page.getByRole('button', { name: 'Search' }).click();

    await expect(page.getByText(testData.expectedResult, { exact: true })).toBeVisible();

    const screenshot = await page.screenshot();
    await testInfo.attach("Screenshot", {
      body: screenshot,
      contentType: "image/png",
    });
  });
});
