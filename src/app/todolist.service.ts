import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class TodolistService {
  apiUrl = 'http://localhost/DEMO2/demoproject/api';

  constructor(private http: HttpClient) { }

  getTasks(){
    return this.http.get(`${this.apiUrl}/todolist/2`);
  }

  get1Tasks(taskid: number){
    return this.http.get(`${this.apiUrl}/1todolistt/${taskid}`);
  }

  getstatusTasks(status: string){
    return this.http.get(`${this.apiUrl}/todoliststatus/${status}`);
  }

  add_task(id: number, task: any) {
    return this.http.post(`${this.apiUrl}/add_task/${id}`, task);
  }

  updatetask(id: number, updated: any){
    return this.http.post(`${this.apiUrl}/updatetask/${id}`, updated);
  }

  delete_task(id: number){
    return this.http.post(`${this.apiUrl}/delete_task/${id}`, {});
  }

  updateTaskStatus(taskId: number, status: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/change_status/${taskId}`, { status });
  }

  updateTaskOrder(taskId: number, order: number): Observable<any> {
      return this.http.post(`${this.apiUrl}/update_task_order/${taskId}`, { order });
    }
 }

