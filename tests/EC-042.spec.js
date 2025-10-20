import { expect, test } from '@playwright/test';

// ✅ Reuse saved login session if available
test.use({ storageState: 'config/auth/session.json' });

test('View Pengaturan Golongan page for selected employee', async ({ page }) => {
  // Go to dashboard (skip login if session exists)
  await page.goto('https://hcms-web-iso-fdua-ohc-hcms-dev.apps.ocp-dev.pegadaian.co.id/index');

  // Open Employee → Manage Employee
  await page.getByRole('button', { name: /Employee/ }).click();
  await page.getByRole('link', { name: /Manage Employee/ }).click();

  // Wait for employee table to load
  await page.waitForSelector('text=TEGUH', { state: 'visible' });

  // Open employee details
  await page
    .getByRole('row', { name: /P11170.*TEGUH/ })
    .getByRole('button')
    .nth(2)
    .click(); 

  // Navigate to "Pengaturan Golongan"
  await page.getByRole('link', { name: /Pengaturan Golongan/ }).click();

  // ✅ Verify that the page loaded successfully
  await page.getByRole('button', { name: 'Buat baru', exact: true }).click();
  await expect(page.getByText('Kategori saat ini :')).toBeVisible();
});
