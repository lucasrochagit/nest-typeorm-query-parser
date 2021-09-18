<h1 align="center">Nest TypeOrm Query Parser</h1>
<p align="center">A TypeOrm query string parser to be used in applications developed with NestJS.</p>

[![License][license-image]][license-url]
[![NPM Version][npm-image]][npm-url]
[![Dependencies][dependencies-image]][dependencies-url]
[![Contributors][contributors-image]][contributors-url]
[![NPM Downloads][npm-downloads-image]][npm-downloads-url]

## Summary

- [Prerequisites](#prerequisites)
- [Installing](#installing)
- [Usage](#usage)

[comment]: <> (- [Examples]&#40;#examples&#41;)

[comment]: <> (- [Explain the Resources]&#40;#explain-the-resources&#41;)

[comment]: <> (  - [Queries with @MongoQuery&#40;&#41; | @MongoQueryParser&#40;&#41;]&#40;#queries-with-mongoquery--mongoqueryparser&#41;)

[comment]: <> (    - [Pagination]&#40;#pagination&#41;)

[comment]: <> (    - [Ordering]&#40;#ordering&#41;)

[comment]: <> (    - [Select]&#40;#select&#41;)

[comment]: <> (    - [Filters]&#40;#filters&#41;)

[comment]: <> (      - [Simple Filters]&#40;#simple-filters&#41;)

[comment]: <> (      - [Partial Filters]&#40;#partial-filters&#41;)

[comment]: <> (      - [Comparison Filters]&#40;#comparison-filters&#41;)

[comment]: <> (      - [Element Filters]&#40;#element-filters&#41;)

[comment]: <> (      - [AND | OR Filters]&#40;#and--or-filters&#41;)

[comment]: <> (    - [Populate]&#40;#populate&#41;)

[comment]: <> (- [Rules]&#40;#rules&#41;)

[comment]: <> (- [Observations]&#40;#observations&#41;)

[comment]: <> (- [Practical Examples]&#40;#practical-examples&#41;)

[comment]: <> (- [Upcoming Features]&#40;#upcoming-features&#41;)
- [License](#license)
- [Authors](#authors)

## Prerequisites

As the name of the library suggests, it was built to work together with the NestJS framework.

## Installing

Use the follow command:

`npm i --save nest-typeorm-query-parser`

## Usage

There are two ways to use the parsers available in this library: as a ParamDecorator or as a MethodDecorator.

If you want to use it as a ParamDecorator, just add the tag referring to the Parser to be used as a method parameter.
Example:

```ts
import { Get } from '@nestjs/common';
import { Controller } from '@nestjs/common';
import { ResourceService } from './resource.service';
import { TypeOrmQuery, TypeOrmQueryModel } from 'nest-typeorm-query-parser';

@Controller('resources')
export class ResourceController {
  constructor(private readonly _service: ResourceService) {}

  @Get()
  public find(@TypeOrmQuery() query: TypeOrmQueryModel) {
    return this._service.find(query);
  }
}
```

It can also be used as a MethodDecorator. Just use the tag referring to the Parser to be used as the method decorator.
Example:

```ts
import { Injectable } from '@nestjs/common';
import { TypeOrmQueryParser, TypeOrmQueryModel } from 'nest-typeorm-query-parser';

@Injectable()
export class ResourceService {
  @TypeOrmQueryParser()
  public find(query: TypeOrmQueryModel) {
    return [];
  }
}
```

NOTE: When using the library as a MethodDecorator, you can receive other arguments in the method in question, but the query has to be passed as the first argument of the function, so that the treatment is done properly.

[comment]: <> (## Examples)

[comment]: <> (##### Request: http://localhost:3000/resources)

[comment]: <> (##### Query:)

[comment]: <> (```json)

[comment]: <> ({)

[comment]: <> (  "limit": 100,)

[comment]: <> (  "skip": 0,)

[comment]: <> (  "select": {},)

[comment]: <> (  "sort": {},)

[comment]: <> (  "populate": [],)

[comment]: <> (  "filter": {})

[comment]: <> (})

[comment]: <> (```)

[comment]: <> (##### Request: http://localhost:3000/resources?limit=10&page=2&select=\_id,name,age&sort=-created_at&age=gt:30)

[comment]: <> (##### Query:)

[comment]: <> (```json)

[comment]: <> ({)

[comment]: <> (  "limit": 10,)

[comment]: <> (  "skip": 10,)

[comment]: <> (  "select": {)

[comment]: <> (    "_id": 1,)

[comment]: <> (    "name": 1,)

[comment]: <> (    "age": 1)

[comment]: <> (  },)

[comment]: <> (  "sort": {)

[comment]: <> (    "created_at": -1)

[comment]: <> (  },)

[comment]: <> (  "populate": [],)

[comment]: <> (  "filter": {)

[comment]: <> (    "age": {)

[comment]: <> (      "$gt": 30)

[comment]: <> (    })

[comment]: <> (  })

[comment]: <> (})

[comment]: <> (```)

[comment]: <> ([comment]: <> &#40;## Explain the Resources&#41;)

[comment]: <> ([comment]: <> &#40;## Queries with @MongoQuery&#40;&#41; | @MongoQueryParser&#40;&#41;&#41;)

[comment]: <> ([comment]: <> &#40;### Pagination&#41;)

[comment]: <> ([comment]: <> &#40;The paging feature is very useful for clients who will consume your API. It is through this feature that applications&#41;)

[comment]: <> ([comment]: <> &#40;can define the data limit in a query, as well as define which page to be displayed. Each time a page of an application&#41;)

[comment]: <> ([comment]: <> &#40;is selected, it means that some resources have been displaced &#40;data offset or skip data&#41;.&#41;)

[comment]: <> ([comment]: <> &#40;There is a mathematical rule that relates page number to resource offset. Basically:&#41;)

[comment]: <> ([comment]: <> &#40;`offset = &#40;page - 1&#41; * limit, where page > 0.`&#41;)

[comment]: <> ([comment]: <> &#40;This means that for a limit of 10 elements per page:&#41;)

[comment]: <> ([comment]: <> &#40;- To access page 1, the offset will be equal to = &#40;1 - 1&#41; \* 10, so offset = 0&#41;)

[comment]: <> ([comment]: <> &#40;- To access page 2, the offset will be equal to = &#40;2 - 1&#41; \* 10, so offset = 10&#41;)

[comment]: <> ([comment]: <> &#40;- To access page 3, the offset will be equal to = &#40;3 - 1&#41; \* 10, so offset = 20&#41;)

[comment]: <> ([comment]: <> &#40;And so on.&#41;)

[comment]: <> ([comment]: <> &#40;With this library, it is possible to use pagination with the `page` parameter, or using the `skip` manually. By default,&#41;)

[comment]: <> ([comment]: <> &#40;the `limit` value is `100` and `skip` value is `0`.&#41;)

[comment]: <> ([comment]: <> &#40;Example:&#41;)

[comment]: <> ([comment]: <> &#40;##### Request: http://localhost:3000/resources?limit=10&page=3&#41;)

[comment]: <> ([comment]: <> &#40;##### Query:&#41;)

[comment]: <> ([comment]: <> &#40;```json&#41;)

[comment]: <> ([comment]: <> &#40;{&#41;)

[comment]: <> ([comment]: <> &#40;  "limit": 10,&#41;)

[comment]: <> ([comment]: <> &#40;  "skip": 20&#41;)

[comment]: <> ([comment]: <> &#40;}&#41;)

[comment]: <> ([comment]: <> &#40;```&#41;)

[comment]: <> ([comment]: <> &#40;##### Request: http://localhost:3000/resources?limit=10&skip=20&#41;)

[comment]: <> ([comment]: <> &#40;##### Query:&#41;)

[comment]: <> ([comment]: <> &#40;```json&#41;)

[comment]: <> ([comment]: <> &#40;{&#41;)

[comment]: <> ([comment]: <> &#40;  "limit": 10,&#41;)

[comment]: <> ([comment]: <> &#40;  "skip": 20&#41;)

[comment]: <> ([comment]: <> &#40;}&#41;)

[comment]: <> ([comment]: <> &#40;```&#41;)

[comment]: <> ([comment]: <> &#40;### Ordering&#41;)

[comment]: <> ([comment]: <> &#40;To work with ordering, you need to specify one or more sorting parameters, and whether you want the sorting to be&#41;)

[comment]: <> ([comment]: <> &#40;ascending or descending. For ascending ordering, just put the name of the ordering parameter. For descending ordering,&#41;)

[comment]: <> ([comment]: <> &#40;you need to put a "-" symbol before the name of the ordering parameter. Example:&#41;)

[comment]: <> ([comment]: <> &#40;##### Request: http://localhost:3000/resources?sort=created_at&#41;)

[comment]: <> ([comment]: <> &#40;##### Query:&#41;)

[comment]: <> ([comment]: <> &#40;```json&#41;)

[comment]: <> ([comment]: <> &#40;{&#41;)

[comment]: <> ([comment]: <> &#40;  "sort": {&#41;)

[comment]: <> ([comment]: <> &#40;    "created_at": 1&#41;)

[comment]: <> ([comment]: <> &#40;  }&#41;)

[comment]: <> ([comment]: <> &#40;}&#41;)

[comment]: <> ([comment]: <> &#40;```&#41;)

[comment]: <> ([comment]: <> &#40;##### Request: http://localhost:3000/resources?sort=-created_at&#41;)

[comment]: <> ([comment]: <> &#40;##### Query:&#41;)

[comment]: <> ([comment]: <> &#40;```json&#41;)

[comment]: <> ([comment]: <> &#40;{&#41;)

[comment]: <> ([comment]: <> &#40;  "sort": {&#41;)

[comment]: <> ([comment]: <> &#40;    "created_at": -1&#41;)

[comment]: <> ([comment]: <> &#40;  }&#41;)

[comment]: <> ([comment]: <> &#40;}&#41;)

[comment]: <> ([comment]: <> &#40;```&#41;)

[comment]: <> ([comment]: <> &#40;##### Request: http://localhost:3000/resources?sort=-age,name&#41;)

[comment]: <> ([comment]: <> &#40;##### Query:&#41;)

[comment]: <> ([comment]: <> &#40;```json&#41;)

[comment]: <> ([comment]: <> &#40;{&#41;)

[comment]: <> ([comment]: <> &#40;  "sort": {&#41;)

[comment]: <> ([comment]: <> &#40;    "age": -1,&#41;)

[comment]: <> ([comment]: <> &#40;    "name": 1&#41;)

[comment]: <> ([comment]: <> &#40;  }&#41;)

[comment]: <> ([comment]: <> &#40;}&#41;)

[comment]: <> ([comment]: <> &#40;```&#41;)

[comment]: <> ([comment]: <> &#40;In multiple-parameter ordering, the first ordering parameter has higher priority than the second, and so on. In the&#41;)

[comment]: <> ([comment]: <> &#40;example above, the ordering will be given primarily by the `age` parameter, in descending order. If there are two or&#41;)

[comment]: <> ([comment]: <> &#40;more objects with the same value in `age`, then those objects will be sorted by `name` in ascending order.&#41;)

[comment]: <> ([comment]: <> &#40;### Select&#41;)

[comment]: <> ([comment]: <> &#40;With this library, you can choose which parameters should be returned by the API. However, Mongo has a peculiarity: you&#41;)

[comment]: <> ([comment]: <> &#40;can also specify which parameters you don't want to be returned. The logic is similar to ordering: to specify which&#41;)

[comment]: <> ([comment]: <> &#40;parameters are to be returned, simply enter the parameter name; and to specify which parameters should not be returned,&#41;)

[comment]: <> ([comment]: <> &#40;just place a "-" symbol before the parameter.&#41;)

[comment]: <> ([comment]: <> &#40;Example:&#41;)

[comment]: <> ([comment]: <> &#40;##### Request: http://localhost:3000/resources?select=\_id,name,age&#41;)

[comment]: <> ([comment]: <> &#40;##### Query:&#41;)

[comment]: <> ([comment]: <> &#40;```json&#41;)

[comment]: <> ([comment]: <> &#40;{&#41;)

[comment]: <> ([comment]: <> &#40;  "select": {&#41;)

[comment]: <> ([comment]: <> &#40;    "_id": 1,&#41;)

[comment]: <> ([comment]: <> &#40;    "name": 1,&#41;)

[comment]: <> ([comment]: <> &#40;    "age": 1&#41;)

[comment]: <> ([comment]: <> &#40;  }&#41;)

[comment]: <> ([comment]: <> &#40;}&#41;)

[comment]: <> ([comment]: <> &#40;```&#41;)

[comment]: <> ([comment]: <> &#40;##### Request: http://localhost:3000/resources?select=-\_id,-created_at,-updated_at&#41;)

[comment]: <> ([comment]: <> &#40;##### Query:&#41;)

[comment]: <> ([comment]: <> &#40;```json&#41;)

[comment]: <> ([comment]: <> &#40;{&#41;)

[comment]: <> ([comment]: <> &#40;  "select": {&#41;)

[comment]: <> ([comment]: <> &#40;    "_id": 0,&#41;)

[comment]: <> ([comment]: <> &#40;    "created_at": 0,&#41;)

[comment]: <> ([comment]: <> &#40;    "updated_at": 0&#41;)

[comment]: <> ([comment]: <> &#40;  }&#41;)

[comment]: <> ([comment]: <> &#40;}&#41;)

[comment]: <> ([comment]: <> &#40;```&#41;)

[comment]: <> ([comment]: <> &#40;It is interesting to use one or the other in your queries, as one is complementary to the other. If you want almost all&#41;)

[comment]: <> ([comment]: <> &#40;parameters except a few, use the option to ignore parameters. If you want some parameters, and ignore the others, use&#41;)

[comment]: <> ([comment]: <> &#40;the option to select the ones you want.&#41;)

[comment]: <> ([comment]: <> &#40;### Filters&#41;)

[comment]: <> ([comment]: <> &#40;Now let's go to the most complex part of the library: the filters. There are several ways to apply filters in this&#41;)

[comment]: <> ([comment]: <> &#40;library, so I'm going to break this topic down into subtopics for every possible filter approach.&#41;)

[comment]: <> ([comment]: <> &#40;#### Simple Filters&#41;)

[comment]: <> ([comment]: <> &#40;Simple filters are equality filters. Basically it's set key=value. All filter parameters are defined as string, so there&#41;)

[comment]: <> ([comment]: <> &#40;are some validations that are done on these values.&#41;)

[comment]: <> ([comment]: <> &#40;1. If the value is a string number, it is transformed into a number, either integer or float/double &#40;up to 16 decimal&#41;)

[comment]: <> ([comment]: <> &#40;   places&#41;;&#41;)

[comment]: <> ([comment]: <> &#40;2. If the value is in yyyy-MM-dd format or yyyy-MM-ddThh:mm:ss.sZ format, it is transformed into a Date object;&#41;)

[comment]: <> ([comment]: <> &#40;3. If the value is 'true' or 'false', it is transformed into a boolean value, according to your value;&#41;)

[comment]: <> ([comment]: <> &#40;4. Otherwise, the value is considered as a string.&#41;)

[comment]: <> ([comment]: <> &#40;Example:&#41;)

[comment]: <> ([comment]: <> &#40;##### Request: http://localhost:3000/resources?name=John%20Doe&age=31&birth_date=1990-01-01&#41;)

[comment]: <> ([comment]: <> &#40;##### Query:&#41;)

[comment]: <> ([comment]: <> &#40;```&#41;)

[comment]: <> ([comment]: <> &#40;{&#41;)

[comment]: <> ([comment]: <> &#40;  "filter": {&#41;)

[comment]: <> ([comment]: <> &#40;    "name": "John Doe",&#41;)

[comment]: <> ([comment]: <> &#40;    "age": 31,&#41;)

[comment]: <> ([comment]: <> &#40;    "birth_date": 1990-01-01T00:00:00.000Z&#41;)

[comment]: <> ([comment]: <> &#40;  }&#41;)

[comment]: <> ([comment]: <> &#40;}&#41;)

[comment]: <> ([comment]: <> &#40;```&#41;)

[comment]: <> ([comment]: <> &#40;#### MultiLevel Filters&#41;)

[comment]: <> ([comment]: <> &#40;You can specify multilevel filters. This means that, if you have an object that has a field that is another object, you&#41;)

[comment]: <> ([comment]: <> &#40;can perform a search with filters through the parameters of the internal object. Example:&#41;)

[comment]: <> ([comment]: <> &#40;##### Object&#41;)

[comment]: <> ([comment]: <> &#40;```json&#41;)

[comment]: <> ([comment]: <> &#40;{&#41;)

[comment]: <> ([comment]: <> &#40;  "_id": "613532a350857c1c8d1d10d9",&#41;)

[comment]: <> ([comment]: <> &#40;  "name": "Filippo Nyles",&#41;)

[comment]: <> ([comment]: <> &#40;  "age": 28,&#41;)

[comment]: <> ([comment]: <> &#40;  "current_job": {&#41;)

[comment]: <> ([comment]: <> &#40;    "title": "Budget/Accounting Analyst III",&#41;)

[comment]: <> ([comment]: <> &#40;    "salary": 4776.8&#41;)

[comment]: <> ([comment]: <> &#40;  }&#41;)

[comment]: <> ([comment]: <> &#40;}&#41;)

[comment]: <> ([comment]: <> &#40;```&#41;)

[comment]: <> ([comment]: <> &#40;##### Request: http://localhost:3000/resources?current_job.title=Budget/Accounting%20Analyst%20III&#41;)

[comment]: <> ([comment]: <> &#40;##### Query:&#41;)

[comment]: <> ([comment]: <> &#40;```json&#41;)

[comment]: <> ([comment]: <> &#40;{&#41;)

[comment]: <> ([comment]: <> &#40;  "filter": {&#41;)

[comment]: <> ([comment]: <> &#40;    "current_job.title": "Budget/Accounting Analyst III"&#41;)

[comment]: <> ([comment]: <> &#40;  }&#41;)

[comment]: <> ([comment]: <> &#40;}&#41;)

[comment]: <> ([comment]: <> &#40;```&#41;)

[comment]: <> ([comment]: <> &#40;#### Partial Filters&#41;)

[comment]: <> ([comment]: <> &#40;Partial filters are a way to search a string type value for a part of the value. There are three ways to use partial&#41;)

[comment]: <> ([comment]: <> &#40;filters. Making an analogy with javascript, it would be like using the `startsWith`, `endsWith` and `includes` methods,&#41;)

[comment]: <> ([comment]: <> &#40;where:&#41;)

[comment]: <> ([comment]: <> &#40;- startsWith: search for a string-type value that starts with a given substring. To do this, just add a "\*" at the&#41;)

[comment]: <> ([comment]: <> &#40;  beginning of the substring.&#41;)

[comment]: <> ([comment]: <> &#40;- endsWith: search for a string-type value that ends with a given substring. To do this, just add a "\*" at the end of&#41;)

[comment]: <> ([comment]: <> &#40;  the substring.&#41;)

[comment]: <> ([comment]: <> &#40;- includes: search for a string value that contains a specific substring. To do this, just add a "\*" at the beginning&#41;)

[comment]: <> ([comment]: <> &#40;  and end of the substring.&#41;)

[comment]: <> ([comment]: <> &#40;Example:&#41;)

[comment]: <> ([comment]: <> &#40;##### Request: http://localhost:3000/resources?name=_Lu&email=gmail.com_&job=_Developer_&#41;)

[comment]: <> ([comment]: <> &#40;##### Query:&#41;)

[comment]: <> ([comment]: <> &#40;```JSON&#41;)

[comment]: <> ([comment]: <> &#40;{&#41;)

[comment]: <> ([comment]: <> &#40;  "filter": {&#41;)

[comment]: <> ([comment]: <> &#40;    "name": {&#41;)

[comment]: <> ([comment]: <> &#40;      "$regex": "^Lu",&#41;)

[comment]: <> ([comment]: <> &#40;      "$options": "i"&#41;)

[comment]: <> ([comment]: <> &#40;    },&#41;)

[comment]: <> ([comment]: <> &#40;    "email": {&#41;)

[comment]: <> ([comment]: <> &#40;      "$regex": "gmail.com$",&#41;)

[comment]: <> ([comment]: <> &#40;      "$options": "i"&#41;)

[comment]: <> ([comment]: <> &#40;    },&#41;)

[comment]: <> ([comment]: <> &#40;    "job": {&#41;)

[comment]: <> ([comment]: <> &#40;      "$regex": "Developer",&#41;)

[comment]: <> ([comment]: <> &#40;      "$options": "i"&#41;)

[comment]: <> ([comment]: <> &#40;    }&#41;)

[comment]: <> ([comment]: <> &#40;  }&#41;)

[comment]: <> ([comment]: <> &#40;}&#41;)

[comment]: <> ([comment]: <> &#40;```&#41;)

[comment]: <> ([comment]: <> &#40;#### Comparison Filters&#41;)

[comment]: <> ([comment]: <> &#40;Comparison operators are specific filtering options to check whether a parameter has a value. It is possible to check&#41;)

[comment]: <> ([comment]: <> &#40;not only equality, but other mathematical operators, such as: ">", ">=", "<", "<=", "!=". In addition, you can use&#41;)

[comment]: <> ([comment]: <> &#40;comparison operators to check whether an element is in an array.&#41;)

[comment]: <> ([comment]: <> &#40;According to the [mongodb documentation]&#40;https://docs.mongodb.com/manual/reference/operator/query-comparison/&#41;, the&#41;)

[comment]: <> ([comment]: <> &#40;available comparison operators are:&#41;)

[comment]: <> ([comment]: <> &#40;- $eq: Matches values that are equal to a specified value.&#41;)

[comment]: <> ([comment]: <> &#40;- $gt: Matches values that are greater than a specified value.&#41;)

[comment]: <> ([comment]: <> &#40;- $gte: Matches values that are greater than or equal to a specified value.&#41;)

[comment]: <> ([comment]: <> &#40;- $in: Matches any of the values specified in an array.&#41;)

[comment]: <> ([comment]: <> &#40;- $lt: Matches values that are less than a specified value.&#41;)

[comment]: <> ([comment]: <> &#40;- $lte: Matches values that are less than or equal to a specified value.&#41;)

[comment]: <> ([comment]: <> &#40;- $ne: Matches all values that are not equal to a specified value.&#41;)

[comment]: <> ([comment]: <> &#40;- $nin: Matches none of the values specified in an array.&#41;)

[comment]: <> ([comment]: <> &#40;To use these operators, just pass the comparator tag without the "$" symbol. Example:&#41;)

[comment]: <> ([comment]: <> &#40;##### Request: http://localhost:3000/resources?age=gt:30&#41;)

[comment]: <> ([comment]: <> &#40;##### Query:&#41;)

[comment]: <> ([comment]: <> &#40;```JSON&#41;)

[comment]: <> ([comment]: <> &#40;{&#41;)

[comment]: <> ([comment]: <> &#40;  "filter": {&#41;)

[comment]: <> ([comment]: <> &#40;    "age": {&#41;)

[comment]: <> ([comment]: <> &#40;      "$gt": 30&#41;)

[comment]: <> ([comment]: <> &#40;    }&#41;)

[comment]: <> ([comment]: <> &#40;  }&#41;)

[comment]: <> ([comment]: <> &#40;}&#41;)

[comment]: <> ([comment]: <> &#40;```&#41;)

[comment]: <> ([comment]: <> &#40;I won't put an example with all operators here, but you can test arithmetic comparison operators on parameters with&#41;)

[comment]: <> ([comment]: <> &#40;values of type string or number, or test the operators of `$in` and `$nin` on parameters of type array.&#41;)

[comment]: <> ([comment]: <> &#40;#### Element Filters&#41;)

[comment]: <> ([comment]: <> &#40;Element filters are filters used to deal with parameters that make up the entity's schema. There are two types of&#41;)

[comment]: <> ([comment]: <> &#40;element filter possibilities:&#41;)

[comment]: <> ([comment]: <> &#40;- $exists: returns elements that have or do not have a specific field&#41;)

[comment]: <> ([comment]: <> &#40;- $type: returns elements whose field has a specific type.&#41;)

[comment]: <> ([comment]: <> &#40;Example:&#41;)

[comment]: <> ([comment]: <> &#40;##### Request: http://localhost:3000/resources?created_at=exists:true&updated_at=exists:false&jobs=type:array&#41;)

[comment]: <> ([comment]: <> &#40;##### Query:&#41;)

[comment]: <> ([comment]: <> &#40;```JSON&#41;)

[comment]: <> ([comment]: <> &#40;{&#41;)

[comment]: <> ([comment]: <> &#40;  "filter": {&#41;)

[comment]: <> ([comment]: <> &#40;    "created_at": {&#41;)

[comment]: <> ([comment]: <> &#40;      "$exists": true&#41;)

[comment]: <> ([comment]: <> &#40;    },&#41;)

[comment]: <> ([comment]: <> &#40;    "updated_at": {&#41;)

[comment]: <> ([comment]: <> &#40;      "$exists": false&#41;)

[comment]: <> ([comment]: <> &#40;    },&#41;)

[comment]: <> ([comment]: <> &#40;    "jobs": {&#41;)

[comment]: <> ([comment]: <> &#40;      "$type": "array"&#41;)

[comment]: <> ([comment]: <> &#40;    }&#41;)

[comment]: <> ([comment]: <> &#40;  }&#41;)

[comment]: <> ([comment]: <> &#40;}&#41;)

[comment]: <> ([comment]: <> &#40;```&#41;)

[comment]: <> ([comment]: <> &#40;The $exists filter only works with `true` or `false` values. If a different value is entered, the filter will be&#41;)

[comment]: <> ([comment]: <> &#40;ignored.&#41;)

[comment]: <> ([comment]: <> &#40;The same goes for the $type filter, which only works with valid type values defined in&#41;)

[comment]: <> ([comment]: <> &#40;the [mongodb documentation]&#40;https://docs.mongodb.com/manual/reference/operator/query/type/#mongodb-query-op.-type&#41; &#40;&#41;)

[comment]: <> ([comment]: <> &#40;except deprecated ones&#41;:&#41;)

[comment]: <> ([comment]: <> &#40;```JSON&#41;)

[comment]: <> ([comment]: <> &#40; {&#41;)

[comment]: <> ([comment]: <> &#40;  "validTypes": [&#41;)

[comment]: <> ([comment]: <> &#40;    "double",&#41;)

[comment]: <> ([comment]: <> &#40;    "string",&#41;)

[comment]: <> ([comment]: <> &#40;    "object",&#41;)

[comment]: <> ([comment]: <> &#40;    "array",&#41;)

[comment]: <> ([comment]: <> &#40;    "binData",&#41;)

[comment]: <> ([comment]: <> &#40;    "objectId",&#41;)

[comment]: <> ([comment]: <> &#40;    "bool",&#41;)

[comment]: <> ([comment]: <> &#40;    "date",&#41;)

[comment]: <> ([comment]: <> &#40;    "null",&#41;)

[comment]: <> ([comment]: <> &#40;    "regex",&#41;)

[comment]: <> ([comment]: <> &#40;    "javascript",&#41;)

[comment]: <> ([comment]: <> &#40;    "int",&#41;)

[comment]: <> ([comment]: <> &#40;    "timestamp",&#41;)

[comment]: <> ([comment]: <> &#40;    "long",&#41;)

[comment]: <> ([comment]: <> &#40;    "decimal",&#41;)

[comment]: <> ([comment]: <> &#40;    "minKey",&#41;)

[comment]: <> ([comment]: <> &#40;    "maxKey"&#41;)

[comment]: <> ([comment]: <> &#40;  ]&#41;)

[comment]: <> ([comment]: <> &#40;}&#41;)

[comment]: <> ([comment]: <> &#40;```&#41;)

[comment]: <> ([comment]: <> &#40;#### AND | OR filters&#41;)

[comment]: <> ([comment]: <> &#40;Finally, it is possible to use filters with AND | OR operator. The usage logic follows the arithmetic rule.&#41;)

[comment]: <> ([comment]: <> &#40;To use the AND operator, you must pass the same value twice in a query. Example:&#41;)

[comment]: <> ([comment]: <> &#40;##### Request: http://localhost:3000/resources?age=gt:30&age=lt:50&#41;)

[comment]: <> ([comment]: <> &#40;##### Query:&#41;)

[comment]: <> ([comment]: <> &#40;```JSON&#41;)

[comment]: <> ([comment]: <> &#40;{&#41;)

[comment]: <> ([comment]: <> &#40;  "filter": {&#41;)

[comment]: <> ([comment]: <> &#40;    "$and": [&#41;)

[comment]: <> ([comment]: <> &#40;      {&#41;)

[comment]: <> ([comment]: <> &#40;        "age": {&#41;)

[comment]: <> ([comment]: <> &#40;          "$gt": 30&#41;)

[comment]: <> ([comment]: <> &#40;        }&#41;)

[comment]: <> ([comment]: <> &#40;      },&#41;)

[comment]: <> ([comment]: <> &#40;      {&#41;)

[comment]: <> ([comment]: <> &#40;        "age": {&#41;)

[comment]: <> ([comment]: <> &#40;          "$lt": 50&#41;)

[comment]: <> ([comment]: <> &#40;        }&#41;)

[comment]: <> ([comment]: <> &#40;      }&#41;)

[comment]: <> ([comment]: <> &#40;    ]&#41;)

[comment]: <> ([comment]: <> &#40;  }&#41;)

[comment]: <> ([comment]: <> &#40;}&#41;)

[comment]: <> ([comment]: <> &#40;```&#41;)

[comment]: <> ([comment]: <> &#40;To use the OR operator, you must enter the values separated by a comma. Example:&#41;)

[comment]: <> ([comment]: <> &#40;##### Request: http://localhost:3000/resources?age=30,50&#41;)

[comment]: <> ([comment]: <> &#40;##### Query:&#41;)

[comment]: <> ([comment]: <> &#40;```JSON&#41;)

[comment]: <> ([comment]: <> &#40;{&#41;)

[comment]: <> ([comment]: <> &#40;  "filter": {&#41;)

[comment]: <> ([comment]: <> &#40;    "$or": [&#41;)

[comment]: <> ([comment]: <> &#40;      {&#41;)

[comment]: <> ([comment]: <> &#40;        "age":  30&#41;)

[comment]: <> ([comment]: <> &#40;      },&#41;)

[comment]: <> ([comment]: <> &#40;      {&#41;)

[comment]: <> ([comment]: <> &#40;        "age": 50&#41;)

[comment]: <> ([comment]: <> &#40;      }&#41;)

[comment]: <> ([comment]: <> &#40;    ]&#41;)

[comment]: <> ([comment]: <> &#40;  }&#41;)

[comment]: <> ([comment]: <> &#40;}&#41;)

[comment]: <> ([comment]: <> &#40;```&#41;)

[comment]: <> ([comment]: <> &#40;### Populate&#41;)

[comment]: <> ([comment]: <> &#40;If any collection uses references to other objects, in some operations it is interesting to return this information&#41;)

[comment]: <> ([comment]: <> &#40;populated in the object in a single request. For this, the library supports the `populate` feature.&#41;)

[comment]: <> ([comment]: <> &#40;There are three ways to add the `populate` parameter to the query string:&#41;)

[comment]: <> ([comment]: <> &#40;- Specifying only the field to be populated:&#41;)

[comment]: <> ([comment]: <> &#40;##### Request: http://localhost:3000/resources?populate=jobs&#41;)

[comment]: <> ([comment]: <> &#40;##### Query:&#41;)

[comment]: <> ([comment]: <> &#40;```json&#41;)

[comment]: <> ([comment]: <> &#40;{&#41;)

[comment]: <> ([comment]: <> &#40;  "populate": {&#41;)

[comment]: <> ([comment]: <> &#40;    "path": "jobs"&#41;)

[comment]: <> ([comment]: <> &#40;  }&#41;)

[comment]: <> ([comment]: <> &#40;}&#41;)

[comment]: <> ([comment]: <> &#40;```&#41;)

[comment]: <> ([comment]: <> &#40;- Specifying the field to be populated and which fields should be returned:&#41;)

[comment]: <> ([comment]: <> &#40;##### Request: http://localhost:3000/resources?populate=jobs;title,salary&#41;)

[comment]: <> ([comment]: <> &#40;##### Query:&#41;)

[comment]: <> ([comment]: <> &#40;```json&#41;)

[comment]: <> ([comment]: <> &#40;{&#41;)

[comment]: <> ([comment]: <> &#40;  "populate": {&#41;)

[comment]: <> ([comment]: <> &#40;    "path": "jobs",&#41;)

[comment]: <> ([comment]: <> &#40;    "select": {&#41;)

[comment]: <> ([comment]: <> &#40;      "title": 1,&#41;)

[comment]: <> ([comment]: <> &#40;      "salary": 1&#41;)

[comment]: <> ([comment]: <> &#40;    }&#41;)

[comment]: <> ([comment]: <> &#40;  }&#41;)

[comment]: <> ([comment]: <> &#40;}&#41;)

[comment]: <> ([comment]: <> &#40;```&#41;)

[comment]: <> ([comment]: <> &#40;- Specifying the field to be populated, which fields should be returned and a resource filter &#40;useful parameter when the&#41;)

[comment]: <> ([comment]: <> &#40;  populated field is a list&#41;:&#41;)

[comment]: <> ([comment]: <> &#40;##### Request: http://localhost:3000/resources?populate=jobs;title,salary;salary=gt:3000&#41;)

[comment]: <> ([comment]: <> &#40;##### Query:&#41;)

[comment]: <> ([comment]: <> &#40;```json&#41;)

[comment]: <> ([comment]: <> &#40;{&#41;)

[comment]: <> ([comment]: <> &#40;  "populate": {&#41;)

[comment]: <> ([comment]: <> &#40;    "path": "job",&#41;)

[comment]: <> ([comment]: <> &#40;    "select": {&#41;)

[comment]: <> ([comment]: <> &#40;      "title": 1,&#41;)

[comment]: <> ([comment]: <> &#40;      "salary": 1&#41;)

[comment]: <> ([comment]: <> &#40;    },&#41;)

[comment]: <> ([comment]: <> &#40;    "match": {&#41;)

[comment]: <> ([comment]: <> &#40;      "salary": {&#41;)

[comment]: <> ([comment]: <> &#40;        "$gt": 3000&#41;)

[comment]: <> ([comment]: <> &#40;      }&#41;)

[comment]: <> ([comment]: <> &#40;    }&#41;)

[comment]: <> ([comment]: <> &#40;  }&#41;)

[comment]: <> ([comment]: <> &#40;}&#41;)

[comment]: <> ([comment]: <> &#40;```&#41;)

[comment]: <> ([comment]: <> &#40;- Specifying more than one field to be populated:&#41;)

[comment]: <> ([comment]: <> &#40;##### Request: http://localhost:3000/resources?populate=jobs&populate=currentJob&#41;)

[comment]: <> ([comment]: <> &#40;##### Query:&#41;)

[comment]: <> ([comment]: <> &#40;```json&#41;)

[comment]: <> ([comment]: <> &#40;{&#41;)

[comment]: <> ([comment]: <> &#40;  "populate": [&#41;)

[comment]: <> ([comment]: <> &#40;    {&#41;)

[comment]: <> ([comment]: <> &#40;      "path": "jobs"&#41;)

[comment]: <> ([comment]: <> &#40;    },&#41;)

[comment]: <> ([comment]: <> &#40;    {&#41;)

[comment]: <> ([comment]: <> &#40;      "path": "currentJob"&#41;)

[comment]: <> ([comment]: <> &#40;    }&#41;)

[comment]: <> ([comment]: <> &#40;  ]&#41;)

[comment]: <> ([comment]: <> &#40;}&#41;)

[comment]: <> ([comment]: <> &#40;```&#41;)

[comment]: <> ([comment]: <> &#40;There are some rules to consider in populate. The populate must be specified as follows:&#41;)

[comment]: <> ([comment]: <> &#40;`populate=field;select;filter`. Soon:&#41;)

[comment]: <> ([comment]: <> &#40;1. If you specify only the field to be populated, all field parameters will be returned, and if it is an array, all&#41;)

[comment]: <> ([comment]: <> &#40;   array elements will be returned;&#41;)

[comment]: <> ([comment]: <> &#40;2. If you want to specify which parameters are to be returned from the populated field, you need to specify which fields&#41;)

[comment]: <> ([comment]: <> &#40;   are to be returned;&#41;)

[comment]: <> ([comment]: <> &#40;3. If you want to filter the populated parameters, you need to specify the parameters that should be returned. If you&#41;)

[comment]: <> ([comment]: <> &#40;   want to return all object parameters, the `select` parameter must be informed as `all`.&#41;)

[comment]: <> ([comment]: <> &#40;   Example: `populate=jobs;all;salary=gt:3000`&#41;)

## Usage

More details about usage as soon as possible.

## Rules

- For pagination, you should use `limit`, `skip` and `page` only;
- For ordination, you should use `sort` only;
- Parameters never contain characters that don't fit the regex `/[^A-z0-9_.]/g`;
- Filter values never contain characters that don't fit the regex `/[^\w\s@.-:]/g`;

[comment]: <> (- For select, you should use `select` only;)

[comment]: <> (- For populate, you should use `populate`only;)

[comment]: <> (- Anything other than `limit`, `skip`, `page`, `sort`, `select` and `populate` will be considered a filter;)

## Observations

This library is generic. This means that it handles the query based on the query object itself. Therefore, it is not
possible to control events such as filter parameters with types incompatible with the types defined in the base. Use
proper queries for your API, to prevent implementation errors from being thrown into your app.

## Practical Examples

Check out how the configuration of the library in an API works in practice
in [this project](https://www.github.com/lucasrochagit/nest-query-parser-apis).

## License

Distributed under the Apache License 2.0. See `LICENSE` for more information.

<!-- CONTACT -->

## Authors

- **Lucas Rocha** - _Initial Work_. </br></br>
  [![LinkedIn](https://img.shields.io/static/v1?label=linkedin&message=@lucasrochacc&color=0A66C2)](https://www.linkedin.com/in/lucasrochacc/)
  [![Github](https://img.shields.io/static/v1?label=github&message=@lucasrochagit&color=black)](https://github.com/lucasrochagit/)

[//]: # 'These are reference links used in the body of this note.'
[node.js]: https://nodejs.org
[npm.js]: https://www.npmjs.com/
[license-image]: https://img.shields.io/badge/license-Apache%202.0-blue.svg
[license-url]: https://github.com/lucasrochagit/nest-typeorm-query-parser/blob/main/LICENSE
[npm-image]: https://img.shields.io/npm/v/nest-typeorm-query-parser.svg?color=red&logo=npm
[npm-url]: https://npmjs.org/package/nest-typeorm-query-parser
[npm-downloads-image]: https://img.shields.io/npm/dm/nest-typeorm-query-parser.svg
[npm-downloads-url]: https://npmjs.org/package/nest-typeorm-query-parser
[dependencies-image]: https://shields.io/badge/dependencies-1-green
[dependencies-url]: https://shields.io/badge/dependencies-0-green
[releases-image]: https://img.shields.io/github/release-date/lucasrochagit/nest-typeorm-query-parser.svg
[releases-url]: https://github.com/lucasrochagit/nest-typeorm-query-parser/releases
[contributors-image]: https://img.shields.io/github/contributors/lucasrochagit/nest-typeorm-query-parser.svg?color=green
[contributors-url]: https://github.com/lucasrochagit/nest-typeorm-query-parser/graphs/contributors
[issues-image]: https://img.shields.io/github/issues/lucasrochagit/nest-typeorm-query-parser.svg
