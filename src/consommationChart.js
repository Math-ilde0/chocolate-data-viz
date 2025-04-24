

export function drawConsommationChart(containerId, csvPath) {
  console.log("Drawing chart for", containerId, "with data from", csvPath);
  
  const container = document.querySelector(containerId);
  if (!container) {
    console.error(`Container ${containerId} not found!`);
    return;
  }
  console.log("Container found:", container);

  const width = 1000;
const height = 550;
const margin = { top: 70, right: 0, bottom: 50, left: 60 };



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
  .attr("patternUnits", "userSpaceOnUse") // ← important pour PNG
  .attr("width", 40)
  .attr("height", 40)
  .append("image")
  .attr("xlink:href", "public/assets/brun.png")
  .attr("width", 40) // ← taille réelle
  .attr("height", 40)
  .attr("x", 0)
  .attr("y", 0);

  svg.append("defs")
  .append("pattern")
  .attr("id", "chocolateBlondPattern")
  .attr("patternUnits", "userSpaceOnUse")
  .attr("width", 40)
  .attr("height", 40)
  .append("image")
  .attr("xlink:href", "public/assets/blond.png")
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
  .padding(0.2); // léger espace entre groupes

const x1 = d3.scaleBand()
  .domain(["suisse", "export"])
  .range([0, x0.bandwidth()])
  .padding(0.1); // 👈 aucun espace entre suisse/export

  
    
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

      const barsGroup = svg.append("g");

      barsGroup
        .selectAll("g")
        .data(filtered)
        .join("g")
        .attr("transform", d => `translate(${x0(d.year)},0)`)
        .selectAll("g")
        .data(d => [
          { key: "suisse", value: d.suisse },
          { key: "export", value: d.export }
        ])
        .join("g")
        .each(function (d) {
          const group = d3.select(this);
          const isSuisse = d.key === "suisse";
        
          // Couleur de fond (plus foncée pour bien contraster)
          group.append("rect")
            .attr("x", x1(d.key))
            .attr("y", y(d.value))
            .attr("width", x1.bandwidth())
            .attr("height", y(0) - y(d.value))
            .attr("fill", isSuisse ? "#b88d5b" : "#5C3D2E"); // fond plus clair pour blond
        
          // Motif par-dessus
          group.append("rect")
            .attr("x", x1(d.key))
            .attr("y", y(d.value))
            .attr("width", x1.bandwidth())
            .attr("height", y(0) - y(d.value))
            .attr("fill", isSuisse ? "url(#chocolateBlondPattern)" : "url(#chocolatePattern)");
        });
        

    // Titre
svg.append("text")
.attr("x", width / 2)
.attr("y", margin.top / 2)
.attr("text-anchor", "middle")
.style("font-size", "18px")
.style("font-weight", "bold")
.text("Comparaison des ventes de chocolat : Suisse vs Exportation");

// ✅ LÉGENDE
const legendData = [
{ label: "Suisse", pattern: "url(#chocolateBlondPattern)" },
{ label: "Exportation", pattern: "url(#chocolatePattern)" }
];

const legend = svg.append("g")
.attr("transform", `translate(${width / 2 - 100}, ${margin.top + 1})`); // ← espace sous le titre

legend.selectAll("rect")
.data(legendData)
.enter()
.append("rect")
.attr("x", (d, i) => i * 140)
.attr("y", 0)
.attr("width", 20)
.attr("height", 20)
.attr("fill", d => d.pattern);

legend.selectAll("text")
.data(legendData)
.enter()
.append("text")
.attr("x", (d, i) => i * 140 + 30)
.attr("y", 25)
.text(d => d.label)
.attr("alignment-baseline", "middle")
.style("font-size", "14px")
.style("fill", "#333");

  
});
}
