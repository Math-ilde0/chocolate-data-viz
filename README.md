# chocolate-data-viz

## Description du projet

Ce projet universitaire vise à visualiser l’histoire du chocolat, son importation en Suisse et son évolution au fil du temps. Nous combinons des données historiques et économiques avec un jeu de données que nous avons créé afin d’apporter une perspective unique à notre analyse.

L’implémentation repose sur **D3.js** pour générer des visualisations interactives.

## Données utilisées

Les données proviennent de plusieurs sources externes ainsi que de nos propres recherches et analyses. Elles couvrent différents aspects du chocolat :

### 1. Histoire et Origine du Chocolat
- **Découverte et commercialisation du chocolat**  
  🔗 [Histoire du cacao et de sa commercialisation](lien_source)  
  📊 Type : Qualitative nominale  
- **Arrivée du chocolat en Suisse**  
  🔗 [Comment le chocolat est arrivé en Suisse](lien_source)  
  📊 Type : Qualitative nominale  

### 2. Pionniers et Innovations de l’Industrie Chocolatière Suisse
- **Les pionniers de l’industrie chocolatière suisse et leurs innovations**  
  🔗 [Histoire des pionniers – Chocosuisse.ch](lien_source)  
  🔗 [Histoire du chocolat – Wikipédia](lien_source)  
  📊 Type : Qualitative nominale  

### 3. Consommation de Chocolat en Suisse
- **Évolution de la consommation annuelle par habitant**  
  🔗 [Chocosuisse – Données 2023](lien_source)  
  🔗 [RTS – Baisse de la consommation en 2020](lien_source)  
  📊 Type : Quantitative continue  

### 4. Marché et Économie du Chocolat Suisse
- **Répartition des ventes entre la Suisse et l’étranger**  
  🔗 [Chocosuisse – Marché du chocolat suisse](lien_source)  
  📊 Type : Quantitative continue et discrète  
- **Principaux fabricants et leur contribution**  
  🔗 [EDA – Fabricants de chocolat](lien_source)  
  📊 Type : Qualitative nominale et quantitative continue  

### 5. Musées du Chocolat en Suisse
- **Musées et expériences proposées**  
  🔗 [Maison Cailler, Lindt Home of Chocolate, Camille Bloch, House of Läderach](lien_source)  
  📊 Type : Qualitative nominale  

### 6. Consommation de Chocolat dans le Monde
- **Statistiques mondiales sur la consommation**  
  🔗 [Chiffres mondiaux sur la consommation de chocolat](lien_source)  
  📊 Type : Quantitative continue  

### 7. Visualisation des Données Existantes
- **Exemples de visualisation sur le chocolat**  
  🔗 [Chocolate Data Viz](lien_source)  
  🔗 [Pinterest – Graphiques sur le chocolat](lien_source)  
  📊 Type : Représentation visuelle de données quantitatives  

### 8. Éléments Visuels pour Illustrations
- **Illustrations et icônes pour le projet**  
  🔗 [Icônes et illustrations générales](lien_source)  
  🔗 [Illustration de la production de chocolat](lien_source)  
  🔗 [Symboles et graphiques suisses](lien_source)  
  📊 Type : Qualitative nominale  

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
