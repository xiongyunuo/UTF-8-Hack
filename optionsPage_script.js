let saveButtonID = "save";
let numberID = "number";
let deviationID = "deviation";
let overlayID = "overlay";
let doubleID = "double";
let spaceID = "space";
let englishID = "english";
let chaoticID = "chaotic";
let upperID = "upper";
let items = {};
let keys = ["number", "deviation", "overlay", "double", "upper", "space", "english", "chaotic"];
let elements = [];

const updateOptions = function() {
  for (let i = 0; i < keys.length; i++) {
    chrome.storage.sync.get(keys[i], items => {
      if (i < 5) {
        elements[i].value = items[keys[i]];
      }
      else {
        elements[i].checked = items[keys[i]];
      }
    });
  }
};

document.addEventListener("DOMContentLoaded", () => {
  elements.push(document.getElementById(numberID));
  elements.push(document.getElementById(deviationID));
  elements.push(document.getElementById(overlayID));
  elements.push(document.getElementById(doubleID));
  elements.push(document.getElementById(upperID));
  elements.push(document.getElementById(spaceID));
  elements.push(document.getElementById(englishID));
  elements.push(document.getElementById(chaoticID));
  updateOptions();
	let saveButton = document.getElementById(saveButtonID);
	saveButton.addEventListener("click", () => {
    let number = Math.floor(Number(elements[0].value));
    let deviation = Number(elements[1].value);
    let overlay = Number(elements[2].value);
    let double = Number(elements[3].value);
    let upper = Number(elements[4].value);
    if (number !== NaN && number >= 0) {
      items[keys[0]] = number;
    }
    if (deviation !== NaN) {
      items[keys[1]] = deviation;
    }
    if (overlay !== NaN && overlay >= 0 && overlay <= 1) {
      items[keys[2]] = overlay;
    }
    if (double !== NaN && double >= 0 && double <= 1) {
      items[keys[3]] = double;
    }
    if (upper !== NaN && upper >= 0 && upper <= 1) {
      items[keys[4]] = upper;
    }
    items[keys[5]] = elements[5].checked;
    items[keys[6]] = elements[6].checked;
    items[keys[7]] = elements[7].checked;
    chrome.storage.sync.set(items, () => { updateOptions(); });
	});
});