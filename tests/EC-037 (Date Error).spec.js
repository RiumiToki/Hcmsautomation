import { expect, test } from '@playwright/test';

test.use({ storageState: 'config/auth/session.json' });

test('Employee → Manage Employee → Add Education Record (Randomized)', async ({ page }) => {
  // ✅ Step 1: Go to homepage
  await test.step('Navigate to homepage', async () => {
    await page.goto('https://hcms-web-iso-fdua-ohc-hcms-dev.apps.ocp-dev.pegadaian.co.id/index');
  });

  // ✅ Step 2: Login only if not already authenticated
  await test.step('Login if required', async () => {
    const loginBox = page.getByRole('textbox', { name: 'User code or email *' });
    if (await loginBox.isVisible()) {
      await loginBox.fill('Demoneuron');
      await page.getByRole('textbox', { name: 'Password *' }).fill('standar');
      await page.getByRole('button', { name: 'Login' }).click();
      await page.waitForURL('**/index');
    }
  });

  // ✅ Step 3: Navigate → Employee → Manage Employee
  await test.step('Open Manage Employee page', async () => {
    await page.getByRole('button', { name: /Employee/ }).click();
    await page.getByRole('link', { name: /Manage Employee/ }).click();
  });

  // ✅ Step 4: Open employee detail
  await test.step('Open employee detail', async () => {
    await page.getByRole('row', { name: /P11170.*TEGUH/ }).getByRole('button').nth(2).click();
  });

  // ✅ Step 5: Go to Rincian → Pendidikan Sekolah
  await test.step('Navigate to Pendidikan Sekolah tab', async () => {
    await page.getByRole('link', { name: /Rincian/ }).click();
    await page.getByRole('tab', { name: /Pendidikan sekolah/ }).click();
  });

  // ✅ Step 6: Add new education
  await test.step('Add new education record', async () => {
    await page.waitForSelector('#add-education-formal', { state: 'visible', timeout: 5000 });
    await page.locator('#add-education-formal').click();
  });

  // ✅ Step 7: Choose education level
  await test.step('Select education level', async () => {
    await page.getByRole('textbox', { name: /Choose education level/ }).click();
    await page.getByRole('option', { name: /Sekolah Dasar/ }).click();
  });

  // ✅ Step 8: Fill institution name
  const randomInstitution = `Sekolah Automation ${Math.random().toString(36).substring(2, 8).toUpperCase()}`;
  await test.step('Fill institution name', async () => {
    await page.getByRole('textbox', { name: /Institusi \*/ }).fill(randomInstitution);
  });

     // ✅ Step 9: Select start and end year
  // await test.step('Select start and end year', async () => {
  //   // Use your previous logic to get the current year
  //   const today = new Date();
  //   const yyyy = today.getFullYear();

  //   // Example: start year = current year - 5, end year = current year
  //   const startYear = yyyy - 5;
  //   const endYear = yyyy;

    // --- Tahun Masuk ---
    await page.locator('input[placeholder="Tahun masuk"]').click();
    await page.locator(`text=2021`).click();

    // --- Tahun Lulus ---
    await page.locator('input[placeholder="Tahun lulus"]').click();
    await page.locator(`text=2022`).click();
  // });



  // ✅ Step 10: Save and verify
  await test.step('Save and verify success message', async () => {
    await page.getByRole('button', { name: /Simpan/ }).click();
    await expect(page.getByText(/Berhasil menyimpan data/)).toBeVisible({ timeout: 5000 });
  });

  console.log(`✅ Added education record with institution: ${randomInstitution}`);
});
