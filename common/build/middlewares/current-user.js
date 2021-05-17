"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.currentUser = void 0;
var jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
var config_1 = require("config");
var currentUser = function (req, res, next) {
    var _a;
    var sessionCookie = (_a = req.session) === null || _a === void 0 ? void 0 : _a.jwt;
    if (!sessionCookie) {
        next();
    }
    try {
        var payload = jsonwebtoken_1.default.verify(sessionCookie, config_1.get('jwtConfig.secretKey'));
        req.currentUser = payload;
        next();
    }
    catch (error) { }
    next();
};
exports.currentUser = currentUser;
