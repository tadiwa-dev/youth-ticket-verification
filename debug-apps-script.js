// Debug version of Google Apps Script for QR Ticket Validation
// This version includes logging to help identify issues

function doGet(e) {
  try {
    const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName("Form Responses 1");
    const data = sheet.getDataRange().getValues();
    const qrCode = e.parameter.qr;
    
    console.log('Received QR code:', qrCode);
    console.log('Total rows in sheet:', data.length);
    console.log('Headers:', data[0]);
    
    if (!qrCode) {
      return ContentService.createTextOutput("ERROR: No QR code provided.");
    }
    
    // "Scanned" column is in column J (index 9)
    const scannedColumnIndex = 9; // Column J
    
    console.log('Looking for matches...');
    
    for (let i = 1; i < data.length; i++) {
      const refNumber = data[i][5]; // Column F - Timestamp/Reference
      const name = data[i][1]; // Column B - Name
      const church = data[i][4]; // Column E - Church
      const ticketNumber = data[i][7]; // Column H - Ticket Number
      const scannedStatus = data[i][scannedColumnIndex]; // "Scanned" column
      
      const expected = `${ticketNumber} | ${name} | ${church} | ${refNumber}`.trim();
      
      console.log(`Row ${i + 1}: Expected="${expected}", Actual="${qrCode.trim()}"`);
      console.log(`Row ${i + 1}: Scanned status="${scannedStatus}"`);
      
      if (qrCode.trim() === expected) {
        console.log('Match found!');
        
        // Check if ticket has already been scanned
        if (scannedStatus && scannedStatus.toString().toLowerCase() === 'yes') {
          console.log('Ticket already scanned');
          return ContentService.createTextOutput("ALREADY_SCANNED");
        }
        
        // Mark ticket as scanned
        console.log(`Updating row ${i + 1}, column ${scannedColumnIndex + 1} to "Yes"`);
        try {
          sheet.getRange(i + 1, scannedColumnIndex + 1).setValue("Yes");
          console.log('Successfully updated scanned status');
        } catch (updateError) {
          console.error('Error updating scanned status:', updateError);
          return ContentService.createTextOutput("ERROR: Could not update scanned status");
        }
        
        return ContentService.createTextOutput("VALID");
      }
    }
    
    console.log('No match found');
    return ContentService.createTextOutput("INVALID");
    
  } catch (error) {
    console.error('Script error:', error);
    return ContentService.createTextOutput("ERROR: " + error.toString());
  }
}

// Test function to check sheet structure
function testSheetStructure() {
  try {
    const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName("Form Responses 1");
    const data = sheet.getDataRange().getValues();
    
    console.log('Sheet structure test:');
    console.log('Total rows:', data.length);
    console.log('Total columns:', data[0].length);
    console.log('Headers:', data[0]);
    
    // Check if column J exists
    if (data[0].length > 9) {
      console.log('Column J header:', data[0][9]);
    } else {
      console.log('Column J does not exist!');
    }
    
    // Show first few rows
    for (let i = 0; i < Math.min(3, data.length); i++) {
      console.log(`Row ${i + 1}:`, data[i]);
    }
    
  } catch (error) {
    console.error('Test error:', error);
  }
} 