const { chromium } = require("@playwright/test");
const dotenv = require("dotenv");
const fs = require("fs");
const path = require("path");

module.exports = async (config) => {
  // 🔹 Load environment variables
  if (process.env.ENV) {
    dotenv.config({
      path: `.env.${process.env.ENV}`,
      override: true,
    });
  } else {
    dotenv.config();
  }

  const authFile = path.resolve(__dirname, "auth/session.json");
  fs.mkdirSync(path.dirname(authFile), { recursive: true });

  // Launch browser (headed = see login happening)
  const browser = await chromium.launch({ headless: false });
  const page = await browser.newPage();

  console.log("⚡ Logging in at:", process.env.BASE_URL);
 await page.goto(process.env.BASE_URL, {
  waitUntil: "networkidle",
  timeout: 120000, // 2 minutes
});

  // Fill login form
  await page.getByRole("textbox", { name: "User code or email *" }).fill(process.env.USERNAME1);
  await page.getByRole("textbox", { name: "Password" }).fill(process.env.PASSWORD1);
  await page.getByRole("button", { name: "Login" }).click();

  // Wait for dashboard or success page
await page.waitForSelector("text=Organization", { timeout: 120000 });


  // ✅ Save storage state
  await page.context().storageState({ path: authFile });
  console.log("✅ Session saved to", authFile);

  await browser.close();
};
