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
  rate,
  rating,
  dlc,
  main_game,
  image_p,
  image_s,
  video_link,
  comments
) {
  const game = new Game({
    name: name,
    type: type,
    description: description,
    supported_platform: supported_platform,
    supported_languages: supported_languages,
    price: price,
    rating: rating,
    rate: rate,
    dlc: dlc,
    main_game: main_game,
    image_p: image_p,
    image_s: image_s,
    video_link: video_link,
    comments: comments
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
      ["inglês", " português", " francês", " alemão", " russo"],
      60,
      0,
      0,
      [],
      undefined,
      "the-last-of-us-part-main.jpg",
      ["the-last-of-us-part-s-1.jpg", "the-last-of-us-part-s-2.jpg"],
      "https://www.youtube.com/watch?v=CxVyuE2Nn_w&pp=ygUgdGhlIGxhc3Qgb2YgdXMgcGFydCBpIHBjIHRyYWlsZXI%3D",
      []

    ),
    gameCreate(
      "Stranded: Alien Dawn",
      "Simulação",
      "Alien Dawn é um jogo simulador de sobrevivência que combina construção de bases, gerenciamento de recursos e tower defense. Nele, o jogador lidera um grupo de astronautas presos em um planeta alienígena hostil, enfrentando ameaças de criaturas selvagens e condições climáticas imprevisíveis.",
      ["Windows", "Linux"],
      ["inglês", " português", " francês", " alemão", " russo"],
      35,
      0,
      0,
      [],
      undefined,
      "stranded-alien-dawn-main.jpg",
      ["stranded-alien-dawn-1.jpg", "stranded-alien-dawn-2.jpg"],
      "",
      []
    ),
    gameCreate(
      "Football Manager 2023",
      "Simulação",
      "Junta-te à elite dos treinadores para escreveres os teus próprios cabeçalhos e conquistares o carinho dos adeptos enquanto vences todos os teus rivais no Football Manager 2023.",
      ["Windows", "Linux", "MacOS"],
      [
        "inglês",
        " português",
        " francês",
        " alemão",
        " russo",
        " italiano",
        " espanhol",
      ],
      60,
      0,
      0,
      [],
      undefined,
      "football-manager-2023-main.jpg",
      ["football-manager-2023-1.jpg", "football-manager-2023-2.jpg"],
      "https://www.youtube.com/watch?v=ISJxT7VLzYg&pp=ygUdRm9vdGJhbGwgTWFuYWdlciAyMDIzIHRyYWlsZXI%3D",
      []

    ),
    gameCreate(
      "Planet Zoo",
      "Simulation",
      "O Planet Zoo é um jogo de simulação de de zoológico dos desenvolvedores de Planet Coaster e Zoo Tycoon. O game está disponível para PC (via download na Steam) e permite que os jogadores construam seu próprio zoológico. Contudo, administrar funcionários, visitantes e animais ao mesmo tempo pode ser uma situação caótica.",
      ["Windows", "Linux", "MacOS"],
      [
        "inglês",
        " português",
        " francês",
        " alemão",
        " russo",
        " italiano",
        " espanhol",
      ],
      45,
      0,
      0,
      [],
      undefined,
      "planet-zoo-main.jpg",
      ["planet-zoo-1.jpg", "planet-zoo-2.jpg"],
      "https://www.youtube.com/watch?v=gNg6-JVx_9M&pp=ygUSUGxhbmV0IFpvbyB0cmFpbGVy",
      []
    ),
    gameCreate(
      "Afterimage",
      "Metroidvania",
      "Para além de possuir uma beleza sublime, o mundo de Engardin também está mergulhado em várias crises. Nas ruínas de Engardin podes encontrar muitos tesouros e segredos, mas os Corrompidos estão à espera das suas próximas presas e as armadilhas letais deixadas pelos antigos farão dos mais incautos as suas vítimas.",
      ["Windows", "Linux", "MacOS"],
      ["inglês", " português", " russo", " italiano", " espanhol"],
      25,
      0,
      0,
      [],
      undefined,
      "afterimage-main.jpg",
      ["afterimage-1.jpg", "afterimage-2.jpg"],
      "https://www.youtube.com/watch?v=g6JD2i0nusc&pp=ygUXYWZ0ZXJpbWFnZS1tYWluIHRyYWlsZXI%3D",
      []
    ),
  ]);
}
