"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const glob = require("glob");
const path = require("path");
const ts = require("typescript");
const DiagnosticError_1 = require("../src/Error/DiagnosticError");
const LogicError_1 = require("../src/Error/LogicError");
const NoRootNamesError_1 = require("../src/Error/NoRootNamesError");
const NoTSConfigError_1 = require("../src/Error/NoTSConfigError");
function loadTsConfigFile(configFile) {
    const raw = ts.sys.readFile(configFile);
    if (raw) {
        const config = ts.parseConfigFileTextToJson(configFile, raw);
        if (config.error) {
            throw new DiagnosticError_1.DiagnosticError([config.error]);
        }
        else if (!config.config) {
            throw new LogicError_1.LogicError(`Invalid parsed config file "${configFile}"`);
        }
        const parseResult = ts.parseJsonConfigFileContent(config.config, ts.sys, path.dirname(configFile), {}, configFile);
        parseResult.options.noEmit = true;
        delete parseResult.options.out;
        delete parseResult.options.outDir;
        delete parseResult.options.outFile;
        delete parseResult.options.declaration;
        return parseResult;
    }
    else {
        throw new NoTSConfigError_1.NoTSConfigError();
    }
}
function getTsConfig(config) {
    if (config.tsconfig) {
        return loadTsConfigFile(config.tsconfig);
    }
    return {
        fileNames: [],
        options: {
            noEmit: true,
            emitDecoratorMetadata: true,
            experimentalDecorators: true,
            target: ts.ScriptTarget.ES5,
            module: ts.ModuleKind.CommonJS,
            strictNullChecks: false,
        },
    };
}
function createProgram(config) {
    const rootNamesFromPath = config.path ? glob.sync(path.resolve(config.path)) : [];
    const tsconfig = getTsConfig(config);
    const rootNames = rootNamesFromPath.length ? rootNamesFromPath : tsconfig.fileNames;
    if (!rootNames.length) {
        throw new NoRootNamesError_1.NoRootNamesError();
    }
    const program = ts.createProgram(rootNames, tsconfig.options);
    if (!config.skipTypeCheck) {
        const diagnostics = ts.getPreEmitDiagnostics(program);
        if (diagnostics.length) {
            throw new DiagnosticError_1.DiagnosticError(diagnostics);
        }
    }
    return program;
}
exports.createProgram = createProgram;
//# sourceMappingURL=program.js.map