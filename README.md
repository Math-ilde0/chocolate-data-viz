# chocolate-data-viz

## Description du projet

Ce projet universitaire vise à visualiser l’histoire du chocolat, son importation en Suisse et son évolution au fil du temps. Nous combinons des données historiques et économiques avec un jeu de données que nous avons créé afin d’apporter une perspective unique à notre analyse.

L’implémentation repose sur **D3.js** pour générer des visualisations interactives.

## Données utilisées

Les données proviennent de plusieurs sources externes ainsi que de nos propres recherches et analyses. Elles couvrent différents aspects du chocolat :

1. Histoire et Origine du Chocolat
   
📌 "Histoire et découverte cacao par Christophe Colomb"

🔗 [https://maxdaumin.com/blog/le-grimoire/histoire-du-cacao](https://maxdaumin.com/blog/le-grimoire/histoire-du-cacao)

📊 Type de données : Qualitative nominale

📌 L'origine du chocolat en Suisse ?

🔗 [https://www.portail-du-chocolat.ch/guides/histoire-chocolat-suisse?utm_source=chatgpt.com](https://www.portail-du-chocolat.ch/guides/histoire-chocolat-suisse)

📊 Type de données : Qualitative nominale

📌 Histoire de la marque Cailler

🔗 https://fr.wikipedia.org/wiki/Chocolat_Cailler 

📊 Type de données : Quantitative discrète


2. Pionniers et Innovations de l'Industrie Chocolatière Suisse
   
📌 "Quels ont été les pionniers de l'industrie chocolatière suisse et quelles innovations ont-ils apportées ?"

🔗 [https://www.chocosuisse.ch/fr/services/faits-chiffres](https://www.chocosuisse.ch/fr/services/faits-chiffres) 

📌 Daniel Peter et l'invention du chocolat au lait

🔗 [https://fr.wikipedia.org/wiki/Daniel_Peter](https://fr.wikipedia.org/wiki/Daniel_Peter) 

📊 Type de données : Qualitative nominale


3. Consommation de Chocolat en Suisse et dans le monde 
   
📌 Consommation de chocolat en Suisse et dans le monde : tendances et évolution

🔗 [https://www.chocosuisse.ch/fr/services/faits-chiffres](https://www.chocosuisse.ch/fr/services/faits-chiffres) 

📊 Type de données : Quantitative continue


4. Marché et Économie du Chocolat Suisse
   
📌 "Quelle est la part du chocolat suisse dans le marché intérieur et comment se répartissent les ventes entre la Suisse et l'étranger ?"

🔗 https://www.chocosuisse.ch/fr/services/faits-chiffres

📊 Type de données : Quantitative continue et discrète


📌 Origine, innovations et production du chocolat suisse

🔗 [https://www.eda.admin.ch/](https://www.aboutswitzerland.eda.admin.ch/fr/chocolat) 

📊 Type de données : Qualitative nominale et quantitative continue


5. Musées du Chocolat en Suisse
   
📌 Fréquentation du Lindt Home of Chocolate en 2023

🔗 [https://www.lindt-home-of-chocolate.com/fr/actualites-et-newsletter/le-lindt-home-of-chocolate-celebre-une-annee-record-avec-plus-de-750-000-visiteurs/ ](https://www.lindt-home-of-chocolate.com/fr/actualites-et-newsletter/le-lindt-home-of-chocolate-celebre-une-annee-record-avec-plus-de-750-000-visiteurs/#:~:text=En%202023%2C%20la%20Lindt%20Chocolate,sa%20troisième%20année%20d'existence.) 

📊 Type de données : Quantitative discrète

📌 Fréquentation de la Maison Cailler en 2023

🔗[ [https://www.lindt-home-of-chocolate.com/fr/actualites-et-newsletter/le-lindt-home-of-chocolate-celebre-une-annee-record-avec-plus-de-750-000-visiteurs/ ](https://www.lindt-home-of-chocolate.com/fr/actualites-et-newsletter/le-lindt-home-of-chocolate-celebre-une-annee-record-avec-plus-de-750-000-visiteurs/) ](https://www.swissinfo.ch/fre/la-maison-cailler-fête-ses-15-ans-après-un-record-de-fréquentation/88834812#:~:text=A%20partir%20de%20mai%2C%20un,17%25%20au%20regard%20de%202022.)

📊 Type de données : Quantitative discrète

📌 Fréquentation du Centre Visiteurs Camille Bloch en 2023

🔗 https://camillebloch.ch/app/uploads/2024/05/CamilleBloch_FactsFigures_2023_FR4.pdf

📊 Type de données : Quantitative discrète


## Objectifs du projet

- **Analyser** l’évolution du chocolat à travers les siècles  
- **Visualiser** les tendances des importations et exportations  
- **Expliquer** l’impact économique et culturel du chocolat en Suisse  

## Technologies utilisées

- **D3.js** pour la visualisation des données  
- **HTML, CSS, JavaScript** pour l’interface utilisateur  
- **GitHub** pour le versionnement et l’hébergement du code  

## Installation et exécution

### Option 1 : Utilisation du CDN (aucune installation requise)
Ajoutez le lien suivant dans `index.html` :
```html
<script src="https://d3js.org/d3.v7.min.js"></script>
