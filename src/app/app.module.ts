import { BrowserModule, platformBrowser } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { RouterModule } from '@angular/router';
import { AuthService } from './Services/auth.service';
import { HttpModule } from '@angular/http';
import { AppRoutingModule, routingComponents } from './app-routing.module';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AppComponent } from './app.component';
import { NavigationBarComponent } from './navigation-bar/navigation-bar.component';
import { LoaderService } from './Loader/loader.service';
import { LoaderComponent } from './Loader/loader.component';
import { ListPerformanceComponent } from './returns/Subviews/list-performance/list-performance.component';
import { ClickOutsideDirective } from './click-outside.directive';
import { ToolbarComponent } from './toolbar/toolbar.component';
import { MainReturnsToolbarComponent } from './toolbar/main-returns-toolbar/main-returns-toolbar.component';
import { HomePageInternalToolbarComponent } from './toolbar/home-page-internal-toolbar/home-page-internal-toolbar.component';
import { MatTableModule } from '@angular/material/table';
import {
  MatTreeModule, MatButtonModule, MatIconModule, MatCardModule, MatTabsModule, MatMenuModule, MatToolbarModule,
  MatSortModule, MatProgressSpinnerModule, MatSelectModule, MatDatepickerModule, MatNativeDateModule, MatInputModule,
  MatCheckboxModule, MatProgressBarModule, MatSlideToggleModule, MatAutocompleteModule, MatChipsModule, MatButtonToggleModule,
  MatDialogModule, MatGridListModule, MatTooltipModule, MatRadioModule
} from '@angular/material';
import { ReactiveFormsModule } from '@angular/forms';
import { InternalHomePageComponent } from './internal-home-page/internal-home-page.component';
import { InternalHomeDashboardComponent } from './internal-home-page/internal-home-dashboard/internal-home-dashboard.component';
import { GlobalService } from './Services/global.service';
import { FormsModule } from '@angular/forms';
import { CustomReuseStrategy } from './Services/CustomReuseStrategy.service';
import { ListPerformanceToolbarComponent } from './toolbar/list-performance-toolbar/list-performance-toolbar.component';
import { ListGrossComponent } from './Returns/Subviews/list-gross/list-gross.component';
import { PhaseGrossComponent } from './Returns/Subviews/phase-gross/phase-gross.component';
import { WhitemailMainComponent } from './Utilities_Pages/whitemail/whitemail-main/whitemail-main.component';
import { WhitemailNewComponent } from './Utilities_Pages/whitemail/whitemail-new/whitemail-new.component';
import { WhitemailEditComponent } from './Utilities_Pages/whitemail/whitemail-edit/whitemail-edit.component';
import { LriMainComponent } from './Utilities_Pages/LRI/lri-main/lri-main.component';
import { LriEditComponent } from './Utilities_Pages/LRI/lri-edit/lri-edit.component';
import { LriNewComponent } from './Utilities_Pages/LRI/lri-new/lri-new.component';
import { UploadPDFComponent } from './Utilities_Pages/upload-pdf/upload-pdf.component';
import { IncidentalsMainComponent } from './Utilities_Pages/Incidentals/incidentals-main/incidentals-main.component';
import { IncidentalsEditComponent } from './Utilities_Pages/Incidentals/incidentals-edit/incidentals-edit.component';
import { IncidentalsNewComponent } from './Utilities_Pages/Incidentals/incidentals-new/incidentals-new.component';
import { CagingCalendarComponent } from './Utilities_Pages/Caging/caging-calendar/caging-calendar.component';
import { ExceptionsMainComponent } from './Utilities_Pages/Caging/exceptions-main/exceptions-main.component';
import { ExceptionsEditComponent } from './Utilities_Pages/Caging/exceptions-edit/exceptions-edit.component';
import { PdfUploadComponent } from './Utilities_Pages/pdf-upload/pdf-upload.component';


@NgModule({
  declarations: [
    AppComponent,
    NavigationBarComponent,
    routingComponents,
    LoaderComponent,
    ListPerformanceComponent,
    InternalHomePageComponent,
    routingComponents,
    LoaderComponent,
    ClickOutsideDirective,
    ToolbarComponent,
    MainReturnsToolbarComponent,
    HomePageInternalToolbarComponent,
    InternalHomeDashboardComponent,
    ListPerformanceToolbarComponent,
    ListGrossComponent,
    PhaseGrossComponent,
    WhitemailMainComponent,
    WhitemailNewComponent,
    WhitemailEditComponent,
    LriMainComponent,
    LriEditComponent,
    LriNewComponent,
    IncidentalsMainComponent,
    IncidentalsEditComponent,
    IncidentalsNewComponent,
    CagingCalendarComponent,
    UploadPDFComponent,
    ExceptionsEditComponent,
    PdfUploadComponent
  ],
  imports: [
    BrowserModule,
    HttpModule,
    HttpClientModule,
    RouterModule,
    BrowserAnimationsModule,
    AppRoutingModule,
    MatTableModule,
    MatSortModule,
    BrowserAnimationsModule,
    MatTreeModule,
    MatButtonModule,
    MatIconModule,
    MatCardModule,
    MatTabsModule,
    MatMenuModule,
    MatToolbarModule,
    MatSelectModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatInputModule,
    FormsModule,
    MatProgressSpinnerModule,
    MatSlideToggleModule,
    MatCheckboxModule,
    MatProgressBarModule,
    MatAutocompleteModule,
    ReactiveFormsModule,
    MatChipsModule,
    MatButtonToggleModule,
    MatDialogModule,
    MatGridListModule,
    MatTooltipModule,
    MatRadioModule,
  ],
  providers: [
    AuthService,
    LoaderService,
    GlobalService,
    CustomReuseStrategy

  ],
  bootstrap: [AppComponent]
})
export class AppModule {
}
