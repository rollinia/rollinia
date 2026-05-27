import { TestBed } from '@angular/core/testing';

import Home from './home';

describe('Home', () => {
  beforeEach(() => TestBed.configureTestingModule({ imports: [Home] }));

  it('should render title', async () => {
    const fixture = TestBed.createComponent(Home);
    await fixture.whenStable();
    expect(fixture.nativeElement.querySelector('h1')?.textContent).toContain(
      'rollinia',
    );
  });
});
