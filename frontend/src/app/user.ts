import { Pet } from "./pet";
import { Game_search_DTO } from "./games/game_search_DTO";

export interface User {
  id: String;
  name: string;
  followers: User[];
  following: User[];
  games: Game_search_DTO[];
  petname: Pet;
  profilepic: String;
}
