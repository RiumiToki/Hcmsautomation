// Standarisasi Boilerplate Code
import { expect, test } from '@playwright/test';
import { ReportingApi } from '@reportportal/agent-js-playwright';
import * as dotenv from 'dotenv';
dotenv.config();

// Menjalankan test secara serial
test.describe.configure({ mode: 'serial' });

// Load data based on ENV
const devTestData = require('../../../data/dev/dataDev.json');
const qaTestData = require('../../../data/qa/dataQa.json');

test.describe('@flow', () => {
  test('Gagal menambahkan employee karena field wajib kosong', async ({ page, browserName }, testInfo) => {
    ReportingApi.setTestCaseId('TS-UI-PIM-001');

    ReportingApi.setDescription(`
      Test Step:
      1. Visit ke url OrangeHRM
      2. Klik menu PIM
      3. Klik tombol Add
      4. Isi First Name dan Middle Name saja
      5. Klik tombol Save
      6. Validasi muncul pesan Required
    `);

    ReportingApi.addAttributes([{ key: 'browser', value: browserName }]);

    const env = process.env.ENV || 'dev';
    const testData = env === 'qa'
      ? qaTestData.MENU_PIM.ADDEMPLOYEEFIELDREQUIRED
      : devTestData.MENU_PIM.ADDEMPLOYEEFIELDREQUIRED;

    const url = process.env.WEB_URL || 'https://opensource-demo.orangehrmlive.com/web/index.php/auth/login';

    await page.goto(url);
    await page.getByRole('link', { name: 'PIM' }).click();
    await page.getByRole('button', { name: ' Add' }).click();
    await page.getByRole('textbox', { name: 'First Name' }).fill(testData.firstname);
    await page.getByRole('textbox', { name: 'Middle Name' }).fill(testData.middlename);
    await page.getByRole('button', { name: 'Save' }).click();

    await expect(page.getByText('Required', { exact: true })).toBeVisible();

    const screenshot = await page.screenshot();
    await testInfo.attach('Screenshot', {
      body: screenshot,
      contentType: 'image/png'
    });
  });
});
