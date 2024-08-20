import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, Subscription, timer, Subject } from 'rxjs';

export enum TimerMode {
  Pomodoro,
  ShortBreak,
  LongBreak
}

@Injectable({
  providedIn: 'root'
})
export class TimerService {
  private timerSubject = new BehaviorSubject<number>(2700); // 45 minutos en segundos
  private modeSubject = new BehaviorSubject<TimerMode>(TimerMode.Pomodoro);
  private timerCompleteSubject = new Subject<void>();
  private timerSubscription?: Subscription;

  timer$: Observable<number> = this.timerSubject.asObservable();
  mode$: Observable<TimerMode> = this.modeSubject.asObservable();
  timerComplete$: Observable<void> = this.timerCompleteSubject.asObservable();

  private durations = {
    [TimerMode.Pomodoro]: 2700, // 45 minutos
    [TimerMode.ShortBreak]: 900, // 15 minutos
    [TimerMode.LongBreak]: 1800 // 30 minutos
  };

  startTimer() {
    this.timerSubscription = timer(0, 1000).subscribe(() => {
      const currentValue = this.timerSubject.value;
      if (currentValue > 0) {
        this.timerSubject.next(currentValue - 1);
      } else {
        this.stopTimer();
        this.timerCompleteSubject.next();
      }
    });
  }

  stopTimer() {
    this.timerSubscription?.unsubscribe();
  }

  resetTimer() {
    this.stopTimer();
    const currentMode = this.modeSubject.value;
    this.timerSubject.next(this.durations[currentMode]);
  }

  setMode(mode: TimerMode) {
    this.modeSubject.next(mode);
    this.resetTimer();
  }

  getCurrentTime(): number {
    return this.timerSubject.value;
  }

  getCurrentMode(): TimerMode {
    return this.modeSubject.value;
  }
}
