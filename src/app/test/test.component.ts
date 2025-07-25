import { Component } from '@angular/core';

@Component({
  selector: 'app-test',
  standalone: true,
  template: `
    <div style="padding: 20px;">
      <h1>Test Page</h1>
      <p>If you can see this, Angular is working!</p>
      <p>Current time: {{currentTime}}</p>
    </div>
  `
})
export class TestComponent {
  currentTime = new Date().toLocaleString();
}
