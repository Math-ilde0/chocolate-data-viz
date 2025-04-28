export function initGenreIndustrie() {

const CSV_PATH = "public/data/genre_industrie.csv";

const ICONS = {
  Femmes : "public/assets/genres/femme.svg",
  Hommes : "public/assets/genres/homme.svg"
};

const MAX_HEIGHT = 260;
const ANIM_DURATION = 1000;

d3.dsv(";", CSV_PATH, d => {
  const r = { Sexe: d.Sexe };
  Object.keys(d).forEach(k => {
    if (k !== "Sexe") r[k] = +d[k].replace(/\s/g, "");
  });
  return r;
}).then(data => {

  const years = ["2000","2010","2020","2024"];
  const chart = d3.select("#chart");
  const groups = [];

  years.forEach(year => {
    const vH = data.find(r => r.Sexe === "Hommes")[year];
    const vF = data.find(r => r.Sexe === "Femmes")[year];
    const total = vH + vF;

    const group = chart.append("div").attr("class", "year-group");
    groups.push(group.node());

    const pair = group.append("div").attr("class", "pair");

    [["Femmes", vF], ["Hommes", vH]].forEach(([sex, val]) => {
      const col = pair.append("div").attr("class", "person-col");

      // First add the image container
      const box = col.append("div").attr("class", "icon-box");
      box.append("img")
          .attr("class", "pic")
          .attr("src", ICONS[sex])
          .attr("alt", sex)
          .style("height", `${(val / total) * MAX_HEIGHT}px`);

      // Then add value & percentage with position absolute
      const statsContainer = col.append("div")
          .attr("class", "stats-container");
      
      statsContainer.append("div")
         .attr("class", "value")
         .attr("data-target", val)
         .text("0");
      statsContainer.append("div")
         .attr("class", "pct")
         .attr("data-target", Math.round(val / total * 100))
         .text("0 %");
    });

    // Labels
    const labelRow = group.append("div").attr("class", "sex-row");
    labelRow.append("div").attr("class", "sex-label").text("Femmes");
    labelRow.append("div").attr("class", "sex-label").text("Hommes");

    group.append("div").attr("class", "year-label").text(year);
  });

  // Animation
  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting && !entry.target.dataset.played) {
        entry.target.dataset.played = "1";
        entry.target.querySelectorAll("[data-target]").forEach(el => {
          animateNumber(el, +el.dataset.target, el.classList.contains("pct"));
        });
      }
    });
  }, { threshold: 0.3 });

  groups.forEach(g => observer.observe(g));

}).catch(console.error);

function animateNumber(el, target, isPct = false) {
  let current = 0;
  const step = Math.ceil(target / (ANIM_DURATION / 30));
  const timer = setInterval(() => {
    current += step;
    if (current >= target) {
      current = target;
      clearInterval(timer);
    }
    el.textContent = isPct ? `${current} %` : d3.format(",")(current);
  }, 30);
}
}