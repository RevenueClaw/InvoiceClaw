"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const middleware = () => {
    return (req, res, next) => {
        console.log(`${req.method} ${req.path} - ${req.ip}`);
        next();
    };
};
exports.default = middleware;
