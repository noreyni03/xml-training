// --- DOM Elements ---
const startScreen = document.getElementById('start-screen');
const quizScreen = document.getElementById('quiz-screen');
const resultScreen = document.getElementById('result-screen');

const startBtn = document.getElementById('start-btn');
const nextBtn = document.getElementById('next-btn');
const restartBtn = document.getElementById('restart-btn');

const questionContainer = document.getElementById('question-container');
const questionCounter = document.getElementById('question-counter');
const progressBar = document.getElementById('progress-bar');
const finalScore = document.getElementById('final-score');
const resultDetails = document.getElementById('result-details');

const questionTemplate = document.getElementById('question-template');
const resultItemTemplate = document.getElementById('result-item-template');

// --- Quiz State ---
let allQuestions = [];
let currentQuizQuestions = [];
let currentQuestionIndex = 0;
let score = 0;
let userAnswers = []; // To store user selections for the results screen

const QUIZ_LENGTH = 20;

// --- Functions ---

/**
 * Fetches questions from the JSON file.
 * @returns {Promise<Array>} A promise that resolves to an array of questions.
 */
async function loadQuestions() {
    try {
        const response = await fetch('questions.json');
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        return await response.json();
    } catch (error) {
        console.error("Could not load questions:", error);
        questionContainer.innerHTML = "<p>Erreur: Impossible de charger les questions. Veuillez vérifier la console.</p>";
        return [];
    }
}

/**
 * Shuffles an array in place and returns a slice of it.
 * @param {Array} array The array to shuffle.
 * @param {number} numQuestions The number of questions to select.
 * @returns {Array} A new array with a random selection of questions.
 */
function selectRandomQuestions(array, numQuestions) {
    const shuffled = [...array].sort(() => 0.5 - Math.random());
    return shuffled.slice(0, numQuestions);
}

/**
 * Initializes and starts a new quiz.
 */
function startQuiz() {
    currentQuizQuestions = selectRandomQuestions(allQuestions, QUIZ_LENGTH);
    if (currentQuizQuestions.length < 1) {
        alert("Pas assez de questions disponibles pour commencer le quiz.");
        return;
    }
    currentQuestionIndex = 0;
    score = 0;
    userAnswers = [];
    showScreen('quiz-screen');
    displayQuestion();
}

/**
 * Displays the current question and its options.
 */
function displayQuestion() {
    resetQuestionState();
    const questionData = currentQuizQuestions[currentQuestionIndex];
    
    const questionCard = questionTemplate.content.cloneNode(true);
    questionCard.querySelector('.question-text').textContent = questionData.questionText;

    const optionsContainer = questionCard.querySelector('.options-container');
    questionData.options.forEach((optionText, index) => {
        const option = document.createElement('button');
        option.className = 'option';
        option.textContent = optionText;
        option.dataset.index = index;
        option.addEventListener('click', selectOption);
        optionsContainer.appendChild(option);
    });

    questionContainer.innerHTML = '';
    questionContainer.appendChild(questionCard);

    updateProgress();
}

function resetQuestionState() {
    nextBtn.disabled = true;
}

/**
 * Handles the user's selection of an answer.
 * For this quiz, we assume single choice.
 */
function selectOption(e) {
    const selectedBtn = e.target;
    const allOptions = questionContainer.querySelectorAll('.option');

    // Deselect all other options
    allOptions.forEach(btn => btn.classList.remove('selected'));
    
    // Select the clicked one
    selectedBtn.classList.add('selected');
    nextBtn.disabled = false;
}

/**
 * Updates the progress counter and bar.
 */
function updateProgress() {
    const progress = ((currentQuestionIndex) / currentQuizQuestions.length) * 100;
    questionCounter.textContent = `Question ${currentQuestionIndex + 1} / ${currentQuizQuestions.length}`;
    progressBar.style.width = `${progress}%`;
}

/**
 * Validates the selected answer, updates the score, and shows feedback.
 */
function handleNextQuestion() {
    const selectedOption = questionContainer.querySelector('.option.selected');
    const questionData = currentQuizQuestions[currentQuestionIndex];
    const answerIndex = selectedOption ? parseInt(selectedOption.dataset.index) : -1;

    const isCorrect = questionData.correctAnswers.includes(answerIndex);
    
    if (isCorrect) {
        score++;
    }
    
    // Store answer for results screen
    userAnswers.push({
        question: questionData,
        selectedIndex: answerIndex,
        isCorrect: isCorrect
    });
    
    currentQuestionIndex++;

    if (currentQuestionIndex < currentQuizQuestions.length) {
        displayQuestion();
    } else {
        showResults();
    }
}

/**
 * Displays the final results screen.
 */
function showResults() {
    showScreen('result-screen');
    progressBar.style.width = '100%';
    finalScore.textContent = `${score} / ${currentQuizQuestions.length}`;

    resultDetails.innerHTML = '';
    userAnswers.forEach(answer => {
        const resultItem = resultItemTemplate.content.cloneNode(true);
        const resultItemDiv = resultItem.querySelector('.result-item');
        
        resultItemDiv.classList.add(answer.isCorrect ? 'correct' : 'incorrect');
        
        resultItem.querySelector('.result-question-text').textContent = `Q${answer.question.id}: ${answer.question.questionText}`;
        
        const userAnswerText = answer.selectedIndex !== -1 ? answer.question.options[answer.selectedIndex] : "Pas de réponse";
        resultItem.querySelector('.user-answer').textContent = `Votre réponse : ${userAnswerText}`;

        const correctAnswerText = answer.question.correctAnswers.map(i => answer.question.options[i]).join(', ') || "Pas de bonne réponse";
        resultItem.querySelector('.correct-answer').textContent = `Réponse correcte : ${correctAnswerText}`;
        
        const explanation = resultItem.querySelector('.explanation');
        explanation.textContent = `Explication : ${answer.question.explanation} (Slide ${answer.question.sourceSlide})`;
        
        resultDetails.appendChild(resultItem);
    });
}

/**
 * Utility function to switch between screens.
 * @param {string} screenId The ID of the screen to show.
 */
function showScreen(screenId) {
    document.querySelectorAll('.screen').forEach(screen => {
        screen.classList.remove('active');
    });
    document.getElementById(screenId).classList.add('active');
}

// --- Event Listeners ---
startBtn.addEventListener('click', startQuiz);
nextBtn.addEventListener('click', handleNextQuestion);
restartBtn.addEventListener('click', () => showScreen('start-screen'));

// --- App Initialization ---
async function main() {
    allQuestions = await loadQuestions();
    if (allQuestions.length > 0) {
        startBtn.disabled = false;
    } else {
        startBtn.textContent = "Erreur de chargement";
        startBtn.disabled = true;
    }
}

// Disable start button until questions are loaded
startBtn.disabled = true;
main();