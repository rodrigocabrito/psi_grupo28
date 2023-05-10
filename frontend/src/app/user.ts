import { Game_detail } from "./games/game_detail";
import { Game_search_DTO } from "./games/game_search_DTO";
import { Game_wishlist } from "./games/game_wishlist";

export interface User {
  id: string;
  name: string;
  followers: User[];
  following: User[];
  games: Game_search_DTO[];
  profilepic: string;
  //wishList: Game[];
  cart: Game_wishlist[];
}
