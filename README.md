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
