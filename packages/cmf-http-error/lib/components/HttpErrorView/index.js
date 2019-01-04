"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _reactCmf = require("@talend/react-cmf");

var _HttpErrorView = _interopRequireDefault(require("./HttpErrorView.component"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var _default = (0, _reactCmf.cmfConnect)({
  omitCMFProps: true,
  withComponentRegistry: true,
  withDispatch: true,
  withDispatchActionCreator: true,
  withComponentId: true
})(_HttpErrorView.default);

exports.default = _default;