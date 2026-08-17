const fs = require('fs');

const path = 'c:/Users/ADMIN/Downloads/DỰ ÁN TEST/data.js';
let content = fs.readFileSync(path, 'utf8');

const baseLat = 11.940419;
const baseLng = 108.458313;

let updated = content.replace(/(\s+name:\s*".*?",\s*category:\s*".*?",)/g, (match) => {
    const lat = baseLat + (Math.random() - 0.5) * 0.1;
    const lng = baseLng + (Math.random() - 0.5) * 0.1;
    return match + `\n    lat: ${lat.toFixed(6)},\n    lng: ${lng.toFixed(6)},`;
});

fs.writeFileSync(path, updated, 'utf8');
console.log('Updated data.js with lat/lng');
