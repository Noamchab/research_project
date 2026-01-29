d3.json("../statics/json/llm.json").then((df) => {
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

  // Fonction pour exposants Unicode
  function toSuperscript(n) {
    const superscripts = {
      0: "⁰",
      1: "¹",
      2: "²",
      3: "³",
      4: "⁴",
      5: "⁵",
      6: "⁶",
      7: "⁷",
      8: "⁸",
      9: "⁹",
      "-": "⁻",
    };
    return String(n)
      .split("")
      .map((char) => superscripts[char] || char)
      .join("");
  }

  // Films communs à tous les graphiques
  const films = df.map((d) => ({
    Comedy: d.Comedy,
    log10_revenue: d.log10_revenue,
    revenue: d.revenue,
    title: d.title,
    audienceScore: d.audienceScore,
    tomatoMeter: d.tomatoMeter,
    poster_path: d.poster_path,
    genres: d.genres,
    LLM_Note: d.LLM_Note,
    Justification: d.Justification,
  }));

  // Dimensions communes
  const width = 800;
  const height = 500;
  const margin = { top: 50, right: 40, bottom: 60, left: 70 };

  // Création de la fonction pour extraire le titre
  function getPosterURL(film, size = "w780") {
    return film.poster_path
      ? `https://image.tmdb.org/t/p/${size}${film.poster_path}`
      : null;
  }

  // ================================================
  // ===============  GRAPHIQUE 1  ==================
  // ================================================

  const svg1 = d3
    .select("#chart1")
    .append("svg")
    .attr("width", width)
    .attr("height", height);

  const data1 = df.map((d) => d.log10_revenue);

  const x1 = d3
    .scaleLinear()
    .domain(d3.extent(data1))
    .range([margin.left, width - margin.right]);

  const xAxisFormat1 = d3
    .axisBottom(x1)
    .ticks(6)
    .tickFormat((d) => "10" + toSuperscript(d.toFixed(0)));

  const histogram1 = d3.histogram().domain(x1.domain()).thresholds(40);

  const bins1 = histogram1(data1);

  const y1 = d3
    .scaleLinear()
    .domain([0, d3.max(bins1, (d) => d.length)])
    .nice()
    .range([height - margin.bottom, margin.top]);

  // Films fixes par bin
  const chosenFilm1 = {};
  bins1.forEach((bin, i) => {
    const list = films.filter(
      (f) => f.log10_revenue >= bin.x0 && f.log10_revenue < bin.x1,
    );
    chosenFilm1[i] =
      list.length > 0 ? list[Math.floor(Math.random() * list.length)] : null;
  });

  // Barres
  svg1
    .selectAll("rect")
    .data(bins1)
    .enter()
    .append("rect")
    .attr("x", (d) => x1(d.x0))
    .attr("y", (d) => y1(d.length))
    .attr("width", (d) => x1(d.x1) - x1(d.x0) - 1)
    .attr("height", (d) => y1(0) - y1(d.length))
    .attr("fill", "#7392EB")
    .on("mouseover", function (event, d) {
      d3.select(this).attr("fill", "#BDCDFF");

      const f = chosenFilm1[bins1.indexOf(d)];
      if (f) {
        // 👉 AJOUT ICI : construction de l’URL du poster
        const posterURL = getPosterURL(f);

        document.getElementById("info1").innerHTML = `
          <div class="info-content">
            ${
              posterURL
                ? `<img class="poster"
                        src="${posterURL}"
                        alt="Poster of ${f.title}">`
                : ""
            }
            <div class="info-text">
              <h2>${f.title}</h2>
              <strong>Revenue:</strong>
              ${f.revenue.toLocaleString()} dollars<br>
              Genres: ${f.genres}<br>
              Public rating: ${f.audienceScore}/100<br>
              Press rating: ${f.tomatoMeter}/100<br>
              LLM level of comedy: ${f.LLM_Note} 
            </div>
          </div>
        `;
      }
    })

    .on("mouseout", function () {
      d3.select(this).attr("fill", "#7392EB");
    });

  // Axes
  svg1
    .append("g")
    .attr("transform", `translate(0,${height - margin.bottom})`)
    .call(xAxisFormat1)
    .selectAll("text")
    .style("font-size", "20px");

  svg1
    .append("g")
    .attr("transform", `translate(${margin.left},0)`)
    .call(d3.axisLeft(y1).ticks(6).tickFormat(d3.format("d")))
    .selectAll("text")
    .style("font-size", "20px");

  svg1
    .append("text")
    .attr("x", width / 2)
    .attr("y", height - 15)
    .attr("text-anchor", "middle")
    .style("font-size", "18px")
    .text("Box office revenue (in $ USD)");

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
    .text("Distribution of box office revenues");

  // ================================================
  // ===============  GRAPHIQUE 2  ==================
  // ================================================

  const svg2 = d3
    .select("#chart2")
    .append("svg")
    .attr("width", width)
    .attr("height", height);

  const data2 = df.map((d) => d.audienceScore);

  const x2 = d3
    .scaleLinear()
    .domain([0, 100])
    .range([margin.left, width - margin.right]);

  const histogram2 = d3.histogram().domain(x2.domain()).thresholds(40);

  const bins2 = histogram2(data2);

  const y2 = d3
    .scaleLinear()
    .domain([0, d3.max(bins2, (d) => d.length)])
    .nice()
    .range([height - margin.bottom, margin.top]);

  // Films fixes
  const chosenFilm2 = {};

  bins2.forEach((bin, i) => {
    const list = films.filter(
      (f) => f.audienceScore >= bin.x0 && f.audienceScore < bin.x1,
    );
    chosenFilm2[i] =
      list.length > 0 ? list[Math.floor(Math.random() * list.length)] : null;
  });

  svg2
    .selectAll("rect")
    .data(bins2)
    .enter()
    .append("rect")
    .attr("x", (d) => x2(d.x0))
    .attr("y", (d) => y2(d.length))
    .attr("width", (d) => x2(d.x1) - x2(d.x0) - 1)
    .attr("height", (d) => y2(0) - y2(d.length))
    .attr("fill", "#FFE000")
    .on("mouseover", function (event, d) {
      d3.select(this).attr("fill", "#FFF978");

      const f = chosenFilm2[bins2.indexOf(d)];
      if (f) {
        const posterURL = getPosterURL(f);

        document.getElementById("info2").innerHTML = `
          <div class="info-content">
            ${
              posterURL
                ? `<img class="poster" src="${posterURL}" alt="Poster of ${f.title}">`
                : ""
            }
            <div class="info-text">
              <h2>${f.title}</h2>
              Revenue: ${f.revenue.toLocaleString()} dollars<br>
              Genres: ${f.genres}<br>
              <strong>Public rating:</strong> ${f.audienceScore}/100<br>
              Press rating: ${f.tomatoMeter}/100<br>
              LLM level of comedy: ${f.LLM_Note} 
            </div>
          </div>
        `;
      }
    })

    .on("mouseout", function () {
      d3.select(this).attr("fill", "#FFE000");
    });

  svg2
    .append("g")
    .attr("transform", `translate(0,${height - margin.bottom})`)
    .call(d3.axisBottom(x2))
    .selectAll("text")
    .style("font-size", "20px");

  svg2
    .append("g")
    .attr("transform", `translate(${margin.left},0)`)
    .call(d3.axisLeft(y2))
    .selectAll("text")
    .style("font-size", "20px");

  svg2
    .append("text")
    .attr("x", width / 2)
    .attr("y", height - 15)
    .attr("text-anchor", "middle")
    .style("font-size", "18px")
    .text("Audience rating (1 to 100)");

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
    .text("Distribution of audience scores");

  // ================================================
  // ===============  GRAPHIQUE 3  ==================
  // ================================================

  const svg3 = d3
    .select("#chart3")
    .append("svg")
    .attr("width", width)
    .attr("height", height);

  const data3 = df.map((d) => d.tomatoMeter);

  const x3 = d3
    .scaleLinear()
    .domain([0, 100])
    .range([margin.left, width - margin.right]);

  const histogram3 = d3.histogram().domain(x3.domain()).thresholds(40);

  const bins3 = histogram3(data3);

  const y3 = d3
    .scaleLinear()
    .domain([0, d3.max(bins3, (d) => d.length)])
    .nice()
    .range([height - margin.bottom, margin.top]);

  // Films fixes par bin
  const chosenFilm3 = {};
  bins3.forEach((bin, i) => {
    const list = films.filter(
      (f) => f.tomatoMeter >= bin.x0 && f.tomatoMeter < bin.x1,
    );
    chosenFilm3[i] =
      list.length > 0 ? list[Math.floor(Math.random() * list.length)] : null;
  });

  // Barres
  svg3
    .selectAll("rect")
    .data(bins3)
    .enter()
    .append("rect")
    .attr("x", (d) => x3(d.x0))
    .attr("y", (d) => y3(d.length))
    .attr("width", (d) => x3(d.x1) - x3(d.x0) - 1)
    .attr("height", (d) => y3(0) - y3(d.length))
    .attr("fill", "#B02046")
    .on("mouseover", function (event, d) {
      d3.select(this).attr("fill", "#FF6695");

      const f = chosenFilm3[bins3.indexOf(d)];
      if (f) {
        const posterURL = getPosterURL(f);

        document.getElementById("info3").innerHTML = `
          <div class="info-content">
            ${
              posterURL
                ? `<img class="poster" src="${posterURL}" alt="Poster of ${f.title}">`
                : ""
            }
            <div class="info-text">
              <h2>${f.title}</h2>
              Revenue: ${f.revenue.toLocaleString()} dollars<br>
              Genres: ${f.genres}<br>
              Public rating: ${f.audienceScore}/100<br>
              <strong>Press rating:</strong> ${f.tomatoMeter}/100<br>
              LLM level of comedy: ${f.LLM_Note}
            </div>
          </div>
        `;
      }
    })
    .on("mouseout", function () {
      d3.select(this).attr("fill", "#B02046");
    });

  // Axes
  svg3
    .append("g")
    .attr("transform", `translate(0,${height - margin.bottom})`)
    .call(d3.axisBottom(x3))
    .selectAll("text")
    .style("font-size", "20px");

  svg3
    .append("g")
    .attr("transform", `translate(${margin.left},0)`)
    .call(d3.axisLeft(y3))
    .selectAll("text")
    .style("font-size", "20px");

  svg3
    .append("text")
    .attr("x", width / 2)
    .attr("y", height - 15)
    .attr("text-anchor", "middle")
    .style("font-size", "18px")
    .text("Press rating (1 to 100)");

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
    .text("Distribution of press scores");

  // ================================================
  // ===============  GRAPHIQUE 4  ==================
  // ================================================

  if (document.getElementById("chart4")) {
    // Comptage des niveaux de comédie
    const comedyCounts = d3
      .rollups(
        df,
        (v) => v.length,
        (d) => d.LLM_Note,
      )
      .sort((a, b) => a[0] - b[0]); // ordre 0,1,2

    // Film fixe par niveau de comédie (0/1/2)
    const chosenFilm4 = {};
    comedyCounts.forEach(([level]) => {
      const list = films.filter((f) => f.LLM_Note === level); // ou df.filter(...) si vous préférez
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
          const posterURL = getPosterURL(f);

          document.getElementById("info4").innerHTML = `
            <div class="info-content">
              ${
                posterURL
                  ? `<img class="poster" src="${posterURL}" alt="Poster of ${f.title}">`
                  : ""
              }
              <div class="info-text">
                <h2>${f.title}</h2>
                Revenue: ${f.revenue.toLocaleString()} dollars<br>
                <strong>LLM Comedy level:</strong> ${level}<br>
                <strong>Genres:</strong> ${f.genres}<br>
                Public rating: ${f.audienceScore}/100<br>
                Press rating: ${f.tomatoMeter}/100<br>
                <strong>LLM Justification</strong>: ${f.Justification}
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
      .text("Comedy level according to LLM ");

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

  if (document.getElementById("chart5")) {
    const svg5 = d3
      .select("#chart5")
      .append("svg")
      .attr("width", width)
      .attr("height", height);

    const jitter = 0.3;
    let lockedPoint = null; // point sélectionné

    // Échelles
    const x5 = d3
      .scaleLinear()
      .domain([-0.5, 10.5])
      .range([margin.left, width - margin.right]);

    const y5 = d3
      .scaleLinear()
      .domain(d3.extent(df, (d) => d.log10_revenue))
      .nice()
      .range([height - margin.bottom, margin.top]);

    // Axe Y avec 10^k
    const yAxisFormat = d3
      .axisLeft(y5)
      .tickFormat((d) => "10" + toSuperscript(d.toFixed(0)));

    // Axes
    svg5
      .append("g")
      .attr("transform", `translate(0,${height - margin.bottom})`)
      .call(d3.axisBottom(x5).ticks(3))
      .selectAll("text")
      .style("font-size", "20px");

    svg5
      .append("g")
      .attr("transform", `translate(${margin.left},0)`)
      .call(yAxisFormat)
      .selectAll("text")
      .style("font-size", "20px");

    svg5
      .append("text")
      .attr("x", width / 2)
      .attr("y", height - 15)
      .attr("text-anchor", "middle")
      .style("font-size", "18px")
      .text("Comedy level according to LLM");

    svg5
      .append("text")
      .attr("transform", "rotate(-90)")
      .attr("x", -height / 2)
      .attr("y", 20)
      .attr("text-anchor", "middle")
      .style("font-size", "18px")
      .text("Revenue in the box office (in $ USD)");

    // Groupe pour capter les clics "dans le vide"
    svg5
      .append("rect")
      .attr("x", margin.left)
      .attr("y", margin.top)
      .attr("width", width - margin.left - margin.right)
      .attr("height", height - margin.top - margin.bottom)
      .attr("fill", "transparent")
      .lower()
      .on("click", () => {
        if (lockedPoint) {
          lockedPoint.attr("stroke", "none").attr("r", 3).attr("opacity", 0.4);
          lockedPoint = null;
          document.getElementById("info5").innerText =
            "Hover over a point to view film information. Click a point to lock it and display the LLM justification.";
        }
      });

    // Points
    const points = svg5
      .selectAll("circle")
      .data(df)
      .enter()
      .append("circle")
      .attr("cx", (d) => x5(d.LLM_Note + (Math.random() - 0.5) * jitter))
      .attr("cy", (d) => y5(d.log10_revenue))
      .attr("r", 3)
      .attr("fill", "#7392EB")
      .attr("opacity", 0.4)
      .on("mouseover", function (event, d) {
        if (lockedPoint) return;

        d3.select(this).attr("r", 6).attr("opacity", 1);

        const posterURL = getPosterURL(d);

        document.getElementById("info5").innerHTML = `
          <div class="info-content">
            ${
              posterURL
                ? `<img class="poster"
                        src="${posterURL}"
                        alt="Poster of ${d.title}">`
                : ""
            }
            <div class="info-text">
              <h2>${d.title}</h2>
              <strong>Revenue:</strong>
              ${d.revenue.toLocaleString()} dollars<br>
              <strong>Genres:</strong> ${d.genres}<br>
              Public rating: ${d.audienceScore}/100<br>
              Press rating: ${d.tomatoMeter}/100<br>
              LLM level of comedy: ${d.LLM_Note}
            </div>
          </div>
        `;
      })

      .on("mouseout", function () {
        if (lockedPoint) return;

        d3.select(this).attr("r", 3).attr("opacity", 0.4);
      })
      .on("click", function (event, d) {
        event.stopPropagation();

        if (lockedPoint) {
          lockedPoint.attr("stroke", "none").attr("r", 3).attr("opacity", 0.4);
        }

        lockedPoint = d3.select(this);

        lockedPoint
          .attr("stroke", "black")
          .attr("stroke-width", 2)
          .attr("r", 6)
          .attr("opacity", 1);

        d3.select(this).attr("r", 6).attr("opacity", 1);

        const posterURL = getPosterURL(d);

        document.getElementById("info5").innerHTML = `
            <div class="info-content">
              ${
                posterURL
                  ? `<img class="poster"
                          src="${posterURL}"
                          alt="Poster of ${d.title}">`
                  : ""
              }
              <div class="info-text">
                <h2>${d.title}</h2>
                <strong>Revenue:</strong>
                ${d.revenue.toLocaleString()} dollars<br>
                <strong>Genres:</strong> ${d.genres}<br>
                Public rating: ${d.audienceScore}/100<br>
                Press rating: ${d.tomatoMeter}/100<br>
                LLM level of comedy: ${d.LLM_Note}<br>
                <strong>LLM Justification</strong>: ${d.Justification}
              </div>
                
              </div>
            </div>
          `;
      });

    // Régression linéaire
    const xMean = d3.mean(df, (d) => d.LLM_Note);
    const yMean = d3.mean(df, (d) => d.log10_revenue);

    const slope =
      d3.sum(df, (d) => (d.LLM_Note - xMean) * (d.log10_revenue - yMean)) /
      d3.sum(df, (d) => Math.pow(d.LLM_Note - xMean, 2));

    const intercept = yMean - slope * xMean;

    const regressionLine = [
      { x: 0, y: slope * 0 + intercept },
      { x: 10, y: slope * 2 + intercept },
    ];

    svg5
      .append("path")
      .datum(regressionLine)
      .attr("fill", "none")
      .attr("stroke", "red")
      .attr("stroke-width", 3)
      .attr(
        "d",
        d3
          .line()
          .x((d) => x5(d.x))
          .y((d) => y5(d.y)),
      );

    // Titre
    svg5
      .append("text")
      .attr("x", width / 2)
      .attr("y", margin.top / 2)
      .attr("text-anchor", "middle")
      .style("font-size", "28px")
      .text("Revenue vs Comedy level");
  }

  // ================================================
  // ==========  GRAPHIQUE 6 : REGRESSION  ===========
  // =====  Comedy level vs Audience score  ==========
  // ================================================

  if (document.getElementById("chart6")) {
    const svg6 = d3
      .select("#chart6")
      .append("svg")
      .attr("width", width)
      .attr("height", height);

    const jitter = 0.3;
    let lockedPoint = null; // point sélectionné

    // Échelles
    const x6 = d3
      .scaleLinear()
      .domain([-0.5, 10.5])
      .range([margin.left, width - margin.right]);

    const y6 = d3
      .scaleLinear()
      .domain(d3.extent(df, (d) => d.audienceScore))
      .nice()
      .range([height - margin.bottom, margin.top]);

    // Axe Y
    const yAxisFormat = d3.axisLeft(y6).ticks(5);
    // Axes
    svg6
      .append("g")
      .attr("transform", `translate(0,${height - margin.bottom})`)
      .call(d3.axisBottom(x6).ticks(3))
      .selectAll("text")
      .style("font-size", "20px");

    svg6
      .append("g")
      .attr("transform", `translate(${margin.left},0)`)
      .call(yAxisFormat)
      .selectAll("text")
      .style("font-size", "20px");

    svg6
      .append("text")
      .attr("x", width / 2)
      .attr("y", height - 15)
      .attr("text-anchor", "middle")
      .style("font-size", "18px")
      .text("Comedy level according to LLM");

    svg6
      .append("text")
      .attr("transform", "rotate(-90)")
      .attr("x", -height / 2)
      .attr("y", 20)
      .attr("text-anchor", "middle")
      .style("font-size", "18px")
      .text("Audience rating (1 to 100)");

    // Groupe pour capter les clics "dans le vide"
    svg6
      .append("rect")
      .attr("x", margin.left)
      .attr("y", margin.top)
      .attr("width", width - margin.left - margin.right)
      .attr("height", height - margin.top - margin.bottom)
      .attr("fill", "transparent")
      .lower()
      .on("click", () => {
        if (lockedPoint) {
          lockedPoint.attr("stroke", "none").attr("r", 3).attr("opacity", 0.4);
          lockedPoint = null;
          document.getElementById("info6").innerText =
            "Hover over a point to view film information. Click a point to lock it and display the LLM justification.";
        }
      });

    // Points
    const points = svg6
      .selectAll("circle")
      .data(df)
      .enter()
      .append("circle")
      .attr("cx", (d) => x6(d.LLM_Note + (Math.random() - 0.5) * jitter))
      .attr("cy", (d) => y6(d.audienceScore))
      .attr("r", 3)
      .attr("fill", "#FFE000")
      .attr("opacity", 0.4)
      .on("mouseover", function (event, d) {
        if (lockedPoint) return;

        d3.select(this).attr("r", 6).attr("opacity", 1);

        const posterURL = getPosterURL(d);

        document.getElementById("info6").innerHTML = `
          <div class="info-content">
            ${
              posterURL
                ? `<img class="poster"
                        src="${posterURL}"
                        alt="Poster of ${d.title}">`
                : ""
            }
            <div class="info-text">
              <h2>${d.title}</h2>
              Revenue:
              ${d.revenue.toLocaleString()} dollars<br>
              <strong>Genres:</strong> ${d.genres}<br>
              <strong>Public rating:</strong> ${d.audienceScore}/100<br>
              Press rating: ${d.tomatoMeter}/100<br>
              LLM level of comedy: ${d.LLM_Note}
              
            </div>
          </div>
        `;
      })

      .on("mouseout", function () {
        if (lockedPoint) return;

        d3.select(this).attr("r", 3).attr("opacity", 0.4);
      })
      .on("click", function (event, d) {
        event.stopPropagation();

        if (lockedPoint) {
          lockedPoint.attr("stroke", "none").attr("r", 3).attr("opacity", 0.4);
        }

        lockedPoint = d3.select(this);

        lockedPoint
          .attr("stroke", "black")
          .attr("stroke-width", 2)
          .attr("r", 6)
          .attr("opacity", 1);

        d3.select(this).attr("r", 6).attr("opacity", 1);

        const posterURL = getPosterURL(d);

        document.getElementById("info6").innerHTML = `
            <div class="info-content">
              ${
                posterURL
                  ? `<img class="poster"
                          src="${posterURL}"
                          alt="Poster of ${d.title}">`
                  : ""
              }
              <div class="info-text">
                <h2>${d.title}</h2>
                Revenue:
                ${d.revenue.toLocaleString()} dollars<br>
                <strong>Genres:</strong> ${d.genres}<br>
                <strong>Public rating:</strong> ${d.audienceScore}/100<br>
                Press rating: ${d.tomatoMeter}/100
                LLM level of comedy: ${d.LLM_Note}<br>
                <strong>LLM Justification</strong>: ${d.Justification}
              </div>
            </div>
          `;
      });

    // Régression linéaire
    const xMean = d3.mean(df, (d) => d.LLM_Note);
    const yMean = d3.mean(df, (d) => d.audienceScore);

    const slope =
      d3.sum(df, (d) => (d.LLM_Note - xMean) * (d.audienceScore - yMean)) /
      d3.sum(df, (d) => Math.pow(d.LLM_Note - xMean, 2));

    const intercept = yMean - slope * xMean;

    const regressionLine = [
      { x: 0, y: slope * 0 + intercept },
      { x: 10, y: slope * 2 + intercept },
    ];

    svg6
      .append("path")
      .datum(regressionLine)
      .attr("fill", "none")
      .attr("stroke", "red")
      .attr("stroke-width", 3)
      .attr(
        "d",
        d3
          .line()
          .x((d) => x6(d.x))
          .y((d) => y6(d.y)),
      );

    // Titre
    svg6
      .append("text")
      .attr("x", width / 2)
      .attr("y", margin.top / 2)
      .attr("text-anchor", "middle")
      .style("font-size", "28px")
      .text("Audience rating vs Comedy level");
  }

  // ================================================
  // ==========  GRAPHIQUE 7 : REGRESSION  ===========
  // =====  Comedy level vs Press score  ==========
  // ================================================

  if (document.getElementById("chart7")) {
    const svg7 = d3
      .select("#chart7")
      .append("svg")
      .attr("width", width)
      .attr("height", height);

    const jitter = 0.3;
    let lockedPoint = null; // point sélectionné

    // Échelles
    const x7 = d3
      .scaleLinear()
      .domain([-0.5, 10.5])
      .range([margin.left, width - margin.right]);

    const y7 = d3
      .scaleLinear()
      .domain(d3.extent(df, (d) => d.tomatoMeter))
      .nice()
      .range([height - margin.bottom, margin.top]);

    // Axe Y
    const yAxisFormat = d3.axisLeft(y7).ticks(5);
    // Axes
    svg7
      .append("g")
      .attr("transform", `translate(0,${height - margin.bottom})`)
      .call(d3.axisBottom(x7).ticks(3))
      .selectAll("text")
      .style("font-size", "20px");

    svg7
      .append("g")
      .attr("transform", `translate(${margin.left},0)`)
      .call(yAxisFormat)
      .selectAll("text")
      .style("font-size", "20px");

    svg7
      .append("text")
      .attr("x", width / 2)
      .attr("y", height - 15)
      .attr("text-anchor", "middle")
      .style("font-size", "18px")
      .text("Comedy level according to LLM");

    svg7
      .append("text")
      .attr("transform", "rotate(-90)")
      .attr("x", -height / 2)
      .attr("y", 20)
      .attr("text-anchor", "middle")
      .style("font-size", "18px")
      .text("Press rating (1 to 100)");

    // Groupe pour capter les clics "dans le vide"
    svg7
      .append("rect")
      .attr("x", margin.left)
      .attr("y", margin.top)
      .attr("width", width - margin.left - margin.right)
      .attr("height", height - margin.top - margin.bottom)
      .attr("fill", "transparent")
      .lower()
      .on("click", () => {
        if (lockedPoint) {
          lockedPoint.attr("stroke", "none").attr("r", 3).attr("opacity", 0.4);
          lockedPoint = null;
          document.getElementById("info7").innerText =
            "Hover over a point to view film information. Click a point to lock it and display the LLM justification.";
        }
      });

    // Points
    const points = svg7
      .selectAll("circle")
      .data(df)
      .enter()
      .append("circle")
      .attr("cx", (d) => x7(d.LLM_Note + (Math.random() - 0.5) * jitter))
      .attr("cy", (d) => y7(d.tomatoMeter))
      .attr("r", 3)
      .attr("fill", "#B02046")
      .attr("opacity", 0.4)
      .on("mouseover", function (event, d) {
        if (lockedPoint) return;

        d3.select(this).attr("r", 6).attr("opacity", 1);

        const posterURL = getPosterURL(d);

        document.getElementById("info7").innerHTML = `
          <div class="info-content">
            ${
              posterURL
                ? `<img class="poster"
                        src="${posterURL}"
                        alt="Poster of ${d.title}">`
                : ""
            }
            <div class="info-text">
              <h2>${d.title}</h2>
              Revenue:
              ${d.revenue.toLocaleString()} dollars<br>
              <strong>Genres:</strong> ${d.genres}<br>
              Public rating: ${d.audienceScore}/100<br>
              <strong>Press rating:</strong> ${d.tomatoMeter}/100<br>
              LLM level of comedy: ${d.LLM_Note}
            
            </div>
          </div>
        `;
      })

      .on("mouseout", function () {
        if (lockedPoint) return;

        d3.select(this).attr("r", 3).attr("opacity", 0.4);
      })
      .on("click", function (event, d) {
        event.stopPropagation();

        if (lockedPoint) {
          lockedPoint.attr("stroke", "none").attr("r", 3).attr("opacity", 0.4);
        }

        lockedPoint = d3.select(this);

        lockedPoint
          .attr("stroke", "black")
          .attr("stroke-width", 2)
          .attr("r", 6)
          .attr("opacity", 1);

        d3.select(this).attr("r", 6).attr("opacity", 1);

        const posterURL = getPosterURL(d);

        document.getElementById("info7").innerHTML = `
            <div class="info-content">
              ${
                posterURL
                  ? `<img class="poster"
                          src="${posterURL}"
                          alt="Poster of ${d.title}">`
                  : ""
              }
              <div class="info-text">
                <h2>${d.title}</h2>
                Revenue:
                ${d.revenue.toLocaleString()} dollars<br>
                <strong>Genres:</strong> ${d.genres}<br>
                Public rating: ${d.audienceScore}/100<br>
                <strong>Press rating:</strong> ${d.tomatoMeter}/100
                LLM level of comedy: ${d.LLM_Note}<br>
                <strong>LLM Justification</strong>: ${d.Justification}
              </div>
            </div>
          `;
      });

    // Régression linéaire
    const xMean = d3.mean(df, (d) => d.LLM_Note);
    const yMean = d3.mean(df, (d) => d.audienceScore);

    const slope =
      d3.sum(df, (d) => (d.LLM_Note - xMean) * (d.audienceScore - yMean)) /
      d3.sum(df, (d) => Math.pow(d.LLM_Note - xMean, 2));

    const intercept = yMean - slope * xMean;

    const regressionLine = [
      { x: 0, y: slope * 0 + intercept },
      { x: 10, y: slope * 2 + intercept },
    ];

    svg7
      .append("path")
      .datum(regressionLine)
      .attr("fill", "none")
      .attr("stroke", "red")
      .attr("stroke-width", 3)
      .attr(
        "d",
        d3
          .line()
          .x((d) => x7(d.x))
          .y((d) => y7(d.y)),
      );

    // Titre
    svg7
      .append("text")
      .attr("x", width / 2)
      .attr("y", margin.top / 2)
      .attr("text-anchor", "middle")
      .style("font-size", "28px")
      .text("Press rating vs Comedy level");
  }
});
