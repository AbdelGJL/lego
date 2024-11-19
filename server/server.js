require('dotenv').config()
const { MongoClient, ServerApiVersion } = require('mongodb');
const uri = `mongodb+srv://abdelgjl:${process.env.SECRET_KEY}@clusterlego.xkkxu.mongodb.net/?retryWrites=true&w=majority&appName=ClusterLego`;
const MONGODB_DB_NAME = 'lego';

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
    useNewUrlParser: true,
  }
});
module.exports.run = async (obj, name) => {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    await client.connect();
    //const client = await MongoClient.connect(MONGODB_URI, {'useNewUrlParser': true});
    const db = client.db(MONGODB_DB_NAME);
    const collection = db.collection(name);
    const result = await collection.insertMany(obj);
    console.log(result);
    // Send a ping to confirm a successful connection
    //await client.db(MONGODB_DB_NAME);
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    await client.close();
    console.log("Closed connection to MongoDB");
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
    const legoSetId = 'deals';
    const db = client.db(MONGODB_DB_NAME);
    const collection = db.collection(legoSetId);
    const deals = await collection.find({ }).toArray();
    const best = deals.filter(deal => deal.discount >= 50);

    console.log(best);
  } finally {
    await client.close();
    console.log("Closed connection to MongoDB");
  }
};

//module.exports.bestDiscount().catch(console.dir);

//Find all most commented deals
/**
 * Find all most commented deals
 * @description Display all deals with more than 15 comments in an array
 */
module.exports.mostCommented = async () => {
  try {
    await client.connect();
    const legoSetId = 'deals';
    const db = client.db(MONGODB_DB_NAME);
    const collection = db.collection(legoSetId);
    const deals = await collection.find({ }).toArray();
    const mostCommented = deals.filter(deal => deal.comments >= 15);

    console.log(mostCommented);
  } finally {
    await client.close();
    console.log("Closed connection to MongoDB");
  }
};  

module.exports.mostCommented().catch(console.dir);

//Find all deals sorted by price


//Find all deals sorted by date


//Find all sales for a given lego set id


//Find all sales scraped less than 3 weeks


