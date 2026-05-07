require("dotenv").config();
const { MongoClient } = require('mongodb');
const url = process.env.MONGO_URL;

// or as an es module:
// import { MongoClient } from 'mongodb'

// Connection URL

const client = new MongoClient(url);
console.log(url);

// Database Name
const dbName = 'JilDB';

async function main() {
  // Use connect method to connect to the server
  await client.connect();
  console.log('Connected successfully to server');
  const db = client.db(dbName);
  const collection = db.collection('user');

  // the following code examples can be pasted here...

   //& 1) Find All Documents
    //   const findResult = await collection.find({}).toArray();
    //   console.log('Found documents =>', findResult);
    //* in above method all data come at once in ram -> not good


    // const findResult = collection.find({});
    //* find is curser => not make network call
    // const ans = await findResult.toArray(); //* .toArray() is making network call

    // for await (const doc of findResult)
    //     console.log(doc);

    //* at first doc(1st) will come through curser in const -> work done(console.log) -> next doc -> next doc .... (one at a time)
        

    //& 2) Insert one Document
    // const insertResult = await collection.insertOne({name:"Zoro",age:21,profession:"swordsman"})
    // console.log('Inserted documents =>', insertResult);

     //& 3) Insert many Documents
    //  const insertResult2 = await collection.insertMany([
    //      {name:"Shemrock",age:29, profession:"Holy-knight"},
    //      {name:"Gol.D.Roger",age:50, profession:"Pirate-king"}, {name:"Monkey.D.Luffy",age:20, profession:"Emporror of the sea"}
    //     ]);
    // console.log('Inserted documents =>', insertResult2);

    //& 4) Find Documents with a Query Filter
    //     const filteredDocs = await collection.find({ profession : "Emporror of the sea" }).toArray();
    // console.log('Found documents filtered by { profession : "Emporror of the sea" } =>', filteredDocs);

    //&5) delete docs
    //     const deleteResult = await collection.deleteMany({ name: "Shemrock"});
    //  console.log('Deleted documents =>', deleteResult);

  return 'done.';
}

main()
  .then(console.log)
  .catch(console.error)
  .finally(() => client.close());