const mongoose = require("mongoose");
const listing = require("../models/listing");
const initdata = require("./data.js");


main()
    .then(()=>{
        console.log("SUCCESS");
    })
    .catch((err) =>{
        console.log(err)
    });

async function main() {
  await mongoose.connect('mongodb://127.0.0.1:27017/WANDERLUST');

}

const init_db = async () =>{
    await listing.deleteMany({});
    initdata.data = initdata.data.map((obj) =>({...obj,owner:'66863a11b9653d948719bd00'}));
    await listing.insertMany(initdata.data);
    console.log("DATA WAS INITIALIZE");
}

init_db();