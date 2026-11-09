const SHEET_NAME = 'Responses';

function doPost(e) {
  try {
    const data = JSON.parse(e.postData.contents);
    const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(SHEET_NAME) || SpreadsheetApp.getActiveSpreadsheet().insertSheet(SHEET_NAME);
    const headers = ['ID', 'Type', 'Name', 'Date of Birth', 'Documents Number (Last 4 digits)', 'Custom Text', 'Address', 'Contact Value', 'Contact Message', 'Wi-Fi SSID', 'Wi-Fi Security', 'Created At'];
    if (sheet.getLastRow() === 0) sheet.appendRow(headers);
    else if (sheet.getRange(1, 1, 1, headers.length).getValues()[0].join('|') !== headers.join('|')) sheet.getRange(1, 1, 1, headers.length).setValues([headers]);
    sheet.appendRow([data.id || '', data.type || 'profile', data.name || '', data.dob || '', data.documentLast4 || '', data.customText || '', data.address || '', data.contactValue || '', data.contactMessage || '', data.wifiSsid || '', data.wifiSecurity || '', data.createdAt || new Date().toISOString()]);
    return json({ success: true, id: data.id });
  } catch (error) {
    return json({ success: false, error: error.message });
  }
}

function doGet() { return json({ status: 'QR sheet API is running' }); }

function json(value) {
  return ContentService.createTextOutput(JSON.stringify(value)).setMimeType(ContentService.MimeType.JSON);
}
