# class-transformer

[![Build Status](https://travis-ci.org/pleerock/class-transformer.svg?branch=master)](https://travis-ci.org/pleerock/class-transformer)
[![codecov](https://codecov.io/gh/pleerock/class-transformer/branch/master/graph/badge.svg)](https://codecov.io/gh/pleerock/class-transformer)
[![npm version](https://badge.fury.io/js/class-transformer.svg)](https://badge.fury.io/js/class-transformer)
[![Dependency Status](https://david-dm.org/pleerock/class-transformer.svg)](https://david-dm.org/pleerock/class-transformer)
[![devDependency Status](https://david-dm.org/pleerock/class-transformer/dev-status.svg)](https://david-dm.org/pleerock/class-transformer#info=devDependencies)
[![Join the chat at https://gitter.im/pleerock/class-transformer](https://badges.gitter.im/pleerock/class-transformer.svg)](https://gitter.im/pleerock/class-transformer?utm_source=badge&utm_medium=badge&utm_campaign=pr-badge&utm_content=badge)

Its ES6 and Typescript era. Nowadays you are working with classes and constructor objects more then ever.
You'll need set of utils to work with them.
Class-transformer allows you to transform plain object to some instance of class and versa.
Also it allows to serialized / deserialize object based on some criteria.

## Installation

### Node.js

1. Install module:

    `npm install class-transformer --save`

2. `reflect-metadata` shim is required, install it too:

    `npm install reflect-metadata --save`

    and make sure to import it in a global place, like app.ts:

    ```typescript
    import "reflect-metadata";
    ```

3. ES6 features are used, if you are using old version of node.js you may need to install es6-shim:

   `npm install es6-shim --save`

   and import it in a global place like app.ts:

    ```typescript
    import "es6-shim";
    ```

### Browser

1. Install module:

    `npm install class-transformer --save`

2. `reflect-metadata` shim is required, install it too:

    `npm install reflect-metadata --save`

    add `<script>` to reflect-metadata in the head of your `index.html`:

    ```html
    <html>
       <head>
           <!-- ... -->
           <script src="node_modules/reflect-metadata/Reflect.js"></script>
       </head>
       <!-- ... -->
    </html>
    ```

    If you are using angular 2 you should already have this shim installed.

3. If you are using system.js you may want to add this into `map` and `package` config:

```json
{
    "map": {
        "class-transformer": "node_modules/class-transformer"
    },
    "packages": {
        "class-transformer": { "main": "index.js", "defaultExtension": "js" }
    }
}
```

## What is class-transformer

In JavaScript there are two types of objects:

* plain (literal) object
* class (constructor) object

Plain objects are plain javascript objects that are instances of `Object` class.
Sometimes they are called **literal** objects, when are being created via `{}` notation.
Class objects are instances of classes with its own defined constructor, properties and methods.
Usually you define them via `class` notation.

So, what is the problem?

Sometimes you want to transform plain javascript object to the ES6 **classes** you have.
For example, if you are loading a json from your backend, some api or from a json file.
After you `JSON.parse` it you have a plain javascript object, not instance of class you have.

For example you have a list of users in your `users.json` that you are loading:

```json
[{
  "id": 1,
  "firstName": "Johny",
  "lastName": "Cage",
  "age": 27
},
{
  "id": 2,
  "firstName": "Ismoil",
  "lastName": "Somoni",
  "age": 50
},
{
  "id": 3,
  "firstName": "Luke",
  "lastName": "Dacascos",
  "age": 12
}]
```
And you have a `User` class:

```typescript
export class User {
    id: number;
    firstName: string;
    lastName: string;
    age: number;

    getName() {
        return this.firstName + " " + this.lastName;
    }

    isAdult() {
        return this.age > 36 && this.age < 60;
    }
}
```

You are assuming that you are downloading users of type `User` from `users.json` file and may want to write
following code:

```typescript
fetch("users.json").then((users: User[]) => {
    // here you can use users[0].id, you can also use users[0].firstName and users[0].lastName
    // however you cannot use users[0].getName() or users[0].isAdult() because "users" actually is
    // array of plain javascript objects, not instances of User object.
    // You actually lied to compiler when you said that `users: User[]`.
});
```

So what to do? How to make a `users` array of instances of `User` objects instead of plain javascript objects?
Solution is to create new instances of User object and manually copy all properties to new objects.

Alternatives? Yes, you can use this library. Purpose of this library is to help you to map you plain javascript
objects to the instances of classes you have created.

This library also great for models exposed in your APIs,
because it provides a great tooling to control what your models are exposing in your API.

#### plainToClass

```typescript
import {plainToClass} from "class-transformer";

let users = plainToClass(User, userJson); // to convert user plain object a single user. also supports arrays
```

This allows to map plain javascript array `usersJson` to array of `User` objects.
Now you can use `users[0].getName()` and `users[0].isAdult()` methods.

#### classToPlain

```typescript
import {classToPlain} from "class-transformer";
let photo = classToPlain(photo);
```

This method transforms your class object back to plain javascript object, that can be `JSON.stringify` later.

#### classToClass

```typescript
import {classToClass} from "class-transformer";
let photo = classToClass(photo);
```

This method transforms your class object into new instance of the class object. This is works pretty much the same
as cloning your object

#### Working with nested objects

When you are trying to transform objects that have nested objects,
its required for this component to known what type of object you are trying to transform.
Since Typescript does not have good reflection abilities yet, we must implicitly specify what type of object each property contain.
This is done using `@Type` decorator.

Lets say we have an album with photos. And we are trying to convert album plain object to constructor object:

```typescript
import {Type, plainToConstructor} from "class-transformer";

export class Album {

    id: number;

    name: string;

    @Type(() => Photo)
    photos: Photo[];
}

export class Photo {
    id: number;
    filename: string;
}

let album = plainToConstructor(Album, albumJson);
// now album is Album object with Photo objects inside
```

### skipping specific properties

Sometimes you want to skip some properties during transformation. This can be done using `@Exclude`
decorator:

```typescript
import {Exclude} from "class-transformer";

export class User {

    id: number;

    email: string;

    @Exclude()
    password: string;
}
```

Now when you'll try to transform objects, `password` property will be skipped and will not be included
in the resulted object.

### converting date strings into Date objects

Sometimes you have dates in your plain old javascript objects received in a string format. And you want to create a
real javascript Date objects from them. To make this component to automatically make your date strings a Date objects
simply pass Date object to the `@Type` decorator:

```typescript
import {Exclude, Type} from "class-transformer";

export class User {

    id: number;

    email: string;

    @Exclude()
    password: string;

    registrationDate: Date;
}
```

Note, that dates will be converted to strings when you'll try to convert constructor object to plain object.

Same technique can be used with `Number`, `String`, `Boolean` primitive types when you want to convert your values
into these types.

### using custom arrays

When you are using arrays you must provide a type of the object that array contains.
This type, you specify in a `@Type()` decorator:

```typescript
import {ArrayType} from "class-transformer";

export class Photo {

    id: number;

    name: string;

    @Type(() => Album)
    albums: Album[];
}
```

You can also use custom array types:

```typescript
import {ArrayType} from "class-transformer";

export class AlbumCollection extends Array<Album> {
    // custom array functions ...
}

export class Photo {

    id: number;

    name: string;

    @Type(() => Album)
    albums: AlbumCollection;
}
```

Library will handle proper transformation automatically.

### How does it handle circular references?

Circular references are being ignored.
For example, if you are transforming class `User` that contains property `photos` with type of `Photo`,
 and `Photo` contains link `user` to its parent `User`, then `user` will be ignored during transformation.

### example with Angular2

Lets say you want to download users and want them automatically to be mapped to the instances of `User` class.

```typescript
import {plainToClass} from "class-transformer";

this.http
    .get("users.json")
    .map(res => res.json())
    .map(res => plainToClass(User, res))
    .subscribe(users => {
        // now "users" is type of User[] and each user have getName() and isAdult() methods available
        console.log(users);
    });
```

You can also inject a class `ClassTransformer` as a service, and use its methods.

## Samples

Take a look on samples in [./sample](https://github.com/pleerock/class-transformer/tree/master/sample) for more examples of
usages.


## Release notes

See information about breaking changes and release notes [here](https://github.com/pleerock/class-transformer/tree/master/doc/release-notes.md).