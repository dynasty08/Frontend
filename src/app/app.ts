import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { ConnectionStatusComponent } from './components/connection-status/connection-status.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, ConnectionStatusComponent],
  templateUrl: './app.component.html',
  styleUrls: ['./app.css']
})
export class App {
  protected readonly title = signal('angularfolder');
}
