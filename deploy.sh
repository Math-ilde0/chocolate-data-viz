#!/bin/bash
# Script de déploiement pour GitHub Pages

# Couleurs pour les messages
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

echo -e "${YELLOW}Début du déploiement pour GitHub Pages...${NC}"

# Vérifier si git est installé
if ! command -v git &> /dev/null; then
  echo -e "${RED}Git n'est pas installé. Veuillez l'installer et réessayer.${NC}"
  exit 1
fi

# Vérifier si npm est installé
if ! command -v npm &> /dev/null; then
  echo -e "${RED}npm n'est pas installé. Veuillez l'installer et réessayer.${NC}"
  exit 1
fi

# Vérifier si la branche gh-pages existe déjà
if git show-ref --verify --quiet refs/heads/gh-pages; then
  echo -e "${YELLOW}La branche gh-pages existe déjà. Suppression pour une nouvelle version...${NC}"
  git branch -D gh-pages
fi

# S'assurer que le dossier dist n'existe pas
if [ -d "dist" ]; then
  echo -e "${YELLOW}Suppression du dossier dist existant...${NC}"
  rm -rf dist
fi

# Construire le projet
echo -e "${YELLOW}Construction du projet...${NC}"
npm run build

# Vérifier si la construction a réussi
if [ $? -ne 0 ]; then
  echo -e "${RED}Échec de la construction. Vérifiez les erreurs ci-dessus.${NC}"
  exit 1
fi

# Créer une nouvelle branche gh-pages
echo -e "${YELLOW}Création d'une nouvelle branche gh-pages...${NC}"
git checkout -b gh-pages

# Ajouter le contenu du dossier dist à la branche gh-pages
echo -e "${YELLOW}Ajout du contenu de build au dépôt...${NC}"
git add dist -f
git commit -m "Déploiement sur GitHub Pages"

# Pousser la branche gh-pages vers le dépôt distant
echo -e "${YELLOW}Poussée vers GitHub...${NC}"
git push origin gh-pages -f

# Revenir à la branche principale
echo -e "${YELLOW}Retour à la branche principale...${NC}"
git checkout main

echo -e "${GREEN}Déploiement terminé ! Votre site sera bientôt disponible sur GitHub Pages.${NC}"
echo -e "${GREEN}URL: https://[votre-nom-utilisateur].github.io/chocolate-data-viz/${NC}"