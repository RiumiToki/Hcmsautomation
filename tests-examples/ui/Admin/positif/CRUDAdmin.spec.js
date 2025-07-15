
// Standarisasi Boilerplate Code
import { test, expect } from '@playwright/test';
import { ReportingApi } from '@reportportal/agent-js-playwright';

//baris ini berfungsi untuk menggunakan data testing
const devTestData = JSON.parse(JSON.stringify(require('../../../data/dev/dataDev.json')));
const dataDevAdd = devTestData.MENU_ADMIN.ADDUSERADMIN;
const dataDevUpdate = devTestData.MENU_ADMIN.UPDATEUSERADMIN;

const qaTestData = JSON.parse(JSON.stringify(require('../../../data/qa/dataQa.json')));
const dataQaAdd = qaTestData.MENU_ADMIN.ADDUSERADMIN;
const dataQaUpdate = qaTestData.MENU_ADMIN.UPDATEUSERADMIN;

//baris ini berfungsi agar test yang dijalankan berurutan
test.describe.configure({ mode: "serial" });

//baris ini berfungsi sebagai flagging bahwa test tersebut berdasarkan flow
test.describe('@flow', ()=>{
    test('Berhasil create account user admin', async ({ page, browserName }, testInfo) => {
        //baris ini berfungsi untuk menginputkan data scenario id yang ada di test case
        ReportingApi.setTestCaseId('TS-UI-ADMIN-001');
        //baris ini berfungsi untuk menginputkan data test step yang ada di test case
        ReportingApi.setDescription(`
            Test Step :
            1. Visit ke url OrangeHRM
            2. Klik menu Admin
            3. Klik button Add
            4. Input Kredensial
            5. Klik button Save
        `);
        ReportingApi.addAttributes([{ key: 'browser', value: browserName }]);
        let testData = dataDevAdd;
        if (process.env.ENV === 'qa') {
            testData = dataQaAdd;
        }
        await page.goto(process.env.WEB_URL);
        await page.getByRole('link', { name: 'Admin' }).click();
        await page.getByRole('button', { name: ' Add' }).click();
        await page.locator('form i').first().click();
        await page.getByRole('option', { name: testData.userrole }).click();
        await page.getByRole('textbox', { name: 'Type for hints...' }).fill(testData.employeename);
        await page.getByText(testData.employeename).click();
        await page.getByRole('textbox').nth(2).fill(testData.username);
        await page.locator('form i').nth(1).click();
        await page.getByRole('option', { name: testData.status }).click();
        await page.getByRole('textbox').nth(3).fill(testData.password);
        await page.getByRole('textbox').nth(4).fill(testData.password);
        await page.getByRole('button', { name: 'Save' }).click();
        await expect(page.locator('#oxd-toaster_1')).toContainText('Successfully Saved');

        const screenshot = await page.screenshot();
        await testInfo.attach("Screenshot", {
          body: screenshot,
          contentType: "image/png",
        });
      });

    test('Berhasil update account user admin', async ({ page, browserName }, testInfo) => {
    //baris ini berfungsi untuk menginputkan data scenario id yang ada di test case
    ReportingApi.setTestCaseId('TS-UI-ADMIN-002');
    //baris ini berfungsi untuk menginputkan data test step yang ada di test case
    ReportingApi.setDescription(`
        Test Step :
        1. Visit ke url OrangeHRM
        2. Klik menu Admin
        3. inputkan username yang akan di update
        4. Klik button search
        5. Klik icon pensil
        6. rubah data username
        7. klik button save
    `);
    ReportingApi.addAttributes([{ key: 'browser', value: browserName }]);
    let testData1 = dataDevUpdate;
    if (process.env.ENV === 'qa') {
        testData1 = dataQaUpdate;
    }
    await page.goto(process.env.WEB_URL);
    await page.getByRole('link', { name: 'Admin' }).click();
    await page.getByRole('row', { name: ' wawan Admin Peter Anderson' }).getByRole('button').nth(1).click();
    await page.getByRole('textbox').nth(2).fill(testData1.username);
    await page.getByRole('button', { name: 'Save' }).click();
    await expect(page.locator('#oxd-toaster_1')).toContainText('Successfully Updated');

    const screenshot = await page.screenshot();
    await testInfo.attach("Screenshot", {
      body: screenshot,
      contentType: "image/png",
    });
    });

    test('Berhasil delete account user admin', async ({ page, browserName }, testInfo) => {
        //baris ini berfungsi untuk menginputkan data scenario id yang ada di test case
        ReportingApi.setTestCaseId('TS-UI-ADMIN-003');
        //baris ini berfungsi untuk menginputkan data test step yang ada di test case
        ReportingApi.setDescription(`
            Test Step :
            1. Visit ke url OrangeHRM
            2. Klik menu Admin
            3. inputkan username yang akan di delete
            4. Klik button search
            5. Klik icon deletete
            7. klik button save
        `);
        ReportingApi.addAttributes([{ key: 'browser', value: browserName }]);
        await page.goto(process.env.WEB_URL);
        await page.getByRole('link', { name: 'Admin' }).click();
        await page.getByRole('row', { name: ' wawan Admin Peter Anderson' }).getByRole('button').first().click();
        await page.getByRole('button', { name: ' Yes, Delete' }).click();
        await expect(page.locator('#oxd-toaster_1')).toContainText('Successfully Deleted');

        const screenshot = await page.screenshot();
        await testInfo.attach("Screenshot", {
          body: screenshot,
          contentType: "image/png",
        });
    });
})
