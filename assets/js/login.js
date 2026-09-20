document.addEventListener("DOMContentLoaded", function () {

    console.log("Login page loaded");

    const loginForm = document.getElementById("loginForm");
    const usernameInput = document.getElementById("username");
    const passwordInput = document.getElementById("password");
    const loginButton = document.getElementById("loginBtn");
    const errorMessage = document.getElementById("errorMessage");
    const togglePassword = document.getElementById("togglePassword");


    if (!loginForm) {
        console.error("loginForm not found");
        return;
    }

    if (!usernameInput || !passwordInput) {
        console.error("Username or password input not found");
        return;
    }

    if (togglePassword) {

        togglePassword.addEventListener("click", function () {

            if (passwordInput.type === "password") {

                passwordInput.type = "text";

                this.innerHTML =
                    '<i data-lucide="eye-off"></i>';

            } else {

                passwordInput.type = "password";

                this.innerHTML =
                    '<i data-lucide="eye"></i>';
            }

            if (window.lucide) {
                lucide.createIcons();
            }

        });
    }


    loginForm.addEventListener("submit", async function (event) {

        event.preventDefault();

        console.log("Login button clicked");

        const username =
            usernameInput.value.trim();

        const password =
            passwordInput.value;

        // Clear old error
        if (errorMessage) {
            errorMessage.textContent = "";
            errorMessage.style.display = "none";
        }


        if (!username || !password) {

            showError("Please enter username and password.");

            return;
        }


        if (loginButton) {

            loginButton.disabled = true;

            loginButton.innerHTML = `
                <span class="button-content">
                    <span>Signing in...</span>
                </span>
            `;
        }

        console.log(
            "Sending login request to:",
            API_BASE_URL + "/login"
        );

        try {


            const response = await fetch(
                API_BASE_URL + "/login",
                {
                    method: "POST",

                    headers: {
                        "Content-Type": "application/json",
                        "Accept": "application/json"
                    },

                    body: JSON.stringify({
                        username: username,
                        password: password
                    })
                }
            );

            console.log(
                "Login HTTP status:",
                response.status
            );

            let data = null;

            try {
                data = await response.json();
            } catch (jsonError) {

                console.error(
                    "Could not read JSON response:",
                    jsonError
                );
            }

            console.log(
                "Login response:",
                data
            );

            if (!response.ok) {

                let message =
                    "Login failed.";

                if (data) {

                    if (typeof data.detail === "string") {
                        message = data.detail;
                    }
                    else if (typeof data.message === "string") {
                        message = data.message;
                    }
                }

                throw new Error(message);
            }


            let token = "";

            if (typeof data === "string") {

                token = data;

            } else if (data) {

                token =
                    data.access_token ||
                    data.token ||
                    data.accessToken ||
                    data.jwt ||
                    "";
            }

            console.log(
                "Login successful"
            );

            console.log(
                "Token received:",
                token ? "YES" : "NO"
            );

            if (token) {

                sessionStorage.setItem(
                    "adminToken",
                    token
                );

            }

            sessionStorage.setItem(
                "adminLoggedIn",
                "true"
            );

            sessionStorage.setItem(
                "adminUsername",
                username
            );

            console.log(
                "Redirecting to dashboard..."
            );

            window.location.href = "dashboard.html";

        }

        catch (error) {

            console.error(
                "LOGIN ERROR:",
                error
            );

            showError(
                error.message ||
                "Unable to login. Please try again."
            );

            // Restore button
            if (loginButton) {

                loginButton.disabled = false;

                loginButton.innerHTML = `
                    <span class="button-content">
                        <i data-lucide="log-in"></i>
                        <span>Sign In</span>
                    </span>
                `;

                if (window.lucide) {
                    lucide.createIcons();
                }
            }
        }

    });


    function showError(message) {

        console.error(
            "Login error:",
            message
        );

        if (errorMessage) {

            errorMessage.textContent =
                message;

            errorMessage.style.display =
                "block";
        }
    }

});
