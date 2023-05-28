const wordAPI = "https://words.dev-apis.com/word-of-the-day?random=1";

const checkAPI = "https://words.dev-apis.com/validate-word";

const grid = document.querySelector(".grid");

const rows = document.querySelectorAll(".row");

const head = document.querySelector("h1");

const winbox = document.getElementById("win-box");

var cur = 0;

var guessCount = 0;

var currentGuess = rows[guessCount];

var word = "";

async function init() {
  setMyKeyDownListener();
  const res = await fetch(wordAPI);
  const resObj = await res.json();
  word = resObj.word.toUpperCase();
}

function setMyKeyDownListener() {
  window.addEventListener("keydown", function (event) {
    MyFunction(event.key);
  });
}

function MyFunction(the_Key) {
  if (the_Key === "Enter" && cur == 5) {
    submit();
  }
  if (the_Key === "Backspace") {
    if (cur > 0) {
      cur -= 1;
    }
    currentGuess.children[cur].innerHTML = "";
  } else if (isLetter(the_Key)) {
    var key = the_Key.toUpperCase();
    currentGuess.children[cur].innerHTML = key;
    cur += 1;
  }
}

function isLetter(letter) {
  return /^[a-zA-Z]$/.test(letter);
}

var submittedWord = "";

async function submit() {
  for (const child of currentGuess.children) {
    submittedWord += child.innerHTML;
  }
  var isVerified = await verifyWord(submittedWord);
  if (isVerified) {
    checkWord();
  } else {
    blink();
    submittedWord = "";
  }
}

function blink() {
  for (const child of currentGuess.children) {
    child.classList.add("invalid");
  }
  setTimeout(function () {
    for (const child of currentGuess.children) {
      child.classList.remove("invalid");
    }
  }, 100);
}

async function checkWord() {
  if (submittedWord === word) {
    winner();
  }
  for (var i = 0; i < 5; i++) {
    if (submittedWord.charAt(i) == word.charAt(i)) {
      currentGuess.children[i].className = "letter correct";
    } else if (word.includes(submittedWord.charAt(i))) {
      currentGuess.children[i].className = "letter similar";
    } else {
      currentGuess.children[i].className = "letter wrong";
    }
  }
  if (guessCount < 5) {
    submittedWord = "";
    guessCount += 1;
    cur = 0;
    currentGuess = rows[guessCount];
    isVerified = false;
  } else if (submittedWord !== word) {
    loser();
  }
}

async function verifyWord(value) {
  const res = await fetch(checkAPI, {
    method: "POST",
    body: JSON.stringify({ word: value }),
  });
  const resObj = await res.json();
  const { validWord } = resObj;
  return validWord;
}

function loser() {
  winbox.innerHTML = "You lose! The word was: " + word;
}
function winner() {
  winbox.innerHTML = "You win! The word was: " + word;
  head.className = "rainbow";
}
