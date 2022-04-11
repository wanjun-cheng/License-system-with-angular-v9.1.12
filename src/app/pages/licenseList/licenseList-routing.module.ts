import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LicenseListComponent } from './licenseList.component';


const routes: Routes = [
  { path: '', component: LicenseListComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class LicenseListRoutingModule { }
