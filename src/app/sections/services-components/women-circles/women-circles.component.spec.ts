/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { WomensCircleComponent } from './women-circles.component';

describe('WomensCircleComponent', () => {
  let component: WomensCircleComponent;
  let fixture: ComponentFixture<WomensCircleComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ WomensCircleComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(WomensCircleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
