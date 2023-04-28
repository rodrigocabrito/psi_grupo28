import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { of } from 'rxjs';

import { UserSearchComponent } from '../user-search/user-search.component';
import { UserService } from '../user.service';
import { USERS } from '../mock-users';

import { DashboardComponent } from './dashboard.component';

describe('DashboardComponent', () => {
  let component: DashboardComponent;
  let fixture: ComponentFixture<DashboardComponent>;
  let userService;
  let getUsersSpy: jasmine.Spy;

  beforeEach(waitForAsync(() => {
    userService = jasmine.createSpyObj('UserService', ['getUsers']);
    getUsersSpy = userService.getUsers.and.returnValue(of(USERS));
    TestBed
        .configureTestingModule({
          declarations: [DashboardComponent, UserSearchComponent],
          imports: [RouterTestingModule.withRoutes([])],
          providers: [{provide: UserService, useValue: userService}]
        })
        .compileComponents();

    fixture = TestBed.createComponent(DashboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should be created', () => {
    expect(component).toBeTruthy();
  });

  it('should display "Top Users" as headline', () => {
    expect(fixture.nativeElement.querySelector('h2').textContent).toEqual('Top Users');
  });

  it('should call userService', waitForAsync(() => {
       expect(getUsersSpy.calls.any()).toBe(true);
     }));

  it('should display 4 links', waitForAsync(() => {
       expect(fixture.nativeElement.querySelectorAll('a').length).toEqual(4);
     }));
});
