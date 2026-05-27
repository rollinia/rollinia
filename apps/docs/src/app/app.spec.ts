import { TestBed } from '@angular/core/testing';

import { App } from './app';

describe('App', () => {
  beforeEach(() => TestBed.configureTestingModule({ imports: [App] }));

  it('should create', () => {
    const fixture = TestBed.createComponent(App);
    expect(fixture.componentInstance).toBeTruthy();
  });
});
