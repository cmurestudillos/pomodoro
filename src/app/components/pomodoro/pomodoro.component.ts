import { Component, OnInit, OnDestroy } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { CommonModule } from '@angular/common';
import { DbService } from '../../services/db.service';
import { TimerService, TimerMode } from '../../services/timer.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-pomodoro',
  standalone: true,
  imports: [CommonModule, MatButtonModule, MatProgressSpinnerModule, MatButtonToggleModule],
  templateUrl: './pomodoro.component.html',
  styleUrl: './pomodoro.component.scss'
})

export class PomodoroComponent implements OnInit, OnDestroy {
  TimerMode = TimerMode; // Exponer el enum para usar en el template
  isRunning = false;
  minutes = 45;
  seconds = 0;
  progress = 100;
  currentMode = TimerMode.Pomodoro;
  private timerSubscription?: Subscription;
  private modeSubscription?: Subscription;
  private timerCompleteSubscription?: Subscription;
  private startTime?: Date;
  private audio: AudioContext;

  constructor(
    private dbService: DbService,
    private timerService: TimerService
  ) {
    this.audio = new (window.AudioContext || (window as any).webkitAudioContext)();
  }

  ngOnInit() {
    this.timerSubscription = this.timerService.timer$.subscribe(
      (timeRemaining) => {
        this.updateDisplay(timeRemaining);
        this.updateProgress(timeRemaining);
      }
    );

    this.modeSubscription = this.timerService.mode$.subscribe(
      (mode) => {
        this.currentMode = mode;
        this.resetTimer();
      }
    );

    this.timerCompleteSubscription = this.timerService.timerComplete$.subscribe(
      () => {
        this.onTimerComplete();
        this.playSound();
      }
    );
  }

  ngOnDestroy() {
    this.timerSubscription?.unsubscribe();
    this.modeSubscription?.unsubscribe();
    this.timerCompleteSubscription?.unsubscribe();
  }

  onModeChange(mode: TimerMode) {
    this.timerService.setMode(mode);
  }

  toggleTimer() {
    if (this.isRunning) {
      this.pauseTimer();
    } else {
      this.startTimer();
    }
  }

  startTimer() {
    this.isRunning = true;
    this.startTime = new Date();
    this.timerService.startTimer();
  }

  pauseTimer() {
    this.isRunning = false;
    this.timerService.stopTimer();
  }

  resetTimer() {
    this.isRunning = false;
    this.timerService.resetTimer();
    const currentTime = this.timerService.getCurrentTime();
    this.updateDisplay(currentTime);
    this.updateProgress(currentTime);
  }

  updateDisplay(timeRemaining: number) {
    this.minutes = Math.floor(timeRemaining / 60);
    this.seconds = timeRemaining % 60;
  }

  updateProgress(timeRemaining: number) {
    const totalSeconds = this.getTotalSeconds();
    this.progress = (timeRemaining / totalSeconds) * 100;
  }

  getTotalSeconds(): number {
    switch (this.currentMode) {
      case TimerMode.Pomodoro:
        return 45 * 60;
      case TimerMode.ShortBreak:
        return 15 * 60;
      case TimerMode.LongBreak:
        return 30 * 60;
    }
  }

  async onTimerComplete() {
    this.isRunning = false;
    if (this.startTime && this.currentMode === TimerMode.Pomodoro) {
      const endTime = new Date();
      const duration = (endTime.getTime() - this.startTime.getTime()) / 1000;
      await this.dbService.addSession({ startTime: this.startTime, endTime, duration });
    }
    this.resetTimer();
  }

  playSound() {
    const oscillator = this.audio.createOscillator();
    oscillator.type = 'sine';
    oscillator.frequency.setValueAtTime(440, this.audio.currentTime); // 440 Hz es la nota 'A'
    oscillator.connect(this.audio.destination);
    oscillator.start();
    oscillator.stop(this.audio.currentTime + 1); // Suena durante 1 segundo
  }
}
