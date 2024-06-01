import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { NavSideComponent } from './component/nav-side/nav-side.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, NavSideComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'myApp';
}
