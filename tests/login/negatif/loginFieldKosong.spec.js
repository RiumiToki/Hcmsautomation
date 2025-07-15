// Standarisasi Boilerplate Code
import { expect, test } from '@playwright/test';
import { ReportingApi } from '@reportportal/agent-js-playwright';

// baris ini berfungsi untuk menggunakan data testing
const devTestData = JSON.parse(JSON.stringify(require('../../../data/dev/dataDev.json')));
const dataDev = devTestData.MENU_LOGIN.LOGINEMPTY;

const qaTestData = JSON.parse(JSON.stringify(require('../../../data/qa/dataQa.json')));
const dataQa = qaTestData.MENU_LOGIN.LOGINEMPTY;

/** script berikut berfungsi untuk clear session.
 *  script ini harus dihapus disemua file,
 *  kecuali file untuk modul login dan register
 */
test.use({ storageState: { cookies: [], origins: [] } });

test('Login menggunakan field kosong', async ({ page, browserName }, testInfo) => {
  ReportingApi.setTestCaseId('TS-UI-LOGIN-001');

  ReportingApi.setDescription(`
    Test Step :
    1. Visit ke url OrangeHRM
    2. Klik tombol Login tanpa mengisi username dan password
    3. Muncul pesan "Required" di field username dan password
  `);

  ReportingApi.addAttributes([{ key: 'browser', value: browserName }]);

  let testData = dataDev;
  if (process.env.ENV === 'qa') {
    testData = dataQa;
  }

  await page.goto(process.env.WEB_URL);
  await page.getByRole('button', { name: 'Login' }).click();
  await expect(page.getByText('Required').first()).toBeVisible();
  await expect(page.getByText('Required').nth(1)).toBeVisible();

  const screenshot = await page.screenshot();
  await testInfo.attach("Screenshot", {
    body: screenshot,
    contentType: "image/png",
  });
});
