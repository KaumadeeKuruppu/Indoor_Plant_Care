export const emptyFilters = () => ({
  sunlight: [],
  pets: [],
  difficulty: [],
  watering: [],
  categories: [],
});
export function filterPlants(plants, query, f) {
  const q = query.trim().toLowerCase();
  return plants.filter(
    (p) =>
      (!q || (p.name + ' ' + p.scientificName).toLowerCase().includes(q)) &&
      (!f.sunlight.length || f.sunlight.includes(p.sunlight)) &&
      (!f.pets.length || f.pets.includes(p.petFriendly ? 'safe' : 'toxic')) &&
      (!f.difficulty.length || f.difficulty.includes(p.difficulty)) &&
      (!f.watering.length || f.watering.includes(p.watering)) &&
      f.categories.every((c) =>
        c === 'air' ? p.airPurifying : c === 'beginner' ? p.difficulty === 'easy' : p.smallSpaces,
      ),
  );
}
