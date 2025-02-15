import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { LanguageSelectorComponent } from '../../components/language-selector/language-selector.component';

@Component({
  selector: 'app-basic-plan',
  imports: [LanguageSelectorComponent, RouterLink, TranslateModule],
  templateUrl: './basic-plan.component.html',
})
export default class BasicPlanComponent {}
