import {Component, OnInit} from '@angular/core';
import {I18nService} from '../services/i18n.service';
import {Observable} from 'rxjs';
import {ThemeService} from '../services/theme.service';
import {AuthService} from '../services/auth.service';
import {DEFAULT_LANGUAGE} from '../shared/constants/default.costant';

@Component({
  selector: 'app-root',
  template: `
  <body>
    <main class="bg-white text-gray-900 dark:bg-gray-800 dark:text-white">
      <app-loading *ngIf="isBooting$ | async; else content"></app-loading>

      <ng-template #content>
        <div *ngIf="isLoggedIn$ | async; else notAuthenticate">
          <div class="flex antialiased h-screen w-screen">
            <aside
              tabindex="-1"
              class="h-screen fixed inset-y-0 z-10 flex flex-shrink-0 bg-white border-r lg:static dark:border-gray-900 dark:bg-gray-800 focus:outline-none"
            >
              <app-toolbar></app-toolbar>
              <app-sidebar *ngIf="isDataSegment$ | async"></app-sidebar>
            </aside>

            <aside class="flex-1">
              <router-outlet></router-outlet>
            </aside>
          </div>
        </div>

        <ng-template #notAuthenticate>
          <router-outlet></router-outlet>
        </ng-template>
      </ng-template>
    </main>
  </body>
  `,
  styles: ['']
})
export class AppComponent implements OnInit {
  isBooting$!: Observable<boolean>
  isLoggedIn$!: Observable<boolean>
  isDataSegment$!: Observable<boolean>

  constructor(
    private _i18nService: I18nService,
    private _themeService: ThemeService,
    private _authService: AuthService
  ) {}

  async ngOnInit()
  {
    this.isBooting$ = new Observable<boolean>(
      obj => obj.next(true))

    await this._i18nService.use(DEFAULT_LANGUAGE);

    await this._themeService.init();

    this.isLoggedIn$ = this._authService.isLoggedIn$;

    // REPLACE WITH ON ROUTE CHANGE
    this.isDataSegment$ = new Observable<boolean>(obj => {
      const isData = window.location.href
        .split('/')[3]
        .toUpperCase() === 'DATA'
      obj.next(isData)
    })

    setTimeout(() => {
      this.isBooting$ = new Observable<boolean>(
        obj => obj.next(false))
    }, 2500)
  }
}
