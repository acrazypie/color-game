document.addEventListener("DOMContentLoaded", async () => {
    let sysLang = navigator.language.split("-")[0];

    let savedLang = localStorage.getItem("lang");

    const response = await fetch("/lang.json");
    const translations = await response.json();

    const updateTexts = (lang) => {
        document.querySelectorAll("[data-i18n]").forEach((el) => {
            const key = el.dataset.i18n;
            if (translations[lang] && translations[lang][key]) {
                el.textContent = translations[lang][key];
            }
        });
    };

    updateTexts(sysLang);

    /*
    if (langBtn) {
        langBtn.addEventListener("click", () => {
            savedLang = savedLang === "it" ? "en" : "it";
            localStorage.setItem("lang", savedLang);
            updateTexts(savedLang);
        });
    }
    */
});
