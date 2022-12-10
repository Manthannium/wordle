import { myDictionary } from './dictionary.js';
// console.log(myDictionary.length); Total 7404 words

// Import and load audio files 
var type_audio = new Audio('../audio/select.mp3');
var bell_audio = new Audio('../audio/bell.mp3');
var bell4_audio = new Audio('../audio/bell4.mp3');
var cong_audio = new Audio('../audio/cong.mp3');
type_audio.load();
bell_audio.load();
cong_audio.load();

// keyboard map (key -> status)
var keyboard = new Map([
    ['q',0],['w',0] ,['e',0],['r',0],['t',0] ,['y',0],['u',0],['i',0] ,['o',0],['p',0],
    ['a',0],['s',0] ,['d',0],['f',0],['g',0] ,['h',0],['j',0],['k',0] ,['l',0],
    ['z',0],['x',0] ,['c',0],['v',0],['b',0] ,['n',0],['m',0]
]);

function getSecretWord() {
    // run till non repeated lettered word is found
    var secWord = "crane";
    while(1) {
        secWord = myDictionary[Math.floor(Math.random() * myDictionary.length)];
        console.log(secWord);

        const myset = new Set();
        for(let j=0; j < 5; ++j) {
            myset.add(secWord[j]);
        }

        if(myset.size == 5) {
            return secWord;
        }
    }
}

const state = {
    // secret is random word from dictionary
    secret: getSecretWord(),
    grid: Array(6)
        .fill()
        .map(() => Array(5).fill('')),
    
    // default starting cursor
    currentRow: 0,
    currentCol: 0,
    greenpoints: 0,
    yellowpoints: 0,
    hinted: 0,
    scored: 0,
    score: 0,
};

function drawGrid(container) {
    const grid = document.createElement('div');
    grid.className = 'grid';

    // create game grid
    for(let i=0; i<6; i++) {
        for(let j=0; j<5; j++) {
            drawBox(grid,i,j);
        }
    }
    container.appendChild(grid);
}

function updateGrid() {
    for(let i=0; i < state.grid.length; i++) {
        for(let j=0; j < state.grid[i].length; j++) {
            const box = document.getElementById(`box${i}${j}`);
            box.textContent = state.grid[i][j];
        }
    }
}

function drawBox(container, row, col, letter = '') {
    const box = document.createElement('div');
    box.className = 'box';
    box.id = `box${row}${col}`;
    box.textContent = letter;
    
    container.appendChild(box);
    return box;
}

// === SCORING SCHEME  ===
// Guess in early trial will boost your score by 20 points
// green points will increment your score with factor 4
// yellow points will increment your score with factor 2
// if you take n hints your score will be divided by n+1
function getScore() {
    let x = state.currentRow;
    let y = state.greenpoints;
    let z = state.yellowpoints;
    let t = state.hinted;

    let gscore = (2*(10*(7-x) + 2*y + z - 20))/(1 + t);
    return gscore.toFixed();
}

// physical keyboard input
function registerKeyboardEvents() {
    document.body.onkeydown = (e) => {   // e is event object
        const key = e.key;
        if(key === 'Enter') {
            if(state.scored == 1) window.location.reload();
            if(state.currentCol === 5) {
                const word = getCurrentWord();
                if(!isWordValid(word)) alert('Invalid word');
                else {
                    revealWord(word);
                    state.currentRow++;
                    state.currentCol = 0;
                }
            }
        }
        if(key === 'Backspace' || key === 'Delete') removeLetter();
        if(isLetter(key)) addLetter(key);
        updateGrid();
    };
}

function getCurrentWord() {
    // we will use reduce function
    return state.grid[state.currentRow].reduce((prev, curr) => prev + curr);
}

// checks if typed word is there in dictionary
function isWordValid(word) {
    return myDictionary.includes(word);
}

function revealWord(guess) {
    const row = state.currentRow;
    const animation_duration = 500;  // in miliseconds

    // color mark the guessed word
    for(let i=0; i<5; i++) {
        const box = document.getElementById(`box${row}${i}`);
        const letter = box.textContent;

        setTimeout(() => {
            if(letter === state.secret[i]) {
                state.greenpoints++;
                keyboard.set(letter, 1);
                box.classList.add('right');
                changeLetter(letter.toUpperCase(),"green");
            } else if(state.secret.includes(letter)) {
                if(keyboard.get(letter) != 1) {
                    state.yellowpoints++;
                    keyboard.set(letter, 2);
                    changeLetter(letter.toUpperCase(),"yellow");
                }
                box.classList.add('wrong');
            } else {
                keyboard.set(letter, 3);
                box.classList.add('empty');
                changeLetter(letter.toUpperCase(),"gray");
            }
        }, ((i+1) * animation_duration) / 2);
        
        if(state.secret == guess) box.classList.add('jiggle');
        else box.classList.add('animated');
        
        box.style.animationDelay = `${(i * animation_duration) / 2}ms`;
    }

    // check if guessed word is correct
    const isWinner = state.secret === guess;

    // End game
    const isGameOver = state.currentRow === 5;
    
    // because result needs to happen after all letters are revealed
    setTimeout (() => {
        if(isWinner) {
            var yourScore = getScore();
            cong_audio.play();
            alert(`CONGRATULATIONS! \n Your score : ${yourScore}`);
            state.scored = 1;
            
            // wait for 5s to reload
            setTimeout (() => {
                window.location.reload();
            }, 5000);

        } else if(isGameOver) {
            alert(`The word was ${state.secret.toUpperCase()}`);
            window.location.reload();
        }
    }, 5*animation_duration);
}

function isLetter(key) {
    // use regex for matching the key to alphabets
    return key.length === 1 && key.match(/[a-z]/i);
}

function addLetter(letter) {
    if(state.currentCol === 5) return;
    state.grid[state.currentRow][state.currentCol] = letter;
    state.currentCol++;
}

function removeLetter() {
    if(state.currentCol === 0) return;
    state.grid[state.currentRow][state.currentCol - 1] = '';
    state.currentCol--;
}

// change color of virtual keyboard letter according to status
function changeLetter(id, colorCode) {
    let key = document.getElementById(id);
    key.style.backgroundColor = colorCode;
    key.style.borderColor = colorCode;
}

var meaningHint = "Sorry, Hint not found!";
// Function to get meaning of word
function getMeaning(word) {
    let url = `https://api.dictionaryapi.dev/api/v2/entries/en/${word}`;
    fetch(url).then(response => response.json()).then(result => {
        let definitions = result[0].meanings[0].definitions[0];
        meaningHint = definitions.definition;
    }).catch(() => {
        console.log('sorry can not find');
    });
}
getMeaning(state.secret);
  
// main function
function startup() {
    // build game grid
    const game = $("#game")[0]; //document.getElementById('game');
    drawGrid(game);

    // build keyboard
    const kboard1 = $('#kboard1')[0];
    const kboard2 = $('#kboard2')[0];
    const kboard3 = $('#kboard3')[0];
    const kboard4 = $('#kboard4')[0];

    // qwerty keyboard
    let qwerty = ["Q","W","E","R","T","Y","U","I","O","P","A","S","D","F","G","H","J","K","L","Z","X","C","V","B","N","M","✂","ENTER","HINT","CLEAR"];

    // builds keyboard
    for(let j = 0; j < 30; j++) {
        let char = qwerty[j];
        const button = document.createElement('button');
        const span = document.createElement('span');
        span.style.fontSize = '20px';
        span.style.fontWeight = '600';
        
        span.appendChild(document.createTextNode(char));
        button.appendChild(span);

        if(j<10) kboard1.appendChild(button);
        else if(j<19) kboard2.appendChild(button);
        else if(j<27) kboard3.appendChild(button);
        else kboard4.appendChild(button);
        
        button.setAttribute('id', char);
        button.classList.add('keybutton');

        if(char == "✂") {
            button.style.width = '35px';
            button.style.color = 'blue';
            button.onclick = function () { 
                bell_audio.play();
    
                if(state.currentRow >= 5) {
                    state.hinted++;
    
                    // first leave these actual coorect letters
                    let temp = keyboard;
                    for(let ij=0; ij<5; ij++) {
                        temp.set(state.secret[ij], 5);
                    }
    
                    // now cancel out each empty letter
                    let alpha = "abcdefghijklmnopqrstuvwxyz";
                    for(let ij=0; ij<26; ij++) {
                        if(temp.get(alpha[ij]) == 0) {
                            let key = document.getElementById(alpha[ij].toUpperCase());
                            key.style.opacity = '0.1';
                        }
                    }
                }
                else {
                    swal("OOPS!", "Scissor will be activated in last trial","error");
                    // blurt(
                    //     'OOPS!',
                    //     'Scissor will be activated in last trial',
                    //     'success'
                    // );
                }
                
            };
        }
        else if(char == "ENTER") {
            button.style.color = 'green';
            button.style.width = '88px';
            button.onclick = function () { getLetter(char) };
        }
        else if(char == "CLEAR") {
            button.style.color = 'red';
            button.style.width = '88px';
            button.onclick = function () { getLetter(char) };
        }
        else if(char == "HINT") {
            button.style.width = '71px';
            button.style.color = 'blue';
            button.onclick = function () { 
                // bell_audio.play();
    
                if(state.currentRow >= 2) {
                    bell4_audio.play();
                    state.hinted++;
    
                    swal("HINT", meaningHint,"success");
                    // blurt({
                    //     title:'Hint',
                    //     text: meaningHint,
                    //     type: 'success',
                    //     escapable: true
                    // });
                }
                else {
                    bell_audio.play();
                    navigator.vibrate(200);
                    swal("OOPS!", "Hint will be activated after 2nd trial","error");
                    // blurt({
                    //     title:'OOPS!',
                    //     text:'Hint will be activated after 2nd trial',
                    //     type:'success',
                    //     escapable: true
                    // });
                }
                
            };
        }
        else {
            button.style.width = '35px';
            button.onclick = function () { getLetter(char) };
        }
    }

    // virtual keyboard input
    function getLetter(id) {
        type_audio.play();
        let key = document.getElementById(id).textContent;
        key = key.toLowerCase();

        if(key === 'enter') {
            if(state.scored == 1) window.location.reload();
            if(state.currentCol === 5) {
                const word = getCurrentWord();
                if(isWordValid(word)) {
                    revealWord(word);
                    state.currentRow++;
                    state.currentCol = 0;
                }
                else alert('Invalid word');
            }
        }
        if(key === 'clear') removeLetter();
        if(isLetter(key)) addLetter(key);
        updateGrid();
    }

    // for response to keys pressed
    registerKeyboardEvents();

    // disable right-click (for cheating)
    // window.addEventListener('contextmenu', (event) => {
    //     event.preventDefault()
    // })

    // writes to browser console
    console.log(state.secret);

    $("h2").on("mouseover", function() {
        $("h2").css("opacity", "0.9");
    });

    $("button").on("mouseover", function() {
        $("button").css("opacity", "1");
    });

    $("button").on("mouseleave", function() {
        $("button").css("opacity", "0.9");
    });

    $("h2").on("mouseleave", function() {
         $("h2").css("opacity", "0.5");
    });

    $("h2").on("click", function() {
        window.open('../images/manual.png','popUpWindow','height=595,width=600,left=300,top=100,resizable=yes,scrollbars=yes,toolbar=yes,menubar=no,location=no,directories=no, status=yes');
    });
}

startup();

