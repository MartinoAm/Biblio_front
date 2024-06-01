import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MembreComponentsComponent } from './membre-components.component';

describe('MembreComponentsComponent', () => {
  let component: MembreComponentsComponent;
  let fixture: ComponentFixture<MembreComponentsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MembreComponentsComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(MembreComponentsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
