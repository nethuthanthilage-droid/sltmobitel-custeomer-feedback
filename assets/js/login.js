document.addEventListener("DOMContentLoaded", function () {

    console.log("Login page loaded");

    const loginForm = document.getElementById("loginForm");
    const usernameInput = document.getElementById("username");
    const passwordInput = document.getElementById("password");
    const loginButton = document.getElementById("loginBtn");
    const errorMessage = document.getElementById("errorMessage");
    const togglePassword = document.getElementById("togglePassword");

    // TEMPORARY hardcoded credentials — remove once your backend is live
    const DEMO_USERNAME = "admin";
    const DEMO_PASSWORD = "admin123";

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
                this.innerHTML = '<i data-lucide="eye-off"></i>';
            } else {
                passwordInput.type = "password";
                this.innerHTML = '<i data-lucide="eye"></i>';
            }
            if (window.lucide) {
                lucide.createIcons();
            }
        });
    }

    loginForm.addEventListener("submit", async function (event) {

        event.preventDefault();
        console.log("Login button clicked");

        const username = usernameInput.value.trim();
        const password = passwordInput.value;

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

        // --- Try the real backend first ---
        try {

            console.log("Sending login request to:", API_BASE_URL + "/login");

            const response = await fetch(API_BASE_URL + "/login", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Accept": "application/json"
                },
                body: JSON.stringify({ username, password })
            });

            console.log("Login HTTP status:", response.status);

            let data = null;
            try {
                data = await response.json();
            } catch (jsonError) {
                console.error("Could not read JSON response:", jsonError);
            }

            if (!response.ok) {
                let message = "Login failed.";
                if (data) {
                    if (typeof data.detail === "string") message = data.detail;
                    else if (typeof data.message === "string") message = data.message;
                }
                throw new Error(message);
            }

            let token = "";
            if (typeof data === "string") {
                token = data;
            } else if (data) {
                token = data.access_token || data.token || data.accessToken || data.jwt || "";
            }

            completeLogin(username, token);
            return;

        } catch (error) {

            console.warn("Backend login failed or unreachable:", error.message);
            console.warn("Falling back to demo login check...");

            // --- Fallback: temporary hardcoded check ---
            if (username === DEMO_USERNAME && password === DEMO_PASSWORD) {
                console.log("Demo login successful");
                completeLogin(username, "demo-token");
                return;
            }

            showError("Invalid username or password.");

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

    function completeLogin(username, token) {

        if (token) {
            sessionStorage.setItem("adminToken", token);
        }

        sessionStorage.setItem("adminLoggedIn", "true");
        sessionStorage.setItem("adminUsername", username);

        console.log("Redirecting to dashboard...");
        window.location.href = "dashboard.html";
    }

    function showError(message) {
        console.error("Login error:", message);
        if (errorMessage) {
            errorMessage.textContent = message;
            errorMessage.style.display = "block";
        }
    }

});;
