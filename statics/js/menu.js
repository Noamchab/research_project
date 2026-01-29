// Gestion du clic pour ouvrir/fermer
document.querySelectorAll("nav li > a").forEach((link) => {
  let parentLi = link.parentElement;

  // Seulement si un sous-menu existe
  if (parentLi.querySelector(".submenu")) {
    link.addEventListener("click", function (e) {
      e.preventDefault();

      // Fermer tous les autres
      document.querySelectorAll("nav li").forEach((li) => {
        if (li !== parentLi) li.classList.remove("open");
      });

      // Basculer le menu cliqué
      parentLi.classList.toggle("open");
    });
  }
});

// Fermer les menus si on clique ailleurs
document.addEventListener("click", function (e) {
  // Si le clic n'est pas dans le nav, on ferme tout
  if (!e.target.closest("nav")) {
    document.querySelectorAll("nav li").forEach((li) => {
      li.classList.remove("open");
    });
  }
});
