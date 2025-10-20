import { expect, test } from '@playwright/test';

// ✅ Reuse saved login session if available
test.use({ storageState: 'config/auth/session.json' });

test('EC-050: Create New Contract (Teguh Wahyono)', async ({ page }) => {
  // --- 📅 Date setup (dd-MM-yyyy format) ---
  const today = new Date();
  const dd = String(today.getDate()).padStart(2, '0');
  const mm = String(today.getMonth() - 2).padStart(2, '0');
  const yyyy = today.getFullYear();
  const formattedDate = `${dd}/${mm}/${yyyy}`;

  // end date +30 days
  const endDate = new Date(today);
  endDate.setDate(endDate.getDate() + 30);
  const endDay = endDate.getDate();

  // Go to dashboard
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
  // Start Date = today
  await page.locator('#start_date').click();
  await page.locator(`#datepickers-container >> text=${today.getDate()}`).first().click();

  // Document Date = today
  await page.locator('#document_date').click();
  await page.locator(`#datepickers-container >> text=${today.getDate()}`).nth(3).click();

  // --- 📝 Fill Contract Info ---
  const randomNumber = Math.floor(Math.random() * 1000000).toString();
  const randomTitle = `QA Test ${formattedDate}`;
  const randomDesc = `Automation run on ${formattedDate}`;

  await page.locator('#contract_number').fill(randomNumber);
  await page.locator('#contract_title').fill(randomTitle);
  await page.locator('#document_desc').fill(randomDesc);

  // --- 💾 Save ---
  await page.getByRole('button', { name: /Simpan/ }).click();

  // --- ✅ Validation ---
  await expect(page.getByText(/Berhasil membuat contract/)).toBeVisible();
});
