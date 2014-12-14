"use strict";
var _ = require('lodash')
  , parseURL = require('url').parse;

/* Each Docker linked port is described by an environment variable
 * of the form %alias%_PORT_%port%_%protocol%. For example: DB_PORT_6579_TCP,
 * or LOG_PORT_7799_UDP. */
var linkRegex = /^([A-Z0-9_\.]+)_PORT_[0-9]+_([A-Z0-9]+)$/;

var _extractLinks = function(env) {
  return _(env).keys()
    .map(linkRegex.exec.bind(linkRegex))
    .filter()
    .map(function(match) {
      var key   = match[0]
        , alias = match[1]
        , proto = match[2]
        , name  = env[alias + '_NAME']
        , url   = env[key]
        , url_parts   = parseURL(url)
        , default_url = env[alias + '_PORT'];

      return {
        name: name,
        default: default_url === url,
        url: url,
        alias: alias.toLowerCase(),
        port: Number(url_parts.port),
        hostname: url_parts.hostname,
        proto: proto.toLowerCase()
      };
    })
    .value();
};

var _processLinks = function(links) {
  var result = {};

  _.forEach(links, function(link) {

    if (result[link.alias] === undefined) {
      result[link.alias] = {};
    }

    if (link.default) {
      _.extend(result[link.alias], {
        port: link.port,
        hostname: link.hostname,
        url: link.url,
        proto: link.proto,
        name: link.name
      });
    }

    if (result[link.alias][link.proto] === undefined) {
      result[link.alias][link.proto] = {};
    }
    result[link.alias][link.proto][link.port] = {
      hostname: link.hostname,
      url: link.url
    }
  });
  return result;
};

/* Parse link from an object containing environment
 * variable key-value pairs. If no argument is supplied then 
 * the default environment process.env is used.*/
module.exports.parseLinks = function(env) {
  if (env === undefined) {
    env = process.env;
  }
  var links = _extractLinks(env);
  return _processLinks(links);
};
