# chocolate-data-viz

## Description du projet

Ce projet universitaire vise à visualiser l’histoire du chocolat, son importation en Suisse et son évolution au fil du temps. Nous combinons des données historiques et économiques avec un jeu de données que nous avons créé afin d’apporter une perspective unique à notre analyse.

L’implémentation repose sur **D3.js** pour générer des visualisations interactives.

## Données utilisées

Les données proviennent de plusieurs sources externes ainsi que de nos propres recherches et analyses. Elles couvrent différents aspects du chocolat :

1. Histoire et Origine du Chocolat
   
📌 "Découverte et commercialisation du chocolat"

🔗 https://maxdaumin.com/blog/le-grimoire/histoire-du-cacao?slug=histoire-du-cacao&module=smartblog#:~:text=D%C3%A9couverte%20et%20commercialisation%20du%20cacao,appr%C3%A9ci%C3%A9%20sa%20valeur%20potentielle%20impressionnante.

📊 Type de données : Qualitative nominale


📌 "Quelle est l'origine du chocolat et comment est-il arrivé en Suisse ?"

🔗 https://www.portail-du-chocolat.ch/guides/histoire-chocolat-suisse?utm_source=chatgpt.com

📊 Type de données : Qualitative nominale


2. Pionniers et Innovations de l'Industrie Chocolatière Suisse
   
📌 "Quels ont été les pionniers de l'industrie chocolatière suisse et quelles innovations ont-ils apportées ?"

🔗 https://www.chocosuisse.ch/fr/services/faits-chiffres

📊 Type de données : Qualitative nominale

🔗 https://fr.wikipedia.org/

📊 Type de données : Qualitative nominale


3. Consommation de Chocolat en Suisse
   
📌 "Quelle est la consommation annuelle de chocolat en Suisse par habitant et comment a-t-elle évolué ces dernières années ?"

🔗 https://www.chocosuisse.ch/fr/services/faits-chiffres

📊 Type de données : Quantitative continue

🔗 https://www.rts.ch

📊 Type de données : Quantitative continue


4. Marché et Économie du Chocolat Suisse
   
📌 "Quelle est la part du chocolat suisse dans le marché intérieur et comment se répartissent les ventes entre la Suisse et l'étranger ?"

🔗 https://www.chocosuisse.ch/fr/services/faits-chiffres

📊 Type de données : Quantitative continue et discrète

📌 "Quels sont les principaux fabricants de chocolat en Suisse et quelles sont leurs contributions à l'industrie chocolatière ?"

🔗 https://www.eda.admin.ch/

📊 Type de données : Qualitative nominale et quantitative continue


5. Musées du Chocolat en Suisse
   
📌 "Quels musées du chocolat peut-on visiter en Suisse et que proposent-ils aux visiteurs ?"

🔗 https://www.chocosuisse.ch/fr/services/faits-chiffres

📊 Type de données : Qualitative nominale


6. Consommation de Chocolat dans le Monde
   
📌 "Consommation de chocolat dans le monde"

🔗 https://www.portail-du-chocolat.ch/guides/chiffres-chocolat-suisse

📊 Type de données : Quantitative continue


7. Visualisation des Données (Data Viz existante)
   
📌 "Chocolate Data Viz (déjà existante)"

🔗 https://datavizblog.com/category/chocolate/

📊 Type de données : Représentation visuelle de données quantitatives

🔗 https://fr.pinterest.com/pin/748019819336345115/

📊 Type de données : Représentation visuelle de données quantitatives


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
