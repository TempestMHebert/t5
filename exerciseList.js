// DOM loaded content
document.addEventListener("DOMContentLoaded", () => {

    // Apply saved theme
    const savedTheme = localStorage.getItem("theme");
    if (savedTheme === "light") {
        document.body.classList.add("light-mode");
    }
});