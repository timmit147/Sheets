const json = document.currentScript.getAttribute('data-json');
const data = JSON.parse(json);
console.log(data[0]);

const h1Element = document.querySelector('.blockContent h1');
h1Element.textContent = data[0];

const pElement = document.querySelector('.blockContent p');
pElement.textContent = data[1];