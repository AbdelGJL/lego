import cors from 'cors';
import express, { response } from 'express';
import helmet from 'helmet';
import bodyParser from 'body-parser';
import db from "./db/conn.mjs";
import { calculateLimitAndOffset, paginate } from 'paginate-info';
import { CommandSucceededEvent } from 'mongodb';

const PORT = 8092;

const app = express();

app.use(bodyParser.json());
app.use(cors());
app.use(helmet());

app.options('*', cors());

app.get('/', (request, response) => {
  response.send({ 'ack': true });
});

app.get('/deals/search', async (request, response) => {
  const { page = 1, size, price, date, filterBy, disc = 50, temp = 100, com = 15 } = request.query;
  try {
    let query = {};
    if (price) {
      query.price = { $lt: parseFloat(price) };
    }
    if (date) {
      const timestamp = new Date(date).getTime() / 1000;
      query.published = { $gte: timestamp };
    }
    // Here filterBy can have 3 values: best-discount, most-commented, hot-deals
    if (filterBy) {
      switch (filterBy) {
        case 'best-discount':
          query.discount = { $gte: parseFloat(disc) }; // Filter by deals with >= 50% discount by default
          break;
        case 'most-commented':
          query.comments = { $gte: parseFloat(com) }; // Filter by deals with more than 15 comments by default
          break;
        case 'hot-deals':
          query.temperature = { $gte: parseFloat(temp) }; // Filter by deals >= 100 degrees by default
          break;
      }
    }
    let collection = db.collection("deals");
    // let deals = await collection.find(query)
    //   .sort({ price: 1 })
    //   .limit(parseInt(limit))
    //   .toArray();

    // const rep = {
    //   limit: parseInt(limit),
    //   total: deals.length,
    //   result: deals
    // }
    const count = await collection.countDocuments(query);
    const { limit, offset } = calculateLimitAndOffset(page, size);
    const rows = await collection.find(query)
      .sort({ price: 1 })
      .limit(limit)
      .skip(offset)
      .toArray();
    const meta = paginate(page, count, rows, size);
    const rep = {
      success: true,
      data : {result : rows, meta}
    }
    response.status(200).send(rep);
  } catch (error) {
    response.status(500).send({ error: 'An error occurred while searching for deals' });
  }
});

app.get('/deals/:id', async (request, response) => {
  const dealId = request.params.id;
  try {
    let collection = db.collection("deals");
    let deal = await collection.findOne({ uuid: dealId });
    if (deal) {
      response.status(200).send(deal);
    } else {
      response.status(404).send({ error: 'Deal not found' });
    }
  } catch (error) {
    response.status(500).send({ error: 'An error occurred while fetching the deal' });
  }
});

app.get('/deals', async (request, response) => {
  const { page, size } = request.query;
  try {
    let collection = db.collection("deals");
    const count = await collection.countDocuments();
    const { limit, offset } = calculateLimitAndOffset(page, size);
    const rows = await collection.find({})
      .limit(limit)
      .skip(offset)
      .toArray();
    const meta = paginate(page, count, rows, size);
    const rep = {
      success: true,
      data : {result : rows, meta}
    }
    response.status(200).send(rep);
  } catch (error) {
    response.status(500).send({ error: 'An error occurred while fetching the deals' });
  }
});

app.get('/sales/search', async (request, response) => {
  const { limit = 20, legoSetId } = request.query;
  try {
    if (!legoSetId) {
      return response.status(400).send({ error: 'legoSetId is required' });
    }

    let collectionName = legoSetId.toString();
    let collection = db.collection(collectionName);
    let sales = await collection.find()
      .sort({ published: -1 })
      .limit(parseInt(limit))
      .toArray();

    const rep = {
      success: true,
      limit: parseInt(limit),
      total: sales.length,
      data : {result : sales}
    };

    response.status(200).send(rep);
  } catch (error) {
    response.status(500).send({ error: 'An error occurred while searching for sales' });
  }
});

app.listen(PORT);

console.log(`📡 Running on port ${PORT}`);

export default app;