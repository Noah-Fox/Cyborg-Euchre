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

  trumpCardDecision = new FormControl('');//select | pass
  trumpSelection = new FormControl('');//H | D | S | C | pass

  playerA = '';
  playerB = '';
  players: string[] = [];
  botACards: string[] = [];
  botBCards: string[] = [];
  cardsPlayed: string[] = ['','','',''];
  trump: string = '';

  dealerIndex: number = 0;
  dealer: string = '';
  onTurn: number = 0;

  phase = 'selectPlayers';
  outputMessage = 'Select players';
  cardSelectionMenu = false;
  showTrumpOption = false;

  constructor(private http: HttpClient){ }

  ngOnInit(): void {

  }

  //Manages validation and data changes when Submit button is pressed
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
    else if (this.phase == 'selectTrumpOption'){
      if (this.cardsPlayed[this.dealerIndex] != ''){
        this.nextPhase();
      }
    }
    else if (this.phase == 'inputTrumpCardDecision' || this.phase == 'outputTrumpCardDecision'){
      if (this.trumpCardDecision.value == 'select'){
        this.trump = this.cardsPlayed[this.dealerIndex][1];
        this.nextPhase();
      }
      else if (this.trumpCardDecision.value == 'pass'){
        this.nextPhase();
      }
    }
    else if (this.phase == 'inputTrumpSelection' || this.phase == 'outputTrumpSelection'){
      if (this.onTurn == this.dealerIndex){
        if (this.trumpSelection.value && this.trumpSelection.value != 'pass'){
          this.trump = this.trumpSelection.value;
          this.nextPhase();
        }
      }
      else if (this.trumpSelection.value) {
        if (this.trumpSelection.value != 'pass'){
          this.trump = this.trumpSelection.value;
          this.nextPhase();
        }
        else {
          this.nextPhase();
        }
      }
    }
  }

  //changes data when Add Card is selected on a card selection menu
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

  //changes data when Remove Card is selected on a card selection menu
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

  //Handles changing from one phase to the next, and setting output messages
  nextPhase(): void{
    if (this.phase == 'selectPlayers'){
      //Start game
      this.phase = 'startGame';
      this.outputMessage = 'Press SUBMIT to start game';
    }
    else if (this.phase == 'startGame'){
      //Input Bot B's hand
      this.phase = 'botBHand';
      this.outputMessage = `${this.dealer} is dealer. Input cards dealt to ${this.players[3]}`;
      this.cardSelectionMenu = true;
    }
    else if (this.phase == 'botBHand'){
      //Input Bot A's Hand
      this.phase = 'botAHand';
      this.outputMessage = `${this.dealer} is dealer. Input cards dealt to ${this.players[2]}`;
    }
    else if (this.phase == 'botAHand'){
      //Input trump card laid up
      this.phase = 'selectTrumpOption';
      this.showTrumpOption = true;
      this.outputMessage = `Input trump selection card`;
    }
    else if (this.phase == 'selectTrumpOption'){
      this.onTurn = (this.dealerIndex+1)%4;
      this.trump = '';
      if (this.onTurn < 2){
        //Input trump decision made by player
        this.phase = 'inputTrumpCardDecision';
        this.outputMessage = `Input ${this.playerNames[this.onTurn]}'s trump decision`;
      }
      else {
        //Output trump decision made by bot
        this.phase = 'outputTrumpCardDecision';
        this.outputMessage = `${this.playerNames[this.onTurn]} declines`;
      }
    }
    else if (this.phase == 'inputTrumpCardDecision' || this.phase == 'outputTrumpCardDecision'){
      if (this.trump != ''){
        if (this.dealerIndex < 2){
          //Empty phase before starting trick
          this.phase = 'startTrick';
          this.outputMessage = 'Press submit to start trick';
        }
        else {
          //Output which card bot replaces
          this.phase = 'outputBotCardReplacement';
          //TODO: botCall
          //TODO: change botACards or botBCards, and cardsPlayed, and trump
          this.outputMessage = `${this.dealer} replaces XX card with XX`;
        }
      }
      else if (this.onTurn == this.dealerIndex){
        this.onTurn = (this.onTurn+1) % 4;
        if (this.onTurn < 2){
          //Input trump selection made by player
          this.phase = 'inputTrumpSelection';
          this.outputMessage = `Input ${this.playerNames[this.onTurn]}'s trump selection`;
        }
        else {
          //Output trump selection made by bot
          this.phase = 'outputTrumpSelection';
          //TODO: botCall
          //TODO: if trump selected, change trump, cardsPlayed
          this.outputMessage = `${this.playerNames[this.onTurn]} passes`;
        }
      }
      else {
        this.onTurn = (this.onTurn+1)%4;
        if (this.onTurn < 2){
          //Input trump decision made by player
          this.phase = 'inputTrumpCardDecision';
          this.outputMessage = `Input ${this.playerNames[this.onTurn]}'s trump decision`;
        }
        else {
          //Output trump decision made by bot
          this.phase = 'outputTrumpCardDecision';
          //TODO: botCall
          //TODO: if trump selected, change trump, possibly go to outputBotCardReplacement
          this.outputMessage = `${this.playerNames[this.onTurn]} declines`;
        }
      }
    }
    else if (this.phase == 'inputTrumpSelection' || this.phase == 'outputTrumpSelection'){
      if (this.trump != ''){
        //Empty phase before starting trick
        this.phase = 'startTrick';
        this.outputMessage = 'Press submit to start trick';
      }
      else {
        this.onTurn = (this.onTurn+1)%4;
        if (this.onTurn < 2){
          //Input trump selection made by player
          this.phase = 'inputTrumpSelection';
          this.outputMessage = `Input ${this.playerNames[this.onTurn]}'s trump selection`;
        }
        else {
          //Output trump selection made by bot
          this.phase = 'outputTrumpSelection';
          //TODO: botCall
          //TODO: if trump selected, change trump
          this.outputMessage = `${this.playerNames[this.onTurn]} passes`;
        }
      }
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
