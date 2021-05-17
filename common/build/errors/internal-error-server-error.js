"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.InternalErrorServer = void 0;
var custom_error_1 = require("./custom-error");
var InternalErrorServer = /** @class */ (function (_super) {
    __extends(InternalErrorServer, _super);
    function InternalErrorServer(message) {
        var _this = _super.call(this, 'Internal error server') || this;
        _this.message = message;
        _this.statusCode = 501;
        Object.setPrototypeOf(_this, InternalErrorServer.prototype);
        return _this;
    }
    InternalErrorServer.prototype.serializeErrors = function () {
        return [{ message: this.message }];
    };
    return InternalErrorServer;
}(custom_error_1.CustomError));
exports.InternalErrorServer = InternalErrorServer;
