import Dataloader from 'dataloader';
import Knex from 'knex';

export interface RelationshipOptions {
  members: {
    [name: string]: string;
  };
  tableName: string;
  typeName: string;
}

// On a relationship:
// info.returnType.ofType.name is something like 'Field'
// it is the actual field type name - proper and singular.
// info.path.key is the query name, so like 'field' as a child of the 'fields'
// relationship.

// This requires there to be a pre-existing loader for all Field types.

export class Relationship {
  constructor(public db: Knex, public opts: RelationshipOptions) {}

  resolver() {
    const rV = {};
    Object.keys(this.opts.members).forEach(member => {
      rV[member] = (obj, args, context, info) => {
        return context.pre.loaders[info.returnType.ofType.name].load(
          obj[this.opts.members[info.path.key]],
        );
      };
    });
    return rV;
  }
}
