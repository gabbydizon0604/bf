import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http'
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { InterceptorService } from './shared/service/intereptor.service';
import { FooterPageComponent } from './shared/pages/footer-page/footer-page.component';
import { HeaderPageComponent } from './shared/pages/header-page/header-page.component';
import { BodyPageComponent } from './shared/pages/body-page/body-page.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HeaderAccountPageComponent } from './shared/pages/header-account-page/header-account-page.component';
import { BodyAccountPageComponent } from './shared/pages/body-account-page/body-account-page.component';
import { LoginGuardGuard } from './shared/guards/login-guard.guard';
import { JwtHelperService, JWT_OPTIONS } from '@auth0/angular-jwt';
import { FooterAccountPageComponent } from './shared/pages/footer-account-page/footer-account-page.component';
import { BodyHomePageComponent } from './shared/pages/body-home-page/body-home-page.component';
import { RouterModule } from '@angular/router';
import { CarouselModule } from 'ngx-owl-carousel-o';
import { BetinaChatWidgetComponent } from './shared/components/betina-chat-widget/betina-chat-widget.component';
import { BetinaChatWidgetDialogflowComponent } from './shared/components/betina-chat-widget-dialogflow/betina-chat-widget-dialogflow.component';

@NgModule({
  declarations: [
    AppComponent,
    FooterPageComponent,
    HeaderPageComponent,
    BodyPageComponent,
    HeaderAccountPageComponent,
    FooterAccountPageComponent,
    BodyAccountPageComponent,
    BetinaChatWidgetComponent,
    BetinaChatWidgetDialogflowComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,
    BrowserAnimationsModule,
    RouterModule,
    CarouselModule
  ],
  providers: [
    LoginGuardGuard,
    { provide: JWT_OPTIONS, useValue: JWT_OPTIONS },
    JwtHelperService,
    {
      provide: HTTP_INTERCEPTORS,
      useClass: InterceptorService,
      multi: true
    }
  ],
  bootstrap: [AppComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA] // Allow custom elements like df-messenger
})
export class AppModule { }
