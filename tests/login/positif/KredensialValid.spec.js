// Standarisasi Boilerplate Code
import { expect, test } from '@playwright/test';
import { ReportingApi } from '@reportportal/agent-js-playwright';

// baris ini berfungsi untuk menggunakan data testing
const devTestData = JSON.parse(JSON.stringify(require('../../../data/dev/dataDev.json')));
const dataDev = devTestData.MENU_LOGIN.LOGINKREDENSIALVALID;

const qaTestData = JSON.parse(JSON.stringify(require('../../../data/qa/dataQa.json')));
const dataQa = qaTestData.MENU_LOGIN.LOGINKREDENSIALVALID;

/** script berikut berfungsi untuk clear session.
 *  script ini harus dihapus disemua file,
 *  kecuali file untuk modul login dan register
 */
test.use({ storageState: { cookies: [], origins: [] } });

test('Login menggunakan kredensial valid', async ({ page, browserName }, testInfo) => {
  ReportingApi.setTestCaseId('TS-UI-LOGIN-003');

  ReportingApi.setDescription(`
    Test Step :
    1. Visit ke url OrangeHRM
    2. Isi username dan password yang valid
    3. Klik tombol Login
    4. Pengguna diarahkan ke halaman Dashboard
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
  await expect(page.getByRole('heading', { name: 'Dashboard' })).toBeVisible();

  const screenshot = await page.screenshot();
  await testInfo.attach("Screenshot", {
    body: screenshot,
    contentType: "image/png",
  });
});
