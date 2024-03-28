import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrl: './main.component.scss'
})
export class MainComponent implements OnInit {
  constructor(private http: HttpClient){
    
  }

  ngOnInit(): void {
    // this.http.get<any>('http://localhost:5000/?arg=hello').subscribe(data => {
    //   console.log(data);
    // })
    this.sendReq();
  }

  fromButton(){
    this.sendReq();
  }

  sendReq(): void{
    this.http.get<any>('http://localhost:5000/?arg=hello').subscribe(data => {
      console.log(data);
    })
  }
}
