import Knex from 'knex';
import { ulid } from 'ulid';
process.on('unhandledRejection', r => console.log(r));

const client = Knex({
  client: 'pg',
  connection: {
    database: 'florence',
    user: 'flo',
    host: 'localhost',
    port: 5432,
    password: 'fumfum',
  },
});

async function buildUsers() {
  return await client('florence.users')
    .insert([
      {
        id: ulid(),
        name: 'user one',
      },
      {
        id: ulid(),
        name: 'user two',
      },
      {
        id: ulid(),
        name: 'user three',
      },
      {
        id: ulid(),
        name: 'user four',
      },
    ])
    .returning('id');
}

async function buildProfiles(ids: string[]) {
  const profiles = await client('florence.profiles')
    .insert([
      {
        id: ulid(),
        name: 'profile one',
      },
      {
        id: ulid(),
        name: 'profile two',
      },
      {
        id: ulid(),
        name: 'profile three',
      },
      {
        id: ulid(),
        name: 'profile four',
      },
    ])
    .returning('id');

  return await client('florence.profiles_users_join')
    .insert(
      profiles.map((profile, idx) => ({
        profile_id: profile,
        user_id: ids[idx],
      })),
    )
    .returning('*');
}

(async () => {
  const stuff = await buildProfiles(await buildUsers());
  console.log(JSON.stringify(stuff));
})();
