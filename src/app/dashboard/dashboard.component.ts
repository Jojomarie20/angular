import { Component } from '@angular/core';
import { CdkDrag, CdkDropList, CdkDragDrop, moveItemInArray, transferArrayItem } from '@angular/cdk/drag-drop';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { TodolistService } from '../todolist.service';
import { CommonModule } from '@angular/common';
import { DragDropComponent } from '../drag-drop-comp/drag-drop-comp.component';
import { AuthenticationService } from '../authentication.service';


interface Task {
  id: number;
  name: string;
  status: string; // Ensure 'status' is defined in your task object
  order: number;
  selected?: boolean;
}

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [DragDropComponent, CommonModule, ReactiveFormsModule, CdkDrag, CdkDropList, FormsModule],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css'
})
export class DashboardComponent {
  title = 'to_do_list';
  task: any;
  taskForm: FormGroup;
  editTaskForm: FormGroup;
  clickId: number = 0;
  userId = 2;
  todotask: any[] = [];
  inprogresstask: any[] = [];
  donetask: any[] = [];
  username: string = '';

  constructor(private api: TodolistService, private fb: FormBuilder, private auth: AuthenticationService) {
    this.taskForm = this.fb.group({
      task: ['', Validators.required],
      description: ['', Validators.required],
      due_date: ['', Validators.required],
      status: ['', Validators.required],
    });

    this.editTaskForm = this.fb.group({
      task: ['', Validators.required],
      description: ['', Validators.required],
      due_date: ['', Validators.required],
      status: ['', Validators.required],
    });
  }

  ngOnInit(): void {
    this.retrivetask();
    this.retrivedone();
    this.retriveinprogress();
    this.retrivetodo();
    this.auth.getCurrentUser().subscribe(user => {
      if (user && user.username) {
        this.username = user.username;
      } else {
        this.username = 'Make Your Tasks Organize';
      }
    });
  }

  retrivetask() {
    this.api.getTasks().subscribe((resp: any) => {
      const tasks = this.sortIT(resp.data);//inadd lang pero pwede tanggalin HAHAHAHAHA
      this.task = resp.data;
      console.log(this.task);
    });
  }

  //ADDING
  onSubmit() {
    if (this.taskForm.valid) {
      this.api.add_task(this.userId, this.taskForm.value).subscribe(
        (resp: any) => {
          console.log("You have added your task successfully!", resp);
          this.retrivetask();
          this.retrivedone();
          this.retriveinprogress();
          this.retrivetodo();
          this.taskForm.reset();
        }
      );
    }
  }

  //DELETING
  deleteTask(task: any) {
  const confirmed = confirm(`Are you sure you want to delete the task "${task.task}"?`);
  if (confirmed) {
    this.api.delete_task(task.id).subscribe(
      (resp: any) => {
        console.log("Task deleted successfully!", resp);
        this.retrivetask();
        this.retrivedone();
        this.retriveinprogress();
        this.retrivetodo();
      }
    );
  }
}
  

  //UPDATING & PATCHING THE ITEM DATA VALUE 
edit(id: number){
    this.clickId = id;
    const taskToEdit = this.getTaskById(id);
    if (taskToEdit) {
      this.editTaskForm.patchValue({
        task: taskToEdit.task,
        description: taskToEdit.description,
        due_date: taskToEdit.due_date,
        status: taskToEdit.status,
      });
    }
  }

  onEditSubmit() {
    if (this.editTaskForm.valid) {
      this.api.updatetask(this.clickId, this.editTaskForm.value).subscribe(
        (resp: any) => {
          console.log("You have edited your task successfully!", resp);
          console.log
          this.retrivetask();
          this.retrivedone();
          this.retriveinprogress();
          this.retrivetodo();
          this.editTaskForm.reset();
          this.retrivetask();
          this.retrivedone();
          this.retriveinprogress();
          this.retrivetodo();
        }
      );
    }
  }


  //RETRIEVING STATUS
  retrivedone() {
    this.api.getstatusTasks('done').subscribe((resp: any) => {
      const tasks = this.sortIT(resp.data);
      this.donetask = tasks;
      console.log(this.donetask);
    });
  }

  retriveinprogress() {
    this.api.getstatusTasks('inprogress').subscribe((resp: any) => {
      const tasks = this.sortIT(resp.data);
      this.inprogresstask = tasks;
      console.log(this.inprogresstask);
    });
  }

  retrivetodo() {
    this.api.getstatusTasks('todo').subscribe((resp: any) => {
      const tasks = this.sortIT(resp.data);
      this.todotask = tasks;
      console.log(this.todotask);
    });
  }
 
  sortIT(tasks: any[]): any[] {
    return tasks.sort((a, b) => (a.order ?? 0) - (b.order ?? 0));
  }


  //DRAG DROP AUTOMATIC STATUS UPDATING
  drop(event: CdkDragDrop<Task[]>): void {
    if (event.previousContainer === event.container) {
      // Same container: Reorder items
      moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
      this.updateTaskOrders(event.container.data); // Update order on the server
    } else {
      // Different containers: Transfer and reorder
      const movedTask = event.previousContainer.data[event.previousIndex];
      const newStatus = event.container.id;
  
      transferArrayItem(
        event.previousContainer.data,
        event.container.data,
        event.previousIndex,
        event.currentIndex
      );
  
      // Update the moved task with new status and order
      const updatedTask = { ...movedTask, status: newStatus, order: event.currentIndex + 1 };
      this.updateTaskStatus(updatedTask); // Update status on the server
    }
  }

  updateTaskOrders(tasks: Task[]): void {
    tasks.forEach((task, index) => {
      this.api.updateTaskOrder(task.id, index + 1).subscribe(
        (resp: any) => {
          console.log(`Task order updated successfully for task ID ${task.id}`, resp);
        },
        (error) => {
          console.error(`Failed to update task order for task ID ${task.id}`, error);
        }
      );
    });
  }

  updateTaskStatus(task: Task) {
    this.api.updateTaskStatus(task.id, task.status).subscribe(
      (resp: any) => {
        console.log("Task status updated successfully!", resp);
        this.retrivetask();
        this.retrivedone();
        this.retriveinprogress();
        this.retrivetodo();
        this.retrivetask();
        this.retrivedone();
        this.retriveinprogress();
        this.retrivetodo();
      },
      (error) => {
        console.error("Failed to update task status", error);
      }
    );
  }

  //MULTIPLE ACTIONS
  moveSelectedTasks(newStatus: string): void {
    const selectedTasks = this.getSelectedTasks();
    selectedTasks.forEach(task => {
      task.status = newStatus;
      this.updateTaskStatus(task);
    });
  }

  deleteSelectedTasks(): void {
    const selectedTasks = this.getSelectedTasks();
    selectedTasks.forEach(task => {
      this.deleteTask(task);
    });
  }

  getSelectedTasks(): Task[] {
    return [
      ...this.todotask.filter(task => task.selected),
      ...this.inprogresstask.filter(task => task.selected),
      ...this.donetask.filter(task => task.selected)
    ];
  }

  trackByFn(index: any, item: any) {
    return item.id;
  }

  //PATCHING THE ITEM DATA VALUE - kadugtong na code
  private getTaskById(id: number) {
    return this.todotask.concat(this.inprogresstask, this.donetask).find(task => task.id === id);
  }

  //TURNING RED THE ITEM IF THE DUEDATE HAS PASSED
  isOverdue(dueDate: string): boolean {
    const today = new Date();
    const due = new Date(dueDate);
    return due < today && !this.isSameDay(due, today);
  }

  ///TURNING BLUE THE ITEM 1 DAY BEFORE THE DUEDATE FOR REMINDING THE USER
  isDueTomorrow(due_date: string): boolean {
    const today = new Date();
    const dueDate = new Date(due_date);
    const oneDay = 24 * 60 * 60 * 1000; // milliseconds in one day
    return dueDate.getTime() - today.getTime() <= oneDay && dueDate.getTime() - today.getTime() > 0;
  }

  //DUE TO DAY
  isDueToday(dueDate: string): boolean {
    const today = new Date();
    const due = new Date(dueDate);
    return this.isSameDay(due, today);
  }

  private isSameDay(date1: Date, date2: Date): boolean {
    return date1.getFullYear() === date2.getFullYear() &&
      date1.getMonth() === date2.getMonth() &&
      date1.getDate() === date2.getDate();
  }

  logout() {
    this.auth.logout();
  }
}