import { AfterViewInit, Component } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent implements AfterViewInit {
  title = 'internapp';

  constructor(private translate: TranslateService) {
    this.translate.setDefaultLang('pt');
    translate.use('pt');
  }

  ngAfterViewInit() {}
}
