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
  Confirm: any;
  options= { title: 'Adicionar à wishlist', message: 'Quer adicionar este jogo à sua wishlist?', okText: "Sim", cancelText: "Não"};
  cartText = { title: 'Adicionar ao carrinho', message: 'Quer adicionar este jogo ao seu carrinho?', okText: "Sim", cancelText: "Não"};
  inf={title:"Informação", message: ""};
  rate_options= { title: 'A tua opinião é importante!'};
  rating = 0;
  got = false;

  constructor(
    private route: ActivatedRoute,
    private GameService: GameService,
    private UserService: UserService,
    private location: Location
  ) {}
  
  ngOnInit(): void {
    const session = window.localStorage.getItem("session");
    if (session) {
      this.session = JSON.parse(session);
    }
    this.getGame();
    this.checkGot();
  }

  getGame(): void {
    const id = this.route.snapshot.paramMap.get('id')!;
    this.GameService.getGameDetail(id)
    .subscribe( (game)=>{this.game = game;
      console.log(this.game.description)} 
    );
  }

  checkGot(): void{
    const id = this.route.snapshot.paramMap.get('id')!;
    this.UserService.getGamesLibrary(this.session)
    .subscribe( games => {
      for(let index = 0; index < games.length; index++){
        if (games[index].id === id) {
          this.got =true;
          break; 
        }
      }
    })
  }

  _close (confirmEl: Element | null) {
    debugger;
    if (confirmEl) {
      confirmEl.classList.add('confirm--close');
      const temp = confirmEl as HTMLElement;
      temp.style.display = "none";
    }
      
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
    const id = this.route.snapshot.paramMap.get('id')!;
    this.GameService.addWishList(this.session, id)
    .subscribe(result =>{
      const temp = document.getElementsByClassName("inf")[0] as HTMLElement;
      if (!result) {
        this.inf={title:"Informação", message: "Erro ao adicionar jogo à wishlist ☹️"};
      }else{
        this.inf={title:"Informação", message: "Jogo adicionado à wishlist! 😄"};
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
        this.inf={title:"Informação", message: "Erro ao adicionar jogo ao carrinho ☹️"};
      }else{
        this.inf={title:"Informação", message: "Jogo adicionado ao carrinho! 😄"};
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
    const temp = document.getElementsByClassName("confirmRate")[0] as HTMLElement;
    temp.style.display = "flex";
    document.getElementsByClassName("confirmRate")[0].classList.remove('confirm--close');
  }

  rate(){
    this.close("confirmRate");
    const id = this.route.snapshot.paramMap.get('id')!;
    if (!this.got) {
      alert('Para avaliar precisa de comprar o jogo.');
    }else if (this.rating === 0) {
      alert('Please select a rating.');
    } else {

      //not necessary for US
      if(this.game) {
        const inputField = document.getElementById('commentInput') as HTMLTextAreaElement;
        const inputText = inputField.value;

        this.GameService.addCommentGame(this.game.id, inputText)
        .subscribe(result1 =>{

          if(this.game) {
            this.GameService.rateGame(this.game.id, this.rating)
            .subscribe(result2 =>{

              const temp = document.getElementsByClassName("inf")[0] as HTMLElement;
              if (!result1 && !result2) {
                this.inf={title:"Informação", message: "Erro ao avaliar o jogo ☹️"};
              }else{
                this.inf={title:"Informação", message: "Jogo avaliado com sucesso! 😄"};
              }
              temp.style.display = "flex";
              document.getElementsByClassName("inf")[0].classList.remove('confirm--close');
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

  refreshPage() {
    location.reload();
  }
}
