import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AppService {
  constructor(private httpClient: HttpClient) {}

  private TOPIC_LIST_URL = 'https://hacker-news.firebaseio.com/v0/askstories.json';

  private TOPIC_DETAILS_URL = 'https://hacker-news.firebaseio.com/v0/item/';

  getTopics(): Observable<number[]> {
    return this.httpClient.get(this.TOPIC_LIST_URL) as Observable<number[]>;
  }

  getTopicDetails(id: number): Observable<any> {
    return this.httpClient.get(`${this.TOPIC_DETAILS_URL}${id}.json`);
  }

  getTopicComments(id: number): Observable<any> {
    return this.httpClient.get(`${this.TOPIC_DETAILS_URL}${id}.json`);
  }
}
