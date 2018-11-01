/* eslint-disable
  strict,
  no-param-reassign
*/

'use strict';

const fs = require('fs');
const path = require('path');

const Ajv = require('ajv');
const errors = require('ajv-errors');
const keywords = require('ajv-keywords');

const ValidationError = require('./ValidationError');

const ajv = new Ajv({
  allErrors: true,
  jsonPointers: true,
  useDefaults: true,
  $data: true
});

ajv.addKeyword('isNotEmpty', {
  type: 'string',
  validate: (schema, data) => {
      if (!schema) {
          // only validate if isNotEmpty = true;
          return true;
      }

      return schema && typeof data === 'string' && data.trim() !== '';
  },
  errors: false
});

errors(ajv);
keywords(ajv, ['instanceof', 'typeof']);

const validateOptions = (schema, options, name) => {
  if (typeof schema === 'string') {
    schema = fs.readFileSync(path.resolve(schema), 'utf8');
    schema = JSON.parse(schema);
  }

  if (!ajv.validate(schema, options)) {
    throw new ValidationError(ajv.errors, name);
  }

  return true;
};

module.exports = validateOptions;
