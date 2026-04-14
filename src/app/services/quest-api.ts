import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, catchError, of } from 'rxjs';

export interface Quest {
  id: number;
  title: string;
  category: 'health' | 'mind' | 'body' | 'social';
  description: string;
  xp: number;
}

@Injectable({ providedIn: 'root' })
export class QuestApiService {

  private apiUrl = 'https://raw.githubusercontent.com/LiamAtu/Quest/master/quests.json';

  constructor(private http: HttpClient) {}

  getQuests(): Observable<Quest[]> {
    return this.http.get<Quest[]>(this.apiUrl).pipe(
      catchError(() => of([]))
    );
  }

  getQuestsByCategory(category: Quest['category']): Observable<Quest[]> {
    return this.http.get<Quest[]>(this.apiUrl).pipe(
      catchError(() => of([]))
    );
  }
}