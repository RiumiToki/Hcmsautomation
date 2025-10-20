import { expect, test } from '@playwright/test';

// ✅ Reuse saved session (no need to login every test)
test.use({ storageState: 'config/auth/session.json' });

test('Employee → Manage Employee → View Shift History', async ({ page }) => {
  // ✅ Always start from index page
  await page.goto('https://hcms-web-iso-fdua-ohc-hcms-dev.apps.ocp-dev.pegadaian.co.id/index');

  // Open Employee menu
  await page.getByRole('button', { name: /Employee/ }).click();

  // Navigate to Manage Employee
  await page.getByRole('link', { name: /Manage Employee/ }).click();

  // Open action menu for employee "TEGUH"
  await page.getByRole('row', { name: /TEGUH/ })
    .getByRole('button')
    .nth(2)
    .click();

  // Click "Rincian"
  await page.getByRole('link', { name: /Rincian/ }).click();

  // Go to Jadwal shift tab
  await page.getByRole('tab', { name: /Jadwal shift/ }).click();

  // Open Riwayat Shift
  await page.getByRole('link', { name: /Riwayat Shift/ }).click();

  // ✅ Verify page content
  await expect(page.locator('#tbl-history-shift')).toContainText('01 Jan 2023 - 27 Sep 2023');
});
