import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AuthGuard } from './auth/auth.guard';
import { LoginComponent }       from './auth/login/login.component';
import { LayoutComponent }       from '../layout/layout.component';
import { LicenseApplyComponent } from './licenseApply/licenseApply.component';
import { LicenseDetailComponent } from './licenseList/detail/detail.component';


const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: 'login', component: LoginComponent },
  { 
    path: 'license',
    component: LayoutComponent,
    // canActivate: [AuthGuard],
    // canActivateChild: [AuthGuard],
    children: [
      { path: 'apply', component: LicenseApplyComponent },
      { path: 'list', loadChildren: () => import('./licenseList/licenseList.module').then(m => m.LicenseListModule) },
      { path: 'detail/:id', component: LicenseDetailComponent },
    ]
  },
  { path: '**', redirectTo: 'login' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class PagesRoutingModule { }
