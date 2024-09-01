import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DragDropComponent } from './drag-drop-comp.component';

describe('DragDropCompComponent', () => {
  let component: DragDropComponent;
  let fixture: ComponentFixture<DragDropComponent>;

  beforeEach(() => {
    fixture = TestBed.createComponent(DragDropComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should compile', () => {
    expect(component).toBeTruthy();
  });
});
