
const GEO_JSON_PATH = "public/data/globeCoordinates.json";
const DATA_CSV_PATH = "public/data/production_cacao_mondiale_2023_2024.csv";
const CONSUMPTION_CSV_PATH = "public/data/chocolate_consumption.csv";
const FLAG_PATH = "/assets/flags/";

const COLOR_RANGE = ["#ffe6cc", "#61391b"];
const VIOLET_RANGE = ["#f3e5f5", "#6a1b9a"];
const COLOR_NO_DATA = "#f5f5f5";
const COLOR_HOVER = "#D3D3D3";
const ROTATION_SENSITIVITY = 60;
const ZOOM_SENSITIVITY = 0.5;

export async function drawGlobe(containerId) {
    const GLOBE_CONTAINER = d3.select(containerId);
    if (GLOBE_CONTAINER.empty()) {
      console.warn("Container not found:", containerId);
      return;
    }
  
    const GLOBE_WIDTH = GLOBE_CONTAINER.node().getBoundingClientRect().width;
    const GLOBE_HEIGHT = GLOBE_CONTAINER.node().getBoundingClientRect().height;
    const GLOBE_RADIUS = GLOBE_HEIGHT / 2.8; // Agrandi
    const GLOBE_CENTER = [GLOBE_WIDTH / 2, GLOBE_HEIGHT / 2];
  
    const geoJson = await d3.json(GEO_JSON_PATH);
    const productionData = await d3.csv(DATA_CSV_PATH);
    const consumptionData = await d3.csv(CONSUMPTION_CSV_PATH);
  
    const colorScale = d3.scaleLinear()
      .domain([0, 1800000])
      .range(COLOR_RANGE);
  
    const consumptionScale = d3.scaleLinear()
      .domain([0, d3.max(consumptionData, d => +d.consumption_kg)])
      .range(VIOLET_RANGE);
  
    const geoProjection = d3.geoOrthographic()
      .scale(GLOBE_RADIUS)
      .center([0, 0])
      .rotate([0, -25])
      .translate(GLOBE_CENTER);
  
    const pathGenerator = d3.geoPath().projection(geoProjection);
  
    const svg = GLOBE_CONTAINER.append("svg")
      .attr("width", GLOBE_WIDTH)
      .attr("height", GLOBE_HEIGHT);
  
    svg.append("circle")
      .attr("cx", GLOBE_CENTER[0])
      .attr("cy", GLOBE_CENTER[1])
      .attr("r", GLOBE_RADIUS)
      .attr("fill", "#cce6f2");
  
    const tooltip = d3.select("body").append("div")
    .attr("class", "globe-tooltip")
      .style("position", "absolute")
      .style("background", "#fff")
      .style("padding", "10px")
      .style("border", "1px solid #ccc")
      .style("border-radius", "5px")
      .style("pointer-events", "none")
      .style("display", "none")
      .style("box-shadow", "0 4px 8px rgba(0,0,0,0.1)");
  
    svg.append("g")
      .selectAll("path")
      .data(geoJson.features)
      .enter()
      .append("path")
      .attr("d", pathGenerator)
      .attr("fill", d => {
        const prod = productionData.find(p => p.alpha3_code === d.id);
        const cons = consumptionData.find(c => c.alpha3_code === d.id);
        if (prod) return colorScale(+prod.production);
        if (cons) return consumptionScale(+cons.consumption_kg);
        return COLOR_NO_DATA;
      })
      .attr("stroke", "#bbb")
      .attr("stroke-width", 0.4)
      .on("mousemove", function (event, d) {
        const prod = productionData.find(p => p.alpha3_code === d.id);
        const cons = consumptionData.find(c => c.alpha3_code === d.id);
      
        const flagCode = d.id.toUpperCase(); // ou .toLowerCase() selon nommage fichier
        let content = `
          <div style="display:flex; align-items:center; gap:8px;">
            <img src="${FLAG_PATH}${flagCode}.png" alt="flag" style="width:30px; height:auto; border:1px solid #ccc;" />
            <strong>${d.properties.name}</strong>
          </div>
        `;
      
        if (prod) content += `<div><strong>Production :</strong> ${prod.production} tonnes</div>`;
        if (cons) content += `<div><strong>Consommation :</strong> ${cons.consumption_kg} kg/personne</div>`;
      
        tooltip
          .html(content)
          .style("left", `${event.pageX + 10}px`)
          .style("top", `${event.pageY - 20}px`)
          .style("display", "block");
      })
      
      
      
      .on("mouseout", function (event, d) {
        const prod = productionData.find(p => p.alpha3_code === d.id);
        const cons = consumptionData.find(c => c.alpha3_code === d.id);
        if (prod) d3.select(this).attr("fill", colorScale(+prod.production));
        else if (cons) d3.select(this).attr("fill", consumptionScale(+cons.consumption_kg));
        else d3.select(this).attr("fill", COLOR_NO_DATA);
        tooltip.style("display", "none");
      });
  
    // Drag pour faire tourner le globe
    svg.call(
        d3.drag()
          .on("start", () => {
            autoRotateActive = false;
          })
          .on("drag", (event) => {
            const rotate = geoProjection.rotate();
            const k = ROTATION_SENSITIVITY / geoProjection.scale();
            geoProjection.rotate([
              rotate[0] + event.dx * k,
              rotate[1] - event.dy * k,
            ]);
            svg.selectAll("path").attr("d", pathGenerator);
            lastInteraction = Date.now(); // on remet à zéro l’inactivité
          })
          .on("end", () => {
            setTimeout(() => {
              autoRotateActive = true;
            }, 1000); // relance l'auto après 3s d'inactivité
          })
      );
      
  // Rotation automatique
let autoRotateActive = true;
let lastInteraction = Date.now();

const velocity = 0.07; // plus petit = plus lent

d3.timer(() => {
  if (autoRotateActive && Date.now() - lastInteraction > 3000) {
    const currentRotation = geoProjection.rotate();
    geoProjection.rotate([currentRotation[0] + velocity, currentRotation[1]]);
    svg.selectAll("path").attr("d", pathGenerator);
  }
});

    // Zoom
    configureZoom(svg, GLOBE_RADIUS, geoProjection);
  
    // Légendes
    drawLegend(svg, colorScale);
    drawConsumptionLegend(consumptionScale);
  }
  


function createColorPalette() {
    return d3.scaleLinear()
        .domain([0, 1800000])
        .range(COLOR_RANGE);
}

function createVioletPalette(data) {
    const [, max] = d3.extent(data, d => +d.consumption_kg);
    return d3.scaleLinear().domain([0, max]).range(VIOLET_RANGE);
}

function updateTooltipContent(country) {
    d3.select("#tooltip-country-name").text(country.name);
    d3.select("#tooltip-flag").attr("src", `/assets/flags/${country.code}.png`);

    if (country.production) {
        d3.select("#tooltip-production").style("display", "block");
        d3.select("#tooltip-population").text(`${country.production} tonnes`);
    } else {
        d3.select("#tooltip-production").style("display", "none");
    }

    if (country.consumption) {
        d3.select("#tooltip-consumption").style("display", "block");
        d3.select("#tooltip-density").text(`${country.consumption} kg/personne`);
    } else {
        d3.select("#tooltip-consumption").style("display", "none");
    }
}




function createDrag(projection, svg, pathGen) {
    return d3.drag()
        .on("start", () => rotationTimer.stop())
        .on("drag", () => {
            const rotate = projection.rotate();
            const k = ROTATION_SENSITIVITY / projection.scale();
            projection.rotate([rotate[0] + d3.event.dx * k, rotate[1] - d3.event.dy * k]);
            svg.selectAll("path").attr("d", pathGen);
        })
        .on("end", () => rotateGlobe(projection, svg, pathGen));
}

function drawLegend(svg, colorPalette) {
    const colorScale = d3.select("#color-scale");
    const legendWidth = 400;

    const legendHeight = 50;

    colorScale.selectAll("svg").remove();

    const xScale = d3.scaleLinear().range([0, legendWidth]);
    xScale.domain([0, 1800000]);

    const legendSvg = colorScale
        .append("svg")
        .attr("width", legendWidth)
        .attr("height", legendHeight);

    const gradientId = "prod-gradient";
    const defs = legendSvg.append("defs");
    const gradient = defs.append("linearGradient")
        .attr("id", gradientId)
        .attr("x1", "0%").attr("y1", "0%")
        .attr("x2", "100%").attr("y2", "0%");
    gradient.append("stop").attr("offset", "0%").attr("stop-color", COLOR_RANGE[0]);
    gradient.append("stop").attr("offset", "100%").attr("stop-color", COLOR_RANGE[1]);

    // Rectangle coloré
    legendSvg.append("rect")
        .attr("x", 0)
        .attr("y", 0)
        .attr("width", legendWidth)
        .attr("height", 20)
        .style("fill", `url(#${gradientId})`);

    // Texte dans la bande colorée
    legendSvg.append("text")
        .attr("x", legendWidth / 2)
        .attr("y", 14)
        .attr("text-anchor", "middle")
        .style("font-size", "12px")
        .style("fill", "#333")
        .text("Cacao production in tonnes");

    // Axe
    const axis = d3.axisBottom(xScale)
    .tickValues([0, 500000, 1000000, 1500000, 2000000])
    .tickFormat(d => d === 0 ? "0" : d3.format(".1s")(d))
    .tickSizeOuter(0); // << évite le dépassement du dernier tick
  




    legendSvg.append("g")
        .attr("transform", "translate(0, 20)")
        .call(axis);
}


function drawConsumptionLegend(violetPalette) {
    const scaleContainer = d3.select("#consumption-scale");
    const legendWidth = 420;
    const legendHeight = 50;

    scaleContainer.selectAll("svg").remove();

    const xScale = d3.scaleLinear().range([0, legendWidth]);
    xScale.domain([0, 9]);

    const legendSvg = scaleContainer
        .append("svg")
        .attr("width", legendWidth)
        .attr("height", legendHeight);

    const gradientId = "violet-gradient";
    const defs = legendSvg.append("defs");
    const gradient = defs.append("linearGradient")
        .attr("id", gradientId)
        .attr("x1", "0%").attr("y1", "0%")
        .attr("x2", "100%").attr("y2", "0%");
    gradient.append("stop").attr("offset", "0%").attr("stop-color", VIOLET_RANGE[0]);
    gradient.append("stop").attr("offset", "100%").attr("stop-color", VIOLET_RANGE[1]);

    legendSvg.append("rect")
        .attr("x", 0)
        .attr("y", 0)
        .attr("width", legendWidth)
        .attr("height", 20)
        .style("fill", `url(#${gradientId})`);

    legendSvg.append("text")
        .attr("x", legendWidth / 2)
        .attr("y", 14)
        .attr("text-anchor", "middle")
        .style("font-size", "12px")
        .style("fill", "#333")
        .text("Consommation de chocolat (kg/personne)");

    const axis = d3.axisBottom(xScale).ticks(6);
    legendSvg.append("g")
        .attr("transform", "translate(0, 20)")
        .call(axis);
}



function configureZoom(svg, initialScale, projection) {
  svg.call(d3.zoom().on("zoom", (event) => {
    const transform = event.transform;

    if (transform.k > ZOOM_SENSITIVITY) {
      projection.scale(initialScale * transform.k);
      const path = d3.geoPath().projection(projection);
      svg.selectAll("path").attr("d", path);
      svg.selectAll("circle").attr("r", projection.scale());
    } else {
      transform.k = ZOOM_SENSITIVITY;
    }
  }));
}


function resizeGlobe(projection, svg, pathGen) {
    GLOBE_WIDTH = GLOBE_CONTAINER.node().getBoundingClientRect().width;
    GLOBE_HEIGHT = GLOBE_CONTAINER.node().getBoundingClientRect().height;
    GLOBE_CENTER = [GLOBE_WIDTH / 2, GLOBE_HEIGHT / 2];
    projection.scale(GLOBE_RADIUS).translate(GLOBE_CENTER);
    svg.attr("width", GLOBE_WIDTH).attr("height", GLOBE_HEIGHT);
    svg.selectAll("path").attr("d", pathGen);
    svg.select("#globe")
        .attr("cx", GLOBE_WIDTH / 2)
        .attr("cy", GLOBE_HEIGHT / 2)
        .attr("r", projection.scale());
}

