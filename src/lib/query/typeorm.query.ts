import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { TypeOrmQueryModel, QueryObjectModel } from '../model/query.model';
import { StringUtils } from '../utils/string.util';
import { StringValidator } from '../utils/string.validator';

export const TypeOrmQueryParser = (): MethodDecorator => {
  return (_target, _key, descriptor: TypedPropertyDescriptor<any>) => {
    const original = descriptor.value;
    descriptor.value = async function (...props: any) {
      const queryProps = props[0];
      const anotherProps = props.slice(1);
      const query: TypeOrmQueryModel = parse(queryProps);
      return await original.apply(this, [query, ...anotherProps]);
    };
    return descriptor;
  };
};

export const TypeOrmQuery: () => ParameterDecorator = createParamDecorator(
  (_data: unknown, ctx: ExecutionContext): TypeOrmQueryModel => {
    const query = ctx.getArgByIndex(0).query;
    return parse(query);
  }
);

function parse(query: any): TypeOrmQueryModel {
  const def_limit = 100;
  const def_skip = 0;
  const def_page = 1;

  const result: TypeOrmQueryModel = new TypeOrmQueryModel();

  result.take = getIntKey(query, 'limit', def_limit);
  result.skip = query.page
    ? getSkipFromPage(query, def_page, result.take)
    : getIntKey(query, 'skip', def_skip);
  result.order = getSort(query, {});
  result.where = getFilter(query, {});

  return result;
}

function getIntKey(query: any, key: string, def: number): number {
  if (!query[key] || !StringValidator.isInt(query[key])) {
    return def;
  }
  return +query[key];
}

function getSkipFromPage(query: any, def: number, limit: number): number {
  const page = getIntKey(query, 'page', def);
  return page > 1 ? (page - 1) * limit : 0;
}

function getSort(query: any, def: QueryObjectModel): QueryObjectModel {
  if (!query.sort) return def;
  return StringUtils.splitString(query.sort, ',').reduce(
    (obj: { [x: string]: string }, key: string) => {
      const cleanKey: string = StringUtils.cleanString(key, /[^A-z0-9_.]/g);
      obj[cleanKey] = key.startsWith('-') ? 'DESC' : 'ASC';
      return obj;
    },
    {}
  );
}

function getFilter(query: any, def: QueryObjectModel): QueryObjectModel {
  delete query.limit;
  delete query.skip;
  delete query.page;
  delete query.select;
  delete query.sort;
  if (!query) return def;
  return Object.keys(query).reduce((obj: any, key: string) => {
    const queryValue = query[key];

    const value = getSimpleFilterValue(key, queryValue);
    if (value !== null) {
      const cleanKey: string = StringUtils.cleanString(key, /[^A-z0-9_.]/g);
      obj[cleanKey] = value;
    }
    return obj;
  }, {});
}

function getSimpleFilterValue(
  key: string,
  filter: string
): string | number | boolean | Date | object | null {
  if (!filter) return null;

  if (
    StringValidator.isISODate(filter) ||
    StringValidator.isISODateTime(filter)
  ) {
    return new Date(filter);
  }

  if (StringValidator.isNumberString(filter)) {
    return +filter;
  }

  if (filter === 'true' || filter === 'false') {
    return filter === 'true';
  }

  return StringUtils.cleanString(filter, /[^\w\s@.-:]/g);

}
