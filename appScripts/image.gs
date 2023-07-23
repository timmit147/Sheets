// Add these lines at the beginning of your existing code
var SPREADSHEET_ID = "YOUR_SPREADSHEET_ID"; // Replace with your actual Spreadsheet ID

// The function to open the image picker sidebar
function openImagePicker() {
  var htmlOutput = HtmlService.createHtmlOutputFromFile('imagePickerSidebar')
    .setTitle('Image Picker');
  SpreadsheetApp.getUi().showSidebar(htmlOutput);
}

// Function to insert the selected image URL into the active cell
function insertImageUrl(url) {
  var activeCell = SpreadsheetApp.getActiveRange();
  activeCell.setValue(url);
}

// Function to get the images from Google Drive and return as an array
function getDriveImages() {
  var images = DriveApp.getFilesByType(MimeType.JPEG);
  var urls = [];
  while (images.hasNext()) {
    var image = images.next();
    var imageUrl = image.getDownloadUrl().replace('export=download&', '');
    urls.push(imageUrl);
  }
  return urls;
}

// Continue with the rest of your existing code...
