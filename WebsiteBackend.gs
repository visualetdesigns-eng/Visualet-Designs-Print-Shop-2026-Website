/**
 * Visualet Designs Website Backend — WEBSITE-BACKEND 2026-09-23-B
 *
 * Connects the visualetdesigns.site print-shop website to Google Sheets.
 * WITHOUT this script: the website still works — orders are saved in each
 * customer's browser and order tracking works on the same device.
 * WITH this script: every website order is written to a "WebsiteOrders"
 * sheet, customer artwork uploads land in a Drive folder, and customers
 * can track orders from any device.
 *
 * INSTALL (one time):
 * 1. Go to script.google.com → New project → paste this entire file.
 * 2. Deploy → New deployment → type "Web app".
 *    - Execute as: Me
 *    - Who has access: Anyone
 * 3. Copy the /exec URL.
 * 4. On the website, click the gear icon (top right) → enter admin PIN →
 *    Settings tab → paste the URL → Save.
 *
 * SHEET: a spreadsheet tab named "WebsiteOrders" is created automatically
 * in the FIRST spreadsheet this script is bound to... actually it uses the
 * active spreadsheet of this project. To use a specific spreadsheet, set
 * SPREADSHEET_ID below to that sheet's ID (recommended: your CRM sheet).
 *
 * ARTWORK: customer files are saved to Drive under
 * "Visualet Website Artwork/<ORDER-NUMBER>/" and the file URLs are stored
 * on the order (column "Artwork") so the admin panel can link to them.
 */

const SPREADSHEET_ID = "1FkeIKH_-H2vZlRps3eXxR4px0DIXZo-cxFDrJ6Vk2p0"; // user CRM spreadsheet — website orders land in its "WebsiteOrders" tab
const SHEET_NAME = "WebsiteOrders";
const ARTWORK_FOLDER = "Visualet Website Artwork";
const HEADERS = ["Order #","Date","Name","Email","Phone","Company","Address","Items","Total","Status","Notes","Design?","Payment","Artwork"];

/* ---------- web app entry points ---------- */
function doGet(e) {
  const p = (e && e.parameter) || {};
  try {
    if (p.action === "track") {
      const order = findOrder_(String(p.number || "").toUpperCase(), String(p.email || "").toLowerCase());
      return json_({ ok: !!order, order: order || null });
    }
    if (p.action === "products") {
      return json_({ ok: true, products: readProducts_() });
    }
    return json_({ ok: true, service: "visualet-website-backend", version: "2026-09-23-B" });
  } catch (err) {
    return json_({ ok: false, error: String(err) });
  }
}

function doPost(e) {
  try {
    const body = JSON.parse(e.postData.contents);
    if (body.action === "createOrder" && body.order) {
      const order = body.order;
      appendOrder_(order);
      return json_({ ok: true, number: order.number });
    }
    if (body.action === "uploadArtwork" && body.orderNumber && body.files) {
      const urls = saveArtwork_(String(body.orderNumber), body.files);
      return json_({ ok: true, urls: urls });
    }
    return json_({ ok: false, error: "unknown action" });
  } catch (err) {
    return json_({ ok: false, error: String(err) });
  }
}

/* ---------- spreadsheet ---------- */
// Resolves which spreadsheet to use. If SPREADSHEET_ID is set, that sheet wins.
// Otherwise the script creates its OWN "WebsiteOrders" spreadsheet once, stores
// the ID in Script Properties, and reuses it on every later run.
function spreadsheet_() {
  if (SPREADSHEET_ID) return SpreadsheetApp.openById(SPREADSHEET_ID);
  const props = PropertiesService.getScriptProperties();
  const saved = props.getProperty("SS_ID");
  if (saved) {
    try { return SpreadsheetApp.openById(saved); } catch (e) { /* recreate below */ }
  }
  const ss = SpreadsheetApp.create("WebsiteOrders");
  props.setProperty("SS_ID", ss.getId());
  return ss;
}

/* ---------- orders ---------- */
function sheet_() {
  const ss = spreadsheet_();
  let sh = ss.getSheetByName(SHEET_NAME);
  if (!sh) {
    sh = ss.insertSheet(SHEET_NAME);
    sh.appendRow(HEADERS);
    sh.setFrozenRows(1);
  } else if (sh.getLastRow() === 0) {
    sh.appendRow(HEADERS);
  } else {
    // backfill: sheets created by older versions get the new columns appended
    const existing = sh.getRange(1, 1, 1, sh.getLastColumn()).getValues()[0].map(String);
    const missing = HEADERS.filter(function (h) { return existing.indexOf(h) === -1; });
    if (missing.length) {
      const row = sh.getRange(1, 1, 1, sh.getLastColumn()).getValues()[0];
      missing.forEach(function (h) { row.push(h); });
      sh.getRange(1, 1, 1, row.length).setValues([row]);
    }
  }
  return sh;
}

// column index (0-based) of a header name in the sheet's actual header row
function colIdx_(sh, name) {
  const headers = sh.getRange(1, 1, 1, sh.getLastColumn()).getValues()[0].map(String);
  return headers.indexOf(name);
}

function appendOrder_(o) {
  const lock = LockService.getScriptLock();
  lock.waitLock(15000);
  try {
    const sh = sheet_();
    const nCols = sh.getLastColumn();
    const row = new Array(nCols).fill("");
    const set = function (name, val) {
      const i = colIdx_(sh, name);
      if (i >= 0) row[i] = val;
    };
    const itemsText = (o.items || []).map(function (it) {
      const line = (it.line != null && !isNaN(it.line)) ? " [$" + Number(it.line).toFixed(2) + "]" : "";
      return it.qty + "x " + it.name + " (" + it.rung + ")" + line;
    }).join("; ");
    const payText = (o.paymentMethod || "") + (o.paid ? " — PAID" : (o.awaitingPayment ? " — AWAITING PAYMENT" : ""));
    const artText = (o.artwork && o.artwork.length) ? JSON.stringify(o.artwork) : "";
    set("Order #", o.number);
    set("Date", new Date(o.date || Date.now()));
    set("Name", o.name);
    set("Email", String(o.email || "").toLowerCase());
    set("Phone", o.phone);
    set("Company", o.co || "");
    set("Address", o.addr || "");
    set("Items", itemsText);
    set("Total", Number(o.total) || 0);
    set("Status", o.status || "Received");
    set("Notes", o.notes || "");
    set("Design?", o.design ? "YES" : "");
    set("Payment", payText);
    set("Artwork", artText);
    sh.appendRow(row);
  } finally {
    lock.releaseLock();
  }
}

function findOrder_(number, email) {
  const sh = sheet_();
  const last = sh.getLastRow();
  if (last < 2) return null;
  const nCols = sh.getLastColumn();
  const vals = sh.getRange(2, 1, last - 1, nCols).getValues();
  const g = function (r, name) { const i = colIdx_(sh, name); return i >= 0 ? r[i] : ""; };
  for (let i = vals.length - 1; i >= 0; i--) {
    const r = vals[i];
    if (String(g(r, "Order #")).toUpperCase() === number && String(g(r, "Email")).toLowerCase() === email) {
      const d = g(r, "Date");
      return {
        number: g(r, "Order #"),
        date: d instanceof Date ? d.toISOString() : String(d),
        name: g(r, "Name"), email: g(r, "Email"), phone: g(r, "Phone"),
        co: g(r, "Company"), addr: g(r, "Address"),
        items: parseItems_(String(g(r, "Items"))),
        total: Number(g(r, "Total")) || 0,
        status: g(r, "Status") || "Received",
        notes: g(r, "Notes"), design: String(g(r, "Design?")).toUpperCase() === "YES",
        paymentMethod: String(g(r, "Payment") || ""),
        paid: /PAID/.test(String(g(r, "Payment") || "")),
        awaitingPayment: /AWAITING PAYMENT/.test(String(g(r, "Payment") || "")),
        artwork: parseArtwork_(String(g(r, "Artwork") || ""))
      };
    }
  }
  return null;
}

function parseItems_(text) {
  // stored as "2x Name (rung) [$210.00]; 1x Name2 (rung2)" — rebuild a simple list
  return String(text).split(";").map(function (s) {
    s = s.trim();
    const m = s.match(/^(\d+)x\s+(.*?)\s*\((.*?)\)\s*(?:\[\$([\d.]+)\])?$/);
    if (m) return { qty: parseInt(m[1], 10), name: m[2], rung: m[3], line: m[4] ? parseFloat(m[4]) : 0, opts: {} };
    return s ? { qty: 1, name: s, rung: "", line: 0, opts: {} } : null;
  }).filter(Boolean);
}

function parseArtwork_(text) {
  if (!text) return [];
  try {
    const arr = JSON.parse(text);
    return Array.isArray(arr) ? arr : [];
  } catch (e) { return []; }
}

/* ---------- artwork uploads ---------- */
function artworkFolder_(orderNumber) {
  let root;
  const roots = DriveApp.getFoldersByName(ARTWORK_FOLDER);
  root = roots.hasNext() ? roots.next() : DriveApp.createFolder(ARTWORK_FOLDER);
  const subs = root.getFoldersByName(orderNumber);
  return subs.hasNext() ? subs.next() : root.createFolder(orderNumber);
}

function saveArtwork_(orderNumber, files) {
  const lock = LockService.getScriptLock();
  lock.waitLock(15000);
  try {
    const folder = artworkFolder_(orderNumber);
    const urls = [];
    (files || []).forEach(function (f) {
      try {
        const dataUrl = String(f.data || "");
        const comma = dataUrl.indexOf(",");
        const base64 = comma >= 0 ? dataUrl.slice(comma + 1) : dataUrl;
        const bytes = Utilities.base64Decode(base64);
        const blob = Utilities.newBlob(bytes, f.type || "application/octet-stream", String(f.name || "artwork"));
        const file = folder.createFile(blob);
        try { file.setSharing(DriveApp.Access.ANYONE_WITH_LINK, DriveApp.Permission.VIEW); } catch (e) {}
        urls.push(file.getUrl());
      } catch (e) {
        urls.push("");
      }
    });
    return urls;
  } finally {
    lock.releaseLock();
  }
}

/* ---------- optional: products from sheet ---------- */
function readProducts_() {
  const ss = spreadsheet_();
  const sh = ss.getSheetByName("WebsiteProducts");
  if (!sh || sh.getLastRow() < 2) return null;
  const vals = sh.getRange(2, 1, sh.getLastRow() - 1, 7).getValues();
  return vals.filter(function (r) { return r[0]; }).map(function (r) {
    return {
      id: String(r[0]), name: String(r[1]), cat: String(r[2]),
      img: String(r[3]), badge: String(r[4] || ""),
      turnaround: String(r[5] || "3–7 business days"),
      desc: String(r[6] || ""),
      active: true, includes: [],
      rungs: [{ qty: "1", price: 0 }], options: []
    };
  });
}

/* ---------- helpers ---------- */
function json_(obj) {
  return ContentService.createTextOutput(JSON.stringify(obj))
    .setMimeType(ContentService.MimeType.JSON);
}
