import { expect, test } from '@playwright/test';

// ✅ Reuse saved login session if available
test.use({ storageState: 'config/auth/session.json' });

test('Employee → Manage Employee → Add Education Record (Randomized)', async ({ page }) => {
  // ✅ Step 1: Go to homepage
  await page.goto('https://hcms-web-iso-fdua-ohc-hcms-dev.apps.ocp-dev.pegadaian.co.id/index');

  // ✅ Step 2: Log in only if session isn’t loaded
  if (await page.getByRole('textbox', { name: 'User code or email *' }).isVisible()) {
    await page.getByRole('textbox', { name: 'User code or email *' }).fill('Demoneuron');
    await page.getByRole('textbox', { name: 'Password *' }).fill('standar');
    await page.getByRole('button', { name: 'Login' }).click();
    await page.waitForURL('**/index');
  }

  // ✅ Step 3: Navigate to Manage Employee
  await page.getByRole('button', { name: /Employee/ }).click();
  await page.getByRole('link', { name: /Manage Employee/ }).click();

  // ✅ Step 4: Select employee row
  await page
    .getByRole('row', { name: /P11170.*TEGUH/ })
    .getByRole('button')
    .nth(2)
    .click();

  // ✅ Step 5: Go to “Rincian” tab
  await page.getByRole('link', { name: /Rincian/ }).click();

  // ✅ Step 6: Go to “Pendidikan Sekolah” tab
  await page.getByRole('tab', { name: /Pendidikan sekolah/ }).click();

  // ✅ Step 7: Click the "Tambah Data" button under "Pendidikan Formal"
  await page.waitForTimeout(4000);
  await page.locator('#add-education-formal').click();

  // Select education level
  await page.getByRole('textbox', { name: /Choose education level/ }).click();
  await page.getByRole('option', { name: /Sekolah Dasar/ }).click();

  // ✅ Step 8: Randomize institution name
  const randomInstitution = `Sekolah Automation ${Math.random().toString(36).substring(2, 8).toUpperCase()}`;
  await page.getByRole('textbox', { name: /Institusi \*/ }).fill(randomInstitution);

  // ✅ Step 9: Select start–end period
  // ✅ Step 9: Select start–end period (robust against flatpickr or manual year pickers)

// Click "Tahun masuk" field
await page.locator('input[placeholder="Tahun masuk"]').click({ force: true });
await page.waitForTimeout(500);

// Pick year from the visible popup (choose any year you want)
await page.getByText('2011', { exact: true }).click();
await page.waitForTimeout(500);

// Click "Tahun lulus" field
await page.locator('input[placeholder="Tahun lulus"]').click({ force: true });
await page.waitForTimeout(500);

// Pick the graduation year
await page.getByText('2015', { exact: true }).click();
await page.waitForTimeout(500);

  // ✅ Step 10: Save and verify
  await page.getByRole('button', { name: /Simpan/ }).click();
  await expect(page.getByText(/Berhasil menyimpan data/)).toBeVisible();

  // ✅ Log to console for trace
  console.log(`✅ Added education record with institution: ${randomInstitution}`);
});


