const SHEET_NAME = 'Responses';

function doPost(e) {
  try {
    const data = JSON.parse(e.postData.contents);
    const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(SHEET_NAME) || SpreadsheetApp.getActiveSpreadsheet().insertSheet(SHEET_NAME);
    if (sheet.getLastRow() === 0) sheet.appendRow(['ID', 'Name', 'Date of Birth', 'Documents Number (Last 4 digits)', 'Custom Text', 'Address', 'Created At']);
    sheet.appendRow([data.id || '', data.name || '', data.dob || '', data.documentLast4 || '', data.customText || '', data.address || '', data.createdAt || new Date().toISOString()]);
    return json({ success: true, id: data.id });
  } catch (error) {
    return json({ success: false, error: error.message });
  }
}

function doGet() { return json({ status: 'QR sheet API is running' }); }

function json(value) {
  return ContentService.createTextOutput(JSON.stringify(value)).setMimeType(ContentService.MimeType.JSON);
}
