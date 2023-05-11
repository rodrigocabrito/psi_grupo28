import { Component } from '@angular/core';
import { Router} from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'Oasis Gaming';
  id ="";

  constructor(private router: Router) {}

  ngOnInit(): void {
    const session = window.localStorage.getItem("session");
    if (session) {
      this.id = JSON.parse(session);
    }
  }

  // Add a method to check the current route
  isRoute(route: string): boolean {
    return this.router.url.includes(route);
  }
}
