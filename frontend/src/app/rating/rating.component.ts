import { Component } from '@angular/core';
import { GameService } from '../game_service/game.service';
import { Game_detail } from '../games/game_detail';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-rating',
  templateUrl: './rating.component.html',
  styleUrls: ['./rating.component.css']
})
export class RatingComponent {
  rating = 0
  game: Game_detail | undefined 

  constructor(private gameService: GameService,
              private route: ActivatedRoute,) { }

  ngOnInit(): void {
    this.getGame();
  }

  getGame(): void {
    const id = this.route.snapshot.paramMap.get('id')!;
    this.gameService.getGameDetail(id)
    .subscribe( (game)=>{this.game = game;
      console.log(this.game.description)} 
    );
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

  //TODO check
  rate() {
    if (this.rating === 0) {
      alert('Please select a rating.');
    } else {
      //not necessary for US
      if(this.game) {
        const inputField = document.querySelector('input[type="text"]') as HTMLInputElement;
        const inputText = inputField.value;
        this.gameService.addCommentGame(this.game.id, inputText);
        this.gameService.rateGame(this.game.id, this.rating);

        alert('Thanks for sharing your opinion!');
      }
    }
  }
}

