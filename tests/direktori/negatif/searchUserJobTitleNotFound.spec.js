//pake job title yang pertama kalo gaada yang kutak atik bakal kosong sesuain aja namanya skarang Account Assistant
import { expect, test } from '@playwright/test';
import { ReportingApi } from '@reportportal/agent-js-playwright';
import * as dotenv from 'dotenv';
dotenv.config();

const devTestData = require('../../../data/dev/dataDev.json');
const qaTestData = require('../../../data/qa/dataQa.json');

test.describe.configure({ mode: "serial" });

test.describe('@flow', () => {
  test('Gagal mencari user berdasarkan job title - tidak ditemukan', async ({ page, browserName }, testInfo) => {
    ReportingApi.setTestCaseId('TS-UI-DIR-001');

    ReportingApi.setDescription(`
      Test Step :
      1. Visit ke url OrangeHRM
      2. Klik menu Directory
      3. Pilih job title (yang tidak ada datanya)
      4. Klik tombol Search
      5. Validasi muncul pesan "No Records Found"
    `);

    ReportingApi.addAttributes([{ key: 'browser', value: browserName }]);

    const testData =
      process.env.ENV === 'qa'
        ? qaTestData.MENU_DIRECTORY.SEARCHJOBTITLEINVALID
        : devTestData.MENU_DIRECTORY.SEARCHJOBTITLEINVALID;

    if (!process.env.WEB_URL) {
      throw new Error('WEB_URL is not defined. Please define WEB_URL in .env or your environment.');
    }

    await page.goto(process.env.WEB_URL);
    await page.getByRole('link', { name: 'Directory' }).click();
    await page.locator('form i').first().click();
    await page.getByRole('option', { name: testData.jobTitle }).click();
    await page.getByRole('button', { name: 'Search' }).click();

    await expect(
      page.locator('div').filter({ hasText: /^No Records Found$/ }).nth(3)
    ).toBeVisible();

    const screenshot = await page.screenshot();
    await testInfo.attach("Screenshot", {
      body: screenshot,
      contentType: "image/png",
    });
  });
});
