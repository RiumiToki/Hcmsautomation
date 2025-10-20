import { expect, test } from '@playwright/test';

// Optional: reuse saved session to skip login
test.use({ storageState: 'config/auth/session.json' });

test('EC-053: Download Attendance Card (Dashboard Attendance HR)', async ({ page }) => {
  // Go to homepage
  await page.goto('https://hcms-web-iso-fdua-ohc-hcms-dev.apps.ocp-dev.pegadaian.co.id/index');

  // Login only if necessary (when session isn’t saved)
  if (await page.getByRole('textbox', { name: /User code or email/i }).isVisible()) {
    await page.getByRole('textbox', { name: 'User code or email *' }).fill('Demoneuron');
    await page.getByRole('textbox', { name: 'Password *' }).fill('standar');
    await page.getByRole('button', { name: 'Login' }).click();
    await page.waitForURL(/index/, { timeout: 15000 });
  }

  // Navigate to: Reporting → Attendance → Dashboard Attendance HR
  await page.getByRole('button', { name: /Reporting/ }).click();
  await page.locator('#mnu_reporting').getByRole('button', { name: /Attendance/ }).click();
  await page.getByRole('link', { name: /Dashboard Attendance HR/ }).click();
  await page.waitForURL(/reporting-hr/);

  // Open the "Unduh Kartu Kehadiran" modal
  const downloadButton = page.getByRole('button', { name: /Unduh Kartu Kehadiran/ });
  await expect(downloadButton).toBeVisible();
  await downloadButton.click();

  // Wait for modal to appear
  const modal = page.getByLabel('Unduh Kartu Kehadiran');
  await expect(modal).toBeVisible();

  // Select employee
  await modal.getByLabel('', { exact: true }).click();
  await page.getByRole('option', { name: /\[ P632511170 \] TEGUH WAHYONO/ }).click();

  // Select month (Feb)
  await page.getByRole('textbox', { name: 'Pilih Periode' }).click();
  await page.getByText('Feb').nth(2).click();

  // Trigger the download
 const [ download ] = await Promise.all([
  page.waitForEvent('download'),       // Waits for a file download event
  page.getByRole('button', { name: 'Unduh' }).click(),  // Action that triggers it
]);
});
