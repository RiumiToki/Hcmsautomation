import { expect, test } from '@playwright/test';

// ✅ Reuse the storage state saved by globalSetup.js
test.use({ storageState: 'config/auth/session.json' });

test('Employee → Manage Employee → Rincian → Kelola Kontak', async ({ page }) => {
  // Already logged in because of storageState
  await page.goto('https://hcms-web-iso-fdua-ohc-hcms-dev.apps.ocp-dev.pegadaian.co.id/index');

  // Open Employee menu
  await page.getByRole('button', { name: /Employee/ }).click();

  // Go to Manage Employee
  await page.getByRole('link', { name: /Manage Employee/ }).click();

  // Open actions on employee row (TEGUH)
  await page.getByRole('row', { name: /P11170 \(P632511170\) TEGUH/ })
    .getByRole('button')
    .nth(2)
    .click();

  // Click "Rincian"
  await page.getByRole('link', { name: /Rincian/ }).click();

  // Switch to "Kelola Kontak anda" tab
  await page.getByRole('tab', { name: /Kelola Kontak anda/ }).click();

  // Verify the card content is visible
  await expect(page.locator('.card.h-100 > div')).toBeVisible();
});
