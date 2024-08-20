import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { PomodoroComponent } from './pomodoro.component';
import { TimerService, TimerMode } from '../../services/timer.service';
import { DbService } from '../../services/db.service';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { BehaviorSubject, of } from 'rxjs';

describe('PomodoroComponent', () => {
  let component: PomodoroComponent;
  let fixture: ComponentFixture<PomodoroComponent>;
  let timerServiceSpy: jasmine.SpyObj<TimerService>;
  let dbServiceSpy: jasmine.SpyObj<DbService>;

  beforeEach(async () => {
    const timerSpy = jasmine.createSpyObj('TimerService', [
      'startTimer',
      'stopTimer',
      'resetTimer',
      'setMode',
    ]);
    const dbSpy = jasmine.createSpyObj('DbService', ['addSession']);

    timerSpy.timer$ = new BehaviorSubject(2700);
    timerSpy.mode$ = new BehaviorSubject(TimerMode.Pomodoro);
    timerSpy.timerComplete$ = of(void 0);

    await TestBed.configureTestingModule({
      declarations: [PomodoroComponent],
      imports: [MatButtonModule, MatProgressSpinnerModule, MatButtonToggleModule],
      providers: [
        { provide: TimerService, useValue: timerSpy },
        { provide: DbService, useValue: dbSpy },
      ],
    }).compileComponents();

    timerServiceSpy = TestBed.inject(TimerService) as jasmine.SpyObj<TimerService>;
    dbServiceSpy = TestBed.inject(DbService) as jasmine.SpyObj<DbService>;
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PomodoroComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should start timer when toggleTimer is called and timer is not running', () => {
    component.isRunning = false;
    component.toggleTimer();
    expect(component.isRunning).toBe(true);
    expect(timerServiceSpy.startTimer).toHaveBeenCalled();
  });

  it('should stop timer when toggleTimer is called and timer is running', () => {
    component.isRunning = true;
    component.toggleTimer();
    expect(component.isRunning).toBe(false);
    expect(timerServiceSpy.stopTimer).toHaveBeenCalled();
  });

  it('should reset timer when resetTimer is called', () => {
    component.resetTimer();
    expect(timerServiceSpy.resetTimer).toHaveBeenCalled();
    expect(component.isRunning).toBe(false);
  });

  it('should update mode when onModeChange is called', () => {
    component.onModeChange(TimerMode.ShortBreak);
    expect(timerServiceSpy.setMode).toHaveBeenCalledWith(TimerMode.ShortBreak);
  });

  it('should update display correctly', () => {
    component.updateDisplay(1500); // 25 minutes
    expect(component.minutes).toBe(25);
    expect(component.seconds).toBe(0);
  });

  it('should update progress correctly', () => {
    component.currentMode = TimerMode.Pomodoro;
    component.updateProgress(1350); // 22.5 minutes left out of 45
    expect(component.progress).toBeCloseTo(50, 0); // Expect about 50% progress
  });

  it('should call dbService.addSession when timer completes in Pomodoro mode', fakeAsync(() => {
    component.currentMode = TimerMode.Pomodoro;
    component.startTimer();
    tick(2700000); // Simulate 45 minutes passing
    expect(dbServiceSpy.addSession).toHaveBeenCalled();
  }));
});
