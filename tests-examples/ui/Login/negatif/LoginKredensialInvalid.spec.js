
// Standarisasi Boilerplate Code
import { test, expect } from '@playwright/test';
import { ReportingApi } from '@reportportal/agent-js-playwright';

//baris ini berfungsi untuk menggunakan data testing
const devTestData = JSON.parse(JSON.stringify(require('../../../data/dev/dataDev.json')));
const dataDev = devTestData.MENU_LOGIN.LOGINPASSWORDINVALID;
const qaTestData = JSON.parse(JSON.stringify(require('../../../data/qa/dataQa.json')));
const dataQa = qaTestData.MENU_LOGIN.LOGINPASSWORDINVALID;

/** script berikut berfungsi untuk clear session.
 *  script ini harus dihapus disemua file,
 *  kecuali file untuk modul login dan register
 */
test.use({ storageState: { cookies: [], origins: [] } });

test('Login menggunakan kredensial invalid', async ({ page, browserName }, testInfo) => {
  //baris ini berfungsi untuk menginputkan data scenario id yang ada di test case
  ReportingApi.setTestCaseId('TS-UI-LOGIN-002');
  //baris ini berfungsi untuk menginputkan data test step yang ada di test case
  ReportingApi.setDescription(`
      Test Step :
      1. Visit ke url OrangeHRM
      2. Login dengan username benar dan password salah
      3. Menampilkan pesan Pengguna atau kata sandi tidak cocok
  `);
  ReportingApi.addAttributes([{ key: 'browser', value: browserName }]);
  let testData = dataDev;
  if (process.env.ENV === 'qa') {
      testData = dataQa;
  }
  await page.goto(process.env.WEB_URL);
  await page.getByRole('textbox', { name: 'Username' }).fill(testData.username);
  await page.getByRole('textbox', { name: 'Password' }).fill(testData.password);
  await page.getByRole('button', { name: 'Login' }).click();
  await expect(page.getByRole('alert')).toContainText('Invalid credentials');
  
  const screenshot = await page.screenshot();
  await testInfo.attach("Screenshot", {
    body: screenshot,
    contentType: "image/png",
  });
});
