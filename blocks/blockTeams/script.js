const divElement = document.querySelector(`.block`);
divElement.setAttribute('id', data[0]);
divElement.setAttribute('class', "blockTeams");

// Get the container div for team blocks
const blockTeams = document.getElementById(data[0]);

// Loop through the JSON data and create the person blocks
for (let i = 1; i < data.length; i += 4) {
  // Create the div for each person
  const personDiv = document.createElement('div');

  // Create the image element
  const image = document.createElement('img');
  image.src = data[i + 3];
  image.alt = data[i];

  // Create the h3 element for name
  const nameHeading = document.createElement('h3');
  nameHeading.textContent = data[i];

  // Create the p element for position
  const positionPara = document.createElement('p');
  positionPara.textContent = data[i + 1];

  // Create the p element for the text
  const textPara = document.createElement('p');
  textPara.innerHTML = data[i + 2];

  // Append the elements to the person div
  personDiv.appendChild(image);
  personDiv.appendChild(nameHeading);
  personDiv.appendChild(positionPara);
  personDiv.appendChild(textPara);

  // Append the person div to the container div
  blockTeams.appendChild(personDiv);

}