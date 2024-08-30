import { Component } from '@angular/core';
import { ApplicationUser, Role } from '../Interfaces';

@Component({
  selector: 'app-account-management-admin',
  templateUrl: './account-management-admin.component.html',
  styleUrls: ['./account-management-admin.component.css']
})
export class AccountManagementAdminComponent {

  ngOnInit(): void {
    // TODO: getUsers() --> API Call
    // TODO: Evtl. getRoles() --> API Call
  } 

  // TODO: Durch getUsers() befüllen
  users: ApplicationUser[] = [
    {
      userId: 1,
      username: 'user1',
      employeeId: 12345,
      email: 'user1@example.com',
      password: 'password1',
      authorities: [{ roleId: 1, authority: 'USER' }]
    },
    {
      userId: 2,
      username: 'admin',
      employeeId: 67890,
      email: 'admin@example.com',
      password: 'password2',
      authorities: [{ roleId: 2, authority: 'ADMIN' }]
    }
  ];

  // TODO: Evtl. anpassen
  roles: Role[] = [
    { roleId: 1, authority: 'USER' },
    { roleId: 2, authority: 'KANTEEN' },
    { roleId: 3, authority: 'ADMIN' }
  ];

  searchQuery: string = '';

  get filteredUsers() {
    return this.users.filter(user => 
      user.username.toLowerCase().includes(this.searchQuery.toLowerCase()) ||
      user.email.toLowerCase().includes(this.searchQuery.toLowerCase()) ||
      user.employeeId.toString().includes(this.searchQuery) ||
      user.authorities.some(role => role.authority.toLowerCase().includes(this.searchQuery.toLowerCase()))
    );
  }

  deleteUser(userToDelete: ApplicationUser) {
    const confirmation = confirm(`Bist du sicher, dass du den Benutzer ${userToDelete.username} löschen möchtest?`);
    if (confirmation) {
      // TODO: API Call
      this.users = this.users.filter(user => user !== userToDelete);
    }
  }

  // Methode zur Bestätigung der Rollenänderung
  changeUserRole(user: ApplicationUser, newRoleId: number) {
    const newRole = this.roles.find(role => role.roleId === newRoleId);
    if (user && newRole && user.authorities[0].roleId !== newRoleId) {
      const confirmation = confirm(`Bist du sicher, dass du die Rolle von ${user.username} auf ${newRole.authority} ändern möchtest?`);
      if (confirmation) {
        // TODO: API Call
        user.authorities = [newRole];
      } else {
        setTimeout(() => {
          user.authorities = this.users.find(u => u.userId === user.userId)?.authorities || user.authorities;
        });
      }
    }
  }
}
