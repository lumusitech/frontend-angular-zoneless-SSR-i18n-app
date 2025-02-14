import { Component, effect, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { SsrCookieService } from 'ngx-cookie-service-ssr';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
})
export class AppComponent {
  cookieService = inject(SsrCookieService);

  cookieLogEffect = effect(() => {
    console.log({ cookie: this.cookieService.get('lang') });
  });
}
