document.querySelectorAll("nav li > a").forEach((link) => {
  let parentLi = link.parentElement;

  if (parentLi.querySelector(".submenu")) {
    link.addEventListener("click", function (e) {
      e.preventDefault();

      document.querySelectorAll("nav li").forEach((li) => {
        if (li !== parentLi) li.classList.remove("open");
      });

      parentLi.classList.toggle("open");
    });
  }
});

document.addEventListener("click", function (e) {
  if (!e.target.closest("nav")) {
    document.querySelectorAll("nav li").forEach((li) => {
      li.classList.remove("open");
    });
  }
});
