#! /usr/bin/env node

console.log(
    'This script populates some test books, heros, pets and bookinstances to your database. Specified database as argument - e.g.: node populatedb "mongodb+srv://cooluser:coolpassword@cluster0.lz91hw2.mongodb.net/local_library?retryWrites=true&w=majority"'
  );
  
  // Get arguments passed on command line
  const userArgs = process.argv.slice(2);
  
  const Hero = require("./models/hero");
  const Pet = require("./models/pet");
  
  const heros = [];
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
    await createHeros();
    console.log("Debug: Closing mongoose");
    mongoose.connection.close();
  }
  
  async function petCreate(name) {
    const pet = new Pet({ name: name });
    await pet.save();
    pets.push(pet);
    console.log(`Added pet: ${name}`);
  }
  
  async function heroCreate(name, pet) {
    herodetail = { name : name , pet : pet};
  
    const hero = new Hero(herodetail);
  
    await hero.save();
    heros.push(hero);
    console.log(`Added hero: ${name}`);
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
  
  async function createHeros() {
    console.log("Adding heross");
    await Promise.all([
      heroCreate("Patrick", pets[1]),
      heroCreate("Ben", pets[2]),
      heroCreate("Isaac", pets[0]),
      heroCreate("Bob", pets[0]),
      heroCreate("Jim", pets[0]),
    ]);
  }
  
  