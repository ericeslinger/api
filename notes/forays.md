# Forays into GraphQL

The audience for this post is two-fold: first, if you are brand new to GraphQL (as I was just recently), you might find my issues and struggles of interest. Second, if you're an experienced old hand with GraphQL, I would absolutely love to hear some feedback about how I am approaching the design and architecture challenges here. Experienced readers might want to skip to [section](TODO)

A note: throughout this post, I will be talking about back-end server tech built using node.js and node libraries. There exist a lot of GraphQL tools built for other languages (Ruby, Go, PHP, Java, C#), but my own experience these days is node, so I'll stay in my lane here.

# Introduction: Why GraphQL?

I personally have spent the last couple of years building bits of API middleware on a REST infrastructure that try to solve hard(ish) problems in building a single-page application. Imagine building a simple social site: you have `Users`, who are members of many `Communities`, and have shared `Posts` with those `Communities`. Additionally, `Users` can React to various Posts by liking, agreeing, or sympathizing (that's enough reaction types for now, but there's a whole range one could imagine.)

On the front end, for any given page you need to render, you will need some subset of all that information. If you are rendering a Community summary page, you may need to load the last ten Posts shared with that Community, and every User that is either the author of or someone who has reacted to the Post. The actual data you will need to render the whole page varies from page to page (maybe you are just displaying a reaction count at first, rather than the names of the reacting users, or maybe a more detailed front-page view shows the first three replies to each Post, each reply having its own text and author and potential reaction data).

The approach I took with my most recent project was to combine aggressive caching on the front end, a back end that was smart enough to send extra data along with each request, and a piece of middleware that abstracted the datastore for the page. In rendering out the page templates (in my case with Angular, but this is a common enough activity that the actual framework does not particularly matter), I needed only to ask for a root object type (such as the Community with id 1), and then the middleware would take care of fetching all of the child relationships when I asked for them. Most of the time, that relationship information would be pre-cached: if you asked for `https://example.com/api/communities/1`, the API server wasn't just going to give you basic data about the communities, it would pre-load the response with information about the users who are a member of that community, the most recent ten posts in that community, people who reacted to those posts, and so on.

Ultimately, I was quite pleased with this library and had intended to publish it as an Open Source data framework for front end data storage and an example (node.js + hapi.js) backend that served data appropriately. Initial work in this direction can be found at https://github.com/plumpstack/plump (and related other repositories published by plumpstack). The library also handles fetching data from a "cold" cache (such as localstorage) to display for a short time while the system loads the real data from the REST endpoint and exposes all relevant fields as [RxJS](https://reactivex.io/rxjs) observables, meaning it was possible to watch for updates in the database and propagate those updates into the front end, changing what the user sees as items change in the database.

Despite the progress I made on that front, I am still planning on using GraphQL and its ecosystem instead of my own home-grown Plumpstack ecosystem whenever feasible. On the one hand, it is gratifying to see that other people have wrestled with the same problems I have, but on the other, the GraphQL solution to these problems is simply better-engineered and a more elegant solution. Of course, GraphQL has had a lot more engineer hours poured into it by a broad array of backers, so it makes sense that it works better.

# Where does GraphQL shine?

The first thing I look at when evaluating a potential piece of API tech is how it handles a date scalar. I have built backends using KQML (a lisp-like datastructure for knowledge markup from the 1990s era AI world), various flavors of XML transport, and most recently, JSON, and nobody handles dates particularly cleanly. For example, if you do `JSON.parse(JSON.stringify(Date.now()))` you will get an integer (a standard microseconds-since-the-epoch value), whereas `JSON.parse(JSON.stringify(new Date()))` gets you a string representing that same value in ISO date-time string format (depending on your locale). Neither result are actual Dates, and if you want to do something like sort a relationship by the `createdAt` field on the relationship, you need to handle out-of-band schema information that says, "this field is a date in that format and should be parsed on the front end appropriately". Solving this problem of dates, ensuring no strings or integers leak out unexpectedly (or just assuming it is always an integer or string, both of which can still be sorted (usually), and using other libraries to pretty-print them out to users) is certainly a headache. Some simple implementations of api clients just try blindly parsing values to see if they make sense as dates, or rely on an `_at` or `At` suffix to indicate date-hood.

GraphQL returns us a bit to the days of Before JSON, requiring a schema be present for dealing with data on both sides of the transaction. This is probably a good thing - I'd rather put all the "this field has these sorts of attributes" information into a schema instead of on some kind of ad-hoc `<field type="date">![CDATA]</field>` node in XML (although I'll admit that's a personal preference after building one too many XML parsers in the 2000s). Somewhat humorously (at least, I found it funny), GraphQL does not actually specify a Date interop format. Instead, it _does_ specify ways to extend its primitive data types, and there are at least five different npm packages that implement a date scalar. This is satisfying enough, especially if you end up having to deal with different microservices that represent dates in different ways, there are no breaking changes here - you can have StringDates and NumericDates and anything else you'd like to implement. At first, I implemented my own, just to see how it was done, but eventually settled on graphql-datetime.

The broad GraphQL ecosystem provides some tools for building schemata out of either javascript code or by parsing a text schema. The schema definition language is a JSON-esque string with a penchant for lots and lots of curly braces. Here's an example I'll be returning to throughout this post: my pretend social site.

In the actual schema, using a non-standard scalar type is just a matter of declaring it:

```graphql
scalar DateTime
```

After we define our scalar, let's look at the heart of why I really have come to love GraphQL: writing queries against a published schema. Here are three basic data models for my toy social platform. You can see some basic attributes (like name) and some relationships (like members).

```graphql
type Community {
  id: ID!
  name: String!
  description: String!
  members(level: Int): [CommunityProfileRelationship]
  conversations(level: Int): [CommunityPostRelationship]
  createdAt: DateTime!
  updatedAt: DateTime!
}

type Post {
  id: ID!
  title: String!
  body: String!
  communities(level: Int): [CommunityPostRelationship]
  participants(level: Int): [PostProfileRelationship]
  createdAt: DateTime!
  updatedAt: DateTime!
}

type Profile {
  id: ID!
  name: String!
  about: String!
  posts(level: Int): [PostProfileRelationship]
  memberships(level: Int): [CommunityProfileRelationship]
  createdAt: DateTime!
  updatedAt: DateTime!
}
```

Note that Facebook in particular has defined a standard for GraphQL implementations called Relay Modern; if you adhere to this standard, you can use their front-end client pretty easily and there are (probably) some benefits to doing that, especially if you're working with react, as it integrates quite nicely into react component lifecycles. I'm borrowing from Relay Modern's notion of relationships (they call them edges and collections), but not actually implementing a Relay Modern schema here. One step at a time - once I figure out _what_ I need, I'll work on actually getting it implemented.

Here are definitions for all my relationships. Broadly speaking, I tend to reach for postgresql when building databases, and I usually follow a has many and belongs to many, join-table based pattern with relationships unless there is a compelling reason otherwise. It adds a bit of overhead to some sorts of things, but it affords me flexibility in relationships. Here, I'm attaching metadata to every relationship field - an integer level that represents some kind of permission type, plus the standard createdAt and updatedAt dates you see in a lot of places. This way, I can easily have Posts that are share between many Communities, but sort each Community's list of Posts by the date the Post was actually shared. The level field lets me do something like say, "Profiles 1 and 2 can edit this Post, as can all members of Community 1, but Community 2 and Profiles 3 and 4 can just comment on it".

As an aside, I also try to name relationships (and their join tables) with boring but predictable names - while "conversations" is the name of the relationship on the community itself and "communities" the inverse on Post, the relationship is named CommunityPostRelationship (Community first because it is alphabetical), and there's a table in postgres called communities_posts_join. This will get me in trouble when I add reactions to the schema, as both like and sympathize are additional relationships between posts and profiles, but I can work on adding additional disambiguating names to tables and relationships later.

```graphql
type CommunityPostRelationship {
  community: Community!
  post: Post!
  updatedAt: DateTime!
  createdAt: DateTime!
  level: Int!
}

type CommunityProfileRelationship {
  profile: Profile!
  community: Community!
  updatedAt: DateTime!
  createdAt: DateTime!
  level: Int!
}

type PostProfileRelationship {
  profile: Profile!
  post: Post!
  updatedAt: DateTime!
  createdAt: DateTime!
  level: Int!
}
```

This extra level between parent and child in a relationship adds some cruft to a lot of queries. If I had done the relationship directly, like:

```graphql
type Community {
  posts: [Post]
}
```

I could query a community and its posts as:

```graphql
{
  communityById(id: 1) {
    id
    name
    posts {
      title
    }
  }
}
```

That's an actual GraphQL query, by the way. It looks a lot like the schema language (and while I did not show `communityById(id: Int)` in the schema, you can probably figure out what it does), and a properly build GraphQL server would return the community, its name and id, and the title of all its posts. Once you move out of the toy region of building services, you'll probably also want to add some pagination information to the posts request, so you don't accidentally pull half the database over the wire fulfilling this request.

Instead, with my actual schema, the query has an extra layer in it. The `posts` field represents the relationships in the database, and each `post` the Post it points to (with title and other information queryable there).

```graphql
{
  communityById(id: 1) {
    posts {
      post {
        title
      }
    }
  }
}
```

But as mentioned, if I also needed to do some processing on the front end to sort by updatedAt or level, I could query:

```graphql
{
  communityById(id: 1) {
    posts {
      level
      updatedAt
      post {
        title
      }
    }
  }
}
```

GraphQL is also recursive, so if I were interested in knowing all the other communities a given post was shared with, for displaying in the summary block, I could do the following:

```graphql
{
  communityById(id: 1) {
    posts {
      post {
        title
        communities {
          community {
            name
          }
        }
      }
    }
  }
}
```

If my GraphQL server is correctly assembled, I might see a list of posts here that are shared with community 1, the titles of those posts, and the names of all the communities each of those posts are shared with.

All of this information is hypothetically loaded from the back end server in a single request (actually done as a POST request against a http backend). This allows the front-end application writer to state ahead of time what fields they need to load and fetch only those fields in a single roundtrip to the server. I am never out of danger of accidentally creating an [N+1](TODO: link) query, but this at least makes it a little easier to avoid on the front end.

This compact (ish), extensible, and expressive language for both schema and query is a big part of what I like about GraphQL. Again I'm drawn to my own attempts to solve these problems - I ended up with my own hybrid string / object data schema representation that everyone needed to know about (front and back end), which worked okay for my specific use case but was not nearly as extensible or expressive as the GraphQL solution (and probably would have converged on a similar representation if it ever got there). Here, at least, I have the satisfaction of seeing a well-crafted interface surface, knowing the struggles that went into building my own and seeing a superior solution.

# The bracketed part: A well-assembled server

A few times above, I said, "if your GraphQL server is well-assembled, it should respond to these requests appropriately", which is kind of a dodge or bracketing of the problem of actually building a well-assembled server. When building your server, you have a lot of options in terms of both language and framework, but I chose to work with the [Apollo server tools](link) and [hapi.js](link) as my actual application server, as hapi is my go-to node server framework. I also made heavy use of Facebook's [Dataloader](link) library.

If you would like to see all the parts put together, visit it [on github](https://github.com/ericeslinger/gqldemo). Feel free to clone it, do `npm install && npm start`. This particular demo uses a local sqlite database instead of postgresql (to make it easier to install), but the only real change there is in the connection information passed to knex.

## Parsing the schema

It is possible to build a GraphQL schema out of javascript objects like so:

```
// TODO
```

But: yuck. Instead, I'm using [graphql-tools](link) from the Apollo project. Building a schema is as simple as:

```typescript
import { makeExecutableSchema } from 'graphql-tools';
import { readFileSync } from 'fs';
import { join } from 'path';
function loadSchema(fn: string) {
  return readFileSync(join(__dirname, fn)).toString();
}
/* ... etc ... */
makeExecutableSchema({
  typeDefs: [loadSchema('schema.graphql')],
});
```

This isn't actually what I did, but it is a good start. Define a file named `schema.graphql` (so I can get good syntax highlighting and stuff from my editor), and then load that file as a string at runtime (make sure your build step copies those grapql files into your dist folder).

In practice, I wanted to build a vaguely object-oriented system here, where each model type had a definition, with some GraphQL fragment associated with it that got merged into a single big schema. The `makeExecutableSchema` call allows for this pretty easily, since the `typeDefs` parameter has to be an array. So instead:

```typescript
import { makeExecutableSchema } from 'graphql-tools';
import { loadSchema } from './load';
import { Profile, Community, Post } from './models';

const baseSchema = loadSchema('base.graphql');

makeExecutableSchema({
  typeDefs: [Profile.schema, Community.schema, Post.schema, baseSchema],
});
```

The trick then is to remember that in your schema fragments, when defining the query type, to extend that type instead of just defining it. So, in the community schema file, I have:

```graphql
extend type Query {
  community(id: String!): Community
}
```

That's all you really need to do in order to break your schema up into fragments. Various documentation articles recommend different approaches (all dealing with the problem of circular dependencies in node), but if you assume a `readFileSync().toString()` call is being made, you can write your schemas in their own files and then just load them up when the object is instantiated.

## Actually Loading Data

So: your server now knows about what sorts of requests it can handle, but you now need to tell the server how to load that data. The core concept to think through is the Resolver. This is a plain old javascript object that you hand to GraphQL that it will consult as it spiders the request, calling (usually asynchronous) methods to load in data.

An overly-simple resolver might look like:

```javascript
{
  // this is a date library imported further up, paired with the scalar DateTime line in the schema
  DateTime: GraphQLDateTime,
  Query: {
    community: (obj, args, context, info) => Community.load(args.id),
    profile: (obj, args, context, info) => Profile.load(args.id),
    post: (obj, args, context, info) => Post.load(args.id)
  }
}
```

If the query specifies a child field and object returned from a resolver method has that field, things are fine - GraphQL will just use that field (unless you've otherwise overridden the resolver). So as long as Community.load(1) returns (or resolves to as a promise or async) an object with a `name` field, querying `{ community(id: 1) { name } }` will work just fine.

Life gets more interesting and exciting when you're looking at relationships. The core problem here is that we do not want to repeat ourselves building the relationship loaders. When you're loading the posts associated with a community and the posts associated with a profile, you really don't want to be calling two different loader functions to actually load the post from the database (and potentially massaging the data, to convert from snake_case to camelCase, for example).

The first step to disassemble things is add type-specific resolvers to our object. Here's an abridged look.

```javascript
{
  Query: {
    community: (obj, args, context, info) => doSomething(),
    communities: (obj, args, context, info) => doSomething(),
  },
  Community: {
    posts: (obj, args, context, info) => doSomething(),
  }
  CommunityPostRelationship {
    post: (obj, args, context, info) => doSomething()
  }
}
```

If my query looked like this:

```graphql
{
  communities {
    # fetch all communities, for each we'll get:
    name # a string that has to come from Query.communities
    posts {
      # all the post relationships in this community
      level # integer value, loaded by Community.posts
      post {
        # the actual post object
        title # string value, needs to be loaded by CommunityPostRelationship.post
      }
    }
  }
}
```

Do you see the tricky bits? In each case, for the most part with scalar fields, the scalar value really ought to be loaded by the resolver that is one step higher up on the resolution tree. That means the "fetch all communities" query is not just fetching community ids, but also needs to fetch each community's name. I have also left doSomething() unspecified, except that it needs to return or resolve to the Right data.

There are two problems this design faces, and they're both solved with the same tool. Those problems are: we still end up loading data for various models in multiple places (a post title should come out of the `Quuery.posts` resolver as well as the `CommunityPostRelationship.post` resolver), and we are likely to run into N+1 queries here, where we load a community, then load each of its posts individually, and then maybe a bunch of individual user profiles, hitting the database with a lot of individual requests. Let's solve this problem with Facebook's Dataloader library.

## Dataloader: Hug two birds with one wing

Because I don't like throwing stones.

Dataloader helps alleviate the N+1 problem by debouncing all requests of a certain type and issuing a single batch query for everything. It will also cache responses from those batch queries (as your resolver ends up climing into a deep query tree), so you don't need to make as many database requests. You probably could compile a perfect single query that returns everything you need for any given GraphQL query (and is what the [postgraphile](TODO LINK) project is attempting to do), but this is a fairly tricky proposition and can often result in a lot of query-specific code. Instead, we will let Dataloader take care of batching up requests that are easily batched and accept that most queries will result in maybe two or three database hits. If further optimization is needed, hand-tuning could be deployed later.

By pushing all our "please give me Community N" type requests through a Dataloader facade, we also now have a natural point to handle model-specific processing. For example:

```typescript
class Model {
  constructor(public opts: any);
  loader(): Dataloader<string, any> {
    return new Dataloader(
      (ids: string[]) => this.getByIds(ids) as Promise<any[]>,
    );
  }
  async getByIds(ids: string[]) {
    const raw = await this.db(this.opts.table)
      .whereIn('id', ids)
      .select('*');
    return ids
      .map(id => raw.find(v => v.id === id) || null)
      .map(v => (v ? this.massage(v) : v));
  }
}
```

The dataloader spec really only requires a single function passed to its constructor. The signature of that function is `(ids: any[]) => Promise<any[]>` (you can use any kind of argument as an id field, often it is a string or integer). The promise _must_ resolve to an array of the same length and ordering as the `ids` argument; any ids that are not found in the database need to be returned as a `null` entry in the returned array.
