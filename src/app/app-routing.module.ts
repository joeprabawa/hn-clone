import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: '',
    redirectTo: '/topics',
    pathMatch: 'full',
  },
  {
    path: 'topics',
    loadComponent: () => import('./topics/topics.component').then(cmp => cmp.TopicsComponent),
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
