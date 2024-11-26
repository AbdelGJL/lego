import cors from 'cors';
import express from 'express';
import helmet from 'helmet';
import bodyParser from 'body-parser';
import db from "./db/conn.mjs";

const PORT = 8092;

const app = express();

//module.exports = app;

app.use(bodyParser.json());
app.use(cors());
app.use(helmet());

app.options('*', cors());

app.get('/', (request, response) => {
  response.send({'ack': true});
});

app.get('/deals', async (request, response) => {
  //const deals = await require('./api').sortedByPrice('desc');
  /*
  router.get("/", async (req, res) => {
  let collection = await db.collection("posts");
  let results = await collection.find({})
    .limit(50)
    .toArray();
  res.send(results).status(200);
});
  */
  let collection = await db.collection("deals");
  let results = await collection.find({})
    .limit(50)
    .toArray();
  response.send(results).status(200);
  //response.send('deals');
});

app.get('/deals/:id', async (request, response) => {
  const dealId = request.params.id; // Extraction de l'identifiant du deal depuis l'URL
  try {
    let collection = await db.collection("deals");
    let deal = await collection.findOne({ uuid: dealId }); // Recherche du deal dans la base de données
    if (deal) {
      response.status(200).send(deal); // Envoi du deal trouvé
    } else {
      response.status(404).send({ error: 'Deal not found' }); // Envoi d'une erreur si le deal n'est pas trouvé
    }
  } catch (error) {
    response.status(500).send({ error: 'An error occurred while fetching the deal' }); // Gestion des erreurs
  }
});

app.listen(PORT);

console.log(`📡 Running on port ${PORT}`);

export default app;