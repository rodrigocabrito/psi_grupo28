import { Component } from '@angular/core';

@Component({
  selector: 'app-checkout',
  templateUrl: './checkout.component.html',
  styleUrls: ['./checkout.component.css']
})
export class CheckoutComponent {

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
}
