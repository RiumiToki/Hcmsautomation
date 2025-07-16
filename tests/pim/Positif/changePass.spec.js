// Dont forget to adjust the name based on the 
// current name just first and like like albert n stein become albert stein
import { expect, test } from '@playwright/test';
import { ReportingApi } from '@reportportal/agent-js-playwright';
import * as dotenv from 'dotenv';
dotenv.config();

// Load external test data
const devTestData = require('../../../data/dev/dataDev.json');
const qaTestData = require('../../../data/qa/dataQa.json');

test.describe.configure({ mode: 'serial' });

test.describe('@flow', () => {
  test('Berhasil mengganti password user', async ({ page, browserName }, testInfo) => {
    ReportingApi.setTestCaseId('TS-UI-MYINFO-002');

    ReportingApi.setDescription(`
      Test Step:
      1. Visit ke url OrangeHRM
      2. Klik nama user (contoh: Joshua Craig)
      3. Klik menu Change Password
      4. Isi current password dan password baru yang valid
      5. Klik tombol Save
      6. Validasi muncul notifikasi "Successfully Saved"
    `);

    ReportingApi.addAttributes([{ key: 'browser', value: browserName }]);

    const env = process.env.ENV || 'dev';
    const testData =
      env === 'qa'
        ? qaTestData.MENU_PIM.CHANGEPASSWORDSUCCESS
        : devTestData.MENU_PIM.CHANGEPASSWORDSUCCESS;

    const url = process.env.WEB_URL || 'https://opensource-demo.orangehrmlive.com/web/index.php/dashboard/index';
    await page.goto(url);

    await page.getByRole('list').filter({ hasText: testData.username }).click();
    await page.getByRole('menuitem', { name: 'Change Password' }).click();

    await page.getByRole('textbox').nth(1).fill(testData.currentPassword);
    await page.getByRole('textbox').nth(2).fill(testData.newPassword);
    await page.getByRole('textbox').nth(3).fill(testData.confirmPassword);
    await page.getByRole('button', { name: 'Save' }).click();

    await expect(page.getByText('SuccessSuccessfully Saved×')).toBeVisible();

    const screenshot = await page.screenshot();
    await testInfo.attach('Screenshot', {
      body: screenshot,
      contentType: 'image/png'
    });
  });
});
