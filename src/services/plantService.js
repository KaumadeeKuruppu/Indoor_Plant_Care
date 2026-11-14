import rawPlants from '../data/plants.json';
import rawIssues from '../data/issues.json';
import rawSymptoms from '../data/symptoms.json';
export const plants = rawPlants;
export const issues = rawIssues;
export const symptoms = rawSymptoms;
export const getPlant = (id) => plants.find((p) => p.id === id);
export const getAffectedPlants = (issue) =>
  plants.filter((p) => issue.affectedPlants.includes(p.id));
const concernOrder = { high: 0, moderate: 1, low: 2 };
export const getPlantIssues = (plant) =>
  issues
    .filter((issue) => plant.commonIssues.includes(issue.id))
    .sort((a, b) => concernOrder[a.severity] - concernOrder[b.severity]);

// Rank library associations, not clinical likelihood. Ties use alphabetical order.
export const getSymptomPlants = (symptomId) => {
  const matchingIssues = issues.filter((issue) => issue.symptoms.includes(symptomId));
  return plants
    .map((plant) => ({
      plant,
      score: matchingIssues.filter(
        (issue) => issue.affectedPlants.includes(plant.id) && plant.commonIssues.includes(issue.id),
      ).length,
    }))
    .filter(({ score }) => score > 0)
    .sort((a, b) => b.score - a.score || a.plant.name.localeCompare(b.plant.name))
    .slice(0, 3)
    .map(({ plant }) => plant);
};
