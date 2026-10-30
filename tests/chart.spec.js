const { test, expect } = require("@playwright/test");
const { readFile } = require("node:fs/promises");

const contributions = {
  years: [
    {
      year: "2025",
      total: 12,
      range: { start: "2025-01-01", end: "2025-12-31" }
    }
  ],
  contributions: [
    { date: "2025-01-01", count: 12, color: "#216e39", intensity: "4" }
  ]
};

test.beforeEach(async ({ page }) => {
  // Keep third-party scripts and fonts out of deterministic browser checks.
  await page.route("**/*", (route) =>
    new URL(route.request().url()).hostname === "127.0.0.1"
      ? route.continue()
      : route.abort()
  );
  await page.goto("/");
});

test("form and theme choices fit narrow, tablet, and desktop screens", async ({
  page
}) => {
  for (const width of [320, 390, 430, 768, 1280]) {
    await page.setViewportSize({ width, height: 900 });
    const input = await page
      .getByRole("textbox", { name: "GitHub username" })
      .boundingBox();
    const button = await page
      .getByRole("button", { name: "Generate!" })
      .boundingBox();
    expect(input.height).toBeGreaterThanOrEqual(44);
    expect(button.height).toBeGreaterThanOrEqual(44);
    if (width <= 500) {
      expect(input.width).toBeCloseTo(button.width, 0);
      expect(input.y + input.height).toBeLessThanOrEqual(button.y);
    }

    const choices = await page
      .locator(".App-themes label")
      .evaluateAll((labels) =>
        labels.map((label) => {
          const { x, width, height } = label.getBoundingClientRect();
          return {
            x,
            width,
            height,
            fits: label.scrollWidth <= label.clientWidth
          };
        })
      );
    expect(choices).toHaveLength(14);
    for (const choice of choices) {
      expect(choice.height).toBeGreaterThanOrEqual(44);
      expect(choice.width).toBeCloseTo(choices[0].width, 0);
      expect(choice.fits).toBe(true);
    }
    // Every row shares the same one or two column edges.
    expect(
      new Set(choices.map((choice) => Math.round(choice.x))).size
    ).toBeLessThanOrEqual(width === 768 ? 4 : 2);
    expect(
      await page.evaluate(
        () => document.documentElement.scrollWidth <= window.innerWidth
      )
    ).toBe(true);
  }
});

test("theme group supports keyboard selection and visible focus", async ({
  page
}) => {
  const themes = page.getByRole("group", { name: "Select a theme" });
  const github = themes.getByRole("radio", { name: "GitHub", exact: true });
  await expect(github).toBeChecked();
  await github.focus();
  await page.keyboard.press("ArrowRight");
  const classic = themes.getByRole("radio", {
    name: "GitHub Classic",
    exact: true
  });
  await expect(classic).toBeChecked();
  await expect(classic).toBeFocused();
  await expect(classic).toHaveCSS("outline-style", "solid");
  // Native radios drop border-radius in Safari and Chrome, squaring the outline.
  await expect(classic).toHaveCSS("border-radius", "50%");
  await expect(page.locator('meta[name="viewport"]')).toHaveAttribute(
    "content",
    "width=device-width, initial-scale=1"
  );
});

test("generates, redraws every theme, and exports PNG and JSON", async ({
  page
}) => {
  const errors = [];
  page.on("pageerror", (error) => errors.push(error.message));
  await page.route("**/api/v1/sallar", (route) =>
    route.fulfill({ json: contributions })
  );
  await page.getByRole("textbox", { name: "GitHub username" }).fill("sallar");
  await page.getByRole("button", { name: "Generate!" }).click();
  const canvas = page.locator("canvas");
  await expect(canvas).toBeVisible();
  await expect
    .poll(() => canvas.evaluate((element) => element.width))
    .toBeGreaterThan(300);
  let previousImage = await canvas.evaluate((element) => element.toDataURL());
  for (const radio of await page.getByRole("radio").all()) {
    if (await radio.isChecked()) continue;
    await radio.check();
    await expect(radio).toBeChecked();
    await expect
      .poll(() => canvas.evaluate((element) => element.toDataURL()))
      .not.toBe(previousImage);
    previousImage = await canvas.evaluate((element) => element.toDataURL());
  }

  const imageDownload = page.waitForEvent("download");
  await page.getByRole("button", { name: "Download", exact: true }).click();
  const png = await imageDownload;
  expect(png.suggestedFilename()).toBe("contributions.png");
  const pngBytes = await readFile(await png.path());
  expect(pngBytes.subarray(0, 8).toString("hex")).toBe("89504e470d0a1a0a");

  const dataDownload = page.waitForEvent("download");
  await page
    .getByRole("link", { name: "Download data as JSON", exact: false })
    .click();
  const json = await dataDownload;
  expect(json.suggestedFilename()).toBe("contributions.json");
  expect(JSON.parse(await readFile(await json.path(), "utf8"))).toEqual(
    contributions
  );
  expect(errors).toEqual([]);
});

test("page follows the system color scheme without a reload", async ({
  page
}) => {
  const html = page.locator("html");
  await page.emulateMedia({ colorScheme: "dark" });
  await expect(html).toHaveCSS("background-color", "rgb(13, 17, 23)");
  // Dark Reader only skips sampling pixels when this is exactly "dark".
  await expect(html).toHaveCSS("color-scheme", "dark");
  await page.emulateMedia({ colorScheme: "light" });
  await expect(html).toHaveCSS("background-color", "rgb(246, 248, 250)");
  await expect(html).toHaveCSS("color-scheme", "light dark");
});

test("star button script swaps its link without a hydration mismatch", async ({
  page
}) => {
  const errors = [];
  page.on("console", (message) => {
    if (message.type() === "error") errors.push(message.text());
  });
  page.on("pageerror", (error) => errors.push(error.message));
  await page.route("https://buttons.github.io/**", (route) =>
    route.fulfill({
      contentType: "text/javascript",
      body: `document
        .querySelector(".github-button")
        .replaceWith(document.createElement("span"));`
    })
  );
  await page.reload();
  await expect(page.locator(".github-button")).toHaveCount(0);
  await expect(page.locator(".App-github-button span")).toHaveCount(1);
  expect(errors.filter((error) => /hydrat|react/i.test(error))).toEqual([]);
});

test("shows a missing profile error and allows another attempt", async ({
  page
}) => {
  await page.route("**/api/v1/missing", (route) =>
    route.fulfill({
      json: { years: [], contributions: [] }
    })
  );
  await page.getByRole("textbox", { name: "GitHub username" }).fill("missing");
  await page.getByRole("button", { name: "Generate!" }).click();
  const error = page.locator(".App-content").getByRole("alert");
  await expect(error).toHaveText("Could not find your profile");
  await page.route("**/api/v1/sallar", (route) =>
    route.fulfill({ json: contributions })
  );
  await page.getByRole("textbox", { name: "GitHub username" }).fill("sallar");
  await page.getByRole("button", { name: "Generate!" }).click();
  await expect(error).toHaveCount(0);
  await expect(page.locator("canvas")).toBeVisible();
});
