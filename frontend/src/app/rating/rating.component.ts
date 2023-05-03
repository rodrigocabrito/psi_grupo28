import { Component } from '@angular/core';
import { GameService } from '../game_service/game.service';

@Component({
  selector: 'app-rating',
  templateUrl: './rating.component.html',
  styleUrls: ['./rating.component.css']
})
export class RatingComponent {
  userService: any;
  rating = 0
  gameName = "" // TODO get from selecting in app

  constructor(private gameService: GameService) { }

  ngOnInit(): void {
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

  rate() {
    while (this.rating === 0) {
      alert('Please select a rating.');
    }

    //not necessary for US
    const inputField = document.querySelector('input[type="text"]') as HTMLInputElement;
    const inputText = inputField.value;
    //this.gameService.addComment(this.gameName, inputText);
    //this.gameService.rateGame(this.gameName, this.rating);

    alert('Thanks for sharing your opinion!');
  }
}

