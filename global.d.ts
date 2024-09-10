// global.d.ts
import { MongoClient } from 'mongodb';

declare global {
  namespace NodeJS {
    interface Global {
      _mongoClientPromise: Promise<MongoClient>;
    }
  }
}

// If this file has no import/export statements (i.e., is a script)
// convert it into a module by adding an empty export statement.
export {};


declare global {
  var _mongoClientPromise: Promise<MongoClient>;
}

export {};
