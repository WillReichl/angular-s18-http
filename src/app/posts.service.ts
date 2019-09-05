import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Post } from './post.model';
import { map, catchError } from 'rxjs/operators';
import { Subject, throwError } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PostsService {
  error = new Subject<string>(); // error message

  constructor(private http: HttpClient) {}

  createAndStorePost(title: string, content: string) {
    const postData: Post = {
      title,
      content
    };
    this.http
      .post<{ name: string }>(
        'https://ng-complete-guide-48c3b.firebaseio.com/posts.json',
        postData
      )
      .subscribe(
        responseData => {
          console.log(responseData);
        },
        error => {
          this.error.next(error.message);
        }
      );
  }

  fetchPosts() {
    return this.http
      .get<{ [key: string]: Post }>(
        'https://ng-complete-guide-48c3b.firebaseio.com/posts.json',
        {
          headers: new HttpHeaders({
            'Custom-Header': 'Hello'
          })
        }
      )
      .pipe(
        map((responseData: { [key: string]: Post }) => {
          const postsArray: Post[] = [];
          for (const key in responseData) {
            if (responseData.hasOwnProperty(key)) {
              postsArray.push({ ...responseData[key], id: key });
            }
          }
          return postsArray;
        }),
        catchError(errorRes => {
          // Use this when you want to add an additional task on error -- send to analytics server, log, etc.
          // You can also customize the error message seen by the observable subscriber here.
          // But, then, pass along to subscribe...
          return throwError(errorRes);
          // or return throwError ({ message: 'Some custom message' });
        })
      );
  }

  deletePosts() {
    return this.http.delete(
      'https://ng-complete-guide-48c3b.firebaseio.com/posts.json'
    );
  }
}
