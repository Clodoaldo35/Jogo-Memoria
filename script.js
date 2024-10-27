const wordContainer = document.getElementById('word-container');
const letterContainer = document.getElementById('letter-container');
const checkButton = document.getElementById('check-button');
const nextButton = document.getElementById('next-button');
const showAnswerButton = document.getElementById('show-answer-button');
const message = document.getElementById('message');
const attemptsDisplay = document.getElementById('attempts');
const timerDisplay = document.getElementById('timer');
const scoreDisplay = document.getElementById('score');

const words = [
    'GATO', 'CASA', 'BOLA', 'FLOR', 'LIVRO', 'ESCOLA', 'AMIGO', 'FELIZ',
    'CACHORRO', 'ÁRVORE', 'SORVETE', 'BICICLETA', 'FAMÍLIA', 'PARQUE',
    'MÚSICA', 'ESTRELA', 'CHUVA', 'SOL', 'LUA', 'MAR', 'MONTANHA',
    'CHOCOLATE', 'BORBOLETA', 'DINOSSAURO', 'FOGUETE', 'ARCO-ÍRIS',
    'GIRAFA', 'ELEFANTE', 'LEÃO', 'MACACO', 'PINGUIM', 'ZEBRA',
    'COMPUTADOR', 'TELEFONE', 'TELEVISÃO', 'JANELA', 'PORTA', 'MESA',
    'CADEIRA', 'LÁPIS', 'CANETA', 'MOCHILA', 'SAPATO', 'CAMISA',
    'CALÇA', 'CHAPÉU', 'ÓCULOS', 'RELÓGIO', 'BRINQUEDO', 'JOGO',
    'PIZZA', 'SUCO', 'BANANA', 'MAÇÃ', 'LARANJA', 'MORANGO',
    'ABACAXI', 'MELANCIA', 'UVA', 'CENOURA', 'TOMATE', 'ALFACE',
    'BATATA', 'FEIJÃO', 'ARROZ', 'CARNE', 'PEIXE', 'FRANGO',
    'AVIÃO', 'CARRO', 'ÔNIBUS', 'TREM', 'NAVIO', 'HELICÓPTERO',
    'MÉDICO', 'PROFESSOR', 'BOMBEIRO', 'POLICIAL', 'COZINHEIRO',
    'DENTISTA', 'ASTRONAUTA', 'ARTISTA', 'CIENTISTA', 'ATLETA'
];

let currentWord = '';
let shuffledWord = '';
let attempts = 0;
let timeLeft = 20;
let timerInterval;
let totalScore = 0;
let wordCompleted = false;

function shuffleWord(word) {
    return word.split('').sort(() => Math.random() - 0.5).join('');
}

function createLetterBoxes(word, container) {
    container.innerHTML = '';
    for (let letter of word) {
        const letterBox = document.createElement('div');
        letterBox.className = 'letter-box';
        letterBox.textContent = letter;
        letterBox.addEventListener('click', () => moveLetter(letterBox));
        container.appendChild(letterBox);
    }
}

function moveLetter(letterBox) {
    if (letterBox.parentNode === letterContainer) {
        wordContainer.appendChild(letterBox);
    } else {
        letterContainer.appendChild(letterBox);
    }
}

function updateScore(points) {
    totalScore += points;
    scoreDisplay.textContent = `Pontos: ${totalScore}`;
}

function calculatePoints() {
    switch(attempts) {
        case 0:
            return 10; // Primeira tentativa
        case 1:
            return 5;  // Segunda tentativa
        case 2:
            return 2;  // Terceira tentativa
        default:
            return 0;  // Mais de três tentativas
    }
}

function startTimer() {
    clearInterval(timerInterval);
    timeLeft = 20;
    updateTimerDisplay();
    timerInterval = setInterval(() => {
        timeLeft--;
        updateTimerDisplay();
        if (timeLeft <= 0) {
            clearInterval(timerInterval);
            timeOut();
        }
    }, 1000);
}

function updateTimerDisplay() {
    timerDisplay.textContent = `Tempo: ${timeLeft}s`;
}

function timeOut() {
    if (!wordCompleted) {
        message.textContent = '⏰ Tempo esgotado! Tente a próxima palavra.';
        message.style.color = '#FF6B6B';
        showAnswerButton.style.display = 'inline-block';
        updateScore(0);
        wordCompleted = true;
        checkButton.style.backgroundColor = '#cccccc';
        checkButton.style.cursor = 'default';
    }
}

function checkWord() {
    if (wordCompleted) {
        return;
    }

    const currentAttempt = Array.from(wordContainer.children)
        .map(box => box.textContent)
        .join('');
    if (currentAttempt === currentWord) {
        clearInterval(timerInterval);
        const points = calculatePoints();
        updateScore(points);
        message.textContent = `🎉 Parabéns! Você acertou! (+${points} pontos)`;
        message.style.color = '#4ECDC4';
        showAnswerButton.style.display = 'none';
        wordCompleted = true;
        checkButton.style.backgroundColor = '#cccccc';
        checkButton.style.cursor = 'default';
    } else {
        attempts++;
        message.textContent = '😊 Tente novamente! Você consegue! 😊';
        message.style.color = '#FF6B6B';
        if (attempts >= 3) {
            showAnswerButton.style.display = 'inline-block';
            wordCompleted = true;
            checkButton.style.backgroundColor = '#cccccc';
            checkButton.style.cursor = 'default';
        }
    }
    attemptsDisplay.textContent = `Tentativas: ${attempts}`;
}

function nextWord() {
    currentWord = words[Math.floor(Math.random() * words.length)];
    shuffledWord = shuffleWord(currentWord);
    createLetterBoxes(shuffledWord, letterContainer);
    wordContainer.innerHTML = '';
    message.textContent = '';
    attempts = 0;
    wordCompleted = false;
    attemptsDisplay.textContent = `Tentativas: ${attempts}`;
    showAnswerButton.style.display = 'none';
    checkButton.style.backgroundColor = '#4ECDC4';
    checkButton.style.cursor = 'pointer';
    startTimer();
}

function showAnswer() {
    clearInterval(timerInterval);
    message.textContent = `A palavra correta é: ${currentWord}`;
    message.style.color = '#4ECDC4';
    createLetterBoxes(currentWord, wordContainer);
    letterContainer.innerHTML = '';
    showAnswerButton.style.display = 'none';
    updateScore(0);
    wordCompleted = true;
    checkButton.style.backgroundColor = '#cccccc';
    checkButton.style.cursor = 'default';
}

checkButton.addEventListener('click', checkWord);
nextButton.addEventListener('click', nextWord);
showAnswerButton.addEventListener('click', showAnswer);

// Iniciar o jogo
nextWord();