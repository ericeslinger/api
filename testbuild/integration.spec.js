'use strict';

var _chai = require('chai');

require('mocha');

var _nodeFetch = require('node-fetch');

var _nodeFetch2 = _interopRequireDefault(_nodeFetch);

var _server = require('../dist/server');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

async function query(q) {
    const response = await (0, _nodeFetch2.default)('http://localhost:3000/graphql', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query: q })
    });
    const contentType = response.headers.get('Content-Type');
    if (contentType && contentType.startsWith('application/json')) {
        return await response.json();
    } else {
        return await response.text();
    }
}
describe('fetches', () => {
    const server = new _server.APIServer();
    before(() => server.start(false));
    it('should load user objects', async () => {
        const response = await query(`{ users { name } }`);
        (0, _chai.expect)(response.data.users).to.have.length(4);
        (0, _chai.expect)(response.data.users).to.deep.equal([{ name: 'user one' }, { name: 'user two' }, { name: 'user three' }, { name: 'user four' }]);
    });
});