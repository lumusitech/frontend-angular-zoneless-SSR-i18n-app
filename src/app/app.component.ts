import { Component, effect, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { SsrCookieService } from 'ngx-cookie-service-ssr';
import { LanguageService } from './services/language.service';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
})
export class AppComponent {
  cookieService = inject(SsrCookieService);
  languageService = inject(LanguageService);

  cookieLogEffect = effect(() => {
    console.log({ cookie: this.cookieService.get('lang') });

    const lang = this.cookieService.check('lang')
      ? this.cookieService.get('lang')
      : 'en';

    this.languageService.changeLang(lang);
  });
}
