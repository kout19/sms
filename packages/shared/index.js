// packages/shared/index.js
// Single entry point for the whole @packages/shared package.
// Add new sub-modules here as they're built (validators, constants, etc.)
// rather than creating new package.json "main"/"exports" targets.

const permissions = require("./permissions/index.js");
const serializers = require("./serializers/toSafeUser.js");

module.exports = {
  ...permissions,
  ...serializers,
};
