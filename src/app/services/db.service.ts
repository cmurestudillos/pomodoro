import { Injectable } from '@angular/core';
import Dexie, { Table } from 'dexie';
import { PomodoroSession } from '../interfaces/pomodoro-session.interface';

@Injectable({
  providedIn: 'root'
})
export class DbService extends Dexie {
  pomodoroSessions!: Table<PomodoroSession, number>;

  constructor() {
    super('PomodoroDb');
    this.version(1).stores({
      pomodoroSessions: '++id, startTime, endTime, duration'
    });
  }

  async addSession(session: PomodoroSession): Promise<number> {
    return await this.pomodoroSessions.add(session);
  }

  async getSessions(): Promise<PomodoroSession[]> {
    return await this.pomodoroSessions.toArray();
  }
}
