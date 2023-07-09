function jsonCleanup(response) {
    var jsonData = {};

    var sheets = response.sheets;
    for (var i = 0; i < sheets.length; i++) {
      var sheetData = sheets[i].data[0].rowData;
      var sheetName = sheets[i].properties.title;

      var sheetObj = {};
      for (var j = 0; j < sheetData.length; j++) {
        var rowData = sheetData[j].values;
        if (rowData && rowData.length > 1) {
          var fieldA = rowData[0] ? rowData[0].formattedValue : '';

          if (fieldA) {
            var fieldArray = rowData.slice(1).map(function(cell) {
              return cell && cell.formattedValue !== null ? cell.formattedValue : undefined;
            }).filter(function(value) {
              return value !== undefined;
            });

            if (fieldArray.length > 0) {
              sheetObj[fieldA] = fieldArray;
            }
          }
        }
      }

      if (Object.keys(sheetObj).length > 0) {
        jsonData[sheetName] = sheetObj;
      }
    }

    createDivsFromBlocks(jsonData);
  }

  function fetchSheetAsJSON() {
    var apiKey = 'AIzaSyCNb3QEXaLYWUI3gVY-LOn0jKj1kcpT_e0'; // Replace with your API key
    var spreadsheetId = '1XTPqQhuETtk8WFFS6IN2q9HRmQPdyFQe5pF5fs1zji4'; // Replace with your spreadsheet ID

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

  
  // Fetch the Google Sheets data as JSON for all sheets on page load
  fetchSheetAsJSON();




  function createDivsFromBlocks(jsonData) {
    console.log(jsonData);
    const hoofdpagina = jsonData.Hoofdpagina;
  
    // Iterate over the properties of the Hoofdpagina
    for (const key in hoofdpagina) {
      if (key.startsWith('block')) {
        const block = hoofdpagina[key];
        const blockClass = block[0];
  
        // Create a div element for each block
        const div = document.createElement('div');
        div.className = blockClass;
  
        // Use the first value of the block array
        const span = document.createElement('span');
        span.textContent = block[1];
        div.appendChild(span);
  
        // Append the div to the document body
        document.body.appendChild(div);
      }
    }
  }
  
 