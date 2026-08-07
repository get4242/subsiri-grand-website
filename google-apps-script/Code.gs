const PROPERTY_HEADERS = [
  "slug", "name", "location", "area", "price", "status", "eyebrow", "description",
  "titleDeed", "roadAccess", "electricity", "mapUrl", "youtubeUrl", "imagesJson",
  "highlightsJson", "updatedAt"
];
const LEAD_HEADERS = ["timestamp", "name", "phone", "email", "interest", "message", "sourceUrl", "status"];
const CONTENT_HEADERS = ["slug", "dataJson", "enabled", "updatedAt"];

function doPost(e) {
  try {
    const input = JSON.parse(e.postData.contents || "{}");
    const expectedSecret = PropertiesService.getScriptProperties().getProperty("SHARED_SECRET");
    if (!expectedSecret || input.secret !== expectedSecret) return jsonOutput({ ok: false, error: "unauthorized" });

    const action = input.action || (input.lead ? "appendLead" : "");
    if (action === "appendLead") return appendLead(input.lead);
    if (action === "listProperties") return listProperties();
    if (action === "upsertProperty") return upsertProperty(input.property);
    if (action === "listLeads") return listLeads();
    if (action === "updateLeadStatus") return updateLeadStatus(input.id, input.status);
    if (action === "listContent") return listContent(input.kind);
    if (action === "upsertContent") return upsertContent(input.kind, input.record);
    if (action === "getPublicContent") return getPublicContent();
    if (action === "uploadImage") return uploadImage(input.upload);
    return jsonOutput({ ok: false, error: "unknown_action" });
  } catch (error) {
    return jsonOutput({ ok: false, error: String(error && error.message || error) });
  }
}

function contentSheetName(kind) {
  const names = { services: "Services", articles: "Articles", promotions: "Promotions" };
  return names[String(kind)] || "";
}

function listContent(kind) {
  const name = contentSheetName(kind);
  if (!name) return jsonOutput({ ok: false, error: "invalid_content_kind" });
  const sheet = getOrCreateSheet(name, CONTENT_HEADERS);
  if (sheet.getLastRow() < 2) return jsonOutput({ ok: true, records: [] });
  const rows = sheet.getRange(2, 1, sheet.getLastRow() - 1, CONTENT_HEADERS.length).getValues();
  const records = rows.filter(function(row) { return row[0]; }).map(function(row) {
    try { return JSON.parse(row[1] || "{}"); } catch (error) { return null; }
  }).filter(Boolean);
  return jsonOutput({ ok: true, records: records });
}

function upsertContent(kind, record) {
  const name = contentSheetName(kind);
  if (!name || !record || !record.slug) return jsonOutput({ ok: false, error: "invalid_content" });
  const sheet = getOrCreateSheet(name, CONTENT_HEADERS);
  const slugs = sheet.getLastRow() < 2 ? [] : sheet.getRange(2, 1, sheet.getLastRow() - 1, 1).getValues().map(function(row) { return String(row[0]); });
  const index = slugs.indexOf(String(record.slug));
  const row = index < 0 ? sheet.getLastRow() + 1 : index + 2;
  sheet.getRange(row, 1, 1, CONTENT_HEADERS.length).setValues([[record.slug, JSON.stringify(record), record.enabled !== false, new Date().toISOString()]]);
  return jsonOutput({ ok: true, record: record });
}

function getPublicContent() {
  const propertiesResult = parseOutput(listProperties());
  const serviceResult = parseOutput(listContent("services"));
  const articleResult = parseOutput(listContent("articles"));
  const promotionResult = parseOutput(listContent("promotions"));
  return jsonOutput({ ok: true, properties: propertiesResult.properties || [], services: serviceResult.records || [], articles: articleResult.records || [], promotions: promotionResult.records || [] });
}

function parseOutput(output) { return JSON.parse(output.getContent()); }

function uploadImage(upload) {
  try {
    if (!upload || !upload.data || !upload.mimeType) return jsonOutput({ ok: false, error: "invalid_upload" });
    const rootName = "Subsiri Website Uploads";
    const roots = DriveApp.getFoldersByName(rootName);
    const root = roots.hasNext() ? roots.next() : DriveApp.createFolder(rootName);
    const folderName = String(upload.folder || "general").replace(/[^a-zA-Z0-9_-]/g, "-");
    const folders = root.getFoldersByName(folderName);
    const folder = folders.hasNext() ? folders.next() : root.createFolder(folderName);
    const bytes = Utilities.base64Decode(upload.data);
    const blob = Utilities.newBlob(bytes, upload.mimeType, upload.filename || ("image-" + Date.now()));
    const file = folder.createFile(blob);
    file.setSharing(DriveApp.Access.ANYONE_WITH_LINK, DriveApp.Permission.VIEW);
    return jsonOutput({ ok: true, url: "https://lh3.googleusercontent.com/d/" + file.getId(), fileId: file.getId() });
  } catch (error) {
    return jsonOutput({ ok: false, error: "drive_upload_error: " + String(error && error.message || error) });
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
  const sheet = getOrCreateSheet("Leads", LEAD_HEADERS);
  sheet.appendRow([lead.timestamp || new Date().toISOString(), lead.name, lead.phone, lead.email || "", lead.interest || "", lead.message || "", lead.sourceUrl || "", "ใหม่"]);
  return jsonOutput({ ok: true });
}

function listLeads() {
  const sheet = getOrCreateSheet("Leads", LEAD_HEADERS);
  if (sheet.getLastRow() < 2) return jsonOutput({ ok: true, leads: [] });
  const rows = sheet.getRange(2, 1, sheet.getLastRow() - 1, LEAD_HEADERS.length).getValues();
  const leads = rows.map(function(row, index) {
    const item = { id: index + 2 };
    LEAD_HEADERS.forEach(function(header, column) { item[header] = row[column]; });
    return item;
  }).filter(function(item) { return item.name && item.phone; }).reverse();
  return jsonOutput({ ok: true, leads: leads });
}

function updateLeadStatus(id, status) {
  const allowed = ["ใหม่", "กำลังติดตาม", "นัดหมายแล้ว", "ปิดการขาย", "ไม่สนใจ"];
  const row = Number(id);
  if (!Number.isInteger(row) || row < 2 || allowed.indexOf(String(status)) < 0) {
    return jsonOutput({ ok: false, error: "invalid_lead_status" });
  }
  const sheet = getOrCreateSheet("Leads", LEAD_HEADERS);
  if (row > sheet.getLastRow()) return jsonOutput({ ok: false, error: "lead_not_found" });
  sheet.getRange(row, LEAD_HEADERS.indexOf("status") + 1).setValue(status);
  return jsonOutput({ ok: true, id: row, status: status });
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
