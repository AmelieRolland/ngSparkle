import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ArticlesCrudComponent } from './articles-crud.component';

describe('ArticlesCrudComponent', () => {
  let component: ArticlesCrudComponent;
  let fixture: ComponentFixture<ArticlesCrudComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ArticlesCrudComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ArticlesCrudComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
