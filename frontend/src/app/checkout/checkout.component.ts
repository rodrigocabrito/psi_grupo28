import { Component } from '@angular/core';
import { UserService } from '../user.service';

@Component({
  selector: 'app-checkout',
  templateUrl: './checkout.component.html',
  styleUrls: ['./checkout.component.css']
})
export class CheckoutComponent {


  constructor(private userService: UserService) { }

  ngOnInit() {
  }

  finalizeBuy() {
    const randomNumber = this.generateRandomNumber();

    if (randomNumber <= 50) {
      alert('Infelizmente, a compra não foi bem sucedida.');
    } else {
      alert('Compra realizada com sucesso!');
      //this.removeItensCarrinho()
      //this.adicionaItensBiblioteca()
      //this.removeItensWishlist()
    }
  }

  generateRandomNumber(): number {
    return Math.floor(Math.random() * 100) + 1;
  }

  /*
  removeItensCarrinho(itens: string[]): void {
    const user = this.userService.getUser(id); // get self id
    this.userService.removeItemsFromCart(user, itens); // change to game, create game type
  }

  adicionaItensBiblioteca(itens: string[]): void {
    this.userService.addItemToLibrary(itens);
  }

  removeItensWishlist(itens: string[]): void {
    this.userService.removeItemsFromWishlist(itens);
  }
  */
}
