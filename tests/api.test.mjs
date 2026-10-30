import assert from "node:assert/strict";
import { test } from "node:test";
import { fetchDataForAllYears } from "../src/utils/api/fetch.js";

const profile = `
  <a class="js-year-link filter-item" href="/sallar?year=2025">2025</a>
  <a class="js-year-link filter-item" href="/sallar?year=2024">2024</a>
`;

function calendar(year) {
  // GitHub's table groups days by weekday, not chronological order.
  return `
    <div class="js-yearly-contributions"><h2>1,234 contributions in ${year}</h2></div>
    <table class="ContributionCalendar-grid"><tbody><tr>
      <td class="ContributionCalendar-day" data-date="${year}-01-05" data-level="1"></td>
      <td class="ContributionCalendar-day" data-date="${year}-12-31" data-level="4"></td>
      <td class="ContributionCalendar-day" data-date="${year}-01-01" data-level="2"></td>
      <td class="ContributionCalendar-day" data-date="${year}-12-27" data-level="0"></td>
    </tr></tbody></table>
  `;
}

function mockGitHub(t, profileHtml = profile) {
  t.mock.method(globalThis, "fetch", async (url) => {
    const year = new URL(url).searchParams.get("year");
    return new Response(year ? calendar(year) : profileHtml);
  });
}

test("year ranges include every date regardless of table order", async (t) => {
  mockGitHub(t);
  const data = await fetchDataForAllYears("sallar");
  assert.equal(data.years.length, 2);
  assert.equal(data.contributions.length, 8);
  assert.equal(data.years[0].total, 1234);
  assert.deepEqual(data.years[0].range, {
    start: "2025-01-01",
    end: "2025-12-31"
  });
  assert.equal(data.contributions[0].date, "2025-12-31");
  assert.equal(data.contributions[0].intensity, "4");
});

test("nested output contains only year/month/day contributions", async (t) => {
  mockGitHub(t);
  const data = await fetchDataForAllYears("sallar", "nested");
  assert.deepEqual(Object.keys(data.years).sort(), ["2024", "2025"]);
  assert.deepEqual(Object.keys(data.contributions).sort(), ["2024", "2025"]);
  for (const year of ["2024", "2025"]) {
    assert.equal(data.contributions[year][12][31].date, `${year}-12-31`);
    assert.equal(data.contributions[year][12][31].intensity, "4");
  }
});

test("profiles without years have empty output in either format", async (t) => {
  mockGitHub(t, "<html></html>");
  assert.deepEqual(await fetchDataForAllYears("missing"), {
    years: [],
    contributions: []
  });
  assert.deepEqual(await fetchDataForAllYears("missing", "nested"), {
    years: {},
    contributions: {}
  });
});
