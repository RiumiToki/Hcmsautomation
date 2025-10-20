import { expect, test } from '@playwright/test';

// ✅ Reuse saved login session
test.use({ storageState: 'config/auth/session.json' });

test('Konfigurasi → Employee → Attribute Type → Edit Nilai jenis', async ({ page }) => {
  // Always start from index page
  await page.goto('https://hcms-web-iso-fdua-ohc-hcms-dev.apps.ocp-dev.pegadaian.co.id/index');

  // Open Konfigurasi → Employee → Attribute Type
  await page.getByRole('menuitem', { name: /Konfigurasi/ }).getByRole('button').click();
  await page.locator('#mnu_config_menu').getByRole('button', { name: /Employee/ }).click();
  await page.getByRole('link', { name: /Attribute Type/ }).click();

  // Show 100 entries
  await page.getByLabel('Tampilkan 102550100 entri').selectOption('100');

  // Click edit button for target row
  await page.getByRole('row', { name: /testing testing number 5/ }).getByRole('button').first().click();

  // ✅ Dynamically select Nilai jenis (number → 2, string → 1)
  const dropdown = page.locator('#attr_type_value_id');
  const currentValue = await dropdown.inputValue();

  if (currentValue === '2' || currentValue.toLowerCase() === 'number') {
    await dropdown.selectOption('2'); // number
    console.log('Selected: number');
  } else {
    await dropdown.selectOption('1'); // string
    console.log('Selected: string');
  }

  // Save and verify
  await page.getByRole('button', { name: 'Simpan' }).click();
  await expect(page.getByText(/Berhasil menyimpan tipe/)).toBeVisible();
});
