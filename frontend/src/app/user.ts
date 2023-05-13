import { Game_cart } from "./games/game_cart";
import { Game_detail } from "./games/game_detail";
import { Game_library } from "./games/game_library";
import { Game_search_DTO } from "./games/game_search_DTO";
import { Game_wishlist } from "./games/game_wishlist";

export interface User {
  id: string;
  name: string;
  followers: User[];
  following: User[];
  games: Game_library[];
  profilepic: string;
  wishList: Game_wishlist[];
  cart: Game_cart[];
}
