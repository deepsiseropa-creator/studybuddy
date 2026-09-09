/* =========================================================
   PAGE NAVIGATION
========================================================= */

function showPage(pageId, element) {

    document.querySelectorAll(".page").forEach(page => {
        page.classList.remove("active");
    });

    const page = document.getElementById(pageId);

    if (page) {
        page.classList.add("active");
    }

    document.querySelectorAll(".nav-item").forEach(item => {
        item.classList.remove("active");
    });

    if (element) {
        element.classList.add("active");
    }
}


/* =========================================================
   TASKS
========================================================= */

let tasks =
    JSON.parse(localStorage.getItem("studyTasks")) || [];

function saveTasks() {

    localStorage.setItem(
        "studyTasks",
        JSON.stringify(tasks)
    );
}

function addTask() {

    const input =
        document.getElementById("taskInput");

    const text =
        input.value.trim();

    if (!text) {

        showToast("Enter a task first");

        return;
    }

    tasks.push({
        id: Date.now(),
        text: text,
        completed: false,
        date: new Date().toLocaleDateString()
    });

    input.value = "";

    saveTasks();

    updateUI();

    showToast("Task added ✅");
}

function toggleTask(id) {

    const task =
        tasks.find(t => t.id === id);

    if (!task) return;

    task.completed =
        !task.completed;

    saveTasks();

    updateUI();
}

function deleteTask(id) {

    tasks =
        tasks.filter(t => t.id !== id);

    saveTasks();

    updateUI();

    showToast("Task deleted");
}

function renderTasks() {

    const list =
        document.getElementById("taskList");

    const dashboard =
        document.getElementById("dashboardTasks");

    if (!list) return;

    if (tasks.length === 0) {

        list.innerHTML =
            `<p style="color:#8e9aa6">
                No tasks yet.
             </p>`;

        if (dashboard) {

            dashboard.innerHTML =
                `<p style="color:#8e9aa6">
                    No tasks yet. Add your first task!
                 </p>`;
        }

        return;
    }

    list.innerHTML =
        tasks.map(task => `

            <div class="task">

                <div
                    class="check ${task.completed ? "done" : ""}"
                    onclick="toggleTask(${task.id})"
                ></div>

                <div class="task-content">

                    <strong
                        style="
                        text-decoration:
                        ${task.completed ? "line-through" : "none"};
                        opacity:
                        ${task.completed ? ".55" : "1"};
                        "
                    >
                        ${escapeHTML(task.text)}
                    </strong>

                    <small>
                        ${task.date}
                    </small>

                </div>

                <button
                    class="delete"
                    onclick="deleteTask(${task.id})"
                >
                    ✕
                </button>

            </div>

        `).join("");


    if (dashboard) {

        dashboard.innerHTML =
            tasks.slice(0, 5).map(task => `

                <div class="task">

                    <div
                        class="check ${task.completed ? "done" : ""}"
                        onclick="toggleTask(${task.id})"
                    ></div>

                    <div class="task-content">

                        <strong>
                            ${escapeHTML(task.text)}
                        </strong>

                        <small>
                            ${task.completed ? "Completed" : "Pending"}
                        </small>

                    </div>

                </div>

            `).join("");
    }
}


/* =========================================================
   NOTES
========================================================= */

let notes =
    JSON.parse(localStorage.getItem("studyNotes")) || [];

function saveNotes() {

    localStorage.setItem(
        "studyNotes",
        JSON.stringify(notes)
    );
}

function addNote() {

    const title =
        document.getElementById("noteTitle")
            .value.trim();

    const content =
        document.getElementById("noteContent")
            .value.trim();

    if (!title || !content) {

        showToast("Enter note title and content");

        return;
    }

    notes.push({
        id: Date.now(),
        title: title,
        content: content,
        date: new Date().toLocaleDateString()
    });

    document.getElementById("noteTitle").value = "";
    document.getElementById("noteContent").value = "";

    saveNotes();

    updateUI();

    showToast("Note saved 📝");
}

function deleteNote(id) {

    notes =
        notes.filter(note => note.id !== id);

    saveNotes();

    updateUI();

    showToast("Note deleted");
}

function renderNotes() {

    const grid =
        document.getElementById("noteGrid");

    if (!grid) return;

    if (notes.length === 0) {

        grid.innerHTML =
            `<p style="color:#8e9aa6">
                No notes saved yet.
             </p>`;

        return;
    }

    grid.innerHTML =
        notes.map(note => `

            <div class="card note">

                <div class="note-actions">

                    <button
                        class="delete"
                        onclick="deleteNote(${note.id})"
                    >
                        ✕
                    </button>

                </div>

                <h3>
                    ${escapeHTML(note.title)}
                </h3>

                <p>
                    ${escapeHTML(note.content)}
                </p>

                <div class="note-date">
                    ${note.date}
                </div>

            </div>

        `).join("");
}


/* =========================================================
   TIMER
========================================================= */

let timerSeconds = 25 * 60;

let timerInterval = null;

let timerRunning = false;

let totalFocusMinutes =
    Number(
        localStorage.getItem("focusMinutes")
    ) || 0;


function updateTimerDisplay() {

    const minutes =
        Math.floor(timerSeconds / 60);

    const seconds =
        timerSeconds % 60;

    const display =
        `${String(minutes).padStart(2,"0")}:${String(seconds).padStart(2,"0")}`;

    const timer1 =
        document.getElementById("timerDisplay");

    const timer2 =
        document.getElementById("timerDisplay2");

    if (timer1) {
        timer1.textContent = display;
    }

    if (timer2) {
        timer2.textContent = display;
    }
}

function startTimer() {

    if (timerRunning) return;

    timerRunning = true;

    timerInterval =
        setInterval(() => {

            if (timerSeconds <= 0) {

                clearInterval(timerInterval);

                timerRunning = false;

                totalFocusMinutes += 25;

                localStorage.setItem(
                    "focusMinutes",
                    totalFocusMinutes
                );

                showToast(
                    "Focus session completed 🎉"
                );

                resetTimer();

                updateUI();

                return;
            }

            timerSeconds--;

            updateTimerDisplay();

        }, 1000);

    showToast("Focus timer started ⏱️");
}

function pauseTimer() {

    clearInterval(timerInterval);

    timerRunning = false;

    showToast("Timer paused");
}

function resetTimer() {

    clearInterval(timerInterval);

    timerRunning = false;

    timerSeconds = 25 * 60;

    updateTimerDisplay();
}

updateTimerDisplay();


/* =========================================================
   STUDY PLANNER
========================================================= */

let studyPlans =
    JSON.parse(localStorage.getItem("studyPlans")) || [];

function saveStudyPlans() {

    localStorage.setItem(
        "studyPlans",
        JSON.stringify(studyPlans)
    );
}

function addStudyPlan() {

    const subject =
        document.getElementById("planSubject")
            .value.trim();

    const time =
        document.getElementById("planTime").value;

    const duration =
        Number(
            document.getElementById("planDuration").value
        );

    const day =
        Number(
            document.getElementById("planDay").value
        );

    const priority =
        document.getElementById("planPriority").value;

    if (!subject || !time) {

        showToast(
            "Enter subject and time first"
        );

        return;
    }

    studyPlans.push({

        id: Date.now(),

        subject: subject,

        time: time,

        duration: duration,

        day: day,

        priority: priority

    });

    saveStudyPlans();

    document.getElementById("planSubject").value = "";

    renderStudyPlanner();

    showToast("Study session added 📚");
}

function deleteStudyPlan(id) {

    studyPlans =
        studyPlans.filter(
            plan => plan.id !== id
        );

    saveStudyPlans();

    renderStudyPlanner();

    showToast("Study session removed");
}

function getWeekDates() {

    const now = new Date();

    const currentDay =
        now.getDay();

    const mondayOffset =
        currentDay === 0
        ? -6
        : 1 - currentDay;

    const monday =
        new Date(now);

    monday.setDate(
        now.getDate() + mondayOffset
    );

    return Array.from(
        { length: 7 },
        (_, index) => {

            const date =
                new Date(monday);

            date.setDate(
                monday.getDate() + index
            );

            return date;
        }
    );
}

function renderStudyPlanner() {

    const weekGrid =
        document.getElementById("weekGrid");

    if (!weekGrid) return;

    const dates =
        getWeekDates();

    const dayNames =
        [
            "Monday",
            "Tuesday",
            "Wednesday",
            "Thursday",
            "Friday",
            "Saturday",
            "Sunday"
        ];

    const today =
        new Date();

    weekGrid.innerHTML =
        dates.map((date,index) => {

            const dayNumber =
                date.getDay();

            const isToday =
                date.toDateString() ===
                today.toDateString();

            const dayPlans =
                studyPlans
                    .filter(
                        plan =>
                            plan.day === dayNumber
                    )
                    .sort(
                        (a,b) =>
                            a.time.localeCompare(b.time)
                    );

            return `

                <div
                    class="week-day ${isToday ? "today" : ""}"
                    onclick="document.getElementById('planDay').value='${dayNumber}'"
                >

                    <div class="week-day-name">
                        ${dayNames[index]}
                    </div>

                    <div class="week-day-number">
                        ${date.getDate()}
                    </div>

                    ${
                        dayPlans.length
                        ?

                        dayPlans.map(plan => `

                            <div class="study-session">

                                <strong>
                                    ${escapeHTML(plan.subject)}
                                </strong>

                                <div class="session-time">
                                    ${formatTime(plan.time)}
                                </div>

                                <div class="session-duration">
                                    ${plan.duration} minutes
                                </div>

                                <div class="session-actions">

                                    <span class="priority">
                                        ${plan.priority}
                                    </span>

                                    <button
                                        class="remove-session"
                                        onclick="
                                        event.stopPropagation();
                                        deleteStudyPlan(${plan.id})
                                        "
                                    >
                                        ✕
                                    </button>

                                </div>

                            </div>

                        `).join("")

                        :

                        `<div class="empty-plan">
                            No session
                         </div>`
                    }

                </div>

            `;

        }).join("");


    const totalMinutes =
        studyPlans.reduce(
            (sum,plan) =>
                sum + plan.duration,
            0
        );

    const highPriority =
        studyPlans.filter(
            plan =>
                plan.priority === "High"
        ).length;

    const subjects =
        new Set(
            studyPlans.map(
                plan =>
                    plan.subject.toLowerCase()
            )
        ).size;


    document.getElementById(
        "planSessionCount"
    ).textContent =
        studyPlans.length;


    document.getElementById(
        "planMinutes"
    ).textContent =
        totalMinutes >= 60

        ? `${Math.floor(totalMinutes / 60)}h ${totalMinutes % 60}m`

        : `${totalMinutes} min`;


    document.getElementById(
        "planHigh"
    ).textContent =
        highPriority;


    document.getElementById(
        "planSubjects"
    ).textContent =
        subjects;


    createCalendar();
}

function formatTime(time) {

    const [hours,minutes] =
        time.split(":");

    const date =
        new Date();

    date.setHours(
        Number(hours),
        Number(minutes)
    );

    return date.toLocaleTimeString(
        "en-US",
        {
            hour: "numeric",
            minute: "2-digit"
        }
    );
}


/* =========================================================
   CALENDAR
========================================================= */

function createCalendar() {

    const calendar =
        document.getElementById("calendar");

    if (!calendar) return;

    const now =
        new Date();

    const year =
        now.getFullYear();

    const month =
        now.getMonth();

    const firstDay =
        new Date(
            year,
            month,
            1
        ).getDay();

    const days =
        new Date(
            year,
            month + 1,
            0
        ).getDate();

    document.getElementById(
        "monthName"
    ).textContent =
        now.toLocaleDateString(
            "en-US",
            {
                month: "long",
                year: "numeric"
            }
        );

    let html = "";

    [
        "Sun",
        "Mon",
        "Tue",
        "Wed",
        "Thu",
        "Fri",
        "Sat"
    ].forEach(name => {

        html += `
            <div class="day-name">
                ${name}
            </div>
        `;

    });


    for (
        let i = 0;
        i < firstDay;
        i++
    ) {

        html += `<div></div>`;

    }


    for (
        let day = 1;
        day <= days;
        day++
    ) {

        const date =
            new Date(
                year,
                month,
                day
            );

        const isToday =
            date.toDateString() ===
            now.toDateString();

        const dayIndex =
            date.getDay();

        const sessionCount =
            studyPlans.filter(
                plan =>
                    plan.day === dayIndex
            ).length;

        html += `

            <div
                class="day ${isToday ? "today" : ""}"
                onclick="selectPlannerDay(${dayIndex})"
            >

                <div class="day-number">
                    ${day}
                </div>

                ${
                    isToday

                    ? `<div class="day-event">
                        Today
                       </div>`

                    : sessionCount

                    ? `<div class="day-event">
                        ${sessionCount}
                        session${sessionCount > 1 ? "s" : ""}
                       </div>`

                    : ""
                }

            </div>

        `;

    }

    calendar.innerHTML = html;
}

function selectPlannerDay(day) {

    document.getElementById(
        "planDay"
    ).value = String(day);

    document.getElementById(
        "planSubject"
    ).focus();

    const names =
        [
            "Sunday",
            "Monday",
            "Tuesday",
            "Wednesday",
            "Thursday",
            "Friday",
            "Saturday"
        ];

    showToast(
        `${names[day]} selected — add your study session 📚`
    );
}

renderStudyPlanner();


/* =========================================================
   PROGRESS
========================================================= */

function updateProgress() {

    const completed =
        tasks.filter(
            t => t.completed
        ).length;

    const total =
        tasks.length;

    const percentage =
        total === 0
        ? 0
        : Math.round(
            (completed / total) * 100
        );


    const mainProgress =
        document.getElementById(
            "mainProgress"
        );

    if (mainProgress) {

        mainProgress.style.width =
            percentage + "%";
    }


    const progressPercent =
        document.getElementById(
            "progressPercent"
        );

    if (progressPercent) {

        progressPercent.textContent =
            percentage + "%";
    }


    const progressPercent2 =
        document.getElementById(
            "progressPercent2"
        );

    if (progressPercent2) {

        progressPercent2.textContent =
            percentage + "%";
    }


    const goalText =
        document.getElementById(
            "goalText"
        );

    if (goalText) {

        goalText.textContent =
            `${completed} / ${total || 0} tasks`;
    }


    document.getElementById(
        "progressTasks"
    ).textContent =
        completed;


    document.getElementById(
        "progressTime"
    ).textContent =
        totalFocusMinutes + "m";


    document.getElementById(
        "progressNotes"
    ).textContent =
        notes.length;
}


function createWeeklyProgress() {

    const container =
        document.getElementById(
            "weeklyBars"
        );

    if (!container) return;

    const days =
        [
            "Monday",
            "Tuesday",
            "Wednesday",
            "Thursday",
            "Friday",
            "Saturday",
            "Sunday"
        ];

    const values =
        [60,80,45,90,70,35,55];

    container.innerHTML =
        days.map(
            (day,index) => `

                <div style="margin-bottom:15px;">

                    <div class="progress-label">

                        <span>
                            ${day}
                        </span>

                        <span>
                            ${values[index]}%
                        </span>

                    </div>

                    <div class="progress-bar">

                        <div
                            class="progress-fill"
                            style="width:${values[index]}%"
                        ></div>

                    </div>

                </div>

            `
        ).join("");
}

createWeeklyProgress();


/* =========================================================
   SETTINGS
========================================================= */

function toggleSetting(element) {

    element.classList.toggle("active");

    showToast(
        element.classList.contains("active")
        ? "Setting enabled"
        : "Setting disabled"
    );
}


function resetData() {

    const confirmReset =
        confirm(
            "Are you sure you want to delete all tasks, notes and progress?"
        );

    if (!confirmReset) return;

    localStorage.removeItem("studyTasks");

    localStorage.removeItem("studyNotes");

    localStorage.removeItem("focusMinutes");

    localStorage.removeItem("studyPlans");

    tasks = [];

    notes = [];

    totalFocusMinutes = 0;

    studyPlans = [];

    renderStudyPlanner();

    updateUI();

    showToast(
        "All data has been reset."
    );
}


/* =========================================================
   TOAST
========================================================= */

let toastTimeout;

function showToast(message) {

    const toast =
        document.getElementById("toast");

    if (!toast) return;

    toast.textContent =
        message;

    toast.classList.add("show");

    clearTimeout(toastTimeout);

    toastTimeout =
        setTimeout(
            () => {

                toast.classList.remove("show");

            },
            2500
        );
}


/* =========================================================
   AI
========================================================= */

async function askAI() {

    const input =
        document.getElementById(
            "aiQuestion"
        );

    const box =
        document.getElementById(
            "aiResponse"
        );

    const question =
        input.value.trim();

    if (!question) {

        box.innerHTML =
            "⚠️ Enter something first";

        return;
    }

    box.innerHTML =
        "🤖 Thinking...";

    try {

        const response =
            await fetch(
                "http://localhost:3000/api/ai",
                {
                    method: "POST",

                    headers: {
                        "Content-Type":
                            "application/json"
                    },

                    body:
                        JSON.stringify({
                            question:
                                question
                        })
                }
            );

        const data =
            await response.json();

        box.innerHTML =
            escapeHTML(
                data.answer ||
                data.message ||
                "No response received."
            );

    } catch (error) {

        box.innerHTML =
            "⚠️ Unable to connect to AI server.";

        console.error(error);
    }
}


/* =========================================================
   SECURITY
========================================================= */

function escapeHTML(text) {

    return String(text)
        .replaceAll(
            "&",
            "&amp;"
        )
        .replaceAll(
            "<",
            "&lt;"
        )
        .replaceAll(
            ">",
            "&gt;"
        )
        .replaceAll(
            '"',
            "&quot;"
        )
        .replaceAll(
            "'",
            "&#039;"
        );
}


/* =========================================================
   LOGIN
========================================================= */

function loginUser(event) {

    event.preventDefault();

    const email =
        document.getElementById(
            "loginEmail"
        ).value.trim();

    const password =
        document.getElementById(
            "loginPassword"
        ).value;

    const error =
        document.getElementById(
            "loginError"
        );


    if (
        !email ||
        password.length < 4
    ) {

        error.textContent =
            "Please enter a valid email and a password of at least 4 characters.";

        return;
    }


    const userName =
        email
            .split("@")[0]
            .replace(
                /[._-]/g,
                " "
            )
            .replace(
                /\b\w/g,
                char =>
                    char.toUpperCase()
            );


    localStorage.setItem(
        "studyBuddyLoggedIn",
        "true"
    );

    localStorage.setItem(
        "studyBuddyUser",
        userName
    );


    error.textContent = "";

    applyLoggedInUser(
        userName
    );

    showToast(
        "Welcome to StudyBuddy 🚀"
    );
}


function applyLoggedInUser(
    userName
) {

    const loginScreen =
        document.getElementById(
            "loginScreen"
        );

    loginScreen.classList.add(
        "hidden"
    );


    const sidebarUser =
        document.getElementById(
            "sidebarUser"
        );

    const welcomeUser =
        document.querySelector(
            ".welcome h1 span"
        );


    if (sidebarUser) {

        sidebarUser.textContent =
            userName;
    }


    if (welcomeUser) {

        welcomeUser.textContent =
            `${userName} 👋`;
    }
}


function logoutUser() {

    localStorage.removeItem(
        "studyBuddyLoggedIn"
    );

    localStorage.removeItem(
        "studyBuddyUser"
    );


    document
        .getElementById(
            "loginScreen"
        )
        .classList.remove(
            "hidden"
        );


    document.getElementById(
        "loginPassword"
    ).value = "";


    document.getElementById(
        "loginError"
    ).textContent = "";
}


function checkLogin() {

    const loggedIn =
        localStorage.getItem(
            "studyBuddyLoggedIn"
        ) === "true";


    const userName =
        localStorage.getItem(
            "studyBuddyUser"
        ) || "Student";


    if (loggedIn) {

        applyLoggedInUser(
            userName
        );
    }
}

checkLogin();


/* =========================================================
   UPDATE EVERYTHING
========================================================= */

function updateUI() {

    renderTasks();

    renderNotes();

    updateProgress();


    document.getElementById(
        "dashTasks"
    ).textContent =
        tasks.filter(
            t => t.completed
        ).length;


    document.getElementById(
        "dashNotes"
    ).textContent =
        notes.length;


    document.getElementById(
        "dashHours"
    ).textContent =
        Math.floor(
            totalFocusMinutes / 60
        ) + "h";
}


/* =========================================================
   INITIAL LOAD
========================================================= */

updateUI();