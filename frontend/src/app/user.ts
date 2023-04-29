import { Game_search_DTO } from "./games/game_search_DTO";

export interface User {
  id: string;
  name: string;
  followers: User[];
  following: User[];
  games: Game_search_DTO[];
}
