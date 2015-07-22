import chai from 'chai';

import server from '../lib/server';

const expect = chai.expect;

describe('GET :: /', () => {
  it('should return `hello world`', (done) => {
    server.inject('/', (res) => {
      expect(res.result).to.equal('hello world');
      done();
    });
  });
});
