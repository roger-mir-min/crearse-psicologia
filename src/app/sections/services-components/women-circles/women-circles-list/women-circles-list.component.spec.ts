/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { WomenCircleListComponent } from './women-circles-list.component';

describe('WomenCircleListComponent', () => {
  let component: WomenCircleListComponent;
  let fixture: ComponentFixture<WomenCircleListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ WomenCircleListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(WomenCircleListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
