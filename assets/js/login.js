const API_BASE_URL = "https://sltmobitel-custeomer-feedback.onrender.com";

let questions = [];
let currentQuestion = 0;
let answers = {};
let currentLanguage = "en";




function setLanguage(language) {
    currentLanguage = language;

    console.log("Language:", language);

    showQuestion();
}


async function loadQuestions() {

    console.log("Loading questions...");

    try {

        const response = await fetch(
            API_BASE_URL + "/questions"
        );

        if (!response.ok) {
            throw new Error(
                "HTTP Error: " + response.status
            );
        }

        const data = await response.json();

        console.log("Questions received:", data);

        if (Array.isArray(data)) {
            questions = data;
        }
        else if (Array.isArray(data.questions)) {
            questions = data.questions;
        }
        else {
            throw new Error(
                "Invalid questions format"
            );
        }

        if (questions.length === 0) {
            throw new Error(
                "No questions found"
            );
        }

        currentQuestion = 0;
        answers = {};

        showQuestion();

    }
    catch (error) {

        console.error(
            "Failed to load questions:",
            error
        );

        const question =
            document.getElementById("question");

        const options =
            document.getElementById("options");

        if (question) {
            question.textContent =
                "❌ Cannot load questions";
        }

        if (options) {
            options.innerHTML = `
                <p style="color:red;">
                    ${error.message}
                </p>

                <button onclick="loadQuestions()">
                    🔄 Try Again
                </button>
            `;
        }
    }
}


function showQuestion() {

    const questionElement =
        document.getElementById("question");

    const optionsElement =
        document.getElementById("options");

    const progressElement =
        document.getElementById("progress");


    if (!questionElement || !optionsElement) {

        console.error(
            "Missing #question or #options in index.html"
        );

        return;
    }


    if (currentQuestion >= questions.length) {

        submitFeedback();

        return;
    }


    const q = questions[currentQuestion];

    console.log(
        "Showing:",
        q
    );


    questionElement.textContent =
        q.question;


    if (progressElement) {

        progressElement.textContent =
            `${currentQuestion + 1} / ${questions.length}`;

    }


    optionsElement.innerHTML = "";


    if (q.key === "phone") {

        optionsElement.innerHTML = `

            <input
                id="phoneInput"
                type="tel"
                maxlength="10"
                placeholder="Enter 10-digit phone number"
                style="
                    width:100%;
                    padding:15px;
                    box-sizing:border-box;
                    border:1px solid #ccc;
                    border-radius:10px;
                    margin-bottom:15px;
                    font-size:16px;
                "
            >

            <button
                onclick="nextQuestion()"
                style="
                    width:100%;
                    padding:14px;
                    border:0;
                    border-radius:10px;
                    cursor:pointer;
                "
            >
                Next →
            </button>
        `;

        return;
    }



    if (!q.options || q.options.length === 0) {

        optionsElement.innerHTML =
            "<p>No options available.</p>";

        return;
    }


    q.options.forEach(function(option) {

        const button =
            document.createElement("button");

        button.type = "button";

        button.textContent = option;

        button.style.cssText = `
            display:block;
            width:100%;
            padding:15px;
            margin:10px 0;
            border:1px solid #ddd;
            border-radius:10px;
            background:white;
            cursor:pointer;
            font-size:16px;
        `;


        button.onclick = function() {

            answers[q.key] = option;

            console.log(
                "Answer:",
                q.key,
                option
            );

            currentQuestion++;

            showQuestion();
        };


        optionsElement.appendChild(button);

    });
}



function nextQuestion() {

    const q = questions[currentQuestion];

    if (!q) return;


    if (q.key === "phone") {

        const input =
            document.getElementById("phoneInput");

        const phone =
            input ? input.value.trim() : "";


        if (
            phone !== "" &&
            !/^[0-9]{10}$/.test(phone)
        ) {

            alert(
                "Please enter a valid 10-digit phone number."
            );

            return;
        }


        answers[q.key] = phone;

        currentQuestion++;

        showQuestion();

    }
}


async function submitFeedback() {

    console.log(
        "Submitting feedback:",
        answers
    );


    const questionElement =
        document.getElementById("question");

    const optionsElement =
        document.getElementById("options");


    if (questionElement) {
        questionElement.textContent =
            "Submitting feedback...";
    }


    try {

        const response = await fetch(
            API_BASE_URL + "/feedback",
            {
                method: "POST",

                headers: {
                    "Content-Type": "application/json"
                },

                body: JSON.stringify(answers)
            }
        );


        const data =
            await response.json();


        console.log(
            "Submit response:",
            data
        );


        if (!response.ok) {
            throw new Error(
                data.detail ||
                "Failed to submit feedback"
            );
        }


        if (questionElement) {

            questionElement.textContent =
                "Thank you! ❤️";
        }


        if (optionsElement) {

            optionsElement.innerHTML = `

                <div style="text-align:center;">

                    <h3>
                        ✅ Feedback Submitted
                    </h3>

                    <p>
                        Your feedback has been saved successfully.
                    </p>

                    <button
                        onclick="restartFeedback()"
                    >
                        Submit Another
                    </button>

                </div>
            `;
        }

    }
    catch (error) {

        console.error(
            "Submit error:",
            error
        );

        if (questionElement) {

            questionElement.textContent =
                "❌ Submission failed";
        }

        if (optionsElement) {

            optionsElement.innerHTML = `

                <p style="color:red;">
                    ${error.message}
                </p>

                <button
                    onclick="restartFeedback()"
                >
                    Try Again
                </button>
            `;
        }
    }
}



function restartFeedback() {

    currentQuestion = 0;
    answers = {};

    loadQuestions();
}


window.setLanguage = setLanguage;
window.loadQuestions = loadQuestions;
window.showQuestion = showQuestion;
window.nextQuestion = nextQuestion;
window.submitFeedback = submitFeedback;
window.restartFeedback = restartFeedback;



document.addEventListener(
    "DOMContentLoaded",
    function() {

        console.log(
            "SLTMobitel Feedback System started"
        );

        loadQuestions();

    }
);
