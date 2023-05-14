#! /usr/bin/env node

console.log(
  'This script populates some test books, heros, pets and bookinstances to your database. Specified database as argument - e.g.: node populatedb "mongodb+srv://cooluser:coolpassword@cluster0.lz91hw2.mongodb.net/local_library?retryWrites=true&w=majority"'
);

// Get arguments passed on command line
const userArgs = process.argv.slice(2);
const Game = require("./models/game");

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

async function gameCreate(
  name,
  type,
  description,
  supported_platform,
  supported_languages,
  price,
  rates,
  rating,
  dlc,
  main_game,
  image_p,
  image_s,
  video_link,
  comments,
  date
) {
  const game = new Game({
    name: name,
    type: type,
    description: description,
    supported_platform: supported_platform,
    supported_languages: supported_languages,
    price: price,
    rating: rating,
    rates: rates,
    dlc: dlc,
    main_game: main_game,
    image_p: image_p,
    image_s: image_s,
    video_link: video_link,
    comments: comments,
    date: date
  });
  await game.save();
  games.push(game);
  console.log(`Added game: ${name}`);
}

async function createGames() {
  console.log("Adding games");
  await Promise.all([
    gameCreate(
      "The Last of Us Part I",
      "Aventura",
      "Numa civilização devastada, onde infetados e sobreviventes enrijecidos espalham o caos, Joel, um protagonista amargo, é contratado para tirar ilegalmente Ellie, uma rapariga de 14 anos, de uma zona de quarentena militarizada. Porém, o que começa por ser um trabalho simples depressa se transforma numa viagem brutal que os levará a percorrer o seu país.",
      ["Windows"],
      ["Inglês", " Português", " Francês", " Alemão", " Russo"],
      60,
      0,
      0,
      [],
      undefined,
      "https://gaming-cdn.com/images/products/13298/616x353/the-last-of-us-part-i-pc-jogo-steam-cover.jpg?v=1683291639",
      ["https://cdn.cloudflare.steamstatic.com/steam/apps/1888930/extras/d20220516_TLOUX_Annouce_Stills_9_WM_STEAM.png?t=1683913536",
       "https://gaming-cdn.com/images/products/13298/screenshot/the-last-of-us-part-i-pc-jogo-steam-wallpaper-1-big.jpg?v=1683291639"],
      "https://www.youtube.com/watch?v=CxVyuE2Nn_w&pp=ygUgdGhlIGxhc3Qgb2YgdXMgcGFydCBpIHBjIHRyYWlsZXI%3D",
      [],
      new Date()
    ),
    gameCreate(
      "Stranded: Alien Dawn",
      "Simulação",
      "Alien Dawn é um jogo simulador de sobrevivência que combina construção de bases, gerenciamento de recursos e tower defense. Nele, o jogador lidera um grupo de astronautas presos em um planeta alienígena hostil, enfrentando ameaças de criaturas selvagens e condições climáticas imprevisíveis.",
      ["Windows", " Linux"],
      ["Inglês", " Português", " Francês", " Alemão", " Russo"],
      35,
      0,
      0,
      [],
      undefined,
      "https://gaming-cdn.com/images/products/12710/616x353/stranded-alien-dawn-pc-jogo-steam-cover.jpg?v=1683636105",
      ["https://gaming-cdn.com/images/products/12710/screenshot/stranded-alien-dawn-pc-jogo-steam-wallpaper-1-big.jpg?v=1683636105",
       "https://gaming-cdn.com/images/products/12710/screenshot/stranded-alien-dawn-pc-jogo-steam-wallpaper-4-thumbv2.jpg?v=1683636105"],
      "",
      [],
      new Date()
    ),
    gameCreate(
      "Football Manager 2023",
      "Simulação",
      "Junta-te à elite dos treinadores para escreveres os teus próprios cabeçalhos e conquistares o carinho dos adeptos enquanto vences todos os teus rivais no Football Manager 2023.",
      ["Windows", " Linux", " MacOS"],
      [
        "Inglês",
        " Português",
        " Francês",
        " Alemão",
        " Russo",
        " Italiano",
        " Espanhol",
      ],
      60,
      0,
      0,
      [],
      undefined,
      "https://gaming-cdn.com/images/products/12596/616x353/football-manager-2023-pc-mac-jogo-steam-europe-cover.jpg?v=1683293547",
      ["https://gaming-cdn.com/images/products/12596/screenshot/football-manager-2023-pc-mac-jogo-steam-europe-wallpaper-1-big.jpg?v=1683293547", 
      "https://gaming-cdn.com/images/products/12596/screenshot/football-manager-2023-pc-mac-jogo-steam-europe-wallpaper-3-thumbv2.jpg?v=1683293547"],
      "https://www.youtube.com/watch?v=ISJxT7VLzYg&pp=ygUdRm9vdGJhbGwgTWFuYWdlciAyMDIzIHRyYWlsZXI%3D",
      [],
      new Date()

    ),
    gameCreate(
      "Planet Zoo",
      "Simulation",
      "O Planet Zoo é um jogo de simulação de de zoológico dos desenvolvedores de Planet Coaster e Zoo Tycoon. O game está disponível para PC (via download na Steam) e permite que os jogadores construam seu próprio zoológico. Contudo, administrar funcionários, visitantes e animais ao mesmo tempo pode ser uma situação caótica.",
      ["Windows", " Linux", " MacOS"],
      [
        "Inglês",
        " Português",
        " Francês",
        " Alemão",
        " Russo",
        " Italiano",
        " Espanhol",
      ],
      45,
      0,
      0,
      [],
      undefined,
      "https://gaming-cdn.com/images/products/4479/616x353/planet-zoo-pc-jogo-steam-cover.jpg?v=1650976223",
      ["https://gaming-cdn.com/images/products/4479/screenshot/planet-zoo-pc-jogo-steam-wallpaper-1-big.jpg?v=1650976223", 
      "https://gaming-cdn.com/images/products/4479/screenshot/planet-zoo-pc-jogo-steam-wallpaper-3-thumbv2.jpg?v=1650976223"],
      "https://www.youtube.com/watch?v=gNg6-JVx_9M&pp=ygUSUGxhbmV0IFpvbyB0cmFpbGVy",
      [],
      new Date()
    ),
    gameCreate(
      "Afterimage",
      "Metroidvania",
      "Para além de possuir uma beleza sublime, o mundo de Engardin também está mergulhado em várias crises. Nas ruínas de Engardin podes encontrar muitos tesouros e segredos, mas os Corrompidos estão à espera das suas próximas presas e as armadilhas letais deixadas pelos antigos farão dos mais incautos as suas vítimas.",
      ["Windows", " Linux", " MacOS"],
      ["Inglês", " Português", " Russo", " Italiano", " Espanhol"],
      25,
      0,
      0,
      [],
      undefined,
      "https://gaming-cdn.com/images/products/13737/616x353/afterimage-pc-jogo-steam-cover.jpg?v=1683639639",
      ["https://gaming-cdn.com/images/products/13737/screenshot/afterimage-pc-jogo-steam-wallpaper-1-big.jpg?v=1683639639",
       "https://gaming-cdn.com/images/products/13737/screenshot/afterimage-pc-jogo-steam-wallpaper-3-thumbv2.jpg?v=1683639639"],
      "https://www.youtube.com/watch?v=g6JD2i0nusc&pp=ygUXYWZ0ZXJpbWFnZS1tYWluIHRyYWlsZXI%3D",
      [],
      new Date()
    ),
  ]);
}
