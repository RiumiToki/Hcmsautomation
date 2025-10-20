import { expect, test } from '@playwright/test';

// ✅ Reuse saved login session
test.use({ storageState: 'config/auth/session.json' });

test('Manage Employee → Edit dates modal appears', async ({ page }) => {
  // ✅ Always start from index page
  await page.goto('https://hcms-web-iso-fdua-ohc-hcms-dev.apps.ocp-dev.pegadaian.co.id/index');

  // Open Employee menu
  await page.getByRole('button', { name: /Employee/ }).click();

  // Go to Manage Employee
  await page.getByRole('link', { name: /Manage Employee/ }).click();

  // Click the first edit () button
  await page.getByRole('button', { name: '' }).first().click();

  // ✅ Verify form fields are visible
  await expect(page.getByRole('textbox', { name: 'Tanggal Bergabung' })).toBeVisible();
  await expect(page.getByRole('textbox', { name: 'Tanggal Berakhir' })).toBeVisible();
});
