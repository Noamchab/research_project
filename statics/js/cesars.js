d3.json("../statics/json/cesars.json").then((df) => {
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

  // Films communs à tous les graphiques
  const films = df.map((d) => ({
    Comedy: d.Comedy,
    Picture: String(d["Best Picture"]).trim(),
    title: d.Film,
    genres: d.WikiGenre,
    Director: d["Best Director"],
    year: d.Year,
  }));

  // Dimensions communes
  const width = 800;
  const height = 500;
  const margin = { top: 50, right: 40, bottom: 60, left: 70 };

  // ================================================
  // ===============  GRAPHIQUE 1  ==================
  // ================================================

  // ==============================
  // Best Picture (Winner/Nominated)
  // ==============================

  const svg1 = d3
    .select("#chart1")
    .append("svg")
    .attr("width", width)
    .attr("height", height);

  // 1) Catégories
  const categories1 = ["Nominated", "Winner"];

  // 2) Comptage par catégorie
  const counts1 = d3.rollup(
    films,
    (v) => v.length,
    (f) => f.Picture,
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
    const list = films.filter((f) => f.Picture === c);
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
            <strong>Best Picture:</strong> ${d.category}<br>
            Genres: ${f.genres}<br>
            Year: ${f.year}
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
    .text("Best Picture status");

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
    .text("Best Picture: Winners vs Nominated");

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
  const categories2 = ["Nominated", "Winner"];

  // 2) Comptage par catégorie
  const counts2 = d3.rollup(
    films,
    (v) => v.length,
    (f) => f.Director,
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
    const list = films.filter((f) => f.Director === c);
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
            <strong>Best Director:</strong> ${d.category}<br>
            Genres: ${f.genres}<br>
            Year: ${f.year}
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
    .text("Best Director status");

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
    .text("Best Director: Winners vs Nominated");

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
            Best Picture: ${f.Picture}<br>
            Best Director: ${f.Director}<br>
            Genres: ${f.genres}<br>
            Year: ${f.year}
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
  // ==========  GRAPHIQUE 5 : REGRESSION  ===========
  // ========  Revenue (log10) vs Comedy  ============
  // ================================================

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

    const categoriesX = ["Nominated", "Winner"];
    const comedyLevels = [0, 1, 2];

    // Normalisation minimale et filtrage
    const data = films
      .map((d) => ({
        ...d,
        Picture: String(d.Picture ?? "").trim(),
        Comedy: +d.Comedy,
      }))
      .filter(
        (d) =>
          (d.Picture === "Winner" || d.Picture === "Nominated") &&
          Number.isFinite(d.Comedy),
      );

    // Comptage par (Picture, Comedy)
    // Structure finale attendue par stack: [{Picture:"Winner", c0:..., c1:..., c2:...}, ...]
    const countsByPicture = d3.rollups(
      data,
      (v) => v.length,
      (d) => d.Picture,
      (d) => d.Comedy,
    );

    const rows = categoriesX.map((pic) => {
      const mapComedy = new Map(
        (countsByPicture.find(([k]) => k === pic)?.[1] ?? []).map(([c, n]) => [
          c,
          n,
        ]),
      );

      const c0 = mapComedy.get(0) ?? 0;
      const c1 = mapComedy.get(1) ?? 0;
      const c2 = mapComedy.get(2) ?? 0;
      const total = c0 + c1 + c2;

      return {
        Picture: pic,
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
      .text("Best Picture status");

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
      .text("Comedy distribution depended on the Best Picture status");

    // Film aléatoire par segment (Picture + Comedy)
    // clé: "Winner|0" etc.
    const chosenFilm = {};
    categoriesX.forEach((pic) => {
      comedyLevels.forEach((c) => {
        const list = data.filter((d) => d.Picture === pic && d.Comedy === c);
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
      .attr("x", (d) => x(d.data.Picture))
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
        const pic = d.data.Picture;
        const f = chosenFilm[`${pic}|${comedy}`];

        const info = document.getElementById("info5");
        if (info) {
          if (!f) {
            info.innerHTML = `
            <div class="info-content">
              <div class="info-text">
                <h2>No film available</h2>
                <strong>Best Picture:</strong> ${pic}<br>
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
              <strong>Best Picture:</strong> ${pic}<br>
              <strong>Comedy:</strong> ${comedy}<br>
              <strong>Genres:</strong> ${f.genres}<br>
              Year: ${f.year}
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

    const categoriesX = ["Nominated", "Winner"];
    const comedyLevels = [0, 1, 2];

    // Normalisation + filtrage
    // NOTE: si d["Best Director"] est binaire (0/1), adaptez le mapping ici.
    const data = films
      .map((d) => {
        const raw = String(d.Director ?? "")
          .trim()
          .toLowerCase();
        const DirectorStatus =
          raw === "winner" || raw === "1" || raw === "true"
            ? "Winner"
            : "Nominated";

        return {
          ...d,
          DirectorStatus,
          Comedy: +d.Comedy,
        };
      })
      .filter(
        (d) =>
          (d.DirectorStatus === "Winner" || d.DirectorStatus === "Nominated") &&
          Number.isFinite(d.Comedy),
      );

    // Comptage par (DirectorStatus, Comedy)
    const countsByDirector = d3.rollups(
      data,
      (v) => v.length,
      (d) => d.DirectorStatus,
      (d) => d.Comedy,
    );

    const rows = categoriesX.map((status) => {
      const mapComedy = new Map(
        (countsByDirector.find(([k]) => k === status)?.[1] ?? []).map(
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
      .text("Best Director status");

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
      .text("Comedy distribution depended on the Best Director status");

    // Film aléatoire par segment (DirectorStatus + Comedy)
    const chosenFilm = {};
    categoriesX.forEach((status) => {
      comedyLevels.forEach((c) => {
        const list = data.filter(
          (d) => d.DirectorStatus === status && d.Comedy === c,
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
                <strong>Best Director:</strong> ${status}<br>
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
              <strong>Best Director:</strong> ${status}<br>
              <strong>Comedy:</strong> ${comedy}<br>
              <strong>Genres:</strong> ${f.genres}<br>
              Year: ${f.year}
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
});
