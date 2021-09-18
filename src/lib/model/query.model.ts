export class TypeOrmQueryModel {
  take!: number;
  skip!: number;
  order!: QueryObjectModel;
  where!: QueryObjectModel;
}

export class QueryObjectModel {
  [key: string]: string | number | Date | any;
}
