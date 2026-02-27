/* eslint-disable no-unused-vars */
/* eslint-disable no-undef */

// Type checkers
export const isArray = function (value) {
    return Array.isArray(value);
};

export const isFunction = function (value) {
    return typeof value === "function";
};

export const isNumber = function (value) {
    return typeof value === "number" && !isNaN(value);
};

export const isObject = function (value) {
    return typeof value === "object" && value !== null && !isArray(value);
};

export const isString = function (value) {
    return typeof value === "string";
};

export const isUndefined = function (value) {
    return value === undefined || typeof value === "undefined";
};

export const isNull = function (value) {
    return value === null;
};

export const isBoolean = function (value) {
    return typeof value === "boolean";
};

export const isTrue = function (value) {
    return value === true;
};

export const isFalse = function (value) {
    return value === false;
};

export const isDate = function (value) {
    return value instanceof Date;
};

export const isEmpty = function (value) {
    return (
        isUndefined(value) ||
        isNull(value) ||
        (isString(value) && value === "") ||
        (isNumber(value) && (value === 0 || isNaN(value))) ||
        (isArray(value) && value.length === 0) ||
        (isObject(value) && Object.keys(value).length === 0) ||
        false
    );
};
