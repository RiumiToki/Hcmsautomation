// utils/datepicker.js
async function pickDate(page, input, options = {}) {
  const { monthsBack = 0, day, year } = options;

  await input.scrollIntoViewIfNeeded();
  await input.click({ force: true });

  const dp = page.locator('.datepicker:visible, .air-datepicker:visible').first();
  await dp.waitFor({ state: 'visible', timeout: 5000 });

  // Try known patterns
  const yearCells = dp.locator(
    '.datepicker--cell-year, .air-datepicker-cell.-year-, .datepicker--cell.-year-, .air-datepicker-cell'
  );
  const dayCells = dp.locator('.datepicker--cell-day, .air-datepicker-cell.-day-, .datepicker--cell.-day-');

  if (await yearCells.count() > 0) {
    // Filter by numeric year
    const filtered = year
      ? yearCells.filter({ hasText: String(year) })
      : yearCells.filter({ hasText: /\b20\d{2}\b/ });
    if (await filtered.count() === 0) {
      throw new Error('❌ Year cells found, but no matching year text');
    }
    await filtered.first().scrollIntoViewIfNeeded();
    await filtered.first().click({ force: true });
  } else if (await dayCells.count() > 0) {
    for (let i = 0; i < monthsBack; i++) {
      await dp.locator('[data-action="prev"]').click();
      await page.waitForTimeout(200);
    }

    const targetDay =
      day != null
        ? dayCells.filter({ hasText: String(day) }).first()
        : dayCells.last();

    await targetDay.scrollIntoViewIfNeeded();
    await targetDay.click({ force: true });
  } else {
    // Final fallback: any element inside the picker that looks like a year
    const anyYear = dp.locator('div:has-text("202"), span:has-text("202")').first();
    if (await anyYear.count() > 0) {
      await anyYear.click({ force: true });
    } else {
      throw new Error('❌ Unknown datepicker mode: no visible selectable cells found.');
    }
  }

  await page.waitForTimeout(200);
}

module.exports = { pickDate };
