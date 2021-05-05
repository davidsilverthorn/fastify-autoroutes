"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.errorLabel = void 0;
var fastify_plugin_1 = __importDefault(require("fastify-plugin"));
var process_1 = __importDefault(require("process"));
var path_1 = __importDefault(require("path"));
var fs_1 = __importDefault(require("fs"));
exports.errorLabel = '[ERROR] fastify-autoload:';
var validMethods = [
    'delete',
    'get',
    'head',
    'patch',
    'post',
    'put',
    'options',
];
function scan(fastify, baseDir, current, log) {
    if (log === void 0) { log = false; }
    var combined = path_1.default.join(baseDir, current);
    var combinedStat = fs_1.default.statSync(combined);
    if (combinedStat.isDirectory()) {
        if (!path_1.default.basename(current).startsWith('_')) {
            for (var _i = 0, _a = fs_1.default.readdirSync(combined); _i < _a.length; _i++) {
                var entry = _a[_i];
                scan(fastify, baseDir, path_1.default.join(current, entry), log);
            }
        }
    }
    else if (isAcceptableFile(combined, combinedStat)) {
        autoload(fastify, combined, pathToUrl(current), log);
    }
}
function isAcceptableFile(file, stat) {
    return ((file.endsWith('.js') || file.endsWith('.ts')) &&
        !path_1.default.basename(file).startsWith('.') &&
        !path_1.default.basename(file).startsWith('_') &&
        !file.endsWith('.map') &&
        !file.endsWith('.test.js') &&
        !file.endsWith('.test.ts') &&
        stat.isFile());
}
function pathToUrl(filePath) {
    var url = '/' + filePath.replace('.ts', '').replace('.js', '').replace('index', '');
    if (url.length === 1)
        return url;
    return url
        .split(path_1.default.sep)
        .map(function (part) { return replaceParamsToken(part); })
        .join('/');
}
function replaceParamsToken(token) {
    var regex = /{.+}/g;
    var result;
    while ((result = regex.exec(token)) !== null) {
        token =
            token.substring(0, result.index) +
                result[0].replace('{', ':').replace('}', '') +
                token.substr(result.index + result[0].length);
    }
    return token;
}
function autoload(fastify, fullPath, url, log) {
    var module = loadModule(fullPath, log);
    if (typeof module !== 'function') {
        throw new Error(exports.errorLabel + " module " + fullPath + " must be valid js/ts module and should export route methods definitions");
    }
    var routes = module(fastify);
    for (var _i = 0, _a = Object.entries(routes); _i < _a.length; _i++) {
        var _b = _a[_i], method = _b[0], route = _b[1];
        if (validMethods.includes(method)) {
            route.url = url;
            route.method = method.toUpperCase();
            fastify.route(route);
            if (log) {
                console.info(method.toUpperCase() + " " + url + " => " + fullPath);
            }
        }
    }
}
function loadModule(path, log) {
    var module = require(path);
    if (typeof module === 'function') {
        return module;
    }
    if (typeof module === 'object' && 'default' in module) {
        return module.default;
    }
    return;
}
exports.default = fastify_plugin_1.default(function (fastify, options, next) {
    var _a;
    var log = (_a = options.log) !== null && _a !== void 0 ? _a : true;
    if (!options.dir) {
        var message = exports.errorLabel + " dir must be specified";
        log && console.error(message);
        return next(new Error(message));
    }
    if (typeof options.dir !== 'string') {
        var message = exports.errorLabel + " dir must be the path of autoroutes-directory";
        log && console.error(message);
        return next(new Error(message));
    }
    var dirPath;
    if (path_1.default.isAbsolute(options.dir)) {
        dirPath = options.dir;
    }
    else if (path_1.default.isAbsolute(process_1.default.argv[1])) {
        dirPath = path_1.default.join(process_1.default.argv[1], '..', options.dir);
    }
    else {
        dirPath = path_1.default.join(process_1.default.cwd(), process_1.default.argv[1], '..', options.dir);
    }
    if (!fs_1.default.existsSync(dirPath)) {
        var message = exports.errorLabel + " dir " + dirPath + " does not exists";
        log && console.error(message);
        return next(new Error(message));
    }
    if (!fs_1.default.statSync(dirPath).isDirectory()) {
        var message = exports.errorLabel + " dir " + dirPath + " must be a directory";
        log && console.error(message);
        return next(new Error(message));
    }
    try {
        scan(fastify, dirPath, '', options.log);
    }
    catch (error) {
        log && console.error(error.message);
        return next(error);
    }
    finally {
        return next();
    }
}, {
    fastify: '>=3.0.0',
    name: 'fastify-autoroutes',
});
//# sourceMappingURL=index.js.map