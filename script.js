let carddiv = document.getElementById('card');
let spadeInput = document.getElementById('spade_input');
let clubInput = document.getElementById('club_input');
let diamondInput = document.getElementById('diamond_input');
let heartInput = document.getElementById('heart_input');
let nextCard = document.getElementById('next_card');
let startButton = document.getElementById('start_button');
let cardsLeft = document.getElementById('cards_left');
let exercise = document.getElementById('exercise');
let reload = document.getElementById('reload_button');
let finish_button = document.getElementById('finish_button');
let inputs = document.getElementById('inputs');
let startTime;
let stopTime;
let d;
let cardTimer;
let workout = {
    spades: '',
    clubs: '',
    hearts: '',
    diamonds: '' 

}


function shuffle(array) {
    for (let i = array.length - 1; i > 0; i--) {
      let j = Math.floor(Math.random() * (i + 1)); // random index from 0 to i
  
      // swap elements array[i] and array[j]
      // we use "destructuring assignment" syntax to achieve that
      // you'll find more details about that syntax in later chapters
      // same can be written as:
      // let t = array[i]; array[i] = array[j]; array[j] = t
      [array[i], array[j]] = [array[j], array[i]];
    }
  }
//Create a Card object
function Card(s,f)  {
    this.suit = s;
    this.face = f;
    //Get the value pf a card (King of Hearts, etc)
    this.getValue = () => {
        return `${this.face} of ${this.suit}`;
    };
    //Get the Face Value (What the card is worth)
    this.getFaceValue = () => {
        if (this.face == 'Ace') {
            return 11;
        } else if (this.face == 'King' || this.face == 'Queen' || this.face == 'Jack' || this.face == '10') {
            return 10;
        } else {
            return parseInt(this.face);
        }
    };
    //Get the duit 9to match up with the workouts (Spades = Push Ups, etc)
    this.getSuit = () => {
        return this.suit;
    }
    //Transform card names into the names of the PNG files
    this.getLink = () => {
        let fiv = '';
        if (this.face == 10) {
             fiv = 10;
        } else {
             fiv = this.face[0];
        }
        let fis = this.suit[0];
        return fiv+fis;
    }
}

function Times (card,suit,time) {
    this.card = card;
    this.suit = suit;
    this.totalTime = time;
    this.getCard = () => {
        return this.card;
    };
    this.getSuit = () => {
        return this.suit;
    };
    this.getCardTime = () => {
        return this.totalTime;
    };
}

var deck = []
var suits = ['Hearts','Spades','Clubs','Diamonds'];
var faces = ['Ace','2','3','4','5','6','7','8','9','10','Jack','Queen','King'];
var deckTimes = [];

//Create the deck by creating each card and adding it to the deck
for (var i = 0; i < suits.length; i++) {
    for (var f = 0; f < faces.length; f++) {
        let suit = suits[i];
        let face = faces[f];
        
        card = new Card(suit,face);
        var cardEntry = {
            card: card.getValue(),
            value: card.getFaceValue(),
            suit: card.getSuit(),
            link: card.getLink()
        };
        deck.push(cardEntry);

    }
}
function n(n){
    return n > 9 ? "" + n: "0" + n;
}

var convertTime = (ms) => {
    // 1- Convert to seconds:
    var seconds = ms / 1000;
    // 2- Extract hours:
    var hours = parseInt( seconds / 3600 ); // 3,600 seconds in 1 hour
    seconds = seconds % 3600; // seconds remaining after extracting hours
    // 3- Extract minutes:
    var minutes = parseInt( seconds / 60 ); // 60 seconds in 1 minute
    // 4- Keep only seconds not extracted to minutes:
    seconds = seconds % 60;
    return `${n(hours)}:${n(minutes)}:${n(seconds.toFixed(2))}`
}



var handleCards = () => {
    cardsLeft.innerText = `Cards Left: ${deck.length-1}`;
    carddiv.innerHTML = `<img id="cardImg" src="images/${deck[0].link}.png" alt="${deck[0].card}"</img>`;
    var cardSuit = deck[0].suit.toLowerCase();
    exercise.innerHTML = `<b>${deck[0].value} ${workout[cardSuit]}</b>`;
    d = new Date();
    startTime = d.getTime();

}

var collectTime = () => {
    d = new Date();
    stopTime = d.getTime();
    cardTimer = stopTime - startTime;
    console.log("Card Timer", cardTimer);
    var newTime = new Times(deck[0].card, deck[0].suit,cardTimer);
    deckTimes.push(newTime);
}


startButton.onclick = () => {
    startButton.setAttribute('disabled',true);
    nextCard.removeAttribute('disabled');
    inputs.classList.add('hidden');
    workout.spades = spadeInput.value;
    workout.hearts = heartInput.value;
    workout.diamonds = diamondInput.value;
    workout.clubs = clubInput.value;
    shuffle(deck);
    handleCards();
    startButton.classList.add('hidden');
    finish_button.classList.remove('hidden');
    nextCard.classList.remove('hidden');
    

}


nextCard.onclick = () => {
    collectTime();
    deck.shift();
    handleCards();
    if (deck.length-1 == 0) {
        nextCard.setAttribute('disabled',true);
        reload.classList.remove('hidden');
    }
}

reload.onclick = () => {
    location.reload();
}

finish_button.onclick = () => {
    nextCard.classList.add('hidden');
    reload.classList.remove('hidden');
    cardsLeft.classList.add('hidden');
    exercise.classList.add('hidden');
    collectTime();
    var spadesTime = 0;
    var clubsTime = 0;
    var diamondsTime = 0;
    var heartsTime = 0;
    let finalTime = 0;
    carddiv.innerHTML = '<ul id="finallist"></ul>';
    var finalList = document.getElementById('finallist');
    for (var i = 0; i < deckTimes.length; i++ ) {
        if (deckTimes[i].getSuit() == "Spades" || deckTimes[i].getSuit() == "Clubs"){
            finalList.innerHTML +=`<li class="blackCard">${deckTimes[i].getCard()} --- ${convertTime(deckTimes[i].getCardTime())}</li>`
        } else {
            finalList.innerHTML +=`<li class="redCard">${deckTimes[i].getCard()} --- ${convertTime(deckTimes[i].getCardTime())}</li>`
        }
        finalTime += deckTimes[i].getCardTime();
        switch(deckTimes[i].getSuit()) {
            case 'Spades':
                spadesTime += deckTimes[i].getCardTime();
                break;
            case 'Clubs':
                clubsTime += deckTimes[i].getCardTime();
                break;
            case 'Diamonds':
                diamondsTime += deckTimes[i].getCardTime();
                break;
            case 'Hearts':
                heartsTime += deckTimes[i].getCardTime();
                break;
        };
        
    }
    finalList.innerHTML += `<li class="blackCard summary">Total --- ${convertTime(finalTime)}</li>`;
    finalList.innerHTML += `<li class="listheading">Suits</li>`
    finalList.innerHTML += `<li class="blackCard"><span class="blackicons">&spades;</span> Spades -- ${workout.spades} --- ${convertTime(spadesTime)}</li>`;
    finalList.innerHTML += `<li class="blackCard"><span class="blackicons">&clubs;</span> Clubs -- ${workout.clubs} --- ${convertTime(clubsTime)}</li>`;
    finalList.innerHTML += `<li class="redCard"><span class="whiteicons">&diams;</span> Diamonds -- ${workout.diamonds} --- ${convertTime(diamondsTime)}</li>`;
    finalList.innerHTML += `<li class="redCard"><span class="whiteicons">&hearts;</span> Hearts --${workout.hearts} --- ${convertTime(heartsTime)}</li>`;


}
