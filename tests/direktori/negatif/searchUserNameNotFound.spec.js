// Standarisasi Boilerplate Code
import { expect, test } from '@playwright/test';
import { ReportingApi } from '@reportportal/agent-js-playwright';

// baris ini berfungsi untuk menggunakan data testing
const devTestData = JSON.parse(JSON.stringify(require('../../../data/dev/dataDev.json')));
const dataDev = devTestData.MENU_DIRECTORY.SEARCHNAMEINVALID;

const qaTestData = JSON.parse(JSON.stringify(require('../../../data/qa/dataQa.json')));
const dataQa = qaTestData.MENU_DIRECTORY.SEARCHNAMEINVALID;

// baris ini berfungsi agar test yang dijalankan berurutan
test.describe.configure({ mode: "serial" });

test.describe('@flow', () => {
  test('Gagal mencari user berdasarkan nama - data tidak ditemukan', async ({ page, browserName }, testInfo) => {
    ReportingApi.setTestCaseId('TS-UI-DIR-003');

    ReportingApi.setDescription(`
      Test Step :
      1. Visit ke url OrangeHRM
      2. Klik menu Directory
      3. Isi nama yang tidak terdaftar di sistem
      4. Klik tombol Search
      5. Validasi muncul pesan "Invalid"
    `);

    ReportingApi.addAttributes([{ key: 'browser', value: browserName }]);

    let testData = dataDev;
    if (process.env.ENV === 'qa') {
      testData = dataQa;
    }

    await page.goto(process.env.WEB_URL);
    await page.getByRole('link', { name: 'Directory' }).click();
    await page.getByRole('textbox', { name: 'Type for hints...' }).fill(testData.name);
    await page.getByRole('button', { name: 'Search' }).click();
    await expect(page.getByText('Invalid')).toBeVisible();

    const screenshot = await page.screenshot();
    await testInfo.attach("Screenshot", {
      body: screenshot,
      contentType: "image/png",
    });
  });
});
