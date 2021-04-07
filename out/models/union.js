"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const union_case_1 = require("./union_case");
class Union {
    constructor(name, cases) {
        this.name = name;
        this.cases = cases;
    }
    static findUnionCases(input) {
        const unionCaseRegex = /factory\s(.*)=>?\s*(.*);/g;
        let matches = input.match(unionCaseRegex);
        if (matches == null) {
            return [];
        }
        let unionCases = [];
        for (const match of matches) {
            const unionCase = union_case_1.default.fromMatchString(match);
            if (unionCase == null) {
                continue;
            }
            unionCases.push(unionCase);
        }
        return unionCases;
    }
    static fromString(input) {
        const classNameRegex = /(?<=(class\s))([A-Z][a-zA-Z0-9]*)/;
        const match = input.match(classNameRegex);
        if (match == null) {
            return null;
        }
        const className = match[0];
        const cases = this.findUnionCases(input);
        return new Union(className, cases);
    }
    toWhenDartCode() {
        const whenArgs = this.cases.map((e) => e.toWhenArgDartCode()).join('\n    ');
        const whenIs = this.cases.map((e) => e.toWhenIsDartCode()).join('\n');
        const isDefault = `${this.cases[0].factoryName}.call(this as ${this.cases[0].name});`;
        const dartCode = `
  void when({
    ${whenArgs}
  }) {
${whenIs}
    ${isDefault}
  }
`;
        return dartCode;
    }
    toMapDartCode() {
        const mapArgs = this.cases.map((e) => e.toMapArgDartCode()).join('\n    ');
        const mapIs = this.cases.map((e) => e.toMapIsDartCode()).join('\n');
        const isDefault = `${this.cases[0].factoryName}.call(this as ${this.cases[0].name});`;
        const dartCode = `
  R map<R>({
    ${mapArgs}
  }) {
${mapIs}
    return ${isDefault}
  }
`;
        return dartCode;
    }
    toDartCode() {
        const factories = this.cases.map((e) => e.toFactoryDartCode(this.name)).join('\n  ');
        const classes = this.cases.map((e) => e.toClassDartCode(this.name)).join('\n');
        const dartCode = `
abstract class ${this.name} {
  const ${this.name}();
  ${factories}
  ${this.toWhenDartCode()}
  ${this.toMapDartCode()}
  }

${classes}
`;
        return dartCode;
    }
}
exports.default = Union;
//# sourceMappingURL=union.js.map