import Dataloader from 'dataloader';

export class Relationship {
  opts: any;
  resolver() {
    return (obj, args, context, info) => {
      context.pre.loaders[this.opts.name];
    };
  }

  loader(): Dataloader<string, any> {
    return new Dataloader(
      (ids: string[]) => this.getByIds(ids) as Promise<any[]>,
    );
  }
}
