"use strict";

var assert = require('assert')
  , sut    = require('./index.js');

var TEST_ENV = {
  DB_NAME: "romantic_lumiere/db",
  DB_PORT: "tcp://172.17.0.5:6379",
  DB_PORT_6379_TCP: "tcp://172.17.0.5:6379",
  DB_PORT_6379_TCP_ADDR: "172.17.0.5",
  DB_PORT_6379_TCP_PORT: "6379",
  DB_PORT_6379_TCP_PROTO: "tcp",
  DB_PORT_6500_TCP: "tcp://172.17.0.5:6500",
  DB_PORT_6500_TCP_ADDR: "172.17.0.5",
  DB_PORT_6500_TCP_PORT: "6500",
  DB_PORT_6500_TCP_PROTO: "tcp",
  DB_REDIS_NAME: "romantic_lumiere/db_redis",
  DB_REDIS_PORT: "tcp://172.17.0.2:6379",
  DB_REDIS_PORT_6379_TCP: "tcp://172.17.0.2:6379",
  DB_REDIS_PORT_6379_TCP_ADDR: "172.17.0.2",
  DB_REDIS_PORT_6379_TCP_PORT: "6379",
  DB_REDIS_PORT_6379_TCP_PROTO: "tcp"
};

describe('parseLinks', function() {
  it('should correctly parse docker link information from a set of docker environment variables', function() {
    // given
    // when
    var links = sut.parseLinks(TEST_ENV);
    // then
    assert.notEqual(links.db, undefined, 'db alias should be parsed');
    assert.notEqual(links.db_redis, undefined, 'db_redis alias should be parsed');
    assert.equal(links.db.port, 6379, 'default db port should be 6379');
    assert.equal(links.db.tcp[6379].hostname, '172.17.0.5', 'db 6379 port address should be 172.17.0.5');
    assert.equal(links.db.tcp[6500].hostname, '172.17.0.5', 'db 6500 port address should be 172.17.0.5');
  });
});
