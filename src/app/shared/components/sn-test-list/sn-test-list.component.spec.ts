import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SnTestListComponent } from './sn-test-list.component';

describe('SnTestListComponent', () => {
  let component: SnTestListComponent;
  let fixture: ComponentFixture<SnTestListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [SnTestListComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(SnTestListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
