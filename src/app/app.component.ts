import { Component, Inject, inject, Optional } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { SsrCookieService } from 'ngx-cookie-service-ssr';
import {
  LanguageService,
  SERVER_LANG_TOKEN,
} from './services/language.service';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
})
export class AppComponent {
  cookieService = inject(SsrCookieService);
  languageService = inject(LanguageService);

  constructor(
    @Optional()
    @Inject(SERVER_LANG_TOKEN)
    langServer: string
  ) {
    console.log({ langServer });

    console.log({ cookie: this.cookieService.get('lang') });

    const lang =
      langServer ??
      (this.cookieService.check('lang')
        ? this.cookieService.get('lang')
        : 'en');

    this.languageService.changeLang(lang);
  }
}
