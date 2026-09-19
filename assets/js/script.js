const API_URL = "https://sltmobitel-custeomer-feedback.onrender.com";

let questions = [];
let currentQuestion = 0;
let answers = {};
let currentLanguage = "en";

const chatBox = document.getElementById("chatBox");
const userInput = document.getElementById("userInput");
const inputArea = document.getElementById("inputArea");



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
            Please check the backend connection.
        </div>

        <div class="bot-message">
            <small>${message}</small>
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

        userInput.placeholder =
            currentLanguage === "si"
                ? "ඔබගේ පිළිතුර ඇතුළත් කරන්න..."
                : "Type your answer...";

        userInput.type = "text";

        userInput.removeAttribute("maxLength");
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
        ${
            currentLanguage === "si"
                ? "ආයුබෝවන්! SLTMobitel වෙත සාදරයෙන් පිළිගනිමු."
                : "Hello! Welcome to SLTMobitel."
        }`
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

        showOverallRating();

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

        userInput.disabled = false;
    }

    let questionText =
        question.question_en ||
        question.question ||
        "";


    if (
        currentLanguage === "si" &&
        question.question_si
    ) {

        questionText =
            question.question_si;
    }


    addBotMessage(questionText);



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

        skipButton.type = "button";

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


    if (question.key === "comment") {

        if (userInput) {

            userInput.placeholder =
                currentLanguage === "si"
                    ? "ඔබගේ අදහස හෝ යෝජනාව ඇතුළත් කරන්න..."
                    : "Type your comment or suggestion...";

            userInput.type = "text";

            userInput.removeAttribute(
                "maxLength"
            );

            userInput.focus();
        }

        return;
    }



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


    let options = [];

    if (
        currentLanguage === "si" &&
        Array.isArray(question.options_si)
    ) {

        options =
            question.options_si;

    } else if (
        currentLanguage === "en" &&
        Array.isArray(question.options_en)
    ) {

        options =
            question.options_en;

    } else if (
        Array.isArray(question.options)
    ) {

        options =
            question.options;
    }


    if (options.length > 0) {

        const optionsDiv =
            document.createElement("div");

        optionsDiv.className =
            "options";


        options.forEach(
            function (option) {

                const button =
                    document.createElement("button");

                button.type = "button";

                button.className =
                    "option-button";

                button.textContent =
                    option;


                button.onclick =
                    function () {

                        selectOption(option);

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



function selectOption(option) {

    addUserMessage(option);

    saveAnswer(option);
}


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



    if (answer === "") {

        // PHONE OPTIONAL
        if (question.key === "phone") {

            addUserMessage(
                currentLanguage === "si"
                    ? "මඟ හැරියා"
                    : "Skipped"
            );

            saveAnswer("");

            return;
        }


        // COMMENT OPTIONAL
        if (question.key === "comment") {

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



    if (question.key === "phone") {

        const phone =
            answer.replace(/\s/g, "");


        if (!/^\d{10}$/.test(phone)) {

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


        addUserMessage(phone);

        userInput.value = "";

        saveAnswer(phone);

        return;
    }



    addUserMessage(answer);

    userInput.value = "";

    saveAnswer(answer);
}



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



function showOverallRating() {

    if (userInput) {

        userInput.value = "";

        userInput.style.display = "none";
    }


    const sendButton =
        document.querySelector(
            "#sendButton, button[type='submit']"
        );

    if (sendButton) {
        sendButton.style.display = "none";
    }


    addBotMessage(
        `<i
            data-lucide="star"
            style="
                width:18px;
                height:18px;
                vertical-align:middle;
                margin-right:5px;
            "
        ></i>
        ${
            currentLanguage === "si"
                ? "ඔබගේ සමස්ත අත්දැකීම 1 සිට 5 දක්වා ශ්‍රේණිගත කරන්න."
                : "Please rate your overall experience from 1 to 5."
        }`
    );


    const ratingContainer =
        document.createElement("div");

    ratingContainer.className =
        "rating-container";


    ratingContainer.style.display =
        "flex";

    ratingContainer.style.justifyContent =
        "center";

    ratingContainer.style.alignItems =
        "center";

    ratingContainer.style.gap =
        "10px";

    ratingContainer.style.flexWrap =
        "wrap";

    ratingContainer.style.margin =
        "20px 0";


    const ratings = [

        {
            value: 1,
            emoji: "😞",
            en: "Very Poor",
            si: "ඉතා දුර්වලයි"
        },

        {
            value: 2,
            emoji: "😕",
            en: "Poor",
            si: "දුර්වලයි"
        },

        {
            value: 3,
            emoji: "😐",
            en: "Average",
            si: "සාමාන්‍යයි"
        },

        {
            value: 4,
            emoji: "🙂",
            en: "Good",
            si: "හොඳයි"
        },

        {
            value: 5,
            emoji: "🤩",
            en: "Excellent",
            si: "විශිෂ්ටයි"
        }

    ];


    ratings.forEach(
        function (rating) {

            const button =
                document.createElement("button");

            button.type = "button";

            button.className =
                "rating-button";


            button.innerHTML = `
                <span style="
                    display:block;
                    font-size:30px;
                    margin-bottom:5px;
                ">
                    ${rating.emoji}
                </span>

                <strong>
                    ${rating.value}
                </strong>

                <small style="
                    display:block;
                    margin-top:4px;
                ">
                    ${
                        currentLanguage === "si"
                            ? rating.si
                            : rating.en
                    }
                </small>
            `;


            button.style.minWidth =
                "85px";

            button.style.padding =
                "12px 8px";

            button.style.border =
                "1px solid #ddd";

            button.style.borderRadius =
                "12px";

            button.style.background =
                "white";

            button.style.cursor =
                "pointer";

            button.style.transition =
                "0.2s";


            button.onmouseover =
                function () {

                    button.style.transform =
                        "translateY(-3px)";
                };


            button.onmouseout =
                function () {

                    button.style.transform =
                        "translateY(0)";
                };


            button.onclick =
                function () {

                    selectOverallRating(
                        rating.value,
                        rating.emoji,
                        currentLanguage === "si"
                            ? rating.si
                            : rating.en
                    );
                };


            ratingContainer.appendChild(
                button
            );
        }
    );


    chatBox.appendChild(
        ratingContainer
    );


    scrollChat();
}



function selectOverallRating(
    rating,
    emoji,
    label
) {

    console.log(
        "Overall rating:",
        rating
    );


    answers.overall_rating =
        rating;


    addUserMessage(
        `${emoji} ${rating} - ${label}`
    );


    // Remove rating buttons
    const ratingContainers =
        document.querySelectorAll(
            ".rating-container"
        );


    ratingContainers.forEach(
        function (container) {

            container.remove();

        }
    );


    // Hide input
    if (userInput) {

        userInput.style.display =
            "none";
    }


    const sendButton =
        document.querySelector(
            "#sendButton, button[type='submit']"
        );

    if (sendButton) {
        sendButton.style.display =
            "none";
    }


    setTimeout(
        function () {

            finishChat();

        },
        500
    );
}



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


    chatBox.appendChild(div);

    scrollChat();

    createIcons();
}


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


    chatBox.appendChild(div);

    scrollChat();
}


function scrollChat() {

    if (chatBox) {

        chatBox.scrollTop =
            chatBox.scrollHeight;
    }
}



function createIcons() {

    if (window.lucide) {

        lucide.createIcons();
    }
}



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

    const feedbackData = {

        service:
            answers.service || null,

        phone:
            answers.phone || null,

        waiting:
            answers.waiting || null,

        staff:
            answers.staff || null,

        office:
            answers.office || null,

        parking:
            answers.parking || null,

        comment:
            answers.comment || null,

        overall_rating:
            answers.overall_rating || null
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



        const buttonContainer =
            document.createElement("div");


        buttonContainer.style.display =
            "flex";

        buttonContainer.style.justifyContent =
            "center";

        buttonContainer.style.gap =
            "12px";

        buttonContainer.style.margin =
            "20px 0";

        buttonContainer.style.flexWrap =
            "wrap";


        const againButton =
            document.createElement("button");


        againButton.type =
            "button";


        againButton.textContent =
            currentLanguage === "si"
                ? "🔄 නැවත"
                : "🔄 Again";


        againButton.style.padding =
            "12px 25px";

        againButton.style.border =
            "none";

        againButton.style.borderRadius =
            "10px";

        againButton.style.cursor =
            "pointer";

        againButton.style.fontSize =
            "15px";


        againButton.onclick =
            function () {

                buttonContainer.remove();

                if (userInput) {
                    userInput.style.display =
                        "";
                }

                const sendButton =
                    document.querySelector(
                        "#sendButton, button[type='submit']"
                    );

                if (sendButton) {
                    sendButton.style.display =
                        "";
                }

                startChat();
            };



        const exitButton =
            document.createElement("button");


        exitButton.type =
            "button";


        exitButton.textContent =
            currentLanguage === "si"
                ? "🚪 පිටවන්න"
                : "🚪 Exit";


        exitButton.style.padding =
            "12px 25px";

        exitButton.style.border =
            "none";

        exitButton.style.borderRadius =
            "10px";

        exitButton.style.cursor =
            "pointer";

        exitButton.style.fontSize =
            "15px";


        exitButton.onclick =
            function () {

                buttonContainer.remove();


                if (inputArea) {

                    inputArea.style.display =
                        "none";
                }


                addBotMessage(
                    currentLanguage === "si"
                        ? "ඔබට ස්තූතියි! නැවත හමුවෙමු. 👋"
                        : "Thank you! Have a great day. 👋"
                );
            };


        buttonContainer.appendChild(
            againButton
        );


        buttonContainer.appendChild(
            exitButton
        );


        chatBox.appendChild(
            buttonContainer
        );


        scrollChat();


    } catch (error) {

        console.error(
            "Save error:",
            error
        );


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



function restartFeedback() {

    currentQuestion = 0;

    answers = {};

    startChat();
}



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

window.showOverallRating =
    showOverallRating;

window.selectOverallRating =
    selectOverallRating;


// ======================================================
// PAGE LOAD
// ======================================================

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
