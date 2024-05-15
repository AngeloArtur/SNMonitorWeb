import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SnTestLogComponent } from './sn-test-log.component';

describe('SnTestLogComponent', () => {
  let component: SnTestLogComponent;
  let fixture: ComponentFixture<SnTestLogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [SnTestLogComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(SnTestLogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
