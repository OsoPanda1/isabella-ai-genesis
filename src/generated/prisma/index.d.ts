
/**
 * Client
**/

import * as runtime from './runtime/library.js';
import $Types = runtime.Types // general types
import $Public = runtime.Types.Public
import $Utils = runtime.Types.Utils
import $Extensions = runtime.Types.Extensions
import $Result = runtime.Types.Result

export type PrismaPromise<T> = $Public.PrismaPromise<T>


/**
 * Model Tenant
 * 
 */
export type Tenant = $Result.DefaultSelection<Prisma.$TenantPayload>
/**
 * Model User
 * 
 */
export type User = $Result.DefaultSelection<Prisma.$UserPayload>
/**
 * Model MonetizationAccount
 * 
 */
export type MonetizationAccount = $Result.DefaultSelection<Prisma.$MonetizationAccountPayload>
/**
 * Model BookPiLedger
 * 
 */
export type BookPiLedger = $Result.DefaultSelection<Prisma.$BookPiLedgerPayload>

/**
 * ##  Prisma Client ʲˢ
 * 
 * Type-safe database client for TypeScript & Node.js
 * @example
 * ```
 * const prisma = new PrismaClient()
 * // Fetch zero or more Tenants
 * const tenants = await prisma.tenant.findMany()
 * ```
 *
 * 
 * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client).
 */
export class PrismaClient<
  ClientOptions extends Prisma.PrismaClientOptions = Prisma.PrismaClientOptions,
  U = 'log' extends keyof ClientOptions ? ClientOptions['log'] extends Array<Prisma.LogLevel | Prisma.LogDefinition> ? Prisma.GetEvents<ClientOptions['log']> : never : never,
  ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs
> {
  [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['other'] }

    /**
   * ##  Prisma Client ʲˢ
   * 
   * Type-safe database client for TypeScript & Node.js
   * @example
   * ```
   * const prisma = new PrismaClient()
   * // Fetch zero or more Tenants
   * const tenants = await prisma.tenant.findMany()
   * ```
   *
   * 
   * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client).
   */

  constructor(optionsArg ?: Prisma.Subset<ClientOptions, Prisma.PrismaClientOptions>);
  $on<V extends U>(eventType: V, callback: (event: V extends 'query' ? Prisma.QueryEvent : Prisma.LogEvent) => void): void;

  /**
   * Connect with the database
   */
  $connect(): $Utils.JsPromise<void>;

  /**
   * Disconnect from the database
   */
  $disconnect(): $Utils.JsPromise<void>;

  /**
   * Add a middleware
   * @deprecated since 4.16.0. For new code, prefer client extensions instead.
   * @see https://pris.ly/d/extensions
   */
  $use(cb: Prisma.Middleware): void

/**
   * Executes a prepared raw query and returns the number of affected rows.
   * @example
   * ```
   * const result = await prisma.$executeRaw`UPDATE User SET cool = ${true} WHERE email = ${'user@email.com'};`
   * ```
   * 
   * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client/raw-database-access).
   */
  $executeRaw<T = unknown>(query: TemplateStringsArray | Prisma.Sql, ...values: any[]): Prisma.PrismaPromise<number>;

  /**
   * Executes a raw query and returns the number of affected rows.
   * Susceptible to SQL injections, see documentation.
   * @example
   * ```
   * const result = await prisma.$executeRawUnsafe('UPDATE User SET cool = $1 WHERE email = $2 ;', true, 'user@email.com')
   * ```
   * 
   * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client/raw-database-access).
   */
  $executeRawUnsafe<T = unknown>(query: string, ...values: any[]): Prisma.PrismaPromise<number>;

  /**
   * Performs a prepared raw query and returns the `SELECT` data.
   * @example
   * ```
   * const result = await prisma.$queryRaw`SELECT * FROM User WHERE id = ${1} OR email = ${'user@email.com'};`
   * ```
   * 
   * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client/raw-database-access).
   */
  $queryRaw<T = unknown>(query: TemplateStringsArray | Prisma.Sql, ...values: any[]): Prisma.PrismaPromise<T>;

  /**
   * Performs a raw query and returns the `SELECT` data.
   * Susceptible to SQL injections, see documentation.
   * @example
   * ```
   * const result = await prisma.$queryRawUnsafe('SELECT * FROM User WHERE id = $1 OR email = $2;', 1, 'user@email.com')
   * ```
   * 
   * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client/raw-database-access).
   */
  $queryRawUnsafe<T = unknown>(query: string, ...values: any[]): Prisma.PrismaPromise<T>;


  /**
   * Allows the running of a sequence of read/write operations that are guaranteed to either succeed or fail as a whole.
   * @example
   * ```
   * const [george, bob, alice] = await prisma.$transaction([
   *   prisma.user.create({ data: { name: 'George' } }),
   *   prisma.user.create({ data: { name: 'Bob' } }),
   *   prisma.user.create({ data: { name: 'Alice' } }),
   * ])
   * ```
   * 
   * Read more in our [docs](https://www.prisma.io/docs/concepts/components/prisma-client/transactions).
   */
  $transaction<P extends Prisma.PrismaPromise<any>[]>(arg: [...P], options?: { isolationLevel?: Prisma.TransactionIsolationLevel }): $Utils.JsPromise<runtime.Types.Utils.UnwrapTuple<P>>

  $transaction<R>(fn: (prisma: Omit<PrismaClient, runtime.ITXClientDenyList>) => $Utils.JsPromise<R>, options?: { maxWait?: number, timeout?: number, isolationLevel?: Prisma.TransactionIsolationLevel }): $Utils.JsPromise<R>


  $extends: $Extensions.ExtendsHook<"extends", Prisma.TypeMapCb, ExtArgs>

      /**
   * `prisma.tenant`: Exposes CRUD operations for the **Tenant** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more Tenants
    * const tenants = await prisma.tenant.findMany()
    * ```
    */
  get tenant(): Prisma.TenantDelegate<ExtArgs>;

  /**
   * `prisma.user`: Exposes CRUD operations for the **User** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more Users
    * const users = await prisma.user.findMany()
    * ```
    */
  get user(): Prisma.UserDelegate<ExtArgs>;

  /**
   * `prisma.monetizationAccount`: Exposes CRUD operations for the **MonetizationAccount** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more MonetizationAccounts
    * const monetizationAccounts = await prisma.monetizationAccount.findMany()
    * ```
    */
  get monetizationAccount(): Prisma.MonetizationAccountDelegate<ExtArgs>;

  /**
   * `prisma.bookPiLedger`: Exposes CRUD operations for the **BookPiLedger** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more BookPiLedgers
    * const bookPiLedgers = await prisma.bookPiLedger.findMany()
    * ```
    */
  get bookPiLedger(): Prisma.BookPiLedgerDelegate<ExtArgs>;
}

export namespace Prisma {
  export import DMMF = runtime.DMMF

  export type PrismaPromise<T> = $Public.PrismaPromise<T>

  /**
   * Validator
   */
  export import validator = runtime.Public.validator

  /**
   * Prisma Errors
   */
  export import PrismaClientKnownRequestError = runtime.PrismaClientKnownRequestError
  export import PrismaClientUnknownRequestError = runtime.PrismaClientUnknownRequestError
  export import PrismaClientRustPanicError = runtime.PrismaClientRustPanicError
  export import PrismaClientInitializationError = runtime.PrismaClientInitializationError
  export import PrismaClientValidationError = runtime.PrismaClientValidationError
  export import NotFoundError = runtime.NotFoundError

  /**
   * Re-export of sql-template-tag
   */
  export import sql = runtime.sqltag
  export import empty = runtime.empty
  export import join = runtime.join
  export import raw = runtime.raw
  export import Sql = runtime.Sql



  /**
   * Decimal.js
   */
  export import Decimal = runtime.Decimal

  export type DecimalJsLike = runtime.DecimalJsLike

  /**
   * Metrics 
   */
  export type Metrics = runtime.Metrics
  export type Metric<T> = runtime.Metric<T>
  export type MetricHistogram = runtime.MetricHistogram
  export type MetricHistogramBucket = runtime.MetricHistogramBucket

  /**
  * Extensions
  */
  export import Extension = $Extensions.UserArgs
  export import getExtensionContext = runtime.Extensions.getExtensionContext
  export import Args = $Public.Args
  export import Payload = $Public.Payload
  export import Result = $Public.Result
  export import Exact = $Public.Exact

  /**
   * Prisma Client JS version: 5.22.0
   * Query Engine version: 605197351a3c8bdd595af2d2a9bc3025bca48ea2
   */
  export type PrismaVersion = {
    client: string
  }

  export const prismaVersion: PrismaVersion 

  /**
   * Utility Types
   */


  export import JsonObject = runtime.JsonObject
  export import JsonArray = runtime.JsonArray
  export import JsonValue = runtime.JsonValue
  export import InputJsonObject = runtime.InputJsonObject
  export import InputJsonArray = runtime.InputJsonArray
  export import InputJsonValue = runtime.InputJsonValue

  /**
   * Types of the values used to represent different kinds of `null` values when working with JSON fields.
   * 
   * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
   */
  namespace NullTypes {
    /**
    * Type of `Prisma.DbNull`.
    * 
    * You cannot use other instances of this class. Please use the `Prisma.DbNull` value.
    * 
    * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
    */
    class DbNull {
      private DbNull: never
      private constructor()
    }

    /**
    * Type of `Prisma.JsonNull`.
    * 
    * You cannot use other instances of this class. Please use the `Prisma.JsonNull` value.
    * 
    * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
    */
    class JsonNull {
      private JsonNull: never
      private constructor()
    }

    /**
    * Type of `Prisma.AnyNull`.
    * 
    * You cannot use other instances of this class. Please use the `Prisma.AnyNull` value.
    * 
    * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
    */
    class AnyNull {
      private AnyNull: never
      private constructor()
    }
  }

  /**
   * Helper for filtering JSON entries that have `null` on the database (empty on the db)
   * 
   * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
   */
  export const DbNull: NullTypes.DbNull

  /**
   * Helper for filtering JSON entries that have JSON `null` values (not empty on the db)
   * 
   * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
   */
  export const JsonNull: NullTypes.JsonNull

  /**
   * Helper for filtering JSON entries that are `Prisma.DbNull` or `Prisma.JsonNull`
   * 
   * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
   */
  export const AnyNull: NullTypes.AnyNull

  type SelectAndInclude = {
    select: any
    include: any
  }

  type SelectAndOmit = {
    select: any
    omit: any
  }

  /**
   * Get the type of the value, that the Promise holds.
   */
  export type PromiseType<T extends PromiseLike<any>> = T extends PromiseLike<infer U> ? U : T;

  /**
   * Get the return type of a function which returns a Promise.
   */
  export type PromiseReturnType<T extends (...args: any) => $Utils.JsPromise<any>> = PromiseType<ReturnType<T>>

  /**
   * From T, pick a set of properties whose keys are in the union K
   */
  type Prisma__Pick<T, K extends keyof T> = {
      [P in K]: T[P];
  };


  export type Enumerable<T> = T | Array<T>;

  export type RequiredKeys<T> = {
    [K in keyof T]-?: {} extends Prisma__Pick<T, K> ? never : K
  }[keyof T]

  export type TruthyKeys<T> = keyof {
    [K in keyof T as T[K] extends false | undefined | null ? never : K]: K
  }

  export type TrueKeys<T> = TruthyKeys<Prisma__Pick<T, RequiredKeys<T>>>

  /**
   * Subset
   * @desc From `T` pick properties that exist in `U`. Simple version of Intersection
   */
  export type Subset<T, U> = {
    [key in keyof T]: key extends keyof U ? T[key] : never;
  };

  /**
   * SelectSubset
   * @desc From `T` pick properties that exist in `U`. Simple version of Intersection.
   * Additionally, it validates, if both select and include are present. If the case, it errors.
   */
  export type SelectSubset<T, U> = {
    [key in keyof T]: key extends keyof U ? T[key] : never
  } &
    (T extends SelectAndInclude
      ? 'Please either choose `select` or `include`.'
      : T extends SelectAndOmit
        ? 'Please either choose `select` or `omit`.'
        : {})

  /**
   * Subset + Intersection
   * @desc From `T` pick properties that exist in `U` and intersect `K`
   */
  export type SubsetIntersection<T, U, K> = {
    [key in keyof T]: key extends keyof U ? T[key] : never
  } &
    K

  type Without<T, U> = { [P in Exclude<keyof T, keyof U>]?: never };

  /**
   * XOR is needed to have a real mutually exclusive union type
   * https://stackoverflow.com/questions/42123407/does-typescript-support-mutually-exclusive-types
   */
  type XOR<T, U> =
    T extends object ?
    U extends object ?
      (Without<T, U> & U) | (Without<U, T> & T)
    : U : T


  /**
   * Is T a Record?
   */
  type IsObject<T extends any> = T extends Array<any>
  ? False
  : T extends Date
  ? False
  : T extends Uint8Array
  ? False
  : T extends BigInt
  ? False
  : T extends object
  ? True
  : False


  /**
   * If it's T[], return T
   */
  export type UnEnumerate<T extends unknown> = T extends Array<infer U> ? U : T

  /**
   * From ts-toolbelt
   */

  type __Either<O extends object, K extends Key> = Omit<O, K> &
    {
      // Merge all but K
      [P in K]: Prisma__Pick<O, P & keyof O> // With K possibilities
    }[K]

  type EitherStrict<O extends object, K extends Key> = Strict<__Either<O, K>>

  type EitherLoose<O extends object, K extends Key> = ComputeRaw<__Either<O, K>>

  type _Either<
    O extends object,
    K extends Key,
    strict extends Boolean
  > = {
    1: EitherStrict<O, K>
    0: EitherLoose<O, K>
  }[strict]

  type Either<
    O extends object,
    K extends Key,
    strict extends Boolean = 1
  > = O extends unknown ? _Either<O, K, strict> : never

  export type Union = any

  type PatchUndefined<O extends object, O1 extends object> = {
    [K in keyof O]: O[K] extends undefined ? At<O1, K> : O[K]
  } & {}

  /** Helper Types for "Merge" **/
  export type IntersectOf<U extends Union> = (
    U extends unknown ? (k: U) => void : never
  ) extends (k: infer I) => void
    ? I
    : never

  export type Overwrite<O extends object, O1 extends object> = {
      [K in keyof O]: K extends keyof O1 ? O1[K] : O[K];
  } & {};

  type _Merge<U extends object> = IntersectOf<Overwrite<U, {
      [K in keyof U]-?: At<U, K>;
  }>>;

  type Key = string | number | symbol;
  type AtBasic<O extends object, K extends Key> = K extends keyof O ? O[K] : never;
  type AtStrict<O extends object, K extends Key> = O[K & keyof O];
  type AtLoose<O extends object, K extends Key> = O extends unknown ? AtStrict<O, K> : never;
  export type At<O extends object, K extends Key, strict extends Boolean = 1> = {
      1: AtStrict<O, K>;
      0: AtLoose<O, K>;
  }[strict];

  export type ComputeRaw<A extends any> = A extends Function ? A : {
    [K in keyof A]: A[K];
  } & {};

  export type OptionalFlat<O> = {
    [K in keyof O]?: O[K];
  } & {};

  type _Record<K extends keyof any, T> = {
    [P in K]: T;
  };

  // cause typescript not to expand types and preserve names
  type NoExpand<T> = T extends unknown ? T : never;

  // this type assumes the passed object is entirely optional
  type AtLeast<O extends object, K extends string> = NoExpand<
    O extends unknown
    ? | (K extends keyof O ? { [P in K]: O[P] } & O : O)
      | {[P in keyof O as P extends K ? K : never]-?: O[P]} & O
    : never>;

  type _Strict<U, _U = U> = U extends unknown ? U & OptionalFlat<_Record<Exclude<Keys<_U>, keyof U>, never>> : never;

  export type Strict<U extends object> = ComputeRaw<_Strict<U>>;
  /** End Helper Types for "Merge" **/

  export type Merge<U extends object> = ComputeRaw<_Merge<Strict<U>>>;

  /**
  A [[Boolean]]
  */
  export type Boolean = True | False

  // /**
  // 1
  // */
  export type True = 1

  /**
  0
  */
  export type False = 0

  export type Not<B extends Boolean> = {
    0: 1
    1: 0
  }[B]

  export type Extends<A1 extends any, A2 extends any> = [A1] extends [never]
    ? 0 // anything `never` is false
    : A1 extends A2
    ? 1
    : 0

  export type Has<U extends Union, U1 extends Union> = Not<
    Extends<Exclude<U1, U>, U1>
  >

  export type Or<B1 extends Boolean, B2 extends Boolean> = {
    0: {
      0: 0
      1: 1
    }
    1: {
      0: 1
      1: 1
    }
  }[B1][B2]

  export type Keys<U extends Union> = U extends unknown ? keyof U : never

  type Cast<A, B> = A extends B ? A : B;

  export const type: unique symbol;



  /**
   * Used by group by
   */

  export type GetScalarType<T, O> = O extends object ? {
    [P in keyof T]: P extends keyof O
      ? O[P]
      : never
  } : never

  type FieldPaths<
    T,
    U = Omit<T, '_avg' | '_sum' | '_count' | '_min' | '_max'>
  > = IsObject<T> extends True ? U : T

  type GetHavingFields<T> = {
    [K in keyof T]: Or<
      Or<Extends<'OR', K>, Extends<'AND', K>>,
      Extends<'NOT', K>
    > extends True
      ? // infer is only needed to not hit TS limit
        // based on the brilliant idea of Pierre-Antoine Mills
        // https://github.com/microsoft/TypeScript/issues/30188#issuecomment-478938437
        T[K] extends infer TK
        ? GetHavingFields<UnEnumerate<TK> extends object ? Merge<UnEnumerate<TK>> : never>
        : never
      : {} extends FieldPaths<T[K]>
      ? never
      : K
  }[keyof T]

  /**
   * Convert tuple to union
   */
  type _TupleToUnion<T> = T extends (infer E)[] ? E : never
  type TupleToUnion<K extends readonly any[]> = _TupleToUnion<K>
  type MaybeTupleToUnion<T> = T extends any[] ? TupleToUnion<T> : T

  /**
   * Like `Pick`, but additionally can also accept an array of keys
   */
  type PickEnumerable<T, K extends Enumerable<keyof T> | keyof T> = Prisma__Pick<T, MaybeTupleToUnion<K>>

  /**
   * Exclude all keys with underscores
   */
  type ExcludeUnderscoreKeys<T extends string> = T extends `_${string}` ? never : T


  export type FieldRef<Model, FieldType> = runtime.FieldRef<Model, FieldType>

  type FieldRefInputType<Model, FieldType> = Model extends never ? never : FieldRef<Model, FieldType>


  export const ModelName: {
    Tenant: 'Tenant',
    User: 'User',
    MonetizationAccount: 'MonetizationAccount',
    BookPiLedger: 'BookPiLedger'
  };

  export type ModelName = (typeof ModelName)[keyof typeof ModelName]


  export type Datasources = {
    db?: Datasource
  }

  interface TypeMapCb extends $Utils.Fn<{extArgs: $Extensions.InternalArgs, clientOptions: PrismaClientOptions }, $Utils.Record<string, any>> {
    returns: Prisma.TypeMap<this['params']['extArgs'], this['params']['clientOptions']>
  }

  export type TypeMap<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, ClientOptions = {}> = {
    meta: {
      modelProps: "tenant" | "user" | "monetizationAccount" | "bookPiLedger"
      txIsolationLevel: Prisma.TransactionIsolationLevel
    }
    model: {
      Tenant: {
        payload: Prisma.$TenantPayload<ExtArgs>
        fields: Prisma.TenantFieldRefs
        operations: {
          findUnique: {
            args: Prisma.TenantFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TenantPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.TenantFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TenantPayload>
          }
          findFirst: {
            args: Prisma.TenantFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TenantPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.TenantFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TenantPayload>
          }
          findMany: {
            args: Prisma.TenantFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TenantPayload>[]
          }
          create: {
            args: Prisma.TenantCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TenantPayload>
          }
          createMany: {
            args: Prisma.TenantCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.TenantCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TenantPayload>[]
          }
          delete: {
            args: Prisma.TenantDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TenantPayload>
          }
          update: {
            args: Prisma.TenantUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TenantPayload>
          }
          deleteMany: {
            args: Prisma.TenantDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.TenantUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          upsert: {
            args: Prisma.TenantUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TenantPayload>
          }
          aggregate: {
            args: Prisma.TenantAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateTenant>
          }
          groupBy: {
            args: Prisma.TenantGroupByArgs<ExtArgs>
            result: $Utils.Optional<TenantGroupByOutputType>[]
          }
          count: {
            args: Prisma.TenantCountArgs<ExtArgs>
            result: $Utils.Optional<TenantCountAggregateOutputType> | number
          }
        }
      }
      User: {
        payload: Prisma.$UserPayload<ExtArgs>
        fields: Prisma.UserFieldRefs
        operations: {
          findUnique: {
            args: Prisma.UserFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.UserFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload>
          }
          findFirst: {
            args: Prisma.UserFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.UserFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload>
          }
          findMany: {
            args: Prisma.UserFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload>[]
          }
          create: {
            args: Prisma.UserCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload>
          }
          createMany: {
            args: Prisma.UserCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.UserCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload>[]
          }
          delete: {
            args: Prisma.UserDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload>
          }
          update: {
            args: Prisma.UserUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload>
          }
          deleteMany: {
            args: Prisma.UserDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.UserUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          upsert: {
            args: Prisma.UserUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload>
          }
          aggregate: {
            args: Prisma.UserAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateUser>
          }
          groupBy: {
            args: Prisma.UserGroupByArgs<ExtArgs>
            result: $Utils.Optional<UserGroupByOutputType>[]
          }
          count: {
            args: Prisma.UserCountArgs<ExtArgs>
            result: $Utils.Optional<UserCountAggregateOutputType> | number
          }
        }
      }
      MonetizationAccount: {
        payload: Prisma.$MonetizationAccountPayload<ExtArgs>
        fields: Prisma.MonetizationAccountFieldRefs
        operations: {
          findUnique: {
            args: Prisma.MonetizationAccountFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$MonetizationAccountPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.MonetizationAccountFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$MonetizationAccountPayload>
          }
          findFirst: {
            args: Prisma.MonetizationAccountFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$MonetizationAccountPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.MonetizationAccountFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$MonetizationAccountPayload>
          }
          findMany: {
            args: Prisma.MonetizationAccountFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$MonetizationAccountPayload>[]
          }
          create: {
            args: Prisma.MonetizationAccountCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$MonetizationAccountPayload>
          }
          createMany: {
            args: Prisma.MonetizationAccountCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.MonetizationAccountCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$MonetizationAccountPayload>[]
          }
          delete: {
            args: Prisma.MonetizationAccountDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$MonetizationAccountPayload>
          }
          update: {
            args: Prisma.MonetizationAccountUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$MonetizationAccountPayload>
          }
          deleteMany: {
            args: Prisma.MonetizationAccountDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.MonetizationAccountUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          upsert: {
            args: Prisma.MonetizationAccountUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$MonetizationAccountPayload>
          }
          aggregate: {
            args: Prisma.MonetizationAccountAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateMonetizationAccount>
          }
          groupBy: {
            args: Prisma.MonetizationAccountGroupByArgs<ExtArgs>
            result: $Utils.Optional<MonetizationAccountGroupByOutputType>[]
          }
          count: {
            args: Prisma.MonetizationAccountCountArgs<ExtArgs>
            result: $Utils.Optional<MonetizationAccountCountAggregateOutputType> | number
          }
        }
      }
      BookPiLedger: {
        payload: Prisma.$BookPiLedgerPayload<ExtArgs>
        fields: Prisma.BookPiLedgerFieldRefs
        operations: {
          findUnique: {
            args: Prisma.BookPiLedgerFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$BookPiLedgerPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.BookPiLedgerFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$BookPiLedgerPayload>
          }
          findFirst: {
            args: Prisma.BookPiLedgerFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$BookPiLedgerPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.BookPiLedgerFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$BookPiLedgerPayload>
          }
          findMany: {
            args: Prisma.BookPiLedgerFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$BookPiLedgerPayload>[]
          }
          create: {
            args: Prisma.BookPiLedgerCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$BookPiLedgerPayload>
          }
          createMany: {
            args: Prisma.BookPiLedgerCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.BookPiLedgerCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$BookPiLedgerPayload>[]
          }
          delete: {
            args: Prisma.BookPiLedgerDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$BookPiLedgerPayload>
          }
          update: {
            args: Prisma.BookPiLedgerUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$BookPiLedgerPayload>
          }
          deleteMany: {
            args: Prisma.BookPiLedgerDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.BookPiLedgerUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          upsert: {
            args: Prisma.BookPiLedgerUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$BookPiLedgerPayload>
          }
          aggregate: {
            args: Prisma.BookPiLedgerAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateBookPiLedger>
          }
          groupBy: {
            args: Prisma.BookPiLedgerGroupByArgs<ExtArgs>
            result: $Utils.Optional<BookPiLedgerGroupByOutputType>[]
          }
          count: {
            args: Prisma.BookPiLedgerCountArgs<ExtArgs>
            result: $Utils.Optional<BookPiLedgerCountAggregateOutputType> | number
          }
        }
      }
    }
  } & {
    other: {
      payload: any
      operations: {
        $executeRaw: {
          args: [query: TemplateStringsArray | Prisma.Sql, ...values: any[]],
          result: any
        }
        $executeRawUnsafe: {
          args: [query: string, ...values: any[]],
          result: any
        }
        $queryRaw: {
          args: [query: TemplateStringsArray | Prisma.Sql, ...values: any[]],
          result: any
        }
        $queryRawUnsafe: {
          args: [query: string, ...values: any[]],
          result: any
        }
      }
    }
  }
  export const defineExtension: $Extensions.ExtendsHook<"define", Prisma.TypeMapCb, $Extensions.DefaultArgs>
  export type DefaultPrismaClient = PrismaClient
  export type ErrorFormat = 'pretty' | 'colorless' | 'minimal'
  export interface PrismaClientOptions {
    /**
     * Overwrites the datasource url from your schema.prisma file
     */
    datasources?: Datasources
    /**
     * Overwrites the datasource url from your schema.prisma file
     */
    datasourceUrl?: string
    /**
     * @default "colorless"
     */
    errorFormat?: ErrorFormat
    /**
     * @example
     * ```
     * // Defaults to stdout
     * log: ['query', 'info', 'warn', 'error']
     * 
     * // Emit as events
     * log: [
     *   { emit: 'stdout', level: 'query' },
     *   { emit: 'stdout', level: 'info' },
     *   { emit: 'stdout', level: 'warn' }
     *   { emit: 'stdout', level: 'error' }
     * ]
     * ```
     * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client/logging#the-log-option).
     */
    log?: (LogLevel | LogDefinition)[]
    /**
     * The default values for transactionOptions
     * maxWait ?= 2000
     * timeout ?= 5000
     */
    transactionOptions?: {
      maxWait?: number
      timeout?: number
      isolationLevel?: Prisma.TransactionIsolationLevel
    }
  }


  /* Types for Logging */
  export type LogLevel = 'info' | 'query' | 'warn' | 'error'
  export type LogDefinition = {
    level: LogLevel
    emit: 'stdout' | 'event'
  }

  export type GetLogType<T extends LogLevel | LogDefinition> = T extends LogDefinition ? T['emit'] extends 'event' ? T['level'] : never : never
  export type GetEvents<T extends any> = T extends Array<LogLevel | LogDefinition> ?
    GetLogType<T[0]> | GetLogType<T[1]> | GetLogType<T[2]> | GetLogType<T[3]>
    : never

  export type QueryEvent = {
    timestamp: Date
    query: string
    params: string
    duration: number
    target: string
  }

  export type LogEvent = {
    timestamp: Date
    message: string
    target: string
  }
  /* End Types for Logging */


  export type PrismaAction =
    | 'findUnique'
    | 'findUniqueOrThrow'
    | 'findMany'
    | 'findFirst'
    | 'findFirstOrThrow'
    | 'create'
    | 'createMany'
    | 'createManyAndReturn'
    | 'update'
    | 'updateMany'
    | 'upsert'
    | 'delete'
    | 'deleteMany'
    | 'executeRaw'
    | 'queryRaw'
    | 'aggregate'
    | 'count'
    | 'runCommandRaw'
    | 'findRaw'
    | 'groupBy'

  /**
   * These options are being passed into the middleware as "params"
   */
  export type MiddlewareParams = {
    model?: ModelName
    action: PrismaAction
    args: any
    dataPath: string[]
    runInTransaction: boolean
  }

  /**
   * The `T` type makes sure, that the `return proceed` is not forgotten in the middleware implementation
   */
  export type Middleware<T = any> = (
    params: MiddlewareParams,
    next: (params: MiddlewareParams) => $Utils.JsPromise<T>,
  ) => $Utils.JsPromise<T>

  // tested in getLogLevel.test.ts
  export function getLogLevel(log: Array<LogLevel | LogDefinition>): LogLevel | undefined;

  /**
   * `PrismaClient` proxy available in interactive transactions.
   */
  export type TransactionClient = Omit<Prisma.DefaultPrismaClient, runtime.ITXClientDenyList>

  export type Datasource = {
    url?: string
  }

  /**
   * Count Types
   */


  /**
   * Count Type TenantCountOutputType
   */

  export type TenantCountOutputType = {
    users: number
    bookPi: number
  }

  export type TenantCountOutputTypeSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    users?: boolean | TenantCountOutputTypeCountUsersArgs
    bookPi?: boolean | TenantCountOutputTypeCountBookPiArgs
  }

  // Custom InputTypes
  /**
   * TenantCountOutputType without action
   */
  export type TenantCountOutputTypeDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the TenantCountOutputType
     */
    select?: TenantCountOutputTypeSelect<ExtArgs> | null
  }

  /**
   * TenantCountOutputType without action
   */
  export type TenantCountOutputTypeCountUsersArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: UserWhereInput
  }

  /**
   * TenantCountOutputType without action
   */
  export type TenantCountOutputTypeCountBookPiArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: BookPiLedgerWhereInput
  }


  /**
   * Models
   */

  /**
   * Model Tenant
   */

  export type AggregateTenant = {
    _count: TenantCountAggregateOutputType | null
    _min: TenantMinAggregateOutputType | null
    _max: TenantMaxAggregateOutputType | null
  }

  export type TenantMinAggregateOutputType = {
    id: string | null
    name: string | null
    createdAt: Date | null
  }

  export type TenantMaxAggregateOutputType = {
    id: string | null
    name: string | null
    createdAt: Date | null
  }

  export type TenantCountAggregateOutputType = {
    id: number
    name: number
    createdAt: number
    _all: number
  }


  export type TenantMinAggregateInputType = {
    id?: true
    name?: true
    createdAt?: true
  }

  export type TenantMaxAggregateInputType = {
    id?: true
    name?: true
    createdAt?: true
  }

  export type TenantCountAggregateInputType = {
    id?: true
    name?: true
    createdAt?: true
    _all?: true
  }

  export type TenantAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Tenant to aggregate.
     */
    where?: TenantWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Tenants to fetch.
     */
    orderBy?: TenantOrderByWithRelationInput | TenantOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: TenantWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Tenants from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Tenants.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned Tenants
    **/
    _count?: true | TenantCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: TenantMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: TenantMaxAggregateInputType
  }

  export type GetTenantAggregateType<T extends TenantAggregateArgs> = {
        [P in keyof T & keyof AggregateTenant]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateTenant[P]>
      : GetScalarType<T[P], AggregateTenant[P]>
  }




  export type TenantGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: TenantWhereInput
    orderBy?: TenantOrderByWithAggregationInput | TenantOrderByWithAggregationInput[]
    by: TenantScalarFieldEnum[] | TenantScalarFieldEnum
    having?: TenantScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: TenantCountAggregateInputType | true
    _min?: TenantMinAggregateInputType
    _max?: TenantMaxAggregateInputType
  }

  export type TenantGroupByOutputType = {
    id: string
    name: string
    createdAt: Date
    _count: TenantCountAggregateOutputType | null
    _min: TenantMinAggregateOutputType | null
    _max: TenantMaxAggregateOutputType | null
  }

  type GetTenantGroupByPayload<T extends TenantGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<TenantGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof TenantGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], TenantGroupByOutputType[P]>
            : GetScalarType<T[P], TenantGroupByOutputType[P]>
        }
      >
    >


  export type TenantSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    name?: boolean
    createdAt?: boolean
    users?: boolean | Tenant$usersArgs<ExtArgs>
    bookPi?: boolean | Tenant$bookPiArgs<ExtArgs>
    _count?: boolean | TenantCountOutputTypeDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["tenant"]>

  export type TenantSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    name?: boolean
    createdAt?: boolean
  }, ExtArgs["result"]["tenant"]>

  export type TenantSelectScalar = {
    id?: boolean
    name?: boolean
    createdAt?: boolean
  }

  export type TenantInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    users?: boolean | Tenant$usersArgs<ExtArgs>
    bookPi?: boolean | Tenant$bookPiArgs<ExtArgs>
    _count?: boolean | TenantCountOutputTypeDefaultArgs<ExtArgs>
  }
  export type TenantIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {}

  export type $TenantPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "Tenant"
    objects: {
      users: Prisma.$UserPayload<ExtArgs>[]
      bookPi: Prisma.$BookPiLedgerPayload<ExtArgs>[]
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      name: string
      createdAt: Date
    }, ExtArgs["result"]["tenant"]>
    composites: {}
  }

  type TenantGetPayload<S extends boolean | null | undefined | TenantDefaultArgs> = $Result.GetResult<Prisma.$TenantPayload, S>

  type TenantCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = 
    Omit<TenantFindManyArgs, 'select' | 'include' | 'distinct'> & {
      select?: TenantCountAggregateInputType | true
    }

  export interface TenantDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['Tenant'], meta: { name: 'Tenant' } }
    /**
     * Find zero or one Tenant that matches the filter.
     * @param {TenantFindUniqueArgs} args - Arguments to find a Tenant
     * @example
     * // Get one Tenant
     * const tenant = await prisma.tenant.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends TenantFindUniqueArgs>(args: SelectSubset<T, TenantFindUniqueArgs<ExtArgs>>): Prisma__TenantClient<$Result.GetResult<Prisma.$TenantPayload<ExtArgs>, T, "findUnique"> | null, null, ExtArgs>

    /**
     * Find one Tenant that matches the filter or throw an error with `error.code='P2025'` 
     * if no matches were found.
     * @param {TenantFindUniqueOrThrowArgs} args - Arguments to find a Tenant
     * @example
     * // Get one Tenant
     * const tenant = await prisma.tenant.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends TenantFindUniqueOrThrowArgs>(args: SelectSubset<T, TenantFindUniqueOrThrowArgs<ExtArgs>>): Prisma__TenantClient<$Result.GetResult<Prisma.$TenantPayload<ExtArgs>, T, "findUniqueOrThrow">, never, ExtArgs>

    /**
     * Find the first Tenant that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {TenantFindFirstArgs} args - Arguments to find a Tenant
     * @example
     * // Get one Tenant
     * const tenant = await prisma.tenant.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends TenantFindFirstArgs>(args?: SelectSubset<T, TenantFindFirstArgs<ExtArgs>>): Prisma__TenantClient<$Result.GetResult<Prisma.$TenantPayload<ExtArgs>, T, "findFirst"> | null, null, ExtArgs>

    /**
     * Find the first Tenant that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {TenantFindFirstOrThrowArgs} args - Arguments to find a Tenant
     * @example
     * // Get one Tenant
     * const tenant = await prisma.tenant.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends TenantFindFirstOrThrowArgs>(args?: SelectSubset<T, TenantFindFirstOrThrowArgs<ExtArgs>>): Prisma__TenantClient<$Result.GetResult<Prisma.$TenantPayload<ExtArgs>, T, "findFirstOrThrow">, never, ExtArgs>

    /**
     * Find zero or more Tenants that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {TenantFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Tenants
     * const tenants = await prisma.tenant.findMany()
     * 
     * // Get first 10 Tenants
     * const tenants = await prisma.tenant.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const tenantWithIdOnly = await prisma.tenant.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends TenantFindManyArgs>(args?: SelectSubset<T, TenantFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$TenantPayload<ExtArgs>, T, "findMany">>

    /**
     * Create a Tenant.
     * @param {TenantCreateArgs} args - Arguments to create a Tenant.
     * @example
     * // Create one Tenant
     * const Tenant = await prisma.tenant.create({
     *   data: {
     *     // ... data to create a Tenant
     *   }
     * })
     * 
     */
    create<T extends TenantCreateArgs>(args: SelectSubset<T, TenantCreateArgs<ExtArgs>>): Prisma__TenantClient<$Result.GetResult<Prisma.$TenantPayload<ExtArgs>, T, "create">, never, ExtArgs>

    /**
     * Create many Tenants.
     * @param {TenantCreateManyArgs} args - Arguments to create many Tenants.
     * @example
     * // Create many Tenants
     * const tenant = await prisma.tenant.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends TenantCreateManyArgs>(args?: SelectSubset<T, TenantCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many Tenants and returns the data saved in the database.
     * @param {TenantCreateManyAndReturnArgs} args - Arguments to create many Tenants.
     * @example
     * // Create many Tenants
     * const tenant = await prisma.tenant.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many Tenants and only return the `id`
     * const tenantWithIdOnly = await prisma.tenant.createManyAndReturn({ 
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends TenantCreateManyAndReturnArgs>(args?: SelectSubset<T, TenantCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$TenantPayload<ExtArgs>, T, "createManyAndReturn">>

    /**
     * Delete a Tenant.
     * @param {TenantDeleteArgs} args - Arguments to delete one Tenant.
     * @example
     * // Delete one Tenant
     * const Tenant = await prisma.tenant.delete({
     *   where: {
     *     // ... filter to delete one Tenant
     *   }
     * })
     * 
     */
    delete<T extends TenantDeleteArgs>(args: SelectSubset<T, TenantDeleteArgs<ExtArgs>>): Prisma__TenantClient<$Result.GetResult<Prisma.$TenantPayload<ExtArgs>, T, "delete">, never, ExtArgs>

    /**
     * Update one Tenant.
     * @param {TenantUpdateArgs} args - Arguments to update one Tenant.
     * @example
     * // Update one Tenant
     * const tenant = await prisma.tenant.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends TenantUpdateArgs>(args: SelectSubset<T, TenantUpdateArgs<ExtArgs>>): Prisma__TenantClient<$Result.GetResult<Prisma.$TenantPayload<ExtArgs>, T, "update">, never, ExtArgs>

    /**
     * Delete zero or more Tenants.
     * @param {TenantDeleteManyArgs} args - Arguments to filter Tenants to delete.
     * @example
     * // Delete a few Tenants
     * const { count } = await prisma.tenant.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends TenantDeleteManyArgs>(args?: SelectSubset<T, TenantDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Tenants.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {TenantUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Tenants
     * const tenant = await prisma.tenant.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends TenantUpdateManyArgs>(args: SelectSubset<T, TenantUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create or update one Tenant.
     * @param {TenantUpsertArgs} args - Arguments to update or create a Tenant.
     * @example
     * // Update or create a Tenant
     * const tenant = await prisma.tenant.upsert({
     *   create: {
     *     // ... data to create a Tenant
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the Tenant we want to update
     *   }
     * })
     */
    upsert<T extends TenantUpsertArgs>(args: SelectSubset<T, TenantUpsertArgs<ExtArgs>>): Prisma__TenantClient<$Result.GetResult<Prisma.$TenantPayload<ExtArgs>, T, "upsert">, never, ExtArgs>


    /**
     * Count the number of Tenants.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {TenantCountArgs} args - Arguments to filter Tenants to count.
     * @example
     * // Count the number of Tenants
     * const count = await prisma.tenant.count({
     *   where: {
     *     // ... the filter for the Tenants we want to count
     *   }
     * })
    **/
    count<T extends TenantCountArgs>(
      args?: Subset<T, TenantCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], TenantCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a Tenant.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {TenantAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends TenantAggregateArgs>(args: Subset<T, TenantAggregateArgs>): Prisma.PrismaPromise<GetTenantAggregateType<T>>

    /**
     * Group by Tenant.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {TenantGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends TenantGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: TenantGroupByArgs['orderBy'] }
        : { orderBy?: TenantGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, TenantGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetTenantGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the Tenant model
   */
  readonly fields: TenantFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for Tenant.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__TenantClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    users<T extends Tenant$usersArgs<ExtArgs> = {}>(args?: Subset<T, Tenant$usersArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findMany"> | Null>
    bookPi<T extends Tenant$bookPiArgs<ExtArgs> = {}>(args?: Subset<T, Tenant$bookPiArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$BookPiLedgerPayload<ExtArgs>, T, "findMany"> | Null>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the Tenant model
   */ 
  interface TenantFieldRefs {
    readonly id: FieldRef<"Tenant", 'String'>
    readonly name: FieldRef<"Tenant", 'String'>
    readonly createdAt: FieldRef<"Tenant", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * Tenant findUnique
   */
  export type TenantFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Tenant
     */
    select?: TenantSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TenantInclude<ExtArgs> | null
    /**
     * Filter, which Tenant to fetch.
     */
    where: TenantWhereUniqueInput
  }

  /**
   * Tenant findUniqueOrThrow
   */
  export type TenantFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Tenant
     */
    select?: TenantSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TenantInclude<ExtArgs> | null
    /**
     * Filter, which Tenant to fetch.
     */
    where: TenantWhereUniqueInput
  }

  /**
   * Tenant findFirst
   */
  export type TenantFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Tenant
     */
    select?: TenantSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TenantInclude<ExtArgs> | null
    /**
     * Filter, which Tenant to fetch.
     */
    where?: TenantWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Tenants to fetch.
     */
    orderBy?: TenantOrderByWithRelationInput | TenantOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Tenants.
     */
    cursor?: TenantWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Tenants from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Tenants.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Tenants.
     */
    distinct?: TenantScalarFieldEnum | TenantScalarFieldEnum[]
  }

  /**
   * Tenant findFirstOrThrow
   */
  export type TenantFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Tenant
     */
    select?: TenantSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TenantInclude<ExtArgs> | null
    /**
     * Filter, which Tenant to fetch.
     */
    where?: TenantWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Tenants to fetch.
     */
    orderBy?: TenantOrderByWithRelationInput | TenantOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Tenants.
     */
    cursor?: TenantWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Tenants from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Tenants.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Tenants.
     */
    distinct?: TenantScalarFieldEnum | TenantScalarFieldEnum[]
  }

  /**
   * Tenant findMany
   */
  export type TenantFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Tenant
     */
    select?: TenantSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TenantInclude<ExtArgs> | null
    /**
     * Filter, which Tenants to fetch.
     */
    where?: TenantWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Tenants to fetch.
     */
    orderBy?: TenantOrderByWithRelationInput | TenantOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing Tenants.
     */
    cursor?: TenantWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Tenants from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Tenants.
     */
    skip?: number
    distinct?: TenantScalarFieldEnum | TenantScalarFieldEnum[]
  }

  /**
   * Tenant create
   */
  export type TenantCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Tenant
     */
    select?: TenantSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TenantInclude<ExtArgs> | null
    /**
     * The data needed to create a Tenant.
     */
    data: XOR<TenantCreateInput, TenantUncheckedCreateInput>
  }

  /**
   * Tenant createMany
   */
  export type TenantCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many Tenants.
     */
    data: TenantCreateManyInput | TenantCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * Tenant createManyAndReturn
   */
  export type TenantCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Tenant
     */
    select?: TenantSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * The data used to create many Tenants.
     */
    data: TenantCreateManyInput | TenantCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * Tenant update
   */
  export type TenantUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Tenant
     */
    select?: TenantSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TenantInclude<ExtArgs> | null
    /**
     * The data needed to update a Tenant.
     */
    data: XOR<TenantUpdateInput, TenantUncheckedUpdateInput>
    /**
     * Choose, which Tenant to update.
     */
    where: TenantWhereUniqueInput
  }

  /**
   * Tenant updateMany
   */
  export type TenantUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update Tenants.
     */
    data: XOR<TenantUpdateManyMutationInput, TenantUncheckedUpdateManyInput>
    /**
     * Filter which Tenants to update
     */
    where?: TenantWhereInput
  }

  /**
   * Tenant upsert
   */
  export type TenantUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Tenant
     */
    select?: TenantSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TenantInclude<ExtArgs> | null
    /**
     * The filter to search for the Tenant to update in case it exists.
     */
    where: TenantWhereUniqueInput
    /**
     * In case the Tenant found by the `where` argument doesn't exist, create a new Tenant with this data.
     */
    create: XOR<TenantCreateInput, TenantUncheckedCreateInput>
    /**
     * In case the Tenant was found with the provided `where` argument, update it with this data.
     */
    update: XOR<TenantUpdateInput, TenantUncheckedUpdateInput>
  }

  /**
   * Tenant delete
   */
  export type TenantDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Tenant
     */
    select?: TenantSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TenantInclude<ExtArgs> | null
    /**
     * Filter which Tenant to delete.
     */
    where: TenantWhereUniqueInput
  }

  /**
   * Tenant deleteMany
   */
  export type TenantDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Tenants to delete
     */
    where?: TenantWhereInput
  }

  /**
   * Tenant.users
   */
  export type Tenant$usersArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
    where?: UserWhereInput
    orderBy?: UserOrderByWithRelationInput | UserOrderByWithRelationInput[]
    cursor?: UserWhereUniqueInput
    take?: number
    skip?: number
    distinct?: UserScalarFieldEnum | UserScalarFieldEnum[]
  }

  /**
   * Tenant.bookPi
   */
  export type Tenant$bookPiArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the BookPiLedger
     */
    select?: BookPiLedgerSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: BookPiLedgerInclude<ExtArgs> | null
    where?: BookPiLedgerWhereInput
    orderBy?: BookPiLedgerOrderByWithRelationInput | BookPiLedgerOrderByWithRelationInput[]
    cursor?: BookPiLedgerWhereUniqueInput
    take?: number
    skip?: number
    distinct?: BookPiLedgerScalarFieldEnum | BookPiLedgerScalarFieldEnum[]
  }

  /**
   * Tenant without action
   */
  export type TenantDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Tenant
     */
    select?: TenantSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TenantInclude<ExtArgs> | null
  }


  /**
   * Model User
   */

  export type AggregateUser = {
    _count: UserCountAggregateOutputType | null
    _min: UserMinAggregateOutputType | null
    _max: UserMaxAggregateOutputType | null
  }

  export type UserMinAggregateOutputType = {
    id: string | null
    tenantId: string | null
    email: string | null
    name: string | null
    createdAt: Date | null
  }

  export type UserMaxAggregateOutputType = {
    id: string | null
    tenantId: string | null
    email: string | null
    name: string | null
    createdAt: Date | null
  }

  export type UserCountAggregateOutputType = {
    id: number
    tenantId: number
    email: number
    name: number
    createdAt: number
    _all: number
  }


  export type UserMinAggregateInputType = {
    id?: true
    tenantId?: true
    email?: true
    name?: true
    createdAt?: true
  }

  export type UserMaxAggregateInputType = {
    id?: true
    tenantId?: true
    email?: true
    name?: true
    createdAt?: true
  }

  export type UserCountAggregateInputType = {
    id?: true
    tenantId?: true
    email?: true
    name?: true
    createdAt?: true
    _all?: true
  }

  export type UserAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which User to aggregate.
     */
    where?: UserWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Users to fetch.
     */
    orderBy?: UserOrderByWithRelationInput | UserOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: UserWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Users from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Users.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned Users
    **/
    _count?: true | UserCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: UserMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: UserMaxAggregateInputType
  }

  export type GetUserAggregateType<T extends UserAggregateArgs> = {
        [P in keyof T & keyof AggregateUser]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateUser[P]>
      : GetScalarType<T[P], AggregateUser[P]>
  }




  export type UserGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: UserWhereInput
    orderBy?: UserOrderByWithAggregationInput | UserOrderByWithAggregationInput[]
    by: UserScalarFieldEnum[] | UserScalarFieldEnum
    having?: UserScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: UserCountAggregateInputType | true
    _min?: UserMinAggregateInputType
    _max?: UserMaxAggregateInputType
  }

  export type UserGroupByOutputType = {
    id: string
    tenantId: string
    email: string
    name: string | null
    createdAt: Date
    _count: UserCountAggregateOutputType | null
    _min: UserMinAggregateOutputType | null
    _max: UserMaxAggregateOutputType | null
  }

  type GetUserGroupByPayload<T extends UserGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<UserGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof UserGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], UserGroupByOutputType[P]>
            : GetScalarType<T[P], UserGroupByOutputType[P]>
        }
      >
    >


  export type UserSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    tenantId?: boolean
    email?: boolean
    name?: boolean
    createdAt?: boolean
    tenant?: boolean | TenantDefaultArgs<ExtArgs>
    monetization?: boolean | User$monetizationArgs<ExtArgs>
  }, ExtArgs["result"]["user"]>

  export type UserSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    tenantId?: boolean
    email?: boolean
    name?: boolean
    createdAt?: boolean
    tenant?: boolean | TenantDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["user"]>

  export type UserSelectScalar = {
    id?: boolean
    tenantId?: boolean
    email?: boolean
    name?: boolean
    createdAt?: boolean
  }

  export type UserInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    tenant?: boolean | TenantDefaultArgs<ExtArgs>
    monetization?: boolean | User$monetizationArgs<ExtArgs>
  }
  export type UserIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    tenant?: boolean | TenantDefaultArgs<ExtArgs>
  }

  export type $UserPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "User"
    objects: {
      tenant: Prisma.$TenantPayload<ExtArgs>
      monetization: Prisma.$MonetizationAccountPayload<ExtArgs> | null
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      tenantId: string
      email: string
      name: string | null
      createdAt: Date
    }, ExtArgs["result"]["user"]>
    composites: {}
  }

  type UserGetPayload<S extends boolean | null | undefined | UserDefaultArgs> = $Result.GetResult<Prisma.$UserPayload, S>

  type UserCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = 
    Omit<UserFindManyArgs, 'select' | 'include' | 'distinct'> & {
      select?: UserCountAggregateInputType | true
    }

  export interface UserDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['User'], meta: { name: 'User' } }
    /**
     * Find zero or one User that matches the filter.
     * @param {UserFindUniqueArgs} args - Arguments to find a User
     * @example
     * // Get one User
     * const user = await prisma.user.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends UserFindUniqueArgs>(args: SelectSubset<T, UserFindUniqueArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findUnique"> | null, null, ExtArgs>

    /**
     * Find one User that matches the filter or throw an error with `error.code='P2025'` 
     * if no matches were found.
     * @param {UserFindUniqueOrThrowArgs} args - Arguments to find a User
     * @example
     * // Get one User
     * const user = await prisma.user.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends UserFindUniqueOrThrowArgs>(args: SelectSubset<T, UserFindUniqueOrThrowArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findUniqueOrThrow">, never, ExtArgs>

    /**
     * Find the first User that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserFindFirstArgs} args - Arguments to find a User
     * @example
     * // Get one User
     * const user = await prisma.user.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends UserFindFirstArgs>(args?: SelectSubset<T, UserFindFirstArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findFirst"> | null, null, ExtArgs>

    /**
     * Find the first User that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserFindFirstOrThrowArgs} args - Arguments to find a User
     * @example
     * // Get one User
     * const user = await prisma.user.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends UserFindFirstOrThrowArgs>(args?: SelectSubset<T, UserFindFirstOrThrowArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findFirstOrThrow">, never, ExtArgs>

    /**
     * Find zero or more Users that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Users
     * const users = await prisma.user.findMany()
     * 
     * // Get first 10 Users
     * const users = await prisma.user.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const userWithIdOnly = await prisma.user.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends UserFindManyArgs>(args?: SelectSubset<T, UserFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findMany">>

    /**
     * Create a User.
     * @param {UserCreateArgs} args - Arguments to create a User.
     * @example
     * // Create one User
     * const User = await prisma.user.create({
     *   data: {
     *     // ... data to create a User
     *   }
     * })
     * 
     */
    create<T extends UserCreateArgs>(args: SelectSubset<T, UserCreateArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "create">, never, ExtArgs>

    /**
     * Create many Users.
     * @param {UserCreateManyArgs} args - Arguments to create many Users.
     * @example
     * // Create many Users
     * const user = await prisma.user.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends UserCreateManyArgs>(args?: SelectSubset<T, UserCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many Users and returns the data saved in the database.
     * @param {UserCreateManyAndReturnArgs} args - Arguments to create many Users.
     * @example
     * // Create many Users
     * const user = await prisma.user.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many Users and only return the `id`
     * const userWithIdOnly = await prisma.user.createManyAndReturn({ 
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends UserCreateManyAndReturnArgs>(args?: SelectSubset<T, UserCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "createManyAndReturn">>

    /**
     * Delete a User.
     * @param {UserDeleteArgs} args - Arguments to delete one User.
     * @example
     * // Delete one User
     * const User = await prisma.user.delete({
     *   where: {
     *     // ... filter to delete one User
     *   }
     * })
     * 
     */
    delete<T extends UserDeleteArgs>(args: SelectSubset<T, UserDeleteArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "delete">, never, ExtArgs>

    /**
     * Update one User.
     * @param {UserUpdateArgs} args - Arguments to update one User.
     * @example
     * // Update one User
     * const user = await prisma.user.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends UserUpdateArgs>(args: SelectSubset<T, UserUpdateArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "update">, never, ExtArgs>

    /**
     * Delete zero or more Users.
     * @param {UserDeleteManyArgs} args - Arguments to filter Users to delete.
     * @example
     * // Delete a few Users
     * const { count } = await prisma.user.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends UserDeleteManyArgs>(args?: SelectSubset<T, UserDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Users.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Users
     * const user = await prisma.user.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends UserUpdateManyArgs>(args: SelectSubset<T, UserUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create or update one User.
     * @param {UserUpsertArgs} args - Arguments to update or create a User.
     * @example
     * // Update or create a User
     * const user = await prisma.user.upsert({
     *   create: {
     *     // ... data to create a User
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the User we want to update
     *   }
     * })
     */
    upsert<T extends UserUpsertArgs>(args: SelectSubset<T, UserUpsertArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "upsert">, never, ExtArgs>


    /**
     * Count the number of Users.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserCountArgs} args - Arguments to filter Users to count.
     * @example
     * // Count the number of Users
     * const count = await prisma.user.count({
     *   where: {
     *     // ... the filter for the Users we want to count
     *   }
     * })
    **/
    count<T extends UserCountArgs>(
      args?: Subset<T, UserCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], UserCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a User.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends UserAggregateArgs>(args: Subset<T, UserAggregateArgs>): Prisma.PrismaPromise<GetUserAggregateType<T>>

    /**
     * Group by User.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends UserGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: UserGroupByArgs['orderBy'] }
        : { orderBy?: UserGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, UserGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetUserGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the User model
   */
  readonly fields: UserFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for User.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__UserClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    tenant<T extends TenantDefaultArgs<ExtArgs> = {}>(args?: Subset<T, TenantDefaultArgs<ExtArgs>>): Prisma__TenantClient<$Result.GetResult<Prisma.$TenantPayload<ExtArgs>, T, "findUniqueOrThrow"> | Null, Null, ExtArgs>
    monetization<T extends User$monetizationArgs<ExtArgs> = {}>(args?: Subset<T, User$monetizationArgs<ExtArgs>>): Prisma__MonetizationAccountClient<$Result.GetResult<Prisma.$MonetizationAccountPayload<ExtArgs>, T, "findUniqueOrThrow"> | null, null, ExtArgs>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the User model
   */ 
  interface UserFieldRefs {
    readonly id: FieldRef<"User", 'String'>
    readonly tenantId: FieldRef<"User", 'String'>
    readonly email: FieldRef<"User", 'String'>
    readonly name: FieldRef<"User", 'String'>
    readonly createdAt: FieldRef<"User", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * User findUnique
   */
  export type UserFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
    /**
     * Filter, which User to fetch.
     */
    where: UserWhereUniqueInput
  }

  /**
   * User findUniqueOrThrow
   */
  export type UserFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
    /**
     * Filter, which User to fetch.
     */
    where: UserWhereUniqueInput
  }

  /**
   * User findFirst
   */
  export type UserFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
    /**
     * Filter, which User to fetch.
     */
    where?: UserWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Users to fetch.
     */
    orderBy?: UserOrderByWithRelationInput | UserOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Users.
     */
    cursor?: UserWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Users from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Users.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Users.
     */
    distinct?: UserScalarFieldEnum | UserScalarFieldEnum[]
  }

  /**
   * User findFirstOrThrow
   */
  export type UserFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
    /**
     * Filter, which User to fetch.
     */
    where?: UserWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Users to fetch.
     */
    orderBy?: UserOrderByWithRelationInput | UserOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Users.
     */
    cursor?: UserWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Users from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Users.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Users.
     */
    distinct?: UserScalarFieldEnum | UserScalarFieldEnum[]
  }

  /**
   * User findMany
   */
  export type UserFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
    /**
     * Filter, which Users to fetch.
     */
    where?: UserWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Users to fetch.
     */
    orderBy?: UserOrderByWithRelationInput | UserOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing Users.
     */
    cursor?: UserWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Users from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Users.
     */
    skip?: number
    distinct?: UserScalarFieldEnum | UserScalarFieldEnum[]
  }

  /**
   * User create
   */
  export type UserCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
    /**
     * The data needed to create a User.
     */
    data: XOR<UserCreateInput, UserUncheckedCreateInput>
  }

  /**
   * User createMany
   */
  export type UserCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many Users.
     */
    data: UserCreateManyInput | UserCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * User createManyAndReturn
   */
  export type UserCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * The data used to create many Users.
     */
    data: UserCreateManyInput | UserCreateManyInput[]
    skipDuplicates?: boolean
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * User update
   */
  export type UserUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
    /**
     * The data needed to update a User.
     */
    data: XOR<UserUpdateInput, UserUncheckedUpdateInput>
    /**
     * Choose, which User to update.
     */
    where: UserWhereUniqueInput
  }

  /**
   * User updateMany
   */
  export type UserUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update Users.
     */
    data: XOR<UserUpdateManyMutationInput, UserUncheckedUpdateManyInput>
    /**
     * Filter which Users to update
     */
    where?: UserWhereInput
  }

  /**
   * User upsert
   */
  export type UserUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
    /**
     * The filter to search for the User to update in case it exists.
     */
    where: UserWhereUniqueInput
    /**
     * In case the User found by the `where` argument doesn't exist, create a new User with this data.
     */
    create: XOR<UserCreateInput, UserUncheckedCreateInput>
    /**
     * In case the User was found with the provided `where` argument, update it with this data.
     */
    update: XOR<UserUpdateInput, UserUncheckedUpdateInput>
  }

  /**
   * User delete
   */
  export type UserDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
    /**
     * Filter which User to delete.
     */
    where: UserWhereUniqueInput
  }

  /**
   * User deleteMany
   */
  export type UserDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Users to delete
     */
    where?: UserWhereInput
  }

  /**
   * User.monetization
   */
  export type User$monetizationArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the MonetizationAccount
     */
    select?: MonetizationAccountSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: MonetizationAccountInclude<ExtArgs> | null
    where?: MonetizationAccountWhereInput
  }

  /**
   * User without action
   */
  export type UserDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
  }


  /**
   * Model MonetizationAccount
   */

  export type AggregateMonetizationAccount = {
    _count: MonetizationAccountCountAggregateOutputType | null
    _avg: MonetizationAccountAvgAggregateOutputType | null
    _sum: MonetizationAccountSumAggregateOutputType | null
    _min: MonetizationAccountMinAggregateOutputType | null
    _max: MonetizationAccountMaxAggregateOutputType | null
  }

  export type MonetizationAccountAvgAggregateOutputType = {
    earnedBalanceCents: number | null
    qualifiedUses: number | null
    approvedContributions: number | null
  }

  export type MonetizationAccountSumAggregateOutputType = {
    earnedBalanceCents: number | null
    qualifiedUses: number | null
    approvedContributions: number | null
  }

  export type MonetizationAccountMinAggregateOutputType = {
    userId: string | null
    earnedBalanceCents: number | null
    qualifiedUses: number | null
    approvedContributions: number | null
    trainingCompleted: boolean | null
    identityVerified: boolean | null
    paymentAccountVerified: boolean | null
    profileComplete: boolean | null
    sanctioned: boolean | null
    underFraudReview: boolean | null
  }

  export type MonetizationAccountMaxAggregateOutputType = {
    userId: string | null
    earnedBalanceCents: number | null
    qualifiedUses: number | null
    approvedContributions: number | null
    trainingCompleted: boolean | null
    identityVerified: boolean | null
    paymentAccountVerified: boolean | null
    profileComplete: boolean | null
    sanctioned: boolean | null
    underFraudReview: boolean | null
  }

  export type MonetizationAccountCountAggregateOutputType = {
    userId: number
    earnedBalanceCents: number
    qualifiedUses: number
    approvedContributions: number
    trainingCompleted: number
    identityVerified: number
    paymentAccountVerified: number
    profileComplete: number
    sanctioned: number
    underFraudReview: number
    _all: number
  }


  export type MonetizationAccountAvgAggregateInputType = {
    earnedBalanceCents?: true
    qualifiedUses?: true
    approvedContributions?: true
  }

  export type MonetizationAccountSumAggregateInputType = {
    earnedBalanceCents?: true
    qualifiedUses?: true
    approvedContributions?: true
  }

  export type MonetizationAccountMinAggregateInputType = {
    userId?: true
    earnedBalanceCents?: true
    qualifiedUses?: true
    approvedContributions?: true
    trainingCompleted?: true
    identityVerified?: true
    paymentAccountVerified?: true
    profileComplete?: true
    sanctioned?: true
    underFraudReview?: true
  }

  export type MonetizationAccountMaxAggregateInputType = {
    userId?: true
    earnedBalanceCents?: true
    qualifiedUses?: true
    approvedContributions?: true
    trainingCompleted?: true
    identityVerified?: true
    paymentAccountVerified?: true
    profileComplete?: true
    sanctioned?: true
    underFraudReview?: true
  }

  export type MonetizationAccountCountAggregateInputType = {
    userId?: true
    earnedBalanceCents?: true
    qualifiedUses?: true
    approvedContributions?: true
    trainingCompleted?: true
    identityVerified?: true
    paymentAccountVerified?: true
    profileComplete?: true
    sanctioned?: true
    underFraudReview?: true
    _all?: true
  }

  export type MonetizationAccountAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which MonetizationAccount to aggregate.
     */
    where?: MonetizationAccountWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of MonetizationAccounts to fetch.
     */
    orderBy?: MonetizationAccountOrderByWithRelationInput | MonetizationAccountOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: MonetizationAccountWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` MonetizationAccounts from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` MonetizationAccounts.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned MonetizationAccounts
    **/
    _count?: true | MonetizationAccountCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: MonetizationAccountAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: MonetizationAccountSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: MonetizationAccountMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: MonetizationAccountMaxAggregateInputType
  }

  export type GetMonetizationAccountAggregateType<T extends MonetizationAccountAggregateArgs> = {
        [P in keyof T & keyof AggregateMonetizationAccount]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateMonetizationAccount[P]>
      : GetScalarType<T[P], AggregateMonetizationAccount[P]>
  }




  export type MonetizationAccountGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: MonetizationAccountWhereInput
    orderBy?: MonetizationAccountOrderByWithAggregationInput | MonetizationAccountOrderByWithAggregationInput[]
    by: MonetizationAccountScalarFieldEnum[] | MonetizationAccountScalarFieldEnum
    having?: MonetizationAccountScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: MonetizationAccountCountAggregateInputType | true
    _avg?: MonetizationAccountAvgAggregateInputType
    _sum?: MonetizationAccountSumAggregateInputType
    _min?: MonetizationAccountMinAggregateInputType
    _max?: MonetizationAccountMaxAggregateInputType
  }

  export type MonetizationAccountGroupByOutputType = {
    userId: string
    earnedBalanceCents: number
    qualifiedUses: number
    approvedContributions: number
    trainingCompleted: boolean
    identityVerified: boolean
    paymentAccountVerified: boolean
    profileComplete: boolean
    sanctioned: boolean
    underFraudReview: boolean
    _count: MonetizationAccountCountAggregateOutputType | null
    _avg: MonetizationAccountAvgAggregateOutputType | null
    _sum: MonetizationAccountSumAggregateOutputType | null
    _min: MonetizationAccountMinAggregateOutputType | null
    _max: MonetizationAccountMaxAggregateOutputType | null
  }

  type GetMonetizationAccountGroupByPayload<T extends MonetizationAccountGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<MonetizationAccountGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof MonetizationAccountGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], MonetizationAccountGroupByOutputType[P]>
            : GetScalarType<T[P], MonetizationAccountGroupByOutputType[P]>
        }
      >
    >


  export type MonetizationAccountSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    userId?: boolean
    earnedBalanceCents?: boolean
    qualifiedUses?: boolean
    approvedContributions?: boolean
    trainingCompleted?: boolean
    identityVerified?: boolean
    paymentAccountVerified?: boolean
    profileComplete?: boolean
    sanctioned?: boolean
    underFraudReview?: boolean
    user?: boolean | UserDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["monetizationAccount"]>

  export type MonetizationAccountSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    userId?: boolean
    earnedBalanceCents?: boolean
    qualifiedUses?: boolean
    approvedContributions?: boolean
    trainingCompleted?: boolean
    identityVerified?: boolean
    paymentAccountVerified?: boolean
    profileComplete?: boolean
    sanctioned?: boolean
    underFraudReview?: boolean
    user?: boolean | UserDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["monetizationAccount"]>

  export type MonetizationAccountSelectScalar = {
    userId?: boolean
    earnedBalanceCents?: boolean
    qualifiedUses?: boolean
    approvedContributions?: boolean
    trainingCompleted?: boolean
    identityVerified?: boolean
    paymentAccountVerified?: boolean
    profileComplete?: boolean
    sanctioned?: boolean
    underFraudReview?: boolean
  }

  export type MonetizationAccountInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    user?: boolean | UserDefaultArgs<ExtArgs>
  }
  export type MonetizationAccountIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    user?: boolean | UserDefaultArgs<ExtArgs>
  }

  export type $MonetizationAccountPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "MonetizationAccount"
    objects: {
      user: Prisma.$UserPayload<ExtArgs>
    }
    scalars: $Extensions.GetPayloadResult<{
      userId: string
      earnedBalanceCents: number
      qualifiedUses: number
      approvedContributions: number
      trainingCompleted: boolean
      identityVerified: boolean
      paymentAccountVerified: boolean
      profileComplete: boolean
      sanctioned: boolean
      underFraudReview: boolean
    }, ExtArgs["result"]["monetizationAccount"]>
    composites: {}
  }

  type MonetizationAccountGetPayload<S extends boolean | null | undefined | MonetizationAccountDefaultArgs> = $Result.GetResult<Prisma.$MonetizationAccountPayload, S>

  type MonetizationAccountCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = 
    Omit<MonetizationAccountFindManyArgs, 'select' | 'include' | 'distinct'> & {
      select?: MonetizationAccountCountAggregateInputType | true
    }

  export interface MonetizationAccountDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['MonetizationAccount'], meta: { name: 'MonetizationAccount' } }
    /**
     * Find zero or one MonetizationAccount that matches the filter.
     * @param {MonetizationAccountFindUniqueArgs} args - Arguments to find a MonetizationAccount
     * @example
     * // Get one MonetizationAccount
     * const monetizationAccount = await prisma.monetizationAccount.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends MonetizationAccountFindUniqueArgs>(args: SelectSubset<T, MonetizationAccountFindUniqueArgs<ExtArgs>>): Prisma__MonetizationAccountClient<$Result.GetResult<Prisma.$MonetizationAccountPayload<ExtArgs>, T, "findUnique"> | null, null, ExtArgs>

    /**
     * Find one MonetizationAccount that matches the filter or throw an error with `error.code='P2025'` 
     * if no matches were found.
     * @param {MonetizationAccountFindUniqueOrThrowArgs} args - Arguments to find a MonetizationAccount
     * @example
     * // Get one MonetizationAccount
     * const monetizationAccount = await prisma.monetizationAccount.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends MonetizationAccountFindUniqueOrThrowArgs>(args: SelectSubset<T, MonetizationAccountFindUniqueOrThrowArgs<ExtArgs>>): Prisma__MonetizationAccountClient<$Result.GetResult<Prisma.$MonetizationAccountPayload<ExtArgs>, T, "findUniqueOrThrow">, never, ExtArgs>

    /**
     * Find the first MonetizationAccount that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {MonetizationAccountFindFirstArgs} args - Arguments to find a MonetizationAccount
     * @example
     * // Get one MonetizationAccount
     * const monetizationAccount = await prisma.monetizationAccount.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends MonetizationAccountFindFirstArgs>(args?: SelectSubset<T, MonetizationAccountFindFirstArgs<ExtArgs>>): Prisma__MonetizationAccountClient<$Result.GetResult<Prisma.$MonetizationAccountPayload<ExtArgs>, T, "findFirst"> | null, null, ExtArgs>

    /**
     * Find the first MonetizationAccount that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {MonetizationAccountFindFirstOrThrowArgs} args - Arguments to find a MonetizationAccount
     * @example
     * // Get one MonetizationAccount
     * const monetizationAccount = await prisma.monetizationAccount.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends MonetizationAccountFindFirstOrThrowArgs>(args?: SelectSubset<T, MonetizationAccountFindFirstOrThrowArgs<ExtArgs>>): Prisma__MonetizationAccountClient<$Result.GetResult<Prisma.$MonetizationAccountPayload<ExtArgs>, T, "findFirstOrThrow">, never, ExtArgs>

    /**
     * Find zero or more MonetizationAccounts that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {MonetizationAccountFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all MonetizationAccounts
     * const monetizationAccounts = await prisma.monetizationAccount.findMany()
     * 
     * // Get first 10 MonetizationAccounts
     * const monetizationAccounts = await prisma.monetizationAccount.findMany({ take: 10 })
     * 
     * // Only select the `userId`
     * const monetizationAccountWithUserIdOnly = await prisma.monetizationAccount.findMany({ select: { userId: true } })
     * 
     */
    findMany<T extends MonetizationAccountFindManyArgs>(args?: SelectSubset<T, MonetizationAccountFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$MonetizationAccountPayload<ExtArgs>, T, "findMany">>

    /**
     * Create a MonetizationAccount.
     * @param {MonetizationAccountCreateArgs} args - Arguments to create a MonetizationAccount.
     * @example
     * // Create one MonetizationAccount
     * const MonetizationAccount = await prisma.monetizationAccount.create({
     *   data: {
     *     // ... data to create a MonetizationAccount
     *   }
     * })
     * 
     */
    create<T extends MonetizationAccountCreateArgs>(args: SelectSubset<T, MonetizationAccountCreateArgs<ExtArgs>>): Prisma__MonetizationAccountClient<$Result.GetResult<Prisma.$MonetizationAccountPayload<ExtArgs>, T, "create">, never, ExtArgs>

    /**
     * Create many MonetizationAccounts.
     * @param {MonetizationAccountCreateManyArgs} args - Arguments to create many MonetizationAccounts.
     * @example
     * // Create many MonetizationAccounts
     * const monetizationAccount = await prisma.monetizationAccount.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends MonetizationAccountCreateManyArgs>(args?: SelectSubset<T, MonetizationAccountCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many MonetizationAccounts and returns the data saved in the database.
     * @param {MonetizationAccountCreateManyAndReturnArgs} args - Arguments to create many MonetizationAccounts.
     * @example
     * // Create many MonetizationAccounts
     * const monetizationAccount = await prisma.monetizationAccount.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many MonetizationAccounts and only return the `userId`
     * const monetizationAccountWithUserIdOnly = await prisma.monetizationAccount.createManyAndReturn({ 
     *   select: { userId: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends MonetizationAccountCreateManyAndReturnArgs>(args?: SelectSubset<T, MonetizationAccountCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$MonetizationAccountPayload<ExtArgs>, T, "createManyAndReturn">>

    /**
     * Delete a MonetizationAccount.
     * @param {MonetizationAccountDeleteArgs} args - Arguments to delete one MonetizationAccount.
     * @example
     * // Delete one MonetizationAccount
     * const MonetizationAccount = await prisma.monetizationAccount.delete({
     *   where: {
     *     // ... filter to delete one MonetizationAccount
     *   }
     * })
     * 
     */
    delete<T extends MonetizationAccountDeleteArgs>(args: SelectSubset<T, MonetizationAccountDeleteArgs<ExtArgs>>): Prisma__MonetizationAccountClient<$Result.GetResult<Prisma.$MonetizationAccountPayload<ExtArgs>, T, "delete">, never, ExtArgs>

    /**
     * Update one MonetizationAccount.
     * @param {MonetizationAccountUpdateArgs} args - Arguments to update one MonetizationAccount.
     * @example
     * // Update one MonetizationAccount
     * const monetizationAccount = await prisma.monetizationAccount.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends MonetizationAccountUpdateArgs>(args: SelectSubset<T, MonetizationAccountUpdateArgs<ExtArgs>>): Prisma__MonetizationAccountClient<$Result.GetResult<Prisma.$MonetizationAccountPayload<ExtArgs>, T, "update">, never, ExtArgs>

    /**
     * Delete zero or more MonetizationAccounts.
     * @param {MonetizationAccountDeleteManyArgs} args - Arguments to filter MonetizationAccounts to delete.
     * @example
     * // Delete a few MonetizationAccounts
     * const { count } = await prisma.monetizationAccount.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends MonetizationAccountDeleteManyArgs>(args?: SelectSubset<T, MonetizationAccountDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more MonetizationAccounts.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {MonetizationAccountUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many MonetizationAccounts
     * const monetizationAccount = await prisma.monetizationAccount.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends MonetizationAccountUpdateManyArgs>(args: SelectSubset<T, MonetizationAccountUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create or update one MonetizationAccount.
     * @param {MonetizationAccountUpsertArgs} args - Arguments to update or create a MonetizationAccount.
     * @example
     * // Update or create a MonetizationAccount
     * const monetizationAccount = await prisma.monetizationAccount.upsert({
     *   create: {
     *     // ... data to create a MonetizationAccount
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the MonetizationAccount we want to update
     *   }
     * })
     */
    upsert<T extends MonetizationAccountUpsertArgs>(args: SelectSubset<T, MonetizationAccountUpsertArgs<ExtArgs>>): Prisma__MonetizationAccountClient<$Result.GetResult<Prisma.$MonetizationAccountPayload<ExtArgs>, T, "upsert">, never, ExtArgs>


    /**
     * Count the number of MonetizationAccounts.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {MonetizationAccountCountArgs} args - Arguments to filter MonetizationAccounts to count.
     * @example
     * // Count the number of MonetizationAccounts
     * const count = await prisma.monetizationAccount.count({
     *   where: {
     *     // ... the filter for the MonetizationAccounts we want to count
     *   }
     * })
    **/
    count<T extends MonetizationAccountCountArgs>(
      args?: Subset<T, MonetizationAccountCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], MonetizationAccountCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a MonetizationAccount.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {MonetizationAccountAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends MonetizationAccountAggregateArgs>(args: Subset<T, MonetizationAccountAggregateArgs>): Prisma.PrismaPromise<GetMonetizationAccountAggregateType<T>>

    /**
     * Group by MonetizationAccount.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {MonetizationAccountGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends MonetizationAccountGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: MonetizationAccountGroupByArgs['orderBy'] }
        : { orderBy?: MonetizationAccountGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, MonetizationAccountGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetMonetizationAccountGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the MonetizationAccount model
   */
  readonly fields: MonetizationAccountFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for MonetizationAccount.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__MonetizationAccountClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    user<T extends UserDefaultArgs<ExtArgs> = {}>(args?: Subset<T, UserDefaultArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findUniqueOrThrow"> | Null, Null, ExtArgs>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the MonetizationAccount model
   */ 
  interface MonetizationAccountFieldRefs {
    readonly userId: FieldRef<"MonetizationAccount", 'String'>
    readonly earnedBalanceCents: FieldRef<"MonetizationAccount", 'Int'>
    readonly qualifiedUses: FieldRef<"MonetizationAccount", 'Int'>
    readonly approvedContributions: FieldRef<"MonetizationAccount", 'Int'>
    readonly trainingCompleted: FieldRef<"MonetizationAccount", 'Boolean'>
    readonly identityVerified: FieldRef<"MonetizationAccount", 'Boolean'>
    readonly paymentAccountVerified: FieldRef<"MonetizationAccount", 'Boolean'>
    readonly profileComplete: FieldRef<"MonetizationAccount", 'Boolean'>
    readonly sanctioned: FieldRef<"MonetizationAccount", 'Boolean'>
    readonly underFraudReview: FieldRef<"MonetizationAccount", 'Boolean'>
  }
    

  // Custom InputTypes
  /**
   * MonetizationAccount findUnique
   */
  export type MonetizationAccountFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the MonetizationAccount
     */
    select?: MonetizationAccountSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: MonetizationAccountInclude<ExtArgs> | null
    /**
     * Filter, which MonetizationAccount to fetch.
     */
    where: MonetizationAccountWhereUniqueInput
  }

  /**
   * MonetizationAccount findUniqueOrThrow
   */
  export type MonetizationAccountFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the MonetizationAccount
     */
    select?: MonetizationAccountSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: MonetizationAccountInclude<ExtArgs> | null
    /**
     * Filter, which MonetizationAccount to fetch.
     */
    where: MonetizationAccountWhereUniqueInput
  }

  /**
   * MonetizationAccount findFirst
   */
  export type MonetizationAccountFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the MonetizationAccount
     */
    select?: MonetizationAccountSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: MonetizationAccountInclude<ExtArgs> | null
    /**
     * Filter, which MonetizationAccount to fetch.
     */
    where?: MonetizationAccountWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of MonetizationAccounts to fetch.
     */
    orderBy?: MonetizationAccountOrderByWithRelationInput | MonetizationAccountOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for MonetizationAccounts.
     */
    cursor?: MonetizationAccountWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` MonetizationAccounts from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` MonetizationAccounts.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of MonetizationAccounts.
     */
    distinct?: MonetizationAccountScalarFieldEnum | MonetizationAccountScalarFieldEnum[]
  }

  /**
   * MonetizationAccount findFirstOrThrow
   */
  export type MonetizationAccountFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the MonetizationAccount
     */
    select?: MonetizationAccountSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: MonetizationAccountInclude<ExtArgs> | null
    /**
     * Filter, which MonetizationAccount to fetch.
     */
    where?: MonetizationAccountWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of MonetizationAccounts to fetch.
     */
    orderBy?: MonetizationAccountOrderByWithRelationInput | MonetizationAccountOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for MonetizationAccounts.
     */
    cursor?: MonetizationAccountWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` MonetizationAccounts from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` MonetizationAccounts.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of MonetizationAccounts.
     */
    distinct?: MonetizationAccountScalarFieldEnum | MonetizationAccountScalarFieldEnum[]
  }

  /**
   * MonetizationAccount findMany
   */
  export type MonetizationAccountFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the MonetizationAccount
     */
    select?: MonetizationAccountSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: MonetizationAccountInclude<ExtArgs> | null
    /**
     * Filter, which MonetizationAccounts to fetch.
     */
    where?: MonetizationAccountWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of MonetizationAccounts to fetch.
     */
    orderBy?: MonetizationAccountOrderByWithRelationInput | MonetizationAccountOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing MonetizationAccounts.
     */
    cursor?: MonetizationAccountWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` MonetizationAccounts from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` MonetizationAccounts.
     */
    skip?: number
    distinct?: MonetizationAccountScalarFieldEnum | MonetizationAccountScalarFieldEnum[]
  }

  /**
   * MonetizationAccount create
   */
  export type MonetizationAccountCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the MonetizationAccount
     */
    select?: MonetizationAccountSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: MonetizationAccountInclude<ExtArgs> | null
    /**
     * The data needed to create a MonetizationAccount.
     */
    data: XOR<MonetizationAccountCreateInput, MonetizationAccountUncheckedCreateInput>
  }

  /**
   * MonetizationAccount createMany
   */
  export type MonetizationAccountCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many MonetizationAccounts.
     */
    data: MonetizationAccountCreateManyInput | MonetizationAccountCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * MonetizationAccount createManyAndReturn
   */
  export type MonetizationAccountCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the MonetizationAccount
     */
    select?: MonetizationAccountSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * The data used to create many MonetizationAccounts.
     */
    data: MonetizationAccountCreateManyInput | MonetizationAccountCreateManyInput[]
    skipDuplicates?: boolean
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: MonetizationAccountIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * MonetizationAccount update
   */
  export type MonetizationAccountUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the MonetizationAccount
     */
    select?: MonetizationAccountSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: MonetizationAccountInclude<ExtArgs> | null
    /**
     * The data needed to update a MonetizationAccount.
     */
    data: XOR<MonetizationAccountUpdateInput, MonetizationAccountUncheckedUpdateInput>
    /**
     * Choose, which MonetizationAccount to update.
     */
    where: MonetizationAccountWhereUniqueInput
  }

  /**
   * MonetizationAccount updateMany
   */
  export type MonetizationAccountUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update MonetizationAccounts.
     */
    data: XOR<MonetizationAccountUpdateManyMutationInput, MonetizationAccountUncheckedUpdateManyInput>
    /**
     * Filter which MonetizationAccounts to update
     */
    where?: MonetizationAccountWhereInput
  }

  /**
   * MonetizationAccount upsert
   */
  export type MonetizationAccountUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the MonetizationAccount
     */
    select?: MonetizationAccountSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: MonetizationAccountInclude<ExtArgs> | null
    /**
     * The filter to search for the MonetizationAccount to update in case it exists.
     */
    where: MonetizationAccountWhereUniqueInput
    /**
     * In case the MonetizationAccount found by the `where` argument doesn't exist, create a new MonetizationAccount with this data.
     */
    create: XOR<MonetizationAccountCreateInput, MonetizationAccountUncheckedCreateInput>
    /**
     * In case the MonetizationAccount was found with the provided `where` argument, update it with this data.
     */
    update: XOR<MonetizationAccountUpdateInput, MonetizationAccountUncheckedUpdateInput>
  }

  /**
   * MonetizationAccount delete
   */
  export type MonetizationAccountDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the MonetizationAccount
     */
    select?: MonetizationAccountSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: MonetizationAccountInclude<ExtArgs> | null
    /**
     * Filter which MonetizationAccount to delete.
     */
    where: MonetizationAccountWhereUniqueInput
  }

  /**
   * MonetizationAccount deleteMany
   */
  export type MonetizationAccountDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which MonetizationAccounts to delete
     */
    where?: MonetizationAccountWhereInput
  }

  /**
   * MonetizationAccount without action
   */
  export type MonetizationAccountDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the MonetizationAccount
     */
    select?: MonetizationAccountSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: MonetizationAccountInclude<ExtArgs> | null
  }


  /**
   * Model BookPiLedger
   */

  export type AggregateBookPiLedger = {
    _count: BookPiLedgerCountAggregateOutputType | null
    _avg: BookPiLedgerAvgAggregateOutputType | null
    _sum: BookPiLedgerSumAggregateOutputType | null
    _min: BookPiLedgerMinAggregateOutputType | null
    _max: BookPiLedgerMaxAggregateOutputType | null
  }

  export type BookPiLedgerAvgAggregateOutputType = {
    index: number | null
    amount: number | null
  }

  export type BookPiLedgerSumAggregateOutputType = {
    index: number | null
    amount: number | null
  }

  export type BookPiLedgerMinAggregateOutputType = {
    id: string | null
    tenantId: string | null
    index: number | null
    eventType: string | null
    amount: number | null
    idempotencyKey: string | null
    hash: string | null
    previousHash: string | null
    createdAt: Date | null
  }

  export type BookPiLedgerMaxAggregateOutputType = {
    id: string | null
    tenantId: string | null
    index: number | null
    eventType: string | null
    amount: number | null
    idempotencyKey: string | null
    hash: string | null
    previousHash: string | null
    createdAt: Date | null
  }

  export type BookPiLedgerCountAggregateOutputType = {
    id: number
    tenantId: number
    index: number
    eventType: number
    amount: number
    idempotencyKey: number
    hash: number
    previousHash: number
    createdAt: number
    _all: number
  }


  export type BookPiLedgerAvgAggregateInputType = {
    index?: true
    amount?: true
  }

  export type BookPiLedgerSumAggregateInputType = {
    index?: true
    amount?: true
  }

  export type BookPiLedgerMinAggregateInputType = {
    id?: true
    tenantId?: true
    index?: true
    eventType?: true
    amount?: true
    idempotencyKey?: true
    hash?: true
    previousHash?: true
    createdAt?: true
  }

  export type BookPiLedgerMaxAggregateInputType = {
    id?: true
    tenantId?: true
    index?: true
    eventType?: true
    amount?: true
    idempotencyKey?: true
    hash?: true
    previousHash?: true
    createdAt?: true
  }

  export type BookPiLedgerCountAggregateInputType = {
    id?: true
    tenantId?: true
    index?: true
    eventType?: true
    amount?: true
    idempotencyKey?: true
    hash?: true
    previousHash?: true
    createdAt?: true
    _all?: true
  }

  export type BookPiLedgerAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which BookPiLedger to aggregate.
     */
    where?: BookPiLedgerWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of BookPiLedgers to fetch.
     */
    orderBy?: BookPiLedgerOrderByWithRelationInput | BookPiLedgerOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: BookPiLedgerWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` BookPiLedgers from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` BookPiLedgers.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned BookPiLedgers
    **/
    _count?: true | BookPiLedgerCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: BookPiLedgerAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: BookPiLedgerSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: BookPiLedgerMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: BookPiLedgerMaxAggregateInputType
  }

  export type GetBookPiLedgerAggregateType<T extends BookPiLedgerAggregateArgs> = {
        [P in keyof T & keyof AggregateBookPiLedger]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateBookPiLedger[P]>
      : GetScalarType<T[P], AggregateBookPiLedger[P]>
  }




  export type BookPiLedgerGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: BookPiLedgerWhereInput
    orderBy?: BookPiLedgerOrderByWithAggregationInput | BookPiLedgerOrderByWithAggregationInput[]
    by: BookPiLedgerScalarFieldEnum[] | BookPiLedgerScalarFieldEnum
    having?: BookPiLedgerScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: BookPiLedgerCountAggregateInputType | true
    _avg?: BookPiLedgerAvgAggregateInputType
    _sum?: BookPiLedgerSumAggregateInputType
    _min?: BookPiLedgerMinAggregateInputType
    _max?: BookPiLedgerMaxAggregateInputType
  }

  export type BookPiLedgerGroupByOutputType = {
    id: string
    tenantId: string
    index: number
    eventType: string
    amount: number
    idempotencyKey: string
    hash: string
    previousHash: string
    createdAt: Date
    _count: BookPiLedgerCountAggregateOutputType | null
    _avg: BookPiLedgerAvgAggregateOutputType | null
    _sum: BookPiLedgerSumAggregateOutputType | null
    _min: BookPiLedgerMinAggregateOutputType | null
    _max: BookPiLedgerMaxAggregateOutputType | null
  }

  type GetBookPiLedgerGroupByPayload<T extends BookPiLedgerGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<BookPiLedgerGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof BookPiLedgerGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], BookPiLedgerGroupByOutputType[P]>
            : GetScalarType<T[P], BookPiLedgerGroupByOutputType[P]>
        }
      >
    >


  export type BookPiLedgerSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    tenantId?: boolean
    index?: boolean
    eventType?: boolean
    amount?: boolean
    idempotencyKey?: boolean
    hash?: boolean
    previousHash?: boolean
    createdAt?: boolean
    tenant?: boolean | TenantDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["bookPiLedger"]>

  export type BookPiLedgerSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    tenantId?: boolean
    index?: boolean
    eventType?: boolean
    amount?: boolean
    idempotencyKey?: boolean
    hash?: boolean
    previousHash?: boolean
    createdAt?: boolean
    tenant?: boolean | TenantDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["bookPiLedger"]>

  export type BookPiLedgerSelectScalar = {
    id?: boolean
    tenantId?: boolean
    index?: boolean
    eventType?: boolean
    amount?: boolean
    idempotencyKey?: boolean
    hash?: boolean
    previousHash?: boolean
    createdAt?: boolean
  }

  export type BookPiLedgerInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    tenant?: boolean | TenantDefaultArgs<ExtArgs>
  }
  export type BookPiLedgerIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    tenant?: boolean | TenantDefaultArgs<ExtArgs>
  }

  export type $BookPiLedgerPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "BookPiLedger"
    objects: {
      tenant: Prisma.$TenantPayload<ExtArgs>
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      tenantId: string
      index: number
      eventType: string
      amount: number
      idempotencyKey: string
      hash: string
      previousHash: string
      createdAt: Date
    }, ExtArgs["result"]["bookPiLedger"]>
    composites: {}
  }

  type BookPiLedgerGetPayload<S extends boolean | null | undefined | BookPiLedgerDefaultArgs> = $Result.GetResult<Prisma.$BookPiLedgerPayload, S>

  type BookPiLedgerCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = 
    Omit<BookPiLedgerFindManyArgs, 'select' | 'include' | 'distinct'> & {
      select?: BookPiLedgerCountAggregateInputType | true
    }

  export interface BookPiLedgerDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['BookPiLedger'], meta: { name: 'BookPiLedger' } }
    /**
     * Find zero or one BookPiLedger that matches the filter.
     * @param {BookPiLedgerFindUniqueArgs} args - Arguments to find a BookPiLedger
     * @example
     * // Get one BookPiLedger
     * const bookPiLedger = await prisma.bookPiLedger.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends BookPiLedgerFindUniqueArgs>(args: SelectSubset<T, BookPiLedgerFindUniqueArgs<ExtArgs>>): Prisma__BookPiLedgerClient<$Result.GetResult<Prisma.$BookPiLedgerPayload<ExtArgs>, T, "findUnique"> | null, null, ExtArgs>

    /**
     * Find one BookPiLedger that matches the filter or throw an error with `error.code='P2025'` 
     * if no matches were found.
     * @param {BookPiLedgerFindUniqueOrThrowArgs} args - Arguments to find a BookPiLedger
     * @example
     * // Get one BookPiLedger
     * const bookPiLedger = await prisma.bookPiLedger.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends BookPiLedgerFindUniqueOrThrowArgs>(args: SelectSubset<T, BookPiLedgerFindUniqueOrThrowArgs<ExtArgs>>): Prisma__BookPiLedgerClient<$Result.GetResult<Prisma.$BookPiLedgerPayload<ExtArgs>, T, "findUniqueOrThrow">, never, ExtArgs>

    /**
     * Find the first BookPiLedger that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {BookPiLedgerFindFirstArgs} args - Arguments to find a BookPiLedger
     * @example
     * // Get one BookPiLedger
     * const bookPiLedger = await prisma.bookPiLedger.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends BookPiLedgerFindFirstArgs>(args?: SelectSubset<T, BookPiLedgerFindFirstArgs<ExtArgs>>): Prisma__BookPiLedgerClient<$Result.GetResult<Prisma.$BookPiLedgerPayload<ExtArgs>, T, "findFirst"> | null, null, ExtArgs>

    /**
     * Find the first BookPiLedger that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {BookPiLedgerFindFirstOrThrowArgs} args - Arguments to find a BookPiLedger
     * @example
     * // Get one BookPiLedger
     * const bookPiLedger = await prisma.bookPiLedger.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends BookPiLedgerFindFirstOrThrowArgs>(args?: SelectSubset<T, BookPiLedgerFindFirstOrThrowArgs<ExtArgs>>): Prisma__BookPiLedgerClient<$Result.GetResult<Prisma.$BookPiLedgerPayload<ExtArgs>, T, "findFirstOrThrow">, never, ExtArgs>

    /**
     * Find zero or more BookPiLedgers that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {BookPiLedgerFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all BookPiLedgers
     * const bookPiLedgers = await prisma.bookPiLedger.findMany()
     * 
     * // Get first 10 BookPiLedgers
     * const bookPiLedgers = await prisma.bookPiLedger.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const bookPiLedgerWithIdOnly = await prisma.bookPiLedger.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends BookPiLedgerFindManyArgs>(args?: SelectSubset<T, BookPiLedgerFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$BookPiLedgerPayload<ExtArgs>, T, "findMany">>

    /**
     * Create a BookPiLedger.
     * @param {BookPiLedgerCreateArgs} args - Arguments to create a BookPiLedger.
     * @example
     * // Create one BookPiLedger
     * const BookPiLedger = await prisma.bookPiLedger.create({
     *   data: {
     *     // ... data to create a BookPiLedger
     *   }
     * })
     * 
     */
    create<T extends BookPiLedgerCreateArgs>(args: SelectSubset<T, BookPiLedgerCreateArgs<ExtArgs>>): Prisma__BookPiLedgerClient<$Result.GetResult<Prisma.$BookPiLedgerPayload<ExtArgs>, T, "create">, never, ExtArgs>

    /**
     * Create many BookPiLedgers.
     * @param {BookPiLedgerCreateManyArgs} args - Arguments to create many BookPiLedgers.
     * @example
     * // Create many BookPiLedgers
     * const bookPiLedger = await prisma.bookPiLedger.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends BookPiLedgerCreateManyArgs>(args?: SelectSubset<T, BookPiLedgerCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many BookPiLedgers and returns the data saved in the database.
     * @param {BookPiLedgerCreateManyAndReturnArgs} args - Arguments to create many BookPiLedgers.
     * @example
     * // Create many BookPiLedgers
     * const bookPiLedger = await prisma.bookPiLedger.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many BookPiLedgers and only return the `id`
     * const bookPiLedgerWithIdOnly = await prisma.bookPiLedger.createManyAndReturn({ 
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends BookPiLedgerCreateManyAndReturnArgs>(args?: SelectSubset<T, BookPiLedgerCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$BookPiLedgerPayload<ExtArgs>, T, "createManyAndReturn">>

    /**
     * Delete a BookPiLedger.
     * @param {BookPiLedgerDeleteArgs} args - Arguments to delete one BookPiLedger.
     * @example
     * // Delete one BookPiLedger
     * const BookPiLedger = await prisma.bookPiLedger.delete({
     *   where: {
     *     // ... filter to delete one BookPiLedger
     *   }
     * })
     * 
     */
    delete<T extends BookPiLedgerDeleteArgs>(args: SelectSubset<T, BookPiLedgerDeleteArgs<ExtArgs>>): Prisma__BookPiLedgerClient<$Result.GetResult<Prisma.$BookPiLedgerPayload<ExtArgs>, T, "delete">, never, ExtArgs>

    /**
     * Update one BookPiLedger.
     * @param {BookPiLedgerUpdateArgs} args - Arguments to update one BookPiLedger.
     * @example
     * // Update one BookPiLedger
     * const bookPiLedger = await prisma.bookPiLedger.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends BookPiLedgerUpdateArgs>(args: SelectSubset<T, BookPiLedgerUpdateArgs<ExtArgs>>): Prisma__BookPiLedgerClient<$Result.GetResult<Prisma.$BookPiLedgerPayload<ExtArgs>, T, "update">, never, ExtArgs>

    /**
     * Delete zero or more BookPiLedgers.
     * @param {BookPiLedgerDeleteManyArgs} args - Arguments to filter BookPiLedgers to delete.
     * @example
     * // Delete a few BookPiLedgers
     * const { count } = await prisma.bookPiLedger.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends BookPiLedgerDeleteManyArgs>(args?: SelectSubset<T, BookPiLedgerDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more BookPiLedgers.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {BookPiLedgerUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many BookPiLedgers
     * const bookPiLedger = await prisma.bookPiLedger.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends BookPiLedgerUpdateManyArgs>(args: SelectSubset<T, BookPiLedgerUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create or update one BookPiLedger.
     * @param {BookPiLedgerUpsertArgs} args - Arguments to update or create a BookPiLedger.
     * @example
     * // Update or create a BookPiLedger
     * const bookPiLedger = await prisma.bookPiLedger.upsert({
     *   create: {
     *     // ... data to create a BookPiLedger
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the BookPiLedger we want to update
     *   }
     * })
     */
    upsert<T extends BookPiLedgerUpsertArgs>(args: SelectSubset<T, BookPiLedgerUpsertArgs<ExtArgs>>): Prisma__BookPiLedgerClient<$Result.GetResult<Prisma.$BookPiLedgerPayload<ExtArgs>, T, "upsert">, never, ExtArgs>


    /**
     * Count the number of BookPiLedgers.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {BookPiLedgerCountArgs} args - Arguments to filter BookPiLedgers to count.
     * @example
     * // Count the number of BookPiLedgers
     * const count = await prisma.bookPiLedger.count({
     *   where: {
     *     // ... the filter for the BookPiLedgers we want to count
     *   }
     * })
    **/
    count<T extends BookPiLedgerCountArgs>(
      args?: Subset<T, BookPiLedgerCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], BookPiLedgerCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a BookPiLedger.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {BookPiLedgerAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends BookPiLedgerAggregateArgs>(args: Subset<T, BookPiLedgerAggregateArgs>): Prisma.PrismaPromise<GetBookPiLedgerAggregateType<T>>

    /**
     * Group by BookPiLedger.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {BookPiLedgerGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends BookPiLedgerGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: BookPiLedgerGroupByArgs['orderBy'] }
        : { orderBy?: BookPiLedgerGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, BookPiLedgerGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetBookPiLedgerGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the BookPiLedger model
   */
  readonly fields: BookPiLedgerFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for BookPiLedger.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__BookPiLedgerClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    tenant<T extends TenantDefaultArgs<ExtArgs> = {}>(args?: Subset<T, TenantDefaultArgs<ExtArgs>>): Prisma__TenantClient<$Result.GetResult<Prisma.$TenantPayload<ExtArgs>, T, "findUniqueOrThrow"> | Null, Null, ExtArgs>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the BookPiLedger model
   */ 
  interface BookPiLedgerFieldRefs {
    readonly id: FieldRef<"BookPiLedger", 'String'>
    readonly tenantId: FieldRef<"BookPiLedger", 'String'>
    readonly index: FieldRef<"BookPiLedger", 'Int'>
    readonly eventType: FieldRef<"BookPiLedger", 'String'>
    readonly amount: FieldRef<"BookPiLedger", 'Int'>
    readonly idempotencyKey: FieldRef<"BookPiLedger", 'String'>
    readonly hash: FieldRef<"BookPiLedger", 'String'>
    readonly previousHash: FieldRef<"BookPiLedger", 'String'>
    readonly createdAt: FieldRef<"BookPiLedger", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * BookPiLedger findUnique
   */
  export type BookPiLedgerFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the BookPiLedger
     */
    select?: BookPiLedgerSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: BookPiLedgerInclude<ExtArgs> | null
    /**
     * Filter, which BookPiLedger to fetch.
     */
    where: BookPiLedgerWhereUniqueInput
  }

  /**
   * BookPiLedger findUniqueOrThrow
   */
  export type BookPiLedgerFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the BookPiLedger
     */
    select?: BookPiLedgerSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: BookPiLedgerInclude<ExtArgs> | null
    /**
     * Filter, which BookPiLedger to fetch.
     */
    where: BookPiLedgerWhereUniqueInput
  }

  /**
   * BookPiLedger findFirst
   */
  export type BookPiLedgerFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the BookPiLedger
     */
    select?: BookPiLedgerSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: BookPiLedgerInclude<ExtArgs> | null
    /**
     * Filter, which BookPiLedger to fetch.
     */
    where?: BookPiLedgerWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of BookPiLedgers to fetch.
     */
    orderBy?: BookPiLedgerOrderByWithRelationInput | BookPiLedgerOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for BookPiLedgers.
     */
    cursor?: BookPiLedgerWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` BookPiLedgers from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` BookPiLedgers.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of BookPiLedgers.
     */
    distinct?: BookPiLedgerScalarFieldEnum | BookPiLedgerScalarFieldEnum[]
  }

  /**
   * BookPiLedger findFirstOrThrow
   */
  export type BookPiLedgerFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the BookPiLedger
     */
    select?: BookPiLedgerSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: BookPiLedgerInclude<ExtArgs> | null
    /**
     * Filter, which BookPiLedger to fetch.
     */
    where?: BookPiLedgerWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of BookPiLedgers to fetch.
     */
    orderBy?: BookPiLedgerOrderByWithRelationInput | BookPiLedgerOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for BookPiLedgers.
     */
    cursor?: BookPiLedgerWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` BookPiLedgers from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` BookPiLedgers.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of BookPiLedgers.
     */
    distinct?: BookPiLedgerScalarFieldEnum | BookPiLedgerScalarFieldEnum[]
  }

  /**
   * BookPiLedger findMany
   */
  export type BookPiLedgerFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the BookPiLedger
     */
    select?: BookPiLedgerSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: BookPiLedgerInclude<ExtArgs> | null
    /**
     * Filter, which BookPiLedgers to fetch.
     */
    where?: BookPiLedgerWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of BookPiLedgers to fetch.
     */
    orderBy?: BookPiLedgerOrderByWithRelationInput | BookPiLedgerOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing BookPiLedgers.
     */
    cursor?: BookPiLedgerWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` BookPiLedgers from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` BookPiLedgers.
     */
    skip?: number
    distinct?: BookPiLedgerScalarFieldEnum | BookPiLedgerScalarFieldEnum[]
  }

  /**
   * BookPiLedger create
   */
  export type BookPiLedgerCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the BookPiLedger
     */
    select?: BookPiLedgerSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: BookPiLedgerInclude<ExtArgs> | null
    /**
     * The data needed to create a BookPiLedger.
     */
    data: XOR<BookPiLedgerCreateInput, BookPiLedgerUncheckedCreateInput>
  }

  /**
   * BookPiLedger createMany
   */
  export type BookPiLedgerCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many BookPiLedgers.
     */
    data: BookPiLedgerCreateManyInput | BookPiLedgerCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * BookPiLedger createManyAndReturn
   */
  export type BookPiLedgerCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the BookPiLedger
     */
    select?: BookPiLedgerSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * The data used to create many BookPiLedgers.
     */
    data: BookPiLedgerCreateManyInput | BookPiLedgerCreateManyInput[]
    skipDuplicates?: boolean
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: BookPiLedgerIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * BookPiLedger update
   */
  export type BookPiLedgerUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the BookPiLedger
     */
    select?: BookPiLedgerSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: BookPiLedgerInclude<ExtArgs> | null
    /**
     * The data needed to update a BookPiLedger.
     */
    data: XOR<BookPiLedgerUpdateInput, BookPiLedgerUncheckedUpdateInput>
    /**
     * Choose, which BookPiLedger to update.
     */
    where: BookPiLedgerWhereUniqueInput
  }

  /**
   * BookPiLedger updateMany
   */
  export type BookPiLedgerUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update BookPiLedgers.
     */
    data: XOR<BookPiLedgerUpdateManyMutationInput, BookPiLedgerUncheckedUpdateManyInput>
    /**
     * Filter which BookPiLedgers to update
     */
    where?: BookPiLedgerWhereInput
  }

  /**
   * BookPiLedger upsert
   */
  export type BookPiLedgerUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the BookPiLedger
     */
    select?: BookPiLedgerSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: BookPiLedgerInclude<ExtArgs> | null
    /**
     * The filter to search for the BookPiLedger to update in case it exists.
     */
    where: BookPiLedgerWhereUniqueInput
    /**
     * In case the BookPiLedger found by the `where` argument doesn't exist, create a new BookPiLedger with this data.
     */
    create: XOR<BookPiLedgerCreateInput, BookPiLedgerUncheckedCreateInput>
    /**
     * In case the BookPiLedger was found with the provided `where` argument, update it with this data.
     */
    update: XOR<BookPiLedgerUpdateInput, BookPiLedgerUncheckedUpdateInput>
  }

  /**
   * BookPiLedger delete
   */
  export type BookPiLedgerDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the BookPiLedger
     */
    select?: BookPiLedgerSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: BookPiLedgerInclude<ExtArgs> | null
    /**
     * Filter which BookPiLedger to delete.
     */
    where: BookPiLedgerWhereUniqueInput
  }

  /**
   * BookPiLedger deleteMany
   */
  export type BookPiLedgerDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which BookPiLedgers to delete
     */
    where?: BookPiLedgerWhereInput
  }

  /**
   * BookPiLedger without action
   */
  export type BookPiLedgerDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the BookPiLedger
     */
    select?: BookPiLedgerSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: BookPiLedgerInclude<ExtArgs> | null
  }


  /**
   * Enums
   */

  export const TransactionIsolationLevel: {
    ReadUncommitted: 'ReadUncommitted',
    ReadCommitted: 'ReadCommitted',
    RepeatableRead: 'RepeatableRead',
    Serializable: 'Serializable'
  };

  export type TransactionIsolationLevel = (typeof TransactionIsolationLevel)[keyof typeof TransactionIsolationLevel]


  export const TenantScalarFieldEnum: {
    id: 'id',
    name: 'name',
    createdAt: 'createdAt'
  };

  export type TenantScalarFieldEnum = (typeof TenantScalarFieldEnum)[keyof typeof TenantScalarFieldEnum]


  export const UserScalarFieldEnum: {
    id: 'id',
    tenantId: 'tenantId',
    email: 'email',
    name: 'name',
    createdAt: 'createdAt'
  };

  export type UserScalarFieldEnum = (typeof UserScalarFieldEnum)[keyof typeof UserScalarFieldEnum]


  export const MonetizationAccountScalarFieldEnum: {
    userId: 'userId',
    earnedBalanceCents: 'earnedBalanceCents',
    qualifiedUses: 'qualifiedUses',
    approvedContributions: 'approvedContributions',
    trainingCompleted: 'trainingCompleted',
    identityVerified: 'identityVerified',
    paymentAccountVerified: 'paymentAccountVerified',
    profileComplete: 'profileComplete',
    sanctioned: 'sanctioned',
    underFraudReview: 'underFraudReview'
  };

  export type MonetizationAccountScalarFieldEnum = (typeof MonetizationAccountScalarFieldEnum)[keyof typeof MonetizationAccountScalarFieldEnum]


  export const BookPiLedgerScalarFieldEnum: {
    id: 'id',
    tenantId: 'tenantId',
    index: 'index',
    eventType: 'eventType',
    amount: 'amount',
    idempotencyKey: 'idempotencyKey',
    hash: 'hash',
    previousHash: 'previousHash',
    createdAt: 'createdAt'
  };

  export type BookPiLedgerScalarFieldEnum = (typeof BookPiLedgerScalarFieldEnum)[keyof typeof BookPiLedgerScalarFieldEnum]


  export const SortOrder: {
    asc: 'asc',
    desc: 'desc'
  };

  export type SortOrder = (typeof SortOrder)[keyof typeof SortOrder]


  export const QueryMode: {
    default: 'default',
    insensitive: 'insensitive'
  };

  export type QueryMode = (typeof QueryMode)[keyof typeof QueryMode]


  export const NullsOrder: {
    first: 'first',
    last: 'last'
  };

  export type NullsOrder = (typeof NullsOrder)[keyof typeof NullsOrder]


  /**
   * Field references 
   */


  /**
   * Reference to a field of type 'String'
   */
  export type StringFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'String'>
    


  /**
   * Reference to a field of type 'String[]'
   */
  export type ListStringFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'String[]'>
    


  /**
   * Reference to a field of type 'DateTime'
   */
  export type DateTimeFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'DateTime'>
    


  /**
   * Reference to a field of type 'DateTime[]'
   */
  export type ListDateTimeFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'DateTime[]'>
    


  /**
   * Reference to a field of type 'Int'
   */
  export type IntFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Int'>
    


  /**
   * Reference to a field of type 'Int[]'
   */
  export type ListIntFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Int[]'>
    


  /**
   * Reference to a field of type 'Boolean'
   */
  export type BooleanFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Boolean'>
    


  /**
   * Reference to a field of type 'Float'
   */
  export type FloatFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Float'>
    


  /**
   * Reference to a field of type 'Float[]'
   */
  export type ListFloatFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Float[]'>
    
  /**
   * Deep Input Types
   */


  export type TenantWhereInput = {
    AND?: TenantWhereInput | TenantWhereInput[]
    OR?: TenantWhereInput[]
    NOT?: TenantWhereInput | TenantWhereInput[]
    id?: StringFilter<"Tenant"> | string
    name?: StringFilter<"Tenant"> | string
    createdAt?: DateTimeFilter<"Tenant"> | Date | string
    users?: UserListRelationFilter
    bookPi?: BookPiLedgerListRelationFilter
  }

  export type TenantOrderByWithRelationInput = {
    id?: SortOrder
    name?: SortOrder
    createdAt?: SortOrder
    users?: UserOrderByRelationAggregateInput
    bookPi?: BookPiLedgerOrderByRelationAggregateInput
  }

  export type TenantWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    AND?: TenantWhereInput | TenantWhereInput[]
    OR?: TenantWhereInput[]
    NOT?: TenantWhereInput | TenantWhereInput[]
    name?: StringFilter<"Tenant"> | string
    createdAt?: DateTimeFilter<"Tenant"> | Date | string
    users?: UserListRelationFilter
    bookPi?: BookPiLedgerListRelationFilter
  }, "id">

  export type TenantOrderByWithAggregationInput = {
    id?: SortOrder
    name?: SortOrder
    createdAt?: SortOrder
    _count?: TenantCountOrderByAggregateInput
    _max?: TenantMaxOrderByAggregateInput
    _min?: TenantMinOrderByAggregateInput
  }

  export type TenantScalarWhereWithAggregatesInput = {
    AND?: TenantScalarWhereWithAggregatesInput | TenantScalarWhereWithAggregatesInput[]
    OR?: TenantScalarWhereWithAggregatesInput[]
    NOT?: TenantScalarWhereWithAggregatesInput | TenantScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"Tenant"> | string
    name?: StringWithAggregatesFilter<"Tenant"> | string
    createdAt?: DateTimeWithAggregatesFilter<"Tenant"> | Date | string
  }

  export type UserWhereInput = {
    AND?: UserWhereInput | UserWhereInput[]
    OR?: UserWhereInput[]
    NOT?: UserWhereInput | UserWhereInput[]
    id?: StringFilter<"User"> | string
    tenantId?: StringFilter<"User"> | string
    email?: StringFilter<"User"> | string
    name?: StringNullableFilter<"User"> | string | null
    createdAt?: DateTimeFilter<"User"> | Date | string
    tenant?: XOR<TenantRelationFilter, TenantWhereInput>
    monetization?: XOR<MonetizationAccountNullableRelationFilter, MonetizationAccountWhereInput> | null
  }

  export type UserOrderByWithRelationInput = {
    id?: SortOrder
    tenantId?: SortOrder
    email?: SortOrder
    name?: SortOrderInput | SortOrder
    createdAt?: SortOrder
    tenant?: TenantOrderByWithRelationInput
    monetization?: MonetizationAccountOrderByWithRelationInput
  }

  export type UserWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    email?: string
    AND?: UserWhereInput | UserWhereInput[]
    OR?: UserWhereInput[]
    NOT?: UserWhereInput | UserWhereInput[]
    tenantId?: StringFilter<"User"> | string
    name?: StringNullableFilter<"User"> | string | null
    createdAt?: DateTimeFilter<"User"> | Date | string
    tenant?: XOR<TenantRelationFilter, TenantWhereInput>
    monetization?: XOR<MonetizationAccountNullableRelationFilter, MonetizationAccountWhereInput> | null
  }, "id" | "email">

  export type UserOrderByWithAggregationInput = {
    id?: SortOrder
    tenantId?: SortOrder
    email?: SortOrder
    name?: SortOrderInput | SortOrder
    createdAt?: SortOrder
    _count?: UserCountOrderByAggregateInput
    _max?: UserMaxOrderByAggregateInput
    _min?: UserMinOrderByAggregateInput
  }

  export type UserScalarWhereWithAggregatesInput = {
    AND?: UserScalarWhereWithAggregatesInput | UserScalarWhereWithAggregatesInput[]
    OR?: UserScalarWhereWithAggregatesInput[]
    NOT?: UserScalarWhereWithAggregatesInput | UserScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"User"> | string
    tenantId?: StringWithAggregatesFilter<"User"> | string
    email?: StringWithAggregatesFilter<"User"> | string
    name?: StringNullableWithAggregatesFilter<"User"> | string | null
    createdAt?: DateTimeWithAggregatesFilter<"User"> | Date | string
  }

  export type MonetizationAccountWhereInput = {
    AND?: MonetizationAccountWhereInput | MonetizationAccountWhereInput[]
    OR?: MonetizationAccountWhereInput[]
    NOT?: MonetizationAccountWhereInput | MonetizationAccountWhereInput[]
    userId?: StringFilter<"MonetizationAccount"> | string
    earnedBalanceCents?: IntFilter<"MonetizationAccount"> | number
    qualifiedUses?: IntFilter<"MonetizationAccount"> | number
    approvedContributions?: IntFilter<"MonetizationAccount"> | number
    trainingCompleted?: BoolFilter<"MonetizationAccount"> | boolean
    identityVerified?: BoolFilter<"MonetizationAccount"> | boolean
    paymentAccountVerified?: BoolFilter<"MonetizationAccount"> | boolean
    profileComplete?: BoolFilter<"MonetizationAccount"> | boolean
    sanctioned?: BoolFilter<"MonetizationAccount"> | boolean
    underFraudReview?: BoolFilter<"MonetizationAccount"> | boolean
    user?: XOR<UserRelationFilter, UserWhereInput>
  }

  export type MonetizationAccountOrderByWithRelationInput = {
    userId?: SortOrder
    earnedBalanceCents?: SortOrder
    qualifiedUses?: SortOrder
    approvedContributions?: SortOrder
    trainingCompleted?: SortOrder
    identityVerified?: SortOrder
    paymentAccountVerified?: SortOrder
    profileComplete?: SortOrder
    sanctioned?: SortOrder
    underFraudReview?: SortOrder
    user?: UserOrderByWithRelationInput
  }

  export type MonetizationAccountWhereUniqueInput = Prisma.AtLeast<{
    userId?: string
    AND?: MonetizationAccountWhereInput | MonetizationAccountWhereInput[]
    OR?: MonetizationAccountWhereInput[]
    NOT?: MonetizationAccountWhereInput | MonetizationAccountWhereInput[]
    earnedBalanceCents?: IntFilter<"MonetizationAccount"> | number
    qualifiedUses?: IntFilter<"MonetizationAccount"> | number
    approvedContributions?: IntFilter<"MonetizationAccount"> | number
    trainingCompleted?: BoolFilter<"MonetizationAccount"> | boolean
    identityVerified?: BoolFilter<"MonetizationAccount"> | boolean
    paymentAccountVerified?: BoolFilter<"MonetizationAccount"> | boolean
    profileComplete?: BoolFilter<"MonetizationAccount"> | boolean
    sanctioned?: BoolFilter<"MonetizationAccount"> | boolean
    underFraudReview?: BoolFilter<"MonetizationAccount"> | boolean
    user?: XOR<UserRelationFilter, UserWhereInput>
  }, "userId">

  export type MonetizationAccountOrderByWithAggregationInput = {
    userId?: SortOrder
    earnedBalanceCents?: SortOrder
    qualifiedUses?: SortOrder
    approvedContributions?: SortOrder
    trainingCompleted?: SortOrder
    identityVerified?: SortOrder
    paymentAccountVerified?: SortOrder
    profileComplete?: SortOrder
    sanctioned?: SortOrder
    underFraudReview?: SortOrder
    _count?: MonetizationAccountCountOrderByAggregateInput
    _avg?: MonetizationAccountAvgOrderByAggregateInput
    _max?: MonetizationAccountMaxOrderByAggregateInput
    _min?: MonetizationAccountMinOrderByAggregateInput
    _sum?: MonetizationAccountSumOrderByAggregateInput
  }

  export type MonetizationAccountScalarWhereWithAggregatesInput = {
    AND?: MonetizationAccountScalarWhereWithAggregatesInput | MonetizationAccountScalarWhereWithAggregatesInput[]
    OR?: MonetizationAccountScalarWhereWithAggregatesInput[]
    NOT?: MonetizationAccountScalarWhereWithAggregatesInput | MonetizationAccountScalarWhereWithAggregatesInput[]
    userId?: StringWithAggregatesFilter<"MonetizationAccount"> | string
    earnedBalanceCents?: IntWithAggregatesFilter<"MonetizationAccount"> | number
    qualifiedUses?: IntWithAggregatesFilter<"MonetizationAccount"> | number
    approvedContributions?: IntWithAggregatesFilter<"MonetizationAccount"> | number
    trainingCompleted?: BoolWithAggregatesFilter<"MonetizationAccount"> | boolean
    identityVerified?: BoolWithAggregatesFilter<"MonetizationAccount"> | boolean
    paymentAccountVerified?: BoolWithAggregatesFilter<"MonetizationAccount"> | boolean
    profileComplete?: BoolWithAggregatesFilter<"MonetizationAccount"> | boolean
    sanctioned?: BoolWithAggregatesFilter<"MonetizationAccount"> | boolean
    underFraudReview?: BoolWithAggregatesFilter<"MonetizationAccount"> | boolean
  }

  export type BookPiLedgerWhereInput = {
    AND?: BookPiLedgerWhereInput | BookPiLedgerWhereInput[]
    OR?: BookPiLedgerWhereInput[]
    NOT?: BookPiLedgerWhereInput | BookPiLedgerWhereInput[]
    id?: StringFilter<"BookPiLedger"> | string
    tenantId?: StringFilter<"BookPiLedger"> | string
    index?: IntFilter<"BookPiLedger"> | number
    eventType?: StringFilter<"BookPiLedger"> | string
    amount?: IntFilter<"BookPiLedger"> | number
    idempotencyKey?: StringFilter<"BookPiLedger"> | string
    hash?: StringFilter<"BookPiLedger"> | string
    previousHash?: StringFilter<"BookPiLedger"> | string
    createdAt?: DateTimeFilter<"BookPiLedger"> | Date | string
    tenant?: XOR<TenantRelationFilter, TenantWhereInput>
  }

  export type BookPiLedgerOrderByWithRelationInput = {
    id?: SortOrder
    tenantId?: SortOrder
    index?: SortOrder
    eventType?: SortOrder
    amount?: SortOrder
    idempotencyKey?: SortOrder
    hash?: SortOrder
    previousHash?: SortOrder
    createdAt?: SortOrder
    tenant?: TenantOrderByWithRelationInput
  }

  export type BookPiLedgerWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    idempotencyKey?: string
    tenantId_index?: BookPiLedgerTenantIdIndexCompoundUniqueInput
    AND?: BookPiLedgerWhereInput | BookPiLedgerWhereInput[]
    OR?: BookPiLedgerWhereInput[]
    NOT?: BookPiLedgerWhereInput | BookPiLedgerWhereInput[]
    tenantId?: StringFilter<"BookPiLedger"> | string
    index?: IntFilter<"BookPiLedger"> | number
    eventType?: StringFilter<"BookPiLedger"> | string
    amount?: IntFilter<"BookPiLedger"> | number
    hash?: StringFilter<"BookPiLedger"> | string
    previousHash?: StringFilter<"BookPiLedger"> | string
    createdAt?: DateTimeFilter<"BookPiLedger"> | Date | string
    tenant?: XOR<TenantRelationFilter, TenantWhereInput>
  }, "id" | "idempotencyKey" | "tenantId_index">

  export type BookPiLedgerOrderByWithAggregationInput = {
    id?: SortOrder
    tenantId?: SortOrder
    index?: SortOrder
    eventType?: SortOrder
    amount?: SortOrder
    idempotencyKey?: SortOrder
    hash?: SortOrder
    previousHash?: SortOrder
    createdAt?: SortOrder
    _count?: BookPiLedgerCountOrderByAggregateInput
    _avg?: BookPiLedgerAvgOrderByAggregateInput
    _max?: BookPiLedgerMaxOrderByAggregateInput
    _min?: BookPiLedgerMinOrderByAggregateInput
    _sum?: BookPiLedgerSumOrderByAggregateInput
  }

  export type BookPiLedgerScalarWhereWithAggregatesInput = {
    AND?: BookPiLedgerScalarWhereWithAggregatesInput | BookPiLedgerScalarWhereWithAggregatesInput[]
    OR?: BookPiLedgerScalarWhereWithAggregatesInput[]
    NOT?: BookPiLedgerScalarWhereWithAggregatesInput | BookPiLedgerScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"BookPiLedger"> | string
    tenantId?: StringWithAggregatesFilter<"BookPiLedger"> | string
    index?: IntWithAggregatesFilter<"BookPiLedger"> | number
    eventType?: StringWithAggregatesFilter<"BookPiLedger"> | string
    amount?: IntWithAggregatesFilter<"BookPiLedger"> | number
    idempotencyKey?: StringWithAggregatesFilter<"BookPiLedger"> | string
    hash?: StringWithAggregatesFilter<"BookPiLedger"> | string
    previousHash?: StringWithAggregatesFilter<"BookPiLedger"> | string
    createdAt?: DateTimeWithAggregatesFilter<"BookPiLedger"> | Date | string
  }

  export type TenantCreateInput = {
    id?: string
    name: string
    createdAt?: Date | string
    users?: UserCreateNestedManyWithoutTenantInput
    bookPi?: BookPiLedgerCreateNestedManyWithoutTenantInput
  }

  export type TenantUncheckedCreateInput = {
    id?: string
    name: string
    createdAt?: Date | string
    users?: UserUncheckedCreateNestedManyWithoutTenantInput
    bookPi?: BookPiLedgerUncheckedCreateNestedManyWithoutTenantInput
  }

  export type TenantUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    users?: UserUpdateManyWithoutTenantNestedInput
    bookPi?: BookPiLedgerUpdateManyWithoutTenantNestedInput
  }

  export type TenantUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    users?: UserUncheckedUpdateManyWithoutTenantNestedInput
    bookPi?: BookPiLedgerUncheckedUpdateManyWithoutTenantNestedInput
  }

  export type TenantCreateManyInput = {
    id?: string
    name: string
    createdAt?: Date | string
  }

  export type TenantUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type TenantUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type UserCreateInput = {
    id?: string
    email: string
    name?: string | null
    createdAt?: Date | string
    tenant: TenantCreateNestedOneWithoutUsersInput
    monetization?: MonetizationAccountCreateNestedOneWithoutUserInput
  }

  export type UserUncheckedCreateInput = {
    id?: string
    tenantId: string
    email: string
    name?: string | null
    createdAt?: Date | string
    monetization?: MonetizationAccountUncheckedCreateNestedOneWithoutUserInput
  }

  export type UserUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    name?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    tenant?: TenantUpdateOneRequiredWithoutUsersNestedInput
    monetization?: MonetizationAccountUpdateOneWithoutUserNestedInput
  }

  export type UserUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    tenantId?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    name?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    monetization?: MonetizationAccountUncheckedUpdateOneWithoutUserNestedInput
  }

  export type UserCreateManyInput = {
    id?: string
    tenantId: string
    email: string
    name?: string | null
    createdAt?: Date | string
  }

  export type UserUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    name?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type UserUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    tenantId?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    name?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type MonetizationAccountCreateInput = {
    earnedBalanceCents?: number
    qualifiedUses?: number
    approvedContributions?: number
    trainingCompleted?: boolean
    identityVerified?: boolean
    paymentAccountVerified?: boolean
    profileComplete?: boolean
    sanctioned?: boolean
    underFraudReview?: boolean
    user: UserCreateNestedOneWithoutMonetizationInput
  }

  export type MonetizationAccountUncheckedCreateInput = {
    userId: string
    earnedBalanceCents?: number
    qualifiedUses?: number
    approvedContributions?: number
    trainingCompleted?: boolean
    identityVerified?: boolean
    paymentAccountVerified?: boolean
    profileComplete?: boolean
    sanctioned?: boolean
    underFraudReview?: boolean
  }

  export type MonetizationAccountUpdateInput = {
    earnedBalanceCents?: IntFieldUpdateOperationsInput | number
    qualifiedUses?: IntFieldUpdateOperationsInput | number
    approvedContributions?: IntFieldUpdateOperationsInput | number
    trainingCompleted?: BoolFieldUpdateOperationsInput | boolean
    identityVerified?: BoolFieldUpdateOperationsInput | boolean
    paymentAccountVerified?: BoolFieldUpdateOperationsInput | boolean
    profileComplete?: BoolFieldUpdateOperationsInput | boolean
    sanctioned?: BoolFieldUpdateOperationsInput | boolean
    underFraudReview?: BoolFieldUpdateOperationsInput | boolean
    user?: UserUpdateOneRequiredWithoutMonetizationNestedInput
  }

  export type MonetizationAccountUncheckedUpdateInput = {
    userId?: StringFieldUpdateOperationsInput | string
    earnedBalanceCents?: IntFieldUpdateOperationsInput | number
    qualifiedUses?: IntFieldUpdateOperationsInput | number
    approvedContributions?: IntFieldUpdateOperationsInput | number
    trainingCompleted?: BoolFieldUpdateOperationsInput | boolean
    identityVerified?: BoolFieldUpdateOperationsInput | boolean
    paymentAccountVerified?: BoolFieldUpdateOperationsInput | boolean
    profileComplete?: BoolFieldUpdateOperationsInput | boolean
    sanctioned?: BoolFieldUpdateOperationsInput | boolean
    underFraudReview?: BoolFieldUpdateOperationsInput | boolean
  }

  export type MonetizationAccountCreateManyInput = {
    userId: string
    earnedBalanceCents?: number
    qualifiedUses?: number
    approvedContributions?: number
    trainingCompleted?: boolean
    identityVerified?: boolean
    paymentAccountVerified?: boolean
    profileComplete?: boolean
    sanctioned?: boolean
    underFraudReview?: boolean
  }

  export type MonetizationAccountUpdateManyMutationInput = {
    earnedBalanceCents?: IntFieldUpdateOperationsInput | number
    qualifiedUses?: IntFieldUpdateOperationsInput | number
    approvedContributions?: IntFieldUpdateOperationsInput | number
    trainingCompleted?: BoolFieldUpdateOperationsInput | boolean
    identityVerified?: BoolFieldUpdateOperationsInput | boolean
    paymentAccountVerified?: BoolFieldUpdateOperationsInput | boolean
    profileComplete?: BoolFieldUpdateOperationsInput | boolean
    sanctioned?: BoolFieldUpdateOperationsInput | boolean
    underFraudReview?: BoolFieldUpdateOperationsInput | boolean
  }

  export type MonetizationAccountUncheckedUpdateManyInput = {
    userId?: StringFieldUpdateOperationsInput | string
    earnedBalanceCents?: IntFieldUpdateOperationsInput | number
    qualifiedUses?: IntFieldUpdateOperationsInput | number
    approvedContributions?: IntFieldUpdateOperationsInput | number
    trainingCompleted?: BoolFieldUpdateOperationsInput | boolean
    identityVerified?: BoolFieldUpdateOperationsInput | boolean
    paymentAccountVerified?: BoolFieldUpdateOperationsInput | boolean
    profileComplete?: BoolFieldUpdateOperationsInput | boolean
    sanctioned?: BoolFieldUpdateOperationsInput | boolean
    underFraudReview?: BoolFieldUpdateOperationsInput | boolean
  }

  export type BookPiLedgerCreateInput = {
    id?: string
    index: number
    eventType: string
    amount: number
    idempotencyKey: string
    hash: string
    previousHash: string
    createdAt?: Date | string
    tenant: TenantCreateNestedOneWithoutBookPiInput
  }

  export type BookPiLedgerUncheckedCreateInput = {
    id?: string
    tenantId: string
    index: number
    eventType: string
    amount: number
    idempotencyKey: string
    hash: string
    previousHash: string
    createdAt?: Date | string
  }

  export type BookPiLedgerUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    index?: IntFieldUpdateOperationsInput | number
    eventType?: StringFieldUpdateOperationsInput | string
    amount?: IntFieldUpdateOperationsInput | number
    idempotencyKey?: StringFieldUpdateOperationsInput | string
    hash?: StringFieldUpdateOperationsInput | string
    previousHash?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    tenant?: TenantUpdateOneRequiredWithoutBookPiNestedInput
  }

  export type BookPiLedgerUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    tenantId?: StringFieldUpdateOperationsInput | string
    index?: IntFieldUpdateOperationsInput | number
    eventType?: StringFieldUpdateOperationsInput | string
    amount?: IntFieldUpdateOperationsInput | number
    idempotencyKey?: StringFieldUpdateOperationsInput | string
    hash?: StringFieldUpdateOperationsInput | string
    previousHash?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type BookPiLedgerCreateManyInput = {
    id?: string
    tenantId: string
    index: number
    eventType: string
    amount: number
    idempotencyKey: string
    hash: string
    previousHash: string
    createdAt?: Date | string
  }

  export type BookPiLedgerUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    index?: IntFieldUpdateOperationsInput | number
    eventType?: StringFieldUpdateOperationsInput | string
    amount?: IntFieldUpdateOperationsInput | number
    idempotencyKey?: StringFieldUpdateOperationsInput | string
    hash?: StringFieldUpdateOperationsInput | string
    previousHash?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type BookPiLedgerUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    tenantId?: StringFieldUpdateOperationsInput | string
    index?: IntFieldUpdateOperationsInput | number
    eventType?: StringFieldUpdateOperationsInput | string
    amount?: IntFieldUpdateOperationsInput | number
    idempotencyKey?: StringFieldUpdateOperationsInput | string
    hash?: StringFieldUpdateOperationsInput | string
    previousHash?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type StringFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel>
    in?: string[] | ListStringFieldRefInput<$PrismaModel>
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel>
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    mode?: QueryMode
    not?: NestedStringFilter<$PrismaModel> | string
  }

  export type DateTimeFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeFilter<$PrismaModel> | Date | string
  }

  export type UserListRelationFilter = {
    every?: UserWhereInput
    some?: UserWhereInput
    none?: UserWhereInput
  }

  export type BookPiLedgerListRelationFilter = {
    every?: BookPiLedgerWhereInput
    some?: BookPiLedgerWhereInput
    none?: BookPiLedgerWhereInput
  }

  export type UserOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type BookPiLedgerOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type TenantCountOrderByAggregateInput = {
    id?: SortOrder
    name?: SortOrder
    createdAt?: SortOrder
  }

  export type TenantMaxOrderByAggregateInput = {
    id?: SortOrder
    name?: SortOrder
    createdAt?: SortOrder
  }

  export type TenantMinOrderByAggregateInput = {
    id?: SortOrder
    name?: SortOrder
    createdAt?: SortOrder
  }

  export type StringWithAggregatesFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel>
    in?: string[] | ListStringFieldRefInput<$PrismaModel>
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel>
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    mode?: QueryMode
    not?: NestedStringWithAggregatesFilter<$PrismaModel> | string
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedStringFilter<$PrismaModel>
    _max?: NestedStringFilter<$PrismaModel>
  }

  export type DateTimeWithAggregatesFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeWithAggregatesFilter<$PrismaModel> | Date | string
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedDateTimeFilter<$PrismaModel>
    _max?: NestedDateTimeFilter<$PrismaModel>
  }

  export type StringNullableFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel> | null
    in?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    mode?: QueryMode
    not?: NestedStringNullableFilter<$PrismaModel> | string | null
  }

  export type TenantRelationFilter = {
    is?: TenantWhereInput
    isNot?: TenantWhereInput
  }

  export type MonetizationAccountNullableRelationFilter = {
    is?: MonetizationAccountWhereInput | null
    isNot?: MonetizationAccountWhereInput | null
  }

  export type SortOrderInput = {
    sort: SortOrder
    nulls?: NullsOrder
  }

  export type UserCountOrderByAggregateInput = {
    id?: SortOrder
    tenantId?: SortOrder
    email?: SortOrder
    name?: SortOrder
    createdAt?: SortOrder
  }

  export type UserMaxOrderByAggregateInput = {
    id?: SortOrder
    tenantId?: SortOrder
    email?: SortOrder
    name?: SortOrder
    createdAt?: SortOrder
  }

  export type UserMinOrderByAggregateInput = {
    id?: SortOrder
    tenantId?: SortOrder
    email?: SortOrder
    name?: SortOrder
    createdAt?: SortOrder
  }

  export type StringNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel> | null
    in?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    mode?: QueryMode
    not?: NestedStringNullableWithAggregatesFilter<$PrismaModel> | string | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedStringNullableFilter<$PrismaModel>
    _max?: NestedStringNullableFilter<$PrismaModel>
  }

  export type IntFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel>
    in?: number[] | ListIntFieldRefInput<$PrismaModel>
    notIn?: number[] | ListIntFieldRefInput<$PrismaModel>
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntFilter<$PrismaModel> | number
  }

  export type BoolFilter<$PrismaModel = never> = {
    equals?: boolean | BooleanFieldRefInput<$PrismaModel>
    not?: NestedBoolFilter<$PrismaModel> | boolean
  }

  export type UserRelationFilter = {
    is?: UserWhereInput
    isNot?: UserWhereInput
  }

  export type MonetizationAccountCountOrderByAggregateInput = {
    userId?: SortOrder
    earnedBalanceCents?: SortOrder
    qualifiedUses?: SortOrder
    approvedContributions?: SortOrder
    trainingCompleted?: SortOrder
    identityVerified?: SortOrder
    paymentAccountVerified?: SortOrder
    profileComplete?: SortOrder
    sanctioned?: SortOrder
    underFraudReview?: SortOrder
  }

  export type MonetizationAccountAvgOrderByAggregateInput = {
    earnedBalanceCents?: SortOrder
    qualifiedUses?: SortOrder
    approvedContributions?: SortOrder
  }

  export type MonetizationAccountMaxOrderByAggregateInput = {
    userId?: SortOrder
    earnedBalanceCents?: SortOrder
    qualifiedUses?: SortOrder
    approvedContributions?: SortOrder
    trainingCompleted?: SortOrder
    identityVerified?: SortOrder
    paymentAccountVerified?: SortOrder
    profileComplete?: SortOrder
    sanctioned?: SortOrder
    underFraudReview?: SortOrder
  }

  export type MonetizationAccountMinOrderByAggregateInput = {
    userId?: SortOrder
    earnedBalanceCents?: SortOrder
    qualifiedUses?: SortOrder
    approvedContributions?: SortOrder
    trainingCompleted?: SortOrder
    identityVerified?: SortOrder
    paymentAccountVerified?: SortOrder
    profileComplete?: SortOrder
    sanctioned?: SortOrder
    underFraudReview?: SortOrder
  }

  export type MonetizationAccountSumOrderByAggregateInput = {
    earnedBalanceCents?: SortOrder
    qualifiedUses?: SortOrder
    approvedContributions?: SortOrder
  }

  export type IntWithAggregatesFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel>
    in?: number[] | ListIntFieldRefInput<$PrismaModel>
    notIn?: number[] | ListIntFieldRefInput<$PrismaModel>
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntWithAggregatesFilter<$PrismaModel> | number
    _count?: NestedIntFilter<$PrismaModel>
    _avg?: NestedFloatFilter<$PrismaModel>
    _sum?: NestedIntFilter<$PrismaModel>
    _min?: NestedIntFilter<$PrismaModel>
    _max?: NestedIntFilter<$PrismaModel>
  }

  export type BoolWithAggregatesFilter<$PrismaModel = never> = {
    equals?: boolean | BooleanFieldRefInput<$PrismaModel>
    not?: NestedBoolWithAggregatesFilter<$PrismaModel> | boolean
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedBoolFilter<$PrismaModel>
    _max?: NestedBoolFilter<$PrismaModel>
  }

  export type BookPiLedgerTenantIdIndexCompoundUniqueInput = {
    tenantId: string
    index: number
  }

  export type BookPiLedgerCountOrderByAggregateInput = {
    id?: SortOrder
    tenantId?: SortOrder
    index?: SortOrder
    eventType?: SortOrder
    amount?: SortOrder
    idempotencyKey?: SortOrder
    hash?: SortOrder
    previousHash?: SortOrder
    createdAt?: SortOrder
  }

  export type BookPiLedgerAvgOrderByAggregateInput = {
    index?: SortOrder
    amount?: SortOrder
  }

  export type BookPiLedgerMaxOrderByAggregateInput = {
    id?: SortOrder
    tenantId?: SortOrder
    index?: SortOrder
    eventType?: SortOrder
    amount?: SortOrder
    idempotencyKey?: SortOrder
    hash?: SortOrder
    previousHash?: SortOrder
    createdAt?: SortOrder
  }

  export type BookPiLedgerMinOrderByAggregateInput = {
    id?: SortOrder
    tenantId?: SortOrder
    index?: SortOrder
    eventType?: SortOrder
    amount?: SortOrder
    idempotencyKey?: SortOrder
    hash?: SortOrder
    previousHash?: SortOrder
    createdAt?: SortOrder
  }

  export type BookPiLedgerSumOrderByAggregateInput = {
    index?: SortOrder
    amount?: SortOrder
  }

  export type UserCreateNestedManyWithoutTenantInput = {
    create?: XOR<UserCreateWithoutTenantInput, UserUncheckedCreateWithoutTenantInput> | UserCreateWithoutTenantInput[] | UserUncheckedCreateWithoutTenantInput[]
    connectOrCreate?: UserCreateOrConnectWithoutTenantInput | UserCreateOrConnectWithoutTenantInput[]
    createMany?: UserCreateManyTenantInputEnvelope
    connect?: UserWhereUniqueInput | UserWhereUniqueInput[]
  }

  export type BookPiLedgerCreateNestedManyWithoutTenantInput = {
    create?: XOR<BookPiLedgerCreateWithoutTenantInput, BookPiLedgerUncheckedCreateWithoutTenantInput> | BookPiLedgerCreateWithoutTenantInput[] | BookPiLedgerUncheckedCreateWithoutTenantInput[]
    connectOrCreate?: BookPiLedgerCreateOrConnectWithoutTenantInput | BookPiLedgerCreateOrConnectWithoutTenantInput[]
    createMany?: BookPiLedgerCreateManyTenantInputEnvelope
    connect?: BookPiLedgerWhereUniqueInput | BookPiLedgerWhereUniqueInput[]
  }

  export type UserUncheckedCreateNestedManyWithoutTenantInput = {
    create?: XOR<UserCreateWithoutTenantInput, UserUncheckedCreateWithoutTenantInput> | UserCreateWithoutTenantInput[] | UserUncheckedCreateWithoutTenantInput[]
    connectOrCreate?: UserCreateOrConnectWithoutTenantInput | UserCreateOrConnectWithoutTenantInput[]
    createMany?: UserCreateManyTenantInputEnvelope
    connect?: UserWhereUniqueInput | UserWhereUniqueInput[]
  }

  export type BookPiLedgerUncheckedCreateNestedManyWithoutTenantInput = {
    create?: XOR<BookPiLedgerCreateWithoutTenantInput, BookPiLedgerUncheckedCreateWithoutTenantInput> | BookPiLedgerCreateWithoutTenantInput[] | BookPiLedgerUncheckedCreateWithoutTenantInput[]
    connectOrCreate?: BookPiLedgerCreateOrConnectWithoutTenantInput | BookPiLedgerCreateOrConnectWithoutTenantInput[]
    createMany?: BookPiLedgerCreateManyTenantInputEnvelope
    connect?: BookPiLedgerWhereUniqueInput | BookPiLedgerWhereUniqueInput[]
  }

  export type StringFieldUpdateOperationsInput = {
    set?: string
  }

  export type DateTimeFieldUpdateOperationsInput = {
    set?: Date | string
  }

  export type UserUpdateManyWithoutTenantNestedInput = {
    create?: XOR<UserCreateWithoutTenantInput, UserUncheckedCreateWithoutTenantInput> | UserCreateWithoutTenantInput[] | UserUncheckedCreateWithoutTenantInput[]
    connectOrCreate?: UserCreateOrConnectWithoutTenantInput | UserCreateOrConnectWithoutTenantInput[]
    upsert?: UserUpsertWithWhereUniqueWithoutTenantInput | UserUpsertWithWhereUniqueWithoutTenantInput[]
    createMany?: UserCreateManyTenantInputEnvelope
    set?: UserWhereUniqueInput | UserWhereUniqueInput[]
    disconnect?: UserWhereUniqueInput | UserWhereUniqueInput[]
    delete?: UserWhereUniqueInput | UserWhereUniqueInput[]
    connect?: UserWhereUniqueInput | UserWhereUniqueInput[]
    update?: UserUpdateWithWhereUniqueWithoutTenantInput | UserUpdateWithWhereUniqueWithoutTenantInput[]
    updateMany?: UserUpdateManyWithWhereWithoutTenantInput | UserUpdateManyWithWhereWithoutTenantInput[]
    deleteMany?: UserScalarWhereInput | UserScalarWhereInput[]
  }

  export type BookPiLedgerUpdateManyWithoutTenantNestedInput = {
    create?: XOR<BookPiLedgerCreateWithoutTenantInput, BookPiLedgerUncheckedCreateWithoutTenantInput> | BookPiLedgerCreateWithoutTenantInput[] | BookPiLedgerUncheckedCreateWithoutTenantInput[]
    connectOrCreate?: BookPiLedgerCreateOrConnectWithoutTenantInput | BookPiLedgerCreateOrConnectWithoutTenantInput[]
    upsert?: BookPiLedgerUpsertWithWhereUniqueWithoutTenantInput | BookPiLedgerUpsertWithWhereUniqueWithoutTenantInput[]
    createMany?: BookPiLedgerCreateManyTenantInputEnvelope
    set?: BookPiLedgerWhereUniqueInput | BookPiLedgerWhereUniqueInput[]
    disconnect?: BookPiLedgerWhereUniqueInput | BookPiLedgerWhereUniqueInput[]
    delete?: BookPiLedgerWhereUniqueInput | BookPiLedgerWhereUniqueInput[]
    connect?: BookPiLedgerWhereUniqueInput | BookPiLedgerWhereUniqueInput[]
    update?: BookPiLedgerUpdateWithWhereUniqueWithoutTenantInput | BookPiLedgerUpdateWithWhereUniqueWithoutTenantInput[]
    updateMany?: BookPiLedgerUpdateManyWithWhereWithoutTenantInput | BookPiLedgerUpdateManyWithWhereWithoutTenantInput[]
    deleteMany?: BookPiLedgerScalarWhereInput | BookPiLedgerScalarWhereInput[]
  }

  export type UserUncheckedUpdateManyWithoutTenantNestedInput = {
    create?: XOR<UserCreateWithoutTenantInput, UserUncheckedCreateWithoutTenantInput> | UserCreateWithoutTenantInput[] | UserUncheckedCreateWithoutTenantInput[]
    connectOrCreate?: UserCreateOrConnectWithoutTenantInput | UserCreateOrConnectWithoutTenantInput[]
    upsert?: UserUpsertWithWhereUniqueWithoutTenantInput | UserUpsertWithWhereUniqueWithoutTenantInput[]
    createMany?: UserCreateManyTenantInputEnvelope
    set?: UserWhereUniqueInput | UserWhereUniqueInput[]
    disconnect?: UserWhereUniqueInput | UserWhereUniqueInput[]
    delete?: UserWhereUniqueInput | UserWhereUniqueInput[]
    connect?: UserWhereUniqueInput | UserWhereUniqueInput[]
    update?: UserUpdateWithWhereUniqueWithoutTenantInput | UserUpdateWithWhereUniqueWithoutTenantInput[]
    updateMany?: UserUpdateManyWithWhereWithoutTenantInput | UserUpdateManyWithWhereWithoutTenantInput[]
    deleteMany?: UserScalarWhereInput | UserScalarWhereInput[]
  }

  export type BookPiLedgerUncheckedUpdateManyWithoutTenantNestedInput = {
    create?: XOR<BookPiLedgerCreateWithoutTenantInput, BookPiLedgerUncheckedCreateWithoutTenantInput> | BookPiLedgerCreateWithoutTenantInput[] | BookPiLedgerUncheckedCreateWithoutTenantInput[]
    connectOrCreate?: BookPiLedgerCreateOrConnectWithoutTenantInput | BookPiLedgerCreateOrConnectWithoutTenantInput[]
    upsert?: BookPiLedgerUpsertWithWhereUniqueWithoutTenantInput | BookPiLedgerUpsertWithWhereUniqueWithoutTenantInput[]
    createMany?: BookPiLedgerCreateManyTenantInputEnvelope
    set?: BookPiLedgerWhereUniqueInput | BookPiLedgerWhereUniqueInput[]
    disconnect?: BookPiLedgerWhereUniqueInput | BookPiLedgerWhereUniqueInput[]
    delete?: BookPiLedgerWhereUniqueInput | BookPiLedgerWhereUniqueInput[]
    connect?: BookPiLedgerWhereUniqueInput | BookPiLedgerWhereUniqueInput[]
    update?: BookPiLedgerUpdateWithWhereUniqueWithoutTenantInput | BookPiLedgerUpdateWithWhereUniqueWithoutTenantInput[]
    updateMany?: BookPiLedgerUpdateManyWithWhereWithoutTenantInput | BookPiLedgerUpdateManyWithWhereWithoutTenantInput[]
    deleteMany?: BookPiLedgerScalarWhereInput | BookPiLedgerScalarWhereInput[]
  }

  export type TenantCreateNestedOneWithoutUsersInput = {
    create?: XOR<TenantCreateWithoutUsersInput, TenantUncheckedCreateWithoutUsersInput>
    connectOrCreate?: TenantCreateOrConnectWithoutUsersInput
    connect?: TenantWhereUniqueInput
  }

  export type MonetizationAccountCreateNestedOneWithoutUserInput = {
    create?: XOR<MonetizationAccountCreateWithoutUserInput, MonetizationAccountUncheckedCreateWithoutUserInput>
    connectOrCreate?: MonetizationAccountCreateOrConnectWithoutUserInput
    connect?: MonetizationAccountWhereUniqueInput
  }

  export type MonetizationAccountUncheckedCreateNestedOneWithoutUserInput = {
    create?: XOR<MonetizationAccountCreateWithoutUserInput, MonetizationAccountUncheckedCreateWithoutUserInput>
    connectOrCreate?: MonetizationAccountCreateOrConnectWithoutUserInput
    connect?: MonetizationAccountWhereUniqueInput
  }

  export type NullableStringFieldUpdateOperationsInput = {
    set?: string | null
  }

  export type TenantUpdateOneRequiredWithoutUsersNestedInput = {
    create?: XOR<TenantCreateWithoutUsersInput, TenantUncheckedCreateWithoutUsersInput>
    connectOrCreate?: TenantCreateOrConnectWithoutUsersInput
    upsert?: TenantUpsertWithoutUsersInput
    connect?: TenantWhereUniqueInput
    update?: XOR<XOR<TenantUpdateToOneWithWhereWithoutUsersInput, TenantUpdateWithoutUsersInput>, TenantUncheckedUpdateWithoutUsersInput>
  }

  export type MonetizationAccountUpdateOneWithoutUserNestedInput = {
    create?: XOR<MonetizationAccountCreateWithoutUserInput, MonetizationAccountUncheckedCreateWithoutUserInput>
    connectOrCreate?: MonetizationAccountCreateOrConnectWithoutUserInput
    upsert?: MonetizationAccountUpsertWithoutUserInput
    disconnect?: MonetizationAccountWhereInput | boolean
    delete?: MonetizationAccountWhereInput | boolean
    connect?: MonetizationAccountWhereUniqueInput
    update?: XOR<XOR<MonetizationAccountUpdateToOneWithWhereWithoutUserInput, MonetizationAccountUpdateWithoutUserInput>, MonetizationAccountUncheckedUpdateWithoutUserInput>
  }

  export type MonetizationAccountUncheckedUpdateOneWithoutUserNestedInput = {
    create?: XOR<MonetizationAccountCreateWithoutUserInput, MonetizationAccountUncheckedCreateWithoutUserInput>
    connectOrCreate?: MonetizationAccountCreateOrConnectWithoutUserInput
    upsert?: MonetizationAccountUpsertWithoutUserInput
    disconnect?: MonetizationAccountWhereInput | boolean
    delete?: MonetizationAccountWhereInput | boolean
    connect?: MonetizationAccountWhereUniqueInput
    update?: XOR<XOR<MonetizationAccountUpdateToOneWithWhereWithoutUserInput, MonetizationAccountUpdateWithoutUserInput>, MonetizationAccountUncheckedUpdateWithoutUserInput>
  }

  export type UserCreateNestedOneWithoutMonetizationInput = {
    create?: XOR<UserCreateWithoutMonetizationInput, UserUncheckedCreateWithoutMonetizationInput>
    connectOrCreate?: UserCreateOrConnectWithoutMonetizationInput
    connect?: UserWhereUniqueInput
  }

  export type IntFieldUpdateOperationsInput = {
    set?: number
    increment?: number
    decrement?: number
    multiply?: number
    divide?: number
  }

  export type BoolFieldUpdateOperationsInput = {
    set?: boolean
  }

  export type UserUpdateOneRequiredWithoutMonetizationNestedInput = {
    create?: XOR<UserCreateWithoutMonetizationInput, UserUncheckedCreateWithoutMonetizationInput>
    connectOrCreate?: UserCreateOrConnectWithoutMonetizationInput
    upsert?: UserUpsertWithoutMonetizationInput
    connect?: UserWhereUniqueInput
    update?: XOR<XOR<UserUpdateToOneWithWhereWithoutMonetizationInput, UserUpdateWithoutMonetizationInput>, UserUncheckedUpdateWithoutMonetizationInput>
  }

  export type TenantCreateNestedOneWithoutBookPiInput = {
    create?: XOR<TenantCreateWithoutBookPiInput, TenantUncheckedCreateWithoutBookPiInput>
    connectOrCreate?: TenantCreateOrConnectWithoutBookPiInput
    connect?: TenantWhereUniqueInput
  }

  export type TenantUpdateOneRequiredWithoutBookPiNestedInput = {
    create?: XOR<TenantCreateWithoutBookPiInput, TenantUncheckedCreateWithoutBookPiInput>
    connectOrCreate?: TenantCreateOrConnectWithoutBookPiInput
    upsert?: TenantUpsertWithoutBookPiInput
    connect?: TenantWhereUniqueInput
    update?: XOR<XOR<TenantUpdateToOneWithWhereWithoutBookPiInput, TenantUpdateWithoutBookPiInput>, TenantUncheckedUpdateWithoutBookPiInput>
  }

  export type NestedStringFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel>
    in?: string[] | ListStringFieldRefInput<$PrismaModel>
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel>
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    not?: NestedStringFilter<$PrismaModel> | string
  }

  export type NestedDateTimeFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeFilter<$PrismaModel> | Date | string
  }

  export type NestedStringWithAggregatesFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel>
    in?: string[] | ListStringFieldRefInput<$PrismaModel>
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel>
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    not?: NestedStringWithAggregatesFilter<$PrismaModel> | string
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedStringFilter<$PrismaModel>
    _max?: NestedStringFilter<$PrismaModel>
  }

  export type NestedIntFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel>
    in?: number[] | ListIntFieldRefInput<$PrismaModel>
    notIn?: number[] | ListIntFieldRefInput<$PrismaModel>
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntFilter<$PrismaModel> | number
  }

  export type NestedDateTimeWithAggregatesFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeWithAggregatesFilter<$PrismaModel> | Date | string
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedDateTimeFilter<$PrismaModel>
    _max?: NestedDateTimeFilter<$PrismaModel>
  }

  export type NestedStringNullableFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel> | null
    in?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    not?: NestedStringNullableFilter<$PrismaModel> | string | null
  }

  export type NestedStringNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel> | null
    in?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    not?: NestedStringNullableWithAggregatesFilter<$PrismaModel> | string | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedStringNullableFilter<$PrismaModel>
    _max?: NestedStringNullableFilter<$PrismaModel>
  }

  export type NestedIntNullableFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel> | null
    in?: number[] | ListIntFieldRefInput<$PrismaModel> | null
    notIn?: number[] | ListIntFieldRefInput<$PrismaModel> | null
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntNullableFilter<$PrismaModel> | number | null
  }

  export type NestedBoolFilter<$PrismaModel = never> = {
    equals?: boolean | BooleanFieldRefInput<$PrismaModel>
    not?: NestedBoolFilter<$PrismaModel> | boolean
  }

  export type NestedIntWithAggregatesFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel>
    in?: number[] | ListIntFieldRefInput<$PrismaModel>
    notIn?: number[] | ListIntFieldRefInput<$PrismaModel>
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntWithAggregatesFilter<$PrismaModel> | number
    _count?: NestedIntFilter<$PrismaModel>
    _avg?: NestedFloatFilter<$PrismaModel>
    _sum?: NestedIntFilter<$PrismaModel>
    _min?: NestedIntFilter<$PrismaModel>
    _max?: NestedIntFilter<$PrismaModel>
  }

  export type NestedFloatFilter<$PrismaModel = never> = {
    equals?: number | FloatFieldRefInput<$PrismaModel>
    in?: number[] | ListFloatFieldRefInput<$PrismaModel>
    notIn?: number[] | ListFloatFieldRefInput<$PrismaModel>
    lt?: number | FloatFieldRefInput<$PrismaModel>
    lte?: number | FloatFieldRefInput<$PrismaModel>
    gt?: number | FloatFieldRefInput<$PrismaModel>
    gte?: number | FloatFieldRefInput<$PrismaModel>
    not?: NestedFloatFilter<$PrismaModel> | number
  }

  export type NestedBoolWithAggregatesFilter<$PrismaModel = never> = {
    equals?: boolean | BooleanFieldRefInput<$PrismaModel>
    not?: NestedBoolWithAggregatesFilter<$PrismaModel> | boolean
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedBoolFilter<$PrismaModel>
    _max?: NestedBoolFilter<$PrismaModel>
  }

  export type UserCreateWithoutTenantInput = {
    id?: string
    email: string
    name?: string | null
    createdAt?: Date | string
    monetization?: MonetizationAccountCreateNestedOneWithoutUserInput
  }

  export type UserUncheckedCreateWithoutTenantInput = {
    id?: string
    email: string
    name?: string | null
    createdAt?: Date | string
    monetization?: MonetizationAccountUncheckedCreateNestedOneWithoutUserInput
  }

  export type UserCreateOrConnectWithoutTenantInput = {
    where: UserWhereUniqueInput
    create: XOR<UserCreateWithoutTenantInput, UserUncheckedCreateWithoutTenantInput>
  }

  export type UserCreateManyTenantInputEnvelope = {
    data: UserCreateManyTenantInput | UserCreateManyTenantInput[]
    skipDuplicates?: boolean
  }

  export type BookPiLedgerCreateWithoutTenantInput = {
    id?: string
    index: number
    eventType: string
    amount: number
    idempotencyKey: string
    hash: string
    previousHash: string
    createdAt?: Date | string
  }

  export type BookPiLedgerUncheckedCreateWithoutTenantInput = {
    id?: string
    index: number
    eventType: string
    amount: number
    idempotencyKey: string
    hash: string
    previousHash: string
    createdAt?: Date | string
  }

  export type BookPiLedgerCreateOrConnectWithoutTenantInput = {
    where: BookPiLedgerWhereUniqueInput
    create: XOR<BookPiLedgerCreateWithoutTenantInput, BookPiLedgerUncheckedCreateWithoutTenantInput>
  }

  export type BookPiLedgerCreateManyTenantInputEnvelope = {
    data: BookPiLedgerCreateManyTenantInput | BookPiLedgerCreateManyTenantInput[]
    skipDuplicates?: boolean
  }

  export type UserUpsertWithWhereUniqueWithoutTenantInput = {
    where: UserWhereUniqueInput
    update: XOR<UserUpdateWithoutTenantInput, UserUncheckedUpdateWithoutTenantInput>
    create: XOR<UserCreateWithoutTenantInput, UserUncheckedCreateWithoutTenantInput>
  }

  export type UserUpdateWithWhereUniqueWithoutTenantInput = {
    where: UserWhereUniqueInput
    data: XOR<UserUpdateWithoutTenantInput, UserUncheckedUpdateWithoutTenantInput>
  }

  export type UserUpdateManyWithWhereWithoutTenantInput = {
    where: UserScalarWhereInput
    data: XOR<UserUpdateManyMutationInput, UserUncheckedUpdateManyWithoutTenantInput>
  }

  export type UserScalarWhereInput = {
    AND?: UserScalarWhereInput | UserScalarWhereInput[]
    OR?: UserScalarWhereInput[]
    NOT?: UserScalarWhereInput | UserScalarWhereInput[]
    id?: StringFilter<"User"> | string
    tenantId?: StringFilter<"User"> | string
    email?: StringFilter<"User"> | string
    name?: StringNullableFilter<"User"> | string | null
    createdAt?: DateTimeFilter<"User"> | Date | string
  }

  export type BookPiLedgerUpsertWithWhereUniqueWithoutTenantInput = {
    where: BookPiLedgerWhereUniqueInput
    update: XOR<BookPiLedgerUpdateWithoutTenantInput, BookPiLedgerUncheckedUpdateWithoutTenantInput>
    create: XOR<BookPiLedgerCreateWithoutTenantInput, BookPiLedgerUncheckedCreateWithoutTenantInput>
  }

  export type BookPiLedgerUpdateWithWhereUniqueWithoutTenantInput = {
    where: BookPiLedgerWhereUniqueInput
    data: XOR<BookPiLedgerUpdateWithoutTenantInput, BookPiLedgerUncheckedUpdateWithoutTenantInput>
  }

  export type BookPiLedgerUpdateManyWithWhereWithoutTenantInput = {
    where: BookPiLedgerScalarWhereInput
    data: XOR<BookPiLedgerUpdateManyMutationInput, BookPiLedgerUncheckedUpdateManyWithoutTenantInput>
  }

  export type BookPiLedgerScalarWhereInput = {
    AND?: BookPiLedgerScalarWhereInput | BookPiLedgerScalarWhereInput[]
    OR?: BookPiLedgerScalarWhereInput[]
    NOT?: BookPiLedgerScalarWhereInput | BookPiLedgerScalarWhereInput[]
    id?: StringFilter<"BookPiLedger"> | string
    tenantId?: StringFilter<"BookPiLedger"> | string
    index?: IntFilter<"BookPiLedger"> | number
    eventType?: StringFilter<"BookPiLedger"> | string
    amount?: IntFilter<"BookPiLedger"> | number
    idempotencyKey?: StringFilter<"BookPiLedger"> | string
    hash?: StringFilter<"BookPiLedger"> | string
    previousHash?: StringFilter<"BookPiLedger"> | string
    createdAt?: DateTimeFilter<"BookPiLedger"> | Date | string
  }

  export type TenantCreateWithoutUsersInput = {
    id?: string
    name: string
    createdAt?: Date | string
    bookPi?: BookPiLedgerCreateNestedManyWithoutTenantInput
  }

  export type TenantUncheckedCreateWithoutUsersInput = {
    id?: string
    name: string
    createdAt?: Date | string
    bookPi?: BookPiLedgerUncheckedCreateNestedManyWithoutTenantInput
  }

  export type TenantCreateOrConnectWithoutUsersInput = {
    where: TenantWhereUniqueInput
    create: XOR<TenantCreateWithoutUsersInput, TenantUncheckedCreateWithoutUsersInput>
  }

  export type MonetizationAccountCreateWithoutUserInput = {
    earnedBalanceCents?: number
    qualifiedUses?: number
    approvedContributions?: number
    trainingCompleted?: boolean
    identityVerified?: boolean
    paymentAccountVerified?: boolean
    profileComplete?: boolean
    sanctioned?: boolean
    underFraudReview?: boolean
  }

  export type MonetizationAccountUncheckedCreateWithoutUserInput = {
    earnedBalanceCents?: number
    qualifiedUses?: number
    approvedContributions?: number
    trainingCompleted?: boolean
    identityVerified?: boolean
    paymentAccountVerified?: boolean
    profileComplete?: boolean
    sanctioned?: boolean
    underFraudReview?: boolean
  }

  export type MonetizationAccountCreateOrConnectWithoutUserInput = {
    where: MonetizationAccountWhereUniqueInput
    create: XOR<MonetizationAccountCreateWithoutUserInput, MonetizationAccountUncheckedCreateWithoutUserInput>
  }

  export type TenantUpsertWithoutUsersInput = {
    update: XOR<TenantUpdateWithoutUsersInput, TenantUncheckedUpdateWithoutUsersInput>
    create: XOR<TenantCreateWithoutUsersInput, TenantUncheckedCreateWithoutUsersInput>
    where?: TenantWhereInput
  }

  export type TenantUpdateToOneWithWhereWithoutUsersInput = {
    where?: TenantWhereInput
    data: XOR<TenantUpdateWithoutUsersInput, TenantUncheckedUpdateWithoutUsersInput>
  }

  export type TenantUpdateWithoutUsersInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    bookPi?: BookPiLedgerUpdateManyWithoutTenantNestedInput
  }

  export type TenantUncheckedUpdateWithoutUsersInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    bookPi?: BookPiLedgerUncheckedUpdateManyWithoutTenantNestedInput
  }

  export type MonetizationAccountUpsertWithoutUserInput = {
    update: XOR<MonetizationAccountUpdateWithoutUserInput, MonetizationAccountUncheckedUpdateWithoutUserInput>
    create: XOR<MonetizationAccountCreateWithoutUserInput, MonetizationAccountUncheckedCreateWithoutUserInput>
    where?: MonetizationAccountWhereInput
  }

  export type MonetizationAccountUpdateToOneWithWhereWithoutUserInput = {
    where?: MonetizationAccountWhereInput
    data: XOR<MonetizationAccountUpdateWithoutUserInput, MonetizationAccountUncheckedUpdateWithoutUserInput>
  }

  export type MonetizationAccountUpdateWithoutUserInput = {
    earnedBalanceCents?: IntFieldUpdateOperationsInput | number
    qualifiedUses?: IntFieldUpdateOperationsInput | number
    approvedContributions?: IntFieldUpdateOperationsInput | number
    trainingCompleted?: BoolFieldUpdateOperationsInput | boolean
    identityVerified?: BoolFieldUpdateOperationsInput | boolean
    paymentAccountVerified?: BoolFieldUpdateOperationsInput | boolean
    profileComplete?: BoolFieldUpdateOperationsInput | boolean
    sanctioned?: BoolFieldUpdateOperationsInput | boolean
    underFraudReview?: BoolFieldUpdateOperationsInput | boolean
  }

  export type MonetizationAccountUncheckedUpdateWithoutUserInput = {
    earnedBalanceCents?: IntFieldUpdateOperationsInput | number
    qualifiedUses?: IntFieldUpdateOperationsInput | number
    approvedContributions?: IntFieldUpdateOperationsInput | number
    trainingCompleted?: BoolFieldUpdateOperationsInput | boolean
    identityVerified?: BoolFieldUpdateOperationsInput | boolean
    paymentAccountVerified?: BoolFieldUpdateOperationsInput | boolean
    profileComplete?: BoolFieldUpdateOperationsInput | boolean
    sanctioned?: BoolFieldUpdateOperationsInput | boolean
    underFraudReview?: BoolFieldUpdateOperationsInput | boolean
  }

  export type UserCreateWithoutMonetizationInput = {
    id?: string
    email: string
    name?: string | null
    createdAt?: Date | string
    tenant: TenantCreateNestedOneWithoutUsersInput
  }

  export type UserUncheckedCreateWithoutMonetizationInput = {
    id?: string
    tenantId: string
    email: string
    name?: string | null
    createdAt?: Date | string
  }

  export type UserCreateOrConnectWithoutMonetizationInput = {
    where: UserWhereUniqueInput
    create: XOR<UserCreateWithoutMonetizationInput, UserUncheckedCreateWithoutMonetizationInput>
  }

  export type UserUpsertWithoutMonetizationInput = {
    update: XOR<UserUpdateWithoutMonetizationInput, UserUncheckedUpdateWithoutMonetizationInput>
    create: XOR<UserCreateWithoutMonetizationInput, UserUncheckedCreateWithoutMonetizationInput>
    where?: UserWhereInput
  }

  export type UserUpdateToOneWithWhereWithoutMonetizationInput = {
    where?: UserWhereInput
    data: XOR<UserUpdateWithoutMonetizationInput, UserUncheckedUpdateWithoutMonetizationInput>
  }

  export type UserUpdateWithoutMonetizationInput = {
    id?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    name?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    tenant?: TenantUpdateOneRequiredWithoutUsersNestedInput
  }

  export type UserUncheckedUpdateWithoutMonetizationInput = {
    id?: StringFieldUpdateOperationsInput | string
    tenantId?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    name?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type TenantCreateWithoutBookPiInput = {
    id?: string
    name: string
    createdAt?: Date | string
    users?: UserCreateNestedManyWithoutTenantInput
  }

  export type TenantUncheckedCreateWithoutBookPiInput = {
    id?: string
    name: string
    createdAt?: Date | string
    users?: UserUncheckedCreateNestedManyWithoutTenantInput
  }

  export type TenantCreateOrConnectWithoutBookPiInput = {
    where: TenantWhereUniqueInput
    create: XOR<TenantCreateWithoutBookPiInput, TenantUncheckedCreateWithoutBookPiInput>
  }

  export type TenantUpsertWithoutBookPiInput = {
    update: XOR<TenantUpdateWithoutBookPiInput, TenantUncheckedUpdateWithoutBookPiInput>
    create: XOR<TenantCreateWithoutBookPiInput, TenantUncheckedCreateWithoutBookPiInput>
    where?: TenantWhereInput
  }

  export type TenantUpdateToOneWithWhereWithoutBookPiInput = {
    where?: TenantWhereInput
    data: XOR<TenantUpdateWithoutBookPiInput, TenantUncheckedUpdateWithoutBookPiInput>
  }

  export type TenantUpdateWithoutBookPiInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    users?: UserUpdateManyWithoutTenantNestedInput
  }

  export type TenantUncheckedUpdateWithoutBookPiInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    users?: UserUncheckedUpdateManyWithoutTenantNestedInput
  }

  export type UserCreateManyTenantInput = {
    id?: string
    email: string
    name?: string | null
    createdAt?: Date | string
  }

  export type BookPiLedgerCreateManyTenantInput = {
    id?: string
    index: number
    eventType: string
    amount: number
    idempotencyKey: string
    hash: string
    previousHash: string
    createdAt?: Date | string
  }

  export type UserUpdateWithoutTenantInput = {
    id?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    name?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    monetization?: MonetizationAccountUpdateOneWithoutUserNestedInput
  }

  export type UserUncheckedUpdateWithoutTenantInput = {
    id?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    name?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    monetization?: MonetizationAccountUncheckedUpdateOneWithoutUserNestedInput
  }

  export type UserUncheckedUpdateManyWithoutTenantInput = {
    id?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    name?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type BookPiLedgerUpdateWithoutTenantInput = {
    id?: StringFieldUpdateOperationsInput | string
    index?: IntFieldUpdateOperationsInput | number
    eventType?: StringFieldUpdateOperationsInput | string
    amount?: IntFieldUpdateOperationsInput | number
    idempotencyKey?: StringFieldUpdateOperationsInput | string
    hash?: StringFieldUpdateOperationsInput | string
    previousHash?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type BookPiLedgerUncheckedUpdateWithoutTenantInput = {
    id?: StringFieldUpdateOperationsInput | string
    index?: IntFieldUpdateOperationsInput | number
    eventType?: StringFieldUpdateOperationsInput | string
    amount?: IntFieldUpdateOperationsInput | number
    idempotencyKey?: StringFieldUpdateOperationsInput | string
    hash?: StringFieldUpdateOperationsInput | string
    previousHash?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type BookPiLedgerUncheckedUpdateManyWithoutTenantInput = {
    id?: StringFieldUpdateOperationsInput | string
    index?: IntFieldUpdateOperationsInput | number
    eventType?: StringFieldUpdateOperationsInput | string
    amount?: IntFieldUpdateOperationsInput | number
    idempotencyKey?: StringFieldUpdateOperationsInput | string
    hash?: StringFieldUpdateOperationsInput | string
    previousHash?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }



  /**
   * Aliases for legacy arg types
   */
    /**
     * @deprecated Use TenantCountOutputTypeDefaultArgs instead
     */
    export type TenantCountOutputTypeArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = TenantCountOutputTypeDefaultArgs<ExtArgs>
    /**
     * @deprecated Use TenantDefaultArgs instead
     */
    export type TenantArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = TenantDefaultArgs<ExtArgs>
    /**
     * @deprecated Use UserDefaultArgs instead
     */
    export type UserArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = UserDefaultArgs<ExtArgs>
    /**
     * @deprecated Use MonetizationAccountDefaultArgs instead
     */
    export type MonetizationAccountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = MonetizationAccountDefaultArgs<ExtArgs>
    /**
     * @deprecated Use BookPiLedgerDefaultArgs instead
     */
    export type BookPiLedgerArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = BookPiLedgerDefaultArgs<ExtArgs>

  /**
   * Batch Payload for updateMany & deleteMany & createMany
   */

  export type BatchPayload = {
    count: number
  }

  /**
   * DMMF
   */
  export const dmmf: runtime.BaseDMMF
}