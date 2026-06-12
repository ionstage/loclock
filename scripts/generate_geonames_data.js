const fs = require('fs');
const zlib = require('zlib');

const data = JSON.parse(zlib.gunzipSync(fs.readFileSync('../data/geonames-all-cities-with-a-population-1000.json.gz')));

const cities = data
  .filter(({ fields: f }) =>
    f.geoname_id && f.cou_name_en && f.name && f.timezone && f.population > 0
  )
  .map(({ fields: f }) => ({
    id: f.geoname_id,
    country: f.cou_name_en,
    name: f.name,
    timezone: f.timezone,
    population: f.population,
  }));

// Group by country, sort by population desc, cap at 1000 per country
const byCountry = {};
for (const city of cities) {
  (byCountry[city.country] || (byCountry[city.country] = [])).push(city);
}

let candidates = [];
for (const group of Object.values(byCountry)) {
  group.sort((a, b) => b.population - a.population);
  candidates = candidates.concat(group.slice(0, 1000));
}

// Dedup by (name, timezone), keeping the entry with the lowest id
candidates.sort((a, b) => a.id - b.id);
const seenNameTimezone = new Set();
candidates = candidates.filter(city => {
  const key = `${city.name}\0${city.timezone}`;
  if (seenNameTimezone.has(key)) return false;
  seenNameTimezone.add(key);
  return true;
});

// Dedup by (country, name), keeping the entry with the highest population
candidates.sort((a, b) => b.population - a.population);
const seenCountryName = new Set();
candidates = candidates.filter(city => {
  const key = `${city.country}\0${city.name}`;
  if (seenCountryName.has(key)) return false;
  seenCountryName.add(key);
  return true;
});

// Final sort by id, strip population
candidates.sort((a, b) => a.id - b.id);
const result = candidates.map(({ id, country, name, timezone }) => ({ id, country, name, timezone }));

console.log(JSON.stringify(result));
