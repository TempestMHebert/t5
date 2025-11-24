document.addEventListener("DOMContentLoaded", () => {
    // Apply saved theme
    const savedTheme = localStorage.getItem("theme");
    if (savedTheme === "light") {
        document.body.classList.add("light-mode");
    }

    // DOM elements
    const exerciseList = document.getElementById("exerciseList");
    const addExerciseButton = document.getElementById("addExerciseButton");
    const newExerciseContainer = document.getElementById("newExerciseContainer");
    const newExerciseInput = document.getElementById("newExerciseInput");
    const saveExerciseButton = document.getElementById("saveExerciseButton");
    const searchExerciseInput = document.getElementById("searchExerciseInput");
    const searchIcon = document.getElementById("searchIcon");

    // Helpers for localStorage
    function getExercises() {
        return JSON.parse(localStorage.getItem("exercises")) || [];
    }

    function saveExercises(exercises) {
        // Sort alphabetically before saving
        exercises.sort((a, b) => a.localeCompare(b));
        localStorage.setItem("exercises", JSON.stringify(exercises));
    }

    // Render list with optional filter
    function renderExerciseList(filter = "") {
        exerciseList.innerHTML = "";
        getExercises()
            .filter(ex => ex.toLowerCase().includes(filter.toLowerCase()))
            .forEach(ex => {
                const li = document.createElement("li");
                li.textContent = ex;
                exerciseList.appendChild(li);
            });
    }

    // Show input when Add button is clicked
    addExerciseButton.addEventListener("click", () => {
        newExerciseContainer.style.display = "block";
        newExerciseInput.focus();
    });

    // Save exercise when Save button is clicked
    saveExerciseButton.addEventListener("click", () => {
        addExercise();
    });

    // Save exercise when Enter is pressed
    newExerciseInput.addEventListener("keypress", e => {
        if (e.key === "Enter") {
            addExercise();
        }
    });

    function addExercise() {
        const newExercise = newExerciseInput.value.trim();
        if (newExercise) {
            const exercises = getExercises();
            exercises.push(newExercise);
            saveExercises(exercises);
            renderExerciseList();
            newExerciseInput.value = "";
            newExerciseContainer.style.display = "none"; // hide input again
        }
    }

    // Toggle search bar visibility
    searchIcon.addEventListener("click", () => {
        if (searchExerciseInput.style.display === "none") {
            searchExerciseInput.style.display = "block";
            searchExerciseInput.focus();
        } else {
            searchExerciseInput.style.display = "none";
            searchExerciseInput.value = "";
            renderExerciseList(); // reset list when search closes
        }
    });

    // Search functionality
    searchExerciseInput.addEventListener("input", e => {
        renderExerciseList(e.target.value);
    });

    // Hide search bar when clicking outside of it
    document.addEventListener("click", e => {
        const isClickInsideSearch = 
            searchExerciseInput.contains(e.target) || searchIcon.contains(e.target);

        if (!isClickInsideSearch && searchExerciseInput.style.display === "block") {
            searchExerciseInput.style.display = "none";
            searchExerciseInput.value = "";
            renderExerciseList(); // reset list when search closes
        }

        // Hide add exercise input when clicking outside
        const isClickInsideAdd =
        newExerciseContainer.contains(e.target) || addExerciseButton.contains(e.target);

        if (!isClickInsideAdd && newExerciseContainer.style.display === "block") {
            newExerciseContainer.style.display = "none";
        }
    });


    // Hide search bar when it loses focus
    searchExerciseInput.addEventListener("blur", () => {
        searchExerciseInput.style.display = "none";
        searchExerciseInput.value = "";
        renderExerciseList(); // reset list when search closes
    });

    // Hide add exercise input when it loses focus (but allow Save button)
    newExerciseInput.addEventListener("blur", e => {
        if (e.relatedTarget !== saveExerciseButton) {
            newExerciseContainer.style.display = "none";
            newExerciseInput.value = "";

            // Reset the button background (if you’re toggling classes)
            addExerciseButton.classList.remove("inactive");
            addExerciseButton.classList.add("default");
        }
    });

    // Initial render
    renderExerciseList();
});
