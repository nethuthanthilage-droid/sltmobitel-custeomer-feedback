const API_BASE_URL =
    "https://sltmobitel-custeomer-feedback.onrender.com";




document.addEventListener("DOMContentLoaded", function () {

    console.log("Admin Login System Started");

    const loginForm =
        document.getElementById("loginForm");

    const usernameInput =
        document.getElementById("username");

    const passwordInput =
        document.getElementById("password");

    const loginBtn =
        document.getElementById("loginBtn");

    const errorMessage =
        document.getElementById("errorMessage");


    if (!loginForm) {

        console.error(
            "loginForm not found."
        );

        return;
    }


    loginForm.addEventListener(
        "submit",
        async function (event) {

            event.preventDefault();


            const username =
                usernameInput.value.trim();

            const password =
                passwordInput.value;


            // Clear previous error
            errorMessage.textContent = "";
            errorMessage.style.display = "none";


            // Check empty fields
            if (!username || !password) {

                showError(
                    "Please enter your username and password."
                );

                return;
            }


            // Disable button
            loginBtn.disabled = true;

            loginBtn.innerHTML = `
                <span class="button-content">
                    <i data-lucide="loader-2" class="spin"></i>
                    <span>Signing In...</span>
                </span>
            `;


            if (window.lucide) {
                lucide.createIcons();
            }


            console.log(
                "Sending login request..."
            );


            try {

                const response =
                    await fetch(
                        API_BASE_URL + "/login",
                        {
                            method: "POST",

                            headers: {
                                "Content-Type":
                                    "application/json"
                            },

                            body: JSON.stringify({
                                username: username,
                                password: password
                            })
                        }
                    );


                console.log(
                    "Login HTTP Status:",
                    response.status
                );


                let data = {};

                try {

                    data =
                        await response.json();

                } catch (jsonError) {

                    console.warn(
                        "Response was not JSON."
                    );

                }


                console.log(
                    "Login response:",
                    data
                );

                if (!response.ok) {

                    let message =
                        "Invalid username or password.";

                    if (data.detail) {

                        if (
                            typeof data.detail ===
                            "string"
                        ) {

                            message =
                                data.detail;

                        }
                    }

                    showError(message);

                    resetLoginButton();

                    return;
                }


                console.log(
                    "Login successful."
                );


                // Save token if backend sends one
                const token =
                    data.access_token ||
                    data.token ||
                    data.accessToken;


                if (token) {

                    sessionStorage.setItem(
                        "adminToken",
                        token
                    );

                    console.log(
                        "Admin token saved."
                    );

                } else {

                    console.warn(
                        "No access token returned by backend."
                    );
                }


                // Save login state
                sessionStorage.setItem(
                    "adminLoggedIn",
                    "true"
                );



                loginBtn.innerHTML = `
                    <span class="button-content">
                        <i data-lucide="check-circle"></i>
                        <span>Login Successful</span>
                    </span>
                `;


                if (window.lucide) {
                    lucide.createIcons();
                }


                console.log(
                    "Redirecting to dashboard..."
                );


                setTimeout(
                    function () {

                        window.location.href =
                            "../pages/dashboard.html";

                    },
                    500
                );

            }


            catch (error) {

                console.error(
                    "Login error:",
                    error
                );


                showError(
                    "Unable to connect to the server. Please try again."
                );


                resetLoginButton();

            }

        }
    );


    // ========================================
    // SHOW ERROR
    // ========================================

    function showError(message) {

        if (!errorMessage) {
            return;
        }


        errorMessage.textContent =
            message;

        errorMessage.style.display =
            "block";

    }



    function resetLoginButton() {

        loginBtn.disabled = false;

        loginBtn.innerHTML = `
            <span class="button-content">
                <i data-lucide="log-in"></i>
                <span>Sign In</span>
            </span>
        `;


        if (window.lucide) {
            lucide.createIcons();
        }

    }

});

        loadQuestions();

    }
);
