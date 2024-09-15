import { Component } from '@angular/core';
import { UserServiceService } from '../services/user.service.service';
import { ApplicationUser } from '../Interfaces';

@Component({
  selector: 'app-account-view',
  templateUrl: './account-view.component.html',
  styleUrl: './account-view.component.css'
})
export class AccountViewComponent {
  user!: ApplicationUser;

  constructor(private userService: UserServiceService) { }

  ngOnInit(): void {
    this.getUserInfo()
  }

  getUserInfo(): void {
    this.userService.getUserInfo()
      .subscribe((user:ApplicationUser) => {
        this.user = user;
      });
  }
}
