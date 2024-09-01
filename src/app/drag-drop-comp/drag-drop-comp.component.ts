import { Component, OnInit } from '@angular/core';
import { CdkDrag, CdkDropList, CdkDragDrop, moveItemInArray, transferArrayItem } from '@angular/cdk/drag-drop';
import { TodolistService } from '../todolist.service';
import { CommonModule } from '@angular/common';


@Component({
  selector: 'app-drag-drop-comp',
  templateUrl: './drag-drop-comp.component.html',
  styleUrl: './drag-drop-comp.component.css',
  standalone: true,
  imports: [CdkDrag, CdkDropList, CommonModule
  ]
})



export class DragDropComponent implements OnInit {
task: any;
todotask: any;
inprogresstask: any;
donetask: any;
  constructor(private api: TodolistService){
    
  }
deleteItem(arg0: string,_t33: any) {
throw new Error('Method not implemented.');
}
editItem(arg0: string,_t33: any) {
throw new Error('Method not implemented.');
}
  todo = [
    'Get to work',
    'Pick up groceries',
    'Go home',
    'Fall asleep'
  ];

  inProgress = [
    'Get up',
    'Brush teeth',
    'Take a shower',
    'Check e-mail',
  ];
  done = [
    'Get up',
    'Brush teeth',
    'Take a shower',
    'Check e-mail',
    'Walk dog'
  ];

  ngOnInit(): void {
    this.retrivetask();
    this.retrivedone();
    this.retriveinprogress();
    this.retrivetodo();
}

retrivedone(){
  this.api.getstatusTasks('done').subscribe((resp: any) => {
    this.donetask = resp.data;
    console.log(this.donetask);
  }
  );
}


retriveinprogress(){
  this.api.getstatusTasks('inprogress').subscribe((resp: any) => {
    this.inprogresstask = resp.data;
    console.log(this.inprogresstask);
  }
  );
}


retrivetodo(){
  this.api.getstatusTasks('todo').subscribe((resp: any) => {
    this.todotask = resp.data;
    console.log(this.todotask);
  }
  );
}

retrivetask(){
  this.api.getTasks().subscribe((resp: any) => {
    this.task = resp.data;
    console.log(this.task);
  }
  );
}

  drop(event: CdkDragDrop<string[]>): void {
    if (event.previousContainer === event.container) {
      moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
    } else {
      transferArrayItem(event.previousContainer.data,
          event.container.data,
          event.previousIndex,
          event.currentIndex);
    }
  }
}