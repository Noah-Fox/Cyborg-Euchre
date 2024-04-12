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
  botACards: string[] = [];
  botBCards: string[] = [];
  cardsPlayed: string[] = ['','','',''];

  dealerIndex: number = 0;
  dealer: string = '';

  phase = 'selectPlayers';
  outputMessage = 'Select players';
  cardSelectionMenu = false;
  showTrumpOption = false;

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
      this.dealerIndex = Math.floor(Math.random()*4);
      this.dealer = this.players[this.dealerIndex];
      this.nextPhase();
    }
    else if (this.phase == 'botBHand'){
      if (this.botBCards.length == 5){
        this.nextPhase();
      }
    }
    else if (this.phase == 'botAHand'){
      if (this.botACards.length == 5){
        this.nextPhase();
      }
    }
  }

  addCard(): void{
    if (this.phase == 'botAHand'){
      if (this.cardSuitSelection.value && this.cardValueSelection.value && this.botACards.length < 5){
        this.botACards.push(this.cardValueSelection.value + this.cardSuitSelection.value)
      }
    }
    else if (this.phase == 'botBHand'){
      if (this.cardSuitSelection.value && this.cardValueSelection.value && this.botBCards.length < 5){
        this.botBCards.push(this.cardValueSelection.value + this.cardSuitSelection.value)
      }
    }
    else if (this.phase == 'selectTrumpOption'){
      if (this.cardSuitSelection.value && this.cardValueSelection.value){
        this.cardsPlayed[this.dealerIndex] = this.cardValueSelection.value + this.cardSuitSelection.value;
      }
    }
  }

  removeCard(): void{
    if (this.phase == 'botAHand'){
      this.botACards.pop();
    }
    else if (this.phase == 'botBHand'){
      this.botBCards.pop();
    }
    else if (this.phase == 'selectTrumpOption'){
      this.cardsPlayed[this.dealerIndex] = '';
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
    else if (this.phase == 'botBHand'){
      this.phase = 'botAHand';
      this.outputMessage = `${this.dealer} is dealer. Input cards dealt to ${this.players[2]}`;
    }
    else if (this.phase == 'botAHand'){
      this.phase = 'selectTrumpOption';
      this.showTrumpOption = true;
      this.outputMessage = `Input trump selection card`;
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
