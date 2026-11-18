const modal = document.querySelector('.modal');
const rulesButton = document.querySelector('.rules-button');
const closeButton = document.querySelector('.close-button');
const playArea = document.querySelector('.playarea');
const resultStage = document.querySelector('.result-stage');
const resultPlayer = document.querySelector('.result-player');
const resultHouse = document.querySelector('.result-house');
const roundResult = document.querySelector('#round-result');
const scoreValue = document.querySelector('.score-value');
const playAgainButton = document.querySelector('.play-again');
const choiceButtons = document.querySelectorAll('.choice');
const gameShell = document.querySelector('.game-shell');

const choiceOrder = ['rock', 'paper', 'scissors'];
const scoreStorageKey = 'rps-score';

function getStoredScore() {  
  const savedScore = Number.parseInt(localStorage.getItem(scoreStorageKey), 10);  
  return Number.isNaN(savedScore) ? 0 : savedScore;
  // if(Number.isNaN(savedScore)){
  //   return 0
  // } else {
  //   return savedScore;
  // }
}

function updateScore() {
  if (!scoreValue) return;
  const currentScore = getStoredScore();
  scoreValue.textContent = String(currentScore);
}

function setChoiceDisplay(element, choice) {
  if (!element) return;

  const image = element.querySelector('img');
  const choiceClassMap = {
    rock: 'choice-rock',
    paper: 'choice-paper',
    scissors: 'choice-scissors',
  };

  element.classList.remove('choice-rock', 'choice-paper', 'choice-scissors');
  element.classList.add(choiceClassMap[choice]);

  const iconMap = {
    rock: './images/icon-rock.svg',
    paper: './images/icon-paper.svg',
    scissors: './images/icon-scissors.svg',
  };

  image.src = iconMap[choice];
  image.alt = `${choice} icon`;
}

function decideWinner(playerChoice, computerChoice) {
  if (playerChoice === computerChoice) {
    return 'tie';
  }

  const wins = {
    rock: 'scissors',
    paper: 'rock',
    scissors: 'paper',
  };

  return wins[playerChoice] === computerChoice ? 'win' : 'lose';
}

function handlePlayerChoice(playerChoice) {
  const computerChoice = choiceOrder[Math.floor(Math.random() * choiceOrder.length)];
  const outcome = decideWinner(playerChoice, computerChoice);

  if (gameShell) {
    gameShell.classList.add('round-end');
  }

  if (playArea) {
    playArea.classList.add('hidden');
  }

  if (resultStage) {
    resultStage.classList.remove('hidden');
    resultStage.classList.add('active');
    resultStage.classList.remove('result-ready');
  }

  setChoiceDisplay(resultPlayer, playerChoice);
  resultPlayer.classList.add('is-revealed');
  resultHouse.classList.remove('is-revealed');
  roundResult.textContent = '';

  window.setTimeout(() => {
    setChoiceDisplay(resultHouse, computerChoice);
    resultHouse.classList.add('is-revealed');
  }, 420);

  window.setTimeout(() => {
    let score = getStoredScore();

    if (outcome === 'win') {
      score += 1;
      roundResult.textContent = 'You win';
    } else if (outcome === 'lose') {
      score -= 1;
      roundResult.textContent = 'You lose';
    } else {
      roundResult.textContent = 'Tie';
    }

    if (outcome !== 'tie') {
      localStorage.setItem(scoreStorageKey, String(score));
    }

    updateScore();
    resultStage.classList.add('result-ready');
  }, 880);
}


function resetGame() {
  if (gameShell) {
    gameShell.classList.remove('round-end');
  }

  if (playArea) {
    playArea.classList.remove('hidden');
  }

  if (resultStage) {
    resultStage.classList.remove('active');
    resultStage.classList.remove('result-ready');
    resultStage.classList.add('hidden');
  }

  resultPlayer.classList.remove('is-revealed');
  resultHouse.classList.remove('is-revealed');
  roundResult.textContent = 'You win';
}

function openModal() {
  if (!modal) return;
  modal.classList.remove('hidden');
}

function closeModal() {
  if (!modal) return;
  modal.classList.add('hidden');
}

if (rulesButton) {
  rulesButton.addEventListener('click', openModal);
}

if (closeButton) {
  closeButton.addEventListener('click', closeModal);
}

if (modal) {
  modal.addEventListener('click', (event) => {
    if (event.target === modal) {
      closeModal();
    }
  });

  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape') {
      closeModal();
    }
  });
}

choiceButtons.forEach((button) => {
  button.addEventListener('click', () => {
    const playerChoice = button.dataset.choice;
    if (!playerChoice) return;
    handlePlayerChoice(playerChoice);
  });
});

if (playAgainButton) {
  playAgainButton.addEventListener('click', resetGame);
}

updateScore();
