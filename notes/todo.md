# tests

* like all of them, now that there's a setup
* create and seed testing db

# loaders

* dataloader for join tables
  * select array_agg(profile_id), community_id from memberships where community_id in (1, 3, 57) group by community_id;
* naming convention? currently need to specify basically singular, plural, upcase singular, and table name.

# misc

