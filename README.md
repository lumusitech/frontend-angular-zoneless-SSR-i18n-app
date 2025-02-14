# internationalization - Angular 19+ - SSR - Ngx Translate

Angular 19+ application with SSR architecture and integration of the Ngx Translate library for translation management.

## Recommended options for i18n work

- Option 1 (SPA/Dynamic Applications): [ngx translate](https://github.com/ngx-translate/core)
- Option 2 (SSR/SSG Applications): [angular i18n](https://angular.dev/guide/i18n)

## Cookie management

[Ngx Cookie Service SSR](https://www.npmjs.com/package/ngx-cookie-service-ssr): Angular service to read, set and delete browser cookies.

## Translate library

[Ngx Translate](https://github.com/ngx-translate/core): By default, there is no loader available. You can add translations manually using setTranslation but it is better to use a loader. You can write your own loader, or import an existing one. For example you can use the TranslateHttpLoader that will load translations from files using HttpClient.

To use it, you need to install the http-loader package from @ngx-translate:

`pnpm install @ngx-translate/http-loader`

## App config

After applying the recommended configuration, the `app.config.ts` file should look like this:

```typescript
import { ApplicationConfig, importProvidersFrom, provideZoneChangeDetection } from "@angular/core";
import { provideRouter } from "@angular/router";
import { TranslateLoader, TranslateModule } from "@ngx-translate/core";
import { TranslateHttpLoader } from "@ngx-translate/http-loader";
import { SsrCookieService } from "ngx-cookie-service-ssr";

import { HttpClient, provideHttpClient, withFetch } from "@angular/common/http";
import { provideClientHydration, withEventReplay } from "@angular/platform-browser";
import { routes } from "./app.routes";

// AoT requires an exported function for factories
export function HttpLoaderFactory(http: HttpClient) {
  return new TranslateHttpLoader(http);
}

export const appConfig: ApplicationConfig = {
  providers: [
    provideHttpClient(withFetch()),
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes),
    provideClientHydration(withEventReplay()),

    importProvidersFrom(
      TranslateModule.forRoot({
        loader: {
          provide: TranslateLoader,
          useFactory: HttpLoaderFactory,
          deps: [HttpClient],
        },
      })
    ),
    // Cookies
    SsrCookieService,
  ],
};
```

## Server

After applying the recommended configuration, the app.get method into `server.ts` file should look like this:

```typescript
app.get("**", (req, res, next) => {
  const { protocol, originalUrl, baseUrl, headers } = req;

  const cookies = headers.cookie ?? "";

  const langCookie = cookies.split(";").find((cookie) => cookie.includes("lang")) ?? "lang=en";

  const [, lang] = langCookie.split("=");

  commonEngine
    .render({
      bootstrap,
      documentFilePath: indexHtml,
      url: `${protocol}://${headers.host}${originalUrl}`,
      publicPath: browserDistFolder,
      providers: [
        { provide: APP_BASE_HREF, useValue: baseUrl },
        { provide: "REQUEST", useValue: req },
        { provide: "RESPONSE", useValue: res },
        { provide: SERVER_LANG_TOKEN, useValue: lang },
      ],
    })
    .then((html) => res.send(html))
    .catch((err) => next(err));
});
```

## Language service with SERVER_LANG_TOKEN injected using signals

```typescript
import { inject, Injectable, InjectionToken, signal } from "@angular/core";
import { TranslateService } from "@ngx-translate/core";
import { SsrCookieService } from "ngx-cookie-service-ssr";

export const SERVER_LANG_TOKEN = new InjectionToken<string>("SERVER_LANG_TOKEN");

@Injectable({
  providedIn: "root",
})
export class LanguageService {
  cookie = inject(SsrCookieService);
  translate = inject(TranslateService);

  langServer = inject(SERVER_LANG_TOKEN, { optional: true });
  currentLang = signal(this.langServer ?? "en");

  changeLang(lang: string) {
    this.cookie.set("lang", lang);

    this.translate.setDefaultLang(lang);
    this.translate.use(lang);

    this.currentLang.set(lang);
  }
}
```

## The SERVER_LANG_TOKEN is injected into the App component's constructor. Alternatively, it could be injected using the same pattern seen in the service

```typescript
import { Component, Inject, inject, Optional } from "@angular/core";
import { RouterOutlet } from "@angular/router";
import { SsrCookieService } from "ngx-cookie-service-ssr";
import { LanguageService, SERVER_LANG_TOKEN } from "./services/language.service";

@Component({
  selector: "app-root",
  imports: [RouterOutlet],
  templateUrl: "./app.component.html",
  styleUrl: "./app.component.css",
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

    console.log({ cookie: this.cookieService.get("lang") });

    const lang = langServer ?? (this.cookieService.check("lang") ? this.cookieService.get("lang") : "en");

    this.languageService.changeLang(lang);
  }
}
```

## After this configuration, we can use ngx translate into html files

Ensure that the translation files (e.g., en.json, es.json, fr.json, it.json) have been loaded beforehand.

![translation-files](https://github.com/lumusitech/frontend-angular-zoneless-SSR-i18n-app/blob/main/public/assets/img/translation-files-structure.png)

Employ the required properties in each JSON file as translation keys. Example: `es.json`

```json
{
  "welcomeMessage": "¡Bienvenido, {{ firstName }}! ¿Cómo estás hoy?",
  "changeLanguage": "Cambiar idioma",
  "pricingPage": {
    "title": "Precios",
    "description": "Aquí puedes encontrar nuestros planes de precios"
  },
  "plans": {
    "texts": {
      "perMonth": "por mes",
      "join": "Unirse",
      "online-ordering": "Pedidos en línea",
      "limited-support": "Soporte limitado",
      "extended-support": "Soporte 24/7",
      "extra-support1": "Acceso especial a eventos",
      "extra-support2": "Consulta con un chef personal"
    },
    "basic": {
      "name": "Plan Básico",
      "price": "9.99",
      "description": "Descripción del plan básico",
      "button": "Productos"
    },
    "pro": {
      "name": "Plan Pro",
      "price": "20",
      "description": "Descripción del plan pro"
    },
    "enterprise": {
      "name": "Plan Empresarial",
      "price": "30",
      "description": "Descripción del plan empresarial"
    }
  }
}
```

### Using example

```html
<div class="classes here">
  <!-- Recommended way of translation with Pipe -->
  <h2 class="classes here">{{ "pricingPage.title" | translate }}</h2>
  <!-- Other way of translation. Add translate attribute -->
  <p class="classes here" [translate]="'pricingPage.description'"></p>
  <p class="classes here">{{ "welcomeMessage" | translate : { firstName: fullName() } }}</p>
</div>
```
