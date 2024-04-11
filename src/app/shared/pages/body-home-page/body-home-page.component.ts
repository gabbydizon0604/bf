import { Component, ElementRef, OnInit, Renderer2, ViewChild } from '@angular/core';

@Component({
  selector: 'app-body-home-page',
  templateUrl: './body-home-page.component.html',
  styleUrls: [
    './body-home-page.component.css',
   './body-home-page.component.scss']
})
export class BodyHomePageComponent implements OnInit {

  @ViewChild('htmlmain') testDiv: ElementRef;
  
  constructor(private elementRef:ElementRef,
    private renderer: Renderer2) { 
    
  }

  ngAfterViewInit() {
    this.elementRef.nativeElement.querySelector('.hamburger-toggle')
                                  .addEventListener('click', this.onClick.bind(this));
                                  
  }

  ngOnInit(): void {
  }

  onClick(event: any): void {
    console.log(event);
    // this.renderer.addClass(this.testDiv.nativeElement, 'burger-is-active')
    if(document.documentElement.classList.contains('burger-is-active')){
      document.documentElement.classList.remove('burger-is-active')
    }else{
      document.documentElement.classList.add('burger-is-active')
    }
  }

}
