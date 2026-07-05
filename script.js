document.addEventListener("DOMContentLoaded", () => {
    const menuButtons = document.querySelectorAll(".nav-btn");
    const tabs = document.querySelectorAll(".tab-content");

    // Gestion de la navigation par onglets
    menuButtons.forEach(button => {
        button.addEventListener("click", () => {
            const targetTabId = button.getAttribute("data-tab");
            menuButtons.forEach(btn => btn.classList.remove("active"));
            button.classList.add("active");
            tabs.forEach(tab => tab.classList.remove("active"));
            document.getElementById(targetTabId).classList.add("active");
        });
    });

    // Charger l'annonce si elle existe
    if(localStorage.getItem("announcement")) {
        document.getElementById("live-announcement").innerText = localStorage.getItem("announcement");
    }
    
    renderCalendar();

    // Login Admin
    const passwordInput = document.getElementById("admin-password");
    const loginBtn = document.getElementById("btn-login");
    const authBox = document.getElementById("admin-auth");
    const dashboardBox = document.getElementById("admin-dashboard");
    const ADMIN_PASSWORD = "siellis2026"; 

    loginBtn.addEventListener("click", () => {
        if(passwordInput.value === ADMIN_PASSWORD) {
            authBox.classList.add("hidden");
            dashboardBox.classList.remove("hidden");
            document.getElementById("input-announcement").value = document.getElementById("live-announcement").innerText;
        } else {
            alert("❌ Mot de passe incorrect !");
        }
    });

    // Enregistrer annonce
    document.getElementById("btn-save-announcement").addEventListener("click", () => {
        const newText = document.getElementById("input-announcement").value;
        if(newText.trim() !== "") {
            localStorage.setItem("announcement", newText);
            document.getElementById("live-announcement").innerText = newText;
            alert("📢 Annonce mise à jour !");
        }
    });

    // Ajouter événement calendrier
    document.getElementById("btn-add-event").addEventListener("click", () => {
        const day = document.getElementById("event-day").value;
        const title = document.getElementById("event-title").value;
        const link = document.getElementById("event-link").value || "https://matcherino.com";

        if(!day || !title) {
            alert("⚠️ Remplissez le jour et le titre.");
            return;
        }

        let calendarData = JSON.parse(localStorage.getItem("events")) || {};
        calendarData[day] = { title: title, link: link };
        localStorage.setItem("events", JSON.stringify(calendarData));

        renderCalendar();
        alert(`🏆 Tournoi planifié le ${day} !`);
        
        document.getElementById("event-day").value = "";
        document.getElementById("event-title").value = "";
        document.getElementById("event-link").value = "";
    });

    // Vider le calendrier
    document.getElementById("btn-clear-calendar").addEventListener("click", () => {
        if(confirm("Supprimer tous les tournois ?")) {
            localStorage.removeItem("events");
            renderCalendar();
        }
    });
});

function renderCalendar() {
    const grid = document.getElementById("calendar-grid");
    if(!grid) return;
    grid.innerHTML = "";
    const savedEvents = JSON.parse(localStorage.getItem("events")) || {};

    for (let i = 1; i <= 31; i++) {
        const dayBox = document.createElement("div");
        dayBox.classList.add("calendar-day");
        dayBox.innerHTML = `<span class="day-number">${i}</span>`;
        
        if(savedEvents[i]) {
            dayBox.classList.add("has-event");
            const badge = document.createElement("a");
            badge.href = savedEvents[i].link;
            badge.target = "_blank";
            badge.classList.add("matcherino-badge");
            badge.innerText = `🎫 ${savedEvents[i].title}`;
            dayBox.appendChild(badge);
        }
        grid.appendChild(dayBox);
    }
}

// Commutateur rapide pour les boutons internes
function switchTab(tabId) {
    const targetButton = document.querySelector(`[data-tab="${tabId}"]`);
    if(targetButton) targetButton.click();
}