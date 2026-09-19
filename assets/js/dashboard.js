console.log("SLTMobitel Dashboard JS loaded");


const adminLoggedIn =
    sessionStorage.getItem("adminLoggedIn");

const adminToken =
    sessionStorage.getItem("adminToken");


if (
    adminLoggedIn !== "true" ||
    !adminToken
) {

    console.log(
        "No admin session. Returning to login."
    );

    window.location.href =
        "login.html";
}


const DASHBOARD_API =
    API_BASE_URL;

const totalFeedback =
    document.getElementById("totalFeedback");

const positiveFeedback =
    document.getElementById("positiveFeedback");

const neutralFeedback =
    document.getElementById("neutralFeedback");

const negativeFeedback =
    document.getElementById("negativeFeedback");

const positivePercent =
    document.getElementById("positivePercent");

const neutralPercent =
    document.getElementById("neutralPercent");

const negativePercent =
    document.getElementById("negativePercent");

const feedbackTableBody =
    document.getElementById("feedbackTableBody");

const recordCount =
    document.getElementById("recordCount");

const errorMessage =
    document.getElementById("errorMessage");

function getHeaders() {

    return {
        "Content-Type":
            "application/json",

        "Authorization":
            "Bearer " + adminToken
    };
}


function showDashboardError(message) {

    console.error(
        "Dashboard error:",
        message
    );

    if (errorMessage) {

        errorMessage.textContent =
            "⚠️ " + message;

        errorMessage.style.display =
            "block";
    }
}


async function loadDashboard() {

    console.log(
        "Loading dashboard..."
    );

    try {

        const response =
            await fetch(
                DASHBOARD_API +
                "/dashboard-data",
                {
                    method: "GET",
                    headers: getHeaders()
                }
            );


        console.log(
            "Dashboard status:",
            response.status
        );


        if (!response.ok) {

            if (
                response.status === 401 ||
                response.status === 403
            ) {

                sessionStorage.clear();

                window.location.href =
                    "login.html";

                return;
            }


            throw new Error(
                "Dashboard request failed: " +
                response.status
            );
        }


        const data =
            await response.json();


        console.log(
            "Dashboard data:",
            data
        );


        updateDashboard(data);

    }
    catch (error) {

        console.error(
            "Dashboard loading error:",
            error
        );

        showDashboardError(
            error.message
        );
    }
}

function updateDashboard(data) {

    /*
        Your backend may return different names.
        This code supports common formats.
    */


    const total =
        Number(
            data.total_feedback ??
            data.total ??
            data.count ??
            0
        );


    const positive =
        Number(
            data.positive ??
            data.positive_feedback ??
            data.sentiment?.positive ??
            0
        );


    const neutral =
        Number(
            data.neutral ??
            data.neutral_feedback ??
            data.sentiment?.neutral ??
            0
        );


    const negative =
        Number(
            data.negative ??
            data.negative_feedback ??
            data.sentiment?.negative ??
            0
        );


    setText(
        totalFeedback,
        total
    );


    setText(
        positiveFeedback,
        positive
    );


    setText(
        neutralFeedback,
        neutral
    );


    setText(
        negativeFeedback,
        negative
    );


    const positivePct =
        total > 0
            ? Math.round(
                positive / total * 100
            )
            : 0;


    const neutralPct =
        total > 0
            ? Math.round(
                neutral / total * 100
            )
            : 0;


    const negativePct =
        total > 0
            ? Math.round(
                negative / total * 100
            )
            : 0;


    setText(
        positivePercent,
        positivePct + "%"
    );


    setText(
        neutralPercent,
        neutralPct + "%"
    );


    setText(
        negativePercent,
        negativePct + "%"
    );


    // Try to find feedback records

    const feedback =
        data.feedback ||
        data.records ||
        data.data ||
        [];


    if (Array.isArray(feedback)) {

        displayFeedbackTable(
            feedback
        );

    }

}

function setText(element, value) {

    if (element) {
        element.textContent =
            value;
    }

}


function displayFeedbackTable(records) {

    if (!feedbackTableBody) {
        return;
    }


    if (!records.length) {

        feedbackTableBody.innerHTML = `
            <tr>
                <td colspan="10"
                    style="text-align:center;padding:30px;">
                    No customer feedback records found.
                </td>
            </tr>
        `;

        if (recordCount) {
            recordCount.textContent =
                "0 records";
        }

        return;
    }


    feedbackTableBody.innerHTML = "";


    records.forEach(
        function (item, index) {

            const row =
                document.createElement("tr");


            row.innerHTML = `

                <td>
                    ${escapeHTML(
                        item.id ??
                        index + 1
                    )}
                </td>

                <td>
                    ${escapeHTML(
                        item.service ??
                        "-"
                    )}
                </td>

                <td>
                    ${escapeHTML(
                        item.phone ??
                        "-"
                    )}
                </td>

                <td>
                    ${escapeHTML(
                        item.waiting ??
                        "-"
                    )}
                </td>

                <td>
                    ${escapeHTML(
                        item.staff ??
                        "-"
                    )}
                </td>

                <td>
                    ${escapeHTML(
                        item.office ??
                        "-"
                    )}
                </td>

                <td>
                    ${escapeHTML(
                        item.parking ??
                        "-"
                    )}
                </td>

                <td>
                    ${escapeHTML(
                        item.comment ??
                        "-"
                    )}
                </td>

                <td>
                    ${escapeHTML(
                        item.sentiment ??
                        "-"
                    )}
                </td>

                <td>
                    ${formatDate(
                        item.created_at
                    )}
                </td>

            `;


            feedbackTableBody.appendChild(
                row
            );

        }
    );


    if (recordCount) {

        recordCount.textContent =
            records.length +
            (
                records.length === 1
                    ? " record"
                    : " records"
            );

    }

}
function escapeHTML(value) {

    if (
        value === null ||
        value === undefined
    ) {
        return "-";
    }


    return String(value)
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");
}


function formatDate(value) {

    if (!value) {
        return "-";
    }


    try {

        return new Date(value)
            .toLocaleString(
                "en-GB",
                {
                    day: "2-digit",
                    month: "short",
                    year: "numeric",
                    hour: "2-digit",
                    minute: "2-digit"
                }
            );

    }
    catch {

        return value;
    }

}


const logoutBtn =
    document.getElementById("logoutBtn");


if (logoutBtn) {

    logoutBtn.addEventListener(
        "click",
        function () {

            sessionStorage.removeItem(
                "adminToken"
            );

            sessionStorage.removeItem(
                "adminLoggedIn"
            );

            window.location.href =
                "login.html";

        }
    );

}



const refreshBtn =
    document.getElementById("refreshBtn");


if (refreshBtn) {

    refreshBtn.addEventListener(
        "click",
        function () {

            loadDashboard();

        }
    );

}


const currentDateElement =
    document.getElementById(
        "currentDate"
    );


if (currentDateElement) {

    const today =
        new Date();


    currentDateElement.textContent =
        today.toLocaleDateString(
            "en-GB",
            {
                day: "2-digit",
                month: "short",
                year: "numeric"
            }
        );

}

const mobileMenuBtn =
    document.getElementById(
        "mobileMenuBtn"
    );

const sidebar =
    document.getElementById(
        "sidebar"
    );


if (
    mobileMenuBtn &&
    sidebar
) {

    mobileMenuBtn.addEventListener(
        "click",
        function () {

            sidebar.classList.toggle(
                "mobile-open"
            );

        }
    );

}
let sentimentChart;
let serviceChart;
let waitingChart;
let staffChart;
let officeChart;
let weeklyChart;


function destroyChart(chart) {

    if (chart) {
        chart.destroy();
    }

}

function createCharts(data) {

    if (!window.Chart) {
        return;
    }


    const sentiment =
        data.sentiment || {};


    const services =
        data.services ||
        data.service_distribution ||
        {};


    createSentimentChart(
        sentiment
    );


    createServiceChart(
        services
    );

}
function createSentimentChart(data) {

    const canvas =
        document.getElementById(
            "sentimentChart"
        );


    if (!canvas) {
        return;
    }


    destroyChart(
        sentimentChart
    );


    sentimentChart =
        new Chart(
            canvas,
            {
                type: "doughnut",

                data: {
                    labels: [
                        "Positive",
                        "Neutral",
                        "Negative"
                    ],

                    datasets: [
                        {
                            data: [
                                Number(
                                    data.positive || 0
                                ),

                                Number(
                                    data.neutral || 0
                                ),

                                Number(
                                    data.negative || 0
                                )
                            ]
                        }
                    ]
                },

                options: {
                    responsive: true,

                    maintainAspectRatio:
                        false
                }
            }
        );

}
function createServiceChart(data) {

    const canvas =
        document.getElementById(
            "serviceChart"
        );


    if (!canvas) {
        return;
    }


    destroyChart(
        serviceChart
    );


    const labels =
        Object.keys(data);


    const values =
        Object.values(data)
            .map(Number);


    serviceChart =
        new Chart(
            canvas,
            {
                type: "bar",

                data: {
                    labels: labels,

                    datasets: [
                        {
                            label:
                                "Feedback",

                            data:
                                values
                        }
                    ]
                },

                options: {
                    responsive: true,

                    maintainAspectRatio:
                        false
                }
            }
        );

}
async function loadAISummary() {

    try {

        const response =
            await fetch(
                DASHBOARD_API +
                "/ai-summary",
                {
                    headers:
                        getHeaders()
                }
            );


        if (!response.ok) {
            return;
        }


        const data =
            await response.json();


        console.log(
            "AI summary:",
            data
        );


        const overview =
            document.getElementById(
                "overviewText"
            );


        const overall =
            document.getElementById(
                "overallSummary"
            );


        const service =
            document.getElementById(
                "serviceSummary"
            );


        if (overview) {

            overview.textContent =
                data.overview ||
                data.summary ||
                "AI summary available.";

        }


        if (overall) {

            overall.textContent =
                data.overall_summary ||
                data.overall ||
                data.summary ||
                "No overall summary available.";

        }


        if (service) {

            service.textContent =
                data.service_summary ||
                "Service summary available.";

        }

    }
    catch (error) {

        console.error(
            "AI summary error:",
            error
        );

    }

}

async function downloadAISummaryWord() {

    window.open(
        DASHBOARD_API +
        "/download-ai-summary",
        "_blank"
    );

}

async function downloadFeedbackWord() {

    window.open(
        DASHBOARD_API +
        "/download-customer-feedback",
        "_blank"
    );

}


window.loadDashboard =
    loadDashboard;

window.downloadAISummaryWord =
    downloadAISummaryWord;

window.downloadFeedbackWord =
    downloadFeedbackWord;

document.addEventListener(
    "DOMContentLoaded",
    function () {

        console.log(
            "================================"
        );

        console.log(
            "SLTMobitel Dashboard"
        );

        console.log(
            "API:",
            DASHBOARD_API
        );

        console.log(
            "================================"
        );


        if (window.lucide) {
            lucide.createIcons();
        }


        loadDashboard();

        loadAISummary();

    }
);
