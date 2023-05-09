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
    const id = this.route.snapshot.paramMap.get('id')!;
    this.GameService.addWishList(this.session, id)
    .subscribe();
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
    .subscribe();
  }

}
