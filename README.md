<!DOCTYPE html>
<html lang="fr">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Jeu de QCM sur XML</title>
    <link rel="stylesheet" href="style.css">
    <script src="app.js" type="module" defer></script>
</head>
<body>
    <header>
        <h1>Quiz : Maîtrisez XML</h1>
        <p>Testez vos connaissances en XML</p>
    </header>

    <main id="app">
        <!-- Écran d'accueil -->
        <section id="start-screen" class="screen active">
            <h2>Prêt à relever le défi ?</h2>
            <p>Une série de 20 questions tirées au sort vous attend.</p>
            <button id="start-btn">Démarrer le Quiz</button>
        </section>

        <!-- Écran du Quiz -->
        <section id="quiz-screen" class="screen">
            <div id="quiz-header">
                <p id="question-counter"></p>
                <div id="progress-bar-container">
                    <div id="progress-bar"></div>
                </div>
            </div>
            <div id="question-container">
                <!-- Les questions seront injectées ici par JS -->
            </div>
            <button id="next-btn" disabled>Valider et Suivant</button>
        </section>

        <!-- Écran des résultats -->
        <section id="result-screen" class="screen">
            <h2>Quiz Terminé !</h2>
            <div id="score-container">
                <p>Votre score : <span id="final-score"></span></p>
            </div>
            <h3>Récapitulatif des réponses :</h3>
            <div id="result-details">
                <!-- Le détail des réponses sera injecté ici -->
            </div>
            <button id="restart-btn">Rejouer une nouvelle série</button>
        </section>
    </main>

    <!-- Template pour une carte de question -->
    <template id="question-template">
        <div class="question-card">
            <h3 class="question-text"></h3>
            <div class="options-container"></div>
        </div>
    </template>
    
    <!-- Template pour un item de résultat -->
    <template id="result-item-template">
        <div class="result-item">
            <p class="result-question-text"></p>
            <p class="user-answer"></p>
            <p class="correct-answer"></p>
            <p class="explanation"></p>
        </div>
    </template>
</body>
</html>