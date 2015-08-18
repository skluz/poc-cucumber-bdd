'use strict';

var logger = require('./logger')(module);

var Q = require('q');

var chai = require('chai');
var chaiAsPromised = require('chai-as-promised');
chai.use(chaiAsPromised);
var expect = chai.expect;

function valueClass(value) {
  if(typeof value === 'undefined') {
    return 'undefined';
  } else {
    return value.constructor.name;
  }
};

function expectElementEquals(promise, expected, message) {
  return promise.then(function (value) {
    logger.info('expectElementEquals [class:%s] - expected: [%s], value: [%s], message: [%s]', valueClass(value), expected, value, message);
    return expect(value).to.equal(expected, message);
  }, function(err) {
    logger.error('Error: ', err);
    return Q.reject(err);
  });
};

function expectElementDeepEquals(promise, expected, message) {
  return promise.then(function (value) {
    var s = 'unknown';
    if(Array.isArray(value)) {
      s = value.join(',')
    }
    logger.info('expectElementDeepEquals [class:%s] - expected: [%s], value: [%s], message: [%s]', valueClass(value), expected, s, message);
    return expect(value).to.deep.equal(expected, message);
  }, function(err) {
    logger.error('Error: ', err);
    return Q.reject(err);
  });
};

function expectElementTextEquals(element, expected, message) {
  return element.getText().then(function(text) {
    logger.info('expectElementTextEquals - expected: [%s], value: [%s], message: [%s]', expected, text, message);
    return expect(text).to.equal(expected, message);
  }, function(err) {
    logger.error('Error: ', err);
    return Q.reject(err);
  });
};

function expectElementTextMatch(element, regexp, message) {
  return element.getText().then(function(text) {
    logger.info('expectElementTextMatch - expected: [%s], value: [%s], message: [%s]', regexp, text, message);
    return expect(text).to.match(regexp, message);
  }, function(err) {
    logger.error('Error: ', err);
    return Q.reject(err);
  });
};

function expectArrayContains(array, key, message) {
  return array.then(function (values) {
    logger.info('expectArrayContains - array: [%s], key: [%s], message: [%s]', values, key, message);
    return expect(values).to.contains(key, message);
    }, function(err) {
      return Q.reject(err);
    });
};

function expectArrayLength(array, length, message) {
  return array.then(function (values) {
    logger.info('expectArrayLength - array: [%s], length: [%s], message: [%s]', values, length, message);
    return expect(values).to.have.length(length, message);
  }, function(err) {
    return Q.reject(err);
  });
};

function expectElementEnabledStatus(element, expectedStatus, message) {
  return element.isEnabled().then(function(isEnabled) {
    logger.info('expectElementEnabledStatus - element: [%s], expected: [%s], value: [%s], message: [%s]', element.locator().toString(), isEnabled, expectedStatus, message);
    return expect(isEnabled).to.be.equal(expectedStatus, message);
  });
};

function expectElementIsEnabled(element) {
  return expectElementEnabledStatus(element, true);
}

exports.static = function(scope) {
  scope.expectElementEquals = expectElementEquals;
  scope.expectElementDeepEquals = expectElementDeepEquals;
  scope.expectElementTextEquals = expectElementTextEquals;
  scope.expectElementTextMatch = expectElementTextMatch;
  scope.expectArrayContains = expectArrayContains;
  scope.expectArrayLength = expectArrayLength;
  scope.expectElementIsEnabled = expectElementIsEnabled;
};