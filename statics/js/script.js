const logo = document.querySelector(".logo-gif");
if (logo) {
  let playing = false;

  logo.parentElement.addEventListener("mouseenter", () => {
    if (!playing) {
      logo.src = logo.dataset.anim; // lance le gif
      playing = true;
      setTimeout(() => {
        logo.src = "../statics/images/livre_fixed.png";
        playing = false;
      }, 2000);
    }
  });
}

// 📂 Gestion des sous-menus
document.querySelectorAll("nav li > a").forEach((link) => {
  const parentLi = link.parentElement;
  const submenu = parentLi.querySelector(".submenu");

  if (submenu) {
    link.addEventListener("click", (e) => {
      // ✅ On empêche le clic SEULEMENT si c'est un lien parent (avec sous-menu)
      // ET qu'il ne mène pas à une vraie page
      if (link.getAttribute("href") === "#") {
        e.preventDefault();
      }

      // Ferme tous les autres menus
      document.querySelectorAll("nav li").forEach((li) => {
        if (li !== parentLi) li.classList.remove("open");
      });

      // Ouvre ou ferme le menu actuel
      parentLi.classList.toggle("open");
    });
  }
});

// 🔒 Ferme les menus si on clique ailleurs
document.addEventListener("click", (e) => {
  if (!e.target.closest("nav")) {
    document
      .querySelectorAll("nav li")
      .forEach((li) => li.classList.remove("open"));
  }
});

// 🧭 Défilement fluide vers les ancres internes (#)
document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
  anchor.addEventListener("click", (e) => {
    const target = document.querySelector(anchor.getAttribute("href"));
    if (target) {
      e.preventDefault();
      target.scrollIntoView({ behavior: "smooth" });
    }
  });
});

// ✨ Apparition progressive au scroll
const observer = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      entry.target.classList.add("visible");
    }
  });
});

document
  .querySelectorAll("section, article, figure")
  .forEach((el) => observer.observe(el));
