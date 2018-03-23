require('it-each')({ testPerIteration: true });

var fs = require('fs');
var util = require('./util');
const filesFolder = './';
var path = require('path');
var chai = require('chai');
//var assert = chai.assert; // Using Assert style
//var expect = chai.expect; // Using Expect style
var jsonlint = require('jsonlint');
var should = chai.should();

var folder = process.env.npm_config_folder || filesFolder;

var jsonFiles = util.getFiles(folder, '.json');

/** Validates every AMP solution must have a top-level mainTemplate.json template and a createUIDefinition.json. */
describe('a top-level mainTemplate.json and a createUIDefinition.json exist in folder- ', () => {
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