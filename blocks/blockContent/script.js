const divElement = document.querySelector(`.block`);
divElement.setAttribute('id', data[0]);
divElement.setAttribute('class', "blockContent");

const h1Element = document.querySelector(`#${data[0]} h1`);
h1Element.innerHTML = data[1];

const pElement = document.querySelector(`#${data[0]} p`);
pElement.innerHTML = data[2];