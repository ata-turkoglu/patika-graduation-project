const { Client } = require("pg");

const client = new Client("postgres://yhcengdn:e9FJIj0GkRImpWl0L2ECuAlLipfHruTc@fanny.db.elephantsql.com/yhcengdn");

client.connect((err)=>{
  if(err){
    return console.error('could not connect to postgres', err);
  }
});

module.exports = client;