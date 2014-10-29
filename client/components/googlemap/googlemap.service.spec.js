'use strict';

describe('Service: googlemap', function () {

  // load the service's module
  beforeEach(module('travelIntelligenceApp'));

  // instantiate service
  var googlemap;
  beforeEach(inject(function (_googlemap_) {
    googlemap = _googlemap_;
  }));

  it('should do something', function () {
    expect(!!googlemap).toBe(true);
  });

});
