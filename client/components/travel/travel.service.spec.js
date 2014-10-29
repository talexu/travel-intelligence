'use strict';

describe('Service: travel', function () {

  // load the service's module
  beforeEach(module('travelIntelligenceApp'));

  // instantiate service
  var travel;
  beforeEach(inject(function (_travel_) {
    travel = _travel_;
  }));

  it('should do something', function () {
    expect(!!travel).toBe(true);
  });

});
