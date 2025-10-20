import { expect, test } from '@playwright/test';

// ✅ Reuse saved login session if available
test.use({ storageState: 'config/auth/session.json' });

test('EC-050: Create New Contract (Teguh Wahyono)', async ({ page }) => {
  // Go to dashboard — no need to login again if session is valid
  await page.goto('https://hcms-web-iso-fdua-ohc-hcms-dev.apps.ocp-dev.pegadaian.co.id/index');

  // Navigate → Employee → Contract
  await page.getByRole('button', { name: /Employee/ }).click();
  await page.getByRole('link', { name: /Contract/ }).click();

  // Click “Buat baru”
  await page.getByRole('button', { name: /Buat baru/ }).click();

  // Select employee
  await page.getByRole('combobox').filter({ hasText: /^$/ }).click();
  await page.getByRole('treeitem', { name: /\[ P632511170 \] TEGUH WAHYONO/ }).click();

  // --- 📅 Set Dates ---
  // Start Date: pick day 1
  await page.locator('#start_date').click();
  await page.locator('#datepickers-container').getByText('1', { exact: true }).first().click();

  // Document Date: also day 1 (could randomize if needed)
  await page.locator('#document_date').click();
  await page.locator('#datepickers-container').getByText('1', { exact: true }).nth(3).click();

  // --- 📝 Fill Contract Info ---
  const randomNumber = Math.floor(Math.random() * 1000000).toString();
  const randomTitle = `QA Test ${Date.now()}`;
  const randomDesc = `Untuk test automation ${Math.random().toString(36).substring(2, 6)}`;

  await page.locator('#contract_number').fill(randomNumber);
  await page.locator('#contract_title').fill(randomTitle);
  await page.locator('#document_desc').fill(randomDesc);

  // --- 💾 Save ---
  await page.getByRole('button', { name: /Simpan/ }).click();

  // --- ✅ Validation ---
  await expect(page.getByText(/Berhasil membuat contract/)).toBeVisible();
});
