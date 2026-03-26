import { toast } from "react-hot-toast";

const API_URL = "/api/v1/";

export function fetchData(username) {
  return fetch(API_URL + username).then((res) => res.json());
}

export function download(canvas) {
  try {
    const dataUrl = canvas.toDataURL();
    const a = document.createElement("a");
    document.body.insertAdjacentElement("beforeend", a);
    a.download = "contributions.png";
    a.href = dataUrl;
    a.click();
    document.body.removeChild(a);
  } catch (err) {
    console.error(err);
  }
}

export function downloadJSON(data) {
  try {
    const dataString = JSON.stringify(data);
    const dataUrl =
      "data:text/json;charset=utf-8," + encodeURIComponent(dataString);
    const a = document.createElement("a");
    document.body.insertAdjacentElement("beforeend", a);
    a.download = "contributions.json";
    a.href = dataUrl;
    a.click();
    document.body.removeChild(a);
  } catch (err) {
    console.error(err);
  }
}

export async function share(canvas) {
  try {
    canvas.toBlob(async (blob) => {
      navigator
        .share({
          title: "GitHub Contributions",
          text: "Check out my #GitHubContributions history over time. A free tool by @sallar and friends. https://github-contributions.vercel.app",
          files: [
            new File([blob], "contributions.png", {
              type: blob.type
            })
          ]
        })
        .catch(() => {
          // do nothing
        });
    }, "image/png");
  } catch (err) {
    console.error(err);
  }
}

export async function copyToClipboard(canvas) {
  if ("ClipboardItem" in window) {
    // https://bugs.webkit.org/show_bug.cgi?id=222262
    // https://web.dev/async-clipboard/
    const item = new ClipboardItem({
      "image/png": new Promise((resolve) => {
        canvas.toBlob(resolve, "image/png");
      })
    });
    navigator.clipboard
      .write([item])
      .then(() => toast("🎉 Copied image!"))
      .catch((err) => {
        toast("Sorry, copying image is not supported on this browser");
        console.error("failed to copy");
      });
  } else {
    toast("Sorry, copying image is not supported on this browser");
    console.error("failed to copy");
  }
}

// ─── Layout constants (mirrored from github-contributions-canvas) ───────────
const BOX_WIDTH = 10;
const BOX_MARGIN = 2;
const TEXT_HEIGHT = 15;
const HEADER_HEIGHT = 60;
const CANVAS_MARGIN = 20;
const YEAR_HEIGHT = TEXT_HEIGHT + (BOX_WIDTH + BOX_MARGIN) * 8 + CANVAS_MARGIN;
const FONT_FACE = "IBM Plex Mono, monospace";

// ─── All themes (mirrored from github-contributions-canvas) ─────────────────
const THEMES = {
  standard:      { background:"#ffffff", text:"#000000", meta:"#666666", grade4:"#216e39", grade3:"#30a14e", grade2:"#40c463", grade1:"#9be9a8", grade0:"#ebedf0" },
  classic:       { background:"#ffffff", text:"#000000", meta:"#666666", grade4:"#196127", grade3:"#239a3b", grade2:"#7bc96f", grade1:"#c6e48b", grade0:"#ebedf0" },
  githubDark:    { background:"#101217", text:"#ffffff", meta:"#dddddd", grade4:"#27d545", grade3:"#10983d", grade2:"#00602d", grade1:"#003820", grade0:"#161b22" },
  halloween:     { background:"#ffffff", text:"#000000", meta:"#666666", grade4:"#03001C", grade3:"#FE9600", grade2:"#FFC501", grade1:"#FFEE4A", grade0:"#ebedf0" },
  teal:          { background:"#ffffff", text:"#000000", meta:"#666666", grade4:"#458B74", grade3:"#66CDAA", grade2:"#76EEC6", grade1:"#7FFFD4", grade0:"#ebedf0" },
  leftPad:       { background:"#000000", text:"#ffffff", meta:"#999999", grade4:"#F6F6F6", grade3:"#DDDDDD", grade2:"#A5A5A5", grade1:"#646464", grade0:"#2F2F2F" },
  dracula:       { background:"#181818", text:"#f8f8f2", meta:"#666666", grade4:"#ff79c6", grade3:"#bd93f9", grade2:"#6272a4", grade1:"#44475a", grade0:"#282a36" },
  blue:          { background:"#181818", text:"#C0C0C0", meta:"#666666", grade4:"#4F83BF", grade3:"#416895", grade2:"#344E6C", grade1:"#263342", grade0:"#222222" },
  panda:         { background:"#2B2C2F", text:"#E6E6E6", meta:"#676B79", grade4:"#FF4B82", grade3:"#19f9d8", grade2:"#6FC1FF", grade1:"#34353B", grade0:"#242526" },
  sunny:         { background:"#ffffff", text:"#000000", meta:"#666666", grade4:"#a98600", grade3:"#dab600", grade2:"#e9d700", grade1:"#f8ed62", grade0:"#fff9ae" },
  pink:          { background:"#ffffff", text:"#000000", meta:"#666666", grade4:"#61185f", grade3:"#a74aa8", grade2:"#ca5bcc", grade1:"#e48bdc", grade0:"#ebedf0" },
  YlGnBu:        { background:"#ffffff", text:"#000000", meta:"#666666", grade4:"#253494", grade3:"#2c7fb8", grade2:"#41b6c4", grade1:"#a1dab4", grade0:"#ebedf0" },
  solarizedDark: { background:"#002b36", text:"#93a1a1", meta:"#586e75", grade4:"#d33682", grade3:"#b58900", grade2:"#2aa198", grade1:"#268bd2", grade0:"#073642" },
  solarizedLight:{ background:"#fdf6e3", text:"#586e75", meta:"#93a1a1", grade4:"#6c71c4", grade3:"#dc322f", grade2:"#cb4b16", grade1:"#b58900", grade0:"#eee8d5" },
};

/** Escape special XML characters in text content */
function escXml(str) {
  return String(str)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

/**
 * Build an array of week-column dates for a given year entry.
 * Identical logic to the canvas library.
 */
function buildGraphEntries(year, contributions) {
  const DATE_FMT = (d) => d.toISOString().slice(0, 10);
  const addWeeks = (d, n) => { const r = new Date(d); r.setDate(r.getDate() + n * 7); return r; };
  const setDay  = (d, n) => { const r = new Date(d); r.setDate(r.getDate() - r.getDay() + n); return r; };

  const today       = new Date();
  const thisYear    = String(today.getFullYear());
  const lastDate    = year.year === thisYear ? today : new Date(year.range.end);
  const firstReal   = new Date(`${year.year}-01-01`);
  // startOfWeek (Sunday)
  const firstDate   = setDay(firstReal, 0);

  const contribMap  = {};
  contributions.forEach(c => { contribMap[c.date] = c; });

  const firstRowDates = [];
  let nextDate = new Date(firstDate);
  while (nextDate <= lastDate) {
    const dateStr = DATE_FMT(nextDate);
    firstRowDates.push({ date: dateStr, info: contribMap[dateStr] || null });
    nextDate = addWeeks(nextDate, 1);
  }

  const graphEntries = [firstRowDates];
  for (let i = 1; i < 7; i++) {
    graphEntries.push(
      firstRowDates.map(({ date }) => {
        const base = new Date(date);
        const r = setDay(base, i);
        const dateStr = DATE_FMT(r);
        return { date: dateStr, info: contribMap[dateStr] || null };
      })
    );
  }
  return { graphEntries, lastDate };
}

/**
 * Generate a pure SVG string for the contributions chart.
 * Faithfully mirrors github-contributions-canvas drawing logic.
 */
export function generateContributionsSVG(data, username, themeName = "standard", footerText = "") {
  const theme   = THEMES[themeName] || THEMES.standard;
  const years   = data.years;
  const contribs = data.contributions;

  const totalContributions = years.reduce((s, y) => s + (y.total || 0), 0);

  const svgWidth  = 53 * (BOX_WIDTH + BOX_MARGIN) + CANVAS_MARGIN * 2;
  const svgHeight = years.length * YEAR_HEIGHT + CANVAS_MARGIN + HEADER_HEIGHT + 10;

  const els = []; // SVG element strings

  // ── Background ────────────────────────────────────────────────────────────
  els.push(`<rect width="${svgWidth}" height="${svgHeight}" fill="${escXml(theme.background)}" />`);

  // ── Header ────────────────────────────────────────────────────────────────
  // Username
  els.push(
    `<text x="${CANVAS_MARGIN}" y="${CANVAS_MARGIN + 16}"` +
    ` font-family="${escXml(FONT_FACE)}" font-size="20"` +
    ` fill="${escXml(theme.text)}" dominant-baseline="auto">` +
    `@${escXml(username)} on GitHub</text>`
  );
  // Total contributions
  els.push(
    `<text x="${CANVAS_MARGIN}" y="${CANVAS_MARGIN + 30 + 12}"` +
    ` font-family="${escXml(FONT_FACE)}" font-size="10"` +
    ` fill="${escXml(theme.text)}" dominant-baseline="auto">` +
    `Total Contributions: ${totalContributions}</text>`
  );

  // Divider line (y = 55 + 10 = 65)
  const dividerY = 65;
  els.push(
    `<line x1="${CANVAS_MARGIN}" y1="${dividerY}" x2="${svgWidth - CANVAS_MARGIN}" y2="${dividerY}"` +
    ` stroke="${escXml(theme.grade0)}" stroke-width="1" />`
  );

  // Legend ("Less" / boxes / "More") — top-right, y ≈ 37
  const legendY     = 37;
  const legendBoxY  = TEXT_HEIGHT + BOX_WIDTH; // 25
  let themeGrades   = 5;
  const lessX = svgWidth - CANVAS_MARGIN - (BOX_WIDTH + BOX_MARGIN) * themeGrades - 55;
  els.push(
    `<text x="${lessX}" y="${legendY}"` +
    ` font-family="${escXml(FONT_FACE)}" font-size="10"` +
    ` fill="${escXml(theme.text)}" dominant-baseline="auto">Less</text>`
  );
  els.push(
    `<text x="${svgWidth - CANVAS_MARGIN - 25}" y="${legendY}"` +
    ` font-family="${escXml(FONT_FACE)}" font-size="10"` +
    ` fill="${escXml(theme.text)}" dominant-baseline="auto">More</text>`
  );
  themeGrades = 5;
  for (let x = 0; x < 5; x++) {
    const bx = svgWidth - CANVAS_MARGIN - (BOX_WIDTH + BOX_MARGIN) * themeGrades - 27;
    els.push(
      `<rect x="${bx}" y="${legendBoxY}" width="${BOX_WIDTH}" height="${BOX_WIDTH}"` +
      ` fill="${escXml(theme[`grade${x}`])}" />`
    );
    themeGrades -= 1;
  }

  // Footer text
  if (footerText) {
    els.push(
      `<text x="${CANVAS_MARGIN}" y="${svgHeight - 5}"` +
      ` font-family="${escXml(FONT_FACE)}" font-size="10"` +
      ` fill="${escXml(theme.meta)}" dominant-baseline="auto">` +
      `${escXml(footerText)}</text>`
    );
  }

  // ── Year rows ─────────────────────────────────────────────────────────────
  const today = new Date();
  const thisYear = String(today.getFullYear());

  years.forEach((year, i) => {
    const offsetY = YEAR_HEIGHT * i + CANVAS_MARGIN + HEADER_HEIGHT + 10;
    const offsetX = CANVAS_MARGIN;

    // Year label
    const isCurrent = year.year === thisYear;
    const label =
      `${year.year}: ${year.total} Contribution${year.total === 1 ? "" : ""}` +
      (isCurrent ? " (so far)" : "");
    els.push(
      `<text x="${offsetX}" y="${offsetY - 17 + 10}"` +
      ` font-family="${escXml(FONT_FACE)}" font-size="10"` +
      ` fill="${escXml(theme.text)}" dominant-baseline="auto">` +
      `${escXml(label)}</text>`
    );

    const { graphEntries, lastDate } = buildGraphEntries(year, contribs);

    // Day cells
    for (let row = 0; row < graphEntries.length; row++) {
      for (let col = 0; col < graphEntries[row].length; col++) {
        const day = graphEntries[row][col];
        if (!day.info) continue;
        const cellDate = new Date(day.date);
        if (cellDate > lastDate) continue;

        const intensity = parseInt(day.info.intensity, 10) || 0;
        const color = theme[`grade${intensity}`];
        const cx = offsetX + (BOX_WIDTH + BOX_MARGIN) * col;
        const cy = offsetY + TEXT_HEIGHT + (BOX_WIDTH + BOX_MARGIN) * row;
        els.push(`<rect x="${cx}" y="${cy}" width="${BOX_WIDTH}" height="${BOX_WIDTH}" fill="${escXml(color)}" />`);
      }
    }

    // Month labels
    let lastCountedMonth = 0;
    for (let col = 0; col < graphEntries[0].length; col++) {
      const d     = new Date(graphEntries[0][col].date);
      const month = d.getMonth() + 1;
      const firstMonthIsDec = month === 12 && col === 0;
      if (month !== lastCountedMonth && !firstMonthIsDec) {
        const monthNames = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
        const mx = offsetX + (BOX_WIDTH + BOX_MARGIN) * col;
        els.push(
          `<text x="${mx}" y="${offsetY + 10}"` +
          ` font-family="${escXml(FONT_FACE)}" font-size="10"` +
          ` fill="${escXml(theme.meta)}" dominant-baseline="auto">` +
          `${monthNames[month - 1]}</text>`
        );
        lastCountedMonth = month;
      }
    }
  });

  return [
    `<?xml version="1.0" encoding="UTF-8"?>`,
    `<svg xmlns="http://www.w3.org/2000/svg"`,
    `     width="${svgWidth}" height="${svgHeight}"`,
    `     viewBox="0 0 ${svgWidth} ${svgHeight}">`,
    ...els,
    `</svg>`
  ].join("\n");
}

export function downloadSVG(data, username, themeName, footerText) {
  try {
    const svgContent = generateContributionsSVG(data, username, themeName, footerText);
    const blob = new Blob([svgContent], { type: "image/svg+xml;charset=utf-8" });
    const url  = URL.createObjectURL(blob);
    const a    = document.createElement("a");
    document.body.insertAdjacentElement("beforeend", a);
    a.download = "contributions.svg";
    a.href     = url;
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  } catch (err) {
    console.error(err);
  }
}

export function cleanUsername(username) {
  return username.replace(/^(http|https):\/\/(?!www\.)github\.com\//, "");
}
