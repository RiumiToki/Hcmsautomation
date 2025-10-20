import { expect, test } from '@playwright/test';

// ✅ Reuse saved login session if available
test.use({ storageState: 'config/auth/session.json' });

test('Open Employee Details → Personal Information Tab', async ({ page }) => {
  // Go to dashboard (no need to login again)
  await page.goto('https://hcms-web-iso-fdua-ohc-hcms-dev.apps.ocp-dev.pegadaian.co.id/index');

  // Navigate: Employee → Manage Employee
  await page.getByRole('button', { name: /Employee/ }).click();
  await page.getByRole('link', { name: /Manage Employee/ }).click();

  // Wait for Manage Employee page to load
  await page.waitForURL('**/addon/employee/pegadaian/index/manage');
  await page.waitForSelector('text=TEGUH', { state: 'visible' });

  // Open Rincian for specific employee
  await page.getByRole('row', { name: /P11170.*TEGUH/ }).getByRole('button').nth(2).click();

  // Click “Rincian”
  await page.getByRole('link', { name: /Rincian/ }).click();

  // Switch to “Informasi Pribadi” tab
  await page.getByRole('tab', { name: /Informasi Pribadi/ }).click();

  // Validate card content is visible
  await expect(page.locator('.card.h-100 > div')).toBeVisible();
});
