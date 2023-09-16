/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { WomenCircleComponent } from './women-circle.component';

describe('WomenCircleComponent', () => {
  let component: WomenCircleComponent;
  let fixture: ComponentFixture<WomenCircleComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ WomenCircleComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(WomenCircleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
