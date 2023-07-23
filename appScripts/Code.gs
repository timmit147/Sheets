function onEdit(e) {
  var url = "https://api.github.com/repos/timmit147/sheets/dispatches";
  var accessToken = "";
  var eventType = "update_sheets_data";

  var payload = {
    event_type: eventType
  };

  var options = {
    method: "post",
    headers: {
      "Authorization": "Bearer " + accessToken,
      "Accept": "application/vnd.github.everest-preview+json"
    },
    payload: JSON.stringify(payload)
  };

  UrlFetchApp.fetch(url, options);
}
