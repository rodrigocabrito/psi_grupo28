import { Component, OnInit } from '@angular/core';

import { Pet } from '../pet';
import { PetService } from '../pet.service';

@Component({
  selector: 'app-pets',
  templateUrl: './pets.component.html',
  styleUrls: ['./pets.component.css']
})
export class PetsComponent implements OnInit {
  Pets: Pet[] = [];

  constructor(private PetService: PetService) { }

  ngOnInit(): void {
    this.getPets();
  }

  getPets(): void {
    this.PetService.getPets()
    .subscribe(Pets => this.Pets = Pets);
  }


  delete(Pet: Pet): void {
    this.Pets = this.Pets.filter(h => h !== Pet);
    this.PetService.deletePet(Pet.id).subscribe();
  }

}
