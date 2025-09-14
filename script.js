// Generate Calendar
function generateCalendar() {
    const calendar = document.getElementById("calendar");
    const today = new Date();
    const year = today.getFullYear();
    const month = today.getMonth();
    const daysInMonth = new Date(year, month + 1, 0).getDate();

    calendar.innerHTML = "";

    // Create Day Elements
    for (let day = 1; day <= daysInMonth; day ++) {
        const dateString = `${month + 1}/${day}/${year}`;
        const dayEl = document.createElement("div");
        dayEl.className = "day";
        dayEl.textContent = day; 

        // Highlight Today
        if (day === today.getDate()) {
        dayEl.style.backgroundColor = "#6494dcff";
        dayEl.style.fontWeight = "bold";
        }

        // Create Dot Indicator for Days with Workouts
        const workoutData = localStorage.getItem(dateString);
        if (workoutData) {
        const dot = document.createElement("div");
        dot.className = "workout-dot";
        dayEl.appendChild(dot);
        }

        // Click on Day to View or Create Workout
        dayEl.onclick = () => {
            const data = localStorage.getItem(dateString);
            if (data) {
                const workout = JSON.parse(data);

                // Start with the workout name (show only if present)
                let workoutText = "";
                if (workout.name && workout.name.trim() !== "") {
                workoutText += `<strong>${workout.name}</strong><br><br>`;
                }

                // Add notes if present and not just empty spaces
                if (workout.notes && workout.notes.trim() !== "") {
                workoutText += `Notes: ${workout.notes}<br>`;
                }

                // Add exercises if they exist and have items
                if (workout.exercises && workout.exercises.length > 0) {
                workoutText += `Exercises:<br>- ${workout.exercises.join("<br>- ")}<br><br>`;
                }

                // If workoutText is still empty (no fields filled), show a fallback message or nothing
                if (workoutText.trim() === "") {
                workoutText = "No details provided for this workout.";
                }
                
                showModal(`Workout for ${dateString}:<br><br>${workoutText}`, false, dateString);
            } else {
                showModal(`No workout for ${dateString}`, true, dateString);
            }
        };
        // Add Day to Calendar
        calendar.appendChild(dayEl);
    }
}

// Show Modal for Viewing or Creating Workouts
function showModal(message, showCreate, dateString) {
    const modal = document.getElementById("noWorkoutModal");
    const msg = document.getElementById("modalMessage");
    const closeBtn = document.getElementById("closeModal");
    const createBtn = document.getElementById("modalCreateBtn");
    const deleteIcon = document.getElementById("deleteWorkoutIcon");

    msg.innerHTML = message;
    modal.classList.remove("hidden");
    closeBtn.onclick = () => modal.classList.add("hidden");

    // If No Workout Exists, Show Create Button
    if (showCreate) {
        createBtn.style.display = "inline-block";
        deleteIcon.classList.add("hidden");
        deleteIcon.onclick = null; 
        
        createBtn.onclick = () => {
            modal.classList.add("hidden");
            // Optionally, pass the date to the create page
            window.location.href = `createWorkout.html?date=${encodeURIComponent(dateString)}`;
        };
    } else {
        // If Workout Exists, Hide Create Button and Show Delete Icon
        createBtn.style.display = "none";
        deleteIcon.classList.remove("hidden");

        // Delete Workout
        deleteIcon.onclick = () => {
            if (confirm("Are you sure you want to delete this workout?")) {
                localStorage.removeItem(dateString);
                modal.classList.add("hidden");
                generateCalendar(); // refresh calendar
            }
        };
    }
}

// DOM loaded content
window.addEventListener("DOMContentLoaded", () => {
    // Generate Calendar
    generateCalendar();

    // Theme toggle logic
    const themeSwitch = document.getElementById("themeSwitch");
    const body = document.body;

    // Load saved theme
    const savedTheme = localStorage.getItem("theme");
    if (savedTheme === "light") {
    body.classList.add("light-mode");
    themeSwitch.checked = true;
    }

    // Toggle Theme on Switch Change
    themeSwitch.addEventListener("change", () => {
    if (themeSwitch.checked) {
        body.classList.add("light-mode");
        localStorage.setItem("theme", "light");
    } else {
        body.classList.remove("light-mode");
        localStorage.setItem("theme", "dark");
    }
    });
});
