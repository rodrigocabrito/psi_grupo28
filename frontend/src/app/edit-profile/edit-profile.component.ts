import { Component } from '@angular/core';
import { FormGroup, FormControl, Validators, AbstractControl } from '@angular/forms';
import { Router } from '@angular/router';
import { Observable, map, of } from 'rxjs';
import { User } from '../user';
import { ProfilePic } from '../profile-pic';
import { UserService } from '../user.service';

@Component({
  selector: 'app-edit-profile',
  templateUrl: './edit-profile.component.html',
  styleUrls: ['./edit-profile.component.scss']
})
export class EditProfileComponent {
  submitForm!: FormGroup;
  user!: User;
  selectedImage: string | undefined;
  id: string ='';
  images: ProfilePic[] = [
    {name: 'nierbrother', path: '/assets/water.jpg'},
    {name: 'nierfather', path: '/assets/flower.jpg'},
    {name: 'patches', path: '/assets/stickman.jpg'},
  ];

  constructor(
    private userService: UserService,
    private router: Router
  ) { }

  ngOnInit() {
    this.getUser();
    this.submitForm = this.createFormGroup();
  }

  createFormGroup(): FormGroup {
    return new FormGroup({
      name: new FormControl("", {
        validators: [Validators.required, Validators.minLength(3), Validators.pattern('^[a-zA-Z0-9]*$')],
        asyncValidators: [this.checkUsername.bind(this)],
        updateOn: 'blur'
      })
    });
  }

  //getUser() {
  //  this.userService.getUser(sessionStorage.getItem("userId")!).subscribe((user: User) => {
  //    this.user = user;
 //     this.selectedImage = user.profilepic;
 //   });
 // }

  getUser(): void {
      const session = window.localStorage.getItem("session");
       if (session) {
          this.id = JSON.parse(session);
      }
        this.userService.getUser(this.id)
      .subscribe(user => this.user = user);
  }

  onSubmit() {
    this.userService.saveProfile({
      id: sessionStorage.getItem("userId")!,
      name: this.submitForm.value.name,
      profile_image: this.selectedImage
    }).subscribe((bool) => {
      if (bool) this.router.navigate([`user/${sessionStorage.getItem("userId")!}/profile`]);
    });
  }

  checkUsername(control: AbstractControl) {
    const username = control.value.toLowerCase();
    if (username === this.user.name.toLowerCase()) {
       
        return of(null);
    } else {
       
        return this.userService.getUserss().pipe(
            map((users: { name: string }[]) => {
                const usernameExists = users.some(user => user.name.toLowerCase() === username);
                return usernameExists ? { usernameExists: true } : null;
            })
        );
    }
}

  selectImageHandler(event: any, image: ProfilePic) {
    event.preventDefault();
    this.selectedImage = image.path;
  }
}
