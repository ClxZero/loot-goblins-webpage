import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HofComponent } from './hof.component';

describe('HofComponent', () => {
  let component: HofComponent;
  let fixture: ComponentFixture<HofComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HofComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(HofComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
