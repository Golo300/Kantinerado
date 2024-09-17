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

  currentPassword: string = '';
  newPassword: string = '';
  confirmNewPassword: string = '';
  errorMessage: string | null = null;
  successMessage: string | null = null;

  ngOnInit(): void {
    this.getUserInfo()
  }

  getUserInfo(): void {
    this.userService.getUserInfo()
      .subscribe((user: ApplicationUser) => {
        this.user = user;
      });
  }

  changePassword() {
    if (this.newPassword !== this.confirmNewPassword) {
      this.errorMessage = 'Die neuen Passwörter stimmen nicht überein.';
      this.successMessage = '';
      return;
    }

    this.userService.changePassword(this.newPassword, this.currentPassword).subscribe({
      next: () => {
        this.successMessage = "Passwort erfogreich geändert";
        this.errorMessage = '';
        this.currentPassword = '';
        this.newPassword = '';
      },
      error: err => {
        this.errorMessage = "Passwort ändern fehlgeschlagen";
        this.successMessage = '';
      }
    });
  }
}
