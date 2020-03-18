let copyCommand = "copy text";
let message = "Copy";
let message2 = "Get Text";
let message3 = "Text";
let message4 = "Save";
let currentText = "I-I_I-I SUCK";
let keys = ["number", "deviation", "overlay", "double", "space", "english", "chaotic", "upper", "text"];
let defaults = [10, 0, 0.5, 0.5, false, true, true, 0.5, "I-I_I-I SUCK"];

for (let i = 0; i < keys.length; i++) {
  chrome.storage.sync.get(keys[i], items => {
    if (items[keys[i]] === undefined) {
      let items = {};
      items[keys[i]] = defaults[i];
      chrome.storage.sync.set(items, () => {});
    }
  });
}

chrome.storage.sync.get(keys[8], items => {
  if (items[keys[8]] !== undefined) {
    currentText = items[keys[8]];
  }
});

chrome.commands.onCommand.addListener(command => {
  if (command == copyCommand) {
    chrome.runtime.sendMessage(message, () => {});
  }
});

chrome.runtime.onMessage.addListener((msg, _, response) => {
  if (msg == message2) {
    response();
    chrome.runtime.sendMessage({message: message3, text: currentText}, () => {});
  }
  else if (msg.message == message4) {
    response();
    currentText = msg.text;
    let items = {};
    items[keys[8]] = currentText;
    chrome.storage.sync.set(items, () => {});
  }
});