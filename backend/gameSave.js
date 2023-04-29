#! /usr/bin/env node

console.log(
    'This script populates some test books, heros, pets and bookinstances to your database. Specified database as argument - e.g.: node populatedb "mongodb+srv://cooluser:coolpassword@cluster0.lz91hw2.mongodb.net/local_library?retryWrites=true&w=majority"'
  );
  
  // Get arguments passed on command line
  const userArgs = process.argv.slice(2);
  const Game = require("./models/game")
  
  const games = [];
  
  const mongoose = require("mongoose");
  mongoose.set("strictQuery", false); // Prepare for Mongoose 7
  
  const mongoDB = userArgs[0];
  
  main().catch((err) => console.log(err));
  
  async function main() {
    console.log("Debug: About to connect");
    await mongoose.connect(mongoDB);
    console.log("Debug: Should be connected?");
    await createGames();
    console.log("Debug: Closing mongoose");
    mongoose.connection.close();
  }

  async function gameCreate(name, type, description, supported_platform, supported_languages, price, rate, dlc, main_game) {
    const game = new Game({ name: name, type:type, description: description, supported_platform: supported_platform,supported_languages :supported_languages, price:price, rate:rate, dlc:dlc, main_game:main_game });
    await game.save();
    games.push(game);
    console.log(`Added game: ${name}`);
  }
  
  async function createGames(){
    console.log("Adding games");
    await Promise.all([
      gameCreate("The Last of Us Part I", "Adventure", 
      "Numa civilização devastada, onde infetados e sobreviventes enrijecidos espalham o caos, Joel, um protagonista amargo, é contratado para tirar ilegalmente Ellie, uma rapariga de 14 anos, de uma zona de quarentena militarizada. Porém, o que começa por ser um trabalho simples depressa se transforma numa viagem brutal que os levará a percorrer o seu país.",
      ["Windows"], ["ingles", "portugues", "frances", "alemao", "russo"], 60, 0, undefined, undefined),
      gameCreate("Stranded: Alien Dawn", "Simulation", 
      "Brave a new world in Stranded: Alien Dawn, a planet survival sim placing the fate of a small marooned group in your hands. Forge your story through compelling and immersive strategic gameplay as you make vital decisions to protect your survivors from starvation, disease, extreme weather and more. From basic camps to fortified bases, create a stronghold to defend the survivors from attacks by alien creatures that roam an expansive and deadly alien world. Experience an epic and unpredictable journey.",
      ["Windows", "Linux"], ["ingles", "portugues", "frances", "alemao", "russo"], 35, 0, undefined, undefined),
      gameCreate("Football Manager 2023", "Simulation", 
      "Junta-te à elite dos treinadores para escreveres os teus próprios cabeçalhos e conquistares o carinho dos adeptos enquanto vences todos os teus rivais no Football Manager 2023.",
      ["Windows", "Linux", "MacOS"], ["ingles", "portugues", "frances", "alemao", "russo", "italinano", "espanhol"], 60, 0, undefined, undefined),
      gameCreate("Planet Zoo", "Simulation", 
      "Build a world for wildlife in Planet Zoo. From the developers of Planet Coaster and Zoo Tycoon comes the ultimate zoo sim, featuring authentic living animals who think, feel and explore the world you create around them. Experience a globe-trotting campaign or let your imagination run wild in the freedom of Sandbox mode. Create unique habitats and vast landscapes, make big decisions and meaningful choices, and nurture your animals as you construct and manage the world’s wildest zoos.",
      ["Windows", "Linux", "MacOS"], ["ingles", "portugues", "frances", "alemao", "russo", "italinano", "espanhol"], 45, 0, undefined, undefined),
      gameCreate("Afterimage", "Metroidvania", 
      "Para além de possuir uma beleza sublime, o mundo de Engardin também está mergulhado em várias crises. Nas ruínas de Engardin podes encontrar muitos tesouros e segredos, mas os Corrompidos estão à espera das suas próximas presas e as armadilhas letais deixadas pelos antigos farão dos mais incautos as suas vítimas.",
      ["Windows", "Linux", "MacOS"], ["ingles", "portugues", "russo", "italinano", "espanhol"], 25, 0, undefined, undefined),
      gameCreate("Game Cube", "Adventure", 
      "É um jogo fantastico.",
      ["Windows", "Linux", "MacOS"], ["ingles", "portugues", "russo", "italinano", "espanhol"], 1, 0, undefined, undefined),
      gameCreate("Sky World", "Fantasy", 
      "Wow.",
      ["Windows"], ["ingles", "portugues", "russo", "italinano", "espanhol"], 15.99, 0, undefined, undefined),
      gameCreate("ABCDE", "Learning", 
      "let learn!",
      ["Windows", "Linux", "MacOS"], ["ingles", "portugues", "frances", "alemao", "russo", "italinano", "espanhol"], 9.99, 0, undefined, undefined),
    ]);
  }
  
  