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
            var propertyName = fieldA;
            var count = 1;
          
            while (sheetObj.hasOwnProperty(propertyName)) {
              propertyName = fieldA + count;
              count++;
            }
          
            var fieldArray = rowData.slice(1).map(function(cell) {
              return cell && cell.formattedValue !== null ? cell.formattedValue : undefined;
            }).filter(function(value) {
              return value !== undefined;
            });
          
            if (fieldArray.length > 0) {
              sheetObj[propertyName] = fieldArray;
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

function createDivsFromBlocks(jsonData) {
    console.log(jsonData);
    const hoofdpagina = jsonData.Hoofdpagina;
  
    // // Iterate over the properties of the Hoofdpagina
    for (const key in hoofdpagina) {
      if (key.startsWith('block')) {
      
        const modifiedKey = key.replace(/\d+/g, '');

        fetch(`./blocks/${modifiedKey}/block.html`)
        .then(response => response.text())
        .then(htmlContent => {
          document.body.insertAdjacentHTML('beforeend', htmlContent);
        })
        .catch(error => {
          console.error('Error fetching block.html:', error);
        });
      
        if (!/\d/.test(key)) {
          document.head.innerHTML += `<link rel="stylesheet" href="blocks/${key}/style.css">`;
        
          const json = hoofdpagina[key];
          const script = document.createElement('script');
          script.src = `blocks/${key}/script.js`;
          script.setAttribute('data-json', JSON.stringify(json));
          document.head.appendChild(script);
        }
        
      
    }
  }
}

fetchSheetAsJSON();
  
