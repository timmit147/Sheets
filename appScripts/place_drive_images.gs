var SPREADSHEET_ID = "YOUR_SPREADSHEET_ID"; // Replace with your actual Spreadsheet ID

// The function to open the image picker sidebar
function openImagePicker() {
  var htmlOutput = HtmlService.createHtmlOutput(getSidebarHTML())
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

// Function to get the HTML code for the sidebar
function getSidebarHTML() {
  return '<!DOCTYPE html>' +
    '<html>' +
    '<head>' +
    '<base target="_top">' +
    '</head>' +
    '<body>' +
    '<h2>Select an image:</h2>' +
    '<div id="imageContainer">' +
    'Loading images...' +
    '</div>' +
    '<script>' +
    'google.script.run.withSuccessHandler(displayImages).getDriveImages();' +
    'function displayImages(images) {' +
    'var imageContainer = document.getElementById("imageContainer");' +
    'imageContainer.innerHTML = "";' +
    'images.forEach(function(imageUrl) {' +
    'var img = document.createElement("img");' +
    'img.src = imageUrl;' +
    'img.style.cursor = "pointer";' +
    'img.style.margin = "5px";' +
    'img.onclick = function() {' +
    'insertImage(imageUrl);' +
    '};' +
    'imageContainer.appendChild(img);' +
    '});' +
    '}' +
    'function insertImage(url) {' +
    'google.script.run.insertImageUrl(url);' +
    '}' +
    '</script>' +
    '</body>' +
    '</html>';
}
