import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthComponent } from './auth/auth.component';
import { MonitoringComponent } from './monitoring/monitoring.component';
import { RegisterComponent } from './register/register.component';
import { UserComponent } from './user/user.component';
import { LogComponent } from './log/log.component';
import { SnTestDialogComponent } from './shared/components/sn-test-dialog/sn-test-dialog.component';

const routes: Routes = [
  { path: '', component: AuthComponent },
  { path: 'Monitoring', component: MonitoringComponent },
  { path: 'Register', component: RegisterComponent },
  { path: 'Register/:key', component: RegisterComponent },
  { path: 'User', component: UserComponent },
  { path: 'User/:Action/:key', component: UserComponent },
  { path: 'Log/:key/:shift', component: LogComponent },
  { path: 'Monitoring/SNTest', component: SnTestDialogComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
