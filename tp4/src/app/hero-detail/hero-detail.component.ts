import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';

import { Hero } from '../hero';
import { Pet } from '../pet';
import { HeroService } from '../hero.service';
import { PetService } from '../pet.service';

@Component({
  selector: 'app-hero-detail',
  templateUrl: './hero-detail.component.html',
  styleUrls: [ './hero-detail.component.css' ]
})
export class HeroDetailComponent implements OnInit {
  hero: Hero | undefined;
  Pets: Pet[] = [];

  constructor(
    private route: ActivatedRoute,
    private heroService: HeroService,
    private location: Location,
    private PetService: PetService
  ) {}

  ngOnInit(): void {
    this.getPets();
    this.getHero();
  }

  getPets(): void {
    this.PetService.getPets()
    .subscribe(Pets => this.Pets = Pets);
  }

  getHero(): void {
    const id = this.route.snapshot.paramMap.get('id')!;
    this.heroService.getHero(id)
      .subscribe(hero => this.hero = hero);
  }

  goBack(): void {
    this.location.back();
  }

  save(): void {

    if (this.hero) {
      this.heroService.updateHero(this.hero)
        .subscribe(() => this.goBack());
    }
  }
}
