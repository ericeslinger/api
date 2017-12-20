import { expect } from 'chai';
import 'mocha';

import fetch from 'node-fetch';
import { APIServer } from '../dist/server';

async function query(q: string) {
  const response = await fetch('http://localhost:3000/graphql', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ query: q }),
  });
  const contentType = response.headers.get('Content-Type');
  if (contentType && contentType.startsWith('application/json')) {
    return await response.json();
  } else {
    return await response.text();
  }
}

describe('fetches', () => {
  const server = new APIServer();
  before(() => server.start(false));
  it('should load user objects', async () => {
    const response = await query(`{ users { name } }`);
    expect(response.data.users).to.have.length(4);
    expect(response.data.users).to.deep.equal([
      { name: 'user one' },
      { name: 'user two' },
      { name: 'user three' },
      { name: 'user four' },
    ]);
  });
});
