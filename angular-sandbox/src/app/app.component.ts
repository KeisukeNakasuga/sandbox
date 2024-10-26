import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet],
  // templateUrl: './app.component.html',
  // styleUrl: './app.component.css',
  template: `<h1>Hello, World!</h1>`
})
export class AppComponent {
  title = 'angular-sandbox';
}
