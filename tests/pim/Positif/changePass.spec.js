// Standarisasi Boilerplate Code
import { expect, test } from '@playwright/test';
import { ReportingApi } from '@reportportal/agent-js-playwright';

// baris ini berfungsi untuk menggunakan data testing
const devTestData = JSON.parse(JSON.stringify(require('../../../data/dev/dataDev.json')));
const dataDev = devTestData.MENU_MYINFO.CHANGEPASSWORDVALID;

const qaTestData = JSON.parse(JSON.stringify(require('../../../data/qa/dataQa.json')));
const dataQa = qaTestData.MENU_MYINFO.CHANGEPASSWORDVALID;

// baris ini berfungsi agar test yang dijalankan berurutan
test.describe.configure({ mode: "serial" });

test.describe('@flow', () => {
  test('Berhasil mengganti password user', async ({ page, browserName }, testInfo) => {
    ReportingApi.setTestCaseId('TS-UI-MYINFO-002');

    ReportingApi.setDescription(`
      Test Step :
      1. Visit ke url OrangeHRM
      2. Klik nama user (contoh: Joshua Craig)
      3. Klik menu Change Password
      4. Isi current password dan password baru yang valid
      5. Klik tombol Save
      6. Validasi muncul notifikasi "Successfully Saved"
    `);

    ReportingApi.addAttributes([{ key: 'browser', value: browserName }]);

    let testData = dataDev;
    if (process.env.ENV === 'qa') {
      testData = dataQa;
    }

    await page.goto(process.env.WEB_URL);
    await page.getByRole('list').filter({ hasText: testData.username }).click();
    await page.getByRole('menuitem', { name: 'Change Password' }).click();
    await page.getByRole('textbox').nth(1).fill(testData.currentPassword);
    await page.getByRole('textbox').nth(2).fill(testData.newPassword);
    await page.getByRole('textbox').nth(3).fill(testData.confirmPassword);
    await page.getByRole('button', { name: 'Save' }).click();
    await expect(page.getByText('SuccessSuccessfully Saved×')).toBeVisible();

    const screenshot = await page.screenshot();
    await testInfo.attach("Screenshot", {
      body: screenshot,
      contentType: "image/png",
    });
  });
});
