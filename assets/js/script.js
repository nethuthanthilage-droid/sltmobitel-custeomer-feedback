const API_URL = "https://sltmobitel-custeomer-feedback.onrender.com";

let questions = [];
let currentQuestion = 0;
let answers = {};
let currentLanguage = "en";

const chatBox = document.getElementById("chatBox");
const userInput = document.getElementById("userInput");
const inputArea = document.getElementById("inputArea");


// ============================================
// LANGUAGE
// ============================================

function setLanguage(language) {

    currentLanguage = language;

    console.log("Language changed:", language);

    updateLanguageButtons(language);

    if (questions.length > 0) {
        showQuestion();
    }
}


function updateLanguageButtons(language) {

    const englishBtn =
        document.getElementById("englishBtn");

    const sinhalaBtn =
        document.getElementById("sinhalaBtn");

    if (!englishBtn || !sinhalaBtn) {
        return;
    }

    englishBtn.classList.remove("active");
    sinhalaBtn.classList.remove("active");

    if (language === "en") {
        englishBtn.classList.add("active");
    } else {
        sinhalaBtn.classList.add("active");
    }
}


// ============================================
// LOAD QUESTIONS FROM RENDER
// ============================================

async function loadQuestions() {

    console.log(
        "Loading questions from:",
        API_URL + "/questions"
    );

    try {

        const response =
            await fetch(
                API_URL + "/questions",
                {
                    method: "GET",
                    cache: "no-store"
                }
            );

        console.log(
            "Questions HTTP status:",
            response.status
        );

        if (!response.ok) {

            throw new Error(
                "Could not load questions. HTTP " +
                response.status
            );
        }

        const data =
            await response.json();

        console.log(
            "Questions received:",
            data
        );


        if (Array.isArray(data)) {

            questions = data;

        } else if (
            data &&
            Array.isArray(data.questions)
        ) {

            questions = data.questions;

        } else {

            throw new Error(
                "Invalid questions format from server."
            );
        }


        if (questions.length === 0) {

            throw new Error(
                "No questions were found."
            );
        }


        console.log(
            "Total questions:",
            questions.length
        );


        startChat();

    } catch (error) {

        console.error(
            "Question loading error:",
            error
        );

        showConnectionError(
            error.message
        );
    }
}


// ============================================
// CONNECTION ERROR
// ============================================

function showConnectionError(message) {

    if (!chatBox) {

        console.error(
            "chatBox element not found."
        );

        return;
    }

    chatBox.innerHTML = `

        <div class="bot-message">
            ❌ Cannot load questions.
        </div>

        <div class="bot-message">
            Please check your internet connection
            and try again.
        </div>

        <div class="bot-message">
            <small>
                ${message}
            </small>
        </div>

        <div style="
            text-align:center;
            margin:20px 0;
        ">

            <button
                type="button"
                onclick="loadQuestions()"
                style="
                    padding:12px 25px;
                    border:none;
                    border-radius:10px;
                    cursor:pointer;
                "
            >
                🔄 Try Again
            </button>

        </div>
    `;
}


// ============================================
// START CHAT
// ============================================

function startChat() {

    if (!chatBox) {

        console.error(
            "chatBox not found."
        );

        return;
    }

    currentQuestion = 0;
    answers = {};

    chatBox.innerHTML = "";

    if (inputArea) {
        inputArea.style.display = "flex";
    }

    if (userInput) {

        userInput.value = "";

        userInput.disabled = false;
    }


    addBotMessage(
        `<i
            data-lucide="hand"
            style="
                width:16px;
                height:16px;
                vertical-align:middle;
                margin-right:4px;
            "
        ></i>
        Hello! Welcome to SLTMobitel.`
    );


    addBotMessage(
        currentLanguage === "si"
            ? "අද ඔබගේ අත්දැකීම පිළිබඳව දැනගැනීමට අපි කැමතියි. මෙයට ගත වන්නේ විනාඩියක් පමණි."
            : "I would like to know about your experience today. It will only take a minute."
    );


    setTimeout(
        function () {

            showQuestion();

        },
        600
    );
}


// ============================================
// SHOW CURRENT QUESTION
// ============================================

function showQuestion() {

    if (
        !questions ||
        questions.length === 0
    ) {

        console.error(
            "No questions available."
        );

        return;
    }


    if (
        currentQuestion >=
        questions.length
    ) {

        finishChat();

        return;
    }


    const question =
        questions[currentQuestion];


    console.log(
        "Showing question:",
        question
    );


    if (userInput) {
        userInput.value = "";
    }


    // ========================================
    // QUESTION TEXT
    // ========================================

    const questionText =
        currentLanguage === "si"
            ? question.question_si
            : question.question_en;


    addBotMessage(
        questionText
    );


    // ========================================
    // PHONE QUESTION
    // ========================================

    if (question.key === "phone") {

        if (userInput) {

            userInput.placeholder =
                currentLanguage === "si"
                    ? "අංක 10ක දුරකථන අංකය ඇතුළත් කරන්න (විකල්ප)"
                    : "Enter 10-digit phone number (Optional)";

            userInput.type = "tel";

            userInput.maxLength = 10;

            userInput.focus();
        }


        const skipButton =
            document.createElement("button");


        skipButton.type =
            "button";


        skipButton.className =
            "skip-button";


        skipButton.textContent =
            currentLanguage === "si"
                ? "මඟ හරින්න"
                : "Skip";


        skipButton.onclick =
            function () {

                addUserMessage(
                    currentLanguage === "si"
                        ? "මඟ හැරියා"
                        : "Skipped"
                );

                saveAnswer("");
            };


        chatBox.appendChild(
            skipButton
        );


        scrollChat();

        return;
    }


    // ========================================
    // COMMENT QUESTION
    // ========================================

    if (question.key === "comment") {

        if (userInput) {

            userInput.placeholder =
                currentLanguage === "si"
                    ? "ඔබගේ අදහස ඇතුළත් කරන්න..."
                    : "Type your comment...";

            userInput.type = "text";

            userInput.removeAttribute(
                "maxLength"
            );

            userInput.focus();
        }

        return;
    }


    // ========================================
    // NORMAL INPUT
    // ========================================

    if (userInput) {

        userInput.placeholder =
            currentLanguage === "si"
                ? "ඔබගේ පිළිතුර ඇතුළත් කරන්න..."
                : "Type your answer...";

        userInput.type = "text";

        userInput.removeAttribute(
            "maxLength"
        );
    }


    // ========================================
    // OPTIONS
    // ========================================

    const options =
        currentLanguage === "si"
            ? question.options_si
            : question.options_en;


    if (
        options &&
        options.length > 0
    ) {

        const optionsDiv =
            document.createElement("div");


        optionsDiv.className =
            "options";


        options.forEach(
            function (option, index) {

                const button =
                    document.createElement("button");


                button.type =
                    "button";


                button.className =
                    "option-button";


                // Display selected language
                button.textContent =
                    option;


                button.onclick =
                    function () {

                        // Always save English
                        // value to database
                        const englishOption =
                            question.options_en[index];


                        selectOption(
                            englishOption
                        );
                    };


                optionsDiv.appendChild(
                    button
                );
            }
        );


        chatBox.appendChild(
            optionsDiv
        );


        scrollChat();
    }
}


// ============================================
// SELECT OPTION
// ============================================

function selectOption(option) {

    addUserMessage(
        option
    );

    saveAnswer(
        option
    );
}


// ============================================
// SEND TEXT ANSWER
// ============================================

function sendAnswer() {

    if (!questions.length) {
        return;
    }


    const question =
        questions[currentQuestion];


    if (!question) {
        return;
    }


    const answer =
        userInput
            ? userInput.value.trim()
            : "";


    // ========================================
    // EMPTY ANSWER
    // ========================================

    if (answer === "") {


        // Phone is optional
        if (
            question.key === "phone"
        ) {

            addUserMessage(
                currentLanguage === "si"
                    ? "මඟ හැරියා"
                    : "Skipped"
            );


            saveAnswer("");

            return;
        }


        // Comment is optional
        if (
            question.key === "comment"
        ) {

            addUserMessage(
                currentLanguage === "si"
                    ? "අදහසක් නැත"
                    : "No comment"
            );


            saveAnswer("");

            return;
        }


        alert(
            currentLanguage === "si"
                ? "කරුණාකර පිළිතුරක් තෝරන්න."
                : "Please select an answer."
        );


        return;
    }


    // ========================================
    // PHONE VALIDATION
    // ========================================

    if (
        question.key === "phone"
    ) {

        const phone =
            answer.replace(
                /\s/g,
                ""
            );


        if (
            !/^\d{10}$/.test(phone)
        ) {

            addBotMessage(
                `<i
                    data-lucide="alert-triangle"
                    style="
                        width:16px;
                        height:16px;
                        vertical-align:middle;
                        margin-right:4px;
                    "
                ></i>
                ${
                    currentLanguage === "si"
                        ? "කරුණාකර වලංගු අංක 10ක දුරකථන අංකයක් ඇතුළත් කරන්න."
                        : "Please enter a valid 10-digit phone number."
                }`
            );


            return;
        }


        addUserMessage(
            phone
        );


        userInput.value = "";


        saveAnswer(
            phone
        );


        return;
    }


    // ========================================
    // NORMAL ANSWER
    // ========================================

    addUserMessage(
        answer
    );


    userInput.value = "";


    saveAnswer(
        answer
    );
}


// ============================================
// SAVE ANSWER
// ============================================

function saveAnswer(answer) {

    const question =
        questions[currentQuestion];


    if (!question) {
        return;
    }


    answers[question.key] =
        answer;


    console.log(
        "Saved answer:",
        question.key,
        answer
    );


    currentQuestion++;


    setTimeout(
        function () {

            showQuestion();

        },
        400
    );
}


// ============================================
// ADD BOT MESSAGE
// ============================================

function addBotMessage(message) {

    if (!chatBox) {
        return;
    }


    const div =
        document.createElement("div");


    div.className =
        "bot-message";


    div.innerHTML =
        message;


    chatBox.appendChild(
        div
    );


    scrollChat();


    createIcons();
}


// ============================================
// ADD USER MESSAGE
// ============================================

function addUserMessage(message) {

    if (!chatBox) {
        return;
    }


    const div =
        document.createElement("div");


    div.className =
        "user-message";


    div.textContent =
        message;


    chatBox.appendChild(
        div
    );


    scrollChat();
}


// ============================================
// SCROLL CHAT
// ============================================

function scrollChat() {

    if (chatBox) {

        chatBox.scrollTop =
            chatBox.scrollHeight;
    }
}


// ============================================
// LUCIDE ICONS
// ============================================

function createIcons() {

    if (window.lucide) {

        lucide.createIcons();
    }
}


// ============================================
// FINISH CHAT / SEND FEEDBACK
// ============================================

async function finishChat() {

    if (inputArea) {

        inputArea.style.display =
            "none";
    }


    addBotMessage(
        `<i
            data-lucide="loader-2"
            class="spin"
            style="
                width:16px;
                height:16px;
                vertical-align:middle;
                margin-right:4px;
            "
        ></i>
        ${
            currentLanguage === "si"
                ? "ඔබගේ ප්‍රතිපෝෂණය සුරකිමින්..."
                : "Saving your feedback..."
        }`
    );


    console.log(
        "Customer Answers:",
        answers
    );


    // ========================================
    // FEEDBACK DATA
    // ========================================

    const feedbackData = {

        service:
            answers.service ||
            null,

        phone:
            answers.phone ||
            null,

        waiting:
            answers.waiting ||
            null,

        staff:
            answers.staff ||
            null,

        office:
            answers.office ||
            null,

        parking:
            answers.parking ||
            null,

        comment:
            answers.comment ||
            null
    };


    console.log(
        "Sending to Python:",
        feedbackData
    );


    try {

        const response =
            await fetch(
                API_URL + "/feedback",
                {
                    method: "POST",

                    headers: {
                        "Content-Type":
                            "application/json"
                    },

                    body:
                        JSON.stringify(
                            feedbackData
                        )
                }
            );


        const result =
            await response.json();


        console.log(
            "Backend response:",
            result
        );


        if (!response.ok) {

            throw new Error(
                result.detail ||
                "Failed to save feedback"
            );
        }


        // ====================================
        // SUCCESS MESSAGE
        // ====================================

        addBotMessage(
            `<i
                data-lucide="check-circle-2"
                style="
                    width:16px;
                    height:16px;
                    vertical-align:middle;
                    margin-right:4px;
                "
            ></i>
            ${
                currentLanguage === "si"
                    ? "ඔබගේ ප්‍රතිපෝෂණයට ස්තූතියි!"
                    : "Thank you for your feedback!"
            }`
        );


        addBotMessage(
            currentLanguage === "si"
                ? "ඔබගේ ප්‍රතිපෝෂණය සාර්ථකව සුරකින ලදී. ❤️"
                : "Your feedback has been successfully recorded. ❤️"
        );


        // ====================================
        // START NEW SESSION
        // ====================================

        setTimeout(
            function () {

                addBotMessage(
                    `<i
                        data-lucide="loader-2"
                        class="spin"
                        style="
                            width:16px;
                            height:16px;
                            vertical-align:middle;
                            margin-right:4px;
                        "
                    ></i>
                    ${
                        currentLanguage === "si"
                            ? "නව ප්‍රතිපෝෂණ සැසියක් ආරම්භ කරමින්..."
                            : "Starting a new feedback session..."
                    }`
                );

            },
            1500
        );


        setTimeout(
            function () {

                startChat();

            },
            3000
        );


    } catch (error) {

        console.error(
            "Save error:",
            error
        );


        if (inputArea) {

            inputArea.style.display =
                "flex";
        }


        addBotMessage(
            `<i
                data-lucide="x-circle"
                style="
                    width:16px;
                    height:16px;
                    vertical-align:middle;
                    margin-right:4px;
                "
            ></i>
            ${
                currentLanguage === "si"
                    ? "කණගාටුයි, ඔබගේ ප්‍රතිපෝෂණය සුරැකීමට නොහැකි විය."
                    : "Sorry, your feedback could not be saved."
            }`
        );


        addBotMessage(
            currentLanguage === "si"
                ? "කරුණාකර නැවත උත්සාහ කරන්න."
                : "Please try again."
        );
    }
}


// ============================================
// RESTART FEEDBACK
// ============================================

function restartFeedback() {

    currentQuestion = 0;

    answers = {};

    startChat();
}


// ============================================
// ENTER KEY
// ============================================

if (userInput) {

    userInput.addEventListener(
        "keydown",
        function (event) {

            if (event.key === "Enter") {

                event.preventDefault();

                sendAnswer();
            }

        }
    );
}


// ============================================
// MAKE FUNCTIONS AVAILABLE TO HTML
// ============================================

window.setLanguage =
    setLanguage;

window.loadQuestions =
    loadQuestions;

window.startChat =
    startChat;

window.showQuestion =
    showQuestion;

window.selectOption =
    selectOption;

window.sendAnswer =
    sendAnswer;

window.saveAnswer =
    saveAnswer;

window.finishChat =
    finishChat;

window.restartFeedback =
    restartFeedback;

window.updateLanguageButtons =
    updateLanguageButtons;


// ============================================
// PAGE LOAD
// ============================================

document.addEventListener(
    "DOMContentLoaded",
    function () {

        console.log(
            "================================"
        );

        console.log(
            "SLTMobitel Feedback System"
        );

        console.log(
            "API:",
            API_URL
        );

        console.log(
            "================================"
        );


        updateLanguageButtons(
            currentLanguage
        );


        loadQuestions();

    }
);
