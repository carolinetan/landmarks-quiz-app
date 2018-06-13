/**
 * Created by ctan on 5/16/2018.
 */
'use strict';

let questionNumber = 0;
let score = 0;



function initializeQuiz() {
    console.log("invoked: initializeQuiz()");

    $( '.col-12' ).on( 'click', '.play-button', function (event) {
        console.log( 'row with let\'s play button is being removed' );
        $('.col-12').remove();
        $('.quiz-main').css( 'display', 'inline' );
        updateScoreBoard();
    } );
}

function resetScoreBoard() {
    questionNumber = 0;
    score = 0;
    updateScoreBoard();
}

function updateScoreBoard() {
    console.log("invoked: updateScoreBoard()");
    if (questionNumber < QUIZ_DB.length) {
        $( '.questionNumber' ).text( questionNumber + 1 );
        $( '.score' ).text( score );
    }
}

function incrementQNCount() {
    console.log("invoked: incrementQNCount()");
    if (questionNumber < QUIZ_DB.length) {
        questionNumber++;
    }
    console.log(`incrementQNCount: questionNumber = ${questionNumber}`);
}

function incrementScore() {
    console.log("invoked: incrementScore()");
    score++;
    console.log(`incrementScore: score = ${score}`);
}


function displayUserQuestion() {
    console.log("invoked: displayUserQuestion()");
    $( '.quiz-main' ).html( generateQuizItem() );
}


function generateQuizItem() {
    console.log( `generateQuizItem: questionNumber = ${questionNumber}` );

    if (questionNumber < QUIZ_DB.length) {
        let index = 0;
        let tabIdx = 0;
        return `
    <div class="row">
            <form>
            <fieldset>
            <legend>${QUIZ_DB[questionNumber].question}</legend>
            <img class="quiz-image"
            src="${QUIZ_DB[questionNumber].image}" alt="${QUIZ_DB[questionNumber].imageLabel}"/>
            ${QUIZ_DB[questionNumber].answers.map( answer =>
                    `<label class="answerOption">
                     <input tabindex="tabIdx++" type="radio" value="${answer}" aria-labelledby="answer${index}" required="required">
        <span id="answer${index++}">${answer}<br></span>
        </label>` ).join('')}
            <button type="submit" class="submit-button">Submit</button>
        </fieldset>
        </form>
    </div>`;
    }
}

function handleUserSelection() {
    console.log("invoked: handleUserSelection()");

    $('form').on( 'submit', function (event) {

        console.log(`handleUserSelection: questionNumber = ${questionNumber}`);

        event.preventDefault();
        const selected = $( 'input:checked' );
        const answer = selected.val();
        const correctAnswer = `${QUIZ_DB[questionNumber].correctAnswer}`;
        console.log(`handleUserSelection: user-answer=${answer}, correct-answer=${correctAnswer}`);

        if (answer === correctAnswer) {
            incrementScore();
            updateScoreBoard();
            provideUserFeedback(true);
        }
        else {
            provideUserFeedback(false);
        }
        incrementQNCount();
    });

    console.log(`CHECK: questionNumber=${questionNumber}, QUIZ_DB.length=${QUIZ_DB.length}`);
    if (questionNumber == QUIZ_DB.length) {
        generateEndUserFeedback();
        retryQuizApp();
    }

}


function provideUserFeedback(answer) {
    let imgSrc = "unavailable";
    let imgAlt = "unavailable";
    let pText  ="unavailable";
    if (answer) {
        imgSrc = "images/correct.png";
        imgAlt = "correct answer!";
        pText  ="You got it right";
    }
    else {
        imgSrc = "images/wrong.png";
        imgAlt = "wrong answer!";
        pText  ="You got it wrong!";
    }

    $('.quiz-main').html(`
        <div class="row feedback">
            <img src=${imgSrc} alt=${imgAlt}/>
            <p><b>${pText}</b></p>
            <span>${QUIZ_DB[questionNumber].feedback}</span>
        </div>
        <div class="row feedback">
            <button tabindex="0" type=button class="nextButton">Next</button>
        </div>`);
}


function handleNextButton() {
    console.log("invoked: handleNextButton()");

    $('.quiz-main').on('click', '.nextButton', function (event) {
        displayUserQuestion();
        handleUserSelection();
        updateScoreBoard();
    });
}


function generateEndUserFeedback() {
    let totalScore = "SCORE: " + `${score}` + " / 10";
    let imageToUse = "images/good.png";
    let scoreMsg = 'Excellent!';

    if (score <= 5) {
        imageToUse = "images/do-better.png";
        scoreMsg = 'Ouch! Try again?';
    }
    else
    if (score > 5 && score < 8) {
        imageToUse = "images/neutral.png";
        scoreMsg = 'You can do better!';
    }

    $('.quiz-main').html(`
        <div class="row results">
            <img src="${imageToUse}"/>
            <p><b>${totalScore}</b></p>
            <span>${scoreMsg}<br></span>
        </div>
        <div class="row feedback">
            <button tabindex="0" type=button class="restartButton">Restart Quiz</button>
        </div>`);
}

function retryQuizApp() {
    console.log("invoked: retryQuizApp()");
    $('main').on('click', '.restartButton', function (event) {
        //location.reload();
        resetScoreBoard();
        playQuizApp();
    });
}

function addTabHandler() {
    $('.quiz-main').on('focus', '.answerOption input', function(){
        $(this).parent().addClass('tab_focus_bg');
    });

    $('.quiz-main').on('blur', '.answerOption input', function(){
        $(this).parent().removeClass('tab_focus_bg');
    });
}


function playQuizApp() {
    console.log("invoked: playQuizApp()");
    initializeQuiz();
    displayUserQuestion();
    addTabHandler();
    handleUserSelection();
    handleNextButton();
}

$( playQuizApp );
