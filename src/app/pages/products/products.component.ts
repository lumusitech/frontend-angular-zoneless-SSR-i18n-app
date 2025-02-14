import { CommonModule } from '@angular/common';
import { Component, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { LanguageSelectorComponent } from '../../components/language-selector/language-selector.component';

@Component({
  selector: 'app-products',
  imports: [
    RouterLink,
    LanguageSelectorComponent,
    TranslateModule,
    CommonModule,
  ],
  templateUrl: './products.component.html',
})
export default class ProductsComponent {
  fullName = signal('Luciano Figueroa');
}
