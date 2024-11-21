require('dotenv').config()
const { MongoClient, ServerApiVersion } = require('mongodb');
const uri = `mongodb+srv://abdelgjl:${process.env.SECRET_KEY}@clusterlego.xkkxu.mongodb.net/?retryWrites=true&w=majority&appName=ClusterLego`;
const MONGODB_DB_NAME = 'lego';
const fs = require('fs').promises;
const collection_name = 'deals';

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
    useNewUrlParser: true,
  }
});

/** 
 * Insert data into MongoDB
 * @param {object} obj - The object to insert (deal or sale)
 * @param {string} name - The name of the collection
 * @description Insert the object into the collection
*/
module.exports.run = async (obj, name) => {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    await client.connect();
    const db = client.db(MONGODB_DB_NAME);
    const collection = db.collection(name);
    await collection.deleteMany({});
    const result = await collection.insertMany(obj);
    console.log(result);
  } finally {
    // Ensures that the client will close when you finish/error
    await client.close();
    //console.log("Closed connection to MongoDB");
  }
};
//run().catch(console.dir);

/**
 * Find all best discount deals
 * @description Display all deals with a discount greater than 50% in an array
 */
module.exports.bestDiscount = async () => {
  try {
    await client.connect();
    const db = client.db(MONGODB_DB_NAME);
    const collection = db.collection(collection_name);
    const deals = await collection.find({}).toArray();
    const best = deals.filter(deal => deal.discount >= 50);

    console.log(best);
  } finally {
    await client.close();
    console.log("Closed connection to MongoDB");
  }
};

//module.exports.bestDiscount().catch(console.dir);

/**
 * Find all most commented deals
 * @description Display all deals with more than 15 comments in an array
 */
module.exports.mostCommented = async () => {
  try {
    await client.connect();
    const db = client.db(MONGODB_DB_NAME);
    const collection = db.collection(collection_name);
    const deals = await collection.find({}).toArray();
    const mostCommented = deals.filter(deal => deal.comments >= 15);

    console.log(mostCommented);
  } finally {
    await client.close();
    console.log("Closed connection to MongoDB");
  }
};
//module.exports.mostCommented().catch(console.dir);


/**
 * Find all deals sorted by price
 * @param {string} type - The type of sorting (asc or desc)
 * @description Display all deals sorted by price in an array
 */
module.exports.sortedByPrice = async (type) => {
  try {
    await client.connect();
    const db = client.db(MONGODB_DB_NAME);
    const collection = db.collection(collection_name);
    const deals = await collection.find({}).toArray();
    let sortedByPrice = [];
    if (type === 'desc')
      sortedByPrice = deals.sort((a, b) => b.price - a.price);
    else if (type === 'asc')
      sortedByPrice = deals.sort((a, b) => a.price - b.price);
    console.log(sortedByPrice);
    //SaveInJSON(sortedByPrice, "sortedByPrice");
  } finally {
    await client.close();
    console.log("Closed connection to MongoDB");
  }
};
//module.exports.sortedByPrice('desc').catch(console.dir);

async function SaveInJSON(data, filename) {
  const jsonContent = JSON.stringify(data, null, 2);
  if (filename === "deals")
    await fs.writeFile("./deals/" + filename + ".json", jsonContent, 'utf8');
  else
    await fs.writeFile("./sales/" + filename + ".json", jsonContent, 'utf8');
}

/**
 * Find all deals sorted by date
 * @param {String} type The type of sorting (asc or desc)
 * @description Display all deals sorted by date in an array
 */
module.exports.sortedByDate = async (type) => {
  try {
    await client.connect();
    const db = client.db(MONGODB_DB_NAME);
    const collection = db.collection(collection_name);
    const deals = await collection.find({}).toArray();
    let sortedByDate = [];
    if (type === 'desc')
      sortedByDate = deals.sort((a, b) => new Date(a.published) - new Date(b.published));
    else if (type === 'asc')
      sortedByDate = deals.sort((a, b) => new Date(b.published) - new Date(a.published));
    console.log(sortedByDate);
    //SaveInJSON(sortedByDate, "sortedByDate");
  } finally {
    await client.close();
    console.log("Closed connection to MongoDB");
  }
};

//module.exports.sortedByDate('desc').catch(console.dir);

/**
 * Find all sales for a given lego set id
 * @param {sting} id 
 * @description Display all sales for a given lego set id in an array
 */
module.exports.salesForLegoSet = async (id) => {
  try {
    await client.connect();
    const db = client.db(MONGODB_DB_NAME);
    const collection = db.collection(id);
    const sales = await collection.find({}).toArray();
    console.log(sales);
  } finally {
    await client.close();
    console.log("Closed connection to MongoDB");
  }
};

//module.exports.salesForLegoSet('42157').catch(console.dir);


/**
 * Find all sales scraped less than 3 weeks
 * @param {String} id - The lego set id of the sales
 * @description Display all sales scraped less than 3 weeks in an array
 */
module.exports.recentSales = async (id) => {
  try {
    await client.connect();
    const db = client.db(MONGODB_DB_NAME);
    const collection = db.collection(id);
    const sales = await collection.find({}).toArray();
    const recent = sales.filter(sale => (new Date() - new Date(sale.published) < new Date() - 1814400000));
    console.log(recent);
  } finally {
    await client.close();
    console.log("Closed connection to MongoDB");
  }
}

//module.exports.recentSales('42157').catch(console.dir);

/**
 * Clear the MongoDB database
 * @description Delete all collections in the database to avoid the concatenation of data
 */
module.exports.clearUpdate = async () => {
  try {
    await client.connect();
    const db = client.db(MONGODB_DB_NAME);

    const collections = await db.listCollections().toArray(); // List all collections in the database
    for (const collection of collections) {
      await db.collection(collection.name).drop(); // Delete every collection
      console.log(`Collection '${collection.name}' deleted.`);
    }
    console.log("All collections have been deleted.");


  } finally {
    // Ensures that the client will close when you finish/error
    await client.close();
  }
};

//Display the hot deals


//A faire
//une fonction qui récuprère  les deals pour réduire la taille des fonctions