const PROPERTY_HEADERS = [
  "slug", "name", "location", "area", "price", "status", "eyebrow", "description",
  "titleDeed", "roadAccess", "electricity", "mapUrl", "youtubeUrl", "imagesJson",
  "highlightsJson", "updatedAt"
];

function doPost(e) {
  try {
    const input = JSON.parse(e.postData.contents || "{}");
    const expectedSecret = PropertiesService.getScriptProperties().getProperty("SHARED_SECRET");
    if (!expectedSecret || input.secret !== expectedSecret) return jsonOutput({ ok: false, error: "unauthorized" });

    const action = input.action || (input.lead ? "appendLead" : "");
    if (action === "appendLead") return appendLead(input.lead);
    if (action === "listProperties") return listProperties();
    if (action === "upsertProperty") return upsertProperty(input.property);
    return jsonOutput({ ok: false, error: "unknown_action" });
  } catch (error) {
    return jsonOutput({ ok: false, error: String(error && error.message || error) });
  }
}

function getOrCreateSheet(name, headers) {
  const spreadsheet = SpreadsheetApp.getActiveSpreadsheet();
  const sheet = spreadsheet.getSheetByName(name) || spreadsheet.insertSheet(name);
  if (sheet.getLastRow() === 0) sheet.appendRow(headers);
  return sheet;
}

function appendLead(lead) {
  if (!lead || !lead.name || !lead.phone) return jsonOutput({ ok: false, error: "invalid_lead" });
  const headers = ["timestamp", "name", "phone", "email", "interest", "message", "sourceUrl", "status"];
  const sheet = getOrCreateSheet("Leads", headers);
  sheet.appendRow([lead.timestamp || new Date().toISOString(), lead.name, lead.phone, lead.email || "", lead.interest || "", lead.message || "", lead.sourceUrl || "", "ใหม่"]);
  return jsonOutput({ ok: true });
}

function listProperties() {
  const sheet = getOrCreateSheet("Properties", PROPERTY_HEADERS);
  if (sheet.getLastRow() < 2) return jsonOutput({ ok: true, properties: [] });
  const rows = sheet.getRange(2, 1, sheet.getLastRow() - 1, PROPERTY_HEADERS.length).getValues();
  const properties = rows.filter(function(row) { return row[0]; }).map(function(row) {
    const item = {};
    PROPERTY_HEADERS.forEach(function(header, index) { item[header] = row[index]; });
    item.images = parseJsonArray(item.imagesJson);
    item.highlights = parseJsonArray(item.highlightsJson);
    delete item.imagesJson;
    delete item.highlightsJson;
    return item;
  });
  return jsonOutput({ ok: true, properties: properties });
}

function upsertProperty(property) {
  if (!property || !property.slug) return jsonOutput({ ok: false, error: "invalid_property" });
  const sheet = getOrCreateSheet("Properties", PROPERTY_HEADERS);
  const slugs = sheet.getLastRow() < 2 ? [] : sheet.getRange(2, 1, sheet.getLastRow() - 1, 1).getValues().map(function(row) { return String(row[0]); });
  const existingIndex = slugs.indexOf(String(property.slug));
  const rowNumber = existingIndex < 0 ? sheet.getLastRow() + 1 : existingIndex + 2;
  const row = PROPERTY_HEADERS.map(function(header) {
    if (header === "imagesJson") return JSON.stringify(property.images || []);
    if (header === "highlightsJson") return JSON.stringify(property.highlights || []);
    if (header === "updatedAt") return new Date().toISOString();
    return property[header] || "";
  });
  sheet.getRange(rowNumber, 1, 1, row.length).setValues([row]);
  return jsonOutput({ ok: true, property: property });
}

function parseJsonArray(value) {
  try { return Array.isArray(value) ? value : JSON.parse(value || "[]"); }
  catch (error) { return []; }
}

function jsonOutput(value) {
  return ContentService.createTextOutput(JSON.stringify(value)).setMimeType(ContentService.MimeType.JSON);
}
