import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';

import { User } from '../user';
import { Pet } from '../pet';
import { UserService } from '../user.service';
import { PetService } from '../pet.service';

@Component({
  selector: 'app-user-detail',
  templateUrl: './user-detail.component.html',
  styleUrls: [ './user-detail.component.css' ]
})
export class UserDetailComponent implements OnInit {
  user: User | undefined;
  Pets: Pet[] = [];

  constructor(
    private route: ActivatedRoute,
    private userService: UserService,
    private location: Location,
    private PetService: PetService
  ) {}

  ngOnInit(): void {
    this.getPets();
    this.getUser();
  }

  getPets(): void {
    this.PetService.getPets()
    .subscribe(Pets => this.Pets = Pets);
  }

  getUser(): void {
    const id = this.route.snapshot.paramMap.get('id')!;
    this.userService.getUser(id)
      .subscribe(user => this.user = user);
  }

  goBack(): void {
    this.location.back();
  }

  save(): void {

    if (this.user) {
      this.userService.updateUser(this.user)
        .subscribe(() => this.goBack());
    }
  }
}
