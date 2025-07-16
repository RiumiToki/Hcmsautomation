//Sesuaikan tanggal cari tanggal yang belum diambil dan juga sesuaikan nama employee contoh albert n stein
//menjadi nama user sekarang
import { expect, test } from '@playwright/test';
import { ReportingApi } from '@reportportal/agent-js-playwright';
import * as dotenv from 'dotenv';
dotenv.config();

const devTestData = require('../../../data/dev/dataDev.json');
const qaTestData = require('../../../data/qa/dataQa.json');

test.describe.configure({ mode: 'serial' });

test.describe('@flow', () => {
  test('Berhasil assign leave untuk employee', async ({ page, browserName }, testInfo) => {
    ReportingApi.setTestCaseId('TS-UI-LEAVE-002');

    ReportingApi.setDescription(`
      Test Step:
      1. Visit ke url OrangeHRM
      2. Klik menu Assign Leave
      3. Isi employee name, leave type, tanggal from dan to, serta comment
      4. Klik tombol Assign dan klik Ok
      5. Validasi muncul notifikasi "Successfully Saved"
    `);

    ReportingApi.addAttributes([{ key: 'browser', value: browserName }]);

    const env = process.env.ENV === 'qa' ? 'qa' : 'dev';
    const testData =
      env === 'qa'
        ? qaTestData.MENU_LEAVE.ASSIGNLEAVESUCCESS
        : devTestData.MENU_LEAVE.ASSIGNLEAVESUCCESS;

    if (!process.env.WEB_URL) {
      throw new Error('WEB_URL is not defined. Set it in .env file or environment variable.');
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

    await expect(page.getByText('SuccessSuccessfully Saved×')).toBeVisible();

    const screenshot = await page.screenshot();
    await testInfo.attach('Screenshot', {
      body: screenshot,
      contentType: 'image/png'
    });
  });
});
