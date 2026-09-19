const API_BASE_URL =
    "https://sltmobitel-custeomer-feedback.onrender.com";

document.addEventListener("DOMContentLoaded", function () {

    const loginForm =
        document.getElementById("loginForm");

    const errorMessage =
        document.getElementById("errorMessage");

    const loginBtn =
        document.getElementById("loginBtn");


    if (!loginForm) {
        console.error("loginForm not found");
        return;
    }


    loginForm.addEventListener(
        "submit",
        async function (event) {

            event.preventDefault();


            const username =
                document
                    .getElementById("username")
                    .value
                    .trim();


            const password =
                document
                    .getElementById("password")
                    .value;


            console.log("Trying login...");
            console.log("Username:", username);


            if (errorMessage) {

                errorMessage.textContent = "";
                errorMessage.style.display = "none";

            }


            if (loginBtn) {

                loginBtn.disabled = true;

                const text =
                    loginBtn.querySelector(
                        ".button-content span"
                    );

                if (text) {
                    text.textContent =
                        "Signing in...";
                }
            }


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
                    "Login HTTP status:",
                    response.status
                );


                const data =
                    await response.json();


                console.log(
                    "Login response:",
                    data
                );


                if (!response.ok) {

                    throw new Error(
                        data.detail ||
                        "Invalid username or password"
                    );

                }


                let token = null;


                if (typeof data === "string") {

                    token = data;

                }
                else if (data.access_token) {

                    token = data.access_token;

                }
                else if (data.token) {

                    token = data.token;

                }
                else if (data.accessToken) {

                    token = data.accessToken;

                }


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


                console.log(
                    "Login successful."
                );


                console.log(
                    "Opening dashboard..."
                );


                window.location.href =
                    "../pages/dashboard.html";

            }
            catch (error) {

                console.error(
                    "Login error:",
                    error
                );


                if (errorMessage) {

                    errorMessage.textContent =
                        "❌ " + error.message;

                    errorMessage.style.display =
                        "block";

                }


                if (loginBtn) {

                    loginBtn.disabled = false;


                    const text =
                        loginBtn.querySelector(
                            ".button-content span"
                        );


                    if (text) {

                        text.textContent =
                            "Sign In";

                    }

                }

            }

        }
    );

});
