/**
 * Module de création des visualisations avec D3.js
 */

// Classe pour la ligne du temps (histoire du chocolat)
class TimelineChart {
    constructor(selector, data) {
        this.selector = selector;
        this.data = data;
        this.init();
    }

    init() {
        const width = 800, height = 400;
        this.svg = d3.select(this.selector)
            .append("svg")
            .attr("width", width)
            .attr("height", height);

        const xScale = d3.scaleLinear()
            .domain(d3.extent(this.data, d => d.annee))
            .range([50, width - 50]);

        this.svg.selectAll("circle")
            .data(this.data)
            .enter()
            .append("circle")
            .attr("cx", d => xScale(d.annee))
            .attr("cy", height / 2)
            .attr("r", 8)
            .attr("fill", "brown")
            .on("mouseover", function (event, d) {
                d3.select(this).attr("r", 12);
            })
            .on("mouseout", function (event, d) {
                d3.select(this).attr("r", 8);
            });

        this.svg.selectAll("text")
            .data(this.data)
            .enter()
            .append("text")
            .attr("x", d => xScale(d.annee))
            .attr("y", height / 2 - 20)
            .attr("text-anchor", "middle")
            .text(d => d.annee)
            .style("font-size", "12px");
    }

    update() {
        console.log("Mise à jour du graphique Timeline");
    }
}

// Classe pour la carte mondiale de la récolte du cacao
class WorldMapChart {
    constructor(selector) {
        this.selector = selector;
        this.init();
    }

    async init() {
        const width = 800, height = 500;
        this.svg = d3.select(this.selector)
            .append("svg")
            .attr("width", width)
            .attr("height", height);

        const projection = d3.geoNaturalEarth1()
            .scale(200)
            .translate([width / 2, height / 2]);

        const path = d3.geoPath().projection(projection);

        const world = await d3.json("data/world-geojson.json");

        this.svg.selectAll("path")
            .data(world.features)
            .enter()
            .append("path")
            .attr("d", path)
            .attr("fill", "#ddd")
            .attr("stroke", "#333");
    }

    update() {
        console.log("Mise à jour de la carte mondiale");
    }
}

// Classe pour le graphique linéaire (évolution de la production)
class LineChart {
    constructor(selector) {
        this.selector = selector;
        this.init();
    }

    init() {
        const width = 800, height = 400;
        this.svg = d3.select(this.selector)
            .append("svg")
            .attr("width", width)
            .attr("height", height);

        this.xScale = d3.scaleLinear().range([50, width - 50]);
        this.yScale = d3.scaleLinear().range([height - 50, 50]);

        this.line = d3.line()
            .x(d => this.xScale(d.annee))
            .y(d => this.yScale(d.production))
            .curve(d3.curveMonotoneX);
    }

    update(data) {
        this.xScale.domain(d3.extent(data, d => d.annee));
        this.yScale.domain([0, d3.max(data, d => d.production)]);

        this.svg.append("path")
            .datum(data)
            .attr("d", this.line)
            .attr("fill", "none")
            .attr("stroke", "brown")
            .attr("stroke-width", 2);
    }
}

// Classe pour le graphique à barres (consommation de chocolat)
class BarChart {
    constructor(selector, data, title, xLabel, yLabel) {
        this.selector = selector;
        this.data = data;
        this.title = title;
        this.xLabel = xLabel;
        this.yLabel = yLabel;
        this.init();
    }

    init() {
        const width = 800, height = 400;
        this.svg = d3.select(this.selector)
            .append("svg")
            .attr("width", width)
            .attr("height", height);

        this.xScale = d3.scaleBand().range([50, width - 50]).padding(0.4);
        this.yScale = d3.scaleLinear().range([height - 50, 50]);
    }

    update() {
        this.xScale.domain(this.data.map(d => d[this.xLabel]));
        this.yScale.domain([0, d3.max(this.data, d => d[this.yLabel])]);

        this.svg.selectAll("rect")
            .data(this.data)
            .enter()
            .append("rect")
            .attr("x", d => this.xScale(d[this.xLabel]))
            .attr("y", d => this.yScale(d[this.yLabel]))
            .attr("width", this.xScale.bandwidth())
            .attr("height", d => 350 - this.yScale(d[this.yLabel]))
            .attr("fill", "#b85c38")
            .on("mouseover", function (event, d) {
                d3.select(this).attr("fill", "#e0a458");
            })
            .on("mouseout", function (event, d) {
                d3.select(this).attr("fill", "#b85c38");
            });
    }
}

// Classe pour le graphique en anneau (marché du chocolat)
class DonutChart {
    constructor(selector) {
        this.selector = selector;
        this.init();
    }

    init() {
        const width = 400, height = 400;
        this.radius = Math.min(width, height) / 2;

        this.svg = d3.select(this.selector)
            .append("svg")
            .attr("width", width)
            .attr("height", height)
            .append("g")
            .attr("transform", `translate(${width / 2}, ${height / 2})`);

        this.pie = d3.pie().value(d => d.value);
        this.arc = d3.arc().innerRadius(this.radius * 0.6).outerRadius(this.radius);
    }

    update(data) {
        const color = d3.scaleOrdinal(d3.schemeCategory10);

        this.svg.selectAll("path")
            .data(this.pie(data))
            .enter()
            .append("path")
            .attr("d", this.arc)
            .attr("fill", (d, i) => color(i))
            .on("mouseover", function (event, d) {
                d3.select(this).attr("opacity", 0.8);
            })
            .on("mouseout", function (event, d) {
                d3.select(this).attr("opacity", 1);
            });
    }
}

// Classe pour le graphique des fabricants (bulle chart)
class BubbleChart {
    constructor(selector, data) {
        this.selector = selector;
        this.data = data;
        this.init();
    }

    init() {
        const width = 600, height = 400;
        this.svg = d3.select(this.selector)
            .append("svg")
            .attr("width", width)
            .attr("height", height);

        this.scale = d3.scaleSqrt().domain([0, d3.max(this.data, d => d.productionTonnes)]).range([10, 50]);
    }

    update() {
        this.svg.selectAll("circle")
            .data(this.data)
            .enter()
            .append("circle")
            .attr("cx", (d, i) => (i + 1) * 100)
            .attr("cy", 200)
            .attr("r", d => this.scale(d.productionTonnes))
            .attr("fill", "brown")
            .attr("opacity", 0.7);
    }
}

// Exporter les classes
export { TimelineChart, WorldMapChart, LineChart, BarChart, DonutChart, BubbleChart };
