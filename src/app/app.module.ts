import { NgModule } from '@angular/core';
import { AngularFireModule } from '@angular/fire/compat';
import { AngularFireAuthModule } from '@angular/fire/compat/auth';
import { AngularFireDatabaseModule } from '@angular/fire/compat/database';
import { AppRoutingModule } from './app-routing.module';
import { FormsModule } from '@angular/forms';
import { AuthComponent } from './auth/auth.component';
import { AuthService } from './service/auth.service';
import { MonitoringComponent } from './monitoring/monitoring.component';
import { AppComponent } from './app.component';
import { MatTableModule } from '@angular/material/table';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { RegisterComponent } from './register/register.component';
import { MatSelectModule } from '@angular/material/select';
import { TextFieldModule } from '@angular/cdk/text-field';
import { MatButtonModule } from '@angular/material/button';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { ReactiveFormsModule } from '@angular/forms';
import { MatRadioModule } from '@angular/material/radio';
import { MatIconModule } from '@angular/material/icon';
import { ConfigDialogComponent } from './shared/components/config-dialog/config-dialog.component';
import {
  MatDialogActions,
  MatDialogClose,
  MatDialogContent,
  MatDialogModule,
  MatDialogTitle,
} from '@angular/material/dialog';
import { NewDataBaseDialogComponent } from './shared/components/new-data-base-dialog/new-data-base-dialog.component';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { PendingDialogComponent } from './shared/components/pending-dialog/pending-dialog.component';
import { UserComponent } from './user/user.component';
import { MatMenuModule } from '@angular/material/menu';
import { NgxMaskDirective, NgxMaskPipe, provideNgxMask } from 'ngx-mask';
import { HttpClientModule } from '@angular/common/http';
import { LicenseDialogComponent } from './shared/components/license-dialog/license-dialog.component';
import { environment } from '../environments/environment';
import { ConfigDropboxDialogComponent } from './shared/components/config-dropbox-dialog/config-dropbox-dialog.component';
import { GenerateTokenDialogComponent } from './shared/components/generate-token-dialog/generate-token-dialog.component';
import { LogComponent } from './log/log.component';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatExpansionModule } from '@angular/material/expansion';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatListModule } from '@angular/material/list';
import { MatSortModule } from '@angular/material/sort';
import { MatCardModule } from '@angular/material/card';
import { SnTestDialogComponent } from './shared/components/sn-test-dialog/sn-test-dialog.component';
import { NavbarComponent } from './shared/components/navbar/navbar.component';
import { CdkDrag, CdkDropList } from '@angular/cdk/drag-drop';
import { MatGridListModule } from '@angular/material/grid-list';
import { SnTestLogComponent } from './shared/components/sn-test-log/sn-test-log.component';
import { SnTestListComponent } from './shared/components/sn-test-list/sn-test-list.component';
@NgModule({
  declarations: [
    AuthComponent,
    MonitoringComponent,
    AppComponent,
    RegisterComponent,
    ConfigDialogComponent,
    NewDataBaseDialogComponent,
    PendingDialogComponent,
    UserComponent,
    LicenseDialogComponent,
    ConfigDropboxDialogComponent,
    GenerateTokenDialogComponent,
    LogComponent,
    SnTestDialogComponent,
    NavbarComponent,
    SnTestLogComponent,
    SnTestListComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    AngularFireModule.initializeApp(environment.firebase),
    AngularFireAuthModule,
    AngularFireDatabaseModule,
    MatTableModule,
    MatFormFieldModule,
    MatInputModule,
    BrowserAnimationsModule,
    MatCheckboxModule,
    MatSelectModule,
    TextFieldModule,
    MatButtonModule,
    MatAutocompleteModule,
    ReactiveFormsModule,
    MatRadioModule,
    MatIconModule,
    MatDialogModule,
    MatDialogActions,
    MatDialogClose,
    MatDialogTitle,
    MatDialogContent,
    MatSortModule,
    MatSnackBarModule,
    MatMenuModule,
    MatListModule,
    MatRadioModule,
    MatButtonModule,
    MatCardModule,
    NgxMaskDirective,
    NgxMaskPipe,
    HttpClientModule,
    MatDatepickerModule,
    MatTooltipModule,
    MatExpansionModule,
    CdkDropList,
    CdkDrag,
    MatListModule,
    MatGridListModule,
  ],
  providers: [AuthService, provideNgxMask()],
  bootstrap: [AppComponent],
})
export class AppModule {}
