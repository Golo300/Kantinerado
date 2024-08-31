import { Component } from '@angular/core';
import { ApplicationUser, Role } from '../Interfaces';
import { AdminService } from '../services/admin.service';

@Component({
  selector: 'app-account-management-admin',
  templateUrl: './account-management-admin.component.html',
  styleUrls: ['./account-management-admin.component.css']
})
export class AccountManagementAdminComponent {
  users: ApplicationUser[] = [
  ];

  roles: Role[] = [
    { roleId: 2, authority: 'USER' },
    { roleId: 3, authority: 'KANTEEN' },
  ];

  searchQuery: string = '';

  constructor(private adminService: AdminService) { }

  ngOnInit(): void {
    this.getAllUsers()
  }

  getAllUsers() {
    this.adminService.getAllUsers()
      .subscribe((users: ApplicationUser[]) => {
        this.users = users
      });
  }

  get filteredUsers() {
    return this.users.filter(user =>
      user.username.toLowerCase().includes(this.searchQuery.toLowerCase()) ||
      user.email.toLowerCase().includes(this.searchQuery.toLowerCase()) ||
      user.employeeiD.toString().includes(this.searchQuery) ||
      user.authorities.authority.toString().toLowerCase().includes(this.searchQuery)
    );
  }

  deleteUser(userToDelete: ApplicationUser) {
    const confirmation = confirm(`Bist du sicher, dass du den Benutzer ${userToDelete.username} löschen möchtest?`);

    if (confirmation) {
      this.adminService.deleteAccount(userToDelete.employeeiD).subscribe(
      );
      this.users = this.users.filter(user => user !== userToDelete);
    }
  }

  changeUserRole(user: ApplicationUser, newRoleId: number) {
    if (user) {
      const confirmation = confirm(`Möchtest du die Rolle des Benutzers ${user.username} wirklich ändern?`);

      if (confirmation) {
        // Promote to KANTEEN if current Role is USER
        if (user.authorities.roleId == 2 && newRoleId == 3) {
          this.promoteUser(user);
        }
        // Demote to USER if current Role is KANTEEN
        else if (user.authorities.roleId == 3 && newRoleId == 2) {
          this.demoteUser(user);
        }
      } 
      else {
        this.getAllUsers();
      }
    }
  }

  promoteUser(user: ApplicationUser) {
    this.adminService.promoteUser(user.username).subscribe({
      next: (_data) => {
        this.getAllUsers()
      }, error: (err) => {
        console.error(err);
      }
    });
  }

  demoteUser(user: ApplicationUser) {
    this.adminService.demoteUser(user.username).subscribe({
      next: (_data) => {
        this.getAllUsers()
      }, error: (err) => {
        console.error(err);
      }
    });
  }
}
