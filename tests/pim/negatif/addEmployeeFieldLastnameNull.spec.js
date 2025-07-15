// Standarisasi Boilerplate Code
import { expect, test } from '@playwright/test';
import { ReportingApi } from '@reportportal/agent-js-playwright';

// baris ini berfungsi untuk menggunakan data testing
const devTestData = JSON.parse(JSON.stringify(require('../../../data/dev/dataDev.json')));
const dataDev = devTestData.MENU_PIM.ADDEMPLOYEEEMPTY;

const qaTestData = JSON.parse(JSON.stringify(require('../../../data/qa/dataQa.json')));
const dataQa = qaTestData.MENU_PIM.ADDEMPLOYEEEMPTY;

// baris ini berfungsi agar test yang dijalankan berurutan
test.describe.configure({ mode: "serial" });

test.describe('@flow', () => {
  test('Gagal menambahkan employee karena field wajib kosong', async ({ page, browserName }, testInfo) => {
    ReportingApi.setTestCaseId('TS-UI-PIM-001');

    ReportingApi.setDescription(`
      Test Step :
      1. Visit ke url OrangeHRM
      2. Klik menu PIM
      3. Klik tombol Add
      4. Isi First Name dan Middle Name saja
      5. Klik tombol Save
      6. Validasi muncul pesan Required
    `);

    ReportingApi.addAttributes([{ key: 'browser', value: browserName }]);

    let testData = dataDev;
    if (process.env.ENV === 'qa') {
      testData = dataQa;
    }

    await page.goto(process.env.WEB_URL);
    await page.getByRole('link', { name: 'PIM' }).click();
    await page.getByRole('button', { name: ' Add' }).click();
    await page.getByRole('textbox', { name: 'First Name' }).fill(testData.firstname);
    await page.getByRole('textbox', { name: 'Middle Name' }).fill(testData.middlename);
    await page.getByRole('button', { name: 'Save' }).click();
    await expect(page.getByText('Required', { exact: true })).toBeVisible();

    const screenshot = await page.screenshot();
    await testInfo.attach("Screenshot", {
      body: screenshot,
      contentType: "image/png",
    });
  });
});
