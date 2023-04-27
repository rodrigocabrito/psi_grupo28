import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls
  : ['./login.component.scss'],
})
export class LoginComponent implements OnInit {

  hide: boolean = true;
  username: string = "";
  password: string = "";

  constructor(private fb: FormBuilder) {
  }

  ngOnInit() {
  }

  loginForm: FormGroup = this.fb.group({
    username: ['', [Validators.required]],
    password: ['', [Validators.required, Validators.minLength(8)]]
  })


  login(){
    if (!this.loginForm.valid) {
      return;
    }
    console.log(this.loginForm.value);
  }
}
