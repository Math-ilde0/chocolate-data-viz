

/**
 * Module de chargement des données pour le projet de visualisation du chocolat
 */

// Fonction pour charger toutes les données et retourner un objet
export async function loadAllData() {
    try {
        const data = {
            historique: await loadHistoriqueChocolat(),
            consommation: await loadConsommationSuisse(),
            fabricants: await loadFabricantsSuisse(),
            importation: await loadImportationSuisse(),
            musees: await loadFrequentationMusees()
        };
        console.log("Toutes les données chargées avec succès:", data);
        return data;
    } catch (error) {
        console.error("Erreur lors du chargement des données:", error);
        throw error;
    }
}

// Charger l'historique du chocolat
async function loadHistoriqueChocolat() {
    try {
        const data = await d3.csv("data/historique_chocolat.csv");
        return data.map(d => ({
            annee: +d.annee,
            evenement: d.evenement,
            description: d.description || "",
            importance: +d.importance || 5
        }));
    } catch (error) {
        console.error("Erreur lors du chargement de l'historique du chocolat:", error);
        return [];
    }
}

// Charger la consommation de chocolat en Suisse
async function loadConsommationSuisse() {
    try {
        const data = await d3.csv("data/consommation_suisse.csv");
        return data.map(d => ({
            annee: +d.annee,
            consommationKg: +d.consommation_par_habitant,
            evolution: +d.evolution || 0
        }));
    } catch (error) {
        console.error("Erreur lors du chargement de la consommation de chocolat:", error);
        return [];
    }
}

// Charger les principaux fabricants de chocolat en Suisse
async function loadFabricantsSuisse() {
    try {
        const data = await d3.csv("data/fabricants_suisse.csv");
        return data.map(d => ({
            fabricant: d.fabricant,
            anneeCreation: +d.annee_de_creation,
            productionTonnes: +d.production_annuelle
        }));
    } catch (error) {
        console.error("Erreur lors du chargement des fabricants de chocolat:", error);
        return [];
    }
}

// Charger les importations de chocolat en Suisse
async function loadImportationSuisse() {
    try {
        const data = await d3.csv("data/importations_suisse.csv");
        return data.map(d => ({
            annee: +d.annee,
            quantiteImportee: +d.quantite_importee,
            paysOrigine: d.principal_pays_origine
        }));
    } catch (error) {
        console.error("Erreur lors du chargement des importations de chocolat:", error);
        return [];
    }
}

// Charger la fréquentation des musées du chocolat en Suisse
async function loadFrequentationMusees() {
    try {
        const data = await d3.csv("data/musees_chocolat.csv");
        return data.map(d => ({
            musee: d.musee,
            annee: +d.annee,
            visiteurs: +d.visiteurs
        }));
    } catch (error) {
        console.error("Erreur lors du chargement de la fréquentation des musées:", error);
        return [];
    }
}

// Exporter toutes les fonctions
export {
    loadHistoriqueChocolat,
    loadConsommationSuisse,
    loadFabricantsSuisse,
    loadImportationSuisse,
    loadFrequentationMusees
};
