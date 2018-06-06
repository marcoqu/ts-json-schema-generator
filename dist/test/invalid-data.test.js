"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const chai_1 = require("chai");
const path_1 = require("path");
const formatter_1 = require("../factory/formatter");
const parser_1 = require("../factory/parser");
const program_1 = require("../factory/program");
const SchemaGenerator_1 = require("../src/SchemaGenerator");
function assertSchema(name, type, message) {
    it(name, () => {
        const config = {
            path: path_1.resolve(`test/invalid-data/${name}/*.ts`),
            type: type,
            expose: "export",
            topRef: true,
            jsDoc: "none",
        };
        const program = program_1.createProgram(config);
        const generator = new SchemaGenerator_1.SchemaGenerator(program, parser_1.createParser(program, config), formatter_1.createFormatter(config));
        chai_1.assert.throws(() => generator.createSchema(type), message);
    });
}
describe("invalid-data", () => {
    assertSchema("script-empty", "MyType", `No root type "MyType" found`);
    assertSchema("literal-index-type", "MyType", `Unknown node " ["abc", "def"]`);
    assertSchema("literal-array-type", "MyType", `Unknown node " ["abc", "def"]`);
    assertSchema("literal-object-type", "MyType", `Unknown node " {abc: "def"}`);
});
//# sourceMappingURL=invalid-data.test.js.map