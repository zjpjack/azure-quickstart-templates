require('it-each')({ testPerIteration: true });

var fs = require('fs');
var util = require('./util');
const filesFolder = './';
var path = require('path');
var chai = require('chai');
//var assert = chai.assert; // Using Assert style
//var expect = chai.expect; // Using Expect style
var XMLHttpRequest = require("xmlhttprequest").XMLHttpRequest;
var tv4 = require('tv4');
var jsonlint = require('jsonlint');
var should = chai.should();

var folder = process.env.npm_config_folder || filesFolder;

var jsonFiles = util.getFiles(folder, '.json');

/** Validates every AMP solution must have a top-level mainTemplate.json template and a createUIDefinition.json. */
describe('a top-level mainTemplate.json and a createUIDefinition.json exist in folder - ', () => {
    it('maintemplate.json must exist', () => {
        try {
            var fileString = fs.readFileSync(folder + '\\mainTemplate.json', {
                encoding: 'utf8'
            }).trim();
        } catch(e) {
            should.fail(null, null, ' Every AMP solution must have a top-level mainTemplate.json. ');
        }
    });
    it('createUIDefinition.json must exist', () => {
        try {
            var fileString = fs.readFileSync(folder + '\\createUIDefinition.json', {
                encoding: 'utf8'
            }).trim();
        } catch(e) {
            should.fail(null, null, ' Every AMP solution must have a createUIDefinition.json. ');
        }
    });
});

/** Validates all json files in the given folder are valid. */
describe('json files in folder - ', () => {
    // TODO: test ALL json files in subfolders are also returned here
    it.each(jsonFiles, '%s must be a valid json', ['element'], function(element, next) {
        var fileString = fs.readFileSync(path.resolve(folder, element), {
            encoding: 'utf8'
        }).trim();
        try {
            jsonlint.parse(fileString);
        } catch (e) {
            should.fail(null, null, element + ' is not a valid json. ' + e);
        }
        next();
    });
});

var xhr = new XMLHttpRequest();
var createUISchemaURL = 'https://schema.management.azure.com/schemas/0.1.2-preview/CreateUIDefinition.MultiVm.json#';
xhr.open("GET", createUISchemaURL, false);
var createUISchema = "";
xhr.onreadystatechange = function () {
    console.log("readyState = " + this.readyState + ", status = " + this.status);
    if (this.readyState == 4 && this.status == 200) {
        testSchema = JSON.parse(this.responseText);
    }
};
xhr.send();

/** Validates UI json files in the given folder with the schema. */
describe('json files in folder follow schema - ', () => {
    it('createUIDefinition.json must follow schema', () => {
        var fileString = fs.readFileSync(folder + '\\createUIDefinition.json', {
            encoding: 'utf8'
        }).trim();
        var res = tv4.validate(fileString, testSchema);
        assert(tv4.validate(fileString, testSchema) === true, 'json is not valid!');
    })
});