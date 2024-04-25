import { CommonModule } from '@angular/common';
import { Component, OnDestroy, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { AppService } from '../services/app.service';
import {
  BehaviorSubject,
  EMPTY,
  Observable,
  Subject,
  catchError,
  concatMap,
  delay,
  forkJoin,
  map,
  switchMap,
  takeUntil,
  tap,
  throwError,
} from 'rxjs';
import { setLoaders } from '../utils/loaders';
import { Topic } from '../interfaces/Topic';
import { Comment } from '../interfaces/Comment';
import { UnixTimeToRelativeFormat } from '../pipes/relative-date-format.pipe';
import { Dialog, DialogModule, DialogRef } from '@angular/cdk/dialog';
import { DomSanitizer } from '@angular/platform-browser';
import { SnackbarService } from '../services/snackbar.service';

@Component({
  selector: 'app-topics',
  templateUrl: './topics.component.html',
  styleUrls: ['./topics.component.css'],
  standalone: true,
  imports: [CommonModule, UnixTimeToRelativeFormat, DialogModule],
})
export class TopicsComponent implements OnInit, OnDestroy {
  private destroy$ = new Subject<void>();

  constructor(
    private appService: AppService,
    private snackbarService: SnackbarService,
    private dialogService: Dialog,
    private sanitized: DomSanitizer
  ) {}

  @ViewChild('commentsTpl') commentsTpl: TemplateRef<any> | null = null;

  loaders$: BehaviorSubject<any> = new BehaviorSubject({});

  topicLists$: Observable<{ first: Topic[]; second: Topic[]; third: Topic[]; fourth: Topic[]; fifth: Topic[] }> = EMPTY;

  dialogRef: DialogRef<any> | null = null;

  ngOnInit(): void {
    this.topicLists$ = this.getTopics();
  }

  getTopics(): Observable<any> {
    return this.appService.getTopics().pipe(
      // delay(200),
      // switchMap(() => throwError('Error fetching topics')),
      setLoaders(this.loaders$, 'getTopics'),
      catchError(error => {
        this.snackbarService.open(error || 'Error fetching topics', -1, 'error');
        return EMPTY;
      }),
      concatMap((topics: number[]) =>
        forkJoin(topics.map((topic: number) => this.appService.getTopicDetails(topic))).pipe(
          // delay(200),
          // switchMap(() => throwError('Error')),
          setLoaders(this.loaders$, 'getTopics'),
          catchError(error => {
            console.log(error);
            this.snackbarService.open(error || 'Error fetching topics', 5000, 'error');
            return EMPTY;
          }),
          map((topics: Topic[]) => {
            const chuncks = topics.length >= 20 ? topics.slice(0, 20) : topics;
            return chuncks.reduce((acc, curr, idx) => {
              const index = idx;
              const key = ['first', 'second', 'third', 'fourth', 'fifth'];
              const chunkIndex = Math.floor(index / 4);
              acc[key[chunkIndex]] = acc[key[chunkIndex]] || [];
              acc[key[chunkIndex]].push(curr);
              return acc;
            }, {} as Record<string, Topic[]>);
          }),
          tap(() => window.scrollTo(0, 0))
        )
      )
    );
  }

  openComment(topic: Topic, commentId: number[] | number) {
    const sourceComment = Array.isArray(commentId) ? commentId : [commentId];
    forkJoin(sourceComment.map((id: number) => this.appService.getTopicDetails(id)))
      .pipe(
        // delay(300),
        // switchMap(() => throwError('Error fetching comments')),
        setLoaders(this.loaders$, 'getComments', topic.id.toString()),
        catchError(error => {
          console.log(error);
          this.snackbarService.open(error || 'Error fetching comments', 5000, 'error');
          return EMPTY;
        }),
        tap((comments: Comment[]) => {
          this.dialogRef = this.dialogService.open(this.commentsTpl as TemplateRef<any>, {
            width: '600px',
            panelClass: ['bg-white', 'rounded-md'],
            data: {
              topic,
              comments: comments.map((comment: Comment) => ({
                ...comment,
                text: this.sanitized.bypassSecurityTrustHtml(
                  `<p class="font-semibold text-sm mb-2">Commenter Level 1</p> <span>${comment.text}</span>`
                ),
              })),
            },
          });
        }),
        takeUntil(this.destroy$)
      )
      .subscribe();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
