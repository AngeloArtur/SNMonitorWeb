import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SnTestDialogComponent } from './sn-test-dialog.component';

describe('SnTestDialogComponent', () => {
  let component: SnTestDialogComponent;
  let fixture: ComponentFixture<SnTestDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [SnTestDialogComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(SnTestDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
