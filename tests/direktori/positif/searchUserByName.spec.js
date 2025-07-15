// Standarisasi Boilerplate Code
import { expect, test } from '@playwright/test';
import { ReportingApi } from '@reportportal/agent-js-playwright';

// baris ini berfungsi untuk menggunakan data testing
const devTestData = JSON.parse(JSON.stringify(require('../../../data/dev/dataDev.json')));
const dataDev = devTestData.MENU_DIRECTORY.SEARCHNAMEVALID;

const qaTestData = JSON.parse(JSON.stringify(require('../../../data/qa/dataQa.json')));
const dataQa = qaTestData.MENU_DIRECTORY.SEARCHNAMEVALID;

// baris ini berfungsi agar test yang dijalankan berurutan
test.describe.configure({ mode: "serial" });

test.describe('@flow', () => {
  test('Berhasil mencari user berdasarkan nama', async ({ page, browserName }, testInfo) => {
    ReportingApi.setTestCaseId('TS-UI-DIR-006');

    ReportingApi.setDescription(`
      Test Step :
      1. Visit ke url OrangeHRM
      2. Klik menu Directory
      3. Masukkan nama lengkap user
      4. Pilih nama dari dropdown
      5. Klik tombol Search
      6. Validasi data user ditampilkan (nama, jabatan, departemen, lokasi)
    `);

    ReportingApi.addAttributes([{ key: 'browser', value: browserName }]);

    let testData = dataDev;
    if (process.env.ENV === 'qa') {
      testData = dataQa;
    }

    await page.goto(process.env.WEB_URL);
    await page.getByRole('link', { name: 'Directory' }).click();
    await page.getByRole('textbox', { name: 'Type for hints...' }).click();
    await page.getByRole('textbox', { name: 'Type for hints...' }).fill(testData.nameInput);
    await page.getByRole('option', { name: testData.nameDropdown }).click();
    await page.getByRole('button', { name: 'Search' }).click();
    await expect(page.getByText(testData.expectedResult, { exact: true })).toBeVisible();

    const screenshot = await page.screenshot();
    await testInfo.attach("Screenshot", {
      body: screenshot,
      contentType: "image/png",
    });
  });
});
