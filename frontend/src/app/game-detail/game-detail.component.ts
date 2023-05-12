import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';

import { Game_detail } from '../games/game_detail';
import { GameService } from '../game_service/game.service';
import { UserService } from '../user.service';
import { User } from '../user';

@Component({
  selector: 'app-game-detail',
  templateUrl: './game-detail.component.html',
  styleUrls: ['./game-detail.component.css']
})
export class GameDetailComponent {
  game: Game_detail | undefined;
  userId: string | null = sessionStorage.getItem('id');
  session : string = "";
  slideIndex = 2;
  url = "http://localhost:3078/images/";
  Confirm: any;
  options= { title: 'Add to Wishlist', message: 'Queres adicionar a tua wishlist?', okText: "Sim", cancelText: "Não"};
  cartText = { title: 'Add to Cart', message: 'Quer adicionar este jogo ao seu carrinho?', okText: "Sim", cancelText: "Não"};
  inf={title:"Informação", message: ""};
  rate_options= { title: 'Your opinion is important to us!'};
  rate_inf={title:"Informação", message: ""};
  rating = 0;

  constructor(
    private route: ActivatedRoute,
    private GameService: GameService,
    private location: Location
  ) {}
  
  ngOnInit(): void {
    const session = window.localStorage.getItem("session");
    if (session) {
      this.session = JSON.parse(session);
    }
    this.getGame();
  }

_close (confirmEl: Element | null) {
        debugger;
        if (confirmEl) {
          confirmEl.classList.add('confirm--close');
          const temp = confirmEl as HTMLElement;
          temp.style.display = "none";
        }
          
      }
  getGame(): void {
    const id = this.route.snapshot.paramMap.get('id')!;
    this.GameService.getGameDetail(id)
    .subscribe( (game)=>{this.game = game;
      console.log(this.game.description)} 
    );
  }
  
  plusSlides(n: number) :void{
    this.slideIndex += n;
    this.showSlides(this.slideIndex);
  }
  
  currentSlide(n : number) :void{
    this.slideIndex = n;
    this.showSlides(this.slideIndex);
  }

  addWish(){
    this.close("confirm");
    const id = this.route.snapshot.paramMap.get('id')!;
    this.GameService.addWishList(this.session, id)
    .subscribe(result =>{
      const temp = document.getElementsByClassName("inf")[0] as HTMLElement;
      if (!result) {
        this.inf={title:"Informação", message: "failed add to wishlist"};
      }else{
        this.inf={title:"Informação", message: "add to wishlist success"};
      }
      temp.style.display = "flex";
      document.getElementsByClassName("inf")[0].classList.remove('confirm--close');
    });
  }

  close(classname:string){
    this._close(document.getElementsByClassName(classname)[0]);
  }

  confirmWish(){
    const temp = document.getElementsByClassName("confirm")[0] as HTMLElement;
    temp.style.display = "flex";
    document.getElementsByClassName("confirm")[0].classList.remove('confirm--close');
  }
  
  showSlides(n : number) : void {
    let i;
    let slides = document.getElementsByClassName("mySlides");
    let dots = document.getElementsByClassName("dot");
    if (n > slides.length) {this.slideIndex = 1}    
    if (n < 1) {this.slideIndex = slides.length}
    for (i = 0; i < slides.length; i++) {
      const slide = slides[i] as HTMLElement;
      slide.style.display = "none";  
    }
    for (i = 0; i < dots.length; i++) {
      dots[i].className = dots[i].className.replace(" active", "");
    }
    const slid = slides[this.slideIndex-1] as HTMLElement;
    slid.style.display = "block";  
    dots[this.slideIndex-1].className += " active";
  }

  addCart() {
    const id = this.route.snapshot.paramMap.get('id')!;
    this.GameService.addCart(this.session, id)
    .subscribe(result =>{
      const temp = document.getElementsByClassName("inf")[0] as HTMLElement;
      if (!result) {
        this.inf={title:"Informação", message: "Erro ao adicionar jogo ao carrinho"};
      }else{
        this.inf={title:"Informação", message: "Jogo adicionado ao carrinho!"};
      }
      temp.style.display = "flex";
      document.getElementsByClassName("inf")[0].classList.remove('confirm--close');
    });
  }

  confirmCart(){
    const temp = document.getElementsByClassName("confirmCart")[0] as HTMLElement;
    temp.style.display = "flex";
    document.getElementsByClassName("confirmCart")[0].classList.remove('confirm--close');
  }

  confirmRate() {  
    const temp = document.getElementsByClassName("rate__confirm")[0] as HTMLElement;
    temp.style.display = "flex";
    document.getElementsByClassName("confirm")[0].classList.remove('confirm--close');
  }

  rate(){
    this.close("rate__confirm");
    const id = this.route.snapshot.paramMap.get('id')!;

    if (this.rating === 0) {
      alert('Please select a rating.');
    } else {

      //not necessary for US
      if(this.game) {
        const inputField = document.querySelector('input[type="text"]') as HTMLInputElement;
        const inputText = inputField.value;

        this.GameService.addCommentGame(this.game.id, inputText)
        .subscribe(result1 =>{

          if(this.game) {
            this.GameService.rateGame(this.game.id, this.rating)
            .subscribe(result2 =>{

              const temp = document.getElementsByClassName("rate__inf")[0] as HTMLElement;
              if (!result1 && !result2) {
                this.rate_inf={title:"Informação", message: "failed to rate the game..."};
              }else{
                this.rate_inf={title:"Informação", message: "game rated succesfully!"};
              }
              temp.style.display = "flex";
              document.getElementsByClassName("rate__inf")[0].classList.remove('confirm--close');
            });
          }
        });
      }
    }
  }

  onStarClick(rate: number): void {
    this.rating = rate;
    const stars = document.querySelectorAll('.star');
    stars.forEach((star, index) => {
      if (index < this.rating) {
        star.classList.add('active');
      } else {
        star.classList.remove('active');
      }
    });
  }
}
