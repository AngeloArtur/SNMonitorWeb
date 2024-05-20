import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../../service/auth.service';
import { ConfigDropboxDialogComponent } from '../config-dropbox-dialog/config-dropbox-dialog.component';
import { MatDialog } from '@angular/material/dialog';
import { DropboxService } from '../../../service/dropbox.service';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.css',
})
export class NavbarComponent implements OnInit {
  user: any;
  currentPath: string = '';
  constructor(
    public auth: AuthService,
    public dialog: MatDialog,
    private router: Router
  ) {}

  async ngOnInit(): Promise<void> {
    this.user = this.auth.UserAuth();
    this.router.events.subscribe(() => {
      this.currentPath = this.router.url;
    });
  }

  async perfil(): Promise<void> {
    try {
      this.auth.navigate(`User/Perfil/${this.user.uid}`);
    } catch (error) {
      console.error('Erro ao obter informações do usuário:', error);
    }
  }

  async passwordNew(): Promise<void> {
    try {
      this.auth.navigate(`User/Password/${this.user.uid}`);
    } catch (error) {
      console.error('Erro ao obter informações do usuário:', error);
    }
  }

  config(): void {
    const dialogRef = this.dialog.open(ConfigDropboxDialogComponent, {
      width: '60rem',
      height: '70rem',
      data: null,
    });
  }

  snTest(): void {
    this.auth.navigate('Monitoring/SNTest');
  }

  addCompany(): void {
    try {
      this.auth.navigate(`Register`);
    } catch (error) {
      console.error('Erro ao obter informações do usuário:', error);
    }
  }
  addUser(): void {
    try {
      this.auth.navigate(`User`);
    } catch (error) {
      console.error('Erro ao obter informações do usuário:', error);
    }
  }

  signOut(): void {
    this.auth.navigate('Monitoring');
  }

  isOnMonitoring(path:string) {
    return this.currentPath === path ;
  }
}
