async function finishChat() {

    if (inputArea) {
        inputArea.style.display = "none";
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

    console.log("Customer Answers:", answers);

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
            answers.comment || null
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
        // SUCCESS
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
        // AGAIN / EXIT BUTTONS
        // ====================================

        const buttonContainer =
            document.createElement("div");

        buttonContainer.style.display = "flex";
        buttonContainer.style.justifyContent = "center";
        buttonContainer.style.gap = "12px";
        buttonContainer.style.margin = "20px 0";
        buttonContainer.style.flexWrap = "wrap";


        // AGAIN BUTTON
        const againButton =
            document.createElement("button");

        againButton.type = "button";

        againButton.textContent =
            currentLanguage === "si"
                ? "🔄 නැවත"
                : "🔄 Again";

        againButton.style.padding = "12px 25px";
        againButton.style.border = "none";
        againButton.style.borderRadius = "10px";
        againButton.style.cursor = "pointer";
        againButton.style.fontSize = "15px";


        againButton.onclick =
            function () {

                buttonContainer.remove();

                startChat();
            };


        // EXIT BUTTON
        const exitButton =
            document.createElement("button");

        exitButton.type = "button";

        exitButton.textContent =
            currentLanguage === "si"
                ? "🚪 පිටවන්න"
                : "🚪 Exit";

        exitButton.style.padding = "12px 25px";
        exitButton.style.border = "none";
        exitButton.style.borderRadius = "10px";
        exitButton.style.cursor = "pointer";
        exitButton.style.fontSize = "15px";


        exitButton.onclick =
            function () {

                buttonContainer.remove();

                if (inputArea) {
                    inputArea.style.display = "none";
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
