"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _HttpErrorView = _interopRequireDefault(require("./components/HttpErrorView"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var _default = {
  id: 'cmf-http-error',
  components: {
    HttpErrorView: _HttpErrorView.default
  }
};
exports.default = _default;