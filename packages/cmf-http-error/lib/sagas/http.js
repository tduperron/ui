"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.handleHttpError = handleHttpError;
exports.httpHandler = httpHandler;
exports.default = void 0;

var _http = _interopRequireDefault(require("@talend/react-cmf/lib/sagas/http"));

var _constants = require("@talend/react-cmf/lib/middlewares/http/constants");

var _get = _interopRequireDefault(require("lodash/get"));

var _effects = require("redux-saga/effects");

var _sagas = require("../../../constants/sagas");

var _redirect = require("../actions/redirect");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var _marked =
/*#__PURE__*/
regeneratorRuntime.mark(handleHttpError),
    _marked2 =
/*#__PURE__*/
regeneratorRuntime.mark(httpHandler);

function handleHttpError(event, action) {
  return regeneratorRuntime.wrap(function handleHttpError$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          if (!(!event.error || !event.error.stack)) {
            _context.next = 2;
            break;
          }

          return _context.abrupt("return", (0, _effects.put)(_sagas.SAGA_FINISHED));

        case 2:
          if (!(0, _get.default)(action, 'options.silent')) {
            _context.next = 4;
            break;
          }

          return _context.abrupt("return", _sagas.SAGA_FINISHED);

        case 4:
          _context.t0 = event.error.stack.status;
          _context.next = _context.t0 === _constants.HTTP_STATUS.UNAUTHORIZED ? 7 : _context.t0 === _constants.HTTP_STATUS.FORBIDDEN ? 8 : _context.t0 === _constants.HTTP_STATUS.NOT_FOUND ? 8 : 11;
          break;

        case 7:
          return _context.abrupt("return", (0, _effects.put)(_sagas.SAGA_FINISHED));

        case 8:
          _context.next = 10;
          return (0, _effects.put)((0, _redirect.redirectToStatusCodePage)(event.error));

        case 10:
          return _context.abrupt("return", _context.sent);

        case 11:
          _context.next = 13;
          return (0, _effects.put)((0, _redirect.redirectToStatusCodePage)(event.error));

        case 13:
          return _context.abrupt("return", _context.sent);

        case 14:
        case "end":
          return _context.stop();
      }
    }
  }, _marked, this);
}

function httpHandler() {
  return regeneratorRuntime.wrap(function httpHandler$(_context2) {
    while (1) {
      switch (_context2.prev = _context2.next) {
        case 0:
          _context2.next = 2;
          return (0, _effects.takeLatest)('@@HTTP/ERRORS', handleHttpError);

        case 2:
        case "end":
          return _context2.stop();
      }
    }
  }, _marked2, this);
}

var _default = _http.default.create();

exports.default = _default;