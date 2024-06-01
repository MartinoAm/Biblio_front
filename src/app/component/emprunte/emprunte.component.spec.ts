import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EmprunteComponent } from './emprunte.component';

describe('EmprunteComponent', () => {
  let component: EmprunteComponent;
  let fixture: ComponentFixture<EmprunteComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EmprunteComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(EmprunteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
