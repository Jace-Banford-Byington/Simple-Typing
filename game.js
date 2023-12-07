// define the time limit
let TIME_LIMIT = 60;

// selecting required elements
let timer_text = document.querySelector(".curr_time");
let accuracy_text = document.querySelector(".curr_accuracy");
let error_text = document.querySelector(".curr_errors");
let cpm_text = document.querySelector(".curr_cpm");
let wpm_text = document.querySelector(".curr_wpm");
let quote_text = document.querySelector(".quote");
let input_area = document.querySelector(".input_area");
let restart_btn = document.querySelector(".restart_btn");
let cpm_group = document.querySelector(".cpm");
let wpm_group = document.querySelector(".wpm");
let error_group = document.querySelector(".errors");
let accuracy_group = document.querySelector(".accuracy");
let sentences_text = document.querySelector(".sentencesTyped")
let sentences_group = document.querySelector(".sentences")



let timeLeft = TIME_LIMIT;
let timeElapsed = 0;
let total_errors = 0;
let errors = 0;
let accuracy = 0;
let characterTyped = 0;
let current_quote = "";
let quoteNo = 0;
let timer = null;
let wordTyped = 0;
let sentencesTyped = 0;


async function fetchQuotes(){
  try{
    const response = await fetch('https://api.api-ninjas.com/v1/quotes', {
      headers: {
        'Content-Type': 'application/json',
        'X-Api-Key': '1Hd3m1qKNC2hFndMqeMxvA==FHluwqsEJqZu8eby'
      }
    });
    const data = await response.json();
    // console.log("Data", data )
    return data[0];
  }
  catch(err){
    console.error("Error fetching the quote, ", err)
    return ''; //returns empty string in case of error
  }
}


async function updateQuote() {
  quote_text.textContent = null;
  const newQuote = await fetchQuotes();
  // console.log("New Quote", newQuote);
  // console.log("New Quote.Quote", newQuote.quote)
  current_quote = newQuote.quote + " By: " + newQuote.author;

  // console.log("Current Quote", current_quote);


  // separate each character and make an element 
  // out of each of them to individually style them
  current_quote.split('').forEach(char => {
    const charSpan = document.createElement('span')
    charSpan.innerText = char
    quote_text.appendChild(charSpan)
  })
}

function processCurrentText() {

  // get current input text and split it
  curr_input = input_area.value;
  curr_input_array = curr_input.split('');

  // increment total characters typed
  characterTyped++;


  errors = 0;


quoteSpanArray = quote_text.querySelectorAll('span');
  quoteSpanArray.forEach((char, index) => {
    let typedChar = curr_input_array[index]
    
  

    
    // characters not currently typed
    if (typedChar == null) {
      char.classList.remove('correct_char');
      char.classList.remove('incorrect_char');

      // correct characters
    } else if (typedChar === char.innerText) {
      char.classList.add('correct_char');
      char.classList.remove('incorrect_char');

      // incorrect characters
    } else {
      char.classList.add('incorrect_char');
      char.classList.remove('correct_char');

      // increment number of errors
      errors++;
    }

  });

  // display the number of errors
  error_text.textContent = total_errors + errors;

  // update accuracy text
  let correctCharacters = (characterTyped - (total_errors + errors));
  let accuracyVal = ((correctCharacters / characterTyped) * 100);
  accuracy_text.textContent = Math.round(accuracyVal) + '%';




  //calculate wpm text
  let currentTime = timeElapsed / 60;
  wpm = Math.round((wordTyped / currentTime));
  wpm_text.textContent = wpm;

    ////////////Function logic from ChatGPT///////////////////
    wpm = Math.round((wordTyped / currentTime));
    wpm_text.textContent = wpm;
    /////////////////////////////////////////////////////////


  // // handle sentence count
  // if (curr_input.length > 0) {
  //   let lastChar = curr_input_array[curr_input.length - 1];
  //   if (lastChar === '.') {
  //     sentencesTyped++;
  //     sentences_text.textContent = sentencesTyped;
  //   }
  // }


  // if current text is completely typed
  // irrespective of errors
  if (curr_input.length == current_quote.length) {
    updateQuote();

    // update total errors
    total_errors += errors;

    // clear the input area
    input_area.value = "";
  }
}

function updateTimer() {
  if (timeLeft > 0) {
    // decrease the current time left
    timeLeft--;

    // increase the time elapsed
    timeElapsed++;

    // update the timer text
    timer_text.textContent = timeLeft + "s";
  }
  else {
    // finish the game
    finishGame();
  }
}

function finishGame() {
  // stop the timer
  clearInterval(timer);

  // disable the input area
  input_area.disabled = true;

  // show finishing text
  quote_text.textContent = "Click on restart to start a new game.";

  // display restart button
  restart_btn.style.display = "block";

  // calculate cpm and wpm
  cpm = Math.round(((characterTyped / timeElapsed) * 60));

  // update cpm and wpm text
  cpm_text.textContent = cpm;

  // display the cpm and wpm
  cpm_group.style.display = "block";
  wpm_group.style.display = "block";
}


function startGame() {

  resetValues();
  updateQuote();


  input_area.addEventListener('input', function (e) {
    // Handle space bar
    if (e.data === ' ') {
      // Increment total words typed
      wordTyped++;
      wpm_text.textContent = wordTyped;
    }
  
// Check for period key
let lastChar = curr_input.charAt(curr_input.length - 1);
if (lastChar === '.') {
  // Increase sentences
  sentencesTyped++;
  sentences_text.textContent = sentencesTyped;
}

// Check for deletion of a period
if (e.inputType === 'deleteContentBackward') {
  let lastCharIndex = input_area.selectionStart;
  let deletedChar = input_area.value[lastCharIndex - 1];

  if (deletedChar === '.') {
    sentencesTyped--;
    sentences_text.textContent = sentencesTyped;
  }
}

  
    processCurrentText();
  });


  // clear old and start a new timer
  clearInterval(timer);
  timer = setInterval(updateTimer, 1000);
}

function resetValues() {
  timeLeft = TIME_LIMIT;
  timeElapsed = 0;
  errors = 0;
  total_errors = 0;
  accuracy = 0;
  characterTyped = 0;
  quoteNo = 0;
  input_area.disabled = false;
  sentencesTyped = 0;
  
  sentences_text.textContent = 0;
  input_area.value = "";
  quote_text.textContent = 'Click on the area below to start the game.';
  accuracy_text.textContent = 100;
  timer_text.textContent = timeLeft + 's';
  error_text.textContent = 0;
  restart_btn.style.display = "none";
  cpm_group.style.display = "none";
 

}
