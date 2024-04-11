import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { FormControl, Validators } from '@angular/forms';
import { Observable } from 'rxjs';
import { map, startWith } from 'rxjs';
import { AsyncPipe } from '@angular/common';

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrl: './main.component.scss'
})
export class MainComponent implements OnInit {
  
  playerNames = ['Alice', 'Bob', 'Craig'];
  playerASelection = new FormControl('');
  playerBSelection = new FormControl('');

  cardValueSelection = new FormControl('');
  cardSuitSelection = new FormControl('');

  playerA = '';
  playerB = '';
  players: string[] = [];

  dealer: string = '';

  phase = 'selectPlayers';
  outputMessage = 'Select players';
  cardSelectionMenu = false;

  constructor(private http: HttpClient){ }

  ngOnInit(): void {

  }

  submitValues(): void{
    if (this.phase == 'selectPlayers'){
      let lVal = this.playerASelection.value;
      let rVal = this.playerBSelection.value;

      if (lVal && rVal && this.playerNames.includes(lVal) && this.playerNames.includes(rVal) && lVal != rVal){
        this.playerA = lVal;
        this.playerB = rVal;
        this.players = [lVal, rVal, lVal + '-bot', rVal + '-bot']
        this.nextPhase();
      }
    }
    else if (this.phase == 'startGame'){
      this.dealer = this.players[Math.floor(Math.random()*4)];
      this.nextPhase();
    }
    else if (this.phase == 'botBHand'){

    }
  }

  nextPhase(): void{
    if (this.phase == 'selectPlayers'){
      this.phase = 'startGame';
      this.outputMessage = 'Press SUBMIT to start game';
    }
    else if (this.phase == 'startGame'){
      this.phase = 'botBHand';
      this.outputMessage = `${this.dealer} is dealer. Input cards dealt to ${this.players[3]}`;
      this.cardSelectionMenu = true;
    }
  }

  sendReq(): void{
    // if (this.name.value){
    //   this.phase = this.name.value;
    // }
    // this.http.get<any>(`http://localhost:5000/?arg=${this.name.value}`).subscribe(data => {
    //   console.log(data.ans);
    // })
    // console.log(this.radioValues.value)
  }
}
