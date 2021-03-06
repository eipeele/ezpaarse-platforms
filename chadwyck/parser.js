#!/usr/bin/env node

'use strict';
var Parser = require('../.lib/parser.js');

/**
 * Recognizes the accesses to the platform Chadwyck-Healey Literature Collections
 * @param  {Object} parsedUrl an object representing the URL to analyze
 *                            main attributes: pathname, query, hostname
 * @param  {Object} ec        an object representing the EC whose URL is being analyzed
 * @return {Object} the result
 */
module.exports = new Parser(function analyseEC(parsedUrl, ec) {
  var result = {};
  var path   = parsedUrl.pathname;
  // uncomment this line if you need parameters
  var param  = parsedUrl.query || {};

  // use console.error for debuging
  // console.error(parsedUrl);

  if (/\/fulltext$/i.test(path)) {
    // acta.chadwyck.co.uk/all/fulltext?ALL=Y&action=byid&warn=N&id=Z300036009&div=3&file=../session/1475585193_28984&SOMQUERY=1&DBOFFSET=40649769&ENTRIES=46&CURDB=acta
    result.rtype    = 'ENCYCLOPAEDIA_ENTRY';
    result.mime     = 'HTML';
    result.title_id = parsedUrl.hostname;
    result.unitid   = param.id || param.ID;
  }

  return result;
});
