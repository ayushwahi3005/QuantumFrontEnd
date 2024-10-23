import { Component } from '@angular/core';

@Component({
  selector: 'app-category',
  templateUrl: './category.component.html',
  styleUrls: ['./category.component.css']
})
export class CategoryComponent {
  currOption:number=1;
  ngOnInit(){

  }
  onClick(option:number){
    console.log(option)
    this.currOption=option;
  }
}
