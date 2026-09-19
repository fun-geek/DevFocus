const API_URL = "http://localhost:5000/api";


// ===============================
// GLOBAL VARIABLES
// ===============================

let userId = null;
let sessionId = null;

let timerInterval = null;

let totalSeconds = 25 * 60;

let remainingSeconds = totalSeconds;

let isRunning = false;

let interruptionCount = 0;


// ===============================
// PAGE LOAD
// ===============================

document.addEventListener("DOMContentLoaded", () => {

    updateDate();

    const savedUser = localStorage.getItem("devfocusUser");

    if (savedUser) {

        const user = JSON.parse(savedUser);

        userId = user.id;

        document.getElementById("userModal")
            .classList.remove("show");

    } else {

        document.getElementById("userModal")
            .classList.add("show");

    }

    updateTimerDisplay();

});


// ===============================
// DATE
// ===============================

function updateDate() {

    const date = new Date();

    const formatted = date.toLocaleDateString(
        "en-IN",
        {
            weekday: "long",
            day: "numeric",
            month: "long"
        }
    );

    document.getElementById("currentDate")
        .textContent = formatted;

}


// ===============================
// CREATE USER
// ===============================

async function createUser() {

    const name =
        document.getElementById("userName").value.trim();

    const email =
        document.getElementById("userEmail").value.trim();


    if (!name || !email) {

        alert("Please enter your name and email.");

        return;
    }


    try {

        const response = await fetch(
            `${API_URL}/users`,
            {
                method: "POST",

                headers: {
                    "Content-Type": "application/json"
                },

                body: JSON.stringify({
                    name,
                    email
                })
            }
        );


        const data = await response.json();


        if (!response.ok) {

            alert(data.message);

            return;
        }


        userId = data.userId;


        localStorage.setItem(
            "devfocusUser",
            JSON.stringify({
                id: userId,
                name,
                email
            })
        );


        document
            .getElementById("userModal")
            .classList.remove("show");


    } catch (error) {

        console.error(error);

        alert(
            "Cannot connect to DevFocus server."
        );

    }

}


// ===============================
// START SESSION
// ===============================

async function startSession() {

    if (!userId) {

        document
            .getElementById("userModal")
            .classList.add("show");

        return;
    }


    try {

        const response = await fetch(
            `${API_URL}/sessions/start`,
            {
                method: "POST",

                headers: {
                    "Content-Type": "application/json"
                },

                body: JSON.stringify({
                    user_id: userId
                })
            }
        );


        const data = await response.json();


        if (!response.ok) {

            alert(data.message);

            return;
        }


        sessionId = data.sessionId;

        isRunning = true;


        document
            .getElementById("startBtn")
            .disabled = true;


        document
            .getElementById("interruptBtn")
            .disabled = false;


        document
            .getElementById("endBtn")
            .disabled = false;


        document
            .getElementById("sessionStatus")
            .textContent = "Focus session active";


        document
            .getElementById("timerText")
            .textContent = "Stay focused";


        const indicator =
            document.getElementById("liveIndicator");

        indicator.classList.add("active");

        indicator.querySelector("label")
            .textContent = "LIVE";


        startTimer();


    } catch (error) {

        console.error(error);

        alert(
            "Cannot connect to server."
        );

    }

}


// ===============================
// TIMER
// ===============================

function startTimer() {

    timerInterval = setInterval(() => {

        if (remainingSeconds > 0) {

            remainingSeconds--;

            updateTimerDisplay();

        } else {

            clearInterval(timerInterval);

            endSession();

        }

    }, 1000);

}


// ===============================
// DISPLAY TIMER
// ===============================

function updateTimerDisplay() {

    const minutes =
        Math.floor(remainingSeconds / 60);

    const seconds =
        remainingSeconds % 60;


    document.getElementById("timer")
        .textContent =
        `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;


    const progress =
        ((totalSeconds - remainingSeconds) /
            totalSeconds) * 360;


    document.querySelector(".timer-ring")
        .style.background =
        `conic-gradient(
            var(--primary) ${progress}deg,
            rgba(124,92,255,0.1) ${progress}deg
        )`;

}


// ===============================
// INTERRUPTION MODAL
// ===============================

function showInterruptions() {

    if (!isRunning) return;

    document
        .getElementById("interruptModal")
        .classList.add("show");

}


function closeInterruptions() {

    document
        .getElementById("interruptModal")
        .classList.remove("show");

}


// ===============================
// LOG INTERRUPTION
// ===============================

async function logInterruption(reason) {

    if (!sessionId) return;


    try {

        const response = await fetch(
            `${API_URL}/interruptions`,
            {
                method: "POST",

                headers: {
                    "Content-Type": "application/json"
                },

                body: JSON.stringify({
                    session_id: sessionId,
                    reason: reason
                })
            }
        );


        const data = await response.json();


        if (!response.ok) {

            alert(data.message);

            return;
        }


        interruptionCount++;

        document.getElementById(
            "interruptionCount"
        ).textContent = interruptionCount;


        closeInterruptions();


        alert(`Distraction logged: ${reason}`);


    } catch (error) {

        console.error(error);

        alert(
            "Failed to log interruption."
        );

    }

}


// ===============================
// END SESSION
// ===============================

async function endSession() {

    if (!sessionId) return;


    clearInterval(timerInterval);

    isRunning = false;


    try {

        const response = await fetch(
            `${API_URL}/sessions/${sessionId}/end`,
            {
                method: "PUT"
            }
        );


        const data = await response.json();


        if (!response.ok) {

            alert(data.message);

            return;
        }


        const elapsedSeconds =
            totalSeconds - remainingSeconds;


        const minutes =
            Math.floor(elapsedSeconds / 60);


        document.getElementById(
            "focusMinutes"
        ).textContent = minutes;


        document.getElementById(
            "sessionCount"
        ).textContent =
            Number(
                document.getElementById("sessionCount")
                    .textContent
            ) + 1;


        document.getElementById(
            "sessionStatus"
        ).textContent =
            "Session completed";


        document.getElementById(
            "timerText"
        ).textContent =
            "Great work!";


        document.getElementById(
            "startBtn"
        ).disabled = false;


        document.getElementById(
            "interruptBtn"
        ).disabled = true;


        document.getElementById(
            "endBtn"
        ).disabled = true;


        const indicator =
            document.getElementById("liveIndicator");

        indicator.classList.remove("active");

        indicator.querySelector("label")
            .textContent = "OFFLINE";


        sessionId = null;


    } catch (error) {

        console.error(error);

        alert(
            "Failed to end session."
        );

    }

}