// Dont forget to adjust the name based on the 
// current name just first and like like albert n stein become albert stein
import { expect, test } from '@playwright/test';
import { ReportingApi } from '@reportportal/agent-js-playwright';
import * as dotenv from 'dotenv';
dotenv.config();

// Agar test berjalan berurutan
test.describe.configure({ mode: 'serial' });

// Load external data
const devTestData = require('../../../data/dev/dataDev.json');
const qaTestData = require('../../../data/qa/dataQa.json');

test.describe('@flow', () => {
  test('Gagal ganti password karena tidak memenuhi syarat keamanan', async ({ page, browserName }, testInfo) => {
    ReportingApi.setTestCaseId('TS-UI-MYINFO-001');

    ReportingApi.setDescription(`
      Test Step:
      1. Visit ke url OrangeHRM
      2. Klik nama user (contoh: Joshua Craig)
      3. Klik menu Change Password
      4. Isi current password dan password baru yang tidak sesuai kriteria
      5. Klik confirm
      6. Validasi pesan error "Your password must contain"
    `);

    ReportingApi.addAttributes([{ key: 'browser', value: browserName }]);

    const env = process.env.ENV || 'dev';
    const testData =
      env === 'qa'
        ? qaTestData.MENU_PIM.CHANGEPASSWORDFAILED
        : devTestData.MENU_PIM.CHANGEPASSWORDFAILED;

    const url = process.env.WEB_URL || 'https://opensource-demo.orangehrmlive.com/web/index.php/dashboard/index';
    await page.goto(url);

    await page.getByRole('list').filter({ hasText: testData.username }).click();
    await page.getByRole('menuitem', { name: 'Change Password' }).click();

    await page.getByRole('textbox').nth(1).fill(testData.currentPassword);
    await page.getByRole('textbox').nth(2).fill(testData.newPassword);
    await page.getByRole('textbox').nth(3).fill(testData.confirmPassword);

    await expect(page.getByText('Your password must contain')).toBeVisible();

    const screenshot = await page.screenshot();
    await testInfo.attach('Screenshot', {
      body: screenshot,
      contentType: 'image/png'
    });
  });
});
