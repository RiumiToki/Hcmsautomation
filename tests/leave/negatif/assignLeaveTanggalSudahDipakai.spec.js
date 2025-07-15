// Standarisasi Boilerplate Code
import { expect, test } from '@playwright/test';
import { ReportingApi } from '@reportportal/agent-js-playwright';

// baris ini berfungsi untuk menggunakan data testing
const devTestData = JSON.parse(JSON.stringify(require('../../../data/dev/dataDev.json')));
const dataDev = devTestData.MENU_LEAVE.ASSIGNLEAVEFAILED;

const qaTestData = JSON.parse(JSON.stringify(require('../../../data/qa/dataQa.json')));
const dataQa = qaTestData.MENU_LEAVE.ASSIGNLEAVEFAILED;

// baris ini berfungsi agar test yang dijalankan berurutan
test.describe.configure({ mode: "serial" });

test.describe('@flow', () => {
  test('Gagal assign leave karena tanggal sudah diambil', async ({ page, browserName }, testInfo) => {
    ReportingApi.setTestCaseId('TS-UI-LEAVE-001');

    ReportingApi.setDescription(`
      Test Step :
      1. Visit ke url OrangeHRM
      2. Klik menu Assign Leave
      3. Pilih nama employee
      4. Pilih jenis cuti dan tanggal
      5. Tambahkan keterangan
      6. Klik tombol Assign
      7. Validasi muncul notifikasi gagal "Failed to Submit"
    `);

    ReportingApi.addAttributes([{ key: 'browser', value: browserName }]);

    let testData = dataDev;
    if (process.env.ENV === 'qa') {
      testData = dataQa;
    }

    await page.goto(process.env.WEB_URL);
    await page.locator('div').filter({ hasText: /^Assign Leave$/ }).first().click();
    await page.getByRole('textbox', { name: 'Type for hints...' }).click();
    await page.getByRole('textbox', { name: 'Type for hints...' }).fill(testData.employeeName);
    await page.getByRole('option', { name: testData.employeeOption }).click();
    await page.locator('form i').first().click();
    await page.getByRole('option', { name: testData.leaveType }).click();
    await page.locator('form i').nth(2).click();
    await page.getByText(testData.fromDate).click();
    await page.locator('form i').nth(3).click();
    await page.getByText(testData.toDate).click();
    await page.locator('textarea').fill(testData.comment);
    await page.getByRole('button', { name: 'Assign' }).click();
    await page.getByRole('button', { name: 'Ok' }).click();
    await expect(page.getByText('WarningFailed to Submit×')).toBeVisible();

    const screenshot = await page.screenshot();
    await testInfo.attach("Screenshot", {
      body: screenshot,
      contentType: "image/png",
    });
  });
});
