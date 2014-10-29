'use strict';

describe('Service: frontend', function () {

  // load the service's module
  beforeEach(module('travelIntelligenceApp'));

  // instantiate service
  var frontend;
  beforeEach(inject(function (_frontend_) {
    frontend = _frontend_;
  }));

  it('should do something', function () {
    expect(!!frontend).toBe(true);
  });

});
