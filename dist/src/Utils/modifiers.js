"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const ts = require("typescript");
function hasModifier(node, modifier) {
    const nodeModifiers = node.modifiers;
    if (nodeModifiers == null) {
        return false;
    }
    else {
        return nodeModifiers.some(nodeModifier => nodeModifier.kind === modifier);
    }
}
exports.hasModifier = hasModifier;
function isPublic(node) {
    return !(hasModifier(node, ts.SyntaxKind.PrivateKeyword) || hasModifier(node, ts.SyntaxKind.ProtectedKeyword));
}
exports.isPublic = isPublic;
function isStatic(node) {
    return hasModifier(node, ts.SyntaxKind.StaticKeyword);
}
exports.isStatic = isStatic;
//# sourceMappingURL=modifiers.js.map