document.addEventListener("DOMContentLoaded", () => { 
  // Apply saved theme
  const savedTheme = localStorage.getItem("theme");
  if (savedTheme === "light") {
    document.body.classList.add("light-mode");
  }
  const urlParams = new URLSearchParams(window.location.search);
  const passedDate = urlParams.get("date");
  const workoutDateInput = document.getElementById("workoutDate");

  // Set date if passed from calendar
  if (passedDate) {
    const [month, day, year] = passedDate.split("/");
    const formattedDate = `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`;

    workoutDateInput.value = formattedDate;
  }

  addExerciseField();

  document.getElementById("addExerciseBtn").addEventListener("click", addExerciseField);
  document.getElementById("createWorkoutForm").addEventListener("submit", handleFormSubmit);
});

// Outside of DOM loaded content
function addExerciseField() {
  const container = document.getElementById("exercisesContainer");

  const exerciseGroup = document.createElement("div");
  exerciseGroup.className = "exerciseGroup";
  exerciseGroup.style.position = "relative"; // needed for suggestion positioning

  const newExerciseInput = document.createElement("input");
  newExerciseInput.type = "text";
  newExerciseInput.name = "exercise";
  newExerciseInput.placeholder = "Exercise name";

  const suggestions = document.createElement("div");
  suggestions.className = "suggestions";
  suggestions.style.display = "none";

  // Event listener to filter suggestions
  newExerciseInput.addEventListener("input", () => {
    const query = newExerciseInput.value.toLowerCase();
    const allExercises = JSON.parse(localStorage.getItem("allExercises")) || [];

    const matches = allExercises.filter(ex =>
      ex.toLowerCase().includes(query)
    );

    suggestions.innerHTML = "";

    if (matches.length && query) {
      matches.forEach(match => {
        const option = document.createElement("div");
        option.className = "suggestion-item";
        option.textContent = match;

        option.onclick = () => {
          newExerciseInput.value = match;
          suggestions.style.display = "none";
        };

        suggestions.appendChild(option);
      });

      suggestions.style.display = "block";
    } else {
      suggestions.style.display = "none";
    }
  });

  newExerciseInput.addEventListener("blur", () => {
    setTimeout(() => {
      suggestions.style.display = "none";
    }, 100);
  });

  exerciseGroup.appendChild(newExerciseInput);
  exerciseGroup.appendChild(suggestions);
  container.appendChild(exerciseGroup);
}


function saveExercisesToLocal(exercises) {
  const key = "allExercises";
  const existing = JSON.parse(localStorage.getItem(key)) || [];
  const combined = Array.from(new Set([...existing, ...exercises]));
  localStorage.setItem(key, JSON.stringify(combined));
}


function handleFormSubmit(e) {
  e.preventDefault();

  const name = document.getElementById("workoutName").value.trim();
  const dateVal = document.getElementById("workoutDate").value;
  const notes = document.getElementById("notes").value.trim();

  const dateObj = new Date(dateVal);
  const formattedDate = `${dateObj.getMonth() + 1}/${dateObj.getDate()}/${dateObj.getFullYear()}`;

  const exercises = Array.from(document.getElementsByName("exercise")).map(input => input.value.trim()).filter(value => value !== "");
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