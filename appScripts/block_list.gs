function onOpen() {
  var ui = SpreadsheetApp.getUi();
  ui.createMenu('Custom Menu')
    .addItem('Open Popup', 'openPopup')
    .addToUi();
}

function openPopup() {
  var sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
  var range = sheet.getRange("A1:A" + sheet.getLastRow());
  var cellValues = range.getValues();
  var cellNamesStartingWithBlock = [];

  for (var i = 0; i < cellValues.length; i++) {
    var cellValue = cellValues[i][0].toString();
    if (cellValue.toLowerCase().startsWith("block")) {
      var cellName = "A" + (i + 1);
      cellNamesStartingWithBlock.push({ cellName: cellName, cellValue: cellValue });
    }
  }

  var htmlOutput = HtmlService.createHtmlOutput(
    '<!DOCTYPE html>' +
    '<html>' +
    '<head>' +
    '<base target="_top">' +
    '<style>' +
    '.container {' +
    '  display: flex;' +
    '  flex-direction: column;' +
    '}' +
    '.item {' +
    '  display: flex;' +
    '  align-items: center;' +
    '  margin: 5px 0;' +
    '}' +
    '.cell-value {' +
    '  flex-grow: 1;' +
    '  padding-right: 10px;' +
    '}' +
    '</style>' +
    '</head>' +
    '<body>' +
    '<div class="container" id="container">' +
    cellNamesStartingWithBlock.map(item =>
      '<div class="item">' +
      '<span class="cell-value">' + item.cellValue + '</span>' +
      '<button onclick="moveRow(\'' + item.cellName + '\', \'up\')">Up</button>' +
      '<button onclick="moveRow(\'' + item.cellName + '\', \'down\')">Down</button>' +
      '</div>'
    ).join('') +
    '</div>' +
    '<script>' +
    'function moveRow(cellName, direction) {' +
    '  google.script.run.moveRow(cellName, direction);' +
    '}' +
    'function updateContent(cellData) {' +
    '  var container = document.getElementById(\'container\');' +
    '  container.innerHTML = \'\';' +
    '  cellData.forEach(function(item) {' +
    '    var div = document.createElement(\'div\');' +
    '    div.className = \'item\';' +
    '    div.innerHTML = \'\' +' +
    '      \'<span class="cell-value">\' + item.cellValue + \'</span>\' +' +
    '      \'<button onclick="moveRow(\\\'\' + item.cellName + \'\\\', \\\'up\\\')">Up</button>\' +' +
    '      \'<button onclick="moveRow(\\\'\' + item.cellName + \'\\\', \\\'down\\\')">Down</button>\';' +
    '    container.appendChild(div);' +
    '  });' +
    '}' +
    'setInterval(function() {' +
    '  google.script.run.withSuccessHandler(updateContent).getCellDataStartingWithBlock();' +
    '}, 1000);' +
    '</script>' +
    '</body>' +
    '</html>'
  ).setWidth(300).setHeight(200);

  SpreadsheetApp.getUi().showModalDialog(htmlOutput, 'Cell Values Starting with "block"');
}

function moveRow(cellName, direction) {
  var sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
  var cellRow = parseInt(cellName.substring(1));

  if (direction === 'up') {
    var targetRow = findPreviousBlock(cellRow);
  } else if (direction === 'down') {
    var targetRow = findNextBlock(cellRow);
  }

  if (targetRow) {
    var numColumns = sheet.getLastColumn();
    var sourceRange = sheet.getRange(cellRow, 1, 1, numColumns);
    var targetRange = sheet.getRange(targetRow, 1, 1, numColumns);

    // Get the values from both rows
    var sourceValues = sourceRange.getValues();
    var targetValues = targetRange.getValues();

    // Swap the row values
    sourceRange.setValues(targetValues);
    targetRange.setValues(sourceValues);
  }
}

function findPreviousBlock(startRow) {
  var sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
  for (var row = startRow - 1; row >= 1; row--) {
    var cellValue = sheet.getRange(row, 1).getValue().toString();
    if (cellValue.toLowerCase().startsWith("block")) {
      return row;
    }
  }
  return null;
}

function findNextBlock(startRow) {
  var sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
  var lastRow = sheet.getLastRow();
  for (var row = startRow + 1; row <= lastRow; row++) {
    var cellValue = sheet.getRange(row, 1).getValue().toString();
    if (cellValue.toLowerCase().startsWith("block")) {
      return row;
    }
  }
  return null;
}

function getCellDataStartingWithBlock() {
  var sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
  var range = sheet.getRange("A1:A" + sheet.getLastRow());
  var cellValues = range.getValues();
  var cellDataStartingWithBlock = [];

  for (var i = 0; i < cellValues.length; i++) {
    var cellValue = cellValues[i][0].toString();
    if (cellValue.toLowerCase().startsWith("block")) {
      var cellName = "A" + (i + 1);
      cellDataStartingWithBlock.push({ cellName: cellName, cellValue: cellValue });
    }
  }

  return cellDataStartingWithBlock;
}
