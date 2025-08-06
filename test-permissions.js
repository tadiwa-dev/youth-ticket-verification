// Test script to check permissions and sheet structure
// Run this function in Google Apps Script to debug the issue

function testPermissions() {
  try {
    console.log('Testing permissions...');
    
    // Test 1: Can we access the spreadsheet?
    const spreadsheet = SpreadsheetApp.getActiveSpreadsheet();
    console.log('Spreadsheet name:', spreadsheet.getName());
    console.log('Spreadsheet ID:', spreadsheet.getId());
    
    // Test 2: Can we access the sheet?
    const sheet = spreadsheet.getSheetByName("Form Responses 1");
    if (sheet) {
      console.log('Sheet found:', sheet.getName());
      console.log('Sheet ID:', sheet.getSheetId());
    } else {
      console.log('ERROR: Sheet "Form Responses 1" not found!');
      return;
    }
    
    // Test 3: Can we read data?
    const data = sheet.getDataRange().getValues();
    console.log('Data read successfully');
    console.log('Total rows:', data.length);
    console.log('Total columns:', data[0].length);
    
    // Test 4: Can we write to column J?
    const testRow = 2; // Second row (first data row)
    const testColumn = 10; // Column J (1-indexed)
    
    console.log(`Testing write to row ${testRow}, column ${testColumn}...`);
    
    // Read current value
    const currentValue = sheet.getRange(testRow, testColumn).getValue();
    console.log('Current value in J2:', currentValue);
    
    // Write test value
    sheet.getRange(testRow, testColumn).setValue('TEST_WRITE');
    console.log('Write test successful');
    
    // Read back to confirm
    const newValue = sheet.getRange(testRow, testColumn).getValue();
    console.log('New value in J2:', newValue);
    
    // Restore original value
    sheet.getRange(testRow, testColumn).setValue(currentValue);
    console.log('Original value restored');
    
    console.log('All permission tests passed!');
    
  } catch (error) {
    console.error('Permission test failed:', error);
    console.error('Error details:', error.toString());
  }
}

// Function to check if "Scanned" column exists
function checkScannedColumn() {
  try {
    const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName("Form Responses 1");
    const data = sheet.getDataRange().getValues();
    
    console.log('Checking for "Scanned" column...');
    console.log('All headers:', data[0]);
    
    // Look for "Scanned" column
    const scannedIndex = data[0].findIndex(header => 
      header && header.toString().toLowerCase().includes('scanned')
    );
    
    if (scannedIndex !== -1) {
      console.log(`"Scanned" column found at index ${scannedIndex} (Column ${String.fromCharCode(65 + scannedIndex)})`);
      console.log('Column header:', data[0][scannedIndex]);
    } else {
      console.log('"Scanned" column not found in headers');
      console.log('Available columns:');
      data[0].forEach((header, index) => {
        console.log(`Column ${String.fromCharCode(65 + index)}: ${header}`);
      });
    }
    
  } catch (error) {
    console.error('Error checking scanned column:', error);
  }
} 