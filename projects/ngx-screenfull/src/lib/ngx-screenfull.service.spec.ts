import { TestBed } from '@angular/core/testing';
import { NgxScreenfullService } from './ngx-screenfull.service';


describe('NgxScreenfullService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: NgxScreenfullService = TestBed.get(NgxScreenfullService);
    expect(service).toBeTruthy();
  });

  // it('should resolve promise on toggle', () => {
  //   const service: NgxScreenfullService = TestBed.get(NgxScreenfullService);
  //   const element = document.createElement('div');
  //   element.innerHTML = '<span>foobar</span>';
  //   element.setAttribute('width', '300px');
  //   element.setAttribute('height', '300px');
  //   //
  //   return expectAsync(service.toggle(element)).toBeResolved();
  // });

});
