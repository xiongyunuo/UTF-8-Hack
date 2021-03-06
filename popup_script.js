let textfieldId = "text-field";
let resultId = "result";
let buttonId = "copy";
let button2Id = "regenerate";
let resultP = null;
let message = "Copy";
let message2 = "Get Text";
let message3 = "Text";
let message4 = "Save";
let keys = ["number", "deviation", "overlay", "double", "space", "english", "chaotic", "upper"];
let values = [];

const stringFromUTF8Array = function(data) {
  const extraByteMap = [1, 1, 1, 1, 2, 2, 3, 0];
  let count = data.length;
  let str = "";
  
  for (let index = 0; index < count;) {
    let ch = data[index++];
    if (ch & 0x80) {
      let extra = extraByteMap[(ch >> 3) & 0x07];
      if (!(ch & 0x40) || !extra || ((index + extra) > count))
        return null;
      
      ch = ch & (0x3F >> extra);
      for (; extra > 0; extra -= 1) {
        let chx = data[index++];
        if ((chx & 0xC0) != 0x80)
          return null;
        ch = (ch << 6) | (chx & 0x3F);
      }
    }
    str += String.fromCharCode(ch);
  }
  return str;
};

const randomInteger = function(from, to) {
  return Math.floor(Math.random() * (to - from + 1)) + from;
};

const randomIntegerFromGroup = function(groups) {
  let total = 0;
  for (let i = 0; i < groups.length; i++) {
    total += groups[i][1] - groups[i][0] + 1;
  }
  let random = Math.random();
  let index = 0;
  let total2 = 0;
  while (index < groups.length - 1) {
    total2 += groups[index][1] - groups[index][0] + 1;
    if (random <= total2 / total) {
      break;
    }
    index += 1;
  }
  return [groups[index][2], randomInteger(groups[index][0], groups[index][1])];
};

const randomUpperAccent = function() {
  return randomIntegerFromGroup([[0x80, 0x94, 0xcc]]);
};

const randomLowerAccent = function() {
  return randomIntegerFromGroup([[0xa9, 0xb3, 0xcc]]);
};

const allAccents = [[0x80, 0xb3, 0xcc], [0xb9, 0xbf, 0xcc], [0x80, 0x9b, 0xcd], [0xa3, 0xaf, 0xcd]];
const accents = [[0x80, 0x95, 0xcc], [0x9a, 0x9b, 0xcc], [0xbd, 0xbf, 0xcc], [0x80, 0x84, 0xcd], [0x86, 0x86, 0xcd], [0x8a, 0x8c, 0xcd], [0x90, 0x92, 0xcd], [0x97, 0x98, 0xcd], [0x9b, 0x9b, 0xcd], [0x9d, 0x9e, 0xcd], [0xa0, 0xa1, 0xcd], [0xa3, 0xaf, 0xcd]];
const accents2 = [[0x96, 0x99, 0xcc], [0x9c, 0xb3, 0xcc], [0xb9, 0xbc, 0xcc], [0x85, 0x85, 0xcd], [0x87, 0x89, 0xcd], [0x8d, 0x8f, 0xcd], [0x93, 0x96, 0xcd], [0x99, 0x9a, 0xcd], [0x9c, 0x9c, 0xcd], [0x9f, 0x9f, 0xcd], [0xa2, 0xa2, 0xcd]];

const randomAccent = function() {
  return randomIntegerFromGroup(allAccents);
};

const randomAccent2 = function() {
  return randomIntegerFromGroup(accents);
};

const randomAccent3 = function() {
  return randomIntegerFromGroup(accents2);
};

const randomOverlay = function() {
  return [0xcc, randomInteger(0xb4, 0xb8)];
};

const randomDouble = function() {
  return [0xcd, randomInteger(0x9c, 0xa2)];
};

const pushAccent = function(array, accent) {
  for (let k = 0; k < accent.length; k++) {
    array.push(accent[k]);
  }
};

const isEnglish = function(char) {
  return (char >= "a".charCodeAt(0) && char <= "z".charCodeAt(0)) || (char >= "A".charCodeAt(0) && char <= "Z".charCodeAt(0));
};

const generateSpam = function(value) {
  let array = [];
    for (let i = 0; i < value.length; i++) {
      array.push(value.charCodeAt(i));
      if ((value.charCodeAt(i) == " ".charCodeAt(0) && !values[4]) || (value.charCodeAt(i) != " ".charCodeAt(0) && values[5] && !isEnglish(value.charCodeAt(i)))) {
        continue;
      }
      let random = Math.random();
      if (random < values[2]) {
        pushAccent(array, randomOverlay());
      }
      let random2 = Math.random();
      if (random2 < values[3]) {
        pushAccent(array, randomDouble());
      }
      let number = values[0] + (Math.random() * 2 - 1) * values[1];
      let number2 = number * values[7];
      for (let j = 0; j < number; j++) {
        if (j < number2) {
          if (!values[6]) {
            pushAccent(array, randomUpperAccent());
          }
          else {
            pushAccent(array, randomAccent2());
          }
        }
        else {
          if (!values[6]) {
            pushAccent(array, randomLowerAccent());
          }
          else {
            pushAccent(array, randomAccent3());
          }
        }
      }
    }
    return stringFromUTF8Array(array);
};

const copyToClipboard = function(str) {
  const el = document.createElement('textarea');
  el.value = str;
  el.setAttribute('readonly', '');
  el.style.position = 'absolute';
  el.style.left = '-9999px';
  document.body.appendChild(el);
  const selected =
    document.getSelection().rangeCount > 0
      ? document.getSelection().getRangeAt(0)
      : false;
  el.select();
  document.execCommand('copy');
  document.body.removeChild(el);
  if (selected) {
    document.getSelection().removeAllRanges();
    document.getSelection().addRange(selected);
  }
};

for (let i = 0; i < keys.length; i++) {
  chrome.storage.sync.get(keys[i], items => {
    values.push(items[keys[i]]);
  });
}

document.addEventListener("DOMContentLoaded", () => {
  resultP = document.getElementById(resultId);
  let textfield = document.getElementById(textfieldId);
  textfield.addEventListener("input", () => {
    let value = textfield.value;
    chrome.runtime.sendMessage({message: message4, text: value}, () => {});
    resultP.innerText = generateSpam(value);
  });
  let button = document.getElementById(buttonId);
  button.addEventListener("click", () => {
    copyToClipboard(resultP.innerText);
  });
  let button2 = document.getElementById(button2Id);
  button2.addEventListener("click", () => {
    let value = textfield.value;
    resultP.innerText = generateSpam(value);
  });
  chrome.runtime.sendMessage(message2, () => {});
});

chrome.runtime.onMessage.addListener((msg, _, response) => {
  if (msg == message) {
    response();
    copyToClipboard(resultP.innerText);
  }
  else if (msg.message == message3) {
    response();
    let textfield = document.getElementById(textfieldId);
    textfield.value = msg.text;
    resultP.innerText = generateSpam(textfield.value);
  }
});