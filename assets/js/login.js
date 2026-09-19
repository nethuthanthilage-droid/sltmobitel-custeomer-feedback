const API_BASE_URL = "https://sltmobitel-custeomer-feedback.onrender.com";

document.addEventListener("DOMContentLoaded", function () {

    const loginForm = document.getElementById("loginForm");
    const errorMessage = document.getElementById("errorMessage");
    const loginBtn = document.getElementById("loginBtn");

    if (!loginForm) {
        console.error("loginForm not found");
        return;
    }

    loginForm.addEventListener("submit", async function (event) {

        event.preventDefault();

        const username =
            document.getElementById("username").value.trim();

        const password =
            document.getElementById("password").value;

        errorMessage.textContent = "";
        errorMessage.style.display = "none";

        loginBtn.disabled = true;

        loginBtn.querySelector(".button-content span").textContent =
            "Signing in...";

        try {

            const response = await fetch(
                API_BASE_URL + "/login",
                {
                    method: "POST",

                    headers: {
                        "Content-Type": "application/json"
                    },

                    body: JSON.stringify({
                        username: username,
                        password: password
                    })
                }
            );

            const data = await response.json();

            console.log("Login response:", data);

            if (!response.ok) {

                throw new Error(
                    data.detail || "Invalid username or password"
                );
            }

            // Backend returns the login token
            const token =
                typeof data === "string"
                    ? data
                    : (
                        data.access_token ||
                        data.token ||
                        data.accessToken
                    );

            if (token) {
                sessionStorage.setItem("adminToken", token);
            }

            sessionStorage.setItem(
                "adminLoggedIn",
                "true"
            );

            // Go to dashboard
            window.location.href =
                "../pages/dashboard.html";

        } catch (error) {

            console.error("Login error:", error);

            errorMessage.textContent =
                "❌ " + error.message;

            errorMessage.style.display = "block";

            loginBtn.disabled = false;

            loginBtn.querySelector(".button-content span").textContent =
                "Sign In";
        }

    });

});
