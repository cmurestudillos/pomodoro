import { TestBed, fakeAsync, tick } from '@angular/core/testing';
import { TimerService, TimerMode } from './timer.service';

describe('TimerService', () => {
  let service: TimerService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TimerService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should start timer and emit decreasing values', fakeAsync(() => {
    const emittedValues: number[] = [];
    service.timer$.subscribe(val => emittedValues.push(val));

    service.startTimer();
    tick(3000); // Simulate 3 seconds passing

    expect(emittedValues).toEqual([2700, 2699, 2698, 2697]);
  }));

  it('should stop timer', fakeAsync(() => {
    service.startTimer();
    tick(1000);
    service.stopTimer();
    tick(1000);

    expect(service.getCurrentTime()).toBe(2699); // Should have decreased by only 1
  }));

  it('should reset timer', () => {
    service.setMode(TimerMode.ShortBreak);
    service.resetTimer();
    expect(service.getCurrentTime()).toBe(900); // 15 minutes for short break
  });

  it('should change mode and reset timer', () => {
    service.setMode(TimerMode.LongBreak);
    expect(service.getCurrentMode()).toBe(TimerMode.LongBreak);
    expect(service.getCurrentTime()).toBe(1800); // 30 minutes for long break
  });

  it('should emit when timer completes', fakeAsync(() => {
    let completed = false;
    service.timerComplete$.subscribe(() => (completed = true));

    service.setMode(TimerMode.ShortBreak);
    service.startTimer();
    tick(900000); // 15 minutes

    expect(completed).toBe(true);
  }));
});
