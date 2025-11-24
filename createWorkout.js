// DOM loaded content
document.addEventListener("DOMContentLoaded", () => { 
  // Apply saved theme
  const savedTheme = localStorage.getItem("theme");
  if (savedTheme === "light") {
    document.body.classList.add("light-mode");
  }

  const urlParams = new URLSearchParams(window.location.search);
  const passedDate = urlParams.get("date");
  const workoutDateInput = document.getElementById("workoutDate");

  // Set Date Input if Passed Through Calendar
  if (passedDate) {
    const [month, day, year] = passedDate.split("/");
    const formattedDate = `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`;
    workoutDateInput.value = formattedDate;
  }

  // Form submit listener
  document.getElementById("createWorkoutForm").addEventListener("submit", handleFormSubmit);

  // --- Exercise Selector Logic ---
  const addExerciseBtn = document.getElementById("addExerciseBtn");
  const exerciseSelector = document.getElementById("exerciseSelector");
  const availableExercises = document.getElementById("availableExercises");
  const searchWorkoutExerciseInput = document.getElementById("searchWorkoutExerciseInput");
  const workoutExerciseList = document.getElementById("workoutExerciseList");

  // Get saved exercises from localStorage
  function getExercises() {
    return JSON.parse(localStorage.getItem("exercises")) || [];
  }

  // Render available exercises with optional filter
  function renderAvailableExercises(filter = "") {
    availableExercises.innerHTML = "";
    getExercises()
      .filter(ex => ex.toLowerCase().includes(filter.toLowerCase()))
      .forEach(ex => {
        const li = document.createElement("li");
        li.textContent = ex;
        li.style.cursor = "pointer";

        li.addEventListener("click", () => {
          const workoutLi = document.createElement("li");
          workoutLi.textContent = ex;

          const hiddenInput = document.createElement("input");
          hiddenInput.type = "hidden";
          hiddenInput.name = "exercise";
          hiddenInput.value = ex;
          workoutLi.appendChild(hiddenInput);

          workoutExerciseList.appendChild(workoutLi);

          // Hide selector after adding
          exerciseSelector.style.display = "none";
          searchWorkoutExerciseInput.value = "";
        });


        availableExercises.appendChild(li);
      });
  }

  // Show selector when Add Exercise button is clicked
  addExerciseBtn.addEventListener("click", () => {
    exerciseSelector.style.display = "block";
    renderAvailableExercises();
    searchWorkoutExerciseInput.focus();
  });

  // Search functionality
  searchWorkoutExerciseInput.addEventListener("input", e => {
    renderAvailableExercises(e.target.value);
  });

  // --- Blur / Outside Click Behavior ---
  document.addEventListener("click", e => {
    const isClickInsideSelector =
      exerciseSelector.contains(e.target) || addExerciseBtn.contains(e.target);

    if (!isClickInsideSelector && exerciseSelector.style.display === "block") {
      exerciseSelector.style.display = "none";
      searchWorkoutExerciseInput.value = "";
    }
  });

  searchWorkoutExerciseInput.addEventListener("blur", () => {
    // Only hide if focus didn’t move to an exercise item
    if (!availableExercises.contains(e.relatedTarget)) {
      exerciseSelector.style.display = "none";
      searchWorkoutExerciseInput.value = "";
    }
});

// --- Global Helpers (outside DOMContentLoaded) ---

// Save Unique Exercises to Local Storage
function saveExercisesToLocal(exercises) {
  const key = "allExercises";
  const existing = JSON.parse(localStorage.getItem(key)) || [];
  const combined = Array.from(new Set([...existing, ...exercises]));
  localStorage.setItem(key, JSON.stringify(combined));
}

// Form Submission
function handleFormSubmit(e) {
  e.preventDefault();

  const name = document.getElementById("workoutName").value.trim();
  const dateVal = document.getElementById("workoutDate").value;
  const notes = document.getElementById("notes").value.trim();

  const [year, month, day] = dateVal.split('-').map(Number);
  const dateObj = new Date(year, month - 1, day);
  const formattedDate = `${dateObj.getMonth() + 1}/${dateObj.getDate()}/${dateObj.getFullYear()}`;

  const exercises = Array.from(document.getElementsByName("exercise"))
    .map(input => input.value.trim())
    .filter(value => value !== "");
  saveExercisesToLocal(exercises); 

  const workout = {
    name,
    notes,
    exercises,
    date: formattedDate
  };

  localStorage.setItem(formattedDate, JSON.stringify(workout));
  window.location.href = "index.html";
}

// Backup localStorage to JSON File
function backupLocalStorage() {
  const data = {};

  for (let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i);
    data[key] = localStorage.getItem(key);
  }

  const json = JSON.stringify(data, null, 2);
  const blob = new Blob([json], { type: "application/json" });
  const url = URL.createObjectURL(blob);

  const a = document.createElement("a");
  a.href = url;
  a.download = "workout-backup.json";
  a.click();

  URL.revokeObjectURL(url);
}

// Restore localStorage From Uploaded JSON File
function restoreLocalStorageFromFile(file) {
  const reader = new FileReader();
  reader.onload = function(e) {
    try {
      const data = JSON.parse(e.target.result);
      for (const key in data) {
        localStorage.setItem(key, data[key]);
      }
      alert("Workouts restored successfully! Reload the page to see changes.");
    } catch {
      alert("Invalid backup file.");
    }
  };
  reader.readAsText(file);
}

document.getElementById("backupBtn").addEventListener("click", backupLocalStorage);

document.getElementById("restoreInput").addEventListener("change", function(e) {
  if (e.target.files.length > 0) {
    restoreLocalStorageFromFile(e.target.files[0]);
    e.target.value = ""; // Clear file input after upload
  }
});

});
