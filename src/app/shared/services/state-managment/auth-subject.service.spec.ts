import { TestBed } from '@angular/core/testing';

import { AuthSubjectService } from './auth-subject.service';

describe('AuthSubjectService', () => {
  let service: AuthSubjectService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AuthSubjectService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
