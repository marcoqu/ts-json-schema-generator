"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const ts = require("typescript");
const BaseError_1 = require("./BaseError");
class DiagnosticError extends BaseError_1.BaseError {
    constructor(diagnostics) {
        super(diagnostics.map(diagnostic => ts.flattenDiagnosticMessageText(diagnostic.messageText, "\n")).join("\n\n"));
        this.diagnostics = diagnostics;
    }
    getDiagnostics() {
        return this.diagnostics;
    }
}
exports.DiagnosticError = DiagnosticError;
//# sourceMappingURL=DiagnosticError.js.map