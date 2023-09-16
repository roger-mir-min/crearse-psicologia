/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { EmSupportListComponent } from './em-support-list.component';

describe('EmSupportListComponent', () => {
  let component: EmSupportListComponent;
  let fixture: ComponentFixture<EmSupportListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EmSupportListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EmSupportListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
