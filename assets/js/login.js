document.addEventListener("DOMContentLoaded", function () {

    console.log("=================================");
    console.log("SLTMobitel Admin Login");
    console.log("API:", API_BASE_URL);
    console.log("=================================");


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

    const togglePassword =
        document.getElementById("togglePassword");



    if (!loginForm) {

        console.error(
            "ERROR: loginForm not found."
        );

        return;
    }


    if (!usernameInput) {

        console.error(
            "ERROR: username input not found."
        );

        return;
    }


    if (!passwordInput) {

        console.error(
            "ERROR: password input not found."
        );

        return;
    }



    function clearError() {

        if (errorMessage) {

            errorMessage.textContent = "";

            errorMessage.style.display =
                "none";
        }
    }

    function showError(message) {

        console.error(
            "LOGIN ERROR:",
            message
        );

        if (errorMessage) {

            errorMessage.textContent =
                "❌ " + message;

            errorMessage.style.display =
                "block";
        }
    }


    function setLoading(loading) {

        if (!loginBtn) {
            return;
        }


        loginBtn.disabled = loading;


        const buttonText =
            loginBtn.querySelector(
                ".button-content span"
            );


        if (buttonText) {

            buttonText.textContent =
                loading
                    ? "Signing in..."
                    : "Sign In";
        }
    }


    // -------------------------------------------------
    // Password show / hide
    // -------------------------------------------------

    if (togglePassword) {

        togglePassword.addEventListener(
            "click",
            function () {

                const isPassword =
                    passwordInput.type === "password";


                passwordInput.type =
                    isPassword
                        ? "text"
                        : "password";


                this.setAttribute(
                    "aria-label",
                    isPassword
                        ? "Hide password"
                        : "Show password"
                );


                this.innerHTML =
                    isPassword
                        ? '<i data-lucide="eye-off"></i>'
                        : '<i data-lucide="eye"></i>';


                if (window.lucide) {

                    lucide.createIcons();
                }

            }
        );
    }


    // -------------------------------------------------
    // LOGIN
    // -------------------------------------------------

    loginForm.addEventListener(
        "submit",
        async function (event) {

            event.preventDefault();


            clearError();


            const username =
                usernameInput.value.trim();


            const password =
                passwordInput.value;


            console.log(
                "Username entered:",
                username
            );

            if (username === "") {

                showError(
                    "Please enter your username."
                );

                usernameInput.focus();

                return;
            }


            if (password === "") {

                showError(
                    "Please enter your password."
                );

                passwordInput.focus();

                return;
            }


            setLoading(true);


            try {

                console.log(
                    "Sending login request..."
                );


                const response =
                    await fetch(
                        API_BASE_URL + "/login",
                        {
                            method: "POST",

                            headers: {
                                "Content-Type":
                                    "application/json",

                                "Accept":
                                    "application/json"
                            },

                            body: JSON.stringify({
                                username:
                                    username,

                                password:
                                    password
                            })
                        }
                    );


                console.log(
                    "Login status:",
                    response.status
                );


                // -------------------------------------
                // Read response
                // -------------------------------------

                const responseText =
                    await response.text();


                console.log(
                    "Server response:",
                    responseText
                );


                let data;


                try {

                    data =
                        JSON.parse(
                            responseText
                        );

                }
                catch (jsonError) {

                    data =
                        responseText;
                }



                if (!response.ok) {

                    let message =
                        "Invalid username or password.";


                    if (
                        data &&
                        typeof data === "object" &&
                        data.detail
                    ) {

                        if (
                            typeof data.detail ===
                            "string"
                        ) {

                            message =
                                data.detail;

                        }
                        else {

                            message =
                                JSON.stringify(
                                    data.detail
                                );
                        }
                    }


                    showError(message);

                    setLoading(false);

                    return;
                }

                let token = null;


                if (
                    typeof data === "string"
                ) {

                    token = data;

                }
                else if (
                    data &&
                    data.access_token
                ) {

                    token =
                        data.access_token;

                }
                else if (
                    data &&
                    data.token
                ) {

                    token =
                        data.token;

                }
                else if (
                    data &&
                    data.accessToken
                ) {

                    token =
                        data.accessToken;
                }



                if (token) {

                    sessionStorage.setItem(
                        "adminToken",
                        token
                    );

                    console.log(
                        "Admin token saved."
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
                    "LOGIN SUCCESSFUL"
                );



                window.location.href =
                    "../pages/dashboard.html";

            }
            catch (error) {

                console.error(
                    "Login request failed:",
                    error
                );


                showError(
                    "Could not connect to the server. Please try again."
                );


                setLoading(false);
            }

        }
    );



    passwordInput.addEventListener(
        "keydown",
        function (event) {

            if (event.key === "Enter") {

                event.preventDefault();

                loginForm.requestSubmit();
            }

        }
    );


    usernameInput.addEventListener(
        "keydown",
        function (event) {

            if (event.key === "Enter") {

                event.preventDefault();

                passwordInput.focus();
            }

        }
    );



    if (window.lucide) {

        lucide.createIcons();
    }

});
