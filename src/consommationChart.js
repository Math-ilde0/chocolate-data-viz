import * as d3 from "d3";

export function drawConsommationChart(containerId, csvPath) {
  console.log("Drawing chart for", containerId, "with data from", csvPath);
  
  const container = document.querySelector(containerId);
  if (!container) {
    console.error(`Container ${containerId} not found!`);
    return;
  }
  console.log("Container found:", container);

  const width = 800;
  const height = 500;
  const margin = { top: 40, right: 20, bottom: 50, left: 60 };

  d3.select(containerId).html("");

  const svg = d3.select(containerId)
    .append("svg")
    .attr("viewBox", [0, 0, width, height])
    .attr("width", "100%")
    .attr("height", "auto");

  // Définition du motif tablette de chocolat sans fond beige et sans espace
  svg.append("defs")
    .append("pattern")
    .attr("id", "chocolatePattern")
    .attr("patternUnits", "userSpaceOnUse") // taille absolue
    .attr("width", 40)
    .attr("height", 40)
    .append("image")
    .attr("xlink:href", "/assets/chocolate-icon.svg")
    .attr("width", 40)
    .attr("height", 40)
    .attr("x", 0)
    .attr("y", 0);

  const loadingText = svg.append("text")
    .attr("x", width / 2)
    .attr("y", height / 2)
    .attr("text-anchor", "middle")
    .style("font-size", "16px")
    .text("Chargement des données...");

  d3.csv(csvPath, d3.autoType).then(data => {
    loadingText.remove();
    console.log("Raw data structure:", data);

    const filtered = data.map(d => ({
      year: d["Année"],
      suisse: d["Ventes en Suisse (t)"],
      export: d["Exportations (t)"]
    }));

    console.log("Processed data:", filtered);

    const x0 = d3.scaleBand()
      .domain(filtered.map(d => d.year))
      .range([margin.left, width - margin.right])
      .padding(0.1); // légère séparation entre groupes

    const x1 = d3.scaleBand()
      .domain(["suisse", "export"])
      .range([0, x0.bandwidth()])
      .padding(0); // ❗️ aucun espace entre les barres empilées

    const y = d3.scaleLinear()
      .domain([0, d3.max(filtered, d => Math.max(d.suisse, d.export))])
      .nice()
      .range([height - margin.bottom, margin.top]);

    // Axes
    svg.append("g")
      .attr("transform", `translate(0, ${height - margin.bottom})`)
      .call(d3.axisBottom(x0).tickSizeOuter(0));

    svg.append("g")
      .attr("transform", `translate(${margin.left}, 0)`)
      .call(d3.axisLeft(y));

    // Barres empilées avec pattern plein
    svg.append("g")
      .selectAll("g")
      .data(filtered)
      .join("g")
      .attr("transform", d => `translate(${x0(d.year)},0)`)
      .selectAll("rect")
      .data(d => [
        { key: "suisse", value: d.suisse },
        { key: "export", value: d.export }
      ])
      .join("rect")
      .attr("x", d => x1(d.key))
      .attr("y", d => y(d.value))
      .attr("width", x1.bandwidth())
      .attr("height", d => y(0) - y(d.value))
      .attr("fill", "url(#chocolatePattern)");

    // Titre
    svg.append("text")
      .attr("x", width / 2)
      .attr("y", margin.top / 2)
      .attr("text-anchor", "middle")
      .style("font-size", "18px")
      .style("font-weight", "bold")
      .text("Comparaison des ventes de chocolat : Suisse vs Exportation");
  })
  .catch(error => {
    console.error("Error loading CSV:", error);
    loadingText.remove();

    svg.append("text")
      .attr("x", width / 2)
      .attr("y", height / 2)
      .attr("text-anchor", "middle")
      .style("font-size", "16px")
      .attr("fill", "red")
      .text(`Erreur de chargement des données: ${error.message}`);
  });
}
