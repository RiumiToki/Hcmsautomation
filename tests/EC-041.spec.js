import { expect, test } from '@playwright/test';

// ✅ Reuse saved login session if available
test.use({ storageState: 'config/auth/session.json' });

test('Open "Pengaturan Golongan" and click Buat Baru', async ({ page }) => {
  // Go to dashboard (no need to login again)
  await page.goto('https://hcms-web-iso-fdua-ohc-hcms-dev.apps.ocp-dev.pegadaian.co.id/index');

  // Navigate: Employee → Manage Employee
  await page.getByRole('button', { name: /Employee/ }).click();
  await page.getByRole('link', { name: /Manage Employee/ }).click();

  // Wait for table to load
  await page.waitForSelector('text=TEGUH', { state: 'visible' });

  // Open employee details
  await page.getByRole('row', { name: /P11170.*TEGUH/ }).getByRole('button').nth(2).click();

  // Navigate to "Pengaturan Golongan"
  await page.getByRole('link', { name: /Pengaturan Golongan/ }).click();

  // Click "Buat baru"
  await page.getByRole('button', { name: 'Buat baru', exact: true }).click();

  // ✅ Verify modal opened
  await expect(page.getByText('Kategori saat ini :')).toBeVisible();
});
