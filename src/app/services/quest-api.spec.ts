import { TestBed } from '@angular/core/testing';

import { QuestApi } from './quest-api';

describe('QuestApi', () => {
  let service: QuestApi;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(QuestApi);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
