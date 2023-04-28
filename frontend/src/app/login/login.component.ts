import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { UserService } from '../user.service';
import { User } from '../user';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls
  : ['./login.component.scss'],
})
export class LoginComponent implements OnInit {
  user: User | undefined;
  hide: boolean = true;
  username: string = "";
  password: string = "";

  constructor(private fb: FormBuilder,private userService: UserService,private router: Router) {
  }

  ngOnInit() {
  }

  loginForm: FormGroup = this.fb.group({
    username: ['', [Validators.required]],
    password: ['', [Validators.required, Validators.minLength(8)]]
  })


  login() {
    if (!this.loginForm.valid) {
      return;
    }
    this.username = this.loginForm.get('username')!.value;
    this.userService.searchUser(this.username)
    .subscribe(user => {
      this.user = user;
      if (this.user) {
        this.router.navigate(['/detail', this.user.id]);
      }
    });
}

}
