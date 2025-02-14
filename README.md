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
import { ApplicationConfig, importProvidersFrom } from "@angular/core";
import { provideHttpClient, withFetch } from "@angular/common/http";
import { provideZoneChangeDetection } from "@angular/platform-browser";
import { provideRouter } from "@angular/router"; // Make sure this is imported
import { provideClientHydration, withEventReplay } from "@angular/platform-browser";
import { TranslateModule, TranslateHttpLoader } from "@ngx-translate/core"; // Import necessary modules
import { HttpClient } from "@angular/common/http"; // Import HttpClient
import { routes } from "./app-routing.module"; // Import your routes (adjust path if needed)
import { SsrCookieService } from "./ssr-cookie.service"; // Import your cookie service (adjust path if needed)

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
          provide: TranslateHttpLoader, // Provide the loader, not HttpClient
          useFactory: HttpLoaderFactory,
          deps: [HttpClient],
        },
      })
    ),
    SsrCookieService, // No need for extra comment if the import is clear
  ],
};
```
