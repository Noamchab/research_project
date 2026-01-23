d3.json("../statics/json/cannes.json").then((df) => {
  // ================================================
  // ===============  PARTIE COMMUNE  ===============
  // ================================================

  // Description de la page
  function setDescription(text) {
    const el = document.getElementById("description");
    if (el) el.innerHTML = text;
  }

  setDescription(`
      These charts are interactive. Hover over a bar to display a randomly selected film from the corresponding category, along with its box-office revenue, audience and critics’ ratings, and genre information <br> <br>
  `);

  function displayValue(v) {
    return v === null || v === undefined || v === "" || Number.isNaN(v)
      ? "Not available this year"
      : v;
  }

  // Films communs à tous les graphiques
  const films = df.map((d) => ({
    Comedy: d.Comedy,
    title: d.film_title,
    director: d.directors,
    genres: d.genres,
    country: d.countries,
    palme: d.palme_dor,
    jury_prize: d.jury_prize,
    grand_prix: d.grand_prix,
    year: d.year,
  }));

  // Dimensions communes
  const width = 800;
  const height = 500;
  const margin = { top: 50, right: 40, bottom: 60, left: 70 };

  // ================================================
  // ===============  GRAPHIQUE 1  ==================
  // ================================================

  // ==============================
  // Palme d'Or (Palme d'Or/Official Selection)
  // ==============================

  const svg1 = d3
    .select("#chart1")
    .append("svg")
    .attr("width", width)
    .attr("height", height);

  // 1) Catégories
  const categories1 = ["Official Selection", "Palme d'Or"];

  // 2) Comptage par catégorie
  const counts1 = d3.rollup(
    films,
    (v) => v.length,
    (f) => f.palme,
  );

  // 3) Données pour D3
  const data1 = categories1.map((c) => ({
    category: c,
    count: counts1.get(c) ?? 0,
  }));

  // 4) Échelles
  const x1 = d3
    .scaleBand()
    .domain(categories1)
    .range([margin.left, width - margin.right])
    .padding(0.35);

  const y1 = d3
    .scaleLinear()
    .domain([0, d3.max(data1, (d) => d.count)])
    .nice()
    .range([height - margin.bottom, margin.top]);

  // 5) Film fixe par catégorie (hover stable)
  const chosenFilm1 = {};
  categories1.forEach((c) => {
    const list = films.filter((f) => f.palme === c);
    chosenFilm1[c] =
      list.length > 0 ? list[Math.floor(Math.random() * list.length)] : null;
  });

  // 6) Barres
  svg1
    .selectAll("rect")
    .data(data1)
    .enter()
    .append("rect")
    .attr("x", (d) => x1(d.category))
    .attr("y", (d) => y1(d.count))
    .attr("width", x1.bandwidth())
    .attr("height", (d) => y1(0) - y1(d.count))
    .attr("fill", "#7392EB")
    .on("mouseover", function (event, d) {
      d3.select(this).attr("fill", "#BDCDFF");

      const f = chosenFilm1[d.category];
      if (f) {
        document.getElementById("info1").innerHTML = `
        <div class="info-content">
          <div class="info-text">
            <h2>${f.title}</h2>
            <strong>Palme d'Or status:</strong> ${d.category}<br>
            Director: ${f.director}<br>
            Genres: ${f.genres}<br>
            Year: ${f.year}<br>
            Country: ${f.country}
          </div>
        </div>
      `;
      }
    })
    .on("mouseout", function () {
      d3.select(this).attr("fill", "#7392EB");
    });

  // 7) Axes
  svg1
    .append("g")
    .attr("transform", `translate(0,${height - margin.bottom})`)
    .call(d3.axisBottom(x1))
    .selectAll("text")
    .style("font-size", "20px");

  svg1
    .append("g")
    .attr("transform", `translate(${margin.left},0)`)
    .call(d3.axisLeft(y1).ticks(6).tickFormat(d3.format("d")))
    .selectAll("text")
    .style("font-size", "20px");

  // 8) Titres et labels
  svg1
    .append("text")
    .attr("x", width / 2)
    .attr("y", height - 15)
    .attr("text-anchor", "middle")
    .style("font-size", "18px")
    .text("Palme d'Or status");

  svg1
    .append("text")
    .attr("transform", "rotate(-90)")
    .attr("x", -height / 2)
    .attr("y", 20)
    .attr("text-anchor", "middle")
    .style("font-size", "18px")
    .text("Number of films");

  svg1
    .append("text")
    .attr("x", width / 2)
    .attr("y", margin.top / 2)
    .attr("text-anchor", "middle")
    .style("font-size", "28px")
    .text("Palme d'Or: Winners vs Official Selection");

  // ================================================
  // ===============  GRAPHIQUE 2  ==================
  // ================================================

  // ==============================
  // Best Picture (Winner/Nominated)
  // ==============================

  const svg2 = d3
    .select("#chart2")
    .append("svg")
    .attr("width", width)
    .attr("height", height);

  // 1) Catégories
  const categories2 = ["Official Selection", "Grand Prix"];

  // 2) Comptage par catégorie
  const counts2 = d3.rollup(
    films,
    (v) => v.length,
    (f) => f.grand_prix,
  );

  // 3) Données pour D3
  const data2 = categories2.map((c) => ({
    category: c,
    count: counts2.get(c) ?? 0,
  }));

  // 4) Échelles
  const x2 = d3
    .scaleBand()
    .domain(categories2)
    .range([margin.left, width - margin.right])
    .padding(0.35);

  const y2 = d3
    .scaleLinear()
    .domain([0, d3.max(data2, (d) => d.count)])
    .nice()
    .range([height - margin.bottom, margin.top]);

  // 5) Film fixe par catégorie (hover stable)
  const chosenFilm2 = {};
  categories2.forEach((c) => {
    const list = films.filter((f) => f.grand_prix === c);
    chosenFilm2[c] =
      list.length > 0 ? list[Math.floor(Math.random() * list.length)] : null;
  });

  // 6) Barres
  svg2
    .selectAll("rect")
    .data(data2)
    .enter()
    .append("rect")
    .attr("x", (d) => x2(d.category))
    .attr("y", (d) => y2(d.count))
    .attr("width", x2.bandwidth())
    .attr("height", (d) => y2(0) - y2(d.count))
    .attr("fill", "#FFE000")
    .on("mouseover", function (event, d) {
      d3.select(this).attr("fill", "#FFF978");

      const f = chosenFilm2[d.category];
      if (f) {
        document.getElementById("info2").innerHTML = `
        <div class="info-content">
          <div class="info-text">
            <h2>${f.title}</h2>
            <strong>Grand Prix status:</strong> ${d.category}<br>
            Director: ${f.director}<br>
            Genres: ${f.genres}<br>
            Year: ${f.year}<br>
            Country: ${f.country}
          </div>
        </div>
      `;
      }
    })
    .on("mouseout", function () {
      d3.select(this).attr("fill", "#FFE000");
    });

  // 7) Axes
  svg2
    .append("g")
    .attr("transform", `translate(0,${height - margin.bottom})`)
    .call(d3.axisBottom(x2))
    .selectAll("text")
    .style("font-size", "20px");

  svg2
    .append("g")
    .attr("transform", `translate(${margin.left},0)`)
    .call(d3.axisLeft(y2).ticks(6).tickFormat(d3.format("d")))
    .selectAll("text")
    .style("font-size", "20px");

  // 8) Titres et labels
  svg2
    .append("text")
    .attr("x", width / 2)
    .attr("y", height - 15)
    .attr("text-anchor", "middle")
    .style("font-size", "18px")
    .text("Grand Prix status");

  svg2
    .append("text")
    .attr("transform", "rotate(-90)")
    .attr("x", -height / 2)
    .attr("y", 20)
    .attr("text-anchor", "middle")
    .style("font-size", "18px")
    .text("Number of films");

  svg2
    .append("text")
    .attr("x", width / 2)
    .attr("y", margin.top / 2)
    .attr("text-anchor", "middle")
    .style("font-size", "28px")
    .text("Grand Prix: Winners vs Official Selection");

  // ==============================
  // Jury Prize
  // ==============================

  const svg3 = d3
    .select("#chart3")
    .append("svg")
    .attr("width", width)
    .attr("height", height);

  // 1) Catégories
  const categories3 = ["Official Selection", "Jury Prize"];

  // 2) Comptage par catégorie
  const counts3 = d3.rollup(
    films,
    (v) => v.length,
    (f) => f.jury_prize,
  );

  // 3) Données pour D3
  const data3 = categories3.map((c) => ({
    category: c,
    count: counts3.get(c) ?? 0,
  }));

  // 4) Échelles
  const x3 = d3
    .scaleBand()
    .domain(categories3)
    .range([margin.left, width - margin.right])
    .padding(0.35);

  const y3 = d3
    .scaleLinear()
    .domain([0, d3.max(data3, (d) => d.count)])
    .nice()
    .range([height - margin.bottom, margin.top]);

  // 5) Film fixe par catégorie (hover stable)
  const chosenFilm3 = {};
  categories3.forEach((c) => {
    const list = films.filter((f) => f.jury_prize === c);
    chosenFilm3[c] =
      list.length > 0 ? list[Math.floor(Math.random() * list.length)] : null;
  });

  // 6) Barres
  svg3
    .selectAll("rect")
    .data(data3)
    .enter()
    .append("rect")
    .attr("x", (d) => x3(d.category))
    .attr("y", (d) => y3(d.count))
    .attr("width", x3.bandwidth())
    .attr("height", (d) => y3(0) - y3(d.count))
    .attr("fill", "#B02046")
    .on("mouseover", function (event, d) {
      d3.select(this).attr("fill", "#FF6695");

      const f = chosenFilm3[d.category];
      if (f) {
        document.getElementById("info3").innerHTML = `
        <div class="info-content">
          <div class="info-text">
            <h2>${f.title}</h2>
            <strong>Jury Prize status:</strong> ${d.category}<br>
            Director: ${f.director}<br>
            Genres: ${f.genres}<br>
            Year: ${f.year}<br>
            Country: ${f.country}
          </div>
        </div>
      `;
      }
    })
    .on("mouseout", function () {
      d3.select(this).attr("fill", "#B02046");
    });

  // 7) Axes
  svg3
    .append("g")
    .attr("transform", `translate(0,${height - margin.bottom})`)
    .call(d3.axisBottom(x3))
    .selectAll("text")
    .style("font-size", "20px");

  svg3
    .append("g")
    .attr("transform", `translate(${margin.left},0)`)
    .call(d3.axisLeft(y3).ticks(6).tickFormat(d3.format("d")))
    .selectAll("text")
    .style("font-size", "20px");

  // 8) Titres et labels
  svg3
    .append("text")
    .attr("x", width / 2)
    .attr("y", height - 15)
    .attr("text-anchor", "middle")
    .style("font-size", "18px")
    .text("Jury Prize status");

  svg3
    .append("text")
    .attr("transform", "rotate(-90)")
    .attr("x", -height / 2)
    .attr("y", 20)
    .attr("text-anchor", "middle")
    .style("font-size", "18px")
    .text("Number of films");

  svg3
    .append("text")
    .attr("x", width / 2)
    .attr("y", margin.top / 2)
    .attr("text-anchor", "middle")
    .style("font-size", "28px")
    .text("Jury Prize: Winners vs Official Selection");

  // ================================================
  // ===============  GRAPHIQUE 4  ==================
  // ================================================

  if (document.getElementById("chart4")) {
    // Comptage des niveaux de comédie
    const comedyCounts = d3
      .rollups(
        df,
        (v) => v.length,
        (d) => d.Comedy,
      )
      .sort((a, b) => a[0] - b[0]); // ordre 0,1,2

    // Film fixe par niveau de comédie (0/1/2)
    const chosenFilm4 = {};
    comedyCounts.forEach(([level]) => {
      const list = films.filter((f) => f.Comedy === level); // ou df.filter(...) si vous préférez
      chosenFilm4[level] =
        list.length > 0 ? list[Math.floor(Math.random() * list.length)] : null;
    });

    const svg4 = d3
      .select("#chart4")
      .append("svg")
      .attr("width", width)
      .attr("height", height);

    const x4 = d3
      .scaleBand()
      .domain(comedyCounts.map((d) => d[0]))
      .range([margin.left, width - margin.right])
      .padding(0.2);

    const y4 = d3
      .scaleLinear()
      .domain([0, d3.max(comedyCounts, (d) => d[1])])
      .nice()
      .range([height - margin.bottom, margin.top]);

    svg4
      .selectAll("rect")
      .data(comedyCounts)
      .enter()
      .append("rect")
      .attr("x", (d) => x4(d[0]))
      .attr("y", (d) => y4(d[1]))
      .attr("width", x4.bandwidth())
      .attr("height", (d) => y4(0) - y4(d[1]))
      .attr("fill", "#C2B2B0")
      .on("mouseover", function (event, d) {
        d3.select(this).attr("fill", "#FFD6FA");

        const level = d[0];
        const count = d[1];

        const f = chosenFilm4[level];
        if (f) {
          document.getElementById("info4").innerHTML = `
        <div class="info-content">
          <div class="info-text">
            <h2>${f.title}</h2>
            Palme d'Or status: ${displayValue(f.palme)}<br>
            Grand Prix status: ${displayValue(f.grand_prix)}<br>
            Jury Prize status: ${displayValue(f.jury_prize)}<br>
            Director: ${f.director}<br>
            <strong>Genres:</strong> ${f.genres}<br>
            Year: ${f.year}<br>
            Country: ${f.country}
          </div>
        </div>
      `;
        }
      })
      .on("mouseout", function () {
        d3.select(this).attr("fill", "#C2B2B0");
      });

    // Axes
    svg4
      .append("g")
      .attr("transform", `translate(0,${height - margin.bottom})`)
      .call(d3.axisBottom(x4))
      .selectAll("text")
      .style("font-size", "20px");

    svg4
      .append("g")
      .attr("transform", `translate(${margin.left},0)`)
      .call(d3.axisLeft(y4))
      .selectAll("text")
      .style("font-size", "20px");

    svg4
      .append("text")
      .attr("x", width / 2)
      .attr("y", height - 15)
      .attr("text-anchor", "middle")
      .style("font-size", "18px")
      .text("Comedy level (0 = No Comedy, 1 = Mixed Comedy, 2 = Pure Comedy)");

    svg4
      .append("text")
      .attr("transform", "rotate(-90)")
      .attr("x", -height / 2)
      .attr("y", -margin.left + 20)
      .attr("text-anchor", "middle")
      .style("font-size", "18px")
      .text("Number of films");

    // Titre
    svg4
      .append("text")
      .attr("x", width / 2)
      .attr("y", margin.top / 2)
      .attr("text-anchor", "middle")
      .style("font-size", "28px")
      .text("Distribution of comedy levels");
  }

  // ================================================
  // ===============  GRAPHIQUE 5  ==================
  // ================================================
  // 100% stacked bars: Comedy distribution by Best Picture
  // Hover (pas click) -> affiche un film aléatoire du segment

  if (document.getElementById("chart5")) {
    const svg5 = d3
      .select("#chart5")
      .append("svg")
      .attr("width", width)
      .attr("height", height);

    const categoriesX = ["Official Selection", "Palme d'Or"];
    const comedyLevels = [0, 1, 2];

    // Normalisation minimale et filtrage
    const data = films
      .map((d) => ({
        ...d,
        palme: String(d.palme ?? "").trim(),
        Comedy: +d.Comedy,
      }))
      .filter(
        (d) =>
          (d.palme === "Palme d'Or" || d.palme === "Official Selection") &&
          Number.isFinite(d.Comedy),
      );

    // Comptage par (Picture, Comedy)
    // Structure finale attendue par stack: [{Picture:"Winner", c0:..., c1:..., c2:...}, ...]
    const countsByPalme = d3.rollups(
      data,
      (v) => v.length,
      (d) => d.palme,
      (d) => d.Comedy,
    );

    const rows = categoriesX.map((pic) => {
      const mapComedy = new Map(
        (countsByPalme.find(([k]) => k === pic)?.[1] ?? []).map(([c, n]) => [
          c,
          n,
        ]),
      );

      const c0 = mapComedy.get(0) ?? 0;
      const c1 = mapComedy.get(1) ?? 0;
      const c2 = mapComedy.get(2) ?? 0;
      const total = c0 + c1 + c2;

      return {
        palme: pic,
        c0,
        c1,
        c2,
        total,
        // proportions (0..1) pour le 100% stacked
        p0: total ? c0 / total : 0,
        p1: total ? c1 / total : 0,
        p2: total ? c2 / total : 0,
      };
    });

    // Préparer le stack sur p0/p1/p2
    const keys = ["p0", "p1", "p2"];
    const stack = d3.stack().keys(keys);
    const series = stack(rows);

    // Échelles
    const x = d3
      .scaleBand()
      .domain(categoriesX)
      .range([margin.left, width - margin.right])
      .padding(0.35);

    const y = d3
      .scaleLinear()
      .domain([0, 1])
      .range([height - margin.bottom, margin.top]);

    // Axes
    svg5
      .append("g")
      .attr("transform", `translate(0,${height - margin.bottom})`)
      .call(d3.axisBottom(x))
      .selectAll("text")
      .style("font-size", "20px");

    svg5
      .append("g")
      .attr("transform", `translate(${margin.left},0)`)
      .call(
        d3
          .axisLeft(y)
          .ticks(5)
          .tickFormat((d) => `${Math.round(d * 100)}%`),
      )
      .selectAll("text")
      .style("font-size", "20px");

    // Labels
    svg5
      .append("text")
      .attr("x", width / 2)
      .attr("y", height - 15)
      .attr("text-anchor", "middle")
      .style("font-size", "18px")
      .text("Palme d'Or status");

    svg5
      .append("text")
      .attr("transform", "rotate(-90)")
      .attr("x", -height / 2)
      .attr("y", 20)
      .attr("text-anchor", "middle")
      .style("font-size", "18px")
      .text("Share of films by Comedy level");

    // Titre
    svg5
      .append("text")
      .attr("x", width / 2)
      .attr("y", margin.top / 2)
      .attr("text-anchor", "middle")
      .style("font-size", "28px")
      .text("Comedy distribution depended on the Palme d'Or status");

    // Film aléatoire par segment (Picture + Comedy)
    // clé: "Winner|0" etc.
    const chosenFilm = {};
    categoriesX.forEach((pic) => {
      comedyLevels.forEach((c) => {
        const list = data.filter((d) => d.palme === pic && d.Comedy === c);
        chosenFilm[`${pic}|${c}`] =
          list.length > 0
            ? list[Math.floor(Math.random() * list.length)]
            : null;
      });
    });

    // Mapping key -> niveau de comedy (pour afficher dans tooltip)
    const keyToComedy = { p0: 0, p1: 1, p2: 2 };

    // Dessin des segments empilés
    // series = tableau de 3 séries (p0,p1,p2), chaque série contient 2 segments (Winner/Nominated)
    svg5
      .append("g")
      .selectAll("g")
      .data(series)
      .enter()
      .append("g")
      .selectAll("rect")
      .data((s) => s.map((d) => ({ ...d, key: s.key })))
      .enter()
      .append("rect")
      .attr("x", (d) => x(d.data.palme))
      .attr("y", (d) => y(d[1]))
      .attr("height", (d) => y(d[0]) - y(d[1]))
      .attr("width", x.bandwidth())
      .attr("fill", (d) => {
        // couleurs simples, cohérentes : 0/1/2
        if (d.key === "p0") return "#3376FF";
        if (d.key === "p1") return "#699CFF";
        return "#BDCDFF";
      })
      .attr("opacity", 0.95)
      .on("mouseover", function (event, d) {
        d3.select(this)
          .attr("opacity", 1)
          .attr("stroke", "#000")
          .attr("stroke-width", 2);

        const comedy = keyToComedy[d.key];
        const pic = d.data.palme;
        const f = chosenFilm[`${pic}|${comedy}`];

        const info = document.getElementById("info5");
        if (info) {
          if (!f) {
            info.innerHTML = `
            <div class="info-content">
              <div class="info-text">
                <h2>No film available</h2>
                <strong>Palme d'Or Status:</strong> ${pic}<br>
                <strong>Comedy:</strong> ${comedy}<br>
              </div>
            </div>
          `;
            return;
          }

          info.innerHTML = `
          <div class="info-content">
            <div class="info-text">
              <h2>${f.title ?? "Unknown title"}</h2>
              <strong>Palme d'Or Status:</strong> ${pic}<br>
              <strong>Comedy:</strong> ${comedy}<br>
              <strong>Genres:</strong> ${f.genres}<br>
              Director: ${f.director}<br>
              Year: ${f.year}<br>
              Country: ${f.country}<br>
            </div>
          </div>
        `;
        }
      })
      .on("mouseout", function () {
        d3.select(this).attr("opacity", 0.95).attr("stroke", "none");
      });

    // Légende (simple)
    const legend = svg5
      .append("g")
      .attr(
        "transform",
        `translate(${width - margin.right - 89},${margin.top})`,
      );

    const legendItems = [
      { label: "No comedy", key: "p0" },
      { label: "Mixed comedy", key: "p1" },
      { label: "Pure comedy", key: "p2" },
    ];

    legend
      .selectAll("rect")
      .data(legendItems)
      .enter()
      .append("rect")
      .attr("x", 0)
      .attr("y", (d, i) => i * 26)
      .attr("width", 18)
      .attr("height", 18)
      .attr("fill", (d) => {
        if (d.key === "p0") return "#3376FF";
        if (d.key === "p1") return "#699CFF";
        return "#BDCDFF";
      });

    legend
      .selectAll("text")
      .data(legendItems)
      .enter()
      .append("text")
      .attr("x", 26)
      .attr("y", (d, i) => i * 26 + 14)
      .style("font-size", "16px")
      .text((d) => d.label);
  }

  // ================================================
  // ===============  GRAPHIQUE 6  ==================
  // ================================================
  // 100% stacked bars: Comedy distribution by Best Director
  // Hover (pas click) -> affiche un film aléatoire du segment

  if (document.getElementById("chart6")) {
    const svg6 = d3
      .select("#chart6")
      .append("svg")
      .attr("width", width)
      .attr("height", height);

    const categoriesX = ["Official Selection", "Grand Prix"];
    const comedyLevels = [0, 1, 2];

    // Normalisation + filtrage
    // NOTE: si d["Best Director"] est binaire (0/1), adaptez le mapping ici.
    const data = films
      .map((d) => {
        const raw = String(d.grand_prix ?? "")
          .trim()
          .toLowerCase();
        const grand_prixStatus =
          raw === "grand prix" || raw === "grand_prix" || raw === "true"
            ? "Grand Prix"
            : "Official Selection";

        return {
          ...d,
          grand_prixStatus,
          Comedy: +d.Comedy,
        };
      })
      .filter(
        (d) =>
          (d.grand_prixStatus === "Grand Prix" ||
            d.grand_prixStatus === "Official Selection") &&
          Number.isFinite(d.Comedy),
      );

    // Comptage par (DirectorStatus, Comedy)
    const countsBygrand_prix = d3.rollups(
      data,
      (v) => v.length,
      (d) => d.grand_prixStatus,
      (d) => d.Comedy,
    );

    const rows = categoriesX.map((status) => {
      const mapComedy = new Map(
        (countsBygrand_prix.find(([k]) => k === status)?.[1] ?? []).map(
          ([c, n]) => [c, n],
        ),
      );

      const c0 = mapComedy.get(0) ?? 0;
      const c1 = mapComedy.get(1) ?? 0;
      const c2 = mapComedy.get(2) ?? 0;
      const total = c0 + c1 + c2;

      return {
        status,
        c0,
        c1,
        c2,
        total,
        p0: total ? c0 / total : 0,
        p1: total ? c1 / total : 0,
        p2: total ? c2 / total : 0,
      };
    });

    // Stack
    const keys = ["p0", "p1", "p2"];
    const series = d3.stack().keys(keys)(rows);

    // Échelles
    const x = d3
      .scaleBand()
      .domain(categoriesX)
      .range([margin.left, width - margin.right])
      .padding(0.35);

    const y = d3
      .scaleLinear()
      .domain([0, 1])
      .range([height - margin.bottom, margin.top]);

    // Axes
    svg6
      .append("g")
      .attr("transform", `translate(0,${height - margin.bottom})`)
      .call(d3.axisBottom(x))
      .selectAll("text")
      .style("font-size", "20px");

    svg6
      .append("g")
      .attr("transform", `translate(${margin.left},0)`)
      .call(
        d3
          .axisLeft(y)
          .ticks(5)
          .tickFormat((d) => `${Math.round(d * 100)}%`),
      )
      .selectAll("text")
      .style("font-size", "20px");

    // Labels
    svg6
      .append("text")
      .attr("x", width / 2)
      .attr("y", height - 15)
      .attr("text-anchor", "middle")
      .style("font-size", "18px")
      .text("Grand Prix status");

    svg6
      .append("text")
      .attr("transform", "rotate(-90)")
      .attr("x", -height / 2)
      .attr("y", 20)
      .attr("text-anchor", "middle")
      .style("font-size", "18px")
      .text("Share of films by Comedy level");

    // Titre
    svg6
      .append("text")
      .attr("x", width / 2)
      .attr("y", margin.top / 2)
      .attr("text-anchor", "middle")
      .style("font-size", "28px")
      .text("Comedy distribution depended on the Grand Jury status");

    // Film aléatoire par segment (DirectorStatus + Comedy)
    const chosenFilm = {};
    categoriesX.forEach((status) => {
      comedyLevels.forEach((c) => {
        const list = data.filter(
          (d) => d.grand_prixStatus === status && d.Comedy === c,
        );
        chosenFilm[`${status}|${c}`] =
          list.length > 0
            ? list[Math.floor(Math.random() * list.length)]
            : null;
      });
    });

    const keyToComedy = { p0: 0, p1: 1, p2: 2 };

    // Segments
    svg6
      .append("g")
      .selectAll("g")
      .data(series)
      .enter()
      .append("g")
      .selectAll("rect")
      .data((s) => s.map((d) => ({ ...d, key: s.key })))
      .enter()
      .append("rect")
      .attr("x", (d) => x(d.data.status))
      .attr("y", (d) => y(d[1]))
      .attr("height", (d) => y(d[0]) - y(d[1]))
      .attr("width", x.bandwidth())
      .attr("fill", (d) => {
        if (d.key === "p0") return "#e7cc00ea";
        if (d.key === "p1") return "#f7eb0dff";
        return "#FFF978";
      })
      .attr("opacity", 0.95)
      .on("mouseover", function (event, d) {
        d3.select(this)
          .attr("opacity", 1)
          .attr("stroke", "#000")
          .attr("stroke-width", 2);

        const comedy = keyToComedy[d.key];
        const status = d.data.status;
        const f = chosenFilm[`${status}|${comedy}`];

        const info = document.getElementById("info6");
        if (info) {
          if (!f) {
            info.innerHTML = `
            <div class="info-content">
              <div class="info-text">
                <h2>No film available</h2>
                <strong>Grand Prix:</strong> ${status}<br>
                <strong>Comedy:</strong> ${comedy}<br>
              </div>
            </div>
          `;
            return;
          }

          info.innerHTML = `
          <div class="info-content">
            <div class="info-text">
              <h2>${f.title ?? "Unknown title"}</h2>
              <strong>Grand Prix:</strong> ${status}<br>
              <strong>Comedy:</strong> ${comedy}<br>
              <strong>Genres:</strong> ${f.genres}<br>
              Director: ${f.director}<br>
              Year: ${f.year}<br>
              Country: ${f.country}<br>
            </div>
          </div>
        `;
        }
      })
      .on("mouseout", function () {
        d3.select(this).attr("opacity", 0.95).attr("stroke", "none");
      });

    // Légende (décalable vers la gauche en ajustant -280)
    const legend = svg6
      .append("g")
      .attr(
        "transform",
        `translate(${width - margin.right - 89},${margin.top})`,
      );

    const legendItems = [
      { label: "No comedy", key: "p0" },
      { label: "Mixed comedy", key: "p1" },
      { label: "Pure comedy", key: "p2" },
    ];

    legend
      .selectAll("rect")
      .data(legendItems)
      .enter()
      .append("rect")
      .attr("x", 0)
      .attr("y", (d, i) => i * 26)
      .attr("width", 18)
      .attr("height", 18)
      .attr("fill", (d) => {
        if (d.key === "p0") return "#e7cc00ea";
        if (d.key === "p1") return "#f7eb0dff";
        return "#FFF978";
      });

    legend
      .selectAll("text")
      .data(legendItems)
      .enter()
      .append("text")
      .attr("x", 26)
      .attr("y", (d, i) => i * 26 + 14)
      .style("font-size", "16px")
      .text((d) => d.label);
  }

  // ================================================
  // ================================================
  // ===============  GRAPHIQUE 7  ==================
  // ================================================
  // 100% stacked bars: Comedy distribution by Jury Prize
  // Hover -> affiche un film aléatoire du segment

  if (document.getElementById("chart7")) {
    const svg7 = d3
      .select("#chart7")
      .append("svg")
      .attr("width", width)
      .attr("height", height);

    const categoriesX = ["Official Selection", "Jury Prize"];
    const comedyLevels = [0, 1, 2];

    // Normalisation + filtrage (même logique que graph5/6)
    const data = films
      .map((d) => ({
        ...d,
        jury_prizeStatus: String(d.jury_prize ?? "")
          .trim()
          .replace(/’/g, "'"),
        Comedy: Number(d.Comedy),
      }))
      .filter(
        (d) =>
          categoriesX.includes(d.jury_prizeStatus) &&
          comedyLevels.includes(d.Comedy),
      );

    // Comptage par (JuryPrizeStatus, Comedy)
    const countsByJury = d3.rollups(
      data,
      (v) => v.length,
      (d) => d.jury_prizeStatus,
      (d) => d.Comedy,
    );

    const rows = categoriesX.map((status) => {
      const mapComedy = new Map(
        (countsByJury.find(([k]) => k === status)?.[1] ?? []).map(([c, n]) => [
          c,
          n,
        ]),
      );

      const c0 = mapComedy.get(0) ?? 0;
      const c1 = mapComedy.get(1) ?? 0;
      const c2 = mapComedy.get(2) ?? 0;
      const total = c0 + c1 + c2;

      return {
        status,
        total,
        p0: total ? c0 / total : 0,
        p1: total ? c1 / total : 0,
        p2: total ? c2 / total : 0,
      };
    });

    // Stack
    const keys = ["p0", "p1", "p2"];
    const series = d3.stack().keys(keys)(rows);

    // Échelles
    const x = d3
      .scaleBand()
      .domain(categoriesX)
      .range([margin.left, width - margin.right])
      .padding(0.35);

    const y = d3
      .scaleLinear()
      .domain([0, 1])
      .range([height - margin.bottom, margin.top]);

    // Axes
    svg7
      .append("g")
      .attr("transform", `translate(0,${height - margin.bottom})`)
      .call(d3.axisBottom(x))
      .selectAll("text")
      .style("font-size", "20px");

    svg7
      .append("g")
      .attr("transform", `translate(${margin.left},0)`)
      .call(
        d3
          .axisLeft(y)
          .ticks(5)
          .tickFormat((d) => `${Math.round(d * 100)}%`),
      )
      .selectAll("text")
      .style("font-size", "20px");

    // Labels
    svg7
      .append("text")
      .attr("x", width / 2)
      .attr("y", height - 15)
      .attr("text-anchor", "middle")
      .style("font-size", "18px")
      .text("Jury Prize status");

    svg7
      .append("text")
      .attr("transform", "rotate(-90)")
      .attr("x", -height / 2)
      .attr("y", 20)
      .attr("text-anchor", "middle")
      .style("font-size", "18px")
      .text("Share of films by Comedy level");

    // Titre
    svg7
      .append("text")
      .attr("x", width / 2)
      .attr("y", margin.top / 2)
      .attr("text-anchor", "middle")
      .style("font-size", "28px")
      .text("Comedy distribution depended on the Jury Prize status");

    // Film aléatoire par segment (Status + Comedy)
    const chosenFilm = {};
    categoriesX.forEach((status) => {
      comedyLevels.forEach((c) => {
        const list = data.filter(
          (d) => d.jury_prizeStatus === status && d.Comedy === c,
        );
        chosenFilm[`${status}|${c}`] =
          list.length > 0
            ? list[Math.floor(Math.random() * list.length)]
            : null;
      });
    });

    const keyToComedy = { p0: 0, p1: 1, p2: 2 };

    // Segments
    svg7
      .append("g")
      .selectAll("g")
      .data(series)
      .enter()
      .append("g")
      .selectAll("rect")
      .data((s) => s.map((d) => ({ ...d, key: s.key })))
      .enter()
      .append("rect")
      .attr("x", (d) => x(d.data.status))
      .attr("y", (d) => y(d[1]))
      .attr("height", (d) => y(d[0]) - y(d[1]))
      .attr("width", x.bandwidth())
      .attr("fill", (d) => {
        if (d.key === "p0") return "#B02046";
        if (d.key === "p1") return "rgba(220, 96, 129, 1)";
        return "#ffa3bbff";
      })
      .attr("opacity", 0.95)
      .on("mouseover", function (event, d) {
        d3.select(this)
          .attr("opacity", 1)
          .attr("stroke", "#000")
          .attr("stroke-width", 2);

        const comedy = keyToComedy[d.key];
        const status = d.data.status;
        const f = chosenFilm[`${status}|${comedy}`];

        const info = document.getElementById("info7");
        if (info) {
          if (!f) {
            info.innerHTML = `
            <div class="info-content">
              <div class="info-text">
                <h2>No film available</h2>
                <strong>Jury Prize:</strong> ${status}<br>
                <strong>Comedy:</strong> ${comedy}<br>
              </div>
            </div>
          `;
            return;
          }

          info.innerHTML = `
          <div class="info-content">
            <div class="info-text">
              <h2>${f.title ?? "Unknown title"}</h2>
              <strong>Jury Prize:</strong> ${status}<br>
              <strong>Comedy:</strong> ${comedy}<br>
              <strong>Genres:</strong> ${f.genres}<br>
              Director: ${f.director}<br>
              Year: ${f.year}<br>
              Country: ${f.country}<br>
            </div>
          </div>
        `;
        }
      })
      .on("mouseout", function () {
        d3.select(this).attr("opacity", 0.95).attr("stroke", "none");
      });

    // Légende
    const legend = svg7
      .append("g")
      .attr(
        "transform",
        `translate(${width - margin.right - 89},${margin.top})`,
      );

    const legendItems = [
      { label: "No comedy", key: "p0" },
      { label: "Mixed comedy", key: "p1" },
      { label: "Pure comedy", key: "p2" },
    ];

    legend
      .selectAll("rect")
      .data(legendItems)
      .enter()
      .append("rect")
      .attr("x", 0)
      .attr("y", (d, i) => i * 26)
      .attr("width", 18)
      .attr("height", 18)
      .attr("fill", (d) => {
        if (d.key === "p0") return "#B02046";
        if (d.key === "p1") return "rgba(220, 96, 129, 1)";
        return "#ffa3bbff";
      });

    legend
      .selectAll("text")
      .data(legendItems)
      .enter()
      .append("text")
      .attr("x", 26)
      .attr("y", (d, i) => i * 26 + 14)
      .style("font-size", "16px")
      .text((d) => d.label);
  }
});
