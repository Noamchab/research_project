const logo = document.querySelector(".logo-gif");
if (logo) {
  let playing = false;

  logo.parentElement.addEventListener("mouseenter", () => {
    if (!playing) {
      logo.src = logo.dataset.anim;
      playing = true;
      setTimeout(() => {
        logo.src = "livre_fixed.png";
        playing = false;
      }, 2000);
    }
  });
}

document.querySelectorAll("nav li > a").forEach((link) => {
  const parentLi = link.parentElement;
  const submenu = parentLi.querySelector(".submenu");

  if (submenu) {
    link.addEventListener("click", (e) => {
      if (link.getAttribute("href") === "#") {
        e.preventDefault();
      }

      document.querySelectorAll("nav li").forEach((li) => {
        if (li !== parentLi) li.classList.remove("open");
      });

      parentLi.classList.toggle("open");
    });
  }
});

document.addEventListener("click", (e) => {
  if (!e.target.closest("nav")) {
    document
      .querySelectorAll("nav li")
      .forEach((li) => li.classList.remove("open"));
  }
});

document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
  anchor.addEventListener("click", (e) => {
    const target = document.querySelector(anchor.getAttribute("href"));
    if (target) {
      e.preventDefault();
      target.scrollIntoView({ behavior: "smooth" });
    }
  });
});

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
