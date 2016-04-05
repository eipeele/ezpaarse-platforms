#!/usr/bin/env node

// ##EZPAARSE

/*jslint maxlen: 150*/
'use strict';
var Parser = require('../.lib/parser.js');

/**
 * Identifie les consultations de la plateforme Brill
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
  var title;
  var match;
  var matchinfo;
  if ((match = /^\/content\/([a-z]+)\/([0-9\.]+)\/([0-9]+)$/.exec(path)) !== null) {
    // content/journals/10.1163/157006605774832225
    result.rtype  = 'ABS';
    result.mime   = 'HTML';
    result.unitid = match[3];
    result.doi    = match[2] + '/' +  match[3];
  } else if ((match = /^\/docserver\/([0-9]+)\/(v([0-9]+)n([0-9]+)_([a-z0-9]+).pdf)$/.exec(path)) !== null) {
    // docserver/00224200/v35n4_splitsection3.pdf
    result.rtype            = 'ARTICLE';
    result.mime             = 'PDF';
    result.print_identifier = match[1].substr(0, 4) + '-' +  match[1].substr(4, 4);
    result.vol              = match[3];
    result.issue            = match[4];
    result.unitid           = match[1] + '/' + match[2];
  } else if ((match = /^\/content\/([a-z]+)\/(([0-9]+)\/([0-9]+)\/([0-9]+))$/.exec(path)) !== null) {
    // content/journals/15700666/35/4
    result.rtype            = 'TOC';
    result.mime             = 'HTML';
    result.print_identifier = match[3].substr(0, 4) + '-' +  match[3].substr(4, 4);
    result.vol              = match[4];
    result.issue            = match[5];
    result.unitid           = match[2];

  } else if ((match = /^\/media\/([a-z0-9]*)\/([^.]+).pdf$/.exec(path)) !== null) {
    //media/pplrdc/er372_411-412.pdf
    /// nij9789004177512_287-306.pdf
    //9789047409812-008.pdf
    //9789004206823_webready_content_s007.pdf
    //id=id=brills-digital-library-of-world-war-i/volunteers-auxiliaries-and-womens-mobilization-the-firstworld-war-and-beyond-19141939-B9789004206823_007
    result.rtype            = 'BOOK_SECTION';
    result.mime             = 'PDF';
    result.unitid  = match[1] + '/' + match[2] + '.pdf';
    if (param.id) {
      matchinfo =  param.id.split('/')[1];
      if ((matchinfo = /([^.]+)-([A-Z0-9]+)_([0-9]+)/.exec(matchinfo)) != null) {
        title = matchinfo[1];
      }
    }
    switch (true) {
    case (/^([a-z0-9]+)_([0-9]+)-([0-9]+)/.test(match[2])):
      result.print_identifier = param.id.split('.')[1];
      if (match[1] != 'pplrdc') {
        result.online_identifier = /([a-z]+)([0-9]+)_([0-9]+)-([0-9]+)/.exec(match[2])[2];
        result.title_id = title;
      }
      break;
    case (/^([0-9]+)-([0-9]+)/.test(match[2])) :
      result.online_identifier = match[2].split('-')[0];
      result.title_id = title;
      break;
    case (/^([0-9]+)_([^.]+)/.test(match[2])) :
      result.online_identifier = match[2].split('_')[0];
      result.title_id = title;
      break;
    default :
      break;
    }
  } else if ((match = /^\/entries\/([a-z\-]+)\/([^.]+)$/.exec(path)) !== null) {
    //entries/the-hague-academy-collected-courses/*-ej.9789004289376.395_503
    result.rtype            = 'TOC';
    result.mime             = 'HTML';
    if ((matchinfo = /([^.]+)\.([0-9]+)\.(([0-9]+)\_([0-9]+))/.exec(match[2])) !== null) {
      result.print_identifier = matchinfo[2];
      result.unitid = matchinfo[2] + '.' + matchinfo[3];
    } else {
      result.rtype            = 'ENCYCLOPAEDIA_ENTRY';
      result.mime             = 'HTML';
      result.unitid           = match[1] + '/' + match[2];
    }

  } else if ((match = /^\/(deliver|docserver)\/([0-9]+)\/([0-9]+)\/([0-9]+)\/([0-9A-Za-z\_]+).(pdf|html)$/.exec(path)) !== null) {
    //deliver/17087384/4/3/17087384_004_03_S02_text.pdf
    result.rtype = 'ARTICLE';
    if (match[6] === 'pdf') {
      result.mime     = 'PDF';
    } else {
      result.mime     = 'HTML';
    }
    result.print_identifier = match[2].substr(0, 4) + '-' + match[2].substr(4, 4);
    result.vol              = match[3];
    result.issue            = match[4];
    result.unitid           = match[5].replace('_text', '');
  }

  return result;
});

