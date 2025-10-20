import { expect, test } from '@playwright/test';

/**
 * EC-039: Edit Employee Category (Change End Date and Save)
 * ---------------------------------------------------------
 * ✅ Purpose:
 *    Validate that an existing Employee Category record can be edited,
 *    its end date changed, and saved successfully.
 *
 * ⚙️ Prerequisites:
 *    - Valid session must exist at: config/auth/session.json
 *    - Category data (e.g., "Grade 10") must be available in the table
 *    - Category should be manually switched Valid → Invalid → Valid before running
 *
 * 📋 Steps:
 *    1. Open dashboard using stored session
 *    2. Navigate to Konfigurasi → Employee → Category
 *    3. Apply filter (Valid → Invalid)
 *    4. Edit a record and set a new end date
 *    5. Save and verify success notification
 *
 * 🧪 Expected Result:
 *    Notification: “Berhasil menyimpan kategori” is visible.
 *
 * ⚠️ NOTE:
 *    This test is **skipped by default** because it requires manual
 *    category state changes before execution.
 *
 * 💡 To enable this test later:
 *    → Change `test.skip(` to `test(` below.
 */

// ✅ Reuse saved login session if available
test.use({ storageState: 'config/auth/session.json' });

// ⏸️ Skipped: requires manual pre-test category state change
test.skip('Edit Category (requires manual category change)', async ({ page }) => {

  // Go to dashboard (no need to login again)
  await page.goto('https://hcms-web-iso-fdua-ohc-hcms-dev.apps.ocp-dev.pegadaian.co.id/index');

  // Navigate: Konfigurasi → Employee → Category
  await page.getByRole('menuitem', { name: /Konfigurasi/ }).getByRole('button').click();
  await page.locator('#mnu_config_menu').getByRole('button', { name: /Employee/ }).click();
  await page.getByRole('link', { name: /Category/ }).click();

  // Wait until category list is fully loaded (ensure table data like "Grade 10" appears)
  await page.waitForSelector('text=Grade 10', { state: 'visible' });

  // Filter: Valid → Invalid
  await page.getByRole('link', { name: /Saring/ }).click();
  await page.getByRole('textbox', { name: /Valid/ }).click();
  await page.getByRole('option', { name: 'Invalid' }).click();
  await page.getByRole('button', { name: /Saring/ }).click();

  // Edit the fifth record (index 4)
  await page.getByRole('button', { name: // }).nth(4).click();

  // Change end date → 27 (last month or current month)
  await page.locator('#end_date').click();
  await page.getByText('27').nth(1).click();

  // Save changes
  await page.getByRole('button', { name: /Simpan/ }).click();

  // Validate success message
  await expect(page.getByText(/Berhasil menyimpan kategori/)).toBeVisible();
});
