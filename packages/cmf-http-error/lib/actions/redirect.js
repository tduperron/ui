"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.mapStatusCodeToPage = mapStatusCodeToPage;
exports.redirectToStatusCodePage = redirectToStatusCodePage;
exports.notFound = notFound;
exports.redirect = redirect;
exports.default = void 0;

var _get = _interopRequireDefault(require("lodash/get"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var specializedErrorPages = [404, 403];

function mapStatusCodeToPage(code) {
  if (specializedErrorPages.includes(code)) {
    return "/".concat(code);
  }

  return '/500';
}
/**
 * @param {Object} cmf error
 * @returns {Object} that will change webapp location to either /404 /403 or /500
 */


function redirectToStatusCodePage(error) {
  return {
    type: '@@router/CALL_HISTORY_METHOD',
    payload: {
      method: 'push',
      args: [mapStatusCodeToPage((0, _get.default)(error, 'stack.status'))]
    }
  };
}

function notFound() {
  return redirectToStatusCodePage({
    stack: {
      status: 404
    }
  });
}
/**
 * action creator
 * @param {Event} event which trigger this action
 * @param {Object} data {model,action} sub objects
 * @returns {Object} action
 */


function redirect(event) {
  var data = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
  var path = (0, _get.default)(data, 'action.path', '');

  if (data.model && data.model.id) {
    path = path.replace('$id', data.model.id);
  } else if (data.model && data.model.get) {
    path = path.replace('$id', data.model.get('id'));
  }

  return {
    type: '@@router/CALL_HISTORY_METHOD',
    payload: {
      method: 'push',
      args: [path]
    }
  };
}

var _default = {
  redirect: redirect,
  notFound: notFound,
  redirectToStatusCodePage: redirectToStatusCodePage
};
exports.default = _default;