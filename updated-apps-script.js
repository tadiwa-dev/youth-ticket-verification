// Updated Google Apps Script for QR Ticket Validation with Duplicate Prevention
// Replace your existing doGet function with this one

function doGet(e) {
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName("Form Responses 1");
  const data = sheet.getDataRange().getValues();
  const qrCode = e.parameter.qr;
  
  if (!qrCode) {
    return ContentService.createTextOutput("ERROR: No QR code provided.");
  }
  
  // "Scanned" column is in column J (index 9)
  const scannedColumnIndex = 9; // Column J
  
  for (let i = 1; i < data.length; i++) {
    const refNumber = data[i][5]; // Column F - Timestamp/Reference
    const name = data[i][1]; // Column B - Name
    const church = data[i][4]; // Column E - Church
    const ticketNumber = data[i][7]; // Column H - Ticket Number
    const scannedStatus = data[i][scannedColumnIndex]; // "Scanned" column
    
    const expected = `${ticketNumber} | ${name} | ${church} | ${refNumber}`.trim();
    
    if (qrCode.trim() === expected) {
      // Check if ticket has already been scanned
      if (scannedStatus && scannedStatus.toString().toLowerCase() === 'yes') {
        return ContentService.createTextOutput("ALREADY_SCANNED");
      }
      
              // Mark ticket as scanned (column J = index 9, but getRange uses 1-indexed, so 9 + 1 = 10)
        sheet.getRange(i + 1, 10).setValue("Yes");
      
      return ContentService.createTextOutput("VALID");
    }
  }
  
  return ContentService.createTextOutput("INVALID");
}

// Updated sync function to include scanned status
function doGetSync() {
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName("Form Responses 1");
  const data = sheet.getDataRange().getValues();
  const scannedColumnIndex = 9; // Column J
  
  const tickets = [];
  
  for (let i = 1; i < data.length; i++) {
    const ticket = {
      ticketNumber: data[i][7],    // Column H - Ticket Number
      name: data[i][1],            // Column B - Name
      church: data[i][4],          // Column E - Church
      ecoCashRef: data[i][5],      // Column F - Timestamp/Reference
      scanned: data[i][scannedColumnIndex] || "No" // "Scanned" column
    };
    tickets.push(ticket);
  }
  
  return ContentService.createTextOutput(JSON.stringify(tickets))
    .setMimeType(ContentService.MimeType.JSON);
} 