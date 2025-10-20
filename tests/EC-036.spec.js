import { expect, test } from '@playwright/test';

// ✅ Reuse saved login session
test.use({ storageState: 'config/auth/session.json' });

test('Reporting → Attendance → Dashboard HR → Download Report', async ({ page }) => {
  // Always start from index page
  await page.goto('https://hcms-web-iso-fdua-ohc-hcms-dev.apps.ocp-dev.pegadaian.co.id/index');

  // Open Reporting → Attendance → Dashboard Attendance HR
  await page.getByRole('button', { name: /Reporting/ }).click();
  await page.locator('#mnu_reporting').getByRole('button', { name: /Attendance/ }).click();
  await page.getByRole('link', { name: /Dashboard Attendance HR/ }).click();

  // Wait until the dashboard page loads completely
  await expect(page.getByRole('heading', { name: /Dashboard Attendance HR/ }))
    .toBeVisible({ timeout: 30000 });

  // Wait for % Data element to appear (page may take time to load data)
  await expect(page.getByText(/% Data :\d+\/\d+/))
    .toBeVisible({ timeout: 20000 });

  // Click the “Unduh” (Download) link and wait for download event
  const [download] = await Promise.all([
    page.waitForEvent('download'),
    page.getByRole('link', { name: /Unduh/ }).click()
  ]);
});
