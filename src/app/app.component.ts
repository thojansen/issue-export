import { Component } from '@angular/core'

@Component({
  selector: 'app',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  animations: [],
})
export class AppComponent {
  public title: string
  
  constructor() { }

  ngOnInit() {
    this.title = 'Hello World'
    
  }

}
