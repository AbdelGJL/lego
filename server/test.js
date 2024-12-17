import db from './db/conn.mjs';

function idsArray(array) {
    const uniqueIds = new Set(array.map(item => item.id));
    return Array.from(uniqueIds);
}

const [, , eshop] = process.argv;
const collection = db.collection('deals');
let allDeals = await collection.find({}).toArray();
allDeals = allDeals.filter(item => item.id !== null);
const allIds = idsArray(allDeals);
console.log(allIds.length);
