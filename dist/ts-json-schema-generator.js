"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const commander = require("commander");
const stringify = require("json-stable-stringify");
const generator_1 = require("./factory/generator");
const Config_1 = require("./src/Config");
const BaseError_1 = require("./src/Error/BaseError");
const formatError_1 = require("./src/Utils/formatError");
const args = commander
    .option("-p, --path <path>", "Source file path")
    .option("-t, --type <name>", "Type name")
    .option("-f, --tsconfig <path>", "Custom tsconfig.json path")
    .option("-e, --expose <expose>", "Type exposing", /^(all|none|export)$/, "export")
    .option("-r, --no-top-ref", "Do not create a top-level $ref definition")
    .option("-j, --jsDoc <extended>", "Read JsDoc annotations", /^(none|basic|extended)$/, "extended")
    .option("-u, --unstable", "Do not sort properties")
    .option("-s, --strict-tuples", "Do not allow additional items on tuples")
    .option("-c, --no-type-check", "Skip type checks to improve performance")
    .option("-f, --typeFile <typeFile>", "Name of the file containing the type")
    .option("-k, --validationKeywords [value]", "Provide additional validation keywords to include", (value, list) => list.concat(value), [])
    .parse(process.argv);
const config = Object.assign(Object.assign({}, Config_1.DEFAULT_CONFIG), { path: args.path, tsconfig: args.tsconfig, type: args.type, expose: args.expose, topRef: args.topRef, jsDoc: args.jsDoc, sortProps: !args.unstable, typeFile: args.typeFile, skipTypeCheck: !args.typeCheck, extraJsonTags: args.validationKeywords });
try {
    const schema = generator_1.createGenerator(config).createSchema(args.type, args.typeFile);
    process.stdout.write(config.sortProps ? stringify(schema, { space: 2 }) : JSON.stringify(schema, null, 2));
}
catch (error) {
    if (error instanceof BaseError_1.BaseError) {
        process.stderr.write(formatError_1.formatError(error));
        process.exit(1);
    }
    else {
        throw error;
    }
}
//# sourceMappingURL=ts-json-schema-generator.js.map