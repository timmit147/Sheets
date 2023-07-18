function jsonCleanup(response) {
  var jsonData = {};

  var sheets = response.sheets;
  for (var i = 0; i < sheets.length; i++) {
    var sheetData = sheets[i].data[0].rowData;
    var sheetName = sheets[i].properties.title;

    var sheetObj = {};
    var sheetArr = []; // Array to maintain the order of properties

    for (var j = 0; j < sheetData.length; j++) {
      var rowData = sheetData[j].values;
      if (rowData && rowData.length > 1) {
        var fieldA = rowData[0] ? rowData[0].formattedValue : '';

        if (fieldA) {
          var propertyName = fieldA;
          var count = 1;

          while (sheetObj.hasOwnProperty(propertyName)) {
            propertyName = fieldA + count;
            count++;
          }

          var fieldArray = rowData.slice(1).map(function (cell) {
            var formattedValue = cell && cell.formattedValue !== null ? cell.formattedValue : undefined;
            var runs = cell && cell.textFormatRuns;

            if (formattedValue && runs && runs.length > 0) {
              var formattedText = '';
              var currentIndex = 0;
              var formatTagsStack = [];

              for (var k = 0; k < runs.length; k++) {
                var range = runs[k];
                var startIndex = range.startIndex || 0;
                var endIndex = (runs[k + 1] && runs[k + 1].startIndex) || formattedValue.length;

                if (startIndex > currentIndex) {
                  formattedText += formattedValue.substring(currentIndex, startIndex);
                }

                if (range.format) {
                  var formatTags = '';

                  if (range.format.bold) {
                    formatTags += '<strong>';
                    formatTagsStack.push('</strong>');
                  }
                  if (range.format.italic) {
                    formatTags += '<em>';
                    formatTagsStack.push('</em>');
                  }
                  if (range.format.strikethrough) {
                    formatTags += '<s>';
                    formatTagsStack.push('</s>');
                  }
                  if (range.format.underline) {
                    formatTags += '<u>';
                    formatTagsStack.push('</u>');
                  }

                  formattedText += formatTags;
                }

                formattedText += formattedValue.substring(startIndex, endIndex);

                while (formatTagsStack.length > 0) {
                  formattedText += formatTagsStack.pop();
                }

                currentIndex = endIndex;
              }

              if (currentIndex < formattedValue.length) {
                formattedText += formattedValue.substring(currentIndex);
              }

              formattedValue = formattedText;
            }

            return formattedValue;
          }).filter(function (value) {
            return value !== undefined;
          });

          if (fieldArray.length > 0) {
            sheetObj[propertyName] = fieldArray;
            sheetArr.push(propertyName); // Add property name to the array
          }
        }
      }
    }

    if (sheetArr.length > 0) {
      jsonData[sheetName] = { properties: sheetArr, data: sheetObj };
    }
  }

  createDivsFromBlocks(jsonData);
  console.log(jsonData);
}




function fetchSheetAsJSON() {
  var apiKey = localStorage.getItem('API_KEY') || 'AIzaSyCNb3QEXaLYWUI3gVY-LOn0jKj1kcpT_e0';
  var spreadsheetId = localStorage.getItem('SPREADSHEET_ID') || '1XTPqQhuETtk8WFFS6IN2q9HRmQPdyFQe5pF5fs1zji4';
  var sheetUrl = `https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}?includeGridData=true&key=${apiKey}`;

    fetch(sheetUrl)
      .then(function(response) {
        if (!response.ok) {
          throw new Error('Failed to fetch Google Sheets data');
        }
        return response.json();
      })
      .then(function(data) {
        jsonCleanup(data);
      })
      .catch(function(error) {
        var errorMessage = 'Error fetching Google Sheets data: ' + error.message;
        var errorContainer = document.getElementById('data-container');
        errorContainer.textContent = errorMessage;
      });
}

async function createDivsFromBlocks(jsonData) {
  const hoofdpagina = jsonData.Hoofdpagina;
  const sheetArr = hoofdpagina.properties;

  for (const propertyName of sheetArr) {
    if (propertyName.startsWith('block')) {
      const modifiedPropertyName = propertyName.replace(/\d+/g, '');

      try {
        await fetchBlockHtml(modifiedPropertyName);
      } catch (error) {
        console.error('Error fetching block.html:', error);
      }

      try {
        await fetchAndExecuteScript(modifiedPropertyName, propertyName, hoofdpagina);
      } catch (error) {
        console.error('Error fetching and executing script:', error);
      }
    }
  }
}

async function fetchBlockHtml(modifiedPropertyName) {
  const response = await fetch(`./blocks/${modifiedPropertyName}/block.html`);
  const htmlContent = await response.text();
  document.body.insertAdjacentHTML('beforeend', htmlContent);
}

async function fetchAndExecuteScript(modifiedPropertyName, propertyName, hoofdpagina) {
  if (!/\d/.test(propertyName)) {
    const cssUrl = `blocks/${modifiedPropertyName}/style.css`;
    const linkElement = document.createElement('link');
    linkElement.rel = 'stylesheet';
    linkElement.href = cssUrl;

    // Create a promise that resolves when the CSS is loaded
    const cssLoadedPromise = new Promise((resolve) => {
      linkElement.onload = resolve;
    });

    document.head.appendChild(linkElement);

    // Wait for the CSS to load before executing the script
    await cssLoadedPromise;
  }

  const scriptUrl = `blocks/${modifiedPropertyName}/script.js`;
  try {
    await runScriptFromFile(scriptUrl, propertyName, hoofdpagina);
  } catch (error) {
    console.error('Error fetching and executing script:', error);
  }
}


function runScriptFromFile(fileUrl, propertyName, hoofdpagina) {
  const data = hoofdpagina.data[propertyName];
  data.unshift(propertyName);

  return fetch(fileUrl)
    .then(response => response.text())
    .then(scriptCode => {
      // Execute the script code
      eval(scriptCode); // or use new Function(scriptCode)();
      if (typeof main === 'function') {
        return main();
      } else {
        return null; // Modify or remove this line as needed
      }
    })
    .catch(error => {
      console.error('Error fetching and executing script:', error);
    });
}


fetchSheetAsJSON();
  
