
// Standarisasi Boilerplate Code
import { test, expect } from '@playwright/test';
import { ReportingApi } from '@reportportal/agent-js-playwright';

/** script berikut berfungsi untuk clear session.
 *  script ini harus dihapus disemua file,
 *  kecuali file untuk modul login dan register
 */
test.use({ storageState: { cookies: [], origins: [] } });

test('Login menggunakan kredensial valid', async ({ page, browserName }, testInfo) => {
  //baris ini berfungsi untuk menginputkan data scenario id yang ada di test case
  ReportingApi.setTestCaseId('TS-UI-LOGIN-001');
  //baris ini berfungsi untuk menginputkan data test step yang ada di test case
  ReportingApi.setDescription(`
      Test Step :
      1. Visit ke url OrangeHRM
      2. Login dengan username benar dan password benar
      3. User berhasil masuk ke menu utama
  `);
  ReportingApi.addAttributes([{ key: 'browser', value: browserName }]);
  await page.goto(process.env.WEB_URL);
  await page.getByRole('textbox', { name: 'Username' }).fill(process.env.USERNAME1);
  await page.getByRole('textbox', { name: 'Password' }).fill(process.env.PASSWORD1);
  await page.getByRole('button', { name: 'Login' }).click();
  await expect(page.getByRole('heading')).toContainText('Dashboard');

  const screenshot = await page.screenshot();
  await testInfo.attach("Screenshot", {
    body: screenshot,
    contentType: "image/png",
  });
});
