/**
 * GOOGLE APPS SCRIPT FOR WEDDING WISHLIST
 * 1. Open Google Sheets.
 * 2. Create a sheet and name it 'Wishes' (or any name).
 * 3. Go to Extensions -> Apps Script.
 * 4. Paste this code.
 * 5. Replace YOUR_SHEET_ID with your Google Sheet ID.
 * 6. Deploy -> New Deployment -> Web App -> Execute as 'Me' -> Access 'Anyone'.
 * 7. Copy the Web App URL and paste it into App.jsx (GOOGLE_SCRIPT_URL).
 */

const SHEET_ID = "YOUR_GOOGLE_SHEET_ID_HERE";
const SHEET_NAME = "Sheet1";

function doPost(e) {
  const ss = SpreadsheetApp.openById(SHEET_ID);
  const sheet = ss.getSheetByName(SHEET_NAME);

  try {
    const data = JSON.parse(e.postData.contents);
    const date = new Date();

    // Add row: Date, Name, Role, Message, Phone
    sheet.appendRow([date, data.name, data.role, data.message, data.phone]);

    return ContentService.createTextOutput(
      JSON.stringify({ status: "success" }),
    ).setMimeType(ContentService.MimeType.JSON);
  } catch (error) {
    return ContentService.createTextOutput(
      JSON.stringify({ status: "error", message: error.toString() }),
    ).setMimeType(ContentService.MimeType.JSON);
  }
}
