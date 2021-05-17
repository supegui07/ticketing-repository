"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.requireAuth = void 0;
var unauthorized_request_error_1 = require("../errors/unauthorized-request-error");
var requireAuth = function (req, res, next) {
    if (!req.currentUser) {
        throw new unauthorized_request_error_1.UnauthorizedRequestError;
    }
    next();
};
exports.requireAuth = requireAuth;
