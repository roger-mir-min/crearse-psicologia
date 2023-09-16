/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { EmSupportComponent } from './em-support.component';

describe('EmSupportComponent', () => {
  let component: EmSupportComponent;
  let fixture: ComponentFixture<EmSupportComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EmSupportComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EmSupportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
