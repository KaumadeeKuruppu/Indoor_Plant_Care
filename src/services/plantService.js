import rawPlants from '../data/plants.json';
import rawIssues from '../data/issues.json';
import rawSymptoms from '../data/symptoms.json';
export const plants = rawPlants;
export const issues = rawIssues;
export const symptoms = rawSymptoms;
export const getPlant = (id) => plants.find((p) => p.id === id);
export const getAffectedPlants = (issue) =>
  plants.filter((p) => issue.affectedPlants.includes(p.id));
export const getPlantIssues = (plant) => issues.filter((i) => plant.commonIssues.includes(i.id));
