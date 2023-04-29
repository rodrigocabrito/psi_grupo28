#! /usr/bin/env node

console.log(
    'This script populates some test books, users, pets and bookinstances to your database. Specified database as argument - e.g.: node populatedb "mongodb+srv://cooluser:coolpassword@cluster0.lz91hw2.mongodb.net/local_library?retryWrites=true&w=majority"'
  );
  
  // Get arguments passed on command line
  const userArgs = process.argv.slice(2);
  
  const User = require("./models/user");
  const Pet = require("./models/pet");
  
  const users = [];
  const pets = [];
  
  const mongoose = require("mongoose");
  mongoose.set("strictQuery", false); // Prepare for Mongoose 7
  
  const mongoDB = userArgs[0];
  
  main().catch((err) => console.log(err));
  
  async function main() {
    console.log("Debug: About to connect");
    await mongoose.connect(mongoDB);
    console.log("Debug: Should be connected?");
    await createPets();
    await createUsers();
    console.log("Debug: Closing mongoose");
    mongoose.connection.close();
  }
  
  async function petCreate(name) {
    const pet = new Pet({ name: name });
    await pet.save();
    pets.push(pet);
    console.log(`Added pet: ${name}`);
  }
  
  async function userCreate(name, pet) {
    userdetail = { name : name , pet : pet};
  
    const user = new User(userdetail);
  
    await user.save();
    users.push(user);
    console.log(`Added user: ${name}`);
  }
  


  
  async function createPets() {
    console.log("Adding pets");
    await Promise.all([
      petCreate("Fantasy joke"),
      petCreate("cat"),
      petCreate("elpo"),
      petCreate("hetelopdas"),
    ]);
  }
  
  async function createUsers() {
    console.log("Adding userss");
    await Promise.all([
      userCreate("Patrick", pets[1]),
      userCreate("Ben", pets[2]),
      userCreate("Isaac", pets[0]),
      userCreate("Bob", pets[0]),
      userCreate("Jim", pets[0]),
    ]);
  }
  
  