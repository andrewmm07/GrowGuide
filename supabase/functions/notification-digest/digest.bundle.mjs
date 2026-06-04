var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __esm = (fn, res) => function __init() {
  return fn && (res = (0, fn[__getOwnPropNames(fn)[0]])(fn = 0)), res;
};
var __commonJS = (cb, mod) => function __require() {
  return mod || (0, cb[__getOwnPropNames(cb)[0]])((mod = { exports: {} }).exports, mod), mod.exports;
};
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
  // If the importer is in node compatibility mode or this is not an ESM
  // file that has been converted to a CommonJS file using a Babel-
  // compatible transform (i.e. "__esModule" has not been set), then set
  // "default" to the CommonJS "module.exports" for node compatibility.
  isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
  mod
));
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

// node_modules/@supabase/node-fetch/browser.js
var browser_exports = {};
__export(browser_exports, {
  Headers: () => Headers2,
  Request: () => Request,
  Response: () => Response2,
  default: () => browser_default,
  fetch: () => fetch2
});
var getGlobal, globalObject, fetch2, browser_default, Headers2, Request, Response2;
var init_browser = __esm({
  "node_modules/@supabase/node-fetch/browser.js"() {
    "use strict";
    getGlobal = function() {
      if (typeof self !== "undefined") {
        return self;
      }
      if (typeof window !== "undefined") {
        return window;
      }
      if (typeof global !== "undefined") {
        return global;
      }
      throw new Error("unable to locate global object");
    };
    globalObject = getGlobal();
    fetch2 = globalObject.fetch;
    browser_default = globalObject.fetch.bind(globalObject);
    Headers2 = globalObject.Headers;
    Request = globalObject.Request;
    Response2 = globalObject.Response;
  }
});

// node_modules/@supabase/postgrest-js/dist/cjs/PostgrestError.js
var require_PostgrestError = __commonJS({
  "node_modules/@supabase/postgrest-js/dist/cjs/PostgrestError.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var PostgrestError2 = class extends Error {
      constructor(context) {
        super(context.message);
        this.name = "PostgrestError";
        this.details = context.details;
        this.hint = context.hint;
        this.code = context.code;
      }
    };
    exports.default = PostgrestError2;
  }
});

// node_modules/@supabase/postgrest-js/dist/cjs/PostgrestBuilder.js
var require_PostgrestBuilder = __commonJS({
  "node_modules/@supabase/postgrest-js/dist/cjs/PostgrestBuilder.js"(exports) {
    "use strict";
    var __importDefault = exports && exports.__importDefault || function(mod) {
      return mod && mod.__esModule ? mod : { "default": mod };
    };
    Object.defineProperty(exports, "__esModule", { value: true });
    var node_fetch_1 = __importDefault((init_browser(), __toCommonJS(browser_exports)));
    var PostgrestError_1 = __importDefault(require_PostgrestError());
    var PostgrestBuilder2 = class {
      constructor(builder) {
        this.shouldThrowOnError = false;
        this.method = builder.method;
        this.url = builder.url;
        this.headers = builder.headers;
        this.schema = builder.schema;
        this.body = builder.body;
        this.shouldThrowOnError = builder.shouldThrowOnError;
        this.signal = builder.signal;
        this.isMaybeSingle = builder.isMaybeSingle;
        if (builder.fetch) {
          this.fetch = builder.fetch;
        } else if (typeof fetch === "undefined") {
          this.fetch = node_fetch_1.default;
        } else {
          this.fetch = fetch;
        }
      }
      /**
       * If there's an error with the query, throwOnError will reject the promise by
       * throwing the error instead of returning it as part of a successful response.
       *
       * {@link https://github.com/supabase/supabase-js/issues/92}
       */
      throwOnError() {
        this.shouldThrowOnError = true;
        return this;
      }
      /**
       * Set an HTTP header for the request.
       */
      setHeader(name, value) {
        this.headers = Object.assign({}, this.headers);
        this.headers[name] = value;
        return this;
      }
      then(onfulfilled, onrejected) {
        if (this.schema === void 0) {
        } else if (["GET", "HEAD"].includes(this.method)) {
          this.headers["Accept-Profile"] = this.schema;
        } else {
          this.headers["Content-Profile"] = this.schema;
        }
        if (this.method !== "GET" && this.method !== "HEAD") {
          this.headers["Content-Type"] = "application/json";
        }
        const _fetch = this.fetch;
        let res = _fetch(this.url.toString(), {
          method: this.method,
          headers: this.headers,
          body: JSON.stringify(this.body),
          signal: this.signal
        }).then(async (res2) => {
          var _a, _b, _c;
          let error = null;
          let data = null;
          let count = null;
          let status = res2.status;
          let statusText = res2.statusText;
          if (res2.ok) {
            if (this.method !== "HEAD") {
              const body = await res2.text();
              if (body === "") {
              } else if (this.headers["Accept"] === "text/csv") {
                data = body;
              } else if (this.headers["Accept"] && this.headers["Accept"].includes("application/vnd.pgrst.plan+text")) {
                data = body;
              } else {
                data = JSON.parse(body);
              }
            }
            const countHeader = (_a = this.headers["Prefer"]) === null || _a === void 0 ? void 0 : _a.match(/count=(exact|planned|estimated)/);
            const contentRange = (_b = res2.headers.get("content-range")) === null || _b === void 0 ? void 0 : _b.split("/");
            if (countHeader && contentRange && contentRange.length > 1) {
              count = parseInt(contentRange[1]);
            }
            if (this.isMaybeSingle && this.method === "GET" && Array.isArray(data)) {
              if (data.length > 1) {
                error = {
                  // https://github.com/PostgREST/postgrest/blob/a867d79c42419af16c18c3fb019eba8df992626f/src/PostgREST/Error.hs#L553
                  code: "PGRST116",
                  details: `Results contain ${data.length} rows, application/vnd.pgrst.object+json requires 1 row`,
                  hint: null,
                  message: "JSON object requested, multiple (or no) rows returned"
                };
                data = null;
                count = null;
                status = 406;
                statusText = "Not Acceptable";
              } else if (data.length === 1) {
                data = data[0];
              } else {
                data = null;
              }
            }
          } else {
            const body = await res2.text();
            try {
              error = JSON.parse(body);
              if (Array.isArray(error) && res2.status === 404) {
                data = [];
                error = null;
                status = 200;
                statusText = "OK";
              }
            } catch (_d) {
              if (res2.status === 404 && body === "") {
                status = 204;
                statusText = "No Content";
              } else {
                error = {
                  message: body
                };
              }
            }
            if (error && this.isMaybeSingle && ((_c = error === null || error === void 0 ? void 0 : error.details) === null || _c === void 0 ? void 0 : _c.includes("0 rows"))) {
              error = null;
              status = 200;
              statusText = "OK";
            }
            if (error && this.shouldThrowOnError) {
              throw new PostgrestError_1.default(error);
            }
          }
          const postgrestResponse = {
            error,
            data,
            count,
            status,
            statusText
          };
          return postgrestResponse;
        });
        if (!this.shouldThrowOnError) {
          res = res.catch((fetchError) => {
            var _a, _b, _c;
            return {
              error: {
                message: `${(_a = fetchError === null || fetchError === void 0 ? void 0 : fetchError.name) !== null && _a !== void 0 ? _a : "FetchError"}: ${fetchError === null || fetchError === void 0 ? void 0 : fetchError.message}`,
                details: `${(_b = fetchError === null || fetchError === void 0 ? void 0 : fetchError.stack) !== null && _b !== void 0 ? _b : ""}`,
                hint: "",
                code: `${(_c = fetchError === null || fetchError === void 0 ? void 0 : fetchError.code) !== null && _c !== void 0 ? _c : ""}`
              },
              data: null,
              count: null,
              status: 0,
              statusText: ""
            };
          });
        }
        return res.then(onfulfilled, onrejected);
      }
      /**
       * Override the type of the returned `data`.
       *
       * @typeParam NewResult - The new result type to override with
       * @deprecated Use overrideTypes<yourType, { merge: false }>() method at the end of your call chain instead
       */
      returns() {
        return this;
      }
      /**
       * Override the type of the returned `data` field in the response.
       *
       * @typeParam NewResult - The new type to cast the response data to
       * @typeParam Options - Optional type configuration (defaults to { merge: true })
       * @typeParam Options.merge - When true, merges the new type with existing return type. When false, replaces the existing types entirely (defaults to true)
       * @example
       * ```typescript
       * // Merge with existing types (default behavior)
       * const query = supabase
       *   .from('users')
       *   .select()
       *   .overrideTypes<{ custom_field: string }>()
       *
       * // Replace existing types completely
       * const replaceQuery = supabase
       *   .from('users')
       *   .select()
       *   .overrideTypes<{ id: number; name: string }, { merge: false }>()
       * ```
       * @returns A PostgrestBuilder instance with the new type
       */
      overrideTypes() {
        return this;
      }
    };
    exports.default = PostgrestBuilder2;
  }
});

// node_modules/@supabase/postgrest-js/dist/cjs/PostgrestTransformBuilder.js
var require_PostgrestTransformBuilder = __commonJS({
  "node_modules/@supabase/postgrest-js/dist/cjs/PostgrestTransformBuilder.js"(exports) {
    "use strict";
    var __importDefault = exports && exports.__importDefault || function(mod) {
      return mod && mod.__esModule ? mod : { "default": mod };
    };
    Object.defineProperty(exports, "__esModule", { value: true });
    var PostgrestBuilder_1 = __importDefault(require_PostgrestBuilder());
    var PostgrestTransformBuilder2 = class extends PostgrestBuilder_1.default {
      /**
       * Perform a SELECT on the query result.
       *
       * By default, `.insert()`, `.update()`, `.upsert()`, and `.delete()` do not
       * return modified rows. By calling this method, modified rows are returned in
       * `data`.
       *
       * @param columns - The columns to retrieve, separated by commas
       */
      select(columns) {
        let quoted = false;
        const cleanedColumns = (columns !== null && columns !== void 0 ? columns : "*").split("").map((c) => {
          if (/\s/.test(c) && !quoted) {
            return "";
          }
          if (c === '"') {
            quoted = !quoted;
          }
          return c;
        }).join("");
        this.url.searchParams.set("select", cleanedColumns);
        if (this.headers["Prefer"]) {
          this.headers["Prefer"] += ",";
        }
        this.headers["Prefer"] += "return=representation";
        return this;
      }
      /**
       * Order the query result by `column`.
       *
       * You can call this method multiple times to order by multiple columns.
       *
       * You can order referenced tables, but it only affects the ordering of the
       * parent table if you use `!inner` in the query.
       *
       * @param column - The column to order by
       * @param options - Named parameters
       * @param options.ascending - If `true`, the result will be in ascending order
       * @param options.nullsFirst - If `true`, `null`s appear first. If `false`,
       * `null`s appear last.
       * @param options.referencedTable - Set this to order a referenced table by
       * its columns
       * @param options.foreignTable - Deprecated, use `options.referencedTable`
       * instead
       */
      order(column, { ascending = true, nullsFirst, foreignTable, referencedTable = foreignTable } = {}) {
        const key = referencedTable ? `${referencedTable}.order` : "order";
        const existingOrder = this.url.searchParams.get(key);
        this.url.searchParams.set(key, `${existingOrder ? `${existingOrder},` : ""}${column}.${ascending ? "asc" : "desc"}${nullsFirst === void 0 ? "" : nullsFirst ? ".nullsfirst" : ".nullslast"}`);
        return this;
      }
      /**
       * Limit the query result by `count`.
       *
       * @param count - The maximum number of rows to return
       * @param options - Named parameters
       * @param options.referencedTable - Set this to limit rows of referenced
       * tables instead of the parent table
       * @param options.foreignTable - Deprecated, use `options.referencedTable`
       * instead
       */
      limit(count, { foreignTable, referencedTable = foreignTable } = {}) {
        const key = typeof referencedTable === "undefined" ? "limit" : `${referencedTable}.limit`;
        this.url.searchParams.set(key, `${count}`);
        return this;
      }
      /**
       * Limit the query result by starting at an offset `from` and ending at the offset `to`.
       * Only records within this range are returned.
       * This respects the query order and if there is no order clause the range could behave unexpectedly.
       * The `from` and `to` values are 0-based and inclusive: `range(1, 3)` will include the second, third
       * and fourth rows of the query.
       *
       * @param from - The starting index from which to limit the result
       * @param to - The last index to which to limit the result
       * @param options - Named parameters
       * @param options.referencedTable - Set this to limit rows of referenced
       * tables instead of the parent table
       * @param options.foreignTable - Deprecated, use `options.referencedTable`
       * instead
       */
      range(from, to, { foreignTable, referencedTable = foreignTable } = {}) {
        const keyOffset = typeof referencedTable === "undefined" ? "offset" : `${referencedTable}.offset`;
        const keyLimit = typeof referencedTable === "undefined" ? "limit" : `${referencedTable}.limit`;
        this.url.searchParams.set(keyOffset, `${from}`);
        this.url.searchParams.set(keyLimit, `${to - from + 1}`);
        return this;
      }
      /**
       * Set the AbortSignal for the fetch request.
       *
       * @param signal - The AbortSignal to use for the fetch request
       */
      abortSignal(signal) {
        this.signal = signal;
        return this;
      }
      /**
       * Return `data` as a single object instead of an array of objects.
       *
       * Query result must be one row (e.g. using `.limit(1)`), otherwise this
       * returns an error.
       */
      single() {
        this.headers["Accept"] = "application/vnd.pgrst.object+json";
        return this;
      }
      /**
       * Return `data` as a single object instead of an array of objects.
       *
       * Query result must be zero or one row (e.g. using `.limit(1)`), otherwise
       * this returns an error.
       */
      maybeSingle() {
        if (this.method === "GET") {
          this.headers["Accept"] = "application/json";
        } else {
          this.headers["Accept"] = "application/vnd.pgrst.object+json";
        }
        this.isMaybeSingle = true;
        return this;
      }
      /**
       * Return `data` as a string in CSV format.
       */
      csv() {
        this.headers["Accept"] = "text/csv";
        return this;
      }
      /**
       * Return `data` as an object in [GeoJSON](https://geojson.org) format.
       */
      geojson() {
        this.headers["Accept"] = "application/geo+json";
        return this;
      }
      /**
       * Return `data` as the EXPLAIN plan for the query.
       *
       * You need to enable the
       * [db_plan_enabled](https://supabase.com/docs/guides/database/debugging-performance#enabling-explain)
       * setting before using this method.
       *
       * @param options - Named parameters
       *
       * @param options.analyze - If `true`, the query will be executed and the
       * actual run time will be returned
       *
       * @param options.verbose - If `true`, the query identifier will be returned
       * and `data` will include the output columns of the query
       *
       * @param options.settings - If `true`, include information on configuration
       * parameters that affect query planning
       *
       * @param options.buffers - If `true`, include information on buffer usage
       *
       * @param options.wal - If `true`, include information on WAL record generation
       *
       * @param options.format - The format of the output, can be `"text"` (default)
       * or `"json"`
       */
      explain({ analyze = false, verbose = false, settings = false, buffers = false, wal = false, format = "text" } = {}) {
        var _a;
        const options = [
          analyze ? "analyze" : null,
          verbose ? "verbose" : null,
          settings ? "settings" : null,
          buffers ? "buffers" : null,
          wal ? "wal" : null
        ].filter(Boolean).join("|");
        const forMediatype = (_a = this.headers["Accept"]) !== null && _a !== void 0 ? _a : "application/json";
        this.headers["Accept"] = `application/vnd.pgrst.plan+${format}; for="${forMediatype}"; options=${options};`;
        if (format === "json")
          return this;
        else
          return this;
      }
      /**
       * Rollback the query.
       *
       * `data` will still be returned, but the query is not committed.
       */
      rollback() {
        var _a;
        if (((_a = this.headers["Prefer"]) !== null && _a !== void 0 ? _a : "").trim().length > 0) {
          this.headers["Prefer"] += ",tx=rollback";
        } else {
          this.headers["Prefer"] = "tx=rollback";
        }
        return this;
      }
      /**
       * Override the type of the returned `data`.
       *
       * @typeParam NewResult - The new result type to override with
       * @deprecated Use overrideTypes<yourType, { merge: false }>() method at the end of your call chain instead
       */
      returns() {
        return this;
      }
    };
    exports.default = PostgrestTransformBuilder2;
  }
});

// node_modules/@supabase/postgrest-js/dist/cjs/PostgrestFilterBuilder.js
var require_PostgrestFilterBuilder = __commonJS({
  "node_modules/@supabase/postgrest-js/dist/cjs/PostgrestFilterBuilder.js"(exports) {
    "use strict";
    var __importDefault = exports && exports.__importDefault || function(mod) {
      return mod && mod.__esModule ? mod : { "default": mod };
    };
    Object.defineProperty(exports, "__esModule", { value: true });
    var PostgrestTransformBuilder_1 = __importDefault(require_PostgrestTransformBuilder());
    var PostgrestFilterBuilder2 = class extends PostgrestTransformBuilder_1.default {
      /**
       * Match only rows where `column` is equal to `value`.
       *
       * To check if the value of `column` is NULL, you should use `.is()` instead.
       *
       * @param column - The column to filter on
       * @param value - The value to filter with
       */
      eq(column, value) {
        this.url.searchParams.append(column, `eq.${value}`);
        return this;
      }
      /**
       * Match only rows where `column` is not equal to `value`.
       *
       * @param column - The column to filter on
       * @param value - The value to filter with
       */
      neq(column, value) {
        this.url.searchParams.append(column, `neq.${value}`);
        return this;
      }
      /**
       * Match only rows where `column` is greater than `value`.
       *
       * @param column - The column to filter on
       * @param value - The value to filter with
       */
      gt(column, value) {
        this.url.searchParams.append(column, `gt.${value}`);
        return this;
      }
      /**
       * Match only rows where `column` is greater than or equal to `value`.
       *
       * @param column - The column to filter on
       * @param value - The value to filter with
       */
      gte(column, value) {
        this.url.searchParams.append(column, `gte.${value}`);
        return this;
      }
      /**
       * Match only rows where `column` is less than `value`.
       *
       * @param column - The column to filter on
       * @param value - The value to filter with
       */
      lt(column, value) {
        this.url.searchParams.append(column, `lt.${value}`);
        return this;
      }
      /**
       * Match only rows where `column` is less than or equal to `value`.
       *
       * @param column - The column to filter on
       * @param value - The value to filter with
       */
      lte(column, value) {
        this.url.searchParams.append(column, `lte.${value}`);
        return this;
      }
      /**
       * Match only rows where `column` matches `pattern` case-sensitively.
       *
       * @param column - The column to filter on
       * @param pattern - The pattern to match with
       */
      like(column, pattern) {
        this.url.searchParams.append(column, `like.${pattern}`);
        return this;
      }
      /**
       * Match only rows where `column` matches all of `patterns` case-sensitively.
       *
       * @param column - The column to filter on
       * @param patterns - The patterns to match with
       */
      likeAllOf(column, patterns) {
        this.url.searchParams.append(column, `like(all).{${patterns.join(",")}}`);
        return this;
      }
      /**
       * Match only rows where `column` matches any of `patterns` case-sensitively.
       *
       * @param column - The column to filter on
       * @param patterns - The patterns to match with
       */
      likeAnyOf(column, patterns) {
        this.url.searchParams.append(column, `like(any).{${patterns.join(",")}}`);
        return this;
      }
      /**
       * Match only rows where `column` matches `pattern` case-insensitively.
       *
       * @param column - The column to filter on
       * @param pattern - The pattern to match with
       */
      ilike(column, pattern) {
        this.url.searchParams.append(column, `ilike.${pattern}`);
        return this;
      }
      /**
       * Match only rows where `column` matches all of `patterns` case-insensitively.
       *
       * @param column - The column to filter on
       * @param patterns - The patterns to match with
       */
      ilikeAllOf(column, patterns) {
        this.url.searchParams.append(column, `ilike(all).{${patterns.join(",")}}`);
        return this;
      }
      /**
       * Match only rows where `column` matches any of `patterns` case-insensitively.
       *
       * @param column - The column to filter on
       * @param patterns - The patterns to match with
       */
      ilikeAnyOf(column, patterns) {
        this.url.searchParams.append(column, `ilike(any).{${patterns.join(",")}}`);
        return this;
      }
      /**
       * Match only rows where `column` IS `value`.
       *
       * For non-boolean columns, this is only relevant for checking if the value of
       * `column` is NULL by setting `value` to `null`.
       *
       * For boolean columns, you can also set `value` to `true` or `false` and it
       * will behave the same way as `.eq()`.
       *
       * @param column - The column to filter on
       * @param value - The value to filter with
       */
      is(column, value) {
        this.url.searchParams.append(column, `is.${value}`);
        return this;
      }
      /**
       * Match only rows where `column` is included in the `values` array.
       *
       * @param column - The column to filter on
       * @param values - The values array to filter with
       */
      in(column, values) {
        const cleanedValues = Array.from(new Set(values)).map((s) => {
          if (typeof s === "string" && new RegExp("[,()]").test(s))
            return `"${s}"`;
          else
            return `${s}`;
        }).join(",");
        this.url.searchParams.append(column, `in.(${cleanedValues})`);
        return this;
      }
      /**
       * Only relevant for jsonb, array, and range columns. Match only rows where
       * `column` contains every element appearing in `value`.
       *
       * @param column - The jsonb, array, or range column to filter on
       * @param value - The jsonb, array, or range value to filter with
       */
      contains(column, value) {
        if (typeof value === "string") {
          this.url.searchParams.append(column, `cs.${value}`);
        } else if (Array.isArray(value)) {
          this.url.searchParams.append(column, `cs.{${value.join(",")}}`);
        } else {
          this.url.searchParams.append(column, `cs.${JSON.stringify(value)}`);
        }
        return this;
      }
      /**
       * Only relevant for jsonb, array, and range columns. Match only rows where
       * every element appearing in `column` is contained by `value`.
       *
       * @param column - The jsonb, array, or range column to filter on
       * @param value - The jsonb, array, or range value to filter with
       */
      containedBy(column, value) {
        if (typeof value === "string") {
          this.url.searchParams.append(column, `cd.${value}`);
        } else if (Array.isArray(value)) {
          this.url.searchParams.append(column, `cd.{${value.join(",")}}`);
        } else {
          this.url.searchParams.append(column, `cd.${JSON.stringify(value)}`);
        }
        return this;
      }
      /**
       * Only relevant for range columns. Match only rows where every element in
       * `column` is greater than any element in `range`.
       *
       * @param column - The range column to filter on
       * @param range - The range to filter with
       */
      rangeGt(column, range) {
        this.url.searchParams.append(column, `sr.${range}`);
        return this;
      }
      /**
       * Only relevant for range columns. Match only rows where every element in
       * `column` is either contained in `range` or greater than any element in
       * `range`.
       *
       * @param column - The range column to filter on
       * @param range - The range to filter with
       */
      rangeGte(column, range) {
        this.url.searchParams.append(column, `nxl.${range}`);
        return this;
      }
      /**
       * Only relevant for range columns. Match only rows where every element in
       * `column` is less than any element in `range`.
       *
       * @param column - The range column to filter on
       * @param range - The range to filter with
       */
      rangeLt(column, range) {
        this.url.searchParams.append(column, `sl.${range}`);
        return this;
      }
      /**
       * Only relevant for range columns. Match only rows where every element in
       * `column` is either contained in `range` or less than any element in
       * `range`.
       *
       * @param column - The range column to filter on
       * @param range - The range to filter with
       */
      rangeLte(column, range) {
        this.url.searchParams.append(column, `nxr.${range}`);
        return this;
      }
      /**
       * Only relevant for range columns. Match only rows where `column` is
       * mutually exclusive to `range` and there can be no element between the two
       * ranges.
       *
       * @param column - The range column to filter on
       * @param range - The range to filter with
       */
      rangeAdjacent(column, range) {
        this.url.searchParams.append(column, `adj.${range}`);
        return this;
      }
      /**
       * Only relevant for array and range columns. Match only rows where
       * `column` and `value` have an element in common.
       *
       * @param column - The array or range column to filter on
       * @param value - The array or range value to filter with
       */
      overlaps(column, value) {
        if (typeof value === "string") {
          this.url.searchParams.append(column, `ov.${value}`);
        } else {
          this.url.searchParams.append(column, `ov.{${value.join(",")}}`);
        }
        return this;
      }
      /**
       * Only relevant for text and tsvector columns. Match only rows where
       * `column` matches the query string in `query`.
       *
       * @param column - The text or tsvector column to filter on
       * @param query - The query text to match with
       * @param options - Named parameters
       * @param options.config - The text search configuration to use
       * @param options.type - Change how the `query` text is interpreted
       */
      textSearch(column, query, { config, type } = {}) {
        let typePart = "";
        if (type === "plain") {
          typePart = "pl";
        } else if (type === "phrase") {
          typePart = "ph";
        } else if (type === "websearch") {
          typePart = "w";
        }
        const configPart = config === void 0 ? "" : `(${config})`;
        this.url.searchParams.append(column, `${typePart}fts${configPart}.${query}`);
        return this;
      }
      /**
       * Match only rows where each column in `query` keys is equal to its
       * associated value. Shorthand for multiple `.eq()`s.
       *
       * @param query - The object to filter with, with column names as keys mapped
       * to their filter values
       */
      match(query) {
        Object.entries(query).forEach(([column, value]) => {
          this.url.searchParams.append(column, `eq.${value}`);
        });
        return this;
      }
      /**
       * Match only rows which doesn't satisfy the filter.
       *
       * Unlike most filters, `opearator` and `value` are used as-is and need to
       * follow [PostgREST
       * syntax](https://postgrest.org/en/stable/api.html#operators). You also need
       * to make sure they are properly sanitized.
       *
       * @param column - The column to filter on
       * @param operator - The operator to be negated to filter with, following
       * PostgREST syntax
       * @param value - The value to filter with, following PostgREST syntax
       */
      not(column, operator, value) {
        this.url.searchParams.append(column, `not.${operator}.${value}`);
        return this;
      }
      /**
       * Match only rows which satisfy at least one of the filters.
       *
       * Unlike most filters, `filters` is used as-is and needs to follow [PostgREST
       * syntax](https://postgrest.org/en/stable/api.html#operators). You also need
       * to make sure it's properly sanitized.
       *
       * It's currently not possible to do an `.or()` filter across multiple tables.
       *
       * @param filters - The filters to use, following PostgREST syntax
       * @param options - Named parameters
       * @param options.referencedTable - Set this to filter on referenced tables
       * instead of the parent table
       * @param options.foreignTable - Deprecated, use `referencedTable` instead
       */
      or(filters, { foreignTable, referencedTable = foreignTable } = {}) {
        const key = referencedTable ? `${referencedTable}.or` : "or";
        this.url.searchParams.append(key, `(${filters})`);
        return this;
      }
      /**
       * Match only rows which satisfy the filter. This is an escape hatch - you
       * should use the specific filter methods wherever possible.
       *
       * Unlike most filters, `opearator` and `value` are used as-is and need to
       * follow [PostgREST
       * syntax](https://postgrest.org/en/stable/api.html#operators). You also need
       * to make sure they are properly sanitized.
       *
       * @param column - The column to filter on
       * @param operator - The operator to filter with, following PostgREST syntax
       * @param value - The value to filter with, following PostgREST syntax
       */
      filter(column, operator, value) {
        this.url.searchParams.append(column, `${operator}.${value}`);
        return this;
      }
    };
    exports.default = PostgrestFilterBuilder2;
  }
});

// node_modules/@supabase/postgrest-js/dist/cjs/PostgrestQueryBuilder.js
var require_PostgrestQueryBuilder = __commonJS({
  "node_modules/@supabase/postgrest-js/dist/cjs/PostgrestQueryBuilder.js"(exports) {
    "use strict";
    var __importDefault = exports && exports.__importDefault || function(mod) {
      return mod && mod.__esModule ? mod : { "default": mod };
    };
    Object.defineProperty(exports, "__esModule", { value: true });
    var PostgrestFilterBuilder_1 = __importDefault(require_PostgrestFilterBuilder());
    var PostgrestQueryBuilder2 = class {
      constructor(url, { headers = {}, schema, fetch: fetch3 }) {
        this.url = url;
        this.headers = headers;
        this.schema = schema;
        this.fetch = fetch3;
      }
      /**
       * Perform a SELECT query on the table or view.
       *
       * @param columns - The columns to retrieve, separated by commas. Columns can be renamed when returned with `customName:columnName`
       *
       * @param options - Named parameters
       *
       * @param options.head - When set to `true`, `data` will not be returned.
       * Useful if you only need the count.
       *
       * @param options.count - Count algorithm to use to count rows in the table or view.
       *
       * `"exact"`: Exact but slow count algorithm. Performs a `COUNT(*)` under the
       * hood.
       *
       * `"planned"`: Approximated but fast count algorithm. Uses the Postgres
       * statistics under the hood.
       *
       * `"estimated"`: Uses exact count for low numbers and planned count for high
       * numbers.
       */
      select(columns, { head: head2 = false, count } = {}) {
        const method = head2 ? "HEAD" : "GET";
        let quoted = false;
        const cleanedColumns = (columns !== null && columns !== void 0 ? columns : "*").split("").map((c) => {
          if (/\s/.test(c) && !quoted) {
            return "";
          }
          if (c === '"') {
            quoted = !quoted;
          }
          return c;
        }).join("");
        this.url.searchParams.set("select", cleanedColumns);
        if (count) {
          this.headers["Prefer"] = `count=${count}`;
        }
        return new PostgrestFilterBuilder_1.default({
          method,
          url: this.url,
          headers: this.headers,
          schema: this.schema,
          fetch: this.fetch,
          allowEmpty: false
        });
      }
      /**
       * Perform an INSERT into the table or view.
       *
       * By default, inserted rows are not returned. To return it, chain the call
       * with `.select()`.
       *
       * @param values - The values to insert. Pass an object to insert a single row
       * or an array to insert multiple rows.
       *
       * @param options - Named parameters
       *
       * @param options.count - Count algorithm to use to count inserted rows.
       *
       * `"exact"`: Exact but slow count algorithm. Performs a `COUNT(*)` under the
       * hood.
       *
       * `"planned"`: Approximated but fast count algorithm. Uses the Postgres
       * statistics under the hood.
       *
       * `"estimated"`: Uses exact count for low numbers and planned count for high
       * numbers.
       *
       * @param options.defaultToNull - Make missing fields default to `null`.
       * Otherwise, use the default value for the column. Only applies for bulk
       * inserts.
       */
      insert(values, { count, defaultToNull = true } = {}) {
        const method = "POST";
        const prefersHeaders = [];
        if (this.headers["Prefer"]) {
          prefersHeaders.push(this.headers["Prefer"]);
        }
        if (count) {
          prefersHeaders.push(`count=${count}`);
        }
        if (!defaultToNull) {
          prefersHeaders.push("missing=default");
        }
        this.headers["Prefer"] = prefersHeaders.join(",");
        if (Array.isArray(values)) {
          const columns = values.reduce((acc, x) => acc.concat(Object.keys(x)), []);
          if (columns.length > 0) {
            const uniqueColumns = [...new Set(columns)].map((column) => `"${column}"`);
            this.url.searchParams.set("columns", uniqueColumns.join(","));
          }
        }
        return new PostgrestFilterBuilder_1.default({
          method,
          url: this.url,
          headers: this.headers,
          schema: this.schema,
          body: values,
          fetch: this.fetch,
          allowEmpty: false
        });
      }
      /**
       * Perform an UPSERT on the table or view. Depending on the column(s) passed
       * to `onConflict`, `.upsert()` allows you to perform the equivalent of
       * `.insert()` if a row with the corresponding `onConflict` columns doesn't
       * exist, or if it does exist, perform an alternative action depending on
       * `ignoreDuplicates`.
       *
       * By default, upserted rows are not returned. To return it, chain the call
       * with `.select()`.
       *
       * @param values - The values to upsert with. Pass an object to upsert a
       * single row or an array to upsert multiple rows.
       *
       * @param options - Named parameters
       *
       * @param options.onConflict - Comma-separated UNIQUE column(s) to specify how
       * duplicate rows are determined. Two rows are duplicates if all the
       * `onConflict` columns are equal.
       *
       * @param options.ignoreDuplicates - If `true`, duplicate rows are ignored. If
       * `false`, duplicate rows are merged with existing rows.
       *
       * @param options.count - Count algorithm to use to count upserted rows.
       *
       * `"exact"`: Exact but slow count algorithm. Performs a `COUNT(*)` under the
       * hood.
       *
       * `"planned"`: Approximated but fast count algorithm. Uses the Postgres
       * statistics under the hood.
       *
       * `"estimated"`: Uses exact count for low numbers and planned count for high
       * numbers.
       *
       * @param options.defaultToNull - Make missing fields default to `null`.
       * Otherwise, use the default value for the column. This only applies when
       * inserting new rows, not when merging with existing rows under
       * `ignoreDuplicates: false`. This also only applies when doing bulk upserts.
       */
      upsert(values, { onConflict, ignoreDuplicates = false, count, defaultToNull = true } = {}) {
        const method = "POST";
        const prefersHeaders = [`resolution=${ignoreDuplicates ? "ignore" : "merge"}-duplicates`];
        if (onConflict !== void 0)
          this.url.searchParams.set("on_conflict", onConflict);
        if (this.headers["Prefer"]) {
          prefersHeaders.push(this.headers["Prefer"]);
        }
        if (count) {
          prefersHeaders.push(`count=${count}`);
        }
        if (!defaultToNull) {
          prefersHeaders.push("missing=default");
        }
        this.headers["Prefer"] = prefersHeaders.join(",");
        if (Array.isArray(values)) {
          const columns = values.reduce((acc, x) => acc.concat(Object.keys(x)), []);
          if (columns.length > 0) {
            const uniqueColumns = [...new Set(columns)].map((column) => `"${column}"`);
            this.url.searchParams.set("columns", uniqueColumns.join(","));
          }
        }
        return new PostgrestFilterBuilder_1.default({
          method,
          url: this.url,
          headers: this.headers,
          schema: this.schema,
          body: values,
          fetch: this.fetch,
          allowEmpty: false
        });
      }
      /**
       * Perform an UPDATE on the table or view.
       *
       * By default, updated rows are not returned. To return it, chain the call
       * with `.select()` after filters.
       *
       * @param values - The values to update with
       *
       * @param options - Named parameters
       *
       * @param options.count - Count algorithm to use to count updated rows.
       *
       * `"exact"`: Exact but slow count algorithm. Performs a `COUNT(*)` under the
       * hood.
       *
       * `"planned"`: Approximated but fast count algorithm. Uses the Postgres
       * statistics under the hood.
       *
       * `"estimated"`: Uses exact count for low numbers and planned count for high
       * numbers.
       */
      update(values, { count } = {}) {
        const method = "PATCH";
        const prefersHeaders = [];
        if (this.headers["Prefer"]) {
          prefersHeaders.push(this.headers["Prefer"]);
        }
        if (count) {
          prefersHeaders.push(`count=${count}`);
        }
        this.headers["Prefer"] = prefersHeaders.join(",");
        return new PostgrestFilterBuilder_1.default({
          method,
          url: this.url,
          headers: this.headers,
          schema: this.schema,
          body: values,
          fetch: this.fetch,
          allowEmpty: false
        });
      }
      /**
       * Perform a DELETE on the table or view.
       *
       * By default, deleted rows are not returned. To return it, chain the call
       * with `.select()` after filters.
       *
       * @param options - Named parameters
       *
       * @param options.count - Count algorithm to use to count deleted rows.
       *
       * `"exact"`: Exact but slow count algorithm. Performs a `COUNT(*)` under the
       * hood.
       *
       * `"planned"`: Approximated but fast count algorithm. Uses the Postgres
       * statistics under the hood.
       *
       * `"estimated"`: Uses exact count for low numbers and planned count for high
       * numbers.
       */
      delete({ count } = {}) {
        const method = "DELETE";
        const prefersHeaders = [];
        if (count) {
          prefersHeaders.push(`count=${count}`);
        }
        if (this.headers["Prefer"]) {
          prefersHeaders.unshift(this.headers["Prefer"]);
        }
        this.headers["Prefer"] = prefersHeaders.join(",");
        return new PostgrestFilterBuilder_1.default({
          method,
          url: this.url,
          headers: this.headers,
          schema: this.schema,
          fetch: this.fetch,
          allowEmpty: false
        });
      }
    };
    exports.default = PostgrestQueryBuilder2;
  }
});

// node_modules/@supabase/postgrest-js/dist/cjs/version.js
var require_version = __commonJS({
  "node_modules/@supabase/postgrest-js/dist/cjs/version.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.version = void 0;
    exports.version = "0.0.0-automated";
  }
});

// node_modules/@supabase/postgrest-js/dist/cjs/constants.js
var require_constants = __commonJS({
  "node_modules/@supabase/postgrest-js/dist/cjs/constants.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.DEFAULT_HEADERS = void 0;
    var version_1 = require_version();
    exports.DEFAULT_HEADERS = { "X-Client-Info": `postgrest-js/${version_1.version}` };
  }
});

// node_modules/@supabase/postgrest-js/dist/cjs/PostgrestClient.js
var require_PostgrestClient = __commonJS({
  "node_modules/@supabase/postgrest-js/dist/cjs/PostgrestClient.js"(exports) {
    "use strict";
    var __importDefault = exports && exports.__importDefault || function(mod) {
      return mod && mod.__esModule ? mod : { "default": mod };
    };
    Object.defineProperty(exports, "__esModule", { value: true });
    var PostgrestQueryBuilder_1 = __importDefault(require_PostgrestQueryBuilder());
    var PostgrestFilterBuilder_1 = __importDefault(require_PostgrestFilterBuilder());
    var constants_1 = require_constants();
    var PostgrestClient2 = class _PostgrestClient {
      // TODO: Add back shouldThrowOnError once we figure out the typings
      /**
       * Creates a PostgREST client.
       *
       * @param url - URL of the PostgREST endpoint
       * @param options - Named parameters
       * @param options.headers - Custom headers
       * @param options.schema - Postgres schema to switch to
       * @param options.fetch - Custom fetch
       */
      constructor(url, { headers = {}, schema, fetch: fetch3 } = {}) {
        this.url = url;
        this.headers = Object.assign(Object.assign({}, constants_1.DEFAULT_HEADERS), headers);
        this.schemaName = schema;
        this.fetch = fetch3;
      }
      /**
       * Perform a query on a table or a view.
       *
       * @param relation - The table or view name to query
       */
      from(relation) {
        const url = new URL(`${this.url}/${relation}`);
        return new PostgrestQueryBuilder_1.default(url, {
          headers: Object.assign({}, this.headers),
          schema: this.schemaName,
          fetch: this.fetch
        });
      }
      /**
       * Select a schema to query or perform an function (rpc) call.
       *
       * The schema needs to be on the list of exposed schemas inside Supabase.
       *
       * @param schema - The schema to query
       */
      schema(schema) {
        return new _PostgrestClient(this.url, {
          headers: this.headers,
          schema,
          fetch: this.fetch
        });
      }
      /**
       * Perform a function call.
       *
       * @param fn - The function name to call
       * @param args - The arguments to pass to the function call
       * @param options - Named parameters
       * @param options.head - When set to `true`, `data` will not be returned.
       * Useful if you only need the count.
       * @param options.get - When set to `true`, the function will be called with
       * read-only access mode.
       * @param options.count - Count algorithm to use to count rows returned by the
       * function. Only applicable for [set-returning
       * functions](https://www.postgresql.org/docs/current/functions-srf.html).
       *
       * `"exact"`: Exact but slow count algorithm. Performs a `COUNT(*)` under the
       * hood.
       *
       * `"planned"`: Approximated but fast count algorithm. Uses the Postgres
       * statistics under the hood.
       *
       * `"estimated"`: Uses exact count for low numbers and planned count for high
       * numbers.
       */
      rpc(fn, args = {}, { head: head2 = false, get: get2 = false, count } = {}) {
        let method;
        const url = new URL(`${this.url}/rpc/${fn}`);
        let body;
        if (head2 || get2) {
          method = head2 ? "HEAD" : "GET";
          Object.entries(args).filter(([_, value]) => value !== void 0).map(([name, value]) => [name, Array.isArray(value) ? `{${value.join(",")}}` : `${value}`]).forEach(([name, value]) => {
            url.searchParams.append(name, value);
          });
        } else {
          method = "POST";
          body = args;
        }
        const headers = Object.assign({}, this.headers);
        if (count) {
          headers["Prefer"] = `count=${count}`;
        }
        return new PostgrestFilterBuilder_1.default({
          method,
          url,
          headers,
          schema: this.schemaName,
          body,
          fetch: this.fetch,
          allowEmpty: false
        });
      }
    };
    exports.default = PostgrestClient2;
  }
});

// node_modules/@supabase/postgrest-js/dist/cjs/index.js
var require_cjs = __commonJS({
  "node_modules/@supabase/postgrest-js/dist/cjs/index.js"(exports) {
    "use strict";
    var __importDefault = exports && exports.__importDefault || function(mod) {
      return mod && mod.__esModule ? mod : { "default": mod };
    };
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.PostgrestError = exports.PostgrestBuilder = exports.PostgrestTransformBuilder = exports.PostgrestFilterBuilder = exports.PostgrestQueryBuilder = exports.PostgrestClient = void 0;
    var PostgrestClient_1 = __importDefault(require_PostgrestClient());
    exports.PostgrestClient = PostgrestClient_1.default;
    var PostgrestQueryBuilder_1 = __importDefault(require_PostgrestQueryBuilder());
    exports.PostgrestQueryBuilder = PostgrestQueryBuilder_1.default;
    var PostgrestFilterBuilder_1 = __importDefault(require_PostgrestFilterBuilder());
    exports.PostgrestFilterBuilder = PostgrestFilterBuilder_1.default;
    var PostgrestTransformBuilder_1 = __importDefault(require_PostgrestTransformBuilder());
    exports.PostgrestTransformBuilder = PostgrestTransformBuilder_1.default;
    var PostgrestBuilder_1 = __importDefault(require_PostgrestBuilder());
    exports.PostgrestBuilder = PostgrestBuilder_1.default;
    var PostgrestError_1 = __importDefault(require_PostgrestError());
    exports.PostgrestError = PostgrestError_1.default;
    exports.default = {
      PostgrestClient: PostgrestClient_1.default,
      PostgrestQueryBuilder: PostgrestQueryBuilder_1.default,
      PostgrestFilterBuilder: PostgrestFilterBuilder_1.default,
      PostgrestTransformBuilder: PostgrestTransformBuilder_1.default,
      PostgrestBuilder: PostgrestBuilder_1.default,
      PostgrestError: PostgrestError_1.default
    };
  }
});

// node_modules/ws/browser.js
var require_browser = __commonJS({
  "node_modules/ws/browser.js"(exports, module) {
    "use strict";
    module.exports = function() {
      throw new Error(
        "ws does not work in the browser. Browser clients must use the native WebSocket object"
      );
    };
  }
});

// node_modules/@supabase/functions-js/dist/module/helper.js
var resolveFetch = (customFetch) => {
  let _fetch;
  if (customFetch) {
    _fetch = customFetch;
  } else if (typeof fetch === "undefined") {
    _fetch = (...args) => Promise.resolve().then(() => (init_browser(), browser_exports)).then(({ default: fetch3 }) => fetch3(...args));
  } else {
    _fetch = fetch;
  }
  return (...args) => _fetch(...args);
};

// node_modules/@supabase/functions-js/dist/module/types.js
var FunctionsError = class extends Error {
  constructor(message, name = "FunctionsError", context) {
    super(message);
    this.name = name;
    this.context = context;
  }
};
var FunctionsFetchError = class extends FunctionsError {
  constructor(context) {
    super("Failed to send a request to the Edge Function", "FunctionsFetchError", context);
  }
};
var FunctionsRelayError = class extends FunctionsError {
  constructor(context) {
    super("Relay Error invoking the Edge Function", "FunctionsRelayError", context);
  }
};
var FunctionsHttpError = class extends FunctionsError {
  constructor(context) {
    super("Edge Function returned a non-2xx status code", "FunctionsHttpError", context);
  }
};
var FunctionRegion;
(function(FunctionRegion2) {
  FunctionRegion2["Any"] = "any";
  FunctionRegion2["ApNortheast1"] = "ap-northeast-1";
  FunctionRegion2["ApNortheast2"] = "ap-northeast-2";
  FunctionRegion2["ApSouth1"] = "ap-south-1";
  FunctionRegion2["ApSoutheast1"] = "ap-southeast-1";
  FunctionRegion2["ApSoutheast2"] = "ap-southeast-2";
  FunctionRegion2["CaCentral1"] = "ca-central-1";
  FunctionRegion2["EuCentral1"] = "eu-central-1";
  FunctionRegion2["EuWest1"] = "eu-west-1";
  FunctionRegion2["EuWest2"] = "eu-west-2";
  FunctionRegion2["EuWest3"] = "eu-west-3";
  FunctionRegion2["SaEast1"] = "sa-east-1";
  FunctionRegion2["UsEast1"] = "us-east-1";
  FunctionRegion2["UsWest1"] = "us-west-1";
  FunctionRegion2["UsWest2"] = "us-west-2";
})(FunctionRegion || (FunctionRegion = {}));

// node_modules/@supabase/functions-js/dist/module/FunctionsClient.js
var __awaiter = function(thisArg, _arguments, P, generator) {
  function adopt(value) {
    return value instanceof P ? value : new P(function(resolve) {
      resolve(value);
    });
  }
  return new (P || (P = Promise))(function(resolve, reject) {
    function fulfilled(value) {
      try {
        step(generator.next(value));
      } catch (e) {
        reject(e);
      }
    }
    function rejected(value) {
      try {
        step(generator["throw"](value));
      } catch (e) {
        reject(e);
      }
    }
    function step(result) {
      result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected);
    }
    step((generator = generator.apply(thisArg, _arguments || [])).next());
  });
};
var FunctionsClient = class {
  constructor(url, { headers = {}, customFetch, region = FunctionRegion.Any } = {}) {
    this.url = url;
    this.headers = headers;
    this.region = region;
    this.fetch = resolveFetch(customFetch);
  }
  /**
   * Updates the authorization header
   * @param token - the new jwt token sent in the authorisation header
   */
  setAuth(token) {
    this.headers.Authorization = `Bearer ${token}`;
  }
  /**
   * Invokes a function
   * @param functionName - The name of the Function to invoke.
   * @param options - Options for invoking the Function.
   */
  invoke(functionName, options = {}) {
    var _a;
    return __awaiter(this, void 0, void 0, function* () {
      try {
        const { headers, method, body: functionArgs } = options;
        let _headers = {};
        let { region } = options;
        if (!region) {
          region = this.region;
        }
        if (region && region !== "any") {
          _headers["x-region"] = region;
        }
        let body;
        if (functionArgs && (headers && !Object.prototype.hasOwnProperty.call(headers, "Content-Type") || !headers)) {
          if (typeof Blob !== "undefined" && functionArgs instanceof Blob || functionArgs instanceof ArrayBuffer) {
            _headers["Content-Type"] = "application/octet-stream";
            body = functionArgs;
          } else if (typeof functionArgs === "string") {
            _headers["Content-Type"] = "text/plain";
            body = functionArgs;
          } else if (typeof FormData !== "undefined" && functionArgs instanceof FormData) {
            body = functionArgs;
          } else {
            _headers["Content-Type"] = "application/json";
            body = JSON.stringify(functionArgs);
          }
        }
        const response = yield this.fetch(`${this.url}/${functionName}`, {
          method: method || "POST",
          // headers priority is (high to low):
          // 1. invoke-level headers
          // 2. client-level headers
          // 3. default Content-Type header
          headers: Object.assign(Object.assign(Object.assign({}, _headers), this.headers), headers),
          body
        }).catch((fetchError) => {
          throw new FunctionsFetchError(fetchError);
        });
        const isRelayError = response.headers.get("x-relay-error");
        if (isRelayError && isRelayError === "true") {
          throw new FunctionsRelayError(response);
        }
        if (!response.ok) {
          throw new FunctionsHttpError(response);
        }
        let responseType = ((_a = response.headers.get("Content-Type")) !== null && _a !== void 0 ? _a : "text/plain").split(";")[0].trim();
        let data;
        if (responseType === "application/json") {
          data = yield response.json();
        } else if (responseType === "application/octet-stream") {
          data = yield response.blob();
        } else if (responseType === "text/event-stream") {
          data = response;
        } else if (responseType === "multipart/form-data") {
          data = yield response.formData();
        } else {
          data = yield response.text();
        }
        return { data, error: null };
      } catch (error) {
        return { data: null, error };
      }
    });
  }
};

// node_modules/@supabase/postgrest-js/dist/esm/wrapper.mjs
var import_cjs = __toESM(require_cjs(), 1);
var {
  PostgrestClient,
  PostgrestQueryBuilder,
  PostgrestFilterBuilder,
  PostgrestTransformBuilder,
  PostgrestBuilder,
  PostgrestError
} = import_cjs.default;

// node_modules/@supabase/realtime-js/dist/module/lib/version.js
var version = "2.11.2";

// node_modules/@supabase/realtime-js/dist/module/lib/constants.js
var DEFAULT_HEADERS = { "X-Client-Info": `realtime-js/${version}` };
var VSN = "1.0.0";
var DEFAULT_TIMEOUT = 1e4;
var WS_CLOSE_NORMAL = 1e3;
var SOCKET_STATES;
(function(SOCKET_STATES2) {
  SOCKET_STATES2[SOCKET_STATES2["connecting"] = 0] = "connecting";
  SOCKET_STATES2[SOCKET_STATES2["open"] = 1] = "open";
  SOCKET_STATES2[SOCKET_STATES2["closing"] = 2] = "closing";
  SOCKET_STATES2[SOCKET_STATES2["closed"] = 3] = "closed";
})(SOCKET_STATES || (SOCKET_STATES = {}));
var CHANNEL_STATES;
(function(CHANNEL_STATES2) {
  CHANNEL_STATES2["closed"] = "closed";
  CHANNEL_STATES2["errored"] = "errored";
  CHANNEL_STATES2["joined"] = "joined";
  CHANNEL_STATES2["joining"] = "joining";
  CHANNEL_STATES2["leaving"] = "leaving";
})(CHANNEL_STATES || (CHANNEL_STATES = {}));
var CHANNEL_EVENTS;
(function(CHANNEL_EVENTS2) {
  CHANNEL_EVENTS2["close"] = "phx_close";
  CHANNEL_EVENTS2["error"] = "phx_error";
  CHANNEL_EVENTS2["join"] = "phx_join";
  CHANNEL_EVENTS2["reply"] = "phx_reply";
  CHANNEL_EVENTS2["leave"] = "phx_leave";
  CHANNEL_EVENTS2["access_token"] = "access_token";
})(CHANNEL_EVENTS || (CHANNEL_EVENTS = {}));
var TRANSPORTS;
(function(TRANSPORTS2) {
  TRANSPORTS2["websocket"] = "websocket";
})(TRANSPORTS || (TRANSPORTS = {}));
var CONNECTION_STATE;
(function(CONNECTION_STATE2) {
  CONNECTION_STATE2["Connecting"] = "connecting";
  CONNECTION_STATE2["Open"] = "open";
  CONNECTION_STATE2["Closing"] = "closing";
  CONNECTION_STATE2["Closed"] = "closed";
})(CONNECTION_STATE || (CONNECTION_STATE = {}));

// node_modules/@supabase/realtime-js/dist/module/lib/serializer.js
var Serializer = class {
  constructor() {
    this.HEADER_LENGTH = 1;
  }
  decode(rawPayload, callback) {
    if (rawPayload.constructor === ArrayBuffer) {
      return callback(this._binaryDecode(rawPayload));
    }
    if (typeof rawPayload === "string") {
      return callback(JSON.parse(rawPayload));
    }
    return callback({});
  }
  _binaryDecode(buffer) {
    const view = new DataView(buffer);
    const decoder = new TextDecoder();
    return this._decodeBroadcast(buffer, view, decoder);
  }
  _decodeBroadcast(buffer, view, decoder) {
    const topicSize = view.getUint8(1);
    const eventSize = view.getUint8(2);
    let offset = this.HEADER_LENGTH + 2;
    const topic = decoder.decode(buffer.slice(offset, offset + topicSize));
    offset = offset + topicSize;
    const event = decoder.decode(buffer.slice(offset, offset + eventSize));
    offset = offset + eventSize;
    const data = JSON.parse(decoder.decode(buffer.slice(offset, buffer.byteLength)));
    return { ref: null, topic, event, payload: data };
  }
};

// node_modules/@supabase/realtime-js/dist/module/lib/timer.js
var Timer = class {
  constructor(callback, timerCalc) {
    this.callback = callback;
    this.timerCalc = timerCalc;
    this.timer = void 0;
    this.tries = 0;
    this.callback = callback;
    this.timerCalc = timerCalc;
  }
  reset() {
    this.tries = 0;
    clearTimeout(this.timer);
  }
  // Cancels any previous scheduleTimeout and schedules callback
  scheduleTimeout() {
    clearTimeout(this.timer);
    this.timer = setTimeout(() => {
      this.tries = this.tries + 1;
      this.callback();
    }, this.timerCalc(this.tries + 1));
  }
};

// node_modules/@supabase/realtime-js/dist/module/lib/transformers.js
var PostgresTypes;
(function(PostgresTypes2) {
  PostgresTypes2["abstime"] = "abstime";
  PostgresTypes2["bool"] = "bool";
  PostgresTypes2["date"] = "date";
  PostgresTypes2["daterange"] = "daterange";
  PostgresTypes2["float4"] = "float4";
  PostgresTypes2["float8"] = "float8";
  PostgresTypes2["int2"] = "int2";
  PostgresTypes2["int4"] = "int4";
  PostgresTypes2["int4range"] = "int4range";
  PostgresTypes2["int8"] = "int8";
  PostgresTypes2["int8range"] = "int8range";
  PostgresTypes2["json"] = "json";
  PostgresTypes2["jsonb"] = "jsonb";
  PostgresTypes2["money"] = "money";
  PostgresTypes2["numeric"] = "numeric";
  PostgresTypes2["oid"] = "oid";
  PostgresTypes2["reltime"] = "reltime";
  PostgresTypes2["text"] = "text";
  PostgresTypes2["time"] = "time";
  PostgresTypes2["timestamp"] = "timestamp";
  PostgresTypes2["timestamptz"] = "timestamptz";
  PostgresTypes2["timetz"] = "timetz";
  PostgresTypes2["tsrange"] = "tsrange";
  PostgresTypes2["tstzrange"] = "tstzrange";
})(PostgresTypes || (PostgresTypes = {}));
var convertChangeData = (columns, record, options = {}) => {
  var _a;
  const skipTypes = (_a = options.skipTypes) !== null && _a !== void 0 ? _a : [];
  return Object.keys(record).reduce((acc, rec_key) => {
    acc[rec_key] = convertColumn(rec_key, columns, record, skipTypes);
    return acc;
  }, {});
};
var convertColumn = (columnName, columns, record, skipTypes) => {
  const column = columns.find((x) => x.name === columnName);
  const colType = column === null || column === void 0 ? void 0 : column.type;
  const value = record[columnName];
  if (colType && !skipTypes.includes(colType)) {
    return convertCell(colType, value);
  }
  return noop(value);
};
var convertCell = (type, value) => {
  if (type.charAt(0) === "_") {
    const dataType = type.slice(1, type.length);
    return toArray(value, dataType);
  }
  switch (type) {
    case PostgresTypes.bool:
      return toBoolean(value);
    case PostgresTypes.float4:
    case PostgresTypes.float8:
    case PostgresTypes.int2:
    case PostgresTypes.int4:
    case PostgresTypes.int8:
    case PostgresTypes.numeric:
    case PostgresTypes.oid:
      return toNumber(value);
    case PostgresTypes.json:
    case PostgresTypes.jsonb:
      return toJson(value);
    case PostgresTypes.timestamp:
      return toTimestampString(value);
    // Format to be consistent with PostgREST
    case PostgresTypes.abstime:
    // To allow users to cast it based on Timezone
    case PostgresTypes.date:
    // To allow users to cast it based on Timezone
    case PostgresTypes.daterange:
    case PostgresTypes.int4range:
    case PostgresTypes.int8range:
    case PostgresTypes.money:
    case PostgresTypes.reltime:
    // To allow users to cast it based on Timezone
    case PostgresTypes.text:
    case PostgresTypes.time:
    // To allow users to cast it based on Timezone
    case PostgresTypes.timestamptz:
    // To allow users to cast it based on Timezone
    case PostgresTypes.timetz:
    // To allow users to cast it based on Timezone
    case PostgresTypes.tsrange:
    case PostgresTypes.tstzrange:
      return noop(value);
    default:
      return noop(value);
  }
};
var noop = (value) => {
  return value;
};
var toBoolean = (value) => {
  switch (value) {
    case "t":
      return true;
    case "f":
      return false;
    default:
      return value;
  }
};
var toNumber = (value) => {
  if (typeof value === "string") {
    const parsedValue = parseFloat(value);
    if (!Number.isNaN(parsedValue)) {
      return parsedValue;
    }
  }
  return value;
};
var toJson = (value) => {
  if (typeof value === "string") {
    try {
      return JSON.parse(value);
    } catch (error) {
      console.log(`JSON parse error: ${error}`);
      return value;
    }
  }
  return value;
};
var toArray = (value, type) => {
  if (typeof value !== "string") {
    return value;
  }
  const lastIdx = value.length - 1;
  const closeBrace = value[lastIdx];
  const openBrace = value[0];
  if (openBrace === "{" && closeBrace === "}") {
    let arr;
    const valTrim = value.slice(1, lastIdx);
    try {
      arr = JSON.parse("[" + valTrim + "]");
    } catch (_) {
      arr = valTrim ? valTrim.split(",") : [];
    }
    return arr.map((val) => convertCell(type, val));
  }
  return value;
};
var toTimestampString = (value) => {
  if (typeof value === "string") {
    return value.replace(" ", "T");
  }
  return value;
};
var httpEndpointURL = (socketUrl) => {
  let url = socketUrl;
  url = url.replace(/^ws/i, "http");
  url = url.replace(/(\/socket\/websocket|\/socket|\/websocket)\/?$/i, "");
  return url.replace(/\/+$/, "");
};

// node_modules/@supabase/realtime-js/dist/module/lib/push.js
var Push = class {
  /**
   * Initializes the Push
   *
   * @param channel The Channel
   * @param event The event, for example `"phx_join"`
   * @param payload The payload, for example `{user_id: 123}`
   * @param timeout The push timeout in milliseconds
   */
  constructor(channel, event, payload = {}, timeout = DEFAULT_TIMEOUT) {
    this.channel = channel;
    this.event = event;
    this.payload = payload;
    this.timeout = timeout;
    this.sent = false;
    this.timeoutTimer = void 0;
    this.ref = "";
    this.receivedResp = null;
    this.recHooks = [];
    this.refEvent = null;
  }
  resend(timeout) {
    this.timeout = timeout;
    this._cancelRefEvent();
    this.ref = "";
    this.refEvent = null;
    this.receivedResp = null;
    this.sent = false;
    this.send();
  }
  send() {
    if (this._hasReceived("timeout")) {
      return;
    }
    this.startTimeout();
    this.sent = true;
    this.channel.socket.push({
      topic: this.channel.topic,
      event: this.event,
      payload: this.payload,
      ref: this.ref,
      join_ref: this.channel._joinRef()
    });
  }
  updatePayload(payload) {
    this.payload = Object.assign(Object.assign({}, this.payload), payload);
  }
  receive(status, callback) {
    var _a;
    if (this._hasReceived(status)) {
      callback((_a = this.receivedResp) === null || _a === void 0 ? void 0 : _a.response);
    }
    this.recHooks.push({ status, callback });
    return this;
  }
  startTimeout() {
    if (this.timeoutTimer) {
      return;
    }
    this.ref = this.channel.socket._makeRef();
    this.refEvent = this.channel._replyEventName(this.ref);
    const callback = (payload) => {
      this._cancelRefEvent();
      this._cancelTimeout();
      this.receivedResp = payload;
      this._matchReceive(payload);
    };
    this.channel._on(this.refEvent, {}, callback);
    this.timeoutTimer = setTimeout(() => {
      this.trigger("timeout", {});
    }, this.timeout);
  }
  trigger(status, response) {
    if (this.refEvent)
      this.channel._trigger(this.refEvent, { status, response });
  }
  destroy() {
    this._cancelRefEvent();
    this._cancelTimeout();
  }
  _cancelRefEvent() {
    if (!this.refEvent) {
      return;
    }
    this.channel._off(this.refEvent, {});
  }
  _cancelTimeout() {
    clearTimeout(this.timeoutTimer);
    this.timeoutTimer = void 0;
  }
  _matchReceive({ status, response }) {
    this.recHooks.filter((h) => h.status === status).forEach((h) => h.callback(response));
  }
  _hasReceived(status) {
    return this.receivedResp && this.receivedResp.status === status;
  }
};

// node_modules/@supabase/realtime-js/dist/module/RealtimePresence.js
var REALTIME_PRESENCE_LISTEN_EVENTS;
(function(REALTIME_PRESENCE_LISTEN_EVENTS2) {
  REALTIME_PRESENCE_LISTEN_EVENTS2["SYNC"] = "sync";
  REALTIME_PRESENCE_LISTEN_EVENTS2["JOIN"] = "join";
  REALTIME_PRESENCE_LISTEN_EVENTS2["LEAVE"] = "leave";
})(REALTIME_PRESENCE_LISTEN_EVENTS || (REALTIME_PRESENCE_LISTEN_EVENTS = {}));
var RealtimePresence = class _RealtimePresence {
  /**
   * Initializes the Presence.
   *
   * @param channel - The RealtimeChannel
   * @param opts - The options,
   *        for example `{events: {state: 'state', diff: 'diff'}}`
   */
  constructor(channel, opts) {
    this.channel = channel;
    this.state = {};
    this.pendingDiffs = [];
    this.joinRef = null;
    this.caller = {
      onJoin: () => {
      },
      onLeave: () => {
      },
      onSync: () => {
      }
    };
    const events = (opts === null || opts === void 0 ? void 0 : opts.events) || {
      state: "presence_state",
      diff: "presence_diff"
    };
    this.channel._on(events.state, {}, (newState) => {
      const { onJoin, onLeave, onSync } = this.caller;
      this.joinRef = this.channel._joinRef();
      this.state = _RealtimePresence.syncState(this.state, newState, onJoin, onLeave);
      this.pendingDiffs.forEach((diff) => {
        this.state = _RealtimePresence.syncDiff(this.state, diff, onJoin, onLeave);
      });
      this.pendingDiffs = [];
      onSync();
    });
    this.channel._on(events.diff, {}, (diff) => {
      const { onJoin, onLeave, onSync } = this.caller;
      if (this.inPendingSyncState()) {
        this.pendingDiffs.push(diff);
      } else {
        this.state = _RealtimePresence.syncDiff(this.state, diff, onJoin, onLeave);
        onSync();
      }
    });
    this.onJoin((key, currentPresences, newPresences) => {
      this.channel._trigger("presence", {
        event: "join",
        key,
        currentPresences,
        newPresences
      });
    });
    this.onLeave((key, currentPresences, leftPresences) => {
      this.channel._trigger("presence", {
        event: "leave",
        key,
        currentPresences,
        leftPresences
      });
    });
    this.onSync(() => {
      this.channel._trigger("presence", { event: "sync" });
    });
  }
  /**
   * Used to sync the list of presences on the server with the
   * client's state.
   *
   * An optional `onJoin` and `onLeave` callback can be provided to
   * react to changes in the client's local presences across
   * disconnects and reconnects with the server.
   *
   * @internal
   */
  static syncState(currentState, newState, onJoin, onLeave) {
    const state = this.cloneDeep(currentState);
    const transformedState = this.transformState(newState);
    const joins = {};
    const leaves = {};
    this.map(state, (key, presences) => {
      if (!transformedState[key]) {
        leaves[key] = presences;
      }
    });
    this.map(transformedState, (key, newPresences) => {
      const currentPresences = state[key];
      if (currentPresences) {
        const newPresenceRefs = newPresences.map((m) => m.presence_ref);
        const curPresenceRefs = currentPresences.map((m) => m.presence_ref);
        const joinedPresences = newPresences.filter((m) => curPresenceRefs.indexOf(m.presence_ref) < 0);
        const leftPresences = currentPresences.filter((m) => newPresenceRefs.indexOf(m.presence_ref) < 0);
        if (joinedPresences.length > 0) {
          joins[key] = joinedPresences;
        }
        if (leftPresences.length > 0) {
          leaves[key] = leftPresences;
        }
      } else {
        joins[key] = newPresences;
      }
    });
    return this.syncDiff(state, { joins, leaves }, onJoin, onLeave);
  }
  /**
   * Used to sync a diff of presence join and leave events from the
   * server, as they happen.
   *
   * Like `syncState`, `syncDiff` accepts optional `onJoin` and
   * `onLeave` callbacks to react to a user joining or leaving from a
   * device.
   *
   * @internal
   */
  static syncDiff(state, diff, onJoin, onLeave) {
    const { joins, leaves } = {
      joins: this.transformState(diff.joins),
      leaves: this.transformState(diff.leaves)
    };
    if (!onJoin) {
      onJoin = () => {
      };
    }
    if (!onLeave) {
      onLeave = () => {
      };
    }
    this.map(joins, (key, newPresences) => {
      var _a;
      const currentPresences = (_a = state[key]) !== null && _a !== void 0 ? _a : [];
      state[key] = this.cloneDeep(newPresences);
      if (currentPresences.length > 0) {
        const joinedPresenceRefs = state[key].map((m) => m.presence_ref);
        const curPresences = currentPresences.filter((m) => joinedPresenceRefs.indexOf(m.presence_ref) < 0);
        state[key].unshift(...curPresences);
      }
      onJoin(key, currentPresences, newPresences);
    });
    this.map(leaves, (key, leftPresences) => {
      let currentPresences = state[key];
      if (!currentPresences)
        return;
      const presenceRefsToRemove = leftPresences.map((m) => m.presence_ref);
      currentPresences = currentPresences.filter((m) => presenceRefsToRemove.indexOf(m.presence_ref) < 0);
      state[key] = currentPresences;
      onLeave(key, currentPresences, leftPresences);
      if (currentPresences.length === 0)
        delete state[key];
    });
    return state;
  }
  /** @internal */
  static map(obj, func) {
    return Object.getOwnPropertyNames(obj).map((key) => func(key, obj[key]));
  }
  /**
   * Remove 'metas' key
   * Change 'phx_ref' to 'presence_ref'
   * Remove 'phx_ref' and 'phx_ref_prev'
   *
   * @example
   * // returns {
   *  abc123: [
   *    { presence_ref: '2', user_id: 1 },
   *    { presence_ref: '3', user_id: 2 }
   *  ]
   * }
   * RealtimePresence.transformState({
   *  abc123: {
   *    metas: [
   *      { phx_ref: '2', phx_ref_prev: '1' user_id: 1 },
   *      { phx_ref: '3', user_id: 2 }
   *    ]
   *  }
   * })
   *
   * @internal
   */
  static transformState(state) {
    state = this.cloneDeep(state);
    return Object.getOwnPropertyNames(state).reduce((newState, key) => {
      const presences = state[key];
      if ("metas" in presences) {
        newState[key] = presences.metas.map((presence) => {
          presence["presence_ref"] = presence["phx_ref"];
          delete presence["phx_ref"];
          delete presence["phx_ref_prev"];
          return presence;
        });
      } else {
        newState[key] = presences;
      }
      return newState;
    }, {});
  }
  /** @internal */
  static cloneDeep(obj) {
    return JSON.parse(JSON.stringify(obj));
  }
  /** @internal */
  onJoin(callback) {
    this.caller.onJoin = callback;
  }
  /** @internal */
  onLeave(callback) {
    this.caller.onLeave = callback;
  }
  /** @internal */
  onSync(callback) {
    this.caller.onSync = callback;
  }
  /** @internal */
  inPendingSyncState() {
    return !this.joinRef || this.joinRef !== this.channel._joinRef();
  }
};

// node_modules/@supabase/realtime-js/dist/module/RealtimeChannel.js
var REALTIME_POSTGRES_CHANGES_LISTEN_EVENT;
(function(REALTIME_POSTGRES_CHANGES_LISTEN_EVENT2) {
  REALTIME_POSTGRES_CHANGES_LISTEN_EVENT2["ALL"] = "*";
  REALTIME_POSTGRES_CHANGES_LISTEN_EVENT2["INSERT"] = "INSERT";
  REALTIME_POSTGRES_CHANGES_LISTEN_EVENT2["UPDATE"] = "UPDATE";
  REALTIME_POSTGRES_CHANGES_LISTEN_EVENT2["DELETE"] = "DELETE";
})(REALTIME_POSTGRES_CHANGES_LISTEN_EVENT || (REALTIME_POSTGRES_CHANGES_LISTEN_EVENT = {}));
var REALTIME_LISTEN_TYPES;
(function(REALTIME_LISTEN_TYPES2) {
  REALTIME_LISTEN_TYPES2["BROADCAST"] = "broadcast";
  REALTIME_LISTEN_TYPES2["PRESENCE"] = "presence";
  REALTIME_LISTEN_TYPES2["POSTGRES_CHANGES"] = "postgres_changes";
  REALTIME_LISTEN_TYPES2["SYSTEM"] = "system";
})(REALTIME_LISTEN_TYPES || (REALTIME_LISTEN_TYPES = {}));
var REALTIME_SUBSCRIBE_STATES;
(function(REALTIME_SUBSCRIBE_STATES2) {
  REALTIME_SUBSCRIBE_STATES2["SUBSCRIBED"] = "SUBSCRIBED";
  REALTIME_SUBSCRIBE_STATES2["TIMED_OUT"] = "TIMED_OUT";
  REALTIME_SUBSCRIBE_STATES2["CLOSED"] = "CLOSED";
  REALTIME_SUBSCRIBE_STATES2["CHANNEL_ERROR"] = "CHANNEL_ERROR";
})(REALTIME_SUBSCRIBE_STATES || (REALTIME_SUBSCRIBE_STATES = {}));
var RealtimeChannel = class _RealtimeChannel {
  constructor(topic, params = { config: {} }, socket) {
    this.topic = topic;
    this.params = params;
    this.socket = socket;
    this.bindings = {};
    this.state = CHANNEL_STATES.closed;
    this.joinedOnce = false;
    this.pushBuffer = [];
    this.subTopic = topic.replace(/^realtime:/i, "");
    this.params.config = Object.assign({
      broadcast: { ack: false, self: false },
      presence: { key: "" },
      private: false
    }, params.config);
    this.timeout = this.socket.timeout;
    this.joinPush = new Push(this, CHANNEL_EVENTS.join, this.params, this.timeout);
    this.rejoinTimer = new Timer(() => this._rejoinUntilConnected(), this.socket.reconnectAfterMs);
    this.joinPush.receive("ok", () => {
      this.state = CHANNEL_STATES.joined;
      this.rejoinTimer.reset();
      this.pushBuffer.forEach((pushEvent) => pushEvent.send());
      this.pushBuffer = [];
    });
    this._onClose(() => {
      this.rejoinTimer.reset();
      this.socket.log("channel", `close ${this.topic} ${this._joinRef()}`);
      this.state = CHANNEL_STATES.closed;
      this.socket._remove(this);
    });
    this._onError((reason) => {
      if (this._isLeaving() || this._isClosed()) {
        return;
      }
      this.socket.log("channel", `error ${this.topic}`, reason);
      this.state = CHANNEL_STATES.errored;
      this.rejoinTimer.scheduleTimeout();
    });
    this.joinPush.receive("timeout", () => {
      if (!this._isJoining()) {
        return;
      }
      this.socket.log("channel", `timeout ${this.topic}`, this.joinPush.timeout);
      this.state = CHANNEL_STATES.errored;
      this.rejoinTimer.scheduleTimeout();
    });
    this._on(CHANNEL_EVENTS.reply, {}, (payload, ref) => {
      this._trigger(this._replyEventName(ref), payload);
    });
    this.presence = new RealtimePresence(this);
    this.broadcastEndpointURL = httpEndpointURL(this.socket.endPoint) + "/api/broadcast";
    this.private = this.params.config.private || false;
  }
  /** Subscribe registers your client with the server */
  subscribe(callback, timeout = this.timeout) {
    var _a, _b;
    if (!this.socket.isConnected()) {
      this.socket.connect();
    }
    if (this.joinedOnce) {
      throw `tried to subscribe multiple times. 'subscribe' can only be called a single time per channel instance`;
    } else {
      const { config: { broadcast, presence, private: isPrivate } } = this.params;
      this._onError((e) => callback === null || callback === void 0 ? void 0 : callback(REALTIME_SUBSCRIBE_STATES.CHANNEL_ERROR, e));
      this._onClose(() => callback === null || callback === void 0 ? void 0 : callback(REALTIME_SUBSCRIBE_STATES.CLOSED));
      const accessTokenPayload = {};
      const config = {
        broadcast,
        presence,
        postgres_changes: (_b = (_a = this.bindings.postgres_changes) === null || _a === void 0 ? void 0 : _a.map((r) => r.filter)) !== null && _b !== void 0 ? _b : [],
        private: isPrivate
      };
      if (this.socket.accessTokenValue) {
        accessTokenPayload.access_token = this.socket.accessTokenValue;
      }
      this.updateJoinPayload(Object.assign({ config }, accessTokenPayload));
      this.joinedOnce = true;
      this._rejoin(timeout);
      this.joinPush.receive("ok", async ({ postgres_changes }) => {
        var _a2;
        this.socket.setAuth();
        if (postgres_changes === void 0) {
          callback === null || callback === void 0 ? void 0 : callback(REALTIME_SUBSCRIBE_STATES.SUBSCRIBED);
          return;
        } else {
          const clientPostgresBindings = this.bindings.postgres_changes;
          const bindingsLen = (_a2 = clientPostgresBindings === null || clientPostgresBindings === void 0 ? void 0 : clientPostgresBindings.length) !== null && _a2 !== void 0 ? _a2 : 0;
          const newPostgresBindings = [];
          for (let i = 0; i < bindingsLen; i++) {
            const clientPostgresBinding = clientPostgresBindings[i];
            const { filter: { event, schema, table, filter } } = clientPostgresBinding;
            const serverPostgresFilter = postgres_changes && postgres_changes[i];
            if (serverPostgresFilter && serverPostgresFilter.event === event && serverPostgresFilter.schema === schema && serverPostgresFilter.table === table && serverPostgresFilter.filter === filter) {
              newPostgresBindings.push(Object.assign(Object.assign({}, clientPostgresBinding), { id: serverPostgresFilter.id }));
            } else {
              this.unsubscribe();
              callback === null || callback === void 0 ? void 0 : callback(REALTIME_SUBSCRIBE_STATES.CHANNEL_ERROR, new Error("mismatch between server and client bindings for postgres changes"));
              return;
            }
          }
          this.bindings.postgres_changes = newPostgresBindings;
          callback && callback(REALTIME_SUBSCRIBE_STATES.SUBSCRIBED);
          return;
        }
      }).receive("error", (error) => {
        callback === null || callback === void 0 ? void 0 : callback(REALTIME_SUBSCRIBE_STATES.CHANNEL_ERROR, new Error(JSON.stringify(Object.values(error).join(", ") || "error")));
        return;
      }).receive("timeout", () => {
        callback === null || callback === void 0 ? void 0 : callback(REALTIME_SUBSCRIBE_STATES.TIMED_OUT);
        return;
      });
    }
    return this;
  }
  presenceState() {
    return this.presence.state;
  }
  async track(payload, opts = {}) {
    return await this.send({
      type: "presence",
      event: "track",
      payload
    }, opts.timeout || this.timeout);
  }
  async untrack(opts = {}) {
    return await this.send({
      type: "presence",
      event: "untrack"
    }, opts);
  }
  on(type, filter, callback) {
    return this._on(type, filter, callback);
  }
  /**
   * Sends a message into the channel.
   *
   * @param args Arguments to send to channel
   * @param args.type The type of event to send
   * @param args.event The name of the event being sent
   * @param args.payload Payload to be sent
   * @param opts Options to be used during the send process
   */
  async send(args, opts = {}) {
    var _a, _b;
    if (!this._canPush() && args.type === "broadcast") {
      const { event, payload: endpoint_payload } = args;
      const authorization = this.socket.accessTokenValue ? `Bearer ${this.socket.accessTokenValue}` : "";
      const options = {
        method: "POST",
        headers: {
          Authorization: authorization,
          apikey: this.socket.apiKey ? this.socket.apiKey : "",
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          messages: [
            {
              topic: this.subTopic,
              event,
              payload: endpoint_payload,
              private: this.private
            }
          ]
        })
      };
      try {
        const response = await this._fetchWithTimeout(this.broadcastEndpointURL, options, (_a = opts.timeout) !== null && _a !== void 0 ? _a : this.timeout);
        await ((_b = response.body) === null || _b === void 0 ? void 0 : _b.cancel());
        return response.ok ? "ok" : "error";
      } catch (error) {
        if (error.name === "AbortError") {
          return "timed out";
        } else {
          return "error";
        }
      }
    } else {
      return new Promise((resolve) => {
        var _a2, _b2, _c;
        const push = this._push(args.type, args, opts.timeout || this.timeout);
        if (args.type === "broadcast" && !((_c = (_b2 = (_a2 = this.params) === null || _a2 === void 0 ? void 0 : _a2.config) === null || _b2 === void 0 ? void 0 : _b2.broadcast) === null || _c === void 0 ? void 0 : _c.ack)) {
          resolve("ok");
        }
        push.receive("ok", () => resolve("ok"));
        push.receive("error", () => resolve("error"));
        push.receive("timeout", () => resolve("timed out"));
      });
    }
  }
  updateJoinPayload(payload) {
    this.joinPush.updatePayload(payload);
  }
  /**
   * Leaves the channel.
   *
   * Unsubscribes from server events, and instructs channel to terminate on server.
   * Triggers onClose() hooks.
   *
   * To receive leave acknowledgements, use the a `receive` hook to bind to the server ack, ie:
   * channel.unsubscribe().receive("ok", () => alert("left!") )
   */
  unsubscribe(timeout = this.timeout) {
    this.state = CHANNEL_STATES.leaving;
    const onClose = () => {
      this.socket.log("channel", `leave ${this.topic}`);
      this._trigger(CHANNEL_EVENTS.close, "leave", this._joinRef());
    };
    this.rejoinTimer.reset();
    this.joinPush.destroy();
    return new Promise((resolve) => {
      const leavePush = new Push(this, CHANNEL_EVENTS.leave, {}, timeout);
      leavePush.receive("ok", () => {
        onClose();
        resolve("ok");
      }).receive("timeout", () => {
        onClose();
        resolve("timed out");
      }).receive("error", () => {
        resolve("error");
      });
      leavePush.send();
      if (!this._canPush()) {
        leavePush.trigger("ok", {});
      }
    });
  }
  /** @internal */
  async _fetchWithTimeout(url, options, timeout) {
    const controller = new AbortController();
    const id = setTimeout(() => controller.abort(), timeout);
    const response = await this.socket.fetch(url, Object.assign(Object.assign({}, options), { signal: controller.signal }));
    clearTimeout(id);
    return response;
  }
  /** @internal */
  _push(event, payload, timeout = this.timeout) {
    if (!this.joinedOnce) {
      throw `tried to push '${event}' to '${this.topic}' before joining. Use channel.subscribe() before pushing events`;
    }
    let pushEvent = new Push(this, event, payload, timeout);
    if (this._canPush()) {
      pushEvent.send();
    } else {
      pushEvent.startTimeout();
      this.pushBuffer.push(pushEvent);
    }
    return pushEvent;
  }
  /**
   * Overridable message hook
   *
   * Receives all events for specialized message handling before dispatching to the channel callbacks.
   * Must return the payload, modified or unmodified.
   *
   * @internal
   */
  _onMessage(_event, payload, _ref) {
    return payload;
  }
  /** @internal */
  _isMember(topic) {
    return this.topic === topic;
  }
  /** @internal */
  _joinRef() {
    return this.joinPush.ref;
  }
  /** @internal */
  _trigger(type, payload, ref) {
    var _a, _b;
    const typeLower = type.toLocaleLowerCase();
    const { close, error, leave, join } = CHANNEL_EVENTS;
    const events = [close, error, leave, join];
    if (ref && events.indexOf(typeLower) >= 0 && ref !== this._joinRef()) {
      return;
    }
    let handledPayload = this._onMessage(typeLower, payload, ref);
    if (payload && !handledPayload) {
      throw "channel onMessage callbacks must return the payload, modified or unmodified";
    }
    if (["insert", "update", "delete"].includes(typeLower)) {
      (_a = this.bindings.postgres_changes) === null || _a === void 0 ? void 0 : _a.filter((bind) => {
        var _a2, _b2, _c;
        return ((_a2 = bind.filter) === null || _a2 === void 0 ? void 0 : _a2.event) === "*" || ((_c = (_b2 = bind.filter) === null || _b2 === void 0 ? void 0 : _b2.event) === null || _c === void 0 ? void 0 : _c.toLocaleLowerCase()) === typeLower;
      }).map((bind) => bind.callback(handledPayload, ref));
    } else {
      (_b = this.bindings[typeLower]) === null || _b === void 0 ? void 0 : _b.filter((bind) => {
        var _a2, _b2, _c, _d, _e, _f;
        if (["broadcast", "presence", "postgres_changes"].includes(typeLower)) {
          if ("id" in bind) {
            const bindId = bind.id;
            const bindEvent = (_a2 = bind.filter) === null || _a2 === void 0 ? void 0 : _a2.event;
            return bindId && ((_b2 = payload.ids) === null || _b2 === void 0 ? void 0 : _b2.includes(bindId)) && (bindEvent === "*" || (bindEvent === null || bindEvent === void 0 ? void 0 : bindEvent.toLocaleLowerCase()) === ((_c = payload.data) === null || _c === void 0 ? void 0 : _c.type.toLocaleLowerCase()));
          } else {
            const bindEvent = (_e = (_d = bind === null || bind === void 0 ? void 0 : bind.filter) === null || _d === void 0 ? void 0 : _d.event) === null || _e === void 0 ? void 0 : _e.toLocaleLowerCase();
            return bindEvent === "*" || bindEvent === ((_f = payload === null || payload === void 0 ? void 0 : payload.event) === null || _f === void 0 ? void 0 : _f.toLocaleLowerCase());
          }
        } else {
          return bind.type.toLocaleLowerCase() === typeLower;
        }
      }).map((bind) => {
        if (typeof handledPayload === "object" && "ids" in handledPayload) {
          const postgresChanges = handledPayload.data;
          const { schema, table, commit_timestamp, type: type2, errors } = postgresChanges;
          const enrichedPayload = {
            schema,
            table,
            commit_timestamp,
            eventType: type2,
            new: {},
            old: {},
            errors
          };
          handledPayload = Object.assign(Object.assign({}, enrichedPayload), this._getPayloadRecords(postgresChanges));
        }
        bind.callback(handledPayload, ref);
      });
    }
  }
  /** @internal */
  _isClosed() {
    return this.state === CHANNEL_STATES.closed;
  }
  /** @internal */
  _isJoined() {
    return this.state === CHANNEL_STATES.joined;
  }
  /** @internal */
  _isJoining() {
    return this.state === CHANNEL_STATES.joining;
  }
  /** @internal */
  _isLeaving() {
    return this.state === CHANNEL_STATES.leaving;
  }
  /** @internal */
  _replyEventName(ref) {
    return `chan_reply_${ref}`;
  }
  /** @internal */
  _on(type, filter, callback) {
    const typeLower = type.toLocaleLowerCase();
    const binding = {
      type: typeLower,
      filter,
      callback
    };
    if (this.bindings[typeLower]) {
      this.bindings[typeLower].push(binding);
    } else {
      this.bindings[typeLower] = [binding];
    }
    return this;
  }
  /** @internal */
  _off(type, filter) {
    const typeLower = type.toLocaleLowerCase();
    this.bindings[typeLower] = this.bindings[typeLower].filter((bind) => {
      var _a;
      return !(((_a = bind.type) === null || _a === void 0 ? void 0 : _a.toLocaleLowerCase()) === typeLower && _RealtimeChannel.isEqual(bind.filter, filter));
    });
    return this;
  }
  /** @internal */
  static isEqual(obj1, obj2) {
    if (Object.keys(obj1).length !== Object.keys(obj2).length) {
      return false;
    }
    for (const k in obj1) {
      if (obj1[k] !== obj2[k]) {
        return false;
      }
    }
    return true;
  }
  /** @internal */
  _rejoinUntilConnected() {
    this.rejoinTimer.scheduleTimeout();
    if (this.socket.isConnected()) {
      this._rejoin();
    }
  }
  /**
   * Registers a callback that will be executed when the channel closes.
   *
   * @internal
   */
  _onClose(callback) {
    this._on(CHANNEL_EVENTS.close, {}, callback);
  }
  /**
   * Registers a callback that will be executed when the channel encounteres an error.
   *
   * @internal
   */
  _onError(callback) {
    this._on(CHANNEL_EVENTS.error, {}, (reason) => callback(reason));
  }
  /**
   * Returns `true` if the socket is connected and the channel has been joined.
   *
   * @internal
   */
  _canPush() {
    return this.socket.isConnected() && this._isJoined();
  }
  /** @internal */
  _rejoin(timeout = this.timeout) {
    if (this._isLeaving()) {
      return;
    }
    this.socket._leaveOpenTopic(this.topic);
    this.state = CHANNEL_STATES.joining;
    this.joinPush.resend(timeout);
  }
  /** @internal */
  _getPayloadRecords(payload) {
    const records = {
      new: {},
      old: {}
    };
    if (payload.type === "INSERT" || payload.type === "UPDATE") {
      records.new = convertChangeData(payload.columns, payload.record);
    }
    if (payload.type === "UPDATE" || payload.type === "DELETE") {
      records.old = convertChangeData(payload.columns, payload.old_record);
    }
    return records;
  }
};

// node_modules/@supabase/realtime-js/dist/module/RealtimeClient.js
var noop2 = () => {
};
var NATIVE_WEBSOCKET_AVAILABLE = typeof WebSocket !== "undefined";
var WORKER_SCRIPT = `
  addEventListener("message", (e) => {
    if (e.data.event === "start") {
      setInterval(() => postMessage({ event: "keepAlive" }), e.data.interval);
    }
  });`;
var RealtimeClient = class {
  /**
   * Initializes the Socket.
   *
   * @param endPoint The string WebSocket endpoint, ie, "ws://example.com/socket", "wss://example.com", "/socket" (inherited host & protocol)
   * @param httpEndpoint The string HTTP endpoint, ie, "https://example.com", "/" (inherited host & protocol)
   * @param options.transport The Websocket Transport, for example WebSocket.
   * @param options.timeout The default timeout in milliseconds to trigger push timeouts.
   * @param options.params The optional params to pass when connecting.
   * @param options.headers The optional headers to pass when connecting.
   * @param options.heartbeatIntervalMs The millisec interval to send a heartbeat message.
   * @param options.logger The optional function for specialized logging, ie: logger: (kind, msg, data) => { console.log(`${kind}: ${msg}`, data) }
   * @param options.encode The function to encode outgoing messages. Defaults to JSON: (payload, callback) => callback(JSON.stringify(payload))
   * @param options.decode The function to decode incoming messages. Defaults to Serializer's decode.
   * @param options.reconnectAfterMs he optional function that returns the millsec reconnect interval. Defaults to stepped backoff off.
   * @param options.worker Use Web Worker to set a side flow. Defaults to false.
   * @param options.workerUrl The URL of the worker script. Defaults to https://realtime.supabase.com/worker.js that includes a heartbeat event call to keep the connection alive.
   */
  constructor(endPoint, options) {
    var _a;
    this.accessTokenValue = null;
    this.apiKey = null;
    this.channels = [];
    this.endPoint = "";
    this.httpEndpoint = "";
    this.headers = DEFAULT_HEADERS;
    this.params = {};
    this.timeout = DEFAULT_TIMEOUT;
    this.heartbeatIntervalMs = 3e4;
    this.heartbeatTimer = void 0;
    this.pendingHeartbeatRef = null;
    this.ref = 0;
    this.logger = noop2;
    this.conn = null;
    this.sendBuffer = [];
    this.serializer = new Serializer();
    this.stateChangeCallbacks = {
      open: [],
      close: [],
      error: [],
      message: []
    };
    this.accessToken = null;
    this._resolveFetch = (customFetch) => {
      let _fetch;
      if (customFetch) {
        _fetch = customFetch;
      } else if (typeof fetch === "undefined") {
        _fetch = (...args) => Promise.resolve().then(() => (init_browser(), browser_exports)).then(({ default: fetch3 }) => fetch3(...args));
      } else {
        _fetch = fetch;
      }
      return (...args) => _fetch(...args);
    };
    this.endPoint = `${endPoint}/${TRANSPORTS.websocket}`;
    this.httpEndpoint = httpEndpointURL(endPoint);
    if (options === null || options === void 0 ? void 0 : options.transport) {
      this.transport = options.transport;
    } else {
      this.transport = null;
    }
    if (options === null || options === void 0 ? void 0 : options.params)
      this.params = options.params;
    if (options === null || options === void 0 ? void 0 : options.headers)
      this.headers = Object.assign(Object.assign({}, this.headers), options.headers);
    if (options === null || options === void 0 ? void 0 : options.timeout)
      this.timeout = options.timeout;
    if (options === null || options === void 0 ? void 0 : options.logger)
      this.logger = options.logger;
    if (options === null || options === void 0 ? void 0 : options.heartbeatIntervalMs)
      this.heartbeatIntervalMs = options.heartbeatIntervalMs;
    const accessTokenValue = (_a = options === null || options === void 0 ? void 0 : options.params) === null || _a === void 0 ? void 0 : _a.apikey;
    if (accessTokenValue) {
      this.accessTokenValue = accessTokenValue;
      this.apiKey = accessTokenValue;
    }
    this.reconnectAfterMs = (options === null || options === void 0 ? void 0 : options.reconnectAfterMs) ? options.reconnectAfterMs : (tries) => {
      return [1e3, 2e3, 5e3, 1e4][tries - 1] || 1e4;
    };
    this.encode = (options === null || options === void 0 ? void 0 : options.encode) ? options.encode : (payload, callback) => {
      return callback(JSON.stringify(payload));
    };
    this.decode = (options === null || options === void 0 ? void 0 : options.decode) ? options.decode : this.serializer.decode.bind(this.serializer);
    this.reconnectTimer = new Timer(async () => {
      this.disconnect();
      this.connect();
    }, this.reconnectAfterMs);
    this.fetch = this._resolveFetch(options === null || options === void 0 ? void 0 : options.fetch);
    if (options === null || options === void 0 ? void 0 : options.worker) {
      if (typeof window !== "undefined" && !window.Worker) {
        throw new Error("Web Worker is not supported");
      }
      this.worker = (options === null || options === void 0 ? void 0 : options.worker) || false;
      this.workerUrl = options === null || options === void 0 ? void 0 : options.workerUrl;
    }
    this.accessToken = (options === null || options === void 0 ? void 0 : options.accessToken) || null;
  }
  /**
   * Connects the socket, unless already connected.
   */
  connect() {
    if (this.conn) {
      return;
    }
    if (this.transport) {
      this.conn = new this.transport(this.endpointURL(), void 0, {
        headers: this.headers
      });
      return;
    }
    if (NATIVE_WEBSOCKET_AVAILABLE) {
      this.conn = new WebSocket(this.endpointURL());
      this.setupConnection();
      return;
    }
    this.conn = new WSWebSocketDummy(this.endpointURL(), void 0, {
      close: () => {
        this.conn = null;
      }
    });
    Promise.resolve().then(() => __toESM(require_browser())).then(({ default: WS }) => {
      this.conn = new WS(this.endpointURL(), void 0, {
        headers: this.headers
      });
      this.setupConnection();
    });
  }
  /**
   * Returns the URL of the websocket.
   * @returns string The URL of the websocket.
   */
  endpointURL() {
    return this._appendParams(this.endPoint, Object.assign({}, this.params, { vsn: VSN }));
  }
  /**
   * Disconnects the socket.
   *
   * @param code A numeric status code to send on disconnect.
   * @param reason A custom reason for the disconnect.
   */
  disconnect(code, reason) {
    if (this.conn) {
      this.conn.onclose = function() {
      };
      if (code) {
        this.conn.close(code, reason !== null && reason !== void 0 ? reason : "");
      } else {
        this.conn.close();
      }
      this.conn = null;
      this.heartbeatTimer && clearInterval(this.heartbeatTimer);
      this.reconnectTimer.reset();
    }
  }
  /**
   * Returns all created channels
   */
  getChannels() {
    return this.channels;
  }
  /**
   * Unsubscribes and removes a single channel
   * @param channel A RealtimeChannel instance
   */
  async removeChannel(channel) {
    const status = await channel.unsubscribe();
    if (this.channels.length === 0) {
      this.disconnect();
    }
    return status;
  }
  /**
   * Unsubscribes and removes all channels
   */
  async removeAllChannels() {
    const values_1 = await Promise.all(this.channels.map((channel) => channel.unsubscribe()));
    this.disconnect();
    return values_1;
  }
  /**
   * Logs the message.
   *
   * For customized logging, `this.logger` can be overridden.
   */
  log(kind, msg, data) {
    this.logger(kind, msg, data);
  }
  /**
   * Returns the current state of the socket.
   */
  connectionState() {
    switch (this.conn && this.conn.readyState) {
      case SOCKET_STATES.connecting:
        return CONNECTION_STATE.Connecting;
      case SOCKET_STATES.open:
        return CONNECTION_STATE.Open;
      case SOCKET_STATES.closing:
        return CONNECTION_STATE.Closing;
      default:
        return CONNECTION_STATE.Closed;
    }
  }
  /**
   * Returns `true` is the connection is open.
   */
  isConnected() {
    return this.connectionState() === CONNECTION_STATE.Open;
  }
  channel(topic, params = { config: {} }) {
    const chan = new RealtimeChannel(`realtime:${topic}`, params, this);
    this.channels.push(chan);
    return chan;
  }
  /**
   * Push out a message if the socket is connected.
   *
   * If the socket is not connected, the message gets enqueued within a local buffer, and sent out when a connection is next established.
   */
  push(data) {
    const { topic, event, payload, ref } = data;
    const callback = () => {
      this.encode(data, (result) => {
        var _a;
        (_a = this.conn) === null || _a === void 0 ? void 0 : _a.send(result);
      });
    };
    this.log("push", `${topic} ${event} (${ref})`, payload);
    if (this.isConnected()) {
      callback();
    } else {
      this.sendBuffer.push(callback);
    }
  }
  /**
   * Sets the JWT access token used for channel subscription authorization and Realtime RLS.
   *
   * If param is null it will use the `accessToken` callback function or the token set on the client.
   *
   * On callback used, it will set the value of the token internal to the client.
   *
   * @param token A JWT string to override the token set on the client.
   */
  async setAuth(token = null) {
    let tokenToSend = token || this.accessToken && await this.accessToken() || this.accessTokenValue;
    if (tokenToSend) {
      let parsed = null;
      try {
        parsed = JSON.parse(atob(tokenToSend.split(".")[1]));
      } catch (_error) {
      }
      if (parsed && parsed.exp) {
        let now = Math.floor(Date.now() / 1e3);
        let valid = now - parsed.exp < 0;
        if (!valid) {
          this.log("auth", `InvalidJWTToken: Invalid value for JWT claim "exp" with value ${parsed.exp}`);
          return Promise.reject(`InvalidJWTToken: Invalid value for JWT claim "exp" with value ${parsed.exp}`);
        }
      }
      this.accessTokenValue = tokenToSend;
      this.channels.forEach((channel) => {
        tokenToSend && channel.updateJoinPayload({ access_token: tokenToSend });
        if (channel.joinedOnce && channel._isJoined()) {
          channel._push(CHANNEL_EVENTS.access_token, {
            access_token: tokenToSend
          });
        }
      });
    }
  }
  /**
   * Sends a heartbeat message if the socket is connected.
   */
  async sendHeartbeat() {
    var _a;
    if (!this.isConnected()) {
      return;
    }
    if (this.pendingHeartbeatRef) {
      this.pendingHeartbeatRef = null;
      this.log("transport", "heartbeat timeout. Attempting to re-establish connection");
      (_a = this.conn) === null || _a === void 0 ? void 0 : _a.close(WS_CLOSE_NORMAL, "hearbeat timeout");
      return;
    }
    this.pendingHeartbeatRef = this._makeRef();
    this.push({
      topic: "phoenix",
      event: "heartbeat",
      payload: {},
      ref: this.pendingHeartbeatRef
    });
    this.setAuth();
  }
  /**
   * Flushes send buffer
   */
  flushSendBuffer() {
    if (this.isConnected() && this.sendBuffer.length > 0) {
      this.sendBuffer.forEach((callback) => callback());
      this.sendBuffer = [];
    }
  }
  /**
   * Return the next message ref, accounting for overflows
   *
   * @internal
   */
  _makeRef() {
    let newRef = this.ref + 1;
    if (newRef === this.ref) {
      this.ref = 0;
    } else {
      this.ref = newRef;
    }
    return this.ref.toString();
  }
  /**
   * Unsubscribe from channels with the specified topic.
   *
   * @internal
   */
  _leaveOpenTopic(topic) {
    let dupChannel = this.channels.find((c) => c.topic === topic && (c._isJoined() || c._isJoining()));
    if (dupChannel) {
      this.log("transport", `leaving duplicate topic "${topic}"`);
      dupChannel.unsubscribe();
    }
  }
  /**
   * Removes a subscription from the socket.
   *
   * @param channel An open subscription.
   *
   * @internal
   */
  _remove(channel) {
    this.channels = this.channels.filter((c) => c._joinRef() !== channel._joinRef());
  }
  /**
   * Sets up connection handlers.
   *
   * @internal
   */
  setupConnection() {
    if (this.conn) {
      this.conn.binaryType = "arraybuffer";
      this.conn.onopen = () => this._onConnOpen();
      this.conn.onerror = (error) => this._onConnError(error);
      this.conn.onmessage = (event) => this._onConnMessage(event);
      this.conn.onclose = (event) => this._onConnClose(event);
    }
  }
  /** @internal */
  _onConnMessage(rawMessage) {
    this.decode(rawMessage.data, (msg) => {
      let { topic, event, payload, ref } = msg;
      if (ref && ref === this.pendingHeartbeatRef) {
        this.pendingHeartbeatRef = null;
      }
      this.log("receive", `${payload.status || ""} ${topic} ${event} ${ref && "(" + ref + ")" || ""}`, payload);
      this.channels.filter((channel) => channel._isMember(topic)).forEach((channel) => channel._trigger(event, payload, ref));
      this.stateChangeCallbacks.message.forEach((callback) => callback(msg));
    });
  }
  /** @internal */
  async _onConnOpen() {
    this.log("transport", `connected to ${this.endpointURL()}`);
    this.flushSendBuffer();
    this.reconnectTimer.reset();
    if (!this.worker) {
      this.heartbeatTimer && clearInterval(this.heartbeatTimer);
      this.heartbeatTimer = setInterval(() => this.sendHeartbeat(), this.heartbeatIntervalMs);
    } else {
      if (this.workerUrl) {
        this.log("worker", `starting worker for from ${this.workerUrl}`);
      } else {
        this.log("worker", `starting default worker`);
      }
      const objectUrl = this._workerObjectUrl(this.workerUrl);
      this.workerRef = new Worker(objectUrl);
      this.workerRef.onerror = (error) => {
        this.log("worker", "worker error", error.message);
        this.workerRef.terminate();
      };
      this.workerRef.onmessage = (event) => {
        if (event.data.event === "keepAlive") {
          this.sendHeartbeat();
        }
      };
      this.workerRef.postMessage({
        event: "start",
        interval: this.heartbeatIntervalMs
      });
    }
    this.stateChangeCallbacks.open.forEach((callback) => callback());
  }
  /** @internal */
  _onConnClose(event) {
    this.log("transport", "close", event);
    this._triggerChanError();
    this.heartbeatTimer && clearInterval(this.heartbeatTimer);
    this.reconnectTimer.scheduleTimeout();
    this.stateChangeCallbacks.close.forEach((callback) => callback(event));
  }
  /** @internal */
  _onConnError(error) {
    this.log("transport", error.message);
    this._triggerChanError();
    this.stateChangeCallbacks.error.forEach((callback) => callback(error));
  }
  /** @internal */
  _triggerChanError() {
    this.channels.forEach((channel) => channel._trigger(CHANNEL_EVENTS.error));
  }
  /** @internal */
  _appendParams(url, params) {
    if (Object.keys(params).length === 0) {
      return url;
    }
    const prefix = url.match(/\?/) ? "&" : "?";
    const query = new URLSearchParams(params);
    return `${url}${prefix}${query}`;
  }
  _workerObjectUrl(url) {
    let result_url;
    if (url) {
      result_url = url;
    } else {
      const blob = new Blob([WORKER_SCRIPT], { type: "application/javascript" });
      result_url = URL.createObjectURL(blob);
    }
    return result_url;
  }
};
var WSWebSocketDummy = class {
  constructor(address, _protocols, options) {
    this.binaryType = "arraybuffer";
    this.onclose = () => {
    };
    this.onerror = () => {
    };
    this.onmessage = () => {
    };
    this.onopen = () => {
    };
    this.readyState = SOCKET_STATES.connecting;
    this.send = () => {
    };
    this.url = null;
    this.url = address;
    this.close = options.close;
  }
};

// node_modules/@supabase/storage-js/dist/module/lib/errors.js
var StorageError = class extends Error {
  constructor(message) {
    super(message);
    this.__isStorageError = true;
    this.name = "StorageError";
  }
};
function isStorageError(error) {
  return typeof error === "object" && error !== null && "__isStorageError" in error;
}
var StorageApiError = class extends StorageError {
  constructor(message, status) {
    super(message);
    this.name = "StorageApiError";
    this.status = status;
  }
  toJSON() {
    return {
      name: this.name,
      message: this.message,
      status: this.status
    };
  }
};
var StorageUnknownError = class extends StorageError {
  constructor(message, originalError) {
    super(message);
    this.name = "StorageUnknownError";
    this.originalError = originalError;
  }
};

// node_modules/@supabase/storage-js/dist/module/lib/helpers.js
var __awaiter2 = function(thisArg, _arguments, P, generator) {
  function adopt(value) {
    return value instanceof P ? value : new P(function(resolve) {
      resolve(value);
    });
  }
  return new (P || (P = Promise))(function(resolve, reject) {
    function fulfilled(value) {
      try {
        step(generator.next(value));
      } catch (e) {
        reject(e);
      }
    }
    function rejected(value) {
      try {
        step(generator["throw"](value));
      } catch (e) {
        reject(e);
      }
    }
    function step(result) {
      result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected);
    }
    step((generator = generator.apply(thisArg, _arguments || [])).next());
  });
};
var resolveFetch2 = (customFetch) => {
  let _fetch;
  if (customFetch) {
    _fetch = customFetch;
  } else if (typeof fetch === "undefined") {
    _fetch = (...args) => Promise.resolve().then(() => (init_browser(), browser_exports)).then(({ default: fetch3 }) => fetch3(...args));
  } else {
    _fetch = fetch;
  }
  return (...args) => _fetch(...args);
};
var resolveResponse = () => __awaiter2(void 0, void 0, void 0, function* () {
  if (typeof Response === "undefined") {
    return (yield Promise.resolve().then(() => (init_browser(), browser_exports))).Response;
  }
  return Response;
});
var recursiveToCamel = (item) => {
  if (Array.isArray(item)) {
    return item.map((el) => recursiveToCamel(el));
  } else if (typeof item === "function" || item !== Object(item)) {
    return item;
  }
  const result = {};
  Object.entries(item).forEach(([key, value]) => {
    const newKey = key.replace(/([-_][a-z])/gi, (c) => c.toUpperCase().replace(/[-_]/g, ""));
    result[newKey] = recursiveToCamel(value);
  });
  return result;
};

// node_modules/@supabase/storage-js/dist/module/lib/fetch.js
var __awaiter3 = function(thisArg, _arguments, P, generator) {
  function adopt(value) {
    return value instanceof P ? value : new P(function(resolve) {
      resolve(value);
    });
  }
  return new (P || (P = Promise))(function(resolve, reject) {
    function fulfilled(value) {
      try {
        step(generator.next(value));
      } catch (e) {
        reject(e);
      }
    }
    function rejected(value) {
      try {
        step(generator["throw"](value));
      } catch (e) {
        reject(e);
      }
    }
    function step(result) {
      result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected);
    }
    step((generator = generator.apply(thisArg, _arguments || [])).next());
  });
};
var _getErrorMessage = (err) => err.msg || err.message || err.error_description || err.error || JSON.stringify(err);
var handleError = (error, reject, options) => __awaiter3(void 0, void 0, void 0, function* () {
  const Res = yield resolveResponse();
  if (error instanceof Res && !(options === null || options === void 0 ? void 0 : options.noResolveJson)) {
    error.json().then((err) => {
      reject(new StorageApiError(_getErrorMessage(err), error.status || 500));
    }).catch((err) => {
      reject(new StorageUnknownError(_getErrorMessage(err), err));
    });
  } else {
    reject(new StorageUnknownError(_getErrorMessage(error), error));
  }
});
var _getRequestParams = (method, options, parameters, body) => {
  const params = { method, headers: (options === null || options === void 0 ? void 0 : options.headers) || {} };
  if (method === "GET") {
    return params;
  }
  params.headers = Object.assign({ "Content-Type": "application/json" }, options === null || options === void 0 ? void 0 : options.headers);
  if (body) {
    params.body = JSON.stringify(body);
  }
  return Object.assign(Object.assign({}, params), parameters);
};
function _handleRequest(fetcher, method, url, options, parameters, body) {
  return __awaiter3(this, void 0, void 0, function* () {
    return new Promise((resolve, reject) => {
      fetcher(url, _getRequestParams(method, options, parameters, body)).then((result) => {
        if (!result.ok)
          throw result;
        if (options === null || options === void 0 ? void 0 : options.noResolveJson)
          return result;
        return result.json();
      }).then((data) => resolve(data)).catch((error) => handleError(error, reject, options));
    });
  });
}
function get(fetcher, url, options, parameters) {
  return __awaiter3(this, void 0, void 0, function* () {
    return _handleRequest(fetcher, "GET", url, options, parameters);
  });
}
function post(fetcher, url, body, options, parameters) {
  return __awaiter3(this, void 0, void 0, function* () {
    return _handleRequest(fetcher, "POST", url, options, parameters, body);
  });
}
function put(fetcher, url, body, options, parameters) {
  return __awaiter3(this, void 0, void 0, function* () {
    return _handleRequest(fetcher, "PUT", url, options, parameters, body);
  });
}
function head(fetcher, url, options, parameters) {
  return __awaiter3(this, void 0, void 0, function* () {
    return _handleRequest(fetcher, "HEAD", url, Object.assign(Object.assign({}, options), { noResolveJson: true }), parameters);
  });
}
function remove(fetcher, url, body, options, parameters) {
  return __awaiter3(this, void 0, void 0, function* () {
    return _handleRequest(fetcher, "DELETE", url, options, parameters, body);
  });
}

// node_modules/@supabase/storage-js/dist/module/packages/StorageFileApi.js
var __awaiter4 = function(thisArg, _arguments, P, generator) {
  function adopt(value) {
    return value instanceof P ? value : new P(function(resolve) {
      resolve(value);
    });
  }
  return new (P || (P = Promise))(function(resolve, reject) {
    function fulfilled(value) {
      try {
        step(generator.next(value));
      } catch (e) {
        reject(e);
      }
    }
    function rejected(value) {
      try {
        step(generator["throw"](value));
      } catch (e) {
        reject(e);
      }
    }
    function step(result) {
      result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected);
    }
    step((generator = generator.apply(thisArg, _arguments || [])).next());
  });
};
var DEFAULT_SEARCH_OPTIONS = {
  limit: 100,
  offset: 0,
  sortBy: {
    column: "name",
    order: "asc"
  }
};
var DEFAULT_FILE_OPTIONS = {
  cacheControl: "3600",
  contentType: "text/plain;charset=UTF-8",
  upsert: false
};
var StorageFileApi = class {
  constructor(url, headers = {}, bucketId, fetch3) {
    this.url = url;
    this.headers = headers;
    this.bucketId = bucketId;
    this.fetch = resolveFetch2(fetch3);
  }
  /**
   * Uploads a file to an existing bucket or replaces an existing file at the specified path with a new one.
   *
   * @param method HTTP method.
   * @param path The relative file path. Should be of the format `folder/subfolder/filename.png`. The bucket must already exist before attempting to upload.
   * @param fileBody The body of the file to be stored in the bucket.
   */
  uploadOrUpdate(method, path, fileBody, fileOptions) {
    return __awaiter4(this, void 0, void 0, function* () {
      try {
        let body;
        const options = Object.assign(Object.assign({}, DEFAULT_FILE_OPTIONS), fileOptions);
        let headers = Object.assign(Object.assign({}, this.headers), method === "POST" && { "x-upsert": String(options.upsert) });
        const metadata = options.metadata;
        if (typeof Blob !== "undefined" && fileBody instanceof Blob) {
          body = new FormData();
          body.append("cacheControl", options.cacheControl);
          if (metadata) {
            body.append("metadata", this.encodeMetadata(metadata));
          }
          body.append("", fileBody);
        } else if (typeof FormData !== "undefined" && fileBody instanceof FormData) {
          body = fileBody;
          body.append("cacheControl", options.cacheControl);
          if (metadata) {
            body.append("metadata", this.encodeMetadata(metadata));
          }
        } else {
          body = fileBody;
          headers["cache-control"] = `max-age=${options.cacheControl}`;
          headers["content-type"] = options.contentType;
          if (metadata) {
            headers["x-metadata"] = this.toBase64(this.encodeMetadata(metadata));
          }
        }
        if (fileOptions === null || fileOptions === void 0 ? void 0 : fileOptions.headers) {
          headers = Object.assign(Object.assign({}, headers), fileOptions.headers);
        }
        const cleanPath = this._removeEmptyFolders(path);
        const _path = this._getFinalPath(cleanPath);
        const res = yield this.fetch(`${this.url}/object/${_path}`, Object.assign({ method, body, headers }, (options === null || options === void 0 ? void 0 : options.duplex) ? { duplex: options.duplex } : {}));
        const data = yield res.json();
        if (res.ok) {
          return {
            data: { path: cleanPath, id: data.Id, fullPath: data.Key },
            error: null
          };
        } else {
          const error = data;
          return { data: null, error };
        }
      } catch (error) {
        if (isStorageError(error)) {
          return { data: null, error };
        }
        throw error;
      }
    });
  }
  /**
   * Uploads a file to an existing bucket.
   *
   * @param path The file path, including the file name. Should be of the format `folder/subfolder/filename.png`. The bucket must already exist before attempting to upload.
   * @param fileBody The body of the file to be stored in the bucket.
   */
  upload(path, fileBody, fileOptions) {
    return __awaiter4(this, void 0, void 0, function* () {
      return this.uploadOrUpdate("POST", path, fileBody, fileOptions);
    });
  }
  /**
   * Upload a file with a token generated from `createSignedUploadUrl`.
   * @param path The file path, including the file name. Should be of the format `folder/subfolder/filename.png`. The bucket must already exist before attempting to upload.
   * @param token The token generated from `createSignedUploadUrl`
   * @param fileBody The body of the file to be stored in the bucket.
   */
  uploadToSignedUrl(path, token, fileBody, fileOptions) {
    return __awaiter4(this, void 0, void 0, function* () {
      const cleanPath = this._removeEmptyFolders(path);
      const _path = this._getFinalPath(cleanPath);
      const url = new URL(this.url + `/object/upload/sign/${_path}`);
      url.searchParams.set("token", token);
      try {
        let body;
        const options = Object.assign({ upsert: DEFAULT_FILE_OPTIONS.upsert }, fileOptions);
        const headers = Object.assign(Object.assign({}, this.headers), { "x-upsert": String(options.upsert) });
        if (typeof Blob !== "undefined" && fileBody instanceof Blob) {
          body = new FormData();
          body.append("cacheControl", options.cacheControl);
          body.append("", fileBody);
        } else if (typeof FormData !== "undefined" && fileBody instanceof FormData) {
          body = fileBody;
          body.append("cacheControl", options.cacheControl);
        } else {
          body = fileBody;
          headers["cache-control"] = `max-age=${options.cacheControl}`;
          headers["content-type"] = options.contentType;
        }
        const res = yield this.fetch(url.toString(), {
          method: "PUT",
          body,
          headers
        });
        const data = yield res.json();
        if (res.ok) {
          return {
            data: { path: cleanPath, fullPath: data.Key },
            error: null
          };
        } else {
          const error = data;
          return { data: null, error };
        }
      } catch (error) {
        if (isStorageError(error)) {
          return { data: null, error };
        }
        throw error;
      }
    });
  }
  /**
   * Creates a signed upload URL.
   * Signed upload URLs can be used to upload files to the bucket without further authentication.
   * They are valid for 2 hours.
   * @param path The file path, including the current file name. For example `folder/image.png`.
   * @param options.upsert If set to true, allows the file to be overwritten if it already exists.
   */
  createSignedUploadUrl(path, options) {
    return __awaiter4(this, void 0, void 0, function* () {
      try {
        let _path = this._getFinalPath(path);
        const headers = Object.assign({}, this.headers);
        if (options === null || options === void 0 ? void 0 : options.upsert) {
          headers["x-upsert"] = "true";
        }
        const data = yield post(this.fetch, `${this.url}/object/upload/sign/${_path}`, {}, { headers });
        const url = new URL(this.url + data.url);
        const token = url.searchParams.get("token");
        if (!token) {
          throw new StorageError("No token returned by API");
        }
        return { data: { signedUrl: url.toString(), path, token }, error: null };
      } catch (error) {
        if (isStorageError(error)) {
          return { data: null, error };
        }
        throw error;
      }
    });
  }
  /**
   * Replaces an existing file at the specified path with a new one.
   *
   * @param path The relative file path. Should be of the format `folder/subfolder/filename.png`. The bucket must already exist before attempting to update.
   * @param fileBody The body of the file to be stored in the bucket.
   */
  update(path, fileBody, fileOptions) {
    return __awaiter4(this, void 0, void 0, function* () {
      return this.uploadOrUpdate("PUT", path, fileBody, fileOptions);
    });
  }
  /**
   * Moves an existing file to a new path in the same bucket.
   *
   * @param fromPath The original file path, including the current file name. For example `folder/image.png`.
   * @param toPath The new file path, including the new file name. For example `folder/image-new.png`.
   * @param options The destination options.
   */
  move(fromPath, toPath, options) {
    return __awaiter4(this, void 0, void 0, function* () {
      try {
        const data = yield post(this.fetch, `${this.url}/object/move`, {
          bucketId: this.bucketId,
          sourceKey: fromPath,
          destinationKey: toPath,
          destinationBucket: options === null || options === void 0 ? void 0 : options.destinationBucket
        }, { headers: this.headers });
        return { data, error: null };
      } catch (error) {
        if (isStorageError(error)) {
          return { data: null, error };
        }
        throw error;
      }
    });
  }
  /**
   * Copies an existing file to a new path in the same bucket.
   *
   * @param fromPath The original file path, including the current file name. For example `folder/image.png`.
   * @param toPath The new file path, including the new file name. For example `folder/image-copy.png`.
   * @param options The destination options.
   */
  copy(fromPath, toPath, options) {
    return __awaiter4(this, void 0, void 0, function* () {
      try {
        const data = yield post(this.fetch, `${this.url}/object/copy`, {
          bucketId: this.bucketId,
          sourceKey: fromPath,
          destinationKey: toPath,
          destinationBucket: options === null || options === void 0 ? void 0 : options.destinationBucket
        }, { headers: this.headers });
        return { data: { path: data.Key }, error: null };
      } catch (error) {
        if (isStorageError(error)) {
          return { data: null, error };
        }
        throw error;
      }
    });
  }
  /**
   * Creates a signed URL. Use a signed URL to share a file for a fixed amount of time.
   *
   * @param path The file path, including the current file name. For example `folder/image.png`.
   * @param expiresIn The number of seconds until the signed URL expires. For example, `60` for a URL which is valid for one minute.
   * @param options.download triggers the file as a download if set to true. Set this parameter as the name of the file if you want to trigger the download with a different filename.
   * @param options.transform Transform the asset before serving it to the client.
   */
  createSignedUrl(path, expiresIn, options) {
    return __awaiter4(this, void 0, void 0, function* () {
      try {
        let _path = this._getFinalPath(path);
        let data = yield post(this.fetch, `${this.url}/object/sign/${_path}`, Object.assign({ expiresIn }, (options === null || options === void 0 ? void 0 : options.transform) ? { transform: options.transform } : {}), { headers: this.headers });
        const downloadQueryParam = (options === null || options === void 0 ? void 0 : options.download) ? `&download=${options.download === true ? "" : options.download}` : "";
        const signedUrl = encodeURI(`${this.url}${data.signedURL}${downloadQueryParam}`);
        data = { signedUrl };
        return { data, error: null };
      } catch (error) {
        if (isStorageError(error)) {
          return { data: null, error };
        }
        throw error;
      }
    });
  }
  /**
   * Creates multiple signed URLs. Use a signed URL to share a file for a fixed amount of time.
   *
   * @param paths The file paths to be downloaded, including the current file names. For example `['folder/image.png', 'folder2/image2.png']`.
   * @param expiresIn The number of seconds until the signed URLs expire. For example, `60` for URLs which are valid for one minute.
   * @param options.download triggers the file as a download if set to true. Set this parameter as the name of the file if you want to trigger the download with a different filename.
   */
  createSignedUrls(paths, expiresIn, options) {
    return __awaiter4(this, void 0, void 0, function* () {
      try {
        const data = yield post(this.fetch, `${this.url}/object/sign/${this.bucketId}`, { expiresIn, paths }, { headers: this.headers });
        const downloadQueryParam = (options === null || options === void 0 ? void 0 : options.download) ? `&download=${options.download === true ? "" : options.download}` : "";
        return {
          data: data.map((datum) => Object.assign(Object.assign({}, datum), { signedUrl: datum.signedURL ? encodeURI(`${this.url}${datum.signedURL}${downloadQueryParam}`) : null })),
          error: null
        };
      } catch (error) {
        if (isStorageError(error)) {
          return { data: null, error };
        }
        throw error;
      }
    });
  }
  /**
   * Downloads a file from a private bucket. For public buckets, make a request to the URL returned from `getPublicUrl` instead.
   *
   * @param path The full path and file name of the file to be downloaded. For example `folder/image.png`.
   * @param options.transform Transform the asset before serving it to the client.
   */
  download(path, options) {
    return __awaiter4(this, void 0, void 0, function* () {
      const wantsTransformation = typeof (options === null || options === void 0 ? void 0 : options.transform) !== "undefined";
      const renderPath = wantsTransformation ? "render/image/authenticated" : "object";
      const transformationQuery = this.transformOptsToQueryString((options === null || options === void 0 ? void 0 : options.transform) || {});
      const queryString = transformationQuery ? `?${transformationQuery}` : "";
      try {
        const _path = this._getFinalPath(path);
        const res = yield get(this.fetch, `${this.url}/${renderPath}/${_path}${queryString}`, {
          headers: this.headers,
          noResolveJson: true
        });
        const data = yield res.blob();
        return { data, error: null };
      } catch (error) {
        if (isStorageError(error)) {
          return { data: null, error };
        }
        throw error;
      }
    });
  }
  /**
   * Retrieves the details of an existing file.
   * @param path
   */
  info(path) {
    return __awaiter4(this, void 0, void 0, function* () {
      const _path = this._getFinalPath(path);
      try {
        const data = yield get(this.fetch, `${this.url}/object/info/${_path}`, {
          headers: this.headers
        });
        return { data: recursiveToCamel(data), error: null };
      } catch (error) {
        if (isStorageError(error)) {
          return { data: null, error };
        }
        throw error;
      }
    });
  }
  /**
   * Checks the existence of a file.
   * @param path
   */
  exists(path) {
    return __awaiter4(this, void 0, void 0, function* () {
      const _path = this._getFinalPath(path);
      try {
        yield head(this.fetch, `${this.url}/object/${_path}`, {
          headers: this.headers
        });
        return { data: true, error: null };
      } catch (error) {
        if (isStorageError(error) && error instanceof StorageUnknownError) {
          const originalError = error.originalError;
          if ([400, 404].includes(originalError === null || originalError === void 0 ? void 0 : originalError.status)) {
            return { data: false, error };
          }
        }
        throw error;
      }
    });
  }
  /**
   * A simple convenience function to get the URL for an asset in a public bucket. If you do not want to use this function, you can construct the public URL by concatenating the bucket URL with the path to the asset.
   * This function does not verify if the bucket is public. If a public URL is created for a bucket which is not public, you will not be able to download the asset.
   *
   * @param path The path and name of the file to generate the public URL for. For example `folder/image.png`.
   * @param options.download Triggers the file as a download if set to true. Set this parameter as the name of the file if you want to trigger the download with a different filename.
   * @param options.transform Transform the asset before serving it to the client.
   */
  getPublicUrl(path, options) {
    const _path = this._getFinalPath(path);
    const _queryString = [];
    const downloadQueryParam = (options === null || options === void 0 ? void 0 : options.download) ? `download=${options.download === true ? "" : options.download}` : "";
    if (downloadQueryParam !== "") {
      _queryString.push(downloadQueryParam);
    }
    const wantsTransformation = typeof (options === null || options === void 0 ? void 0 : options.transform) !== "undefined";
    const renderPath = wantsTransformation ? "render/image" : "object";
    const transformationQuery = this.transformOptsToQueryString((options === null || options === void 0 ? void 0 : options.transform) || {});
    if (transformationQuery !== "") {
      _queryString.push(transformationQuery);
    }
    let queryString = _queryString.join("&");
    if (queryString !== "") {
      queryString = `?${queryString}`;
    }
    return {
      data: { publicUrl: encodeURI(`${this.url}/${renderPath}/public/${_path}${queryString}`) }
    };
  }
  /**
   * Deletes files within the same bucket
   *
   * @param paths An array of files to delete, including the path and file name. For example [`'folder/image.png'`].
   */
  remove(paths) {
    return __awaiter4(this, void 0, void 0, function* () {
      try {
        const data = yield remove(this.fetch, `${this.url}/object/${this.bucketId}`, { prefixes: paths }, { headers: this.headers });
        return { data, error: null };
      } catch (error) {
        if (isStorageError(error)) {
          return { data: null, error };
        }
        throw error;
      }
    });
  }
  /**
   * Get file metadata
   * @param id the file id to retrieve metadata
   */
  // async getMetadata(
  //   id: string
  // ): Promise<
  //   | {
  //       data: Metadata
  //       error: null
  //     }
  //   | {
  //       data: null
  //       error: StorageError
  //     }
  // > {
  //   try {
  //     const data = await get(this.fetch, `${this.url}/metadata/${id}`, { headers: this.headers })
  //     return { data, error: null }
  //   } catch (error) {
  //     if (isStorageError(error)) {
  //       return { data: null, error }
  //     }
  //     throw error
  //   }
  // }
  /**
   * Update file metadata
   * @param id the file id to update metadata
   * @param meta the new file metadata
   */
  // async updateMetadata(
  //   id: string,
  //   meta: Metadata
  // ): Promise<
  //   | {
  //       data: Metadata
  //       error: null
  //     }
  //   | {
  //       data: null
  //       error: StorageError
  //     }
  // > {
  //   try {
  //     const data = await post(
  //       this.fetch,
  //       `${this.url}/metadata/${id}`,
  //       { ...meta },
  //       { headers: this.headers }
  //     )
  //     return { data, error: null }
  //   } catch (error) {
  //     if (isStorageError(error)) {
  //       return { data: null, error }
  //     }
  //     throw error
  //   }
  // }
  /**
   * Lists all the files within a bucket.
   * @param path The folder path.
   */
  list(path, options, parameters) {
    return __awaiter4(this, void 0, void 0, function* () {
      try {
        const body = Object.assign(Object.assign(Object.assign({}, DEFAULT_SEARCH_OPTIONS), options), { prefix: path || "" });
        const data = yield post(this.fetch, `${this.url}/object/list/${this.bucketId}`, body, { headers: this.headers }, parameters);
        return { data, error: null };
      } catch (error) {
        if (isStorageError(error)) {
          return { data: null, error };
        }
        throw error;
      }
    });
  }
  encodeMetadata(metadata) {
    return JSON.stringify(metadata);
  }
  toBase64(data) {
    if (typeof Buffer !== "undefined") {
      return Buffer.from(data).toString("base64");
    }
    return btoa(data);
  }
  _getFinalPath(path) {
    return `${this.bucketId}/${path}`;
  }
  _removeEmptyFolders(path) {
    return path.replace(/^\/|\/$/g, "").replace(/\/+/g, "/");
  }
  transformOptsToQueryString(transform) {
    const params = [];
    if (transform.width) {
      params.push(`width=${transform.width}`);
    }
    if (transform.height) {
      params.push(`height=${transform.height}`);
    }
    if (transform.resize) {
      params.push(`resize=${transform.resize}`);
    }
    if (transform.format) {
      params.push(`format=${transform.format}`);
    }
    if (transform.quality) {
      params.push(`quality=${transform.quality}`);
    }
    return params.join("&");
  }
};

// node_modules/@supabase/storage-js/dist/module/lib/version.js
var version2 = "2.7.1";

// node_modules/@supabase/storage-js/dist/module/lib/constants.js
var DEFAULT_HEADERS2 = { "X-Client-Info": `storage-js/${version2}` };

// node_modules/@supabase/storage-js/dist/module/packages/StorageBucketApi.js
var __awaiter5 = function(thisArg, _arguments, P, generator) {
  function adopt(value) {
    return value instanceof P ? value : new P(function(resolve) {
      resolve(value);
    });
  }
  return new (P || (P = Promise))(function(resolve, reject) {
    function fulfilled(value) {
      try {
        step(generator.next(value));
      } catch (e) {
        reject(e);
      }
    }
    function rejected(value) {
      try {
        step(generator["throw"](value));
      } catch (e) {
        reject(e);
      }
    }
    function step(result) {
      result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected);
    }
    step((generator = generator.apply(thisArg, _arguments || [])).next());
  });
};
var StorageBucketApi = class {
  constructor(url, headers = {}, fetch3) {
    this.url = url;
    this.headers = Object.assign(Object.assign({}, DEFAULT_HEADERS2), headers);
    this.fetch = resolveFetch2(fetch3);
  }
  /**
   * Retrieves the details of all Storage buckets within an existing project.
   */
  listBuckets() {
    return __awaiter5(this, void 0, void 0, function* () {
      try {
        const data = yield get(this.fetch, `${this.url}/bucket`, { headers: this.headers });
        return { data, error: null };
      } catch (error) {
        if (isStorageError(error)) {
          return { data: null, error };
        }
        throw error;
      }
    });
  }
  /**
   * Retrieves the details of an existing Storage bucket.
   *
   * @param id The unique identifier of the bucket you would like to retrieve.
   */
  getBucket(id) {
    return __awaiter5(this, void 0, void 0, function* () {
      try {
        const data = yield get(this.fetch, `${this.url}/bucket/${id}`, { headers: this.headers });
        return { data, error: null };
      } catch (error) {
        if (isStorageError(error)) {
          return { data: null, error };
        }
        throw error;
      }
    });
  }
  /**
   * Creates a new Storage bucket
   *
   * @param id A unique identifier for the bucket you are creating.
   * @param options.public The visibility of the bucket. Public buckets don't require an authorization token to download objects, but still require a valid token for all other operations. By default, buckets are private.
   * @param options.fileSizeLimit specifies the max file size in bytes that can be uploaded to this bucket.
   * The global file size limit takes precedence over this value.
   * The default value is null, which doesn't set a per bucket file size limit.
   * @param options.allowedMimeTypes specifies the allowed mime types that this bucket can accept during upload.
   * The default value is null, which allows files with all mime types to be uploaded.
   * Each mime type specified can be a wildcard, e.g. image/*, or a specific mime type, e.g. image/png.
   * @returns newly created bucket id
   */
  createBucket(id, options = {
    public: false
  }) {
    return __awaiter5(this, void 0, void 0, function* () {
      try {
        const data = yield post(this.fetch, `${this.url}/bucket`, {
          id,
          name: id,
          public: options.public,
          file_size_limit: options.fileSizeLimit,
          allowed_mime_types: options.allowedMimeTypes
        }, { headers: this.headers });
        return { data, error: null };
      } catch (error) {
        if (isStorageError(error)) {
          return { data: null, error };
        }
        throw error;
      }
    });
  }
  /**
   * Updates a Storage bucket
   *
   * @param id A unique identifier for the bucket you are updating.
   * @param options.public The visibility of the bucket. Public buckets don't require an authorization token to download objects, but still require a valid token for all other operations.
   * @param options.fileSizeLimit specifies the max file size in bytes that can be uploaded to this bucket.
   * The global file size limit takes precedence over this value.
   * The default value is null, which doesn't set a per bucket file size limit.
   * @param options.allowedMimeTypes specifies the allowed mime types that this bucket can accept during upload.
   * The default value is null, which allows files with all mime types to be uploaded.
   * Each mime type specified can be a wildcard, e.g. image/*, or a specific mime type, e.g. image/png.
   */
  updateBucket(id, options) {
    return __awaiter5(this, void 0, void 0, function* () {
      try {
        const data = yield put(this.fetch, `${this.url}/bucket/${id}`, {
          id,
          name: id,
          public: options.public,
          file_size_limit: options.fileSizeLimit,
          allowed_mime_types: options.allowedMimeTypes
        }, { headers: this.headers });
        return { data, error: null };
      } catch (error) {
        if (isStorageError(error)) {
          return { data: null, error };
        }
        throw error;
      }
    });
  }
  /**
   * Removes all objects inside a single bucket.
   *
   * @param id The unique identifier of the bucket you would like to empty.
   */
  emptyBucket(id) {
    return __awaiter5(this, void 0, void 0, function* () {
      try {
        const data = yield post(this.fetch, `${this.url}/bucket/${id}/empty`, {}, { headers: this.headers });
        return { data, error: null };
      } catch (error) {
        if (isStorageError(error)) {
          return { data: null, error };
        }
        throw error;
      }
    });
  }
  /**
   * Deletes an existing bucket. A bucket can't be deleted with existing objects inside it.
   * You must first `empty()` the bucket.
   *
   * @param id The unique identifier of the bucket you would like to delete.
   */
  deleteBucket(id) {
    return __awaiter5(this, void 0, void 0, function* () {
      try {
        const data = yield remove(this.fetch, `${this.url}/bucket/${id}`, {}, { headers: this.headers });
        return { data, error: null };
      } catch (error) {
        if (isStorageError(error)) {
          return { data: null, error };
        }
        throw error;
      }
    });
  }
};

// node_modules/@supabase/storage-js/dist/module/StorageClient.js
var StorageClient = class extends StorageBucketApi {
  constructor(url, headers = {}, fetch3) {
    super(url, headers, fetch3);
  }
  /**
   * Perform file operation in a bucket.
   *
   * @param id The bucket id to operate on.
   */
  from(id) {
    return new StorageFileApi(this.url, this.headers, id, this.fetch);
  }
};

// node_modules/@supabase/supabase-js/dist/module/lib/version.js
var version3 = "2.49.8";

// node_modules/@supabase/supabase-js/dist/module/lib/constants.js
var JS_ENV = "";
if (typeof Deno !== "undefined") {
  JS_ENV = "deno";
} else if (typeof document !== "undefined") {
  JS_ENV = "web";
} else if (typeof navigator !== "undefined" && navigator.product === "ReactNative") {
  JS_ENV = "react-native";
} else {
  JS_ENV = "node";
}
var DEFAULT_HEADERS3 = { "X-Client-Info": `supabase-js-${JS_ENV}/${version3}` };
var DEFAULT_GLOBAL_OPTIONS = {
  headers: DEFAULT_HEADERS3
};
var DEFAULT_DB_OPTIONS = {
  schema: "public"
};
var DEFAULT_AUTH_OPTIONS = {
  autoRefreshToken: true,
  persistSession: true,
  detectSessionInUrl: true,
  flowType: "implicit"
};
var DEFAULT_REALTIME_OPTIONS = {};

// node_modules/@supabase/supabase-js/dist/module/lib/fetch.js
init_browser();
var __awaiter6 = function(thisArg, _arguments, P, generator) {
  function adopt(value) {
    return value instanceof P ? value : new P(function(resolve) {
      resolve(value);
    });
  }
  return new (P || (P = Promise))(function(resolve, reject) {
    function fulfilled(value) {
      try {
        step(generator.next(value));
      } catch (e) {
        reject(e);
      }
    }
    function rejected(value) {
      try {
        step(generator["throw"](value));
      } catch (e) {
        reject(e);
      }
    }
    function step(result) {
      result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected);
    }
    step((generator = generator.apply(thisArg, _arguments || [])).next());
  });
};
var resolveFetch3 = (customFetch) => {
  let _fetch;
  if (customFetch) {
    _fetch = customFetch;
  } else if (typeof fetch === "undefined") {
    _fetch = browser_default;
  } else {
    _fetch = fetch;
  }
  return (...args) => _fetch(...args);
};
var resolveHeadersConstructor = () => {
  if (typeof Headers === "undefined") {
    return Headers2;
  }
  return Headers;
};
var fetchWithAuth = (supabaseKey, getAccessToken, customFetch) => {
  const fetch3 = resolveFetch3(customFetch);
  const HeadersConstructor = resolveHeadersConstructor();
  return (input, init) => __awaiter6(void 0, void 0, void 0, function* () {
    var _a;
    const accessToken = (_a = yield getAccessToken()) !== null && _a !== void 0 ? _a : supabaseKey;
    let headers = new HeadersConstructor(init === null || init === void 0 ? void 0 : init.headers);
    if (!headers.has("apikey")) {
      headers.set("apikey", supabaseKey);
    }
    if (!headers.has("Authorization")) {
      headers.set("Authorization", `Bearer ${accessToken}`);
    }
    return fetch3(input, Object.assign(Object.assign({}, init), { headers }));
  });
};

// node_modules/@supabase/supabase-js/dist/module/lib/helpers.js
var __awaiter7 = function(thisArg, _arguments, P, generator) {
  function adopt(value) {
    return value instanceof P ? value : new P(function(resolve) {
      resolve(value);
    });
  }
  return new (P || (P = Promise))(function(resolve, reject) {
    function fulfilled(value) {
      try {
        step(generator.next(value));
      } catch (e) {
        reject(e);
      }
    }
    function rejected(value) {
      try {
        step(generator["throw"](value));
      } catch (e) {
        reject(e);
      }
    }
    function step(result) {
      result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected);
    }
    step((generator = generator.apply(thisArg, _arguments || [])).next());
  });
};
function ensureTrailingSlash(url) {
  return url.endsWith("/") ? url : url + "/";
}
function applySettingDefaults(options, defaults) {
  var _a, _b;
  const { db: dbOptions, auth: authOptions, realtime: realtimeOptions, global: globalOptions } = options;
  const { db: DEFAULT_DB_OPTIONS2, auth: DEFAULT_AUTH_OPTIONS2, realtime: DEFAULT_REALTIME_OPTIONS2, global: DEFAULT_GLOBAL_OPTIONS2 } = defaults;
  const result = {
    db: Object.assign(Object.assign({}, DEFAULT_DB_OPTIONS2), dbOptions),
    auth: Object.assign(Object.assign({}, DEFAULT_AUTH_OPTIONS2), authOptions),
    realtime: Object.assign(Object.assign({}, DEFAULT_REALTIME_OPTIONS2), realtimeOptions),
    global: Object.assign(Object.assign(Object.assign({}, DEFAULT_GLOBAL_OPTIONS2), globalOptions), { headers: Object.assign(Object.assign({}, (_a = DEFAULT_GLOBAL_OPTIONS2 === null || DEFAULT_GLOBAL_OPTIONS2 === void 0 ? void 0 : DEFAULT_GLOBAL_OPTIONS2.headers) !== null && _a !== void 0 ? _a : {}), (_b = globalOptions === null || globalOptions === void 0 ? void 0 : globalOptions.headers) !== null && _b !== void 0 ? _b : {}) }),
    accessToken: () => __awaiter7(this, void 0, void 0, function* () {
      return "";
    })
  };
  if (options.accessToken) {
    result.accessToken = options.accessToken;
  } else {
    delete result.accessToken;
  }
  return result;
}

// node_modules/@supabase/auth-js/dist/module/lib/version.js
var version4 = "2.69.1";

// node_modules/@supabase/auth-js/dist/module/lib/constants.js
var AUTO_REFRESH_TICK_DURATION_MS = 30 * 1e3;
var AUTO_REFRESH_TICK_THRESHOLD = 3;
var EXPIRY_MARGIN_MS = AUTO_REFRESH_TICK_THRESHOLD * AUTO_REFRESH_TICK_DURATION_MS;
var GOTRUE_URL = "http://localhost:9999";
var STORAGE_KEY = "supabase.auth.token";
var DEFAULT_HEADERS4 = { "X-Client-Info": `gotrue-js/${version4}` };
var API_VERSION_HEADER_NAME = "X-Supabase-Api-Version";
var API_VERSIONS = {
  "2024-01-01": {
    timestamp: Date.parse("2024-01-01T00:00:00.0Z"),
    name: "2024-01-01"
  }
};
var BASE64URL_REGEX = /^([a-z0-9_-]{4})*($|[a-z0-9_-]{3}$|[a-z0-9_-]{2}$)$/i;
var JWKS_TTL = 6e5;

// node_modules/@supabase/auth-js/dist/module/lib/errors.js
var AuthError = class extends Error {
  constructor(message, status, code) {
    super(message);
    this.__isAuthError = true;
    this.name = "AuthError";
    this.status = status;
    this.code = code;
  }
};
function isAuthError(error) {
  return typeof error === "object" && error !== null && "__isAuthError" in error;
}
var AuthApiError = class extends AuthError {
  constructor(message, status, code) {
    super(message, status, code);
    this.name = "AuthApiError";
    this.status = status;
    this.code = code;
  }
};
function isAuthApiError(error) {
  return isAuthError(error) && error.name === "AuthApiError";
}
var AuthUnknownError = class extends AuthError {
  constructor(message, originalError) {
    super(message);
    this.name = "AuthUnknownError";
    this.originalError = originalError;
  }
};
var CustomAuthError = class extends AuthError {
  constructor(message, name, status, code) {
    super(message, status, code);
    this.name = name;
    this.status = status;
  }
};
var AuthSessionMissingError = class extends CustomAuthError {
  constructor() {
    super("Auth session missing!", "AuthSessionMissingError", 400, void 0);
  }
};
function isAuthSessionMissingError(error) {
  return isAuthError(error) && error.name === "AuthSessionMissingError";
}
var AuthInvalidTokenResponseError = class extends CustomAuthError {
  constructor() {
    super("Auth session or user missing", "AuthInvalidTokenResponseError", 500, void 0);
  }
};
var AuthInvalidCredentialsError = class extends CustomAuthError {
  constructor(message) {
    super(message, "AuthInvalidCredentialsError", 400, void 0);
  }
};
var AuthImplicitGrantRedirectError = class extends CustomAuthError {
  constructor(message, details = null) {
    super(message, "AuthImplicitGrantRedirectError", 500, void 0);
    this.details = null;
    this.details = details;
  }
  toJSON() {
    return {
      name: this.name,
      message: this.message,
      status: this.status,
      details: this.details
    };
  }
};
function isAuthImplicitGrantRedirectError(error) {
  return isAuthError(error) && error.name === "AuthImplicitGrantRedirectError";
}
var AuthPKCEGrantCodeExchangeError = class extends CustomAuthError {
  constructor(message, details = null) {
    super(message, "AuthPKCEGrantCodeExchangeError", 500, void 0);
    this.details = null;
    this.details = details;
  }
  toJSON() {
    return {
      name: this.name,
      message: this.message,
      status: this.status,
      details: this.details
    };
  }
};
var AuthRetryableFetchError = class extends CustomAuthError {
  constructor(message, status) {
    super(message, "AuthRetryableFetchError", status, void 0);
  }
};
function isAuthRetryableFetchError(error) {
  return isAuthError(error) && error.name === "AuthRetryableFetchError";
}
var AuthWeakPasswordError = class extends CustomAuthError {
  constructor(message, status, reasons) {
    super(message, "AuthWeakPasswordError", status, "weak_password");
    this.reasons = reasons;
  }
};
var AuthInvalidJwtError = class extends CustomAuthError {
  constructor(message) {
    super(message, "AuthInvalidJwtError", 400, "invalid_jwt");
  }
};

// node_modules/@supabase/auth-js/dist/module/lib/base64url.js
var TO_BASE64URL = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-_".split("");
var IGNORE_BASE64URL = " 	\n\r=".split("");
var FROM_BASE64URL = (() => {
  const charMap = new Array(128);
  for (let i = 0; i < charMap.length; i += 1) {
    charMap[i] = -1;
  }
  for (let i = 0; i < IGNORE_BASE64URL.length; i += 1) {
    charMap[IGNORE_BASE64URL[i].charCodeAt(0)] = -2;
  }
  for (let i = 0; i < TO_BASE64URL.length; i += 1) {
    charMap[TO_BASE64URL[i].charCodeAt(0)] = i;
  }
  return charMap;
})();
function byteFromBase64URL(charCode, state, emit) {
  const bits = FROM_BASE64URL[charCode];
  if (bits > -1) {
    state.queue = state.queue << 6 | bits;
    state.queuedBits += 6;
    while (state.queuedBits >= 8) {
      emit(state.queue >> state.queuedBits - 8 & 255);
      state.queuedBits -= 8;
    }
  } else if (bits === -2) {
    return;
  } else {
    throw new Error(`Invalid Base64-URL character "${String.fromCharCode(charCode)}"`);
  }
}
function stringFromBase64URL(str) {
  const conv = [];
  const utf8Emit = (codepoint) => {
    conv.push(String.fromCodePoint(codepoint));
  };
  const utf8State = {
    utf8seq: 0,
    codepoint: 0
  };
  const b64State = { queue: 0, queuedBits: 0 };
  const byteEmit = (byte) => {
    stringFromUTF8(byte, utf8State, utf8Emit);
  };
  for (let i = 0; i < str.length; i += 1) {
    byteFromBase64URL(str.charCodeAt(i), b64State, byteEmit);
  }
  return conv.join("");
}
function codepointToUTF8(codepoint, emit) {
  if (codepoint <= 127) {
    emit(codepoint);
    return;
  } else if (codepoint <= 2047) {
    emit(192 | codepoint >> 6);
    emit(128 | codepoint & 63);
    return;
  } else if (codepoint <= 65535) {
    emit(224 | codepoint >> 12);
    emit(128 | codepoint >> 6 & 63);
    emit(128 | codepoint & 63);
    return;
  } else if (codepoint <= 1114111) {
    emit(240 | codepoint >> 18);
    emit(128 | codepoint >> 12 & 63);
    emit(128 | codepoint >> 6 & 63);
    emit(128 | codepoint & 63);
    return;
  }
  throw new Error(`Unrecognized Unicode codepoint: ${codepoint.toString(16)}`);
}
function stringToUTF8(str, emit) {
  for (let i = 0; i < str.length; i += 1) {
    let codepoint = str.charCodeAt(i);
    if (codepoint > 55295 && codepoint <= 56319) {
      const highSurrogate = (codepoint - 55296) * 1024 & 65535;
      const lowSurrogate = str.charCodeAt(i + 1) - 56320 & 65535;
      codepoint = (lowSurrogate | highSurrogate) + 65536;
      i += 1;
    }
    codepointToUTF8(codepoint, emit);
  }
}
function stringFromUTF8(byte, state, emit) {
  if (state.utf8seq === 0) {
    if (byte <= 127) {
      emit(byte);
      return;
    }
    for (let leadingBit = 1; leadingBit < 6; leadingBit += 1) {
      if ((byte >> 7 - leadingBit & 1) === 0) {
        state.utf8seq = leadingBit;
        break;
      }
    }
    if (state.utf8seq === 2) {
      state.codepoint = byte & 31;
    } else if (state.utf8seq === 3) {
      state.codepoint = byte & 15;
    } else if (state.utf8seq === 4) {
      state.codepoint = byte & 7;
    } else {
      throw new Error("Invalid UTF-8 sequence");
    }
    state.utf8seq -= 1;
  } else if (state.utf8seq > 0) {
    if (byte <= 127) {
      throw new Error("Invalid UTF-8 sequence");
    }
    state.codepoint = state.codepoint << 6 | byte & 63;
    state.utf8seq -= 1;
    if (state.utf8seq === 0) {
      emit(state.codepoint);
    }
  }
}
function base64UrlToUint8Array(str) {
  const result = [];
  const state = { queue: 0, queuedBits: 0 };
  const onByte = (byte) => {
    result.push(byte);
  };
  for (let i = 0; i < str.length; i += 1) {
    byteFromBase64URL(str.charCodeAt(i), state, onByte);
  }
  return new Uint8Array(result);
}
function stringToUint8Array(str) {
  const result = [];
  stringToUTF8(str, (byte) => result.push(byte));
  return new Uint8Array(result);
}

// node_modules/@supabase/auth-js/dist/module/lib/helpers.js
function expiresAt(expiresIn) {
  const timeNow = Math.round(Date.now() / 1e3);
  return timeNow + expiresIn;
}
function uuid() {
  return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, function(c) {
    const r = Math.random() * 16 | 0, v = c == "x" ? r : r & 3 | 8;
    return v.toString(16);
  });
}
var isBrowser = () => typeof window !== "undefined" && typeof document !== "undefined";
var localStorageWriteTests = {
  tested: false,
  writable: false
};
var supportsLocalStorage = () => {
  if (!isBrowser()) {
    return false;
  }
  try {
    if (typeof globalThis.localStorage !== "object") {
      return false;
    }
  } catch (e) {
    return false;
  }
  if (localStorageWriteTests.tested) {
    return localStorageWriteTests.writable;
  }
  const randomKey = `lswt-${Math.random()}${Math.random()}`;
  try {
    globalThis.localStorage.setItem(randomKey, randomKey);
    globalThis.localStorage.removeItem(randomKey);
    localStorageWriteTests.tested = true;
    localStorageWriteTests.writable = true;
  } catch (e) {
    localStorageWriteTests.tested = true;
    localStorageWriteTests.writable = false;
  }
  return localStorageWriteTests.writable;
};
function parseParametersFromURL(href) {
  const result = {};
  const url = new URL(href);
  if (url.hash && url.hash[0] === "#") {
    try {
      const hashSearchParams = new URLSearchParams(url.hash.substring(1));
      hashSearchParams.forEach((value, key) => {
        result[key] = value;
      });
    } catch (e) {
    }
  }
  url.searchParams.forEach((value, key) => {
    result[key] = value;
  });
  return result;
}
var resolveFetch4 = (customFetch) => {
  let _fetch;
  if (customFetch) {
    _fetch = customFetch;
  } else if (typeof fetch === "undefined") {
    _fetch = (...args) => Promise.resolve().then(() => (init_browser(), browser_exports)).then(({ default: fetch3 }) => fetch3(...args));
  } else {
    _fetch = fetch;
  }
  return (...args) => _fetch(...args);
};
var looksLikeFetchResponse = (maybeResponse) => {
  return typeof maybeResponse === "object" && maybeResponse !== null && "status" in maybeResponse && "ok" in maybeResponse && "json" in maybeResponse && typeof maybeResponse.json === "function";
};
var setItemAsync = async (storage, key, data) => {
  await storage.setItem(key, JSON.stringify(data));
};
var getItemAsync = async (storage, key) => {
  const value = await storage.getItem(key);
  if (!value) {
    return null;
  }
  try {
    return JSON.parse(value);
  } catch (_a) {
    return value;
  }
};
var removeItemAsync = async (storage, key) => {
  await storage.removeItem(key);
};
var Deferred = class _Deferred {
  constructor() {
    ;
    this.promise = new _Deferred.promiseConstructor((res, rej) => {
      ;
      this.resolve = res;
      this.reject = rej;
    });
  }
};
Deferred.promiseConstructor = Promise;
function decodeJWT(token) {
  const parts = token.split(".");
  if (parts.length !== 3) {
    throw new AuthInvalidJwtError("Invalid JWT structure");
  }
  for (let i = 0; i < parts.length; i++) {
    if (!BASE64URL_REGEX.test(parts[i])) {
      throw new AuthInvalidJwtError("JWT not in base64url format");
    }
  }
  const data = {
    // using base64url lib
    header: JSON.parse(stringFromBase64URL(parts[0])),
    payload: JSON.parse(stringFromBase64URL(parts[1])),
    signature: base64UrlToUint8Array(parts[2]),
    raw: {
      header: parts[0],
      payload: parts[1]
    }
  };
  return data;
}
async function sleep(time) {
  return await new Promise((accept) => {
    setTimeout(() => accept(null), time);
  });
}
function retryable(fn, isRetryable) {
  const promise = new Promise((accept, reject) => {
    ;
    (async () => {
      for (let attempt = 0; attempt < Infinity; attempt++) {
        try {
          const result = await fn(attempt);
          if (!isRetryable(attempt, null, result)) {
            accept(result);
            return;
          }
        } catch (e) {
          if (!isRetryable(attempt, e)) {
            reject(e);
            return;
          }
        }
      }
    })();
  });
  return promise;
}
function dec2hex(dec) {
  return ("0" + dec.toString(16)).substr(-2);
}
function generatePKCEVerifier() {
  const verifierLength = 56;
  const array = new Uint32Array(verifierLength);
  if (typeof crypto === "undefined") {
    const charSet = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-._~";
    const charSetLen = charSet.length;
    let verifier = "";
    for (let i = 0; i < verifierLength; i++) {
      verifier += charSet.charAt(Math.floor(Math.random() * charSetLen));
    }
    return verifier;
  }
  crypto.getRandomValues(array);
  return Array.from(array, dec2hex).join("");
}
async function sha256(randomString) {
  const encoder = new TextEncoder();
  const encodedData = encoder.encode(randomString);
  const hash = await crypto.subtle.digest("SHA-256", encodedData);
  const bytes = new Uint8Array(hash);
  return Array.from(bytes).map((c) => String.fromCharCode(c)).join("");
}
async function generatePKCEChallenge(verifier) {
  const hasCryptoSupport = typeof crypto !== "undefined" && typeof crypto.subtle !== "undefined" && typeof TextEncoder !== "undefined";
  if (!hasCryptoSupport) {
    console.warn("WebCrypto API is not supported. Code challenge method will default to use plain instead of sha256.");
    return verifier;
  }
  const hashed = await sha256(verifier);
  return btoa(hashed).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}
async function getCodeChallengeAndMethod(storage, storageKey, isPasswordRecovery = false) {
  const codeVerifier = generatePKCEVerifier();
  let storedCodeVerifier = codeVerifier;
  if (isPasswordRecovery) {
    storedCodeVerifier += "/PASSWORD_RECOVERY";
  }
  await setItemAsync(storage, `${storageKey}-code-verifier`, storedCodeVerifier);
  const codeChallenge = await generatePKCEChallenge(codeVerifier);
  const codeChallengeMethod = codeVerifier === codeChallenge ? "plain" : "s256";
  return [codeChallenge, codeChallengeMethod];
}
var API_VERSION_REGEX = /^2[0-9]{3}-(0[1-9]|1[0-2])-(0[1-9]|1[0-9]|2[0-9]|3[0-1])$/i;
function parseResponseAPIVersion(response) {
  const apiVersion = response.headers.get(API_VERSION_HEADER_NAME);
  if (!apiVersion) {
    return null;
  }
  if (!apiVersion.match(API_VERSION_REGEX)) {
    return null;
  }
  try {
    const date = /* @__PURE__ */ new Date(`${apiVersion}T00:00:00.0Z`);
    return date;
  } catch (e) {
    return null;
  }
}
function validateExp(exp) {
  if (!exp) {
    throw new Error("Missing exp claim");
  }
  const timeNow = Math.floor(Date.now() / 1e3);
  if (exp <= timeNow) {
    throw new Error("JWT has expired");
  }
}
function getAlgorithm(alg) {
  switch (alg) {
    case "RS256":
      return {
        name: "RSASSA-PKCS1-v1_5",
        hash: { name: "SHA-256" }
      };
    case "ES256":
      return {
        name: "ECDSA",
        namedCurve: "P-256",
        hash: { name: "SHA-256" }
      };
    default:
      throw new Error("Invalid alg claim");
  }
}

// node_modules/@supabase/auth-js/dist/module/lib/fetch.js
var __rest = function(s, e) {
  var t = {};
  for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
    t[p] = s[p];
  if (s != null && typeof Object.getOwnPropertySymbols === "function")
    for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
      if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
        t[p[i]] = s[p[i]];
    }
  return t;
};
var _getErrorMessage2 = (err) => err.msg || err.message || err.error_description || err.error || JSON.stringify(err);
var NETWORK_ERROR_CODES = [502, 503, 504];
async function handleError2(error) {
  var _a;
  if (!looksLikeFetchResponse(error)) {
    throw new AuthRetryableFetchError(_getErrorMessage2(error), 0);
  }
  if (NETWORK_ERROR_CODES.includes(error.status)) {
    throw new AuthRetryableFetchError(_getErrorMessage2(error), error.status);
  }
  let data;
  try {
    data = await error.json();
  } catch (e) {
    throw new AuthUnknownError(_getErrorMessage2(e), e);
  }
  let errorCode = void 0;
  const responseAPIVersion = parseResponseAPIVersion(error);
  if (responseAPIVersion && responseAPIVersion.getTime() >= API_VERSIONS["2024-01-01"].timestamp && typeof data === "object" && data && typeof data.code === "string") {
    errorCode = data.code;
  } else if (typeof data === "object" && data && typeof data.error_code === "string") {
    errorCode = data.error_code;
  }
  if (!errorCode) {
    if (typeof data === "object" && data && typeof data.weak_password === "object" && data.weak_password && Array.isArray(data.weak_password.reasons) && data.weak_password.reasons.length && data.weak_password.reasons.reduce((a, i) => a && typeof i === "string", true)) {
      throw new AuthWeakPasswordError(_getErrorMessage2(data), error.status, data.weak_password.reasons);
    }
  } else if (errorCode === "weak_password") {
    throw new AuthWeakPasswordError(_getErrorMessage2(data), error.status, ((_a = data.weak_password) === null || _a === void 0 ? void 0 : _a.reasons) || []);
  } else if (errorCode === "session_not_found") {
    throw new AuthSessionMissingError();
  }
  throw new AuthApiError(_getErrorMessage2(data), error.status || 500, errorCode);
}
var _getRequestParams2 = (method, options, parameters, body) => {
  const params = { method, headers: (options === null || options === void 0 ? void 0 : options.headers) || {} };
  if (method === "GET") {
    return params;
  }
  params.headers = Object.assign({ "Content-Type": "application/json;charset=UTF-8" }, options === null || options === void 0 ? void 0 : options.headers);
  params.body = JSON.stringify(body);
  return Object.assign(Object.assign({}, params), parameters);
};
async function _request(fetcher, method, url, options) {
  var _a;
  const headers = Object.assign({}, options === null || options === void 0 ? void 0 : options.headers);
  if (!headers[API_VERSION_HEADER_NAME]) {
    headers[API_VERSION_HEADER_NAME] = API_VERSIONS["2024-01-01"].name;
  }
  if (options === null || options === void 0 ? void 0 : options.jwt) {
    headers["Authorization"] = `Bearer ${options.jwt}`;
  }
  const qs = (_a = options === null || options === void 0 ? void 0 : options.query) !== null && _a !== void 0 ? _a : {};
  if (options === null || options === void 0 ? void 0 : options.redirectTo) {
    qs["redirect_to"] = options.redirectTo;
  }
  const queryString = Object.keys(qs).length ? "?" + new URLSearchParams(qs).toString() : "";
  const data = await _handleRequest2(fetcher, method, url + queryString, {
    headers,
    noResolveJson: options === null || options === void 0 ? void 0 : options.noResolveJson
  }, {}, options === null || options === void 0 ? void 0 : options.body);
  return (options === null || options === void 0 ? void 0 : options.xform) ? options === null || options === void 0 ? void 0 : options.xform(data) : { data: Object.assign({}, data), error: null };
}
async function _handleRequest2(fetcher, method, url, options, parameters, body) {
  const requestParams = _getRequestParams2(method, options, parameters, body);
  let result;
  try {
    result = await fetcher(url, Object.assign({}, requestParams));
  } catch (e) {
    console.error(e);
    throw new AuthRetryableFetchError(_getErrorMessage2(e), 0);
  }
  if (!result.ok) {
    await handleError2(result);
  }
  if (options === null || options === void 0 ? void 0 : options.noResolveJson) {
    return result;
  }
  try {
    return await result.json();
  } catch (e) {
    await handleError2(e);
  }
}
function _sessionResponse(data) {
  var _a;
  let session = null;
  if (hasSession(data)) {
    session = Object.assign({}, data);
    if (!data.expires_at) {
      session.expires_at = expiresAt(data.expires_in);
    }
  }
  const user = (_a = data.user) !== null && _a !== void 0 ? _a : data;
  return { data: { session, user }, error: null };
}
function _sessionResponsePassword(data) {
  const response = _sessionResponse(data);
  if (!response.error && data.weak_password && typeof data.weak_password === "object" && Array.isArray(data.weak_password.reasons) && data.weak_password.reasons.length && data.weak_password.message && typeof data.weak_password.message === "string" && data.weak_password.reasons.reduce((a, i) => a && typeof i === "string", true)) {
    response.data.weak_password = data.weak_password;
  }
  return response;
}
function _userResponse(data) {
  var _a;
  const user = (_a = data.user) !== null && _a !== void 0 ? _a : data;
  return { data: { user }, error: null };
}
function _ssoResponse(data) {
  return { data, error: null };
}
function _generateLinkResponse(data) {
  const { action_link, email_otp, hashed_token, redirect_to, verification_type } = data, rest = __rest(data, ["action_link", "email_otp", "hashed_token", "redirect_to", "verification_type"]);
  const properties = {
    action_link,
    email_otp,
    hashed_token,
    redirect_to,
    verification_type
  };
  const user = Object.assign({}, rest);
  return {
    data: {
      properties,
      user
    },
    error: null
  };
}
function _noResolveJsonResponse(data) {
  return data;
}
function hasSession(data) {
  return data.access_token && data.refresh_token && data.expires_in;
}

// node_modules/@supabase/auth-js/dist/module/GoTrueAdminApi.js
var __rest2 = function(s, e) {
  var t = {};
  for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
    t[p] = s[p];
  if (s != null && typeof Object.getOwnPropertySymbols === "function")
    for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
      if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
        t[p[i]] = s[p[i]];
    }
  return t;
};
var GoTrueAdminApi = class {
  constructor({ url = "", headers = {}, fetch: fetch3 }) {
    this.url = url;
    this.headers = headers;
    this.fetch = resolveFetch4(fetch3);
    this.mfa = {
      listFactors: this._listFactors.bind(this),
      deleteFactor: this._deleteFactor.bind(this)
    };
  }
  /**
   * Removes a logged-in session.
   * @param jwt A valid, logged-in JWT.
   * @param scope The logout sope.
   */
  async signOut(jwt, scope = "global") {
    try {
      await _request(this.fetch, "POST", `${this.url}/logout?scope=${scope}`, {
        headers: this.headers,
        jwt,
        noResolveJson: true
      });
      return { data: null, error: null };
    } catch (error) {
      if (isAuthError(error)) {
        return { data: null, error };
      }
      throw error;
    }
  }
  /**
   * Sends an invite link to an email address.
   * @param email The email address of the user.
   * @param options Additional options to be included when inviting.
   */
  async inviteUserByEmail(email, options = {}) {
    try {
      return await _request(this.fetch, "POST", `${this.url}/invite`, {
        body: { email, data: options.data },
        headers: this.headers,
        redirectTo: options.redirectTo,
        xform: _userResponse
      });
    } catch (error) {
      if (isAuthError(error)) {
        return { data: { user: null }, error };
      }
      throw error;
    }
  }
  /**
   * Generates email links and OTPs to be sent via a custom email provider.
   * @param email The user's email.
   * @param options.password User password. For signup only.
   * @param options.data Optional user metadata. For signup only.
   * @param options.redirectTo The redirect url which should be appended to the generated link
   */
  async generateLink(params) {
    try {
      const { options } = params, rest = __rest2(params, ["options"]);
      const body = Object.assign(Object.assign({}, rest), options);
      if ("newEmail" in rest) {
        body.new_email = rest === null || rest === void 0 ? void 0 : rest.newEmail;
        delete body["newEmail"];
      }
      return await _request(this.fetch, "POST", `${this.url}/admin/generate_link`, {
        body,
        headers: this.headers,
        xform: _generateLinkResponse,
        redirectTo: options === null || options === void 0 ? void 0 : options.redirectTo
      });
    } catch (error) {
      if (isAuthError(error)) {
        return {
          data: {
            properties: null,
            user: null
          },
          error
        };
      }
      throw error;
    }
  }
  // User Admin API
  /**
   * Creates a new user.
   * This function should only be called on a server. Never expose your `service_role` key in the browser.
   */
  async createUser(attributes) {
    try {
      return await _request(this.fetch, "POST", `${this.url}/admin/users`, {
        body: attributes,
        headers: this.headers,
        xform: _userResponse
      });
    } catch (error) {
      if (isAuthError(error)) {
        return { data: { user: null }, error };
      }
      throw error;
    }
  }
  /**
   * Get a list of users.
   *
   * This function should only be called on a server. Never expose your `service_role` key in the browser.
   * @param params An object which supports `page` and `perPage` as numbers, to alter the paginated results.
   */
  async listUsers(params) {
    var _a, _b, _c, _d, _e, _f, _g;
    try {
      const pagination = { nextPage: null, lastPage: 0, total: 0 };
      const response = await _request(this.fetch, "GET", `${this.url}/admin/users`, {
        headers: this.headers,
        noResolveJson: true,
        query: {
          page: (_b = (_a = params === null || params === void 0 ? void 0 : params.page) === null || _a === void 0 ? void 0 : _a.toString()) !== null && _b !== void 0 ? _b : "",
          per_page: (_d = (_c = params === null || params === void 0 ? void 0 : params.perPage) === null || _c === void 0 ? void 0 : _c.toString()) !== null && _d !== void 0 ? _d : ""
        },
        xform: _noResolveJsonResponse
      });
      if (response.error)
        throw response.error;
      const users = await response.json();
      const total = (_e = response.headers.get("x-total-count")) !== null && _e !== void 0 ? _e : 0;
      const links = (_g = (_f = response.headers.get("link")) === null || _f === void 0 ? void 0 : _f.split(",")) !== null && _g !== void 0 ? _g : [];
      if (links.length > 0) {
        links.forEach((link) => {
          const page = parseInt(link.split(";")[0].split("=")[1].substring(0, 1));
          const rel = JSON.parse(link.split(";")[1].split("=")[1]);
          pagination[`${rel}Page`] = page;
        });
        pagination.total = parseInt(total);
      }
      return { data: Object.assign(Object.assign({}, users), pagination), error: null };
    } catch (error) {
      if (isAuthError(error)) {
        return { data: { users: [] }, error };
      }
      throw error;
    }
  }
  /**
   * Get user by id.
   *
   * @param uid The user's unique identifier
   *
   * This function should only be called on a server. Never expose your `service_role` key in the browser.
   */
  async getUserById(uid) {
    try {
      return await _request(this.fetch, "GET", `${this.url}/admin/users/${uid}`, {
        headers: this.headers,
        xform: _userResponse
      });
    } catch (error) {
      if (isAuthError(error)) {
        return { data: { user: null }, error };
      }
      throw error;
    }
  }
  /**
   * Updates the user data.
   *
   * @param attributes The data you want to update.
   *
   * This function should only be called on a server. Never expose your `service_role` key in the browser.
   */
  async updateUserById(uid, attributes) {
    try {
      return await _request(this.fetch, "PUT", `${this.url}/admin/users/${uid}`, {
        body: attributes,
        headers: this.headers,
        xform: _userResponse
      });
    } catch (error) {
      if (isAuthError(error)) {
        return { data: { user: null }, error };
      }
      throw error;
    }
  }
  /**
   * Delete a user. Requires a `service_role` key.
   *
   * @param id The user id you want to remove.
   * @param shouldSoftDelete If true, then the user will be soft-deleted from the auth schema. Soft deletion allows user identification from the hashed user ID but is not reversible.
   * Defaults to false for backward compatibility.
   *
   * This function should only be called on a server. Never expose your `service_role` key in the browser.
   */
  async deleteUser(id, shouldSoftDelete = false) {
    try {
      return await _request(this.fetch, "DELETE", `${this.url}/admin/users/${id}`, {
        headers: this.headers,
        body: {
          should_soft_delete: shouldSoftDelete
        },
        xform: _userResponse
      });
    } catch (error) {
      if (isAuthError(error)) {
        return { data: { user: null }, error };
      }
      throw error;
    }
  }
  async _listFactors(params) {
    try {
      const { data, error } = await _request(this.fetch, "GET", `${this.url}/admin/users/${params.userId}/factors`, {
        headers: this.headers,
        xform: (factors) => {
          return { data: { factors }, error: null };
        }
      });
      return { data, error };
    } catch (error) {
      if (isAuthError(error)) {
        return { data: null, error };
      }
      throw error;
    }
  }
  async _deleteFactor(params) {
    try {
      const data = await _request(this.fetch, "DELETE", `${this.url}/admin/users/${params.userId}/factors/${params.id}`, {
        headers: this.headers
      });
      return { data, error: null };
    } catch (error) {
      if (isAuthError(error)) {
        return { data: null, error };
      }
      throw error;
    }
  }
};

// node_modules/@supabase/auth-js/dist/module/lib/local-storage.js
var localStorageAdapter = {
  getItem: (key) => {
    if (!supportsLocalStorage()) {
      return null;
    }
    return globalThis.localStorage.getItem(key);
  },
  setItem: (key, value) => {
    if (!supportsLocalStorage()) {
      return;
    }
    globalThis.localStorage.setItem(key, value);
  },
  removeItem: (key) => {
    if (!supportsLocalStorage()) {
      return;
    }
    globalThis.localStorage.removeItem(key);
  }
};
function memoryLocalStorageAdapter(store = {}) {
  return {
    getItem: (key) => {
      return store[key] || null;
    },
    setItem: (key, value) => {
      store[key] = value;
    },
    removeItem: (key) => {
      delete store[key];
    }
  };
}

// node_modules/@supabase/auth-js/dist/module/lib/polyfills.js
function polyfillGlobalThis() {
  if (typeof globalThis === "object")
    return;
  try {
    Object.defineProperty(Object.prototype, "__magic__", {
      get: function() {
        return this;
      },
      configurable: true
    });
    __magic__.globalThis = __magic__;
    delete Object.prototype.__magic__;
  } catch (e) {
    if (typeof self !== "undefined") {
      self.globalThis = self;
    }
  }
}

// node_modules/@supabase/auth-js/dist/module/lib/locks.js
var internals = {
  /**
   * @experimental
   */
  debug: !!(globalThis && supportsLocalStorage() && globalThis.localStorage && globalThis.localStorage.getItem("supabase.gotrue-js.locks.debug") === "true")
};
var LockAcquireTimeoutError = class extends Error {
  constructor(message) {
    super(message);
    this.isAcquireTimeout = true;
  }
};
var NavigatorLockAcquireTimeoutError = class extends LockAcquireTimeoutError {
};
async function navigatorLock(name, acquireTimeout, fn) {
  if (internals.debug) {
    console.log("@supabase/gotrue-js: navigatorLock: acquire lock", name, acquireTimeout);
  }
  const abortController = new globalThis.AbortController();
  if (acquireTimeout > 0) {
    setTimeout(() => {
      abortController.abort();
      if (internals.debug) {
        console.log("@supabase/gotrue-js: navigatorLock acquire timed out", name);
      }
    }, acquireTimeout);
  }
  return await Promise.resolve().then(() => globalThis.navigator.locks.request(name, acquireTimeout === 0 ? {
    mode: "exclusive",
    ifAvailable: true
  } : {
    mode: "exclusive",
    signal: abortController.signal
  }, async (lock) => {
    if (lock) {
      if (internals.debug) {
        console.log("@supabase/gotrue-js: navigatorLock: acquired", name, lock.name);
      }
      try {
        return await fn();
      } finally {
        if (internals.debug) {
          console.log("@supabase/gotrue-js: navigatorLock: released", name, lock.name);
        }
      }
    } else {
      if (acquireTimeout === 0) {
        if (internals.debug) {
          console.log("@supabase/gotrue-js: navigatorLock: not immediately available", name);
        }
        throw new NavigatorLockAcquireTimeoutError(`Acquiring an exclusive Navigator LockManager lock "${name}" immediately failed`);
      } else {
        if (internals.debug) {
          try {
            const result = await globalThis.navigator.locks.query();
            console.log("@supabase/gotrue-js: Navigator LockManager state", JSON.stringify(result, null, "  "));
          } catch (e) {
            console.warn("@supabase/gotrue-js: Error when querying Navigator LockManager state", e);
          }
        }
        console.warn("@supabase/gotrue-js: Navigator LockManager returned a null lock when using #request without ifAvailable set to true, it appears this browser is not following the LockManager spec https://developer.mozilla.org/en-US/docs/Web/API/LockManager/request");
        return await fn();
      }
    }
  }));
}

// node_modules/@supabase/auth-js/dist/module/GoTrueClient.js
polyfillGlobalThis();
var DEFAULT_OPTIONS = {
  url: GOTRUE_URL,
  storageKey: STORAGE_KEY,
  autoRefreshToken: true,
  persistSession: true,
  detectSessionInUrl: true,
  headers: DEFAULT_HEADERS4,
  flowType: "implicit",
  debug: false,
  hasCustomAuthorizationHeader: false
};
async function lockNoOp(name, acquireTimeout, fn) {
  return await fn();
}
var GoTrueClient = class _GoTrueClient {
  /**
   * Create a new client for use in the browser.
   */
  constructor(options) {
    var _a, _b;
    this.memoryStorage = null;
    this.stateChangeEmitters = /* @__PURE__ */ new Map();
    this.autoRefreshTicker = null;
    this.visibilityChangedCallback = null;
    this.refreshingDeferred = null;
    this.initializePromise = null;
    this.detectSessionInUrl = true;
    this.hasCustomAuthorizationHeader = false;
    this.suppressGetSessionWarning = false;
    this.lockAcquired = false;
    this.pendingInLock = [];
    this.broadcastChannel = null;
    this.logger = console.log;
    this.instanceID = _GoTrueClient.nextInstanceID;
    _GoTrueClient.nextInstanceID += 1;
    if (this.instanceID > 0 && isBrowser()) {
      console.warn("Multiple GoTrueClient instances detected in the same browser context. It is not an error, but this should be avoided as it may produce undefined behavior when used concurrently under the same storage key.");
    }
    const settings = Object.assign(Object.assign({}, DEFAULT_OPTIONS), options);
    this.logDebugMessages = !!settings.debug;
    if (typeof settings.debug === "function") {
      this.logger = settings.debug;
    }
    this.persistSession = settings.persistSession;
    this.storageKey = settings.storageKey;
    this.autoRefreshToken = settings.autoRefreshToken;
    this.admin = new GoTrueAdminApi({
      url: settings.url,
      headers: settings.headers,
      fetch: settings.fetch
    });
    this.url = settings.url;
    this.headers = settings.headers;
    this.fetch = resolveFetch4(settings.fetch);
    this.lock = settings.lock || lockNoOp;
    this.detectSessionInUrl = settings.detectSessionInUrl;
    this.flowType = settings.flowType;
    this.hasCustomAuthorizationHeader = settings.hasCustomAuthorizationHeader;
    if (settings.lock) {
      this.lock = settings.lock;
    } else if (isBrowser() && ((_a = globalThis === null || globalThis === void 0 ? void 0 : globalThis.navigator) === null || _a === void 0 ? void 0 : _a.locks)) {
      this.lock = navigatorLock;
    } else {
      this.lock = lockNoOp;
    }
    this.jwks = { keys: [] };
    this.jwks_cached_at = Number.MIN_SAFE_INTEGER;
    this.mfa = {
      verify: this._verify.bind(this),
      enroll: this._enroll.bind(this),
      unenroll: this._unenroll.bind(this),
      challenge: this._challenge.bind(this),
      listFactors: this._listFactors.bind(this),
      challengeAndVerify: this._challengeAndVerify.bind(this),
      getAuthenticatorAssuranceLevel: this._getAuthenticatorAssuranceLevel.bind(this)
    };
    if (this.persistSession) {
      if (settings.storage) {
        this.storage = settings.storage;
      } else {
        if (supportsLocalStorage()) {
          this.storage = localStorageAdapter;
        } else {
          this.memoryStorage = {};
          this.storage = memoryLocalStorageAdapter(this.memoryStorage);
        }
      }
    } else {
      this.memoryStorage = {};
      this.storage = memoryLocalStorageAdapter(this.memoryStorage);
    }
    if (isBrowser() && globalThis.BroadcastChannel && this.persistSession && this.storageKey) {
      try {
        this.broadcastChannel = new globalThis.BroadcastChannel(this.storageKey);
      } catch (e) {
        console.error("Failed to create a new BroadcastChannel, multi-tab state changes will not be available", e);
      }
      (_b = this.broadcastChannel) === null || _b === void 0 ? void 0 : _b.addEventListener("message", async (event) => {
        this._debug("received broadcast notification from other tab or client", event);
        await this._notifyAllSubscribers(event.data.event, event.data.session, false);
      });
    }
    this.initialize();
  }
  _debug(...args) {
    if (this.logDebugMessages) {
      this.logger(`GoTrueClient@${this.instanceID} (${version4}) ${(/* @__PURE__ */ new Date()).toISOString()}`, ...args);
    }
    return this;
  }
  /**
   * Initializes the client session either from the url or from storage.
   * This method is automatically called when instantiating the client, but should also be called
   * manually when checking for an error from an auth redirect (oauth, magiclink, password recovery, etc).
   */
  async initialize() {
    if (this.initializePromise) {
      return await this.initializePromise;
    }
    this.initializePromise = (async () => {
      return await this._acquireLock(-1, async () => {
        return await this._initialize();
      });
    })();
    return await this.initializePromise;
  }
  /**
   * IMPORTANT:
   * 1. Never throw in this method, as it is called from the constructor
   * 2. Never return a session from this method as it would be cached over
   *    the whole lifetime of the client
   */
  async _initialize() {
    var _a;
    try {
      const params = parseParametersFromURL(window.location.href);
      let callbackUrlType = "none";
      if (this._isImplicitGrantCallback(params)) {
        callbackUrlType = "implicit";
      } else if (await this._isPKCECallback(params)) {
        callbackUrlType = "pkce";
      }
      if (isBrowser() && this.detectSessionInUrl && callbackUrlType !== "none") {
        const { data, error } = await this._getSessionFromURL(params, callbackUrlType);
        if (error) {
          this._debug("#_initialize()", "error detecting session from URL", error);
          if (isAuthImplicitGrantRedirectError(error)) {
            const errorCode = (_a = error.details) === null || _a === void 0 ? void 0 : _a.code;
            if (errorCode === "identity_already_exists" || errorCode === "identity_not_found" || errorCode === "single_identity_not_deletable") {
              return { error };
            }
          }
          await this._removeSession();
          return { error };
        }
        const { session, redirectType } = data;
        this._debug("#_initialize()", "detected session in URL", session, "redirect type", redirectType);
        await this._saveSession(session);
        setTimeout(async () => {
          if (redirectType === "recovery") {
            await this._notifyAllSubscribers("PASSWORD_RECOVERY", session);
          } else {
            await this._notifyAllSubscribers("SIGNED_IN", session);
          }
        }, 0);
        return { error: null };
      }
      await this._recoverAndRefresh();
      return { error: null };
    } catch (error) {
      if (isAuthError(error)) {
        return { error };
      }
      return {
        error: new AuthUnknownError("Unexpected error during initialization", error)
      };
    } finally {
      await this._handleVisibilityChange();
      this._debug("#_initialize()", "end");
    }
  }
  /**
   * Creates a new anonymous user.
   *
   * @returns A session where the is_anonymous claim in the access token JWT set to true
   */
  async signInAnonymously(credentials) {
    var _a, _b, _c;
    try {
      const res = await _request(this.fetch, "POST", `${this.url}/signup`, {
        headers: this.headers,
        body: {
          data: (_b = (_a = credentials === null || credentials === void 0 ? void 0 : credentials.options) === null || _a === void 0 ? void 0 : _a.data) !== null && _b !== void 0 ? _b : {},
          gotrue_meta_security: { captcha_token: (_c = credentials === null || credentials === void 0 ? void 0 : credentials.options) === null || _c === void 0 ? void 0 : _c.captchaToken }
        },
        xform: _sessionResponse
      });
      const { data, error } = res;
      if (error || !data) {
        return { data: { user: null, session: null }, error };
      }
      const session = data.session;
      const user = data.user;
      if (data.session) {
        await this._saveSession(data.session);
        await this._notifyAllSubscribers("SIGNED_IN", session);
      }
      return { data: { user, session }, error: null };
    } catch (error) {
      if (isAuthError(error)) {
        return { data: { user: null, session: null }, error };
      }
      throw error;
    }
  }
  /**
   * Creates a new user.
   *
   * Be aware that if a user account exists in the system you may get back an
   * error message that attempts to hide this information from the user.
   * This method has support for PKCE via email signups. The PKCE flow cannot be used when autoconfirm is enabled.
   *
   * @returns A logged-in session if the server has "autoconfirm" ON
   * @returns A user if the server has "autoconfirm" OFF
   */
  async signUp(credentials) {
    var _a, _b, _c;
    try {
      let res;
      if ("email" in credentials) {
        const { email, password, options } = credentials;
        let codeChallenge = null;
        let codeChallengeMethod = null;
        if (this.flowType === "pkce") {
          ;
          [codeChallenge, codeChallengeMethod] = await getCodeChallengeAndMethod(this.storage, this.storageKey);
        }
        res = await _request(this.fetch, "POST", `${this.url}/signup`, {
          headers: this.headers,
          redirectTo: options === null || options === void 0 ? void 0 : options.emailRedirectTo,
          body: {
            email,
            password,
            data: (_a = options === null || options === void 0 ? void 0 : options.data) !== null && _a !== void 0 ? _a : {},
            gotrue_meta_security: { captcha_token: options === null || options === void 0 ? void 0 : options.captchaToken },
            code_challenge: codeChallenge,
            code_challenge_method: codeChallengeMethod
          },
          xform: _sessionResponse
        });
      } else if ("phone" in credentials) {
        const { phone, password, options } = credentials;
        res = await _request(this.fetch, "POST", `${this.url}/signup`, {
          headers: this.headers,
          body: {
            phone,
            password,
            data: (_b = options === null || options === void 0 ? void 0 : options.data) !== null && _b !== void 0 ? _b : {},
            channel: (_c = options === null || options === void 0 ? void 0 : options.channel) !== null && _c !== void 0 ? _c : "sms",
            gotrue_meta_security: { captcha_token: options === null || options === void 0 ? void 0 : options.captchaToken }
          },
          xform: _sessionResponse
        });
      } else {
        throw new AuthInvalidCredentialsError("You must provide either an email or phone number and a password");
      }
      const { data, error } = res;
      if (error || !data) {
        return { data: { user: null, session: null }, error };
      }
      const session = data.session;
      const user = data.user;
      if (data.session) {
        await this._saveSession(data.session);
        await this._notifyAllSubscribers("SIGNED_IN", session);
      }
      return { data: { user, session }, error: null };
    } catch (error) {
      if (isAuthError(error)) {
        return { data: { user: null, session: null }, error };
      }
      throw error;
    }
  }
  /**
   * Log in an existing user with an email and password or phone and password.
   *
   * Be aware that you may get back an error message that will not distinguish
   * between the cases where the account does not exist or that the
   * email/phone and password combination is wrong or that the account can only
   * be accessed via social login.
   */
  async signInWithPassword(credentials) {
    try {
      let res;
      if ("email" in credentials) {
        const { email, password, options } = credentials;
        res = await _request(this.fetch, "POST", `${this.url}/token?grant_type=password`, {
          headers: this.headers,
          body: {
            email,
            password,
            gotrue_meta_security: { captcha_token: options === null || options === void 0 ? void 0 : options.captchaToken }
          },
          xform: _sessionResponsePassword
        });
      } else if ("phone" in credentials) {
        const { phone, password, options } = credentials;
        res = await _request(this.fetch, "POST", `${this.url}/token?grant_type=password`, {
          headers: this.headers,
          body: {
            phone,
            password,
            gotrue_meta_security: { captcha_token: options === null || options === void 0 ? void 0 : options.captchaToken }
          },
          xform: _sessionResponsePassword
        });
      } else {
        throw new AuthInvalidCredentialsError("You must provide either an email or phone number and a password");
      }
      const { data, error } = res;
      if (error) {
        return { data: { user: null, session: null }, error };
      } else if (!data || !data.session || !data.user) {
        return { data: { user: null, session: null }, error: new AuthInvalidTokenResponseError() };
      }
      if (data.session) {
        await this._saveSession(data.session);
        await this._notifyAllSubscribers("SIGNED_IN", data.session);
      }
      return {
        data: Object.assign({ user: data.user, session: data.session }, data.weak_password ? { weakPassword: data.weak_password } : null),
        error
      };
    } catch (error) {
      if (isAuthError(error)) {
        return { data: { user: null, session: null }, error };
      }
      throw error;
    }
  }
  /**
   * Log in an existing user via a third-party provider.
   * This method supports the PKCE flow.
   */
  async signInWithOAuth(credentials) {
    var _a, _b, _c, _d;
    return await this._handleProviderSignIn(credentials.provider, {
      redirectTo: (_a = credentials.options) === null || _a === void 0 ? void 0 : _a.redirectTo,
      scopes: (_b = credentials.options) === null || _b === void 0 ? void 0 : _b.scopes,
      queryParams: (_c = credentials.options) === null || _c === void 0 ? void 0 : _c.queryParams,
      skipBrowserRedirect: (_d = credentials.options) === null || _d === void 0 ? void 0 : _d.skipBrowserRedirect
    });
  }
  /**
   * Log in an existing user by exchanging an Auth Code issued during the PKCE flow.
   */
  async exchangeCodeForSession(authCode) {
    await this.initializePromise;
    return this._acquireLock(-1, async () => {
      return this._exchangeCodeForSession(authCode);
    });
  }
  async _exchangeCodeForSession(authCode) {
    const storageItem = await getItemAsync(this.storage, `${this.storageKey}-code-verifier`);
    const [codeVerifier, redirectType] = (storageItem !== null && storageItem !== void 0 ? storageItem : "").split("/");
    try {
      const { data, error } = await _request(this.fetch, "POST", `${this.url}/token?grant_type=pkce`, {
        headers: this.headers,
        body: {
          auth_code: authCode,
          code_verifier: codeVerifier
        },
        xform: _sessionResponse
      });
      await removeItemAsync(this.storage, `${this.storageKey}-code-verifier`);
      if (error) {
        throw error;
      }
      if (!data || !data.session || !data.user) {
        return {
          data: { user: null, session: null, redirectType: null },
          error: new AuthInvalidTokenResponseError()
        };
      }
      if (data.session) {
        await this._saveSession(data.session);
        await this._notifyAllSubscribers("SIGNED_IN", data.session);
      }
      return { data: Object.assign(Object.assign({}, data), { redirectType: redirectType !== null && redirectType !== void 0 ? redirectType : null }), error };
    } catch (error) {
      if (isAuthError(error)) {
        return { data: { user: null, session: null, redirectType: null }, error };
      }
      throw error;
    }
  }
  /**
   * Allows signing in with an OIDC ID token. The authentication provider used
   * should be enabled and configured.
   */
  async signInWithIdToken(credentials) {
    try {
      const { options, provider, token, access_token, nonce } = credentials;
      const res = await _request(this.fetch, "POST", `${this.url}/token?grant_type=id_token`, {
        headers: this.headers,
        body: {
          provider,
          id_token: token,
          access_token,
          nonce,
          gotrue_meta_security: { captcha_token: options === null || options === void 0 ? void 0 : options.captchaToken }
        },
        xform: _sessionResponse
      });
      const { data, error } = res;
      if (error) {
        return { data: { user: null, session: null }, error };
      } else if (!data || !data.session || !data.user) {
        return {
          data: { user: null, session: null },
          error: new AuthInvalidTokenResponseError()
        };
      }
      if (data.session) {
        await this._saveSession(data.session);
        await this._notifyAllSubscribers("SIGNED_IN", data.session);
      }
      return { data, error };
    } catch (error) {
      if (isAuthError(error)) {
        return { data: { user: null, session: null }, error };
      }
      throw error;
    }
  }
  /**
   * Log in a user using magiclink or a one-time password (OTP).
   *
   * If the `{{ .ConfirmationURL }}` variable is specified in the email template, a magiclink will be sent.
   * If the `{{ .Token }}` variable is specified in the email template, an OTP will be sent.
   * If you're using phone sign-ins, only an OTP will be sent. You won't be able to send a magiclink for phone sign-ins.
   *
   * Be aware that you may get back an error message that will not distinguish
   * between the cases where the account does not exist or, that the account
   * can only be accessed via social login.
   *
   * Do note that you will need to configure a Whatsapp sender on Twilio
   * if you are using phone sign in with the 'whatsapp' channel. The whatsapp
   * channel is not supported on other providers
   * at this time.
   * This method supports PKCE when an email is passed.
   */
  async signInWithOtp(credentials) {
    var _a, _b, _c, _d, _e;
    try {
      if ("email" in credentials) {
        const { email, options } = credentials;
        let codeChallenge = null;
        let codeChallengeMethod = null;
        if (this.flowType === "pkce") {
          ;
          [codeChallenge, codeChallengeMethod] = await getCodeChallengeAndMethod(this.storage, this.storageKey);
        }
        const { error } = await _request(this.fetch, "POST", `${this.url}/otp`, {
          headers: this.headers,
          body: {
            email,
            data: (_a = options === null || options === void 0 ? void 0 : options.data) !== null && _a !== void 0 ? _a : {},
            create_user: (_b = options === null || options === void 0 ? void 0 : options.shouldCreateUser) !== null && _b !== void 0 ? _b : true,
            gotrue_meta_security: { captcha_token: options === null || options === void 0 ? void 0 : options.captchaToken },
            code_challenge: codeChallenge,
            code_challenge_method: codeChallengeMethod
          },
          redirectTo: options === null || options === void 0 ? void 0 : options.emailRedirectTo
        });
        return { data: { user: null, session: null }, error };
      }
      if ("phone" in credentials) {
        const { phone, options } = credentials;
        const { data, error } = await _request(this.fetch, "POST", `${this.url}/otp`, {
          headers: this.headers,
          body: {
            phone,
            data: (_c = options === null || options === void 0 ? void 0 : options.data) !== null && _c !== void 0 ? _c : {},
            create_user: (_d = options === null || options === void 0 ? void 0 : options.shouldCreateUser) !== null && _d !== void 0 ? _d : true,
            gotrue_meta_security: { captcha_token: options === null || options === void 0 ? void 0 : options.captchaToken },
            channel: (_e = options === null || options === void 0 ? void 0 : options.channel) !== null && _e !== void 0 ? _e : "sms"
          }
        });
        return { data: { user: null, session: null, messageId: data === null || data === void 0 ? void 0 : data.message_id }, error };
      }
      throw new AuthInvalidCredentialsError("You must provide either an email or phone number.");
    } catch (error) {
      if (isAuthError(error)) {
        return { data: { user: null, session: null }, error };
      }
      throw error;
    }
  }
  /**
   * Log in a user given a User supplied OTP or TokenHash received through mobile or email.
   */
  async verifyOtp(params) {
    var _a, _b;
    try {
      let redirectTo = void 0;
      let captchaToken = void 0;
      if ("options" in params) {
        redirectTo = (_a = params.options) === null || _a === void 0 ? void 0 : _a.redirectTo;
        captchaToken = (_b = params.options) === null || _b === void 0 ? void 0 : _b.captchaToken;
      }
      const { data, error } = await _request(this.fetch, "POST", `${this.url}/verify`, {
        headers: this.headers,
        body: Object.assign(Object.assign({}, params), { gotrue_meta_security: { captcha_token: captchaToken } }),
        redirectTo,
        xform: _sessionResponse
      });
      if (error) {
        throw error;
      }
      if (!data) {
        throw new Error("An error occurred on token verification.");
      }
      const session = data.session;
      const user = data.user;
      if (session === null || session === void 0 ? void 0 : session.access_token) {
        await this._saveSession(session);
        await this._notifyAllSubscribers(params.type == "recovery" ? "PASSWORD_RECOVERY" : "SIGNED_IN", session);
      }
      return { data: { user, session }, error: null };
    } catch (error) {
      if (isAuthError(error)) {
        return { data: { user: null, session: null }, error };
      }
      throw error;
    }
  }
  /**
   * Attempts a single-sign on using an enterprise Identity Provider. A
   * successful SSO attempt will redirect the current page to the identity
   * provider authorization page. The redirect URL is implementation and SSO
   * protocol specific.
   *
   * You can use it by providing a SSO domain. Typically you can extract this
   * domain by asking users for their email address. If this domain is
   * registered on the Auth instance the redirect will use that organization's
   * currently active SSO Identity Provider for the login.
   *
   * If you have built an organization-specific login page, you can use the
   * organization's SSO Identity Provider UUID directly instead.
   */
  async signInWithSSO(params) {
    var _a, _b, _c;
    try {
      let codeChallenge = null;
      let codeChallengeMethod = null;
      if (this.flowType === "pkce") {
        ;
        [codeChallenge, codeChallengeMethod] = await getCodeChallengeAndMethod(this.storage, this.storageKey);
      }
      return await _request(this.fetch, "POST", `${this.url}/sso`, {
        body: Object.assign(Object.assign(Object.assign(Object.assign(Object.assign({}, "providerId" in params ? { provider_id: params.providerId } : null), "domain" in params ? { domain: params.domain } : null), { redirect_to: (_b = (_a = params.options) === null || _a === void 0 ? void 0 : _a.redirectTo) !== null && _b !== void 0 ? _b : void 0 }), ((_c = params === null || params === void 0 ? void 0 : params.options) === null || _c === void 0 ? void 0 : _c.captchaToken) ? { gotrue_meta_security: { captcha_token: params.options.captchaToken } } : null), { skip_http_redirect: true, code_challenge: codeChallenge, code_challenge_method: codeChallengeMethod }),
        headers: this.headers,
        xform: _ssoResponse
      });
    } catch (error) {
      if (isAuthError(error)) {
        return { data: null, error };
      }
      throw error;
    }
  }
  /**
   * Sends a reauthentication OTP to the user's email or phone number.
   * Requires the user to be signed-in.
   */
  async reauthenticate() {
    await this.initializePromise;
    return await this._acquireLock(-1, async () => {
      return await this._reauthenticate();
    });
  }
  async _reauthenticate() {
    try {
      return await this._useSession(async (result) => {
        const { data: { session }, error: sessionError } = result;
        if (sessionError)
          throw sessionError;
        if (!session)
          throw new AuthSessionMissingError();
        const { error } = await _request(this.fetch, "GET", `${this.url}/reauthenticate`, {
          headers: this.headers,
          jwt: session.access_token
        });
        return { data: { user: null, session: null }, error };
      });
    } catch (error) {
      if (isAuthError(error)) {
        return { data: { user: null, session: null }, error };
      }
      throw error;
    }
  }
  /**
   * Resends an existing signup confirmation email, email change email, SMS OTP or phone change OTP.
   */
  async resend(credentials) {
    try {
      const endpoint = `${this.url}/resend`;
      if ("email" in credentials) {
        const { email, type, options } = credentials;
        const { error } = await _request(this.fetch, "POST", endpoint, {
          headers: this.headers,
          body: {
            email,
            type,
            gotrue_meta_security: { captcha_token: options === null || options === void 0 ? void 0 : options.captchaToken }
          },
          redirectTo: options === null || options === void 0 ? void 0 : options.emailRedirectTo
        });
        return { data: { user: null, session: null }, error };
      } else if ("phone" in credentials) {
        const { phone, type, options } = credentials;
        const { data, error } = await _request(this.fetch, "POST", endpoint, {
          headers: this.headers,
          body: {
            phone,
            type,
            gotrue_meta_security: { captcha_token: options === null || options === void 0 ? void 0 : options.captchaToken }
          }
        });
        return { data: { user: null, session: null, messageId: data === null || data === void 0 ? void 0 : data.message_id }, error };
      }
      throw new AuthInvalidCredentialsError("You must provide either an email or phone number and a type");
    } catch (error) {
      if (isAuthError(error)) {
        return { data: { user: null, session: null }, error };
      }
      throw error;
    }
  }
  /**
   * Returns the session, refreshing it if necessary.
   *
   * The session returned can be null if the session is not detected which can happen in the event a user is not signed-in or has logged out.
   *
   * **IMPORTANT:** This method loads values directly from the storage attached
   * to the client. If that storage is based on request cookies for example,
   * the values in it may not be authentic and therefore it's strongly advised
   * against using this method and its results in such circumstances. A warning
   * will be emitted if this is detected. Use {@link #getUser()} instead.
   */
  async getSession() {
    await this.initializePromise;
    const result = await this._acquireLock(-1, async () => {
      return this._useSession(async (result2) => {
        return result2;
      });
    });
    return result;
  }
  /**
   * Acquires a global lock based on the storage key.
   */
  async _acquireLock(acquireTimeout, fn) {
    this._debug("#_acquireLock", "begin", acquireTimeout);
    try {
      if (this.lockAcquired) {
        const last = this.pendingInLock.length ? this.pendingInLock[this.pendingInLock.length - 1] : Promise.resolve();
        const result = (async () => {
          await last;
          return await fn();
        })();
        this.pendingInLock.push((async () => {
          try {
            await result;
          } catch (e) {
          }
        })());
        return result;
      }
      return await this.lock(`lock:${this.storageKey}`, acquireTimeout, async () => {
        this._debug("#_acquireLock", "lock acquired for storage key", this.storageKey);
        try {
          this.lockAcquired = true;
          const result = fn();
          this.pendingInLock.push((async () => {
            try {
              await result;
            } catch (e) {
            }
          })());
          await result;
          while (this.pendingInLock.length) {
            const waitOn = [...this.pendingInLock];
            await Promise.all(waitOn);
            this.pendingInLock.splice(0, waitOn.length);
          }
          return await result;
        } finally {
          this._debug("#_acquireLock", "lock released for storage key", this.storageKey);
          this.lockAcquired = false;
        }
      });
    } finally {
      this._debug("#_acquireLock", "end");
    }
  }
  /**
   * Use instead of {@link #getSession} inside the library. It is
   * semantically usually what you want, as getting a session involves some
   * processing afterwards that requires only one client operating on the
   * session at once across multiple tabs or processes.
   */
  async _useSession(fn) {
    this._debug("#_useSession", "begin");
    try {
      const result = await this.__loadSession();
      return await fn(result);
    } finally {
      this._debug("#_useSession", "end");
    }
  }
  /**
   * NEVER USE DIRECTLY!
   *
   * Always use {@link #_useSession}.
   */
  async __loadSession() {
    this._debug("#__loadSession()", "begin");
    if (!this.lockAcquired) {
      this._debug("#__loadSession()", "used outside of an acquired lock!", new Error().stack);
    }
    try {
      let currentSession = null;
      const maybeSession = await getItemAsync(this.storage, this.storageKey);
      this._debug("#getSession()", "session from storage", maybeSession);
      if (maybeSession !== null) {
        if (this._isValidSession(maybeSession)) {
          currentSession = maybeSession;
        } else {
          this._debug("#getSession()", "session from storage is not valid");
          await this._removeSession();
        }
      }
      if (!currentSession) {
        return { data: { session: null }, error: null };
      }
      const hasExpired = currentSession.expires_at ? currentSession.expires_at * 1e3 - Date.now() < EXPIRY_MARGIN_MS : false;
      this._debug("#__loadSession()", `session has${hasExpired ? "" : " not"} expired`, "expires_at", currentSession.expires_at);
      if (!hasExpired) {
        if (this.storage.isServer) {
          let suppressWarning = this.suppressGetSessionWarning;
          const proxySession = new Proxy(currentSession, {
            get: (target, prop, receiver) => {
              if (!suppressWarning && prop === "user") {
                console.warn("Using the user object as returned from supabase.auth.getSession() or from some supabase.auth.onAuthStateChange() events could be insecure! This value comes directly from the storage medium (usually cookies on the server) and may not be authentic. Use supabase.auth.getUser() instead which authenticates the data by contacting the Supabase Auth server.");
                suppressWarning = true;
                this.suppressGetSessionWarning = true;
              }
              return Reflect.get(target, prop, receiver);
            }
          });
          currentSession = proxySession;
        }
        return { data: { session: currentSession }, error: null };
      }
      const { session, error } = await this._callRefreshToken(currentSession.refresh_token);
      if (error) {
        return { data: { session: null }, error };
      }
      return { data: { session }, error: null };
    } finally {
      this._debug("#__loadSession()", "end");
    }
  }
  /**
   * Gets the current user details if there is an existing session. This method
   * performs a network request to the Supabase Auth server, so the returned
   * value is authentic and can be used to base authorization rules on.
   *
   * @param jwt Takes in an optional access token JWT. If no JWT is provided, the JWT from the current session is used.
   */
  async getUser(jwt) {
    if (jwt) {
      return await this._getUser(jwt);
    }
    await this.initializePromise;
    const result = await this._acquireLock(-1, async () => {
      return await this._getUser();
    });
    return result;
  }
  async _getUser(jwt) {
    try {
      if (jwt) {
        return await _request(this.fetch, "GET", `${this.url}/user`, {
          headers: this.headers,
          jwt,
          xform: _userResponse
        });
      }
      return await this._useSession(async (result) => {
        var _a, _b, _c;
        const { data, error } = result;
        if (error) {
          throw error;
        }
        if (!((_a = data.session) === null || _a === void 0 ? void 0 : _a.access_token) && !this.hasCustomAuthorizationHeader) {
          return { data: { user: null }, error: new AuthSessionMissingError() };
        }
        return await _request(this.fetch, "GET", `${this.url}/user`, {
          headers: this.headers,
          jwt: (_c = (_b = data.session) === null || _b === void 0 ? void 0 : _b.access_token) !== null && _c !== void 0 ? _c : void 0,
          xform: _userResponse
        });
      });
    } catch (error) {
      if (isAuthError(error)) {
        if (isAuthSessionMissingError(error)) {
          await this._removeSession();
          await removeItemAsync(this.storage, `${this.storageKey}-code-verifier`);
        }
        return { data: { user: null }, error };
      }
      throw error;
    }
  }
  /**
   * Updates user data for a logged in user.
   */
  async updateUser(attributes, options = {}) {
    await this.initializePromise;
    return await this._acquireLock(-1, async () => {
      return await this._updateUser(attributes, options);
    });
  }
  async _updateUser(attributes, options = {}) {
    try {
      return await this._useSession(async (result) => {
        const { data: sessionData, error: sessionError } = result;
        if (sessionError) {
          throw sessionError;
        }
        if (!sessionData.session) {
          throw new AuthSessionMissingError();
        }
        const session = sessionData.session;
        let codeChallenge = null;
        let codeChallengeMethod = null;
        if (this.flowType === "pkce" && attributes.email != null) {
          ;
          [codeChallenge, codeChallengeMethod] = await getCodeChallengeAndMethod(this.storage, this.storageKey);
        }
        const { data, error: userError } = await _request(this.fetch, "PUT", `${this.url}/user`, {
          headers: this.headers,
          redirectTo: options === null || options === void 0 ? void 0 : options.emailRedirectTo,
          body: Object.assign(Object.assign({}, attributes), { code_challenge: codeChallenge, code_challenge_method: codeChallengeMethod }),
          jwt: session.access_token,
          xform: _userResponse
        });
        if (userError)
          throw userError;
        session.user = data.user;
        await this._saveSession(session);
        await this._notifyAllSubscribers("USER_UPDATED", session);
        return { data: { user: session.user }, error: null };
      });
    } catch (error) {
      if (isAuthError(error)) {
        return { data: { user: null }, error };
      }
      throw error;
    }
  }
  /**
   * Sets the session data from the current session. If the current session is expired, setSession will take care of refreshing it to obtain a new session.
   * If the refresh token or access token in the current session is invalid, an error will be thrown.
   * @param currentSession The current session that minimally contains an access token and refresh token.
   */
  async setSession(currentSession) {
    await this.initializePromise;
    return await this._acquireLock(-1, async () => {
      return await this._setSession(currentSession);
    });
  }
  async _setSession(currentSession) {
    try {
      if (!currentSession.access_token || !currentSession.refresh_token) {
        throw new AuthSessionMissingError();
      }
      const timeNow = Date.now() / 1e3;
      let expiresAt2 = timeNow;
      let hasExpired = true;
      let session = null;
      const { payload } = decodeJWT(currentSession.access_token);
      if (payload.exp) {
        expiresAt2 = payload.exp;
        hasExpired = expiresAt2 <= timeNow;
      }
      if (hasExpired) {
        const { session: refreshedSession, error } = await this._callRefreshToken(currentSession.refresh_token);
        if (error) {
          return { data: { user: null, session: null }, error };
        }
        if (!refreshedSession) {
          return { data: { user: null, session: null }, error: null };
        }
        session = refreshedSession;
      } else {
        const { data, error } = await this._getUser(currentSession.access_token);
        if (error) {
          throw error;
        }
        session = {
          access_token: currentSession.access_token,
          refresh_token: currentSession.refresh_token,
          user: data.user,
          token_type: "bearer",
          expires_in: expiresAt2 - timeNow,
          expires_at: expiresAt2
        };
        await this._saveSession(session);
        await this._notifyAllSubscribers("SIGNED_IN", session);
      }
      return { data: { user: session.user, session }, error: null };
    } catch (error) {
      if (isAuthError(error)) {
        return { data: { session: null, user: null }, error };
      }
      throw error;
    }
  }
  /**
   * Returns a new session, regardless of expiry status.
   * Takes in an optional current session. If not passed in, then refreshSession() will attempt to retrieve it from getSession().
   * If the current session's refresh token is invalid, an error will be thrown.
   * @param currentSession The current session. If passed in, it must contain a refresh token.
   */
  async refreshSession(currentSession) {
    await this.initializePromise;
    return await this._acquireLock(-1, async () => {
      return await this._refreshSession(currentSession);
    });
  }
  async _refreshSession(currentSession) {
    try {
      return await this._useSession(async (result) => {
        var _a;
        if (!currentSession) {
          const { data, error: error2 } = result;
          if (error2) {
            throw error2;
          }
          currentSession = (_a = data.session) !== null && _a !== void 0 ? _a : void 0;
        }
        if (!(currentSession === null || currentSession === void 0 ? void 0 : currentSession.refresh_token)) {
          throw new AuthSessionMissingError();
        }
        const { session, error } = await this._callRefreshToken(currentSession.refresh_token);
        if (error) {
          return { data: { user: null, session: null }, error };
        }
        if (!session) {
          return { data: { user: null, session: null }, error: null };
        }
        return { data: { user: session.user, session }, error: null };
      });
    } catch (error) {
      if (isAuthError(error)) {
        return { data: { user: null, session: null }, error };
      }
      throw error;
    }
  }
  /**
   * Gets the session data from a URL string
   */
  async _getSessionFromURL(params, callbackUrlType) {
    try {
      if (!isBrowser())
        throw new AuthImplicitGrantRedirectError("No browser detected.");
      if (params.error || params.error_description || params.error_code) {
        throw new AuthImplicitGrantRedirectError(params.error_description || "Error in URL with unspecified error_description", {
          error: params.error || "unspecified_error",
          code: params.error_code || "unspecified_code"
        });
      }
      switch (callbackUrlType) {
        case "implicit":
          if (this.flowType === "pkce") {
            throw new AuthPKCEGrantCodeExchangeError("Not a valid PKCE flow url.");
          }
          break;
        case "pkce":
          if (this.flowType === "implicit") {
            throw new AuthImplicitGrantRedirectError("Not a valid implicit grant flow url.");
          }
          break;
        default:
      }
      if (callbackUrlType === "pkce") {
        this._debug("#_initialize()", "begin", "is PKCE flow", true);
        if (!params.code)
          throw new AuthPKCEGrantCodeExchangeError("No code detected.");
        const { data: data2, error: error2 } = await this._exchangeCodeForSession(params.code);
        if (error2)
          throw error2;
        const url = new URL(window.location.href);
        url.searchParams.delete("code");
        window.history.replaceState(window.history.state, "", url.toString());
        return { data: { session: data2.session, redirectType: null }, error: null };
      }
      const { provider_token, provider_refresh_token, access_token, refresh_token, expires_in, expires_at, token_type } = params;
      if (!access_token || !expires_in || !refresh_token || !token_type) {
        throw new AuthImplicitGrantRedirectError("No session defined in URL");
      }
      const timeNow = Math.round(Date.now() / 1e3);
      const expiresIn = parseInt(expires_in);
      let expiresAt2 = timeNow + expiresIn;
      if (expires_at) {
        expiresAt2 = parseInt(expires_at);
      }
      const actuallyExpiresIn = expiresAt2 - timeNow;
      if (actuallyExpiresIn * 1e3 <= AUTO_REFRESH_TICK_DURATION_MS) {
        console.warn(`@supabase/gotrue-js: Session as retrieved from URL expires in ${actuallyExpiresIn}s, should have been closer to ${expiresIn}s`);
      }
      const issuedAt = expiresAt2 - expiresIn;
      if (timeNow - issuedAt >= 120) {
        console.warn("@supabase/gotrue-js: Session as retrieved from URL was issued over 120s ago, URL could be stale", issuedAt, expiresAt2, timeNow);
      } else if (timeNow - issuedAt < 0) {
        console.warn("@supabase/gotrue-js: Session as retrieved from URL was issued in the future? Check the device clock for skew", issuedAt, expiresAt2, timeNow);
      }
      const { data, error } = await this._getUser(access_token);
      if (error)
        throw error;
      const session = {
        provider_token,
        provider_refresh_token,
        access_token,
        expires_in: expiresIn,
        expires_at: expiresAt2,
        refresh_token,
        token_type,
        user: data.user
      };
      window.location.hash = "";
      this._debug("#_getSessionFromURL()", "clearing window.location.hash");
      return { data: { session, redirectType: params.type }, error: null };
    } catch (error) {
      if (isAuthError(error)) {
        return { data: { session: null, redirectType: null }, error };
      }
      throw error;
    }
  }
  /**
   * Checks if the current URL contains parameters given by an implicit oauth grant flow (https://www.rfc-editor.org/rfc/rfc6749.html#section-4.2)
   */
  _isImplicitGrantCallback(params) {
    return Boolean(params.access_token || params.error_description);
  }
  /**
   * Checks if the current URL and backing storage contain parameters given by a PKCE flow
   */
  async _isPKCECallback(params) {
    const currentStorageContent = await getItemAsync(this.storage, `${this.storageKey}-code-verifier`);
    return !!(params.code && currentStorageContent);
  }
  /**
   * Inside a browser context, `signOut()` will remove the logged in user from the browser session and log them out - removing all items from localstorage and then trigger a `"SIGNED_OUT"` event.
   *
   * For server-side management, you can revoke all refresh tokens for a user by passing a user's JWT through to `auth.api.signOut(JWT: string)`.
   * There is no way to revoke a user's access token jwt until it expires. It is recommended to set a shorter expiry on the jwt for this reason.
   *
   * If using `others` scope, no `SIGNED_OUT` event is fired!
   */
  async signOut(options = { scope: "global" }) {
    await this.initializePromise;
    return await this._acquireLock(-1, async () => {
      return await this._signOut(options);
    });
  }
  async _signOut({ scope } = { scope: "global" }) {
    return await this._useSession(async (result) => {
      var _a;
      const { data, error: sessionError } = result;
      if (sessionError) {
        return { error: sessionError };
      }
      const accessToken = (_a = data.session) === null || _a === void 0 ? void 0 : _a.access_token;
      if (accessToken) {
        const { error } = await this.admin.signOut(accessToken, scope);
        if (error) {
          if (!(isAuthApiError(error) && (error.status === 404 || error.status === 401 || error.status === 403))) {
            return { error };
          }
        }
      }
      if (scope !== "others") {
        await this._removeSession();
        await removeItemAsync(this.storage, `${this.storageKey}-code-verifier`);
      }
      return { error: null };
    });
  }
  /**
   * Receive a notification every time an auth event happens.
   * @param callback A callback function to be invoked when an auth event happens.
   */
  onAuthStateChange(callback) {
    const id = uuid();
    const subscription = {
      id,
      callback,
      unsubscribe: () => {
        this._debug("#unsubscribe()", "state change callback with id removed", id);
        this.stateChangeEmitters.delete(id);
      }
    };
    this._debug("#onAuthStateChange()", "registered callback with id", id);
    this.stateChangeEmitters.set(id, subscription);
    (async () => {
      await this.initializePromise;
      await this._acquireLock(-1, async () => {
        this._emitInitialSession(id);
      });
    })();
    return { data: { subscription } };
  }
  async _emitInitialSession(id) {
    return await this._useSession(async (result) => {
      var _a, _b;
      try {
        const { data: { session }, error } = result;
        if (error)
          throw error;
        await ((_a = this.stateChangeEmitters.get(id)) === null || _a === void 0 ? void 0 : _a.callback("INITIAL_SESSION", session));
        this._debug("INITIAL_SESSION", "callback id", id, "session", session);
      } catch (err) {
        await ((_b = this.stateChangeEmitters.get(id)) === null || _b === void 0 ? void 0 : _b.callback("INITIAL_SESSION", null));
        this._debug("INITIAL_SESSION", "callback id", id, "error", err);
        console.error(err);
      }
    });
  }
  /**
   * Sends a password reset request to an email address. This method supports the PKCE flow.
   *
   * @param email The email address of the user.
   * @param options.redirectTo The URL to send the user to after they click the password reset link.
   * @param options.captchaToken Verification token received when the user completes the captcha on the site.
   */
  async resetPasswordForEmail(email, options = {}) {
    let codeChallenge = null;
    let codeChallengeMethod = null;
    if (this.flowType === "pkce") {
      ;
      [codeChallenge, codeChallengeMethod] = await getCodeChallengeAndMethod(
        this.storage,
        this.storageKey,
        true
        // isPasswordRecovery
      );
    }
    try {
      return await _request(this.fetch, "POST", `${this.url}/recover`, {
        body: {
          email,
          code_challenge: codeChallenge,
          code_challenge_method: codeChallengeMethod,
          gotrue_meta_security: { captcha_token: options.captchaToken }
        },
        headers: this.headers,
        redirectTo: options.redirectTo
      });
    } catch (error) {
      if (isAuthError(error)) {
        return { data: null, error };
      }
      throw error;
    }
  }
  /**
   * Gets all the identities linked to a user.
   */
  async getUserIdentities() {
    var _a;
    try {
      const { data, error } = await this.getUser();
      if (error)
        throw error;
      return { data: { identities: (_a = data.user.identities) !== null && _a !== void 0 ? _a : [] }, error: null };
    } catch (error) {
      if (isAuthError(error)) {
        return { data: null, error };
      }
      throw error;
    }
  }
  /**
   * Links an oauth identity to an existing user.
   * This method supports the PKCE flow.
   */
  async linkIdentity(credentials) {
    var _a;
    try {
      const { data, error } = await this._useSession(async (result) => {
        var _a2, _b, _c, _d, _e;
        const { data: data2, error: error2 } = result;
        if (error2)
          throw error2;
        const url = await this._getUrlForProvider(`${this.url}/user/identities/authorize`, credentials.provider, {
          redirectTo: (_a2 = credentials.options) === null || _a2 === void 0 ? void 0 : _a2.redirectTo,
          scopes: (_b = credentials.options) === null || _b === void 0 ? void 0 : _b.scopes,
          queryParams: (_c = credentials.options) === null || _c === void 0 ? void 0 : _c.queryParams,
          skipBrowserRedirect: true
        });
        return await _request(this.fetch, "GET", url, {
          headers: this.headers,
          jwt: (_e = (_d = data2.session) === null || _d === void 0 ? void 0 : _d.access_token) !== null && _e !== void 0 ? _e : void 0
        });
      });
      if (error)
        throw error;
      if (isBrowser() && !((_a = credentials.options) === null || _a === void 0 ? void 0 : _a.skipBrowserRedirect)) {
        window.location.assign(data === null || data === void 0 ? void 0 : data.url);
      }
      return { data: { provider: credentials.provider, url: data === null || data === void 0 ? void 0 : data.url }, error: null };
    } catch (error) {
      if (isAuthError(error)) {
        return { data: { provider: credentials.provider, url: null }, error };
      }
      throw error;
    }
  }
  /**
   * Unlinks an identity from a user by deleting it. The user will no longer be able to sign in with that identity once it's unlinked.
   */
  async unlinkIdentity(identity) {
    try {
      return await this._useSession(async (result) => {
        var _a, _b;
        const { data, error } = result;
        if (error) {
          throw error;
        }
        return await _request(this.fetch, "DELETE", `${this.url}/user/identities/${identity.identity_id}`, {
          headers: this.headers,
          jwt: (_b = (_a = data.session) === null || _a === void 0 ? void 0 : _a.access_token) !== null && _b !== void 0 ? _b : void 0
        });
      });
    } catch (error) {
      if (isAuthError(error)) {
        return { data: null, error };
      }
      throw error;
    }
  }
  /**
   * Generates a new JWT.
   * @param refreshToken A valid refresh token that was returned on login.
   */
  async _refreshAccessToken(refreshToken) {
    const debugName = `#_refreshAccessToken(${refreshToken.substring(0, 5)}...)`;
    this._debug(debugName, "begin");
    try {
      const startedAt = Date.now();
      return await retryable(async (attempt) => {
        if (attempt > 0) {
          await sleep(200 * Math.pow(2, attempt - 1));
        }
        this._debug(debugName, "refreshing attempt", attempt);
        return await _request(this.fetch, "POST", `${this.url}/token?grant_type=refresh_token`, {
          body: { refresh_token: refreshToken },
          headers: this.headers,
          xform: _sessionResponse
        });
      }, (attempt, error) => {
        const nextBackOffInterval = 200 * Math.pow(2, attempt);
        return error && isAuthRetryableFetchError(error) && // retryable only if the request can be sent before the backoff overflows the tick duration
        Date.now() + nextBackOffInterval - startedAt < AUTO_REFRESH_TICK_DURATION_MS;
      });
    } catch (error) {
      this._debug(debugName, "error", error);
      if (isAuthError(error)) {
        return { data: { session: null, user: null }, error };
      }
      throw error;
    } finally {
      this._debug(debugName, "end");
    }
  }
  _isValidSession(maybeSession) {
    const isValidSession = typeof maybeSession === "object" && maybeSession !== null && "access_token" in maybeSession && "refresh_token" in maybeSession && "expires_at" in maybeSession;
    return isValidSession;
  }
  async _handleProviderSignIn(provider, options) {
    const url = await this._getUrlForProvider(`${this.url}/authorize`, provider, {
      redirectTo: options.redirectTo,
      scopes: options.scopes,
      queryParams: options.queryParams
    });
    this._debug("#_handleProviderSignIn()", "provider", provider, "options", options, "url", url);
    if (isBrowser() && !options.skipBrowserRedirect) {
      window.location.assign(url);
    }
    return { data: { provider, url }, error: null };
  }
  /**
   * Recovers the session from LocalStorage and refreshes the token
   * Note: this method is async to accommodate for AsyncStorage e.g. in React native.
   */
  async _recoverAndRefresh() {
    var _a;
    const debugName = "#_recoverAndRefresh()";
    this._debug(debugName, "begin");
    try {
      const currentSession = await getItemAsync(this.storage, this.storageKey);
      this._debug(debugName, "session from storage", currentSession);
      if (!this._isValidSession(currentSession)) {
        this._debug(debugName, "session is not valid");
        if (currentSession !== null) {
          await this._removeSession();
        }
        return;
      }
      const expiresWithMargin = ((_a = currentSession.expires_at) !== null && _a !== void 0 ? _a : Infinity) * 1e3 - Date.now() < EXPIRY_MARGIN_MS;
      this._debug(debugName, `session has${expiresWithMargin ? "" : " not"} expired with margin of ${EXPIRY_MARGIN_MS}s`);
      if (expiresWithMargin) {
        if (this.autoRefreshToken && currentSession.refresh_token) {
          const { error } = await this._callRefreshToken(currentSession.refresh_token);
          if (error) {
            console.error(error);
            if (!isAuthRetryableFetchError(error)) {
              this._debug(debugName, "refresh failed with a non-retryable error, removing the session", error);
              await this._removeSession();
            }
          }
        }
      } else {
        await this._notifyAllSubscribers("SIGNED_IN", currentSession);
      }
    } catch (err) {
      this._debug(debugName, "error", err);
      console.error(err);
      return;
    } finally {
      this._debug(debugName, "end");
    }
  }
  async _callRefreshToken(refreshToken) {
    var _a, _b;
    if (!refreshToken) {
      throw new AuthSessionMissingError();
    }
    if (this.refreshingDeferred) {
      return this.refreshingDeferred.promise;
    }
    const debugName = `#_callRefreshToken(${refreshToken.substring(0, 5)}...)`;
    this._debug(debugName, "begin");
    try {
      this.refreshingDeferred = new Deferred();
      const { data, error } = await this._refreshAccessToken(refreshToken);
      if (error)
        throw error;
      if (!data.session)
        throw new AuthSessionMissingError();
      await this._saveSession(data.session);
      await this._notifyAllSubscribers("TOKEN_REFRESHED", data.session);
      const result = { session: data.session, error: null };
      this.refreshingDeferred.resolve(result);
      return result;
    } catch (error) {
      this._debug(debugName, "error", error);
      if (isAuthError(error)) {
        const result = { session: null, error };
        if (!isAuthRetryableFetchError(error)) {
          await this._removeSession();
        }
        (_a = this.refreshingDeferred) === null || _a === void 0 ? void 0 : _a.resolve(result);
        return result;
      }
      (_b = this.refreshingDeferred) === null || _b === void 0 ? void 0 : _b.reject(error);
      throw error;
    } finally {
      this.refreshingDeferred = null;
      this._debug(debugName, "end");
    }
  }
  async _notifyAllSubscribers(event, session, broadcast = true) {
    const debugName = `#_notifyAllSubscribers(${event})`;
    this._debug(debugName, "begin", session, `broadcast = ${broadcast}`);
    try {
      if (this.broadcastChannel && broadcast) {
        this.broadcastChannel.postMessage({ event, session });
      }
      const errors = [];
      const promises = Array.from(this.stateChangeEmitters.values()).map(async (x) => {
        try {
          await x.callback(event, session);
        } catch (e) {
          errors.push(e);
        }
      });
      await Promise.all(promises);
      if (errors.length > 0) {
        for (let i = 0; i < errors.length; i += 1) {
          console.error(errors[i]);
        }
        throw errors[0];
      }
    } finally {
      this._debug(debugName, "end");
    }
  }
  /**
   * set currentSession and currentUser
   * process to _startAutoRefreshToken if possible
   */
  async _saveSession(session) {
    this._debug("#_saveSession()", session);
    this.suppressGetSessionWarning = true;
    await setItemAsync(this.storage, this.storageKey, session);
  }
  async _removeSession() {
    this._debug("#_removeSession()");
    await removeItemAsync(this.storage, this.storageKey);
    await this._notifyAllSubscribers("SIGNED_OUT", null);
  }
  /**
   * Removes any registered visibilitychange callback.
   *
   * {@see #startAutoRefresh}
   * {@see #stopAutoRefresh}
   */
  _removeVisibilityChangedCallback() {
    this._debug("#_removeVisibilityChangedCallback()");
    const callback = this.visibilityChangedCallback;
    this.visibilityChangedCallback = null;
    try {
      if (callback && isBrowser() && (window === null || window === void 0 ? void 0 : window.removeEventListener)) {
        window.removeEventListener("visibilitychange", callback);
      }
    } catch (e) {
      console.error("removing visibilitychange callback failed", e);
    }
  }
  /**
   * This is the private implementation of {@link #startAutoRefresh}. Use this
   * within the library.
   */
  async _startAutoRefresh() {
    await this._stopAutoRefresh();
    this._debug("#_startAutoRefresh()");
    const ticker = setInterval(() => this._autoRefreshTokenTick(), AUTO_REFRESH_TICK_DURATION_MS);
    this.autoRefreshTicker = ticker;
    if (ticker && typeof ticker === "object" && typeof ticker.unref === "function") {
      ticker.unref();
    } else if (typeof Deno !== "undefined" && typeof Deno.unrefTimer === "function") {
      Deno.unrefTimer(ticker);
    }
    setTimeout(async () => {
      await this.initializePromise;
      await this._autoRefreshTokenTick();
    }, 0);
  }
  /**
   * This is the private implementation of {@link #stopAutoRefresh}. Use this
   * within the library.
   */
  async _stopAutoRefresh() {
    this._debug("#_stopAutoRefresh()");
    const ticker = this.autoRefreshTicker;
    this.autoRefreshTicker = null;
    if (ticker) {
      clearInterval(ticker);
    }
  }
  /**
   * Starts an auto-refresh process in the background. The session is checked
   * every few seconds. Close to the time of expiration a process is started to
   * refresh the session. If refreshing fails it will be retried for as long as
   * necessary.
   *
   * If you set the {@link GoTrueClientOptions#autoRefreshToken} you don't need
   * to call this function, it will be called for you.
   *
   * On browsers the refresh process works only when the tab/window is in the
   * foreground to conserve resources as well as prevent race conditions and
   * flooding auth with requests. If you call this method any managed
   * visibility change callback will be removed and you must manage visibility
   * changes on your own.
   *
   * On non-browser platforms the refresh process works *continuously* in the
   * background, which may not be desirable. You should hook into your
   * platform's foreground indication mechanism and call these methods
   * appropriately to conserve resources.
   *
   * {@see #stopAutoRefresh}
   */
  async startAutoRefresh() {
    this._removeVisibilityChangedCallback();
    await this._startAutoRefresh();
  }
  /**
   * Stops an active auto refresh process running in the background (if any).
   *
   * If you call this method any managed visibility change callback will be
   * removed and you must manage visibility changes on your own.
   *
   * See {@link #startAutoRefresh} for more details.
   */
  async stopAutoRefresh() {
    this._removeVisibilityChangedCallback();
    await this._stopAutoRefresh();
  }
  /**
   * Runs the auto refresh token tick.
   */
  async _autoRefreshTokenTick() {
    this._debug("#_autoRefreshTokenTick()", "begin");
    try {
      await this._acquireLock(0, async () => {
        try {
          const now = Date.now();
          try {
            return await this._useSession(async (result) => {
              const { data: { session } } = result;
              if (!session || !session.refresh_token || !session.expires_at) {
                this._debug("#_autoRefreshTokenTick()", "no session");
                return;
              }
              const expiresInTicks = Math.floor((session.expires_at * 1e3 - now) / AUTO_REFRESH_TICK_DURATION_MS);
              this._debug("#_autoRefreshTokenTick()", `access token expires in ${expiresInTicks} ticks, a tick lasts ${AUTO_REFRESH_TICK_DURATION_MS}ms, refresh threshold is ${AUTO_REFRESH_TICK_THRESHOLD} ticks`);
              if (expiresInTicks <= AUTO_REFRESH_TICK_THRESHOLD) {
                await this._callRefreshToken(session.refresh_token);
              }
            });
          } catch (e) {
            console.error("Auto refresh tick failed with error. This is likely a transient error.", e);
          }
        } finally {
          this._debug("#_autoRefreshTokenTick()", "end");
        }
      });
    } catch (e) {
      if (e.isAcquireTimeout || e instanceof LockAcquireTimeoutError) {
        this._debug("auto refresh token tick lock not available");
      } else {
        throw e;
      }
    }
  }
  /**
   * Registers callbacks on the browser / platform, which in-turn run
   * algorithms when the browser window/tab are in foreground. On non-browser
   * platforms it assumes always foreground.
   */
  async _handleVisibilityChange() {
    this._debug("#_handleVisibilityChange()");
    if (!isBrowser() || !(window === null || window === void 0 ? void 0 : window.addEventListener)) {
      if (this.autoRefreshToken) {
        this.startAutoRefresh();
      }
      return false;
    }
    try {
      this.visibilityChangedCallback = async () => await this._onVisibilityChanged(false);
      window === null || window === void 0 ? void 0 : window.addEventListener("visibilitychange", this.visibilityChangedCallback);
      await this._onVisibilityChanged(true);
    } catch (error) {
      console.error("_handleVisibilityChange", error);
    }
  }
  /**
   * Callback registered with `window.addEventListener('visibilitychange')`.
   */
  async _onVisibilityChanged(calledFromInitialize) {
    const methodName = `#_onVisibilityChanged(${calledFromInitialize})`;
    this._debug(methodName, "visibilityState", document.visibilityState);
    if (document.visibilityState === "visible") {
      if (this.autoRefreshToken) {
        this._startAutoRefresh();
      }
      if (!calledFromInitialize) {
        await this.initializePromise;
        await this._acquireLock(-1, async () => {
          if (document.visibilityState !== "visible") {
            this._debug(methodName, "acquired the lock to recover the session, but the browser visibilityState is no longer visible, aborting");
            return;
          }
          await this._recoverAndRefresh();
        });
      }
    } else if (document.visibilityState === "hidden") {
      if (this.autoRefreshToken) {
        this._stopAutoRefresh();
      }
    }
  }
  /**
   * Generates the relevant login URL for a third-party provider.
   * @param options.redirectTo A URL or mobile address to send the user to after they are confirmed.
   * @param options.scopes A space-separated list of scopes granted to the OAuth application.
   * @param options.queryParams An object of key-value pairs containing query parameters granted to the OAuth application.
   */
  async _getUrlForProvider(url, provider, options) {
    const urlParams = [`provider=${encodeURIComponent(provider)}`];
    if (options === null || options === void 0 ? void 0 : options.redirectTo) {
      urlParams.push(`redirect_to=${encodeURIComponent(options.redirectTo)}`);
    }
    if (options === null || options === void 0 ? void 0 : options.scopes) {
      urlParams.push(`scopes=${encodeURIComponent(options.scopes)}`);
    }
    if (this.flowType === "pkce") {
      const [codeChallenge, codeChallengeMethod] = await getCodeChallengeAndMethod(this.storage, this.storageKey);
      const flowParams = new URLSearchParams({
        code_challenge: `${encodeURIComponent(codeChallenge)}`,
        code_challenge_method: `${encodeURIComponent(codeChallengeMethod)}`
      });
      urlParams.push(flowParams.toString());
    }
    if (options === null || options === void 0 ? void 0 : options.queryParams) {
      const query = new URLSearchParams(options.queryParams);
      urlParams.push(query.toString());
    }
    if (options === null || options === void 0 ? void 0 : options.skipBrowserRedirect) {
      urlParams.push(`skip_http_redirect=${options.skipBrowserRedirect}`);
    }
    return `${url}?${urlParams.join("&")}`;
  }
  async _unenroll(params) {
    try {
      return await this._useSession(async (result) => {
        var _a;
        const { data: sessionData, error: sessionError } = result;
        if (sessionError) {
          return { data: null, error: sessionError };
        }
        return await _request(this.fetch, "DELETE", `${this.url}/factors/${params.factorId}`, {
          headers: this.headers,
          jwt: (_a = sessionData === null || sessionData === void 0 ? void 0 : sessionData.session) === null || _a === void 0 ? void 0 : _a.access_token
        });
      });
    } catch (error) {
      if (isAuthError(error)) {
        return { data: null, error };
      }
      throw error;
    }
  }
  async _enroll(params) {
    try {
      return await this._useSession(async (result) => {
        var _a, _b;
        const { data: sessionData, error: sessionError } = result;
        if (sessionError) {
          return { data: null, error: sessionError };
        }
        const body = Object.assign({ friendly_name: params.friendlyName, factor_type: params.factorType }, params.factorType === "phone" ? { phone: params.phone } : { issuer: params.issuer });
        const { data, error } = await _request(this.fetch, "POST", `${this.url}/factors`, {
          body,
          headers: this.headers,
          jwt: (_a = sessionData === null || sessionData === void 0 ? void 0 : sessionData.session) === null || _a === void 0 ? void 0 : _a.access_token
        });
        if (error) {
          return { data: null, error };
        }
        if (params.factorType === "totp" && ((_b = data === null || data === void 0 ? void 0 : data.totp) === null || _b === void 0 ? void 0 : _b.qr_code)) {
          data.totp.qr_code = `data:image/svg+xml;utf-8,${data.totp.qr_code}`;
        }
        return { data, error: null };
      });
    } catch (error) {
      if (isAuthError(error)) {
        return { data: null, error };
      }
      throw error;
    }
  }
  /**
   * {@see GoTrueMFAApi#verify}
   */
  async _verify(params) {
    return this._acquireLock(-1, async () => {
      try {
        return await this._useSession(async (result) => {
          var _a;
          const { data: sessionData, error: sessionError } = result;
          if (sessionError) {
            return { data: null, error: sessionError };
          }
          const { data, error } = await _request(this.fetch, "POST", `${this.url}/factors/${params.factorId}/verify`, {
            body: { code: params.code, challenge_id: params.challengeId },
            headers: this.headers,
            jwt: (_a = sessionData === null || sessionData === void 0 ? void 0 : sessionData.session) === null || _a === void 0 ? void 0 : _a.access_token
          });
          if (error) {
            return { data: null, error };
          }
          await this._saveSession(Object.assign({ expires_at: Math.round(Date.now() / 1e3) + data.expires_in }, data));
          await this._notifyAllSubscribers("MFA_CHALLENGE_VERIFIED", data);
          return { data, error };
        });
      } catch (error) {
        if (isAuthError(error)) {
          return { data: null, error };
        }
        throw error;
      }
    });
  }
  /**
   * {@see GoTrueMFAApi#challenge}
   */
  async _challenge(params) {
    return this._acquireLock(-1, async () => {
      try {
        return await this._useSession(async (result) => {
          var _a;
          const { data: sessionData, error: sessionError } = result;
          if (sessionError) {
            return { data: null, error: sessionError };
          }
          return await _request(this.fetch, "POST", `${this.url}/factors/${params.factorId}/challenge`, {
            body: { channel: params.channel },
            headers: this.headers,
            jwt: (_a = sessionData === null || sessionData === void 0 ? void 0 : sessionData.session) === null || _a === void 0 ? void 0 : _a.access_token
          });
        });
      } catch (error) {
        if (isAuthError(error)) {
          return { data: null, error };
        }
        throw error;
      }
    });
  }
  /**
   * {@see GoTrueMFAApi#challengeAndVerify}
   */
  async _challengeAndVerify(params) {
    const { data: challengeData, error: challengeError } = await this._challenge({
      factorId: params.factorId
    });
    if (challengeError) {
      return { data: null, error: challengeError };
    }
    return await this._verify({
      factorId: params.factorId,
      challengeId: challengeData.id,
      code: params.code
    });
  }
  /**
   * {@see GoTrueMFAApi#listFactors}
   */
  async _listFactors() {
    const { data: { user }, error: userError } = await this.getUser();
    if (userError) {
      return { data: null, error: userError };
    }
    const factors = (user === null || user === void 0 ? void 0 : user.factors) || [];
    const totp = factors.filter((factor) => factor.factor_type === "totp" && factor.status === "verified");
    const phone = factors.filter((factor) => factor.factor_type === "phone" && factor.status === "verified");
    return {
      data: {
        all: factors,
        totp,
        phone
      },
      error: null
    };
  }
  /**
   * {@see GoTrueMFAApi#getAuthenticatorAssuranceLevel}
   */
  async _getAuthenticatorAssuranceLevel() {
    return this._acquireLock(-1, async () => {
      return await this._useSession(async (result) => {
        var _a, _b;
        const { data: { session }, error: sessionError } = result;
        if (sessionError) {
          return { data: null, error: sessionError };
        }
        if (!session) {
          return {
            data: { currentLevel: null, nextLevel: null, currentAuthenticationMethods: [] },
            error: null
          };
        }
        const { payload } = decodeJWT(session.access_token);
        let currentLevel = null;
        if (payload.aal) {
          currentLevel = payload.aal;
        }
        let nextLevel = currentLevel;
        const verifiedFactors = (_b = (_a = session.user.factors) === null || _a === void 0 ? void 0 : _a.filter((factor) => factor.status === "verified")) !== null && _b !== void 0 ? _b : [];
        if (verifiedFactors.length > 0) {
          nextLevel = "aal2";
        }
        const currentAuthenticationMethods = payload.amr || [];
        return { data: { currentLevel, nextLevel, currentAuthenticationMethods }, error: null };
      });
    });
  }
  async fetchJwk(kid, jwks = { keys: [] }) {
    let jwk = jwks.keys.find((key) => key.kid === kid);
    if (jwk) {
      return jwk;
    }
    jwk = this.jwks.keys.find((key) => key.kid === kid);
    if (jwk && this.jwks_cached_at + JWKS_TTL > Date.now()) {
      return jwk;
    }
    const { data, error } = await _request(this.fetch, "GET", `${this.url}/.well-known/jwks.json`, {
      headers: this.headers
    });
    if (error) {
      throw error;
    }
    if (!data.keys || data.keys.length === 0) {
      throw new AuthInvalidJwtError("JWKS is empty");
    }
    this.jwks = data;
    this.jwks_cached_at = Date.now();
    jwk = data.keys.find((key) => key.kid === kid);
    if (!jwk) {
      throw new AuthInvalidJwtError("No matching signing key found in JWKS");
    }
    return jwk;
  }
  /**
   * @experimental This method may change in future versions.
   * @description Gets the claims from a JWT. If the JWT is symmetric JWTs, it will call getUser() to verify against the server. If the JWT is asymmetric, it will be verified against the JWKS using the WebCrypto API.
   */
  async getClaims(jwt, jwks = { keys: [] }) {
    try {
      let token = jwt;
      if (!token) {
        const { data, error } = await this.getSession();
        if (error || !data.session) {
          return { data: null, error };
        }
        token = data.session.access_token;
      }
      const { header, payload, signature, raw: { header: rawHeader, payload: rawPayload } } = decodeJWT(token);
      validateExp(payload.exp);
      if (!header.kid || header.alg === "HS256" || !("crypto" in globalThis && "subtle" in globalThis.crypto)) {
        const { error } = await this.getUser(token);
        if (error) {
          throw error;
        }
        return {
          data: {
            claims: payload,
            header,
            signature
          },
          error: null
        };
      }
      const algorithm = getAlgorithm(header.alg);
      const signingKey = await this.fetchJwk(header.kid, jwks);
      const publicKey = await crypto.subtle.importKey("jwk", signingKey, algorithm, true, [
        "verify"
      ]);
      const isValid = await crypto.subtle.verify(algorithm, publicKey, signature, stringToUint8Array(`${rawHeader}.${rawPayload}`));
      if (!isValid) {
        throw new AuthInvalidJwtError("Invalid JWT signature");
      }
      return {
        data: {
          claims: payload,
          header,
          signature
        },
        error: null
      };
    } catch (error) {
      if (isAuthError(error)) {
        return { data: null, error };
      }
      throw error;
    }
  }
};
GoTrueClient.nextInstanceID = 0;

// node_modules/@supabase/auth-js/dist/module/AuthClient.js
var AuthClient = GoTrueClient;
var AuthClient_default = AuthClient;

// node_modules/@supabase/supabase-js/dist/module/lib/SupabaseAuthClient.js
var SupabaseAuthClient = class extends AuthClient_default {
  constructor(options) {
    super(options);
  }
};

// node_modules/@supabase/supabase-js/dist/module/SupabaseClient.js
var __awaiter8 = function(thisArg, _arguments, P, generator) {
  function adopt(value) {
    return value instanceof P ? value : new P(function(resolve) {
      resolve(value);
    });
  }
  return new (P || (P = Promise))(function(resolve, reject) {
    function fulfilled(value) {
      try {
        step(generator.next(value));
      } catch (e) {
        reject(e);
      }
    }
    function rejected(value) {
      try {
        step(generator["throw"](value));
      } catch (e) {
        reject(e);
      }
    }
    function step(result) {
      result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected);
    }
    step((generator = generator.apply(thisArg, _arguments || [])).next());
  });
};
var SupabaseClient = class {
  /**
   * Create a new client for use in the browser.
   * @param supabaseUrl The unique Supabase URL which is supplied when you create a new project in your project dashboard.
   * @param supabaseKey The unique Supabase Key which is supplied when you create a new project in your project dashboard.
   * @param options.db.schema You can switch in between schemas. The schema needs to be on the list of exposed schemas inside Supabase.
   * @param options.auth.autoRefreshToken Set to "true" if you want to automatically refresh the token before expiring.
   * @param options.auth.persistSession Set to "true" if you want to automatically save the user session into local storage.
   * @param options.auth.detectSessionInUrl Set to "true" if you want to automatically detects OAuth grants in the URL and signs in the user.
   * @param options.realtime Options passed along to realtime-js constructor.
   * @param options.global.fetch A custom fetch implementation.
   * @param options.global.headers Any additional headers to send with each network request.
   */
  constructor(supabaseUrl, supabaseKey, options) {
    var _a, _b, _c;
    this.supabaseUrl = supabaseUrl;
    this.supabaseKey = supabaseKey;
    if (!supabaseUrl)
      throw new Error("supabaseUrl is required.");
    if (!supabaseKey)
      throw new Error("supabaseKey is required.");
    const _supabaseUrl = ensureTrailingSlash(supabaseUrl);
    const baseUrl = new URL(_supabaseUrl);
    this.realtimeUrl = new URL("realtime/v1", baseUrl);
    this.realtimeUrl.protocol = this.realtimeUrl.protocol.replace("http", "ws");
    this.authUrl = new URL("auth/v1", baseUrl);
    this.storageUrl = new URL("storage/v1", baseUrl);
    this.functionsUrl = new URL("functions/v1", baseUrl);
    const defaultStorageKey = `sb-${baseUrl.hostname.split(".")[0]}-auth-token`;
    const DEFAULTS = {
      db: DEFAULT_DB_OPTIONS,
      realtime: DEFAULT_REALTIME_OPTIONS,
      auth: Object.assign(Object.assign({}, DEFAULT_AUTH_OPTIONS), { storageKey: defaultStorageKey }),
      global: DEFAULT_GLOBAL_OPTIONS
    };
    const settings = applySettingDefaults(options !== null && options !== void 0 ? options : {}, DEFAULTS);
    this.storageKey = (_a = settings.auth.storageKey) !== null && _a !== void 0 ? _a : "";
    this.headers = (_b = settings.global.headers) !== null && _b !== void 0 ? _b : {};
    if (!settings.accessToken) {
      this.auth = this._initSupabaseAuthClient((_c = settings.auth) !== null && _c !== void 0 ? _c : {}, this.headers, settings.global.fetch);
    } else {
      this.accessToken = settings.accessToken;
      this.auth = new Proxy({}, {
        get: (_, prop) => {
          throw new Error(`@supabase/supabase-js: Supabase Client is configured with the accessToken option, accessing supabase.auth.${String(prop)} is not possible`);
        }
      });
    }
    this.fetch = fetchWithAuth(supabaseKey, this._getAccessToken.bind(this), settings.global.fetch);
    this.realtime = this._initRealtimeClient(Object.assign({ headers: this.headers, accessToken: this._getAccessToken.bind(this) }, settings.realtime));
    this.rest = new PostgrestClient(new URL("rest/v1", baseUrl).href, {
      headers: this.headers,
      schema: settings.db.schema,
      fetch: this.fetch
    });
    if (!settings.accessToken) {
      this._listenForAuthEvents();
    }
  }
  /**
   * Supabase Functions allows you to deploy and invoke edge functions.
   */
  get functions() {
    return new FunctionsClient(this.functionsUrl.href, {
      headers: this.headers,
      customFetch: this.fetch
    });
  }
  /**
   * Supabase Storage allows you to manage user-generated content, such as photos or videos.
   */
  get storage() {
    return new StorageClient(this.storageUrl.href, this.headers, this.fetch);
  }
  /**
   * Perform a query on a table or a view.
   *
   * @param relation - The table or view name to query
   */
  from(relation) {
    return this.rest.from(relation);
  }
  // NOTE: signatures must be kept in sync with PostgrestClient.schema
  /**
   * Select a schema to query or perform an function (rpc) call.
   *
   * The schema needs to be on the list of exposed schemas inside Supabase.
   *
   * @param schema - The schema to query
   */
  schema(schema) {
    return this.rest.schema(schema);
  }
  // NOTE: signatures must be kept in sync with PostgrestClient.rpc
  /**
   * Perform a function call.
   *
   * @param fn - The function name to call
   * @param args - The arguments to pass to the function call
   * @param options - Named parameters
   * @param options.head - When set to `true`, `data` will not be returned.
   * Useful if you only need the count.
   * @param options.get - When set to `true`, the function will be called with
   * read-only access mode.
   * @param options.count - Count algorithm to use to count rows returned by the
   * function. Only applicable for [set-returning
   * functions](https://www.postgresql.org/docs/current/functions-srf.html).
   *
   * `"exact"`: Exact but slow count algorithm. Performs a `COUNT(*)` under the
   * hood.
   *
   * `"planned"`: Approximated but fast count algorithm. Uses the Postgres
   * statistics under the hood.
   *
   * `"estimated"`: Uses exact count for low numbers and planned count for high
   * numbers.
   */
  rpc(fn, args = {}, options = {}) {
    return this.rest.rpc(fn, args, options);
  }
  /**
   * Creates a Realtime channel with Broadcast, Presence, and Postgres Changes.
   *
   * @param {string} name - The name of the Realtime channel.
   * @param {Object} opts - The options to pass to the Realtime channel.
   *
   */
  channel(name, opts = { config: {} }) {
    return this.realtime.channel(name, opts);
  }
  /**
   * Returns all Realtime channels.
   */
  getChannels() {
    return this.realtime.getChannels();
  }
  /**
   * Unsubscribes and removes Realtime channel from Realtime client.
   *
   * @param {RealtimeChannel} channel - The name of the Realtime channel.
   *
   */
  removeChannel(channel) {
    return this.realtime.removeChannel(channel);
  }
  /**
   * Unsubscribes and removes all Realtime channels from Realtime client.
   */
  removeAllChannels() {
    return this.realtime.removeAllChannels();
  }
  _getAccessToken() {
    var _a, _b;
    return __awaiter8(this, void 0, void 0, function* () {
      if (this.accessToken) {
        return yield this.accessToken();
      }
      const { data } = yield this.auth.getSession();
      return (_b = (_a = data.session) === null || _a === void 0 ? void 0 : _a.access_token) !== null && _b !== void 0 ? _b : null;
    });
  }
  _initSupabaseAuthClient({ autoRefreshToken, persistSession, detectSessionInUrl, storage, storageKey, flowType, lock, debug }, headers, fetch3) {
    const authHeaders = {
      Authorization: `Bearer ${this.supabaseKey}`,
      apikey: `${this.supabaseKey}`
    };
    return new SupabaseAuthClient({
      url: this.authUrl.href,
      headers: Object.assign(Object.assign({}, authHeaders), headers),
      storageKey,
      autoRefreshToken,
      persistSession,
      detectSessionInUrl,
      storage,
      flowType,
      lock,
      debug,
      fetch: fetch3,
      // auth checks if there is a custom authorizaiton header using this flag
      // so it knows whether to return an error when getUser is called with no session
      hasCustomAuthorizationHeader: "Authorization" in this.headers
    });
  }
  _initRealtimeClient(options) {
    return new RealtimeClient(this.realtimeUrl.href, Object.assign(Object.assign({}, options), { params: Object.assign({ apikey: this.supabaseKey }, options === null || options === void 0 ? void 0 : options.params) }));
  }
  _listenForAuthEvents() {
    let data = this.auth.onAuthStateChange((event, session) => {
      this._handleTokenChanged(event, "CLIENT", session === null || session === void 0 ? void 0 : session.access_token);
    });
    return data;
  }
  _handleTokenChanged(event, source, token) {
    if ((event === "TOKEN_REFRESHED" || event === "SIGNED_IN") && this.changedAccessToken !== token) {
      this.changedAccessToken = token;
    } else if (event === "SIGNED_OUT") {
      this.realtime.setAuth();
      if (source == "STORAGE")
        this.auth.signOut();
      this.changedAccessToken = void 0;
    }
  }
};

// node_modules/@supabase/supabase-js/dist/module/index.js
var createClient = (supabaseUrl, supabaseKey, options) => {
  return new SupabaseClient(supabaseUrl, supabaseKey, options);
};

// lib/microclimate/frostSeason.ts
function hasTag(tags, tag) {
  return tags.includes(tag);
}
function toDayOfYear(month, day) {
  const d = new Date(2024, month - 1, day);
  const start = new Date(2024, 0, 0);
  return Math.floor((d.getTime() - start.getTime()) / 864e5);
}
function shiftFrostDate(month, day, weekOffset) {
  const d = new Date(2024, month - 1, day);
  d.setDate(d.getDate() + weekOffset * 7);
  return { month: d.getMonth() + 1, day: d.getDate() };
}
function isInRegionalFrostSeason(profile, date = /* @__PURE__ */ new Date()) {
  const first = shiftFrostDate(
    profile.firstFrostDateMonth,
    profile.firstFrostDateDay,
    profile.firstFrostWeekOffset
  );
  const last = shiftFrostDate(
    profile.lastFrostDateMonth,
    profile.lastFrostDateDay,
    profile.lastFrostWeekOffset
  );
  const now = toDayOfYear(date.getMonth() + 1, date.getDate());
  const firstDoy = toDayOfYear(first.month, first.day);
  const lastDoy = toDayOfYear(last.month, last.day);
  if (firstDoy <= lastDoy) {
    return now >= firstDoy && now <= lastDoy;
  }
  return now >= firstDoy || now <= lastDoy;
}
function forecastThresholdInSeason(climate, tags) {
  if (hasTag(tags, "alpine_highland")) return 0;
  if (hasTag(tags, "coastal")) return 4;
  if (hasTag(tags, "urban_heat")) return 3;
  if (climate === "cold" || climate === "cool") return 2;
  return 2;
}
function getFrostGuidanceConfig(ctx, date = /* @__PURE__ */ new Date()) {
  if (!ctx) {
    return { seasonalFrostAdvice: true, forecastFrostMinC: 2 };
  }
  const { climate, microclimateTags: tags, frostProfile, seasonCalendar } = ctx;
  const inSeason = isInRegionalFrostSeason(frostProfile, date);
  if (seasonCalendar === "tropical_wet_dry" && !hasTag(tags, "alpine_highland")) {
    return { seasonalFrostAdvice: false, forecastFrostMinC: null };
  }
  if (climate === "tropical") {
    return { seasonalFrostAdvice: false, forecastFrostMinC: 0 };
  }
  if (climate === "warm" && !inSeason) {
    return { seasonalFrostAdvice: false, forecastFrostMinC: 0 };
  }
  if (!inSeason) {
    return {
      seasonalFrostAdvice: false,
      forecastFrostMinC: 0
    };
  }
  return {
    seasonalFrostAdvice: true,
    forecastFrostMinC: forecastThresholdInSeason(climate, tags)
  };
}
function shouldWarnForecastFrost(minC, config) {
  const threshold = config.forecastFrostMinC;
  if (threshold === null) return false;
  return minC <= threshold;
}

// lib/types/location.ts
function mapZoneToClimate(zone) {
  const zoneNum = parseInt(zone.substring(0, 2));
  if (zoneNum <= 8) return "cold";
  if (zoneNum === 9) return "cool";
  if (zoneNum === 10) return "temperate";
  if (zoneNum === 11) return "warm";
  return "tropical";
}
function getFrostDates(zone) {
  const frostMap = {
    // Last frost = spring end; first frost = autumn start (frost-risk window for modifiers).
    // 8a/8b: spring last frost mid-Oct (not Nov) so October planting calendars apply for tomatoes.
    "8a": { lastFrostDateMonth: 10, lastFrostDateDay: 12, firstFrostDateMonth: 4, firstFrostDateDay: 15 },
    "8b": { lastFrostDateMonth: 10, lastFrostDateDay: 12, firstFrostDateMonth: 4, firstFrostDateDay: 20 },
    "9a": { lastFrostDateMonth: 5, lastFrostDateDay: 15, firstFrostDateMonth: 11, firstFrostDateDay: 18 },
    "9b": { lastFrostDateMonth: 5, lastFrostDateDay: 1, firstFrostDateMonth: 11, firstFrostDateDay: 18 },
    "10a": { lastFrostDateMonth: 4, lastFrostDateDay: 15, firstFrostDateMonth: 11, firstFrostDateDay: 18 },
    "10b": { lastFrostDateMonth: 4, lastFrostDateDay: 1, firstFrostDateMonth: 11, firstFrostDateDay: 18 },
    "11a": { lastFrostDateMonth: 3, lastFrostDateDay: 15, firstFrostDateMonth: 12, firstFrostDateDay: 1 },
    "11b": { lastFrostDateMonth: 3, lastFrostDateDay: 1, firstFrostDateMonth: 12, firstFrostDateDay: 15 },
    "12a": { lastFrostDateMonth: 2, lastFrostDateDay: 15, firstFrostDateMonth: 12, firstFrostDateDay: 20 },
    "12b": { lastFrostDateMonth: 2, lastFrostDateDay: 1, firstFrostDateMonth: 12, firstFrostDateDay: 25 }
  };
  return frostMap[zone];
}

// lib/auSuburbData.ts
var SUBURB_DATA = [
  // TASMANIA (8a-8b: Cold)
  { name: "Hobart", state: "TAS", lat: -42.8821, lon: 147.3272, auHardinessZone: "8b", microclimate: "coastal" },
  { name: "Launceston", state: "TAS", lat: -41.4345, lon: 147.1106, auHardinessZone: "8a" },
  { name: "Sandy Bay", state: "TAS", lat: -42.9213, lon: 147.3247, auHardinessZone: "8b", microclimate: "coastal" },
  { name: "Battery Point", state: "TAS", lat: -42.8876, lon: 147.3156, auHardinessZone: "8b", microclimate: "coastal" },
  { name: "South Hobart", state: "TAS", lat: -42.8997, lon: 147.3355, auHardinessZone: "8b" },
  { name: "Bellerine", state: "TAS", lat: -42.9158, lon: 147.3267, auHardinessZone: "8b", microclimate: "coastal" },
  { name: "Glenorchy", state: "TAS", lat: -42.9289, lon: 147.3103, auHardinessZone: "8b" },
  { name: "Kingston", state: "TAS", lat: -43.0289, lon: 147.3181, auHardinessZone: "8b", microclimate: "coastal" },
  { name: "Blackmans Bay", state: "TAS", lat: -43.0062, lon: 147.3234, auHardinessZone: "8b", microclimate: "coastal" },
  { name: "Taroona", state: "TAS", lat: -42.9476, lon: 147.3512, auHardinessZone: "8b", microclimate: "coastal" },
  { name: "Howrah", state: "TAS", lat: -42.8867, lon: 147.4068, auHardinessZone: "8b", microclimate: "coastal" },
  { name: "Lauderdale", state: "TAS", lat: -42.8889, lon: 147.4833, auHardinessZone: "8b", microclimate: "coastal" },
  { name: "Invermay", state: "TAS", lat: -41.4256, lon: 147.1267, auHardinessZone: "8a" },
  { name: "Riverside", state: "TAS", lat: -41.4433, lon: 147.0956, auHardinessZone: "8a" },
  // VICTORIA (9a-9b: Cool to Temperate)
  { name: "Melbourne", state: "VIC", lat: -37.8136, lon: 144.9631, auHardinessZone: "9b" },
  { name: "Brunswick", state: "VIC", lat: -37.7632, lon: 144.9633, auHardinessZone: "9b" },
  { name: "Coburg", state: "VIC", lat: -37.7338, lon: 144.9436, auHardinessZone: "9b" },
  { name: "Fitzroy", state: "VIC", lat: -37.8012, lon: 144.9711, auHardinessZone: "9b" },
  { name: "Carlton", state: "VIC", lat: -37.7975, lon: 144.9728, auHardinessZone: "9b" },
  { name: "Hawthorn", state: "VIC", lat: -37.8181, lon: 145.0267, auHardinessZone: "9b" },
  { name: "Camberwell", state: "VIC", lat: -37.8267, lon: 145.0761, auHardinessZone: "9b" },
  { name: "Canterbury", state: "VIC", lat: -37.8394, lon: 145.1061, auHardinessZone: "9b" },
  { name: "Ringwood", state: "VIC", lat: -37.8281, lon: 145.2272, auHardinessZone: "9b" },
  { name: "Dandenong", state: "VIC", lat: -37.9889, lon: 145.2003, auHardinessZone: "9b" },
  { name: "Ballarat", state: "VIC", lat: -37.5585, lon: 143.8503, auHardinessZone: "9a" },
  { name: "Bendigo", state: "VIC", lat: -36.7597, lon: 144.2808, auHardinessZone: "9a" },
  { name: "Geelong", state: "VIC", lat: -38.1499, lon: 144.3617, auHardinessZone: "9b" },
  { name: "Warrnambool", state: "VIC", lat: -38.3897, lon: 142.4858, auHardinessZone: "9a" },
  { name: "Hamilton", state: "VIC", lat: -37.7397, lon: 142.0161, auHardinessZone: "9a" },
  // NEW SOUTH WALES (9a-10b: Cool to Temperate/Warm)
  { name: "Sydney", state: "NSW", lat: -33.8688, lon: 151.2093, auHardinessZone: "10b" },
  { name: "Parramatta", state: "NSW", lat: -33.805, lon: 151.0093, auHardinessZone: "10b" },
  { name: "Manly", state: "NSW", lat: -33.7805, lon: 151.2846, auHardinessZone: "10b" },
  { name: "Bondi", state: "NSW", lat: -33.8905, lon: 151.2744, auHardinessZone: "10b" },
  { name: "Strathfield", state: "NSW", lat: -33.8792, lon: 151.0964, auHardinessZone: "10b" },
  { name: "Penrith", state: "NSW", lat: -33.75, lon: 150.7061, auHardinessZone: "10a" },
  { name: "Campbelltown", state: "NSW", lat: -34.0703, lon: 150.8156, auHardinessZone: "10a" },
  { name: "Wollongong", state: "NSW", lat: -34.4208, lon: 150.8931, auHardinessZone: "10a" },
  { name: "Newcastle", state: "NSW", lat: -32.9267, lon: 151.7828, auHardinessZone: "10b" },
  { name: "Lismore", state: "NSW", lat: -28.8093, lon: 153.2759, auHardinessZone: "11a" },
  { name: "Coffs Harbour", state: "NSW", lat: -30.3031, lon: 153.1197, auHardinessZone: "11a" },
  { name: "Armidale", state: "NSW", lat: -30.5043, lon: 151.4368, auHardinessZone: "9b" },
  { name: "Tamworth", state: "NSW", lat: -31.0894, lon: 151.5453, auHardinessZone: "10a" },
  { name: "Orange", state: "NSW", lat: -33.2839, lon: 149.1006, auHardinessZone: "9b" },
  { name: "Bathurst", state: "NSW", lat: -33.4146, lon: 149.5808, auHardinessZone: "9a" },
  // QUEENSLAND (10a-12b: Temperate to Tropical)
  { name: "Brisbane", state: "QLD", lat: -27.4698, lon: 153.0251, auHardinessZone: "11a" },
  { name: "Gold Coast", state: "QLD", lat: -28.0028, lon: 153.4314, auHardinessZone: "11a" },
  { name: "Broadbeach", state: "QLD", lat: -28.0086, lon: 153.4381, auHardinessZone: "11a" },
  { name: "Surfers Paradise", state: "QLD", lat: -28.0088, lon: 153.428, auHardinessZone: "11a" },
  { name: "Toowoomba", state: "QLD", lat: -27.5598, lon: 151.9507, auHardinessZone: "10b" },
  { name: "Ipswich", state: "QLD", lat: -27.6259, lon: 152.769, auHardinessZone: "10b" },
  { name: "Sunshine Coast", state: "QLD", lat: -26.792, lon: 153.0948, auHardinessZone: "11a" },
  { name: "Caloundra", state: "QLD", lat: -26.7981, lon: 153.1289, auHardinessZone: "11a" },
  { name: "Maroochydore", state: "QLD", lat: -26.6584, lon: 153.0955, auHardinessZone: "11a" },
  { name: "Noosa Heads", state: "QLD", lat: -26.3954, lon: 153.0923, auHardinessZone: "11a" },
  { name: "Rockhampton", state: "QLD", lat: -23.3813, lon: 150.5007, auHardinessZone: "11b" },
  { name: "Gladstone", state: "QLD", lat: -23.8453, lon: 151.254, auHardinessZone: "11b" },
  { name: "Mackay", state: "QLD", lat: -21.1412, lon: 149.1839, auHardinessZone: "12a" },
  { name: "Townsville", state: "QLD", lat: -19.2643, lon: 146.8118, auHardinessZone: "12a" },
  { name: "Cairns", state: "QLD", lat: -16.8661, lon: 145.7781, auHardinessZone: "12b" },
  { name: "Port Douglas", state: "QLD", lat: -16.4881, lon: 145.4607, auHardinessZone: "12b" },
  // SOUTH AUSTRALIA (9a-10a: Cool to Temperate)
  { name: "Adelaide", state: "SA", lat: -34.9285, lon: 138.6007, auHardinessZone: "9b" },
  { name: "Norwood", state: "SA", lat: -34.9198, lon: 138.6271, auHardinessZone: "9b" },
  { name: "Burnside", state: "SA", lat: -34.9464, lon: 138.6572, auHardinessZone: "9b" },
  { name: "Glenelg", state: "SA", lat: -34.9859, lon: 138.5275, auHardinessZone: "9b" },
  { name: "Henley Beach", state: "SA", lat: -34.9741, lon: 138.4846, auHardinessZone: "9b" },
  { name: "Mount Barker", state: "SA", lat: -35.0805, lon: 139.0017, auHardinessZone: "9a" },
  { name: "Barossa", state: "SA", lat: -34.5237, lon: 139.0122, auHardinessZone: "9a" },
  { name: "Clare", state: "SA", lat: -33.8334, lon: 138.6201, auHardinessZone: "9a" },
  // WESTERN AUSTRALIA (9a-11a: Cool to Warm)
  { name: "Perth", state: "WA", lat: -31.9505, lon: 115.8605, auHardinessZone: "10a" },
  { name: "Fremantle", state: "WA", lat: -32.0521, lon: 115.7442, auHardinessZone: "10a" },
  { name: "Subiaco", state: "WA", lat: -31.9858, lon: 115.8156, auHardinessZone: "10a" },
  { name: "Applecross", state: "WA", lat: -32.0175, lon: 115.9128, auHardinessZone: "10a" },
  { name: "Bunbury", state: "WA", lat: -33.3268, lon: 115.6408, auHardinessZone: "9b" },
  { name: "Busselton", state: "WA", lat: -33.6485, lon: 115.3667, auHardinessZone: "9a" },
  { name: "Margaret River", state: "WA", lat: -33.9506, lon: 115.0563, auHardinessZone: "9a" },
  { name: "Albany", state: "WA", lat: -34.4833, lon: 117.8758, auHardinessZone: "9a" },
  // NORTHERN TERRITORY (11b-12b: Warm to Tropical)
  { name: "Darwin", state: "NT", lat: -12.4634, lon: 130.8456, auHardinessZone: "12b" },
  { name: "Palmerston", state: "NT", lat: -12.5113, lon: 131.0289, auHardinessZone: "12b" },
  { name: "Alice Springs", state: "NT", lat: -23.698, lon: 133.8807, auHardinessZone: "11a" },
  // AUSTRALIAN CAPITAL TERRITORY (9a-9b: Cool)
  { name: "Canberra", state: "ACT", lat: -35.2809, lon: 149.13, auHardinessZone: "9a" },
  { name: "Belconnen", state: "ACT", lat: -35.2387, lon: 149.0754, auHardinessZone: "9a" },
  { name: "Woden Valley", state: "ACT", lat: -35.3433, lon: 149.1097, auHardinessZone: "9a" },
  { name: "Tuggeranong", state: "ACT", lat: -35.4286, lon: 149.063, auHardinessZone: "9a" }
];

// lib/utils/haversine.ts
function haversine(lat1, lon1, lat2, lon2) {
  const R = 6371;
  const dLat = toRadians(lat2 - lat1);
  const dLon = toRadians(lon2 - lon1);
  const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) + Math.cos(toRadians(lat1)) * Math.cos(toRadians(lat2)) * Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const distance = R * c;
  return distance;
}
function toRadians(degrees) {
  return degrees * (Math.PI / 180);
}

// lib/places/auPlacesBulk.ts
var PLACE_SEEDS = [
  [
    "Alexandria",
    "NSW",
    -33.906,
    151.195,
    "10b"
  ],
  [
    "Marrickville",
    "NSW",
    -33.911,
    151.156,
    "10b"
  ],
  [
    "Leichhardt",
    "NSW",
    -33.883,
    151.156,
    "10b"
  ],
  [
    "Balmain",
    "NSW",
    -33.857,
    151.179,
    "10b"
  ],
  [
    "Rozelle",
    "NSW",
    -33.864,
    151.166,
    "10b"
  ],
  [
    "Drummoyne",
    "NSW",
    -33.852,
    151.155,
    "10b"
  ],
  [
    "Ryde",
    "NSW",
    -33.817,
    151.106,
    "10b"
  ],
  [
    "Hornsby",
    "NSW",
    -33.705,
    151.099,
    "10b"
  ],
  [
    "Epping",
    "NSW",
    -33.772,
    151.082,
    "10b"
  ],
  [
    "Blacktown",
    "NSW",
    -33.769,
    150.906,
    "10a"
  ],
  [
    "Castle Hill",
    "NSW",
    -33.733,
    151.005,
    "10a"
  ],
  [
    "Kellyville",
    "NSW",
    -33.713,
    150.954,
    "10a"
  ],
  [
    "Liverpool",
    "NSW",
    -33.92,
    150.926,
    "10a"
  ],
  [
    "Campbelltown",
    "NSW",
    -34.07,
    150.815,
    "10a"
  ],
  [
    "Hurstville",
    "NSW",
    -33.967,
    151.102,
    "10b"
  ],
  [
    "Sutherland",
    "NSW",
    -34.031,
    151.057,
    "10b"
  ],
  [
    "Cronulla",
    "NSW",
    -34.058,
    151.152,
    "10b"
  ],
  [
    "Miranda",
    "NSW",
    -34.039,
    151.106,
    "10b"
  ],
  [
    "Randwick",
    "NSW",
    -33.914,
    151.241,
    "10b"
  ],
  [
    "Maroubra",
    "NSW",
    -33.95,
    151.244,
    "10b"
  ],
  [
    "Coogee",
    "NSW",
    -33.92,
    151.256,
    "10b"
  ],
  [
    "Mosman",
    "NSW",
    -33.829,
    151.244,
    "10b"
  ],
  [
    "Chatswood",
    "NSW",
    -33.797,
    151.183,
    "10b"
  ],
  [
    "North Sydney",
    "NSW",
    -33.839,
    151.207,
    "10b"
  ],
  [
    "Bankstown",
    "NSW",
    -33.917,
    151.035,
    "10b"
  ],
  [
    "Fairfield",
    "NSW",
    -33.871,
    150.956,
    "10a"
  ],
  [
    "Auburn",
    "NSW",
    -33.849,
    151.032,
    "10b"
  ],
  [
    "Ashfield",
    "NSW",
    -33.888,
    151.125,
    "10b"
  ],
  [
    "Burwood",
    "NSW",
    -33.878,
    151.104,
    "10b"
  ],
  [
    "Gosford",
    "NSW",
    -33.424,
    151.342,
    "10b"
  ],
  [
    "Terrigal",
    "NSW",
    -33.448,
    151.444,
    "10b"
  ],
  [
    "Taree",
    "NSW",
    -31.91,
    152.459,
    "10b"
  ],
  [
    "Griffith",
    "NSW",
    -34.29,
    146.045,
    "10a"
  ],
  [
    "Broken Hill",
    "NSW",
    -31.953,
    141.453,
    "10b"
  ],
  [
    "Goulburn",
    "NSW",
    -34.754,
    149.719,
    "9b"
  ],
  [
    "Nowra",
    "NSW",
    -34.881,
    150.601,
    "10a"
  ],
  [
    "Kiama",
    "NSW",
    -34.672,
    150.854,
    "10a"
  ],
  [
    "Batemans Bay",
    "NSW",
    -35.708,
    150.175,
    "10a"
  ],
  [
    "Bega",
    "NSW",
    -36.675,
    149.841,
    "9b"
  ],
  [
    "Forster",
    "NSW",
    -32.18,
    152.517,
    "10b"
  ],
  [
    "Tamworth",
    "NSW",
    -31.089,
    151.545,
    "10a"
  ],
  [
    "Moree",
    "NSW",
    -29.464,
    149.841,
    "10b"
  ],
  [
    "Narrabri",
    "NSW",
    -30.324,
    149.782,
    "10a"
  ],
  [
    "Blackheath",
    "NSW",
    -33.635,
    150.285,
    "9a"
  ],
  [
    "Wentworth Falls",
    "NSW",
    -33.717,
    150.375,
    "9a"
  ],
  [
    "Lithgow",
    "NSW",
    -33.483,
    150.157,
    "9a"
  ],
  [
    "Cowra",
    "NSW",
    -33.834,
    148.691,
    "9b"
  ],
  [
    "Young",
    "NSW",
    -34.311,
    148.301,
    "9b"
  ],
  [
    "South Yarra",
    "VIC",
    -37.838,
    144.992,
    "9b"
  ],
  [
    "Prahran",
    "VIC",
    -37.851,
    144.993,
    "9b"
  ],
  [
    "St Kilda East",
    "VIC",
    -37.868,
    145,
    "9b"
  ],
  [
    "Elwood",
    "VIC",
    -37.883,
    144.984,
    "9b"
  ],
  [
    "Williamstown",
    "VIC",
    -37.865,
    144.899,
    "9b"
  ],
  [
    "Sunshine",
    "VIC",
    -37.783,
    144.832,
    "9b"
  ],
  [
    "Footscray",
    "VIC",
    -37.799,
    144.9,
    "9b"
  ],
  [
    "Preston",
    "VIC",
    -37.74,
    145.007,
    "9b"
  ],
  [
    "Reservoir",
    "VIC",
    -37.717,
    145.007,
    "9b"
  ],
  [
    "Bundoora",
    "VIC",
    -37.698,
    145.061,
    "9b"
  ],
  [
    "Box Hill",
    "VIC",
    -37.819,
    145.123,
    "9b"
  ],
  [
    "Glen Waverley",
    "VIC",
    -37.878,
    145.165,
    "9b"
  ],
  [
    "Frankston",
    "VIC",
    -38.144,
    145.122,
    "9b"
  ],
  [
    "Dromana",
    "VIC",
    -38.334,
    144.965,
    "9b"
  ],
  [
    "Rosebud",
    "VIC",
    -38.355,
    144.906,
    "9b"
  ],
  [
    "Werribee",
    "VIC",
    -37.901,
    144.663,
    "9b"
  ],
  [
    "Melton",
    "VIC",
    -37.683,
    144.585,
    "9b"
  ],
  [
    "Sunbury",
    "VIC",
    -37.578,
    144.713,
    "9b"
  ],
  [
    "Craigieburn",
    "VIC",
    -37.6,
    144.943,
    "9b"
  ],
  [
    "Epping",
    "VIC",
    -37.648,
    145.027,
    "9b"
  ],
  [
    "Lilydale",
    "VIC",
    -37.757,
    145.351,
    "9b"
  ],
  [
    "Healesville",
    "VIC",
    -37.654,
    145.517,
    "9a"
  ],
  [
    "Warburton",
    "VIC",
    -37.751,
    145.698,
    "9a"
  ],
  [
    "Daylesford",
    "VIC",
    -37.348,
    144.14,
    "9a"
  ],
  [
    "Castlemaine",
    "VIC",
    -37.064,
    144.218,
    "9a"
  ],
  [
    "Kyneton",
    "VIC",
    -37.247,
    144.455,
    "9a"
  ],
  [
    "Woodend",
    "VIC",
    -37.356,
    144.526,
    "9a"
  ],
  [
    "Maryborough",
    "VIC",
    -37.046,
    143.737,
    "9a"
  ],
  [
    "Sale",
    "VIC",
    -38.104,
    147.066,
    "9b"
  ],
  [
    "Traralgon",
    "VIC",
    -38.195,
    146.541,
    "9b"
  ],
  [
    "Wodonga",
    "VIC",
    -36.122,
    146.888,
    "9b"
  ],
  [
    "Echuca",
    "VIC",
    -36.136,
    144.751,
    "9b"
  ],
  [
    "Swan Hill",
    "VIC",
    -35.338,
    143.554,
    "10a"
  ],
  [
    "Horsham",
    "VIC",
    -36.715,
    142.199,
    "9a"
  ],
  [
    "Colac",
    "VIC",
    -38.34,
    143.585,
    "9b"
  ],
  [
    "Portland",
    "VIC",
    -38.343,
    141.603,
    "9a"
  ],
  [
    "Bright",
    "VIC",
    -36.731,
    146.96,
    "9a"
  ],
  [
    "Beechworth",
    "VIC",
    -36.359,
    146.686,
    "9a"
  ],
  [
    "Cobram",
    "VIC",
    -35.921,
    145.641,
    "10a"
  ],
  [
    "South Brisbane",
    "QLD",
    -27.478,
    153.018,
    "11a"
  ],
  [
    "West End",
    "QLD",
    -27.481,
    153.008,
    "11a"
  ],
  [
    "Fortitude Valley",
    "QLD",
    -27.457,
    153.035,
    "11a"
  ],
  [
    "New Farm",
    "QLD",
    -27.468,
    153.049,
    "11a"
  ],
  [
    "Chermside",
    "QLD",
    -27.387,
    153.032,
    "11a"
  ],
  [
    "Indooroopilly",
    "QLD",
    -27.499,
    152.974,
    "11a"
  ],
  [
    "Carindale",
    "QLD",
    -27.506,
    153.102,
    "11a"
  ],
  [
    "Redcliffe",
    "QLD",
    -27.231,
    153.107,
    "11a"
  ],
  [
    "Caboolture",
    "QLD",
    -27.085,
    152.951,
    "11a"
  ],
  [
    "Nambour",
    "QLD",
    -26.627,
    152.959,
    "11a"
  ],
  [
    "Gympie",
    "QLD",
    -26.19,
    152.665,
    "11a"
  ],
  [
    "Maryborough",
    "QLD",
    -25.537,
    152.705,
    "11a"
  ],
  [
    "Emerald",
    "QLD",
    -23.527,
    148.157,
    "11b"
  ],
  [
    "Longreach",
    "QLD",
    -23.442,
    144.249,
    "11b"
  ],
  [
    "Charleville",
    "QLD",
    -26.404,
    146.239,
    "11a"
  ],
  [
    "Roma",
    "QLD",
    -26.567,
    148.787,
    "11a"
  ],
  [
    "Dalby",
    "QLD",
    -27.183,
    151.267,
    "10b"
  ],
  [
    "Warwick",
    "QLD",
    -28.219,
    152.034,
    "10b"
  ],
  [
    "Kingaroy",
    "QLD",
    -26.541,
    151.84,
    "10b"
  ],
  [
    "Yeppoon",
    "QLD",
    -23.129,
    150.742,
    "11b"
  ],
  [
    "Bowen",
    "QLD",
    -20.013,
    148.247,
    "12a"
  ],
  [
    "Ayr",
    "QLD",
    -19.576,
    147.406,
    "12a"
  ],
  [
    "Innisfail",
    "QLD",
    -17.523,
    146.031,
    "12b"
  ],
  [
    "Atherton",
    "QLD",
    -17.262,
    145.476,
    "12a"
  ],
  [
    "Weipa",
    "QLD",
    -12.678,
    141.869,
    "12b"
  ],
  [
    "Scarborough",
    "WA",
    -31.894,
    115.758,
    "10a"
  ],
  [
    "Cottesloe",
    "WA",
    -31.995,
    115.755,
    "10a"
  ],
  [
    "Claremont",
    "WA",
    -31.982,
    115.78,
    "10a"
  ],
  [
    "Midland",
    "WA",
    -31.889,
    116.009,
    "10a"
  ],
  [
    "Armadale",
    "WA",
    -32.153,
    116.009,
    "10a"
  ],
  [
    "Kwinana",
    "WA",
    -32.239,
    115.781,
    "10a"
  ],
  [
    "Geraldton",
    "WA",
    -28.779,
    114.615,
    "10b"
  ],
  [
    "Kalbarri",
    "WA",
    -27.711,
    114.162,
    "10b"
  ],
  [
    "Carnarvon",
    "WA",
    -24.883,
    113.657,
    "11a"
  ],
  [
    "Karratha",
    "WA",
    -20.736,
    116.846,
    "11b"
  ],
  [
    "Port Hedland",
    "WA",
    -20.312,
    118.601,
    "11b"
  ],
  [
    "Esperance",
    "WA",
    -33.861,
    121.891,
    "9b"
  ],
  [
    "Northam",
    "WA",
    -31.653,
    116.666,
    "10a"
  ],
  [
    "Narrogin",
    "WA",
    -32.934,
    117.178,
    "9b"
  ],
  [
    "Collie",
    "WA",
    -33.362,
    116.156,
    "9b"
  ],
  [
    "Manjimup",
    "WA",
    -34.241,
    116.145,
    "9a"
  ],
  [
    "Denmark",
    "WA",
    -34.961,
    117.353,
    "9a"
  ],
  [
    "Exmouth",
    "WA",
    -21.932,
    114.128,
    "11b"
  ],
  [
    "Unley",
    "SA",
    -34.95,
    138.606,
    "9b"
  ],
  [
    "Prospect",
    "SA",
    -34.882,
    138.594,
    "9b"
  ],
  [
    "Modbury",
    "SA",
    -34.829,
    138.683,
    "9b"
  ],
  [
    "Salisbury",
    "SA",
    -34.763,
    138.641,
    "9b"
  ],
  [
    "Noarlunga",
    "SA",
    -35.14,
    138.497,
    "9b"
  ],
  [
    "Gawler",
    "SA",
    -34.601,
    138.747,
    "9b"
  ],
  [
    "Murray Bridge",
    "SA",
    -35.119,
    139.274,
    "9b"
  ],
  [
    "Renmark",
    "SA",
    -34.674,
    140.758,
    "10a"
  ],
  [
    "Berri",
    "SA",
    -34.283,
    140.6,
    "10a"
  ],
  [
    "Ceduna",
    "SA",
    -32.127,
    133.674,
    "10a"
  ],
  [
    "Kadina",
    "SA",
    -33.963,
    137.716,
    "9b"
  ],
  [
    "Port Lincoln",
    "SA",
    -34.728,
    135.857,
    "9b"
  ],
  [
    "Coober Pedy",
    "SA",
    -29.013,
    134.754,
    "10b"
  ],
  [
    "Stirling",
    "SA",
    -35.006,
    138.717,
    "9a"
  ],
  [
    "Hahndorf",
    "SA",
    -35.029,
    138.809,
    "9a"
  ],
  [
    "Lobethal",
    "SA",
    -34.909,
    138.874,
    "9a"
  ],
  [
    "Gumeracha",
    "SA",
    -34.822,
    138.888,
    "9a"
  ],
  [
    "West Hobart",
    "TAS",
    -42.872,
    147.312,
    "8b"
  ],
  [
    "North Hobart",
    "TAS",
    -42.868,
    147.325,
    "8b"
  ],
  [
    "Bellerive",
    "TAS",
    -42.876,
    147.371,
    "8b"
  ],
  [
    "Claremont",
    "TAS",
    -42.787,
    147.248,
    "8b"
  ],
  [
    "Bridgewater",
    "TAS",
    -42.736,
    147.234,
    "8b"
  ],
  [
    "Ulverstone",
    "TAS",
    -41.158,
    146.172,
    "8b"
  ],
  [
    "Queenstown",
    "TAS",
    -42.08,
    145.555,
    "8a"
  ],
  [
    "Strahan",
    "TAS",
    -42.153,
    145.327,
    "8a"
  ],
  [
    "Scottsdale",
    "TAS",
    -41.162,
    147.514,
    "8b"
  ],
  [
    "St Helens",
    "TAS",
    -41.316,
    148.248,
    "8b"
  ],
  [
    "Smithton",
    "TAS",
    -40.842,
    145.122,
    "8b"
  ],
  [
    "Currie",
    "TAS",
    -39.928,
    143.852,
    "8b"
  ],
  [
    "Braddon",
    "ACT",
    -35.269,
    149.134,
    "9a"
  ],
  [
    "Dickson",
    "ACT",
    -35.25,
    149.139,
    "9a"
  ],
  [
    "Civic",
    "ACT",
    -35.281,
    149.131,
    "9a"
  ],
  [
    "Fyshwick",
    "ACT",
    -35.325,
    149.177,
    "9a"
  ],
  [
    "Casuarina",
    "NT",
    -12.372,
    130.872,
    "12b"
  ],
  [
    "Humpty Doo",
    "NT",
    -12.578,
    131.108,
    "12b"
  ],
  [
    "Nhulunbuy",
    "NT",
    -12.198,
    136.777,
    "12a"
  ],
  [
    "Tennant Creek",
    "NT",
    -19.65,
    134.191,
    "11b"
  ],
  [
    "Jabiru",
    "NT",
    -12.663,
    132.893,
    "12a"
  ],
  [
    "Ulladulla",
    "NSW",
    -35.359,
    150.474,
    "10a"
  ],
  [
    "Merimbula",
    "NSW",
    -36.898,
    149.901,
    "9b"
  ],
  [
    "Inverell",
    "NSW",
    -29.773,
    151.112,
    "9b"
  ],
  [
    "Parkes",
    "NSW",
    -33.137,
    148.175,
    "9b"
  ],
  [
    "Mudgee",
    "NSW",
    -32.594,
    149.588,
    "9b"
  ],
  [
    "Moruya",
    "NSW",
    -35.914,
    150.08,
    "10a"
  ],
  [
    "Wauchope",
    "NSW",
    -31.456,
    152.734,
    "10b"
  ],
  [
    "Corowa",
    "NSW",
    -35.995,
    146.391,
    "9b"
  ],
  [
    "Deniliquin",
    "NSW",
    -35.559,
    144.952,
    "10a"
  ],
  [
    "Leongatha",
    "VIC",
    -38.476,
    145.947,
    "9b"
  ],
  [
    "Wonthaggi",
    "VIC",
    -38.605,
    145.591,
    "9b"
  ],
  [
    "Ararat",
    "VIC",
    -37.283,
    142.936,
    "9a"
  ],
  [
    "Stawell",
    "VIC",
    -37.058,
    142.779,
    "9a"
  ],
  [
    "Seymour",
    "VIC",
    -37.024,
    145.136,
    "9b"
  ],
  [
    "Benalla",
    "VIC",
    -36.551,
    145.982,
    "9b"
  ],
  [
    "Moe",
    "VIC",
    -38.178,
    146.261,
    "9b"
  ],
  [
    "Bairnsdale",
    "VIC",
    -37.827,
    147.632,
    "9b"
  ],
  [
    "Mandurah",
    "WA",
    -32.526,
    115.721,
    "10a"
  ],
  [
    "Esperance",
    "WA",
    -33.861,
    121.891,
    "9b"
  ]
];

// lib/places/auPlacesExtra.ts
var AU_PLACES_EXTRA = [
  // NSW
  { id: "nsw-potts-point", name: "Potts Point", state: "NSW", lat: -33.869, lon: 151.226, auHardinessZone: "10b", microclimateTags: ["coastal", "urban_heat"] },
  { id: "nsw-surry-hills", name: "Surry Hills", state: "NSW", lat: -33.884, lon: 151.21, auHardinessZone: "10b", microclimateTags: ["urban_heat", "inland"] },
  { id: "nsw-newtown", name: "Newtown", state: "NSW", lat: -33.898, lon: 151.174, auHardinessZone: "10b", microclimateTags: ["urban_heat", "inland"] },
  { id: "nsw-chatswood", name: "Chatswood", state: "NSW", lat: -33.797, lon: 151.183, auHardinessZone: "10b", microclimateTags: ["inland"] },
  { id: "nsw-blue-mountains", name: "Katoomba", state: "NSW", lat: -33.712, lon: 150.311, auHardinessZone: "9a", microclimateTags: ["alpine_highland", "inland"] },
  { id: "nsw-dubbo", name: "Dubbo", state: "NSW", lat: -32.243, lon: 148.601, auHardinessZone: "10a", microclimateTags: ["inland", "arid_inland"] },
  { id: "nsw-wagga-wagga", name: "Wagga Wagga", state: "NSW", lat: -35.108, lon: 147.359, auHardinessZone: "9b", microclimateTags: ["inland"] },
  { id: "nsw-byron-bay", name: "Byron Bay", state: "NSW", lat: -28.647, lon: 153.602, auHardinessZone: "11a", microclimateTags: ["coastal", "subtropical_humid"] },
  { id: "nsw-port-macquarie", name: "Port Macquarie", state: "NSW", lat: -31.433, lon: 152.908, auHardinessZone: "10b", microclimateTags: ["coastal"] },
  { id: "nsw-albury", name: "Albury", state: "NSW", lat: -36.074, lon: 146.913, auHardinessZone: "9b", microclimateTags: ["inland"] },
  // VIC
  { id: "vic-st-kilda", name: "St Kilda", state: "VIC", lat: -37.867, lon: 144.984, auHardinessZone: "9b", microclimateTags: ["coastal"] },
  { id: "vic-brighton", name: "Brighton", state: "VIC", lat: -37.906, lon: 145, auHardinessZone: "9b", microclimateTags: ["coastal"] },
  { id: "vic-footscray", name: "Footscray", state: "VIC", lat: -37.799, lon: 144.9, auHardinessZone: "9b", microclimateTags: ["urban_heat", "inland"] },
  { id: "vic-richmond", name: "Richmond", state: "VIC", lat: -37.818, lon: 145.001, auHardinessZone: "9b", microclimateTags: ["urban_heat", "inland"] },
  { id: "vic-mornington", name: "Mornington", state: "VIC", lat: -38.217, lon: 145.033, auHardinessZone: "9b", microclimateTags: ["coastal"] },
  { id: "vic-warragul", name: "Warragul", state: "VIC", lat: -38.158, lon: 145.931, auHardinessZone: "9b", microclimateTags: ["inland"] },
  { id: "vic-shepparton", name: "Shepparton", state: "VIC", lat: -36.377, lon: 145.398, auHardinessZone: "9b", microclimateTags: ["inland"] },
  { id: "vic-mildura", name: "Mildura", state: "VIC", lat: -34.187, lon: 142.161, auHardinessZone: "10a", microclimateTags: ["arid_inland", "inland"] },
  // QLD
  { id: "qld-spring-hill", name: "Spring Hill", state: "QLD", lat: -27.456, lon: 153.025, auHardinessZone: "11a", microclimateTags: ["subtropical_humid", "urban_heat"] },
  { id: "qld-logan", name: "Logan", state: "QLD", lat: -27.639, lon: 153.109, auHardinessZone: "11a", microclimateTags: ["subtropical_humid", "inland"] },
  { id: "qld-toowong", name: "Toowong", state: "QLD", lat: -27.485, lon: 152.992, auHardinessZone: "11a", microclimateTags: ["subtropical_humid"] },
  { id: "qld-hervey-bay", name: "Hervey Bay", state: "QLD", lat: -25.288, lon: 152.825, auHardinessZone: "11a", microclimateTags: ["coastal", "subtropical_humid"] },
  { id: "qld-bundaberg", name: "Bundaberg", state: "QLD", lat: -24.866, lon: 152.348, auHardinessZone: "11b", microclimateTags: ["subtropical_humid", "coastal"] },
  { id: "qld-mount-isa", name: "Mount Isa", state: "QLD", lat: -20.725, lon: 139.497, auHardinessZone: "11b", microclimateTags: ["arid_inland"] },
  // WA
  { id: "wa-rockingham", name: "Rockingham", state: "WA", lat: -32.28, lon: 115.747, auHardinessZone: "10a", microclimateTags: ["coastal", "mediterranean"] },
  { id: "wa-mandurah", name: "Mandurah", state: "WA", lat: -32.526, lon: 115.721, auHardinessZone: "10a", microclimateTags: ["coastal", "mediterranean"] },
  { id: "wa-joondalup", name: "Joondalup", state: "WA", lat: -31.744, lon: 115.766, auHardinessZone: "10a", microclimateTags: ["coastal", "mediterranean"] },
  { id: "wa-kalgoorlie", name: "Kalgoorlie", state: "WA", lat: -30.748, lon: 121.465, auHardinessZone: "10b", microclimateTags: ["arid_inland"] },
  { id: "wa-broome", name: "Broome", state: "WA", lat: -17.961, lon: 122.236, auHardinessZone: "12a", microclimateTags: ["tropical_wet_dry", "coastal"] },
  // SA
  { id: "sa-victor-harbor", name: "Victor Harbor", state: "SA", lat: -35.55, lon: 138.621, auHardinessZone: "9b", microclimateTags: ["coastal", "mediterranean"] },
  { id: "sa-whyalla", name: "Whyalla", state: "SA", lat: -33.034, lon: 137.561, auHardinessZone: "9b", microclimateTags: ["coastal", "mediterranean"] },
  { id: "sa-port-augusta", name: "Port Augusta", state: "SA", lat: -32.492, lon: 137.765, auHardinessZone: "10a", microclimateTags: ["arid_inland"] },
  { id: "sa-mount-gambier", name: "Mount Gambier", state: "SA", lat: -37.828, lon: 140.779, auHardinessZone: "9a", microclimateTags: ["inland"] },
  // TAS
  { id: "tas-new-town", name: "New Town", state: "TAS", lat: -42.858, lon: 147.315, auHardinessZone: "8b", microclimateTags: ["inland"] },
  { id: "tas-lenah-valley", name: "Lenah Valley", state: "TAS", lat: -42.868, lon: 147.295, auHardinessZone: "8b", microclimateTags: ["inland"] },
  { id: "tas-moonah", name: "Moonah", state: "TAS", lat: -42.848, lon: 147.298, auHardinessZone: "8b", microclimateTags: ["inland"] },
  { id: "tas-rosny", name: "Rosny", state: "TAS", lat: -42.867, lon: 147.37, auHardinessZone: "8b", microclimateTags: ["coastal"] },
  { id: "tas-sorell", name: "Sorell", state: "TAS", lat: -42.781, lon: 147.562, auHardinessZone: "8b", microclimateTags: ["coastal", "inland"] },
  { id: "tas-devonport", name: "Devonport", state: "TAS", lat: -41.179, lon: 146.346, auHardinessZone: "8b", microclimateTags: ["coastal"] },
  { id: "tas-burnie", name: "Burnie", state: "TAS", lat: -41.052, lon: 145.903, auHardinessZone: "8b", microclimateTags: ["coastal"] },
  // ACT + NT
  { id: "act-gungahlin", name: "Gungahlin", state: "ACT", lat: -35.185, lon: 149.132, auHardinessZone: "9a", microclimateTags: ["inland"] },
  { id: "nt-katherine", name: "Katherine", state: "NT", lat: -14.465, lon: 132.263, auHardinessZone: "12a", microclimateTags: ["tropical_wet_dry"] },
  { id: "nt-alice-springs", name: "Alice Springs", state: "NT", lat: -23.698, lon: 133.881, auHardinessZone: "11a", microclimateTags: ["arid_inland"] }
];

// lib/places/coastHeuristics.ts
var COAST_SAMPLES = [
  // TAS
  { lat: -43, lon: 147.32 },
  { lat: -42.88, lon: 147.33 },
  { lat: -41.18, lon: 146.35 },
  { lat: -41.05, lon: 145.9 },
  // VIC
  { lat: -37.87, lon: 144.98 },
  { lat: -38.15, lon: 144.36 },
  { lat: -38.39, lon: 142.49 },
  // NSW
  { lat: -33.78, lon: 151.28 },
  { lat: -33.87, lon: 151.21 },
  { lat: -32.93, lon: 151.78 },
  { lat: -34.42, lon: 150.89 },
  { lat: -30.3, lon: 153.12 },
  { lat: -28.65, lon: 153.6 },
  // QLD
  { lat: -27.47, lon: 153.03 },
  { lat: -28, lon: 153.43 },
  { lat: -26.65, lon: 153.1 },
  { lat: -23.38, lon: 150.51 },
  { lat: -21.14, lon: 149.18 },
  { lat: -19.26, lon: 146.82 },
  { lat: -16.87, lon: 145.78 },
  // SA
  { lat: -34.98, lon: 138.52 },
  { lat: -35.55, lon: 138.62 },
  { lat: -32.49, lon: 137.77 },
  // WA
  { lat: -32.05, lon: 115.74 },
  { lat: -31.95, lon: 115.86 },
  { lat: -33.33, lon: 115.64 },
  { lat: -33.65, lon: 115.37 },
  { lat: -34.48, lon: 117.88 },
  { lat: -17.96, lon: 122.24 },
  // NT
  { lat: -12.46, lon: 130.85 }
];
var DEFAULT_COAST_KM = 14;
function isNearAustralianCoast(lat, lon, maxKm = DEFAULT_COAST_KM) {
  for (const sample of COAST_SAMPLES) {
    if (haversine(lat, lon, sample.lat, sample.lon) <= maxKm) {
      return true;
    }
  }
  return false;
}

// lib/places/elevationHeuristics.ts
var HIGHLAND_NAME_KEYS = new Set(
  [
    "katoomba",
    "blackheath",
    "wentworth falls",
    "orange",
    "bathurst",
    "armidale",
    "toowoomba",
    "ballarat",
    "daylesford",
    "healesville",
    "warburton",
    "mount barker",
    "stirling",
    "hahndorf",
    "lobethal",
    "gumeracha",
    "woodend",
    "kyneton",
    "castlemaine",
    "beechworth",
    "bright",
    "mount beauty",
    "marysville",
    "oberon",
    "cooma",
    "jindabyne",
    "thredbo",
    "mount gambier"
  ].map((s) => s.toLowerCase())
);
var HIGHLAND_REGIONS = [
  { minLat: -33.85, maxLat: -33.55, minLon: 150.15, maxLon: 150.45 },
  // Blue Mountains
  { minLat: -37.65, maxLat: -37.35, minLon: 143.7, maxLon: 144.1 },
  // Ballarat uplands
  { minLat: -36.95, maxLat: -36.55, minLon: 147, maxLon: 147.6 }
  // Alps fringe
];
function isLikelyHighland(name, lat, lon, zone) {
  const lower = name.toLowerCase();
  if (HIGHLAND_NAME_KEYS.has(lower)) return true;
  if (lower.includes("heights") || lower.includes("highlands")) return true;
  if (zone === "8a" || zone === "9a") {
    for (const r of HIGHLAND_REGIONS) {
      if (lat >= r.minLat && lat <= r.maxLat && lon >= r.minLon && lon <= r.maxLon) {
        return true;
      }
    }
  }
  return false;
}

// lib/places/tagInference.ts
var COASTAL_NAME_KEYS = new Set(
  [
    "manly",
    "bondi",
    "cronulla",
    "newcastle",
    "wollongong",
    "st kilda",
    "brighton",
    "glenelg",
    "henley beach",
    "fremantle",
    "blackmans bay",
    "kingston",
    "sandy bay",
    "battery point",
    "taroona",
    "howrah",
    "lauderdale",
    "bellerine",
    "broadbeach",
    "surfers paradise",
    "noosa heads",
    "maroochydore",
    "caloundra",
    "port douglas",
    "coffs harbour",
    "margaret river",
    "busselton",
    "applecross"
  ].map((s) => s.toLowerCase())
);
function slugifyPlaceId(state, name) {
  const st = state.trim().toLowerCase();
  const slug = name.trim().toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
  return `${st}-${slug}`;
}
function tagsFromLegacyMicroclimate(legacy) {
  if (legacy === "coastal") return ["coastal"];
  if (legacy === "inland") return ["inland"];
  return void 0;
}
function inferDefaultTags(name, state, zone, explicit, coords) {
  if (explicit && explicit.length > 0) return explicit;
  const climate = mapZoneToClimate(zone);
  const lower = name.toLowerCase();
  const st = state.toUpperCase();
  if (COASTAL_NAME_KEYS.has(lower)) return ["coastal"];
  if (coords && isNearAustralianCoast(coords.lat, coords.lon)) {
    if (st === "WA" || st === "SA") return ["coastal", "mediterranean"];
    if (climate === "tropical") return ["coastal", "tropical_wet_dry"];
    if (climate === "warm") return ["coastal", "subtropical_humid"];
    return ["coastal"];
  }
  if (coords && isLikelyHighland(name, coords.lat, coords.lon, zone)) {
    return ["alpine_highland", "inland"];
  }
  if (climate === "tropical") {
    if (lower.includes("alice") || st === "NT" && lower.includes("springs")) {
      return ["arid_inland"];
    }
    return ["tropical_wet_dry"];
  }
  if (st === "WA" || st === "SA") {
    if (COASTAL_NAME_KEYS.has(lower) || ["fremantle", "glenelg", "henley beach"].includes(lower)) {
      return ["mediterranean", "coastal"];
    }
    return ["mediterranean"];
  }
  if (climate === "warm" && (st === "QLD" || st === "NSW")) {
    if (["cairns", "townsville", "mackay", "darwin", "palmerston"].some((k) => lower.includes(k))) {
      return ["tropical_wet_dry"];
    }
    return ["subtropical_humid"];
  }
  if (["ballarat", "orange", "bathurst", "armidale", "toowoomba"].some((k) => lower.includes(k))) {
    return ["inland", "alpine_highland"];
  }
  if (["canberra", "launceston", "invermay", "riverside"].some((k) => lower.includes(k))) {
    return ["inland"];
  }
  if (climate === "cold" || climate === "cool") {
    return ["inland"];
  }
  if (climate === "temperate") {
    return ["inland"];
  }
  return ["inland"];
}

// lib/places/buildPlace.ts
function placeFromSeed(seed) {
  const [name, state, lat, lon, auHardinessZone] = seed;
  const microclimateTags = inferDefaultTags(name, state, auHardinessZone, void 0, {
    lat,
    lon
  });
  return {
    id: slugifyPlaceId(state, name),
    name,
    state,
    lat,
    lon,
    auHardinessZone,
    microclimateTags
  };
}

// lib/places/legacySuburb.ts
function suburbToPlace(record) {
  const legacyTags = record.microclimateTags ?? tagsFromLegacyMicroclimate(record.microclimate);
  const microclimateTags = inferDefaultTags(
    record.name,
    record.state,
    record.auHardinessZone,
    legacyTags,
    { lat: record.lat, lon: record.lon }
  );
  return {
    id: slugifyPlaceId(record.state, record.name),
    name: record.name,
    state: record.state,
    lat: record.lat,
    lon: record.lon,
    auHardinessZone: record.auHardinessZone,
    microclimateTags
  };
}

// lib/places/index.ts
var FROM_LEGACY = SUBURB_DATA.map(suburbToPlace);
var FROM_BULK = PLACE_SEEDS.map(placeFromSeed);
var BY_ID = /* @__PURE__ */ new Map();
var BY_KEY = /* @__PURE__ */ new Map();
function placeKey(name, state) {
  return `${state.toUpperCase()}:${name.trim().toLowerCase()}`;
}
for (const place of [...FROM_LEGACY, ...AU_PLACES_EXTRA, ...FROM_BULK]) {
  if (!BY_ID.has(place.id)) {
    BY_ID.set(place.id, place);
  }
  const key = placeKey(place.name, place.state);
  if (!BY_KEY.has(key)) {
    BY_KEY.set(key, place);
  }
}
var AU_PLACES = Array.from(BY_ID.values()).sort(
  (a, b) => a.state.localeCompare(b.state) || a.name.localeCompare(b.name)
);
function findPlaceById(id) {
  return BY_ID.get(id);
}
function findPlaceByName(name, state) {
  if (state) {
    return BY_KEY.get(placeKey(name, state));
  }
  const lower = name.trim().toLowerCase();
  return AU_PLACES.find((p) => p.name.toLowerCase() === lower);
}
function userLocationFromPlace(place) {
  return {
    lat: place.lat,
    lon: place.lon,
    city: place.name,
    state: place.state,
    auHardinessZone: place.auHardinessZone,
    climate: mapZoneToClimate(place.auHardinessZone),
    microclimateTags: [...place.microclimateTags],
    placeId: place.id
  };
}

// lib/location/normalizeUserLocation.ts
function normalizeUserLocation(raw) {
  if (!raw.city || !raw.state) return null;
  if (raw.placeId) {
    const place = findPlaceById(raw.placeId);
    if (place) return userLocationFromPlace(place);
  }
  const byName = findPlaceByName(raw.city, raw.state);
  if (byName && raw.lat && raw.lon && raw.auHardinessZone && raw.climate) {
    return userLocationFromPlace(byName);
  }
  if (byName) {
    return userLocationFromPlace(byName);
  }
  if (!raw.lat || !raw.lon || !raw.auHardinessZone || !raw.climate) {
    return null;
  }
  const legacyTags = tagsFromLegacyMicroclimate(raw.microclimate);
  const existing = raw.microclimateTags;
  const microclimateTags = existing && existing.length > 0 ? existing : inferDefaultTags(raw.city, raw.state, raw.auHardinessZone, legacyTags);
  return {
    lat: raw.lat,
    lon: raw.lon,
    city: raw.city,
    state: raw.state,
    auHardinessZone: raw.auHardinessZone,
    climate: raw.climate ?? mapZoneToClimate(raw.auHardinessZone),
    microclimateTags,
    placeId: raw.placeId
  };
}

// lib/microclimate/resolve.ts
function hasTag2(tags, tag) {
  return tags.includes(tag);
}
function deriveSeasonCalendar(tags, climate) {
  if (hasTag2(tags, "tropical_wet_dry") || climate === "tropical" && !hasTag2(tags, "arid_inland")) {
    return "tropical_wet_dry";
  }
  return "southern_four_seasons";
}
function deriveFrostOffsets(tags) {
  let lastFrostWeekOffset = 0;
  let firstFrostWeekOffset = 0;
  if (hasTag2(tags, "coastal")) {
    firstFrostWeekOffset += 2;
  }
  if (hasTag2(tags, "alpine_highland")) {
    lastFrostWeekOffset -= 2;
    firstFrostWeekOffset -= 1;
  }
  if (hasTag2(tags, "urban_heat")) {
    lastFrostWeekOffset += 1;
    firstFrostWeekOffset += 1;
  }
  if (hasTag2(tags, "arid_inland")) {
    lastFrostWeekOffset -= 1;
  }
  return { lastFrostWeekOffset, firstFrostWeekOffset };
}
function buildFrostProfile(zone, tags) {
  const base = getFrostDates(zone);
  const offsets = deriveFrostOffsets(tags);
  return { ...base, ...offsets };
}
function resolveLocationContext(location) {
  const normalized = normalizeUserLocation(location ?? {});
  if (!normalized) return null;
  const tags = normalized.microclimateTags;
  const climate = normalized.climate ?? mapZoneToClimate(normalized.auHardinessZone);
  return {
    climate,
    zone: normalized.auHardinessZone,
    microclimateTags: tags,
    frostProfile: buildFrostProfile(normalized.auHardinessZone, tags),
    seasonCalendar: deriveSeasonCalendar(tags, climate),
    placeId: normalized.placeId,
    city: normalized.city,
    state: normalized.state
  };
}

// lib/notificationWeatherGate.ts
var HEAVY_RAIN_CODES = [1189, 1192, 1195, 1243, 1246, 1087, 1273, 1276, 1279, 1282];
function isHeavyRainCode(code) {
  return HEAVY_RAIN_CODES.includes(code);
}
function assessPlantingWeather(forecast, frostConfig) {
  if (!forecast?.forecast?.forecastday?.length) {
    return { workable: true };
  }
  const days = forecast.forecast.forecastday.slice(0, 4);
  const frostCfg = frostConfig ?? { seasonalFrostAdvice: true, forecastFrostMinC: 2 };
  const frostDays = days.filter(
    (d) => shouldWarnForecastFrost(d.day.mintemp_c, frostCfg)
  );
  const heavyRainDays = days.filter((d) => isHeavyRainCode(d.day.condition.code));
  const extremeHeatDays = days.filter((d) => d.day.maxtemp_c >= 38);
  if (frostDays.length >= 2) {
    return {
      workable: false,
      summary: "Frost in the forecast \u2014 hold off frost-tender plantings outdoors."
    };
  }
  if (heavyRainDays.length >= 2) {
    return {
      workable: false,
      summary: "Heavy rain ahead \u2014 wait for beds to drain before sowing in open ground."
    };
  }
  if (extremeHeatDays.length >= 2) {
    return {
      workable: false,
      summary: "Extreme heat ahead \u2014 delay transplanting until conditions ease."
    };
  }
  const mildNights = days.filter((d) => d.day.mintemp_c >= 8 && d.day.maxtemp_c <= 32);
  const lightRain = days.some(
    (d) => d.day.condition.code >= 1063 && d.day.condition.code <= 1183
  );
  if (mildNights.length >= 2) {
    let summary = "Mild conditions look workable for planting this week.";
    if (lightRain) summary += " Light rain should help new sowings settle.";
    if (frostDays.length === 1) {
      summary += " One cold night \u2014 keep frost-tender seedlings under cover.";
    }
    return { workable: true, summary };
  }
  if (frostDays.length === 1 || heavyRainDays.length === 1) {
    return {
      workable: false,
      summary: frostDays.length === 1 ? "A cold night is coming \u2014 hold frost-tender seedlings until it passes." : "Rain in the forecast \u2014 favour containers or well-drained spots for now."
    };
  }
  return { workable: true, summary: "Conditions look reasonable for planting this week." };
}
function plantingNoteBlocksNotification(note) {
  if (!note) return false;
  return /\b(hold off|avoid planting|delay direct|wait for|waterlogged|do not plant)\b/i.test(
    note
  );
}

// lib/planting/plantingModifiers.ts
var PLANTING_MONTH_NUMBER = {
  January: 1,
  February: 2,
  March: 3,
  April: 4,
  May: 5,
  June: 6,
  July: 7,
  August: 8,
  September: 9,
  October: 10,
  November: 11,
  December: 12
};
var FROST_TENDER_PLANT_PATTERNS = [
  /^tomato/i,
  /^capsicum/i,
  /^eggplant/i,
  /^chilli/i,
  /^chili/i,
  /^cucumber/i,
  /^zucchini/i,
  /^pumpkin/i,
  /^melon/i,
  /^sweet corn/i,
  /^basil/i
];
function isFrostTenderPlant(name) {
  return FROST_TENDER_PLANT_PATTERNS.some((re) => re.test(name.trim()));
}
function midMonthDate(month, year = 2024) {
  return new Date(year, PLANTING_MONTH_NUMBER[month] - 1, 15);
}
function applyPlantingModifiers(ctx, month, guide) {
  if (!ctx) {
    return { sow: [...guide.sow], plant: [...guide.plant] };
  }
  const inFrostSeason = isInRegionalFrostSeason(ctx.frostProfile, midMonthDate(month));
  if (!inFrostSeason) {
    return { sow: [...guide.sow], plant: [...guide.plant] };
  }
  const frostDeferredPlant = [];
  const plant = guide.plant.filter((name) => {
    if (!isFrostTenderPlant(name)) return true;
    frostDeferredPlant.push(name);
    return false;
  });
  const sow = [...guide.sow];
  for (const name of frostDeferredPlant) {
    if (sow.some((s) => s.toLowerCase().includes(name.toLowerCase().split(" ")[0]))) {
      continue;
    }
    if (month === "August" || month === "September" || month === "October") {
      sow.push(`${name} (start indoors)`);
    }
  }
  return {
    sow: Array.from(new Set(sow)),
    plant,
    frostDeferredPlant: frostDeferredPlant.length > 0 ? frostDeferredPlant : void 0
  };
}

// lib/planting/plantingByClimate.ts
var PLANTING_BY_CLIMATE = {
  cold: {
    January: { sow: ["Carrots", "Beetroot", "Lettuce", "Radish", "Spring Onions"], plant: ["Tomatoes (protected)", "Leeks", "Celery"] },
    February: { sow: ["Carrots", "Beetroot", "Lettuce", "Asian Greens", "English Spinach", "Radish", "Fennel"], plant: ["Leeks", "Silverbeet"] },
    March: { sow: ["Broad Beans", "Peas", "English Spinach", "Spring Onions", "Fennel"], plant: ["Garlic", "Shallots", "Cabbage", "Winter Cabbage"] },
    April: { sow: ["Broad Beans", "English Spinach"], plant: ["Garlic", "Shallots", "Onions"] },
    May: { sow: ["Broad Beans"], plant: ["Garlic", "Rhubarb"] },
    June: { sow: [], plant: ["Rhubarb", "Asparagus", "Globe Artichoke"] },
    July: { sow: [], plant: ["Asparagus", "Rhubarb", "Jerusalem Artichokes", "Globe Artichoke"] },
    August: { sow: ["Peas", "Lettuce", "Parsnips", "Celeriac"], plant: ["Early Potatoes", "Asparagus", "Jerusalem Artichokes", "Globe Artichoke"] },
    September: { sow: ["Peas", "Early Carrots", "Lettuce", "Spring Onions", "Parsnips", "Broccoli", "Cauliflower", "Cabbage", "Tomatoes (indoors)", "Celeriac", "Fennel"], plant: ["Early Potatoes", "Onions", "Garlic"] },
    October: { sow: ["Carrots", "Beetroot", "Lettuce", "Peas", "Kale", "Kohlrabi", "Broccoli", "Cauliflower", "Cabbage", "Brussels Sprouts", "Fennel"], plant: ["Potatoes", "Tomatoes (protected)", "Broccoli", "Cauliflower", "Celeriac"] },
    November: { sow: ["Beans", "Carrots", "Beetroot", "Lettuce", "Zucchini", "Radish", "Basil"], plant: ["Tomatoes (protected)", "Zucchini", "Leeks", "Brussels Sprouts", "Celery", "Celeriac", "Capsicum (protected)", "Basil"] },
    December: { sow: ["Beans", "Carrots", "Lettuce", "Beetroot", "Spring Onions", "Radish", "Basil"], plant: ["Tomatoes (protected)", "Leeks", "Zucchini", "Basil"] }
  },
  cool: {
    January: { sow: ["Beans", "Carrots", "Beetroot", "Lettuce", "Radish", "Spring Onions"], plant: ["Tomatoes", "Leeks", "Celery", "Silverbeet"] },
    February: { sow: ["Carrots", "Beetroot", "Lettuce", "Asian Greens", "English Spinach", "Turnip", "Swede", "Radish", "Fennel"], plant: ["Leeks", "Brassicas", "Celery", "Kale"] },
    March: { sow: ["Peas", "Broad Beans", "English Spinach", "Asian Greens", "Spring Onions", "Swede", "Turnip", "Fennel"], plant: ["Brassicas", "Leeks", "Cabbage", "Winter Cabbage"] },
    April: { sow: ["Broad Beans", "Peas", "English Spinach", "Spring Onions", "Fennel"], plant: ["Garlic", "Shallots", "Onions"] },
    May: { sow: ["Broad Beans", "English Spinach", "Asian Greens"], plant: ["Garlic", "Shallots", "Kale", "Leeks"] },
    June: { sow: ["Broad Beans", "Peas"], plant: ["Garlic", "Rhubarb", "Globe Artichoke"] },
    July: { sow: ["Broad Beans", "Peas"], plant: ["Asparagus", "Rhubarb", "Jerusalem Artichokes", "Globe Artichoke"] },
    August: { sow: ["Early Peas", "Broad Beans", "Lettuce", "Spring Onions", "Parsnips", "Onions", "Celeriac"], plant: ["Early Potatoes", "Asparagus", "Jerusalem Artichokes", "Rhubarb", "Globe Artichoke"] },
    September: { sow: ["Peas", "Early Carrots", "Beetroot", "Lettuce", "Spring Onions", "Parsnips", "Broccoli", "Cauliflower", "Brussels Sprouts", "Tomatoes (indoors)", "Celeriac", "Fennel"], plant: ["Early Potatoes", "Onions", "Potatoes"] },
    October: { sow: ["Beans", "Carrots", "Beetroot", "Lettuce", "Peas", "Zucchini", "Pumpkin", "Kohlrabi", "Kale", "Fennel"], plant: ["Tomatoes (protected)", "Potatoes", "Broccoli", "Cauliflower", "Brussels Sprouts", "Celery", "Celeriac"] },
    November: { sow: ["Beans", "Carrots", "Beetroot", "Lettuce", "Zucchini", "Pumpkin", "Sweet Corn", "Radish", "Basil"], plant: ["Tomatoes", "Zucchini", "Pumpkin", "Capsicum (protected)", "Leeks", "Brussels Sprouts", "Celeriac", "Basil"] },
    December: { sow: ["Beans", "Carrots", "Lettuce", "Beetroot", "Spring Onions", "Radish", "Basil"], plant: ["Tomatoes", "Zucchini", "Leeks", "Celery", "Sweet Corn", "Basil"] }
  },
  temperate: {
    January: { sow: ["Beans", "Sweet Corn", "Carrots", "Beetroot", "Lettuce", "Radish", "Spring Onions", "Basil"], plant: ["Tomatoes", "Capsicum", "Eggplant", "Cucumbers", "Zucchini", "Sweet Corn", "Basil"] },
    February: { sow: ["Carrots", "Beetroot", "Asian Greens", "Lettuce", "Radish", "Spring Onions", "Basil", "Fennel"], plant: ["Capsicum", "Eggplant", "Silverbeet", "Leeks", "Basil"] },
    March: { sow: ["Carrots", "Beetroot", "Peas", "Asian Greens", "Lettuce", "Spinach", "English Spinach", "Spring Onions", "Radish", "Fennel"], plant: ["Brassicas", "Leeks", "Silverbeet", "Onions"] },
    April: { sow: ["Broad Beans", "Peas", "Carrots", "Beetroot", "Asian Greens", "Lettuce", "English Spinach", "Spring Onions", "Radish", "Fennel"], plant: ["Garlic", "Shallots", "Onions", "Brassicas"] },
    May: { sow: ["Broad Beans", "Peas", "English Spinach", "Asian Greens", "Onions", "Spring Onions"], plant: ["Garlic", "Shallots", "Onions", "Strawberries"] },
    June: { sow: ["Broad Beans", "Peas", "Onions", "Radish", "English Spinach"], plant: ["Garlic", "Rhubarb", "Asparagus", "Globe Artichoke"] },
    July: { sow: ["Peas", "Broad Beans", "Lettuce", "Spring Onions", "Onions"], plant: ["Asparagus", "Rhubarb", "Jerusalem Artichokes", "Globe Artichoke"] },
    August: { sow: ["Tomatoes (indoors)", "Peas", "Lettuce", "Carrots", "Spring Onions", "Parsnips", "Onions", "Celeriac"], plant: ["Potatoes", "Asparagus", "Rhubarb", "Globe Artichoke"] },
    September: { sow: ["Tomatoes", "Beans", "Carrots", "Beetroot", "Lettuce", "Peas", "Zucchini", "Broccoli", "Cauliflower", "Spring Onions", "Celeriac", "Fennel"], plant: ["Tomatoes (protected)", "Potatoes", "Onions", "Broccoli", "Cauliflower"] },
    October: { sow: ["Beans", "Sweet Corn", "Cucumbers", "Zucchini", "Pumpkin", "Carrots", "Beetroot", "Lettuce", "Basil", "Sweet Potato", "Fennel"], plant: ["Tomatoes", "Capsicum", "Eggplant", "Zucchini", "Cucumbers", "Potatoes", "Basil", "Sweet Potato", "Celeriac"] },
    November: { sow: ["Beans", "Sweet Corn", "Cucumbers", "Zucchini", "Pumpkin", "Lettuce", "Beetroot", "Spring Onions", "Basil", "Okra", "Sweet Potato"], plant: ["Tomatoes", "Capsicum", "Eggplant", "Zucchini", "Cucumbers", "Leeks", "Basil", "Okra", "Sweet Potato", "Celeriac"] },
    December: { sow: ["Beans", "Sweet Corn", "Carrots", "Lettuce", "Radish", "Spring Onions", "Basil", "Okra", "Sweet Potato"], plant: ["Tomatoes", "Capsicum", "Eggplant", "Sweet Corn", "Leeks", "Silverbeet", "Basil", "Okra", "Sweet Potato"] }
  },
  warm: {
    January: { sow: ["Beans", "Sweet Corn", "Cucumbers", "Zucchini", "Lettuce", "Spring Onions", "Basil", "Okra"], plant: ["Eggplant", "Capsicum", "Sweet Potato", "Zucchini", "Cucumbers", "Basil", "Okra"] },
    February: { sow: ["Beans", "Carrots", "Beetroot", "Asian Greens", "Lettuce", "Spring Onions", "Basil", "Okra", "Fennel"], plant: ["Capsicum", "Eggplant", "Sweet Potato", "Silverbeet", "Basil", "Okra"] },
    March: { sow: ["Carrots", "Beetroot", "Asian Greens", "Lettuce", "Peas", "Broccoli", "Cauliflower", "Radish", "Fennel", "Celeriac"], plant: ["Leeks", "Onions", "Silverbeet", "Brassicas"] },
    April: { sow: ["Peas", "Broad Beans", "Carrots", "Beetroot", "Asian Greens", "Lettuce", "English Spinach", "Radish", "Spring Onions", "Fennel"], plant: ["Garlic", "Onions", "Brassicas", "Broccoli", "Cauliflower", "Celeriac"] },
    May: { sow: ["Broad Beans", "Peas", "Carrots", "Beetroot", "Onions", "English Spinach", "Asian Greens", "Radish"], plant: ["Garlic", "Onions", "Strawberries", "Broccoli", "Cauliflower"] },
    June: { sow: ["Broad Beans", "Peas", "Carrots", "Beetroot", "Onions", "Radish", "English Spinach"], plant: ["Garlic", "Onions", "Asparagus", "Rhubarb", "Globe Artichoke"] },
    July: { sow: ["Peas", "Broad Beans", "Lettuce", "Carrots", "Spring Onions", "Onions"], plant: ["Asparagus", "Rhubarb", "Potatoes", "Onions", "Globe Artichoke"] },
    August: { sow: ["Tomatoes (indoors)", "Peas", "Lettuce", "Carrots", "Beetroot", "Spring Onions", "Onions"], plant: ["Potatoes", "Asparagus", "Tomatoes (protected)", "Onions", "Globe Artichoke"] },
    September: { sow: ["Tomatoes", "Beans", "Carrots", "Beetroot", "Lettuce", "Zucchini", "Cucumbers", "Spring Onions", "Fennel"], plant: ["Tomatoes", "Potatoes", "Zucchini", "Capsicum", "Eggplant"] },
    October: { sow: ["Beans", "Sweet Corn", "Cucumbers", "Zucchini", "Pumpkin", "Carrots", "Lettuce", "Beetroot", "Basil", "Okra", "Fennel"], plant: ["Tomatoes", "Capsicum", "Eggplant", "Zucchini", "Sweet Potato", "Cucumbers", "Basil", "Okra"] },
    November: { sow: ["Beans", "Sweet Corn", "Cucumbers", "Zucchini", "Lettuce", "Spring Onions", "Basil", "Okra"], plant: ["Eggplant", "Capsicum", "Sweet Potato", "Zucchini", "Leeks", "Basil", "Okra"] },
    December: { sow: ["Beans", "Sweet Corn", "Cucumbers", "Lettuce", "Spring Onions", "Radish"], plant: ["Eggplant", "Capsicum", "Sweet Potato", "Cucumbers", "Silverbeet"] }
  },
  tropical: {
    January: { sow: ["Asian Greens", "Silverbeet", "Spring Onions"], plant: ["Sweet Potato", "Silverbeet"] },
    February: { sow: ["Asian Greens", "Sweet Corn", "Spring Onions"], plant: ["Sweet Potato", "Silverbeet"] },
    March: { sow: ["Beans", "Asian Greens", "Lettuce", "Tomatoes", "Capsicum", "Basil", "Okra"], plant: ["Eggplant", "Sweet Potato", "Basil", "Okra"] },
    April: { sow: ["Tomatoes", "Capsicum", "Eggplant", "Asian Greens", "Lettuce", "Carrots", "Beetroot", "Basil", "Okra"], plant: ["Eggplant", "Sweet Potato", "Tomatoes", "Basil", "Okra"] },
    May: { sow: ["Carrots", "Beetroot", "Asian Greens", "Lettuce", "Beans", "Radish", "Spring Onions", "Basil", "Okra"], plant: ["Tomatoes", "Capsicum", "Eggplant", "Basil", "Okra"] },
    June: { sow: ["Carrots", "Beetroot", "Peas", "Asian Greens", "Lettuce", "Radish", "Spring Onions", "Onions"], plant: ["Tomatoes", "Capsicum", "Brassicas"] },
    July: { sow: ["Carrots", "Beetroot", "Peas", "Asian Greens", "Lettuce", "Beans", "Radish", "Onions"], plant: ["Tomatoes", "Capsicum", "Sweet Potato", "Eggplant"] },
    August: { sow: ["Beans", "Sweet Corn", "Asian Greens", "Lettuce", "Pumpkin", "Cucumbers", "Spring Onions"], plant: ["Sweet Potato", "Tomatoes", "Capsicum"] },
    September: { sow: ["Beans", "Sweet Corn", "Cucumbers", "Pumpkin", "Asian Greens", "Lettuce", "Spring Onions"], plant: ["Sweet Potato", "Eggplant", "Cucumbers"] },
    October: { sow: ["Beans", "Sweet Corn", "Cucumbers", "Asian Greens", "Lettuce", "Spring Onions"], plant: ["Sweet Potato", "Capsicum", "Eggplant"] },
    November: { sow: ["Beans", "Asian Greens", "Sweet Corn", "Spring Onions"], plant: ["Sweet Potato", "Silverbeet"] },
    December: { sow: ["Beans", "Asian Greens", "Spring Onions"], plant: ["Sweet Potato", "Silverbeet"] }
  }
};

// lib/planting/plantingProfiles.ts
function plantingProfileBaseKey(profile) {
  if (profile === "cold:highland") return "cold";
  if (profile === "cool:highland" || profile === "cool:coastal") return "cool";
  if (profile === "temperate:inland") return "temperate";
  if (profile === "tropical:wet_dry") return "tropical";
  return profile;
}

// lib/planting/plantingProfileData.ts
var PLANTING_PROFILE_OVERRIDES = {
  "cool:coastal": {
    September: {
      sow: [
        "Peas",
        "Early Carrots",
        "Beetroot",
        "Lettuce",
        "Spring Onions",
        "Parsnips",
        "Broccoli",
        "Cauliflower",
        "Brussels Sprouts",
        "Tomatoes (indoors)",
        "Beans"
      ],
      plant: ["Early Potatoes", "Onions", "Potatoes", "Tomatoes (protected)"]
    },
    October: {
      sow: [
        "Beans",
        "Carrots",
        "Beetroot",
        "Lettuce",
        "Peas",
        "Zucchini",
        "Pumpkin",
        "Kohlrabi",
        "Kale",
        "Sweet Corn"
      ],
      plant: [
        "Tomatoes",
        "Potatoes",
        "Broccoli",
        "Cauliflower",
        "Brussels Sprouts",
        "Celery",
        "Capsicum (protected)",
        "Sweet Potato"
      ]
    },
    November: {
      sow: ["Basil", "Okra"],
      plant: [
        "Tomatoes",
        "Zucchini",
        "Pumpkin",
        "Capsicum (protected)",
        "Leeks",
        "Brussels Sprouts",
        "Cucumbers",
        "Basil",
        "Okra"
      ]
    },
    March: {
      sow: [
        "Peas",
        "Sugar Snap Peas",
        "Snow Peas",
        "Broad Beans",
        "English Spinach",
        "Asian Greens",
        "Spring Onions",
        "Swede",
        "Turnip",
        "Carrots",
        "Beetroot",
        "Lettuce",
        "Broccoli",
        "Cauliflower"
      ],
      plant: ["Broccoli", "Cauliflower", "Kale"]
    },
    April: {
      sow: [
        "Broad Beans",
        "Peas",
        "Sugar Snap Peas",
        "Snow Peas",
        "English Spinach",
        "Asian Greens",
        "Radish",
        "Lettuce",
        "Carrots",
        "Beetroot",
        "Spring Onions"
      ],
      plant: ["Garlic", "Shallots", "Onions", "Broccoli", "Cauliflower", "Kale"]
    },
    May: {
      sow: ["Broad Beans", "English Spinach", "Asian Greens"],
      plant: ["Garlic", "Shallots", "Kale", "Leeks"]
    },
    June: {
      sow: ["Broad Beans", "Peas"],
      plant: ["Garlic", "Rhubarb"]
    }
  },
  "cool:highland": {
    September: {
      sow: ["Peas", "Early Carrots", "Beetroot", "Lettuce", "Spring Onions", "Parsnips"],
      plant: ["Early Potatoes", "Onions"]
    },
    October: {
      sow: [
        "Carrots",
        "Beetroot",
        "Lettuce",
        "Peas",
        "Kohlrabi",
        "Kale",
        "Broccoli",
        "Cauliflower",
        "Tomatoes (indoors)"
      ],
      plant: ["Early Potatoes", "Potatoes"]
    },
    November: {
      sow: ["Beans", "Carrots", "Beetroot", "Lettuce", "Zucchini", "Radish", "Basil"],
      plant: [
        "Tomatoes (protected)",
        "Broccoli",
        "Cauliflower",
        "Brussels Sprouts",
        "Leeks",
        "Capsicum (protected)",
        "Basil"
      ]
    },
    December: {
      sow: ["Beans", "Carrots", "Lettuce", "Beetroot", "Spring Onions", "Radish", "Zucchini", "Basil"],
      plant: ["Tomatoes (protected)", "Zucchini", "Leeks", "Celery", "Basil"]
    },
    March: {
      sow: ["Peas", "Broad Beans", "English Spinach", "Asian Greens", "Spring Onions"],
      plant: ["Cabbage", "Winter Cabbage", "Brassicas"]
    },
    April: {
      sow: ["English Spinach", "Spring Onions"],
      plant: ["Garlic", "Shallots", "Onions"]
    }
  },
  "cold:highland": {
    September: {
      sow: ["Peas", "Early Carrots", "Lettuce", "Spring Onions", "Parsnips", "Broccoli", "Cauliflower"],
      plant: ["Early Potatoes", "Onions"]
    },
    October: {
      sow: [
        "Carrots",
        "Beetroot",
        "Lettuce",
        "Peas",
        "Kohlrabi",
        "Kale",
        "Broccoli",
        "Cauliflower",
        "Tomatoes (indoors)"
      ],
      plant: ["Early Potatoes", "Potatoes"]
    },
    November: {
      sow: ["Beans", "Carrots", "Beetroot", "Lettuce", "Radish", "Basil"],
      plant: [
        "Tomatoes (protected)",
        "Broccoli",
        "Cauliflower",
        "Leeks",
        "Capsicum (protected)",
        "Basil"
      ]
    },
    December: {
      sow: ["Beans", "Carrots", "Lettuce", "Beetroot", "Spring Onions", "Radish", "Basil"],
      plant: ["Tomatoes (protected)", "Leeks", "Basil"]
    },
    March: {
      sow: ["Broad Beans", "English Spinach", "Asian Greens", "Spring Onions", "Peas"],
      plant: ["Cabbage", "Winter Cabbage"]
    },
    April: {
      sow: ["English Spinach", "Spring Onions"],
      plant: ["Garlic", "Shallots", "Onions"]
    }
  },
  "temperate:inland": {
    August: {
      sow: ["Tomatoes (indoors)", "Peas", "Lettuce", "Carrots", "Spring Onions", "Parsnips", "Onions", "Beans"],
      plant: ["Potatoes", "Asparagus", "Rhubarb"]
    },
    September: {
      sow: [
        "Tomatoes",
        "Beans",
        "Carrots",
        "Beetroot",
        "Lettuce",
        "Peas",
        "Zucchini",
        "Sweet Corn",
        "Cucumbers",
        "Broccoli",
        "Cauliflower"
      ],
      plant: ["Tomatoes", "Potatoes", "Onions", "Broccoli", "Cauliflower"]
    },
    October: {
      sow: ["Beans", "Sweet Corn", "Cucumbers", "Zucchini", "Pumpkin", "Carrots", "Beetroot", "Lettuce"],
      plant: ["Tomatoes", "Capsicum", "Eggplant", "Zucchini", "Cucumbers", "Potatoes"]
    },
    November: {
      sow: ["Beans", "Sweet Corn", "Cucumbers", "Zucchini", "Pumpkin", "Lettuce", "Beetroot"],
      plant: ["Tomatoes", "Capsicum", "Eggplant", "Zucchini", "Cucumbers", "Sweet Corn"]
    },
    January: {
      sow: ["Beans", "Sweet Corn", "Cucumbers", "Zucchini", "Lettuce", "Spring Onions"],
      plant: ["Tomatoes", "Capsicum", "Eggplant", "Cucumbers", "Sweet Corn", "Zucchini"]
    },
    February: {
      sow: ["Beans", "Carrots", "Beetroot", "Asian Greens", "Lettuce", "Spring Onions", "Pumpkin"],
      plant: ["Capsicum", "Eggplant", "Silverbeet"]
    }
  },
  "tropical:wet_dry": {
    November: {
      sow: ["Beans", "Asian Greens", "Sweet Corn", "Spring Onions", "Cucumbers", "Basil", "Okra"],
      plant: ["Sweet Potato", "Silverbeet", "Basil", "Okra"]
    },
    December: {
      sow: ["Beans", "Asian Greens", "Spring Onions", "Sweet Corn", "Basil", "Okra"],
      plant: ["Sweet Potato", "Silverbeet", "Basil", "Okra"]
    },
    January: {
      sow: ["Beans", "Asian Greens", "Silverbeet", "Sweet Corn", "Spring Onions", "Basil"],
      plant: ["Sweet Potato", "Silverbeet", "Basil"]
    },
    February: {
      sow: ["Beans", "Asian Greens", "Spring Onions", "Sweet Corn", "Basil"],
      plant: ["Sweet Potato", "Silverbeet", "Basil"]
    },
    March: {
      sow: ["Beans", "Asian Greens", "Lettuce", "Tomatoes", "Capsicum", "Basil", "Okra", "Spring Onions"],
      plant: ["Eggplant", "Sweet Potato", "Basil", "Okra"]
    },
    April: {
      sow: ["Tomatoes", "Capsicum", "Eggplant", "Asian Greens", "Lettuce", "Carrots", "Beans", "Basil", "Okra"],
      plant: ["Eggplant", "Sweet Potato", "Tomatoes", "Basil", "Okra"]
    },
    May: {
      sow: [
        "Carrots",
        "Beetroot",
        "Asian Greens",
        "Lettuce",
        "Beans",
        "Radish",
        "Spring Onions",
        "Tomatoes",
        "Basil",
        "Okra"
      ],
      plant: ["Tomatoes", "Capsicum", "Eggplant", "Basil", "Okra"]
    },
    June: {
      sow: ["Carrots", "Beetroot", "Peas", "Asian Greens", "Lettuce", "Beans", "Sweet Corn", "Cucumbers"],
      plant: ["Tomatoes", "Capsicum", "Brassicas"]
    },
    July: {
      sow: ["Carrots", "Beetroot", "Beans", "Sweet Corn", "Asian Greens", "Lettuce", "Pumpkin", "Cucumbers"],
      plant: ["Tomatoes", "Capsicum", "Sweet Potato", "Eggplant"]
    },
    August: {
      sow: ["Beans", "Sweet Corn", "Asian Greens", "Lettuce", "Pumpkin", "Cucumbers", "Spring Onions"],
      plant: ["Sweet Potato", "Tomatoes", "Capsicum"]
    },
    September: {
      sow: ["Beans", "Sweet Corn", "Cucumbers", "Pumpkin", "Asian Greens", "Lettuce"],
      plant: ["Sweet Potato", "Eggplant", "Cucumbers"]
    },
    October: {
      sow: ["Beans", "Asian Greens", "Sweet Corn", "Cucumbers", "Pumpkin", "Spring Onions", "Basil", "Okra"],
      plant: ["Sweet Potato", "Silverbeet", "Capsicum", "Basil", "Okra"]
    }
  }
};
function mergeMonthGuide(base, override) {
  if (!override) return { sow: [...base.sow], plant: [...base.plant] };
  return {
    sow: override.sow.length > 0 ? [...override.sow] : [...base.sow],
    plant: override.plant.length > 0 ? [...override.plant] : [...base.plant]
  };
}
function getPlantingGuideForProfile(profile, month) {
  const baseKey = plantingProfileBaseKey(profile);
  const baseMonth = PLANTING_BY_CLIMATE[baseKey][month] ?? { sow: [], plant: [] };
  const override = PLANTING_PROFILE_OVERRIDES[profile]?.[month];
  return mergeMonthGuide(baseMonth, override);
}

// lib/planting/resolvePlantingClimate.ts
var STATE_DEFAULT_CLIMATE = {
  NSW: "temperate",
  ACT: "temperate",
  VIC: "cool",
  TAS: "cool",
  SA: "cool",
  QLD: "warm",
  NT: "warm",
  WA: "temperate"
};
function normalizeStateCode(state) {
  return state.toUpperCase().slice(0, 3);
}
function climateToPlantingKey(climate) {
  if (climate === "cold") return "cold";
  if (climate === "temperate") return "temperate";
  if (climate === "warm") return "warm";
  if (climate === "tropical") return "tropical";
  return "cool";
}
function resolvePlantingClimate(location) {
  if (location?.climate) {
    return climateToPlantingKey(location.climate);
  }
  if (location?.auHardinessZone) {
    return climateToPlantingKey(mapZoneToClimate(location.auHardinessZone));
  }
  if (location?.state) {
    const code = normalizeStateCode(location.state);
    return STATE_DEFAULT_CLIMATE[code] ?? "temperate";
  }
  return "temperate";
}

// lib/planting/resolvePlantingProfile.ts
function hasTag3(tags, tag) {
  return tags.includes(tag);
}
function profileFromContext(ctx) {
  const base = climateToPlantingKey(ctx.climate);
  const tags = ctx.microclimateTags;
  if (base === "cold" || base === "cool") {
    if (hasTag3(tags, "alpine_highland")) {
      return base === "cold" ? "cold:highland" : "cool:highland";
    }
    if (hasTag3(tags, "coastal")) {
      return "cool:coastal";
    }
  }
  if (base === "temperate" && hasTag3(tags, "arid_inland")) {
    return "temperate:inland";
  }
  if (base === "tropical" && hasTag3(tags, "tropical_wet_dry")) {
    return "tropical:wet_dry";
  }
  return base;
}
function resolvePlantingProfileWithContext(location) {
  const ctx = resolveLocationContext(location);
  return {
    profile: ctx ? profileFromContext(ctx) : resolvePlantingClimate(location),
    context: ctx
  };
}

// lib/planting/types.ts
var PLANTING_MONTHS = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December"
];

// lib/plantingRecommendations.ts
function getCurrentPlantingMonth(date = /* @__PURE__ */ new Date()) {
  return PLANTING_MONTHS[date.getMonth()];
}
function getPlantingRecommendationsForMonth(location, month) {
  const currentMonth = month ?? getCurrentPlantingMonth();
  const { profile, context } = resolvePlantingProfileWithContext(location);
  const base = getPlantingGuideForProfile(profile, currentMonth);
  const adjusted = applyPlantingModifiers(context, currentMonth, base);
  return {
    sow: adjusted.sow,
    plant: adjusted.plant,
    profile,
    frostDeferredPlant: adjusted.frostDeferredPlant
  };
}

// lib/rollingWeatherCondition.ts
function ratio(actual, expected) {
  if (expected <= 0) return 1;
  return actual / expected;
}
function warmDelta(actualMax, expectedMax) {
  return actualMax - expectedMax;
}
function weekSignal(week, norm) {
  const rainRatio = ratio(week.totalRainMm, norm.expectedRainfallMm);
  const maxDelta = warmDelta(week.avgMaxTempC, norm.expectedMaxTemp);
  if (rainRatio > 1.5) return "WET";
  if (rainRatio < 0.3) return "DRY";
  if (maxDelta >= 3) return "WARM";
  if (maxDelta <= -3) return "COOL";
  return "NORMAL";
}
function countConsecutiveFromEnd(values, target) {
  let count = 0;
  for (let i = values.length - 1; i >= 0; i--) {
    if (values[i] !== target) break;
    count++;
  }
  return count;
}
function buildAccumulatedCondition(actualWeeks, normWeeks) {
  const zipped = actualWeeks.map((w, i) => ({ week: w, norm: normWeeks[i] })).filter((x) => Boolean(x?.norm));
  if (zipped.length === 0) {
    return {
      soilMoistureState: "normal",
      temperatureTrend: "near_norm",
      forecastDirection: "stable",
      forecastTempDirection: "stable",
      sustainedAnomaly: false,
      dominantSignal: null,
      currentWeekSignal: "NORMAL",
      streakWeeks: 0,
      currentWeekRainRelief: false,
      currentWeekIsForecast: false
    };
  }
  const current = zipped[zipped.length - 1];
  const previous = zipped[zipped.length - 2];
  const rainRatios = zipped.map((z) => ratio(z.week.totalRainMm, z.norm.expectedRainfallMm));
  const maxDeltas = zipped.map((z) => warmDelta(z.week.avgMaxTempC, z.norm.expectedMaxTemp));
  const signals = zipped.map((z) => weekSignal(z.week, z.norm));
  const consecutiveWetFromEnd = countConsecutiveFromEnd(signals, "WET");
  const dryCount = signals.filter((s) => s === "DRY").length;
  const hasCurrentWet = signals[signals.length - 1] === "WET";
  const hasPriorWet = signals.length > 1 && signals[signals.length - 2] === "WET";
  const soilMoistureState = consecutiveWetFromEnd >= 2 ? "saturated" : hasCurrentWet || hasPriorWet ? "wet" : signals[signals.length - 1] === "DRY" || dryCount >= 2 ? "dry" : "normal";
  const significantlyAboveWeeks = maxDeltas.filter((d) => d >= 4).length;
  const currentMaxDelta = maxDeltas[maxDeltas.length - 1] ?? 0;
  const temperatureTrend = significantlyAboveWeeks >= 2 ? "significantly_above" : currentMaxDelta >= 3 ? "above_norm" : currentMaxDelta <= -3 ? "below_norm" : "near_norm";
  const currentRainRatio = rainRatios[rainRatios.length - 1] ?? 1;
  const forecastDirection = currentRainRatio > 1.5 ? "wetting" : currentRainRatio < 0.3 ? "drying" : "stable";
  const forecastTempDirection = currentMaxDelta >= 3 ? "warming" : currentMaxDelta <= -3 ? "cooling" : "stable";
  const dominantSignal = soilMoistureState === "saturated" || soilMoistureState === "wet" ? "WET" : soilMoistureState === "dry" ? "DRY" : temperatureTrend === "significantly_above" || temperatureTrend === "above_norm" ? "WARM" : temperatureTrend === "below_norm" ? "COOL" : "NORMAL";
  const currentWeekSignal = signals[signals.length - 1] ?? "NORMAL";
  const currentWeekRainRelief = currentRainRatio > 1.1;
  const streakWeeks = dominantSignal != null && dominantSignal !== "NORMAL" ? countConsecutiveFromEnd(signals, dominantSignal) : 0;
  const sustainedAnomaly = streakWeeks >= 2 && dominantSignal !== "NORMAL";
  const currentWeekIsForecast = current.week.isForecast === true;
  void previous;
  return {
    soilMoistureState,
    temperatureTrend,
    forecastDirection,
    forecastTempDirection,
    sustainedAnomaly,
    dominantSignal,
    currentWeekSignal,
    streakWeeks,
    currentWeekRainRelief,
    currentWeekIsForecast
  };
}

// lib/plantingWeatherGuidance.ts
function buildPlantingWeatherNote(signal, rolling) {
  if (!signal && !rolling) return null;
  const detail = signal ?? rolling?.signal ?? null;
  const acc = rolling != null ? buildAccumulatedCondition(rolling.weekWeather, rolling.weekNorms) : null;
  const frostRisk = Boolean(detail?.frostEvent || detail?.forecastHasFrost || rolling?.signal.frostEvent);
  if (acc?.soilMoistureState === "saturated") {
    return "Beds are waterlogged after sustained rain \u2014 avoid planting into sodden soil; use containers or wait until you can work soil without compacting it.";
  }
  if (acc?.soilMoistureState === "wet" && (detail?.wetMagnitude === "strong" || detail?.wetMagnitude === "moderate" || acc.streakWeeks >= 2)) {
    return "Recent rain has left beds soft \u2014 hold off sowing in open ground until soil firms; raised beds and pots are safer for new plantings.";
  }
  if (acc?.soilMoistureState === "wet" || detail?.wetSignal) {
    return "Soil is holding extra moisture \u2014 delay direct sowing in wet patches and favour well-drained spots or containers.";
  }
  if (acc?.temperatureTrend === "significantly_above" || acc?.currentWeekSignal === "WARM" || detail?.warmMagnitude === "strong" || detail?.warmMagnitude === "moderate") {
    return "A warm stretch is ahead \u2014 plant in the cool of the day, water seedlings in deeply, and shade tender transplants until they settle.";
  }
  if (acc?.soilMoistureState === "dry" && (acc.dominantSignal === "DRY" || detail?.droughtSignal)) {
    return "Dry weeks are stressing beds \u2014 if you plant now, water in well and mulch straight away; otherwise wait for a good soaking rain.";
  }
  if (frostRisk) {
    return "Cold nights are in the mix \u2014 keep frost-tender seedlings under cover and plant out only hardier crops outdoors.";
  }
  if (acc?.forecastDirection === "wetting" && acc.currentWeekSignal !== "DRY") {
    return "More rain is forecast \u2014 finish urgent planting in free-draining spots and hold off filling waterlogged beds.";
  }
  return null;
}

// lib/plantActivityCopy.ts
var CANONICAL = {
  "Water consistently at silking \u2014 critical": "Water at silking",
  "Water consistently at silking": "Water at silking",
  "Water consistently at pod fill": "Water at pod fill",
  "Water at pod fill \u2014 critical": "Water at pod fill",
  "Harvest promptly \u2014 sweetness fades within hours": "Harvest at peak sweetness",
  "Harvest \u2014 sweetness fades within hours": "Harvest at peak sweetness",
  "Harvest promptly \u2014 do not delay": "Harvest when ready",
  "Harvest \u2014 do not delay": "Harvest when ready",
  "Harvest": "Harvest when mature",
  "Harvest early and": "Harvest early at 4\u20135cm",
  "Year-round cut-and-come-again harvest": "Begin harvesting \u2014 cut-and-come-again",
  "Year-round harvest": "Begin harvesting",
  "Harvest continuously": "Begin harvesting regularly",
  "Withhold harvest for 2 years": ""
};
var REMOVE = [
  /^Withhold harvest\b/i,
  /^Plant\b/i,
  /^Sow\b/i,
  /^Direct sow\b/i,
  /^Soak seed\b/i,
  /^Year-round planting\b/i,
  /^Water consistently$/i,
  /^Water consistently —/i,
  /^Water daily\b/i,
  /^Water deeply\b/i,
  /^Water every \d+ days/i,
  /^Water (fortnightly|lightly|minimally|sparingly|shallowly|steadily|regularly)/i,
  /^Water .* until established/i,
  /^Adjust watering\b/i,
  /^Establish /i,
  /^Extreme /i,
  /planting only$/i,
  /^Sheltered /i,
  /^Cool season\b/i,
  /^Dry season (sowing|planting|crop)/i,
  /^Grow in\b/i,
  /^Not (recommended|suitable)\b/i,
  /^Check plant health after establishment$/i,
  /^Install cool running water\b/i,
  /\band$|\b—\s*$/i
];
var KEEP = [
  /^Begin harvesting/i,
  /^Water at (silking|pod fill)$/,
  /^Stop (water|watering)/i,
  /^Check for/i,
  /^Harvest /i,
  /^Harvest when/i,
  /^Harvest at /i,
  /^Apply /i,
  /^Install /i,
  /^Thin /i,
  /^Remove /i,
  /^Prune /i,
  /^Succession sow/i
];
var VAGUE_WATERING_TITLE = [
  /^Maintain consistent moisture/i,
  /^Keep consistently moist/i,
  /^Water consistently to slow bolting/i
];
function isVagueWateringAdvice(activity) {
  const title = activity.activity.trim();
  const details = activity.details?.trim() ?? "";
  const watering = activity.category === "watering" || /water|moist/i.test(`${title} ${details}`);
  if (!watering) return false;
  if (VAGUE_WATERING_TITLE.some((r) => r.test(title))) return true;
  if (/^Water regularly$/i.test(details) && /moisture|moist/i.test(title)) return true;
  if (/^Keep soil moist$/i.test(details) && /water consistently/i.test(title)) return true;
  return false;
}
function canonicalize(title) {
  const t = title.trim();
  return CANONICAL[t] ?? t;
}
function shouldRemovePostPlantActivity(activity) {
  let t = canonicalize(activity.activity.trim());
  if (!t) return true;
  for (const r of REMOVE) {
    if (r.test(t)) return true;
  }
  for (const k of KEEP) {
    if (k.test(t)) return false;
  }
  if (/^Transplant\b/i.test(t) && !/^Transplant (firmly|deeply)/i.test(t)) return true;
  return false;
}
function rewriteTitle(title, details) {
  let activityTitle = canonicalize(title.trim());
  let detailText = details?.trim() ?? "";
  activityTitle = activityTitle.replace(/^Monitor\s+for\b/i, "Check for").replace(/^Control pests — (.+)$/i, "Check for $1").replace(/\s+immediately\s*$/i, "").replace(/\s+promptly\s*$/i, "").trim();
  if (/^Avoid high nitrogen fertiliser/i.test(activityTitle)) {
    activityTitle = "Apply potassium and phosphorus";
    if (!/avoid high-nitrogen/i.test(detailText)) {
      detailText = detailText ? `${detailText.replace(/\.$/, "")}. Avoid high-nitrogen blends when side-dressing.` : "Avoid high-nitrogen blends when side-dressing.";
    }
  }
  detailText = detailText.replace(/\bMonitor for\b/gi, "Check for");
  return { title: canonicalize(activityTitle), details: detailText };
}
function normalizeActivityCopy(activity) {
  if (isVagueWateringAdvice(activity)) return null;
  if (shouldRemovePostPlantActivity(activity)) return null;
  const { title, details } = rewriteTitle(
    activity.activity,
    activity.details ?? ""
  );
  if (!title || shouldRemovePostPlantActivity({ activity: title })) return null;
  if (title === activity.activity.trim() && details === (activity.details?.trim() ?? "")) {
    return activity;
  }
  return { ...activity, activity: title, details };
}
function polishScheduleActivities(activities) {
  const out = [];
  const seen = /* @__PURE__ */ new Set();
  for (const act of activities) {
    const polished = normalizeActivityCopy(act);
    if (!polished) continue;
    const key = `${polished.daysSincePlanting ?? 0}|${polished.activity}|${polished.category}`;
    if (seen.has(key)) continue;
    seen.add(key);
    out.push(polished);
  }
  return out.sort(
    (a, b) => (a.daysSincePlanting ?? 0) - (b.daysSincePlanting ?? 0)
  );
}

// lib/plantCareSchedule.ts
var DEFAULT_SOW_TO_SEEDLING = 14;
function isEstablishedPlant(plant) {
  if (plant.fullSchedule?.schedulePhase === "established") return true;
  if (plant.fullSchedule?.schedulePhase === "sow") return false;
  if (plant.fullSchedule?.plantingMethod === "seedling") return true;
  return plant.type === "seedling" || plant.activityType === "plant";
}
function schedulePhaseForPlant(plant) {
  const stored = plant.fullSchedule?.schedulePhase;
  if (stored === "established" || stored === "sow") return stored;
  if (plant.fullSchedule?.plantingMethod === "seedling") return "established";
  if (plant.fullSchedule?.plantingMethod === "seed") return "sow";
  return isEstablishedPlant(plant) ? "established" : "sow";
}
function sowToSeedlingDays(fullSchedule) {
  const n = fullSchedule?.sowToSeedling;
  if (typeof n === "number" && n > 0 && Number.isFinite(n)) return Math.round(n);
  return DEFAULT_SOW_TO_SEEDLING;
}
var SETUP_ACTIVITY_TITLE = /\b(sow|sown|germinat|transplant|harden off|hardening|start seeds?|indoors?|under cover|seed tray|prick out|thin(?:\s+to|\s+seedlings?)?|emergence|plant seeds?|plant out|set out|replant|check for germination)\b/i;
var PLANT_VERB_TITLE = /^plant\s+/i;
var PLANT_VERB_MID = /\bplant\s+(?:\d+|two|three|four|five|six|seven|eight|nine|ten)\b/i;
var IN_GARDEN_PLANTING_TASK = /\b(install|support|stakes?|trellis|cages?|mulch|wire|netting|row covers?|fencing)\b/i;
function isPrePlantActivityTitle(activity) {
  const title = activity.activity.trim();
  if (!title) return false;
  if (PLANT_VERB_TITLE.test(title) || PLANT_VERB_MID.test(title)) return true;
  return SETUP_ACTIVITY_TITLE.test(title);
}
function isEstablishmentPlantingTask(activity) {
  if (activity.category !== "planting") return false;
  const title = activity.activity.trim();
  if (!title) return false;
  if (isPrePlantActivityTitle({ activity: title })) return true;
  return !IN_GARDEN_PLANTING_TASK.test(title);
}
function isSchedulePhaseAdjusted(fullSchedule) {
  return fullSchedule?.schedulePhase === "established";
}
function shouldSkipActivityForPhase(activity, phase, sowOffset, alreadyAdjusted) {
  if (isPrePlantActivityTitle(activity)) return true;
  if (phase === "established" && isEstablishmentPlantingTask(activity)) return true;
  if (phase === "sow") return false;
  if (alreadyAdjusted) return false;
  return activity.daysSincePlanting <= sowOffset;
}
function adjustActivitiesForPhase(activities, phase, sowOffset) {
  if (phase === "sow") {
    return polishScheduleActivities(
      activities.filter((act) => !isPrePlantActivityTitle(act)).sort((a, b) => a.daysSincePlanting - b.daysSincePlanting)
    );
  }
  return polishScheduleActivities(
    activities.filter((act) => !shouldSkipActivityForPhase(act, phase, sowOffset, false)).map((act) => ({
      ...act,
      daysSincePlanting: Math.max(0, act.daysSincePlanting - sowOffset)
    })).sort((a, b) => a.daysSincePlanting - b.daysSincePlanting)
  );
}
function adjustScheduleActivitiesForPlant(activities, plant) {
  const phase = schedulePhaseForPlant(plant);
  const offset = sowToSeedlingDays(plant.fullSchedule);
  const alreadyAdjusted = isSchedulePhaseAdjusted(plant.fullSchedule);
  if (alreadyAdjusted) {
    return polishScheduleActivities(
      activities.filter((act) => !shouldSkipActivityForPhase(act, phase, offset, true)).sort((a, b) => a.daysSincePlanting - b.daysSincePlanting)
    );
  }
  return adjustActivitiesForPhase(activities, phase, offset);
}
function activityDueDate(plant, activity) {
  const planted = new Date(plant.datePlanted);
  const due = new Date(planted);
  due.setDate(due.getDate() + activity.daysSincePlanting);
  return due;
}
function daysUntilActivity(plant, activity, fromDate = /* @__PURE__ */ new Date()) {
  const due = activityDueDate(plant, activity);
  return Math.ceil((due.getTime() - fromDate.getTime()) / (1e3 * 60 * 60 * 24));
}
function getActionableActivities(plant, options) {
  if (plant.isHarvested) return [];
  const raw = plant.fullSchedule?.activities ?? [];
  if (!raw.length) return [];
  const adjusted = adjustScheduleActivitiesForPlant(raw, plant);
  const includeCompleted = options?.includeCompleted ?? false;
  return adjusted.filter((act) => {
    if (!includeCompleted && act.completed) return false;
    return true;
  });
}

// lib/weeklyBriefService.ts
function calculateUrgency(category, daysUntil, daysAfterPlanting, totalDays) {
  if (category === "harvest") {
    if (daysUntil <= 7) {
      return { urgency: "critical", reason: "Harvest window closing" };
    }
    if (daysUntil <= 14) {
      return { urgency: "recommended", reason: "Upcoming harvest" };
    }
    return { urgency: "optional", reason: "Future harvest" };
  }
  if (category === "pest") {
    if (daysUntil <= 5) {
      return { urgency: "critical", reason: "Peak pest window" };
    }
    if (daysUntil <= 14) {
      return { urgency: "recommended", reason: "Pest prevention window" };
    }
    return { urgency: "optional", reason: "Future concern" };
  }
  if (category === "planting" && daysUntil <= 7) {
    return { urgency: "critical", reason: "Time-critical planting/setup" };
  }
  if (daysUntil <= 14) {
    return { urgency: "recommended", reason: `Due in ${daysUntil} days` };
  }
  return { urgency: "optional", reason: "Future task" };
}
function buildWeeklyBrief(plants, fromDate = /* @__PURE__ */ new Date()) {
  const weekStart = new Date(fromDate);
  weekStart.setDate(weekStart.getDate() - weekStart.getDay() + (weekStart.getDay() === 0 ? -6 : 1));
  const weekEnd = new Date(weekStart);
  weekEnd.setDate(weekEnd.getDate() + 6);
  const allActivities = [];
  const plantSet = /* @__PURE__ */ new Set();
  plants.forEach((plant) => {
    if (plant.isHarvested) return;
    if (!plant.fullSchedule?.activities?.length) return;
    plantSet.add(plant.name);
    const activities = getActionableActivities(plant);
    activities.forEach((act, idx) => {
      const activityDate = activityDueDate(plant, act);
      const daysUntil = daysUntilActivity(plant, act, fromDate);
      const isWithinWindow = daysUntil >= -1 && daysUntil <= 14;
      if (!isWithinWindow) return;
      const { urgency, reason } = calculateUrgency(
        act.category,
        daysUntil,
        act.daysSincePlanting,
        plant.fullSchedule.totalDays || 60
      );
      allActivities.push({
        id: `${plant.id}-${idx}`,
        plantName: plant.name,
        activity: act.activity,
        details: act.details,
        category: act.category,
        dueDate: activityDate,
        daysUntil: Math.max(0, daysUntil),
        urgency,
        reason
      });
    });
  });
  const sortedActivities = allActivities.sort((a, b) => {
    const urgencyOrder = { critical: 0, recommended: 1, optional: 2 };
    const urgencyDiff = urgencyOrder[a.urgency] - urgencyOrder[b.urgency];
    if (urgencyDiff !== 0) return urgencyDiff;
    return a.daysUntil - b.daysUntil;
  });
  const critical = sortedActivities.filter((a) => a.urgency === "critical");
  const recommended = sortedActivities.filter((a) => a.urgency === "recommended");
  const optional = sortedActivities.filter((a) => a.urgency === "optional");
  return {
    weekStart,
    weekEnd,
    critical,
    recommended,
    optional,
    plantCount: plantSet.size,
    totalActions: allActivities.length
  };
}
function getBriefTasksDueThisWeek(brief) {
  return [...brief.critical, ...brief.recommended, ...brief.optional].filter((a) => a.daysUntil <= 7).sort((a, b) => {
    const urgencyOrder = { critical: 0, recommended: 1, optional: 2 };
    const urgencyDiff = urgencyOrder[a.urgency] - urgencyOrder[b.urgency];
    if (urgencyDiff !== 0) return urgencyDiff;
    return a.daysUntil - b.daysUntil;
  });
}

// lib/weatherGardeningSynthesis.ts
function isStormCode(code) {
  return [1087, 1273, 1276, 1279, 1282].includes(code);
}
function isHeavyRainCode2(code) {
  if (isStormCode(code)) return true;
  return [1189, 1192, 1195, 1243, 1246].includes(code);
}
var FROST_MIN_C = 2;
var HEATWAVE_MAX_C = 35;
var HEAVY_WIND_KPH = 40;
function shortWeekdayLabel(dateStr) {
  return (/* @__PURE__ */ new Date(dateStr + "T12:00:00")).toLocaleDateString("en-AU", { weekday: "short" }).replace(/\.$/, "");
}
function buildForecastGardenTips(days, frostConfig, season) {
  if (days.length === 0) return [];
  const tips = [];
  const frostCfg = frostConfig ?? { seasonalFrostAdvice: true, forecastFrostMinC: FROST_MIN_C };
  const frostDays = days.filter((d) => shouldWarnForecastFrost(d.minC, frostCfg));
  if (frostDays.length === 1) {
    tips.push(
      `Frost expected on ${frostDays[0].shortLabel}. Protect tender plants.`
    );
  } else if (frostDays.length > 1) {
    tips.push(
      `Frost expected ${frostDays.map((d) => d.shortLabel).join(", ")}. Protect tender plants.`
    );
  }
  const heatDays = days.filter((d) => d.maxC >= HEATWAVE_MAX_C);
  if (heatDays.length === 1) {
    tips.push(
      `Heatwave ${heatDays[0].shortLabel} (to ${Math.round(heatDays[0].maxC)}\xB0C). Water early and shade sensitive crops.`
    );
  } else if (heatDays.length > 1) {
    tips.push(
      `Heatwave ${heatDays.map((d) => d.shortLabel).join(", ")}. Water early and shade sensitive crops.`
    );
  }
  const heavyRainDays = days.filter((d) => isHeavyRainCode2(d.conditionCode));
  if (heavyRainDays.length === 1) {
    tips.push(
      season?.seasonCalendar === "tropical_wet_dry" ? `Heavy rain ${heavyRainDays[0].shortLabel}. Wet season: clear drainage before sowing in open beds.` : `Heavy rain ${heavyRainDays[0].shortLabel}. Hold off sowing and ensure drainage is clear.`
    );
  } else if (heavyRainDays.length > 1) {
    tips.push(
      season?.seasonCalendar === "tropical_wet_dry" ? `Heavy rain ${heavyRainDays.map((d) => d.shortLabel).join(", ")}. Let beds drain in wet season before outdoor work.` : `Heavy rain ${heavyRainDays.map((d) => d.shortLabel).join(", ")}. Let beds dry before outdoor work.`
    );
  }
  const veryWindy = days.filter((d) => d.maxWindKph >= HEAVY_WIND_KPH);
  if (veryWindy.length === 1) {
    tips.push(
      `Very strong wind ${veryWindy[0].shortLabel} (to ${Math.round(veryWindy[0].maxWindKph)} km/h). Delay spraying and transplanting.`
    );
  } else if (veryWindy.length > 1) {
    tips.push(
      `Very strong winds ${veryWindy.map((d) => d.shortLabel).join(", ")}. Stake plants and hold off delicate work.`
    );
  }
  return tips.slice(0, 3);
}

// lib/notificationService.ts
var PLANTING_PREVIEW_LIMIT = 6;
var TASK_PREVIEW_LIMIT = 5;
function isoWeekKey(date = /* @__PURE__ */ new Date()) {
  const d = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()));
  const dayNum = d.getUTCDay() || 7;
  d.setUTCDate(d.getUTCDate() + 4 - dayNum);
  const yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1));
  const weekNo = Math.ceil(((d.getTime() - yearStart.getTime()) / 864e5 + 1) / 7);
  return `${d.getUTCFullYear()}-W${String(weekNo).padStart(2, "0")}`;
}
function dateKey(date = /* @__PURE__ */ new Date()) {
  return date.toISOString().slice(0, 10);
}
function formatTaskLine(act) {
  const label = act.activity.trim();
  if (/tomato|basil|spinach|pea/i.test(label) && !label.toLowerCase().includes(act.plantName.toLowerCase())) {
    return `${label} (${act.plantName})`;
  }
  return label;
}
function joinPreview(lines, max = TASK_PREVIEW_LIMIT) {
  const slice = lines.slice(0, max);
  const body = slice.join(" \xB7 ");
  if (lines.length > max) return `${body} \xB7 +${lines.length - max} more`;
  return body;
}
function forecastToSnapshots(forecast) {
  return forecast.forecast.forecastday.slice(0, 4).map((d) => ({
    date: d.date,
    shortLabel: shortWeekdayLabel(d.date),
    minC: d.day.mintemp_c,
    maxC: d.day.maxtemp_c,
    maxWindKph: d.day.maxwind_kph ?? 0,
    conditionCode: d.day.condition.code
  }));
}
function composePlantingNotification(location, options) {
  if (!location?.state && !location?.climate) return null;
  const month = getCurrentPlantingMonth(options?.now);
  const rec = getPlantingRecommendationsForMonth(location, month);
  const sow = rec.sow.slice(0, PLANTING_PREVIEW_LIMIT);
  const plant = rec.plant.slice(0, PLANTING_PREVIEW_LIMIT);
  const names = Array.from(/* @__PURE__ */ new Set([...sow, ...plant]));
  if (names.length === 0) return null;
  if (plantingNoteBlocksNotification(options?.plantingWeatherNote)) return null;
  const assessment = assessPlantingWeather(options?.forecast, options?.frostConfig);
  if (!assessment.workable) return null;
  const listPhrase = sow.length && plant.length ? `Direct-sow ${sow.slice(0, 3).join(", ")}; plant out ${plant.slice(0, 3).join(", ")}` : sow.length ? `Good window to direct-sow ${sow.slice(0, 4).join(", ")}` : `Good window to plant out ${plant.slice(0, 4).join(", ")}`;
  const weatherBit = options?.plantingWeatherNote?.trim() || assessment.summary || "Check the forecast before you head out.";
  const body = `${listPhrase}. ${weatherBit}`.slice(0, 280);
  const week = isoWeekKey(options?.now);
  return {
    type: "planting",
    title: "What to plant this week",
    body,
    dedupeKey: `planting:${week}`,
    data: {
      deepLink: "/planting-calendar",
      preview: names.slice(0, PLANTING_PREVIEW_LIMIT)
    }
  };
}
function composeWeekendTasksNotification(plants, customTasks = [], now = /* @__PURE__ */ new Date()) {
  const active = plants.filter((p) => !p.isHarvested);
  if (active.length === 0) return null;
  const brief = buildWeeklyBrief(active, now);
  const systemLines = getBriefTasksDueThisWeek(brief).filter((a) => a.urgency !== "optional").map(formatTaskLine);
  const weekEnd = new Date(now);
  weekEnd.setDate(weekEnd.getDate() + (7 - weekEnd.getDay()));
  const customLines = customTasks.filter((t) => !t.completed && t.due_date).filter((t) => {
    const due = t.due_date.getTime();
    return due >= now.getTime() && due <= weekEnd.getTime() + 864e5;
  }).map((t) => t.title.trim()).filter(Boolean);
  const lines = Array.from(/* @__PURE__ */ new Set([...systemLines, ...customLines]));
  if (lines.length === 0) return null;
  const week = isoWeekKey(now);
  return {
    type: "weekend_tasks",
    title: "Your garden this weekend",
    body: joinPreview(lines),
    dedupeKey: `tasks:${week}`,
    data: {
      deepLink: "/tasks",
      preview: lines.slice(0, TASK_PREVIEW_LIMIT)
    }
  };
}
function composeWeatherAlertNotification(forecast, frostConfig, season) {
  const snapshots = forecastToSnapshots(forecast);
  const tips = buildForecastGardenTips(snapshots, frostConfig, season);
  if (tips.length === 0) return null;
  const body = tips.join(" ");
  const tipKey = tips.join("|").slice(0, 40).replace(/\W+/g, "_");
  return {
    type: "weather",
    title: "Weather watch for your garden",
    body: body.slice(0, 280),
    dedupeKey: `weather:${dateKey()}:${tipKey}`,
    data: {
      deepLink: "/dashboard",
      preview: tips
    }
  };
}

// lib/notificationTimezone.ts
var STATE_TIMEZONE = {
  NSW: "Australia/Sydney",
  ACT: "Australia/Sydney",
  VIC: "Australia/Melbourne",
  TAS: "Australia/Hobart",
  QLD: "Australia/Brisbane",
  SA: "Australia/Adelaide",
  WA: "Australia/Perth",
  NT: "Australia/Darwin"
};
function defaultTimezoneForLocation(location) {
  if (location?.state) {
    const mapped = STATE_TIMEZONE[location.state.toUpperCase()];
    if (mapped) return mapped;
  }
  try {
    if (typeof Intl !== "undefined") {
      const tz = Intl.DateTimeFormat().resolvedOptions()?.timeZone;
      if (typeof tz === "string" && tz.length > 0) return tz;
    }
  } catch {
  }
  return "Australia/Sydney";
}

// lib/notifications/digestSchedule.ts
var MORNING_DIGEST_HOUR = 8;
var MORNING_DIGEST_MINUTE_MAX = 29;
var FRIDAY_TASKS_HOUR = 17;
var FRIDAY_TASKS_MINUTE = 30;
var FRIDAY_TASKS_MINUTE_MAX = 44;
var WEEKDAY_MAP = {
  Sun: 0,
  Mon: 1,
  Tue: 2,
  Wed: 3,
  Thu: 4,
  Fri: 5,
  Sat: 6
};
function getLocalTimeParts(now, timeZone) {
  const parts = new Intl.DateTimeFormat("en-US", {
    timeZone,
    weekday: "short",
    hour: "numeric",
    minute: "numeric",
    hour12: false
  }).formatToParts(now);
  const weekday = parts.find((p) => p.type === "weekday")?.value ?? "Mon";
  const hour = Number(parts.find((p) => p.type === "hour")?.value ?? 0);
  const minute = Number(parts.find((p) => p.type === "minute")?.value ?? 0);
  return { hour, minute, dayOfWeek: WEEKDAY_MAP[weekday] ?? 1 };
}
function isMorningDigestWindow(local) {
  return local.hour === MORNING_DIGEST_HOUR && local.minute <= MORNING_DIGEST_MINUTE_MAX;
}
function isFridayEveningTasksWindow(local) {
  return local.dayOfWeek === 5 && local.hour === FRIDAY_TASKS_HOUR && local.minute >= FRIDAY_TASKS_MINUTE && local.minute <= FRIDAY_TASKS_MINUTE_MAX;
}
function getDigestSlotsForUser(now, timeZone, prefs) {
  const local = getLocalTimeParts(now, timeZone);
  const morning = isMorningDigestWindow(local);
  const fridayEvening = isFridayEveningTasksWindow(local);
  if (!morning && !fridayEvening) return null;
  return {
    planting: morning && prefs.plantingTipsEnabled && local.dayOfWeek === 2,
    weekendTasks: fridayEvening && prefs.weekendTasksEnabled,
    weather: morning && prefs.weatherAlertsEnabled
  };
}

// lib/push/fcmServer.ts
function pemToBinary(pem) {
  const b64 = pem.replace(/-----BEGIN PRIVATE KEY-----/, "").replace(/-----END PRIVATE KEY-----/, "").replace(/\s/g, "");
  const raw = atob(b64);
  const buf = new Uint8Array(raw.length);
  for (let i = 0; i < raw.length; i++) buf[i] = raw.charCodeAt(i);
  return buf.buffer;
}
async function getFcmAccessToken(config) {
  const now = Math.floor(Date.now() / 1e3);
  const header = { alg: "RS256", typ: "JWT" };
  const claim = {
    iss: config.clientEmail,
    sub: config.clientEmail,
    aud: "https://oauth2.googleapis.com/token",
    iat: now,
    exp: now + 3600,
    scope: "https://www.googleapis.com/auth/firebase.messaging"
  };
  const enc = (obj) => btoa(JSON.stringify(obj)).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
  const unsigned = `${enc(header)}.${enc(claim)}`;
  const key = await crypto.subtle.importKey(
    "pkcs8",
    pemToBinary(config.privateKey),
    { name: "RSASSA-PKCS1-v1_5", hash: "SHA-256" },
    false,
    ["sign"]
  );
  const sig = await crypto.subtle.sign(
    "RSASSA-PKCS1-v1_5",
    key,
    new TextEncoder().encode(unsigned)
  );
  const sigB64 = btoa(String.fromCharCode(...new Uint8Array(sig))).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
  const jwt = `${unsigned}.${sigB64}`;
  const tokenRes = await fetch("https://oauth2.googleapis.com/token", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      grant_type: "urn:ietf:params:oauth:grant-type:jwt-bearer",
      assertion: jwt
    })
  });
  const tokenJson = await tokenRes.json();
  if (!tokenJson.access_token) {
    throw new Error(tokenJson.error_description ?? "Failed to obtain FCM access token");
  }
  return tokenJson.access_token;
}
async function sendFcmToDevice(config, accessToken, deviceToken, title, body, data) {
  const res = await fetch(
    `https://fcm.googleapis.com/v1/projects/${config.projectId}/messages:send`,
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        message: {
          token: deviceToken,
          notification: { title, body },
          data,
          android: { priority: "HIGH", notification: { channel_id: "growguide-garden" } }
        }
      })
    }
  );
  if (!res.ok) {
    const errText = await res.text();
    throw new Error(`FCM ${res.status}: ${errText}`);
  }
}

// lib/seasonDisplay.ts
var MONTHS = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December"
];
var MONTH_TO_SOUTHERN = {
  January: "Summer",
  February: "Summer",
  December: "Summer",
  March: "Autumn",
  April: "Autumn",
  May: "Autumn",
  June: "Winter",
  July: "Winter",
  August: "Winter",
  September: "Spring",
  October: "Spring",
  November: "Spring"
};
var MONTH_TO_TROPICAL = {
  January: { label: "Wet season", bandSeason: "Summer" },
  February: { label: "Wet season", bandSeason: "Summer" },
  March: { label: "Wet season", bandSeason: "Summer" },
  April: { label: "Wet season", bandSeason: "Summer" },
  May: { label: "Dry season", bandSeason: "Winter" },
  June: { label: "Dry season", bandSeason: "Winter" },
  July: { label: "Dry season", bandSeason: "Winter" },
  August: { label: "Dry season", bandSeason: "Winter" },
  September: { label: "Build-up", bandSeason: "Spring" },
  October: { label: "Build-up", bandSeason: "Spring" },
  November: { label: "Build-up", bandSeason: "Spring" },
  December: { label: "Wet season", bandSeason: "Summer" }
};
function packSeasonWeeks(daysSinceStart) {
  const raw = Math.floor(daysSinceStart / 7) + 1;
  const weekInSeason = Math.min(14, Math.max(1, raw));
  const guidanceLineWeek = raw > 14 ? (raw - 1) % 14 + 1 : weekInSeason;
  return { weekInSeason, guidanceLineWeek };
}
var SOUTHERN_SEASON_MONTHS = {
  Summer: [11, 0, 1],
  Autumn: [2, 3, 4],
  Winter: [5, 6, 7],
  Spring: [8, 9, 10]
};
function startOfSouthernSeason(date, season) {
  const months = SOUTHERN_SEASON_MONTHS[season];
  const firstMonth = months[0];
  let year = date.getFullYear();
  const monthIndex = date.getMonth();
  if (season === "Summer" && monthIndex < firstMonth) {
    year -= 1;
  } else if (monthIndex < firstMonth) {
    year -= 1;
  }
  return new Date(year, firstMonth, 1);
}
function guidanceWeeksInSouthernSeason(date, season) {
  const months = SOUTHERN_SEASON_MONTHS[season];
  if (!months.includes(date.getMonth())) {
    return { weekInSeason: 1, guidanceLineWeek: 1 };
  }
  const seasonStart = startOfSouthernSeason(date, season);
  const msPerDay = 24 * 60 * 60 * 1e3;
  const daysSinceStart = Math.floor(
    (date.getTime() - seasonStart.getTime()) / msPerDay
  );
  return packSeasonWeeks(daysSinceStart);
}
function startOfMonthBlockSeason(date, seasonMonthIndices) {
  const sorted = [...seasonMonthIndices].sort((a, b) => a - b);
  const wraps = sorted.length > 1 && sorted.some((m) => m >= 10) && sorted.some((m) => m <= 2);
  const monthIndex = date.getMonth();
  let year = date.getFullYear();
  if (wraps) {
    if (monthIndex >= sorted[0]) {
      return new Date(year, sorted[0], 1);
    }
    return new Date(year - 1, sorted[0], 1);
  }
  const firstMonth = sorted[0];
  if (monthIndex < firstMonth) year -= 1;
  return new Date(year, firstMonth, 1);
}
function weeksInMonthBlockSeason(date, seasonMonthIndices) {
  const seasonStart = startOfMonthBlockSeason(date, seasonMonthIndices);
  const msPerDay = 24 * 60 * 60 * 1e3;
  const daysSinceStart = Math.floor(
    (date.getTime() - seasonStart.getTime()) / msPerDay
  );
  return packSeasonWeeks(daysSinceStart);
}
function computeSeasonDisplay(date = /* @__PURE__ */ new Date(), seasonCalendar = "southern_four_seasons") {
  const monthIndex = date.getMonth();
  const month = MONTHS[monthIndex];
  if (seasonCalendar === "tropical_wet_dry") {
    const tropical = MONTH_TO_TROPICAL[month];
    const indices = MONTHS.map(
      (m, i) => MONTH_TO_TROPICAL[m].label === tropical.label ? i : -1
    ).filter((i) => i >= 0);
    const weeks2 = weeksInMonthBlockSeason(date, indices);
    return {
      label: tropical.label,
      weekInSeason: weeks2.weekInSeason,
      guidanceLineWeek: weeks2.guidanceLineWeek,
      month,
      bandSeason: tropical.bandSeason
    };
  }
  const bandSeason = MONTH_TO_SOUTHERN[month] ?? "Spring";
  const weeks = guidanceWeeksInSouthernSeason(date, bandSeason);
  return {
    label: bandSeason,
    weekInSeason: weeks.weekInSeason,
    guidanceLineWeek: weeks.guidanceLineWeek,
    month,
    bandSeason
  };
}

// lib/weatherSignalSeasonalNorms.ts
var MONTHS2 = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December"
];
var MONTHLY_AVG_MAX_C = {
  cold: {
    January: 22,
    February: 22,
    March: 20,
    April: 16,
    May: 13,
    June: 11,
    July: 10,
    August: 11,
    September: 13,
    October: 15,
    November: 17,
    December: 19
  },
  cool: {
    January: 24,
    February: 24,
    March: 22,
    April: 18,
    May: 15,
    June: 13,
    July: 12,
    August: 13,
    September: 15,
    October: 17,
    November: 19,
    December: 21
  },
  temperate: {
    January: 28,
    February: 28,
    March: 25,
    April: 22,
    May: 18,
    June: 15,
    July: 14,
    August: 16,
    September: 19,
    October: 22,
    November: 24,
    December: 26
  },
  warm: {
    January: 31,
    February: 31,
    March: 29,
    April: 26,
    May: 22,
    June: 19,
    July: 18,
    August: 20,
    September: 23,
    October: 26,
    November: 28,
    December: 30
  },
  tropical: {
    January: 32,
    February: 32,
    March: 31,
    April: 30,
    May: 28,
    June: 27,
    July: 27,
    August: 28,
    September: 30,
    October: 31,
    November: 32,
    December: 32
  }
};
var MONTHLY_RAIN_MM = {
  cold: {
    January: 50,
    February: 45,
    March: 50,
    April: 55,
    May: 60,
    June: 65,
    July: 70,
    August: 65,
    September: 60,
    October: 65,
    November: 55,
    December: 50
  },
  cool: {
    January: 45,
    February: 40,
    March: 45,
    April: 50,
    May: 55,
    June: 60,
    July: 65,
    August: 60,
    September: 55,
    October: 50,
    November: 50,
    December: 45
  },
  temperate: {
    January: 40,
    February: 40,
    March: 45,
    April: 50,
    May: 55,
    June: 60,
    July: 55,
    August: 50,
    September: 45,
    October: 45,
    November: 50,
    December: 40
  },
  warm: {
    January: 35,
    February: 30,
    March: 35,
    April: 40,
    May: 45,
    June: 50,
    July: 45,
    August: 40,
    September: 35,
    October: 35,
    November: 40,
    December: 35
  },
  tropical: {
    January: 320,
    February: 300,
    March: 200,
    April: 80,
    May: 25,
    June: 10,
    July: 5,
    August: 5,
    September: 15,
    October: 40,
    November: 120,
    December: 250
  }
};
var MONTHLY_AVG_MIN_C = {
  cold: {
    January: 13,
    February: 13,
    March: 11,
    April: 9,
    May: 7,
    June: 5,
    July: 4,
    August: 5,
    September: 6,
    October: 8,
    November: 10,
    December: 12
  },
  cool: {
    January: 15,
    February: 15,
    March: 13,
    April: 11,
    May: 9,
    June: 7,
    July: 6,
    August: 7,
    September: 9,
    October: 11,
    November: 13,
    December: 14
  },
  temperate: {
    January: 18,
    February: 18,
    March: 16,
    April: 13,
    May: 10,
    June: 8,
    July: 7,
    August: 8,
    September: 10,
    October: 13,
    November: 15,
    December: 17
  },
  warm: {
    January: 21,
    February: 21,
    March: 19,
    April: 16,
    May: 13,
    June: 10,
    July: 9,
    August: 10,
    September: 13,
    October: 16,
    November: 18,
    December: 20
  },
  tropical: {
    January: 25,
    February: 25,
    March: 24,
    April: 23,
    May: 20,
    June: 18,
    July: 17,
    August: 18,
    September: 21,
    October: 23,
    November: 24,
    December: 25
  }
};
var COLD_WEEKLY_NORMS = {
  January: [
    { climate: "cold", month: "January", weekOfMonth: 1, expectedMaxTemp: 21.5, expectedMinTemp: 12.5, expectedRainfallMm: 10 },
    { climate: "cold", month: "January", weekOfMonth: 2, expectedMaxTemp: 22, expectedMinTemp: 13, expectedRainfallMm: 12 },
    { climate: "cold", month: "January", weekOfMonth: 3, expectedMaxTemp: 22.5, expectedMinTemp: 13.5, expectedRainfallMm: 14 },
    { climate: "cold", month: "January", weekOfMonth: 4, expectedMaxTemp: 22, expectedMinTemp: 13, expectedRainfallMm: 14 }
  ],
  February: [
    { climate: "cold", month: "February", weekOfMonth: 1, expectedMaxTemp: 22, expectedMinTemp: 13, expectedRainfallMm: 10 },
    { climate: "cold", month: "February", weekOfMonth: 2, expectedMaxTemp: 21.5, expectedMinTemp: 12.5, expectedRainfallMm: 10 },
    { climate: "cold", month: "February", weekOfMonth: 3, expectedMaxTemp: 21.5, expectedMinTemp: 12.5, expectedRainfallMm: 12 },
    { climate: "cold", month: "February", weekOfMonth: 4, expectedMaxTemp: 21, expectedMinTemp: 12, expectedRainfallMm: 13 }
  ],
  March: [
    { climate: "cold", month: "March", weekOfMonth: 1, expectedMaxTemp: 20.5, expectedMinTemp: 11.5, expectedRainfallMm: 11 },
    { climate: "cold", month: "March", weekOfMonth: 2, expectedMaxTemp: 20, expectedMinTemp: 11, expectedRainfallMm: 12 },
    { climate: "cold", month: "March", weekOfMonth: 3, expectedMaxTemp: 19.5, expectedMinTemp: 10.5, expectedRainfallMm: 13 },
    { climate: "cold", month: "March", weekOfMonth: 4, expectedMaxTemp: 19, expectedMinTemp: 10, expectedRainfallMm: 14 }
  ],
  April: [
    { climate: "cold", month: "April", weekOfMonth: 1, expectedMaxTemp: 17, expectedMinTemp: 9.5, expectedRainfallMm: 12 },
    { climate: "cold", month: "April", weekOfMonth: 2, expectedMaxTemp: 16.5, expectedMinTemp: 9, expectedRainfallMm: 13 },
    { climate: "cold", month: "April", weekOfMonth: 3, expectedMaxTemp: 16, expectedMinTemp: 8.5, expectedRainfallMm: 14 },
    { climate: "cold", month: "April", weekOfMonth: 4, expectedMaxTemp: 15.5, expectedMinTemp: 8, expectedRainfallMm: 16 }
  ],
  May: [
    { climate: "cold", month: "May", weekOfMonth: 1, expectedMaxTemp: 14, expectedMinTemp: 7.5, expectedRainfallMm: 13 },
    { climate: "cold", month: "May", weekOfMonth: 2, expectedMaxTemp: 13.5, expectedMinTemp: 7, expectedRainfallMm: 14 },
    { climate: "cold", month: "May", weekOfMonth: 3, expectedMaxTemp: 13, expectedMinTemp: 6.5, expectedRainfallMm: 15 },
    { climate: "cold", month: "May", weekOfMonth: 4, expectedMaxTemp: 12.5, expectedMinTemp: 6, expectedRainfallMm: 16 }
  ],
  June: [
    { climate: "cold", month: "June", weekOfMonth: 1, expectedMaxTemp: 11.5, expectedMinTemp: 5.5, expectedRainfallMm: 15 },
    { climate: "cold", month: "June", weekOfMonth: 2, expectedMaxTemp: 11, expectedMinTemp: 5, expectedRainfallMm: 15 },
    { climate: "cold", month: "June", weekOfMonth: 3, expectedMaxTemp: 10.5, expectedMinTemp: 4.5, expectedRainfallMm: 16 },
    { climate: "cold", month: "June", weekOfMonth: 4, expectedMaxTemp: 10.5, expectedMinTemp: 4.5, expectedRainfallMm: 17 }
  ],
  July: [
    { climate: "cold", month: "July", weekOfMonth: 1, expectedMaxTemp: 10.5, expectedMinTemp: 4, expectedRainfallMm: 16 },
    { climate: "cold", month: "July", weekOfMonth: 2, expectedMaxTemp: 10, expectedMinTemp: 4, expectedRainfallMm: 17 },
    { climate: "cold", month: "July", weekOfMonth: 3, expectedMaxTemp: 10, expectedMinTemp: 3.5, expectedRainfallMm: 18 },
    { climate: "cold", month: "July", weekOfMonth: 4, expectedMaxTemp: 10.5, expectedMinTemp: 4, expectedRainfallMm: 19 }
  ],
  August: [
    { climate: "cold", month: "August", weekOfMonth: 1, expectedMaxTemp: 11, expectedMinTemp: 4.5, expectedRainfallMm: 16 },
    { climate: "cold", month: "August", weekOfMonth: 2, expectedMaxTemp: 11, expectedMinTemp: 5, expectedRainfallMm: 16 },
    { climate: "cold", month: "August", weekOfMonth: 3, expectedMaxTemp: 11.5, expectedMinTemp: 5.5, expectedRainfallMm: 17 },
    { climate: "cold", month: "August", weekOfMonth: 4, expectedMaxTemp: 12, expectedMinTemp: 5.5, expectedRainfallMm: 17 }
  ],
  September: [
    { climate: "cold", month: "September", weekOfMonth: 1, expectedMaxTemp: 12.5, expectedMinTemp: 6, expectedRainfallMm: 14 },
    { climate: "cold", month: "September", weekOfMonth: 2, expectedMaxTemp: 13, expectedMinTemp: 6, expectedRainfallMm: 14 },
    { climate: "cold", month: "September", weekOfMonth: 3, expectedMaxTemp: 13.5, expectedMinTemp: 6.5, expectedRainfallMm: 15 },
    { climate: "cold", month: "September", weekOfMonth: 4, expectedMaxTemp: 14, expectedMinTemp: 7, expectedRainfallMm: 15 }
  ],
  October: [
    { climate: "cold", month: "October", weekOfMonth: 1, expectedMaxTemp: 14.5, expectedMinTemp: 8, expectedRainfallMm: 15 },
    { climate: "cold", month: "October", weekOfMonth: 2, expectedMaxTemp: 15, expectedMinTemp: 8, expectedRainfallMm: 15 },
    { climate: "cold", month: "October", weekOfMonth: 3, expectedMaxTemp: 15.5, expectedMinTemp: 8.5, expectedRainfallMm: 16 },
    { climate: "cold", month: "October", weekOfMonth: 4, expectedMaxTemp: 16, expectedMinTemp: 9, expectedRainfallMm: 16 }
  ],
  November: [
    { climate: "cold", month: "November", weekOfMonth: 1, expectedMaxTemp: 16.5, expectedMinTemp: 10, expectedRainfallMm: 12 },
    { climate: "cold", month: "November", weekOfMonth: 2, expectedMaxTemp: 17, expectedMinTemp: 10, expectedRainfallMm: 13 },
    { climate: "cold", month: "November", weekOfMonth: 3, expectedMaxTemp: 17.5, expectedMinTemp: 10.5, expectedRainfallMm: 14 },
    { climate: "cold", month: "November", weekOfMonth: 4, expectedMaxTemp: 18, expectedMinTemp: 11, expectedRainfallMm: 15 }
  ],
  December: [
    { climate: "cold", month: "December", weekOfMonth: 1, expectedMaxTemp: 18.5, expectedMinTemp: 11.5, expectedRainfallMm: 11 },
    { climate: "cold", month: "December", weekOfMonth: 2, expectedMaxTemp: 19, expectedMinTemp: 12, expectedRainfallMm: 12 },
    { climate: "cold", month: "December", weekOfMonth: 3, expectedMaxTemp: 19.5, expectedMinTemp: 12.5, expectedRainfallMm: 13 },
    { climate: "cold", month: "December", weekOfMonth: 4, expectedMaxTemp: 20, expectedMinTemp: 13, expectedRainfallMm: 14 }
  ]
};
var FALLBACK_MONTH = "January";
var FALLBACK_MONTH_INDEX = 0;
function normalizeMonth(month) {
  return MONTHS2.find((m) => m === month) ?? MONTHS2[FALLBACK_MONTH_INDEX];
}
function monthNeighbor(month, offset) {
  const currentIndex = MONTHS2.indexOf(normalizeMonth(month));
  const nextIndex = (currentIndex + offset + MONTHS2.length) % MONTHS2.length;
  return MONTHS2[nextIndex];
}
function weekOfMonthFromDate(date) {
  const week = Math.floor((date.getDate() - 1) / 7) + 1;
  return Math.max(1, Math.min(4, week));
}
function interpolateWeekNorm(climate, month, weekOfMonth) {
  const safeMonth = normalizeMonth(month);
  const prevMonth = monthNeighbor(safeMonth, -1);
  const nextMonth = monthNeighbor(safeMonth, 1);
  const maxTable = MONTHLY_AVG_MAX_C[climate] ?? MONTHLY_AVG_MAX_C.cool;
  const minTable = MONTHLY_AVG_MIN_C[climate] ?? MONTHLY_AVG_MIN_C.cool;
  const rainTable = MONTHLY_RAIN_MM[climate] ?? MONTHLY_RAIN_MM.cool;
  const currentMax = maxTable[safeMonth] ?? maxTable[FALLBACK_MONTH];
  const currentMin = minTable[safeMonth] ?? minTable[FALLBACK_MONTH];
  const currentRain = rainTable[safeMonth] ?? rainTable[FALLBACK_MONTH];
  const prevMax = maxTable[prevMonth] ?? currentMax;
  const prevMin = minTable[prevMonth] ?? currentMin;
  const prevRain = rainTable[prevMonth] ?? currentRain;
  const nextMax = maxTable[nextMonth] ?? currentMax;
  const nextMin = minTable[nextMonth] ?? currentMin;
  const nextRain = rainTable[nextMonth] ?? currentRain;
  const progress = (weekOfMonth - 1) / 3;
  const expectedMaxTemp = currentMax + (nextMax - prevMax) * progress * 0.35;
  const expectedMinTemp = currentMin + (nextMin - prevMin) * progress * 0.35;
  const expectedRainfallMm = currentRain * (7 / 30) * (0.9 + progress * 0.2);
  return {
    climate,
    month: safeMonth,
    weekOfMonth,
    expectedMaxTemp: Math.round(expectedMaxTemp * 10) / 10,
    expectedMinTemp: Math.round(expectedMinTemp * 10) / 10,
    expectedRainfallMm: Math.max(0.5, Math.round(expectedRainfallMm * 10) / 10)
  };
}
function getSeasonalNormForMonth(climate, month) {
  const maxTable = MONTHLY_AVG_MAX_C[climate] ?? MONTHLY_AVG_MAX_C.cool;
  const minTable = MONTHLY_AVG_MIN_C[climate] ?? MONTHLY_AVG_MIN_C.cool;
  const rainTable = MONTHLY_RAIN_MM[climate] ?? MONTHLY_RAIN_MM.cool;
  const avgMaxC = maxTable[month] ?? maxTable[FALLBACK_MONTH];
  const avgMinC = minTable[month] ?? minTable[FALLBACK_MONTH];
  const monthlyRainMm = rainTable[month] ?? rainTable[FALLBACK_MONTH];
  const weeklyRainMm = monthlyRainMm * (7 / 30);
  return { avgMaxC, avgMinC, monthlyRainMm, weeklyRainMm };
}
function getSeasonalNormForWeek(climate, month, weekOfMonth) {
  if (climate === "cold") {
    const safeMonth = normalizeMonth(month);
    const row = COLD_WEEKLY_NORMS[safeMonth]?.[weekOfMonth - 1];
    if (row) return row;
  }
  return interpolateWeekNorm(climate, month, weekOfMonth);
}

// lib/weatherSignal.ts
var CACHE_PREFIX = "weather_signal_";
var OPEN_METEO = "https://api.open-meteo.com/v1/forecast";
var recentDailyInflight = /* @__PURE__ */ new Map();
function roundCoord(n) {
  return n.toFixed(3);
}
function localDateKey(date = /* @__PURE__ */ new Date()) {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}
function cacheKey(lat, lon, date) {
  return `${CACHE_PREFIX}${roundCoord(lat)}_${roundCoord(lon)}_${localDateKey(date)}`;
}
function readCache(lat, lon, date) {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem(cacheKey(lat, lon, date));
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    if (parsed.dateKey === localDateKey(date)) return parsed.signal;
  } catch {
  }
  return null;
}
function writeCache(lat, lon, date, signal) {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(
      cacheKey(lat, lon, date),
      JSON.stringify({ signal, dateKey: localDateKey(date) })
    );
  } catch {
  }
}
function recentDailyInflightKey(lat, lon, date) {
  return `${roundCoord(lat)}_${roundCoord(lon)}_${localDateKey(date)}`;
}
async function fetchRecentAndForecastDaily(lat, lon, date = /* @__PURE__ */ new Date()) {
  const key = recentDailyInflightKey(lat, lon, date);
  const existing = recentDailyInflight.get(key);
  if (existing) return existing;
  const params = new URLSearchParams({
    latitude: String(lat),
    longitude: String(lon),
    daily: "temperature_2m_max,temperature_2m_min,precipitation_sum",
    past_days: "14",
    forecast_days: "7",
    timezone: "auto"
  });
  const promise = (async () => {
    try {
      const res = await fetch(`${OPEN_METEO}?${params.toString()}`);
      if (!res.ok) return null;
      const body = await res.json();
      return body.daily ?? null;
    } finally {
      recentDailyInflight.delete(key);
    }
  })();
  recentDailyInflight.set(key, promise);
  return promise;
}
function summariseByDateRange(daily, startIso, endIso) {
  const maxes = [];
  const mins = [];
  let totalRainMm = 0;
  for (let i = 0; i < daily.time.length; i++) {
    const time = daily.time[i];
    if (time < startIso || time > endIso) continue;
    const max = daily.temperature_2m_max[i];
    const min = daily.temperature_2m_min[i];
    const rain = daily.precipitation_sum[i];
    if (max != null) maxes.push(max);
    if (min != null) mins.push(min);
    if (rain != null) totalRainMm += rain;
  }
  if (maxes.length === 0) return null;
  return {
    avgMaxC: maxes.reduce((a, b) => a + b, 0) / maxes.length,
    avgMinC: mins.length > 0 ? mins.reduce((a, b) => a + b, 0) / mins.length : 0,
    frostEvent: mins.some((m) => m < 2),
    totalRainMm
  };
}
function isoDateLocal(d) {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}
function startOfDay(d) {
  const out = new Date(d);
  out.setHours(0, 0, 0, 0);
  return out;
}
function addDays(d, days) {
  const out = new Date(d);
  out.setDate(out.getDate() + days);
  return out;
}
var MONTH_NAMES = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December"
];
function monthNameLocal(date) {
  return MONTH_NAMES[date.getMonth()];
}
function buildWeekNorm(climate, date) {
  const month = monthNameLocal(date);
  const weekOfMonth = weekOfMonthFromDate(date);
  return getSeasonalNormForWeek(climate, month, weekOfMonth);
}
function toWeekSummary(summary, isForecast) {
  return {
    avgMaxTempC: summary.avgMaxC,
    avgMinTempC: summary.avgMinC,
    totalRainMm: summary.totalRainMm,
    hasFrost: summary.frostEvent,
    isForecast
  };
}
function warmIntensityFromDelta(delta) {
  if (delta >= 5) return "strong";
  if (delta >= 4) return "moderate";
  if (delta >= 3) return "slight";
  return "none";
}
function magnitudeFromWarmDelta(delta) {
  if (delta >= 5) return "strong";
  if (delta >= 4) return "moderate";
  if (delta >= 3) return "marginal";
  return null;
}
function magnitudeFromDryRatio(rainRatio) {
  if (rainRatio < 0.1) return "strong";
  if (rainRatio < 0.2) return "moderate";
  if (rainRatio < 0.3) return "marginal";
  return null;
}
function magnitudeFromWetRatio(rainRatio) {
  if (rainRatio > 3) return "strong";
  if (rainRatio > 2) return "moderate";
  if (rainRatio > 1.5) return "marginal";
  return null;
}
function deriveSignal(summary, climate, month) {
  const weekNorm = getSeasonalNormForWeek(climate, month, 2);
  const norm = getSeasonalNormForMonth(climate, month);
  const warmDelta2 = summary.avgMaxC - norm.avgMaxC;
  const rainRatio = weekNorm.expectedRainfallMm > 0 ? summary.totalRainMm / weekNorm.expectedRainfallMm : 1;
  const warmIntensity = warmIntensityFromDelta(warmDelta2);
  return {
    warmDeviation: warmIntensity !== "none",
    warmIntensity,
    warmMagnitude: magnitudeFromWarmDelta(warmDelta2),
    frostEvent: summary.frostEvent,
    droughtSignal: rainRatio < 0.3,
    dryMagnitude: magnitudeFromDryRatio(rainRatio),
    wetSignal: rainRatio > 1.5,
    wetMagnitude: magnitudeFromWetRatio(rainRatio),
    avgMaxC: summary.avgMaxC,
    avgMinC: summary.avgMinC,
    totalRainMm: summary.totalRainMm,
    normAvgMaxC: norm.avgMaxC,
    normAvgMinC: norm.avgMinC,
    normWeeklyRainMm: norm.weeklyRainMm,
    forecastAvgMaxTemp: summary.avgMaxC,
    forecastTotalRainMm: summary.totalRainMm,
    forecastHasFrost: summary.frostEvent
  };
}
async function getRollingWeatherContext(lat, lon, climate, date = /* @__PURE__ */ new Date()) {
  const today = startOfDay(/* @__PURE__ */ new Date());
  const target = startOfDay(date);
  if (Math.abs(target.getTime() - today.getTime()) > 2 * 24 * 60 * 60 * 1e3) return null;
  try {
    const recent = await fetchRecentAndForecastDaily(lat, lon, date);
    if (!recent) return null;
    const currentIso = isoDateLocal(today);
    const forecastEndIso = isoDateLocal(addDays(today, 6));
    const priorActualStartIso = isoDateLocal(addDays(today, -7));
    const priorActualEndIso = isoDateLocal(addDays(today, -1));
    const forecastSummary = summariseByDateRange(recent, currentIso, forecastEndIso);
    const priorWeekSummary = summariseByDateRange(recent, priorActualStartIso, priorActualEndIso);
    if (!forecastSummary || !priorWeekSummary) return null;
    const olderStart = isoDateLocal(addDays(today, -14));
    const olderEnd = isoDateLocal(addDays(today, -8));
    const olderSummary = summariseByDateRange(recent, olderStart, olderEnd);
    if (!olderSummary) return null;
    const weekDates = [addDays(today, -10), addDays(today, -3), today];
    const weekWeather = [
      toWeekSummary(olderSummary, false),
      toWeekSummary(priorWeekSummary, false),
      toWeekSummary(forecastSummary, true)
    ];
    const weekNorms = weekDates.map((d) => buildWeekNorm(climate, d));
    const signal = deriveSignal(forecastSummary, climate, monthNameLocal(today));
    signal.forecastAvgMaxTemp = forecastSummary.avgMaxC;
    signal.forecastTotalRainMm = forecastSummary.totalRainMm;
    signal.forecastHasFrost = forecastSummary.frostEvent;
    return { signal, weekWeather, weekNorms };
  } catch {
    return null;
  }
}
async function getWeatherSignal(lat, lon, climate, month, date = /* @__PURE__ */ new Date()) {
  const cached = readCache(lat, lon, date);
  if (cached) return cached;
  try {
    const daily = await fetchRecentAndForecastDaily(lat, lon, date);
    if (!daily) return null;
    const today = startOfDay(/* @__PURE__ */ new Date());
    const start = isoDateLocal(addDays(today, -6));
    const end = isoDateLocal(today);
    const forecastStart = isoDateLocal(today);
    const forecastEnd = isoDateLocal(addDays(today, 6));
    const summary = summariseByDateRange(daily, start, end);
    const forecastSummary = summariseByDateRange(daily, forecastStart, forecastEnd);
    if (!summary || !forecastSummary) return null;
    const signal = deriveSignal(summary, climate, month);
    signal.forecastAvgMaxTemp = forecastSummary.avgMaxC;
    signal.forecastTotalRainMm = forecastSummary.totalRainMm;
    signal.forecastHasFrost = forecastSummary.frostEvent;
    writeCache(lat, lon, date, signal);
    return signal;
  } catch {
    return null;
  }
}

// lib/weatherService.ts
var CACHE_TTL_MS = 30 * 60 * 1e3;
function resolveWeatherQuery(input) {
  if (!input) return null;
  if ("lat" in input && "lon" in input && Number.isFinite(input.lat) && Number.isFinite(input.lon)) {
    const q = input;
    return {
      lat: q.lat,
      lon: q.lon,
      placeId: q.placeId,
      label: q.label
    };
  }
  const loc = input;
  if (loc.placeId) {
    const place = findPlaceById(loc.placeId);
    if (place) {
      return {
        lat: place.lat,
        lon: place.lon,
        placeId: place.id,
        label: `${place.name}, ${place.state}`
      };
    }
  }
  if (Number.isFinite(loc.lat) && Number.isFinite(loc.lon)) {
    return {
      lat: loc.lat,
      lon: loc.lon,
      placeId: loc.placeId,
      label: loc.city && loc.state ? `${loc.city}, ${loc.state}` : void 0
    };
  }
  return null;
}

// lib/notifications/digestRunner.ts
function parseLocation(raw) {
  if (!raw) return null;
  if (typeof raw === "string") {
    try {
      return JSON.parse(raw);
    } catch {
      return null;
    }
  }
  if (typeof raw === "object") return raw;
  return null;
}
function parseGardenPlant(row) {
  return {
    id: row.id,
    name: row.name,
    datePlanted: row.date_planted,
    type: row.type,
    activityType: row.activity_type ?? void 0,
    location: row.location ?? void 0,
    notes: row.notes ?? void 0,
    estimatedHarvest: row.estimated_harvest ?? void 0,
    schedule: row.schedule ?? [],
    fullSchedule: row.full_schedule ? JSON.parse(row.full_schedule) : void 0,
    isHarvested: row.is_harvested ?? false,
    harvestedDate: row.harvested_date ?? void 0
  };
}
function parseTask(row) {
  return {
    id: row.id,
    user_id: row.user_id,
    title: row.title,
    description: row.description ?? void 0,
    due_date: row.due_date ? new Date(row.due_date) : void 0,
    completed: Boolean(row.completed),
    completed_at: row.completed_at ? new Date(row.completed_at) : void 0,
    plant_id: row.plant_id ?? void 0,
    project_id: row.project_id ?? void 0,
    category: row.category ?? "general",
    priority: row.priority ?? "medium",
    created_at: new Date(row.created_at),
    updated_at: new Date(row.updated_at)
  };
}
async function fetchForecast(location, apiKey) {
  const query = resolveWeatherQuery(location);
  if (!query) return null;
  const q = `${query.lat},${query.lon}`;
  const url = `https://api.weatherapi.com/v1/forecast.json?key=${encodeURIComponent(apiKey)}&q=${encodeURIComponent(q)}&days=4&aqi=no`;
  const res = await fetch(url);
  if (!res.ok) return null;
  return await res.json();
}
async function insertIfNew(admin, userId, payload) {
  const { data: existing } = await admin.from("notifications").select("id").eq("user_id", userId).eq("dedupe_key", payload.dedupeKey).maybeSingle();
  if (existing?.id) return null;
  const { data, error } = await admin.from("notifications").insert({
    user_id: userId,
    type: payload.type,
    title: payload.title,
    body: payload.body,
    data: payload.data ?? null,
    dedupe_key: payload.dedupeKey
  }).select("id").single();
  if (error) {
    if (error.code === "23505") return null;
    throw new Error(error.message);
  }
  return data;
}
async function sendPushForNotification(admin, firebase, accessToken, userId, notificationId, title, body, deepLink) {
  const { data: tokens } = await admin.from("push_device_tokens").select("token").eq("user_id", userId);
  if (!tokens?.length) return 0;
  let sent = 0;
  for (const row of tokens) {
    try {
      await sendFcmToDevice(firebase, accessToken, row.token, title, body, {
        notificationId,
        deepLink
      });
      sent++;
    } catch {
    }
  }
  if (sent > 0) {
    await admin.from("notifications").update({ push_sent_at: (/* @__PURE__ */ new Date()).toISOString() }).eq("id", notificationId);
  }
  return sent;
}
async function processUser(admin, userId, profile, config, fcmToken, now) {
  const prefs = {
    notificationsEnabled: Boolean(profile.notifications_enabled),
    plantingTipsEnabled: profile.planting_tips_enabled !== false,
    weekendTasksEnabled: profile.weekend_tasks_enabled !== false,
    weatherAlertsEnabled: profile.weather_alerts_enabled !== false,
    timezone: typeof profile.notifications_timezone === "string" ? profile.notifications_timezone : null
  };
  if (!prefs.notificationsEnabled) return { created: 0, pushSent: 0 };
  const location = parseLocation(profile.location);
  const timeZone = prefs.timezone?.trim() || defaultTimezoneForLocation(location ?? void 0);
  const slots = getDigestSlotsForUser(now, timeZone, prefs);
  if (!slots || !slots.planting && !slots.weekendTasks && !slots.weather) {
    return { created: 0, pushSent: 0 };
  }
  let forecast = null;
  let plantingNote = null;
  const weatherQuery = location ? resolveWeatherQuery(location) : null;
  const locCtx = location ? resolveLocationContext(location) : null;
  const frostConfig = getFrostGuidanceConfig(locCtx);
  const month = getCurrentPlantingMonth(now);
  if (weatherQuery && (slots.planting || slots.weather)) {
    forecast = await fetchForecast(location, config.weatherApiKey);
    if (forecast && slots.planting) {
      try {
        const [signal, rolling] = await Promise.all([
          getWeatherSignal(
            weatherQuery.lat,
            weatherQuery.lon,
            location?.climate ?? "cool",
            month
          ),
          getRollingWeatherContext(
            weatherQuery.lat,
            weatherQuery.lon,
            location?.climate ?? "cool"
          )
        ]);
        plantingNote = buildPlantingWeatherNote(signal, rolling);
      } catch {
      }
    }
  }
  const payloads = [];
  if (slots.planting) {
    const p = composePlantingNotification(location, {
      forecast,
      plantingWeatherNote: plantingNote,
      frostConfig,
      now
    });
    if (p) payloads.push(p);
  }
  if (slots.weekendTasks) {
    const { data: plantRows } = await admin.from("garden_plants").select("*").eq("user_id", userId);
    const plants = (plantRows ?? []).map((r) => parseGardenPlant(r));
    const { data: taskRows } = await admin.from("user_tasks").select("*").eq("user_id", userId);
    const tasks = (taskRows ?? []).map((r) => parseTask(r));
    const p = composeWeekendTasksNotification(plants, tasks, now);
    if (p) payloads.push(p);
  }
  if (slots.weather && forecast) {
    const season = locCtx != null ? {
      seasonLabel: computeSeasonDisplay(now, locCtx.seasonCalendar).label,
      seasonCalendar: locCtx.seasonCalendar
    } : void 0;
    const p = composeWeatherAlertNotification(forecast, frostConfig, season);
    if (p) payloads.push(p);
  }
  let created = 0;
  let pushSent = 0;
  for (const payload of payloads) {
    const row = await insertIfNew(admin, userId, payload);
    if (!row) continue;
    created++;
    if (config.firebase && fcmToken) {
      const n = await sendPushForNotification(
        admin,
        config.firebase,
        fcmToken,
        userId,
        row.id,
        payload.title,
        payload.body,
        payload.data?.deepLink ?? "/dashboard"
      );
      pushSent += n;
    }
  }
  return { created, pushSent };
}
async function runScheduledNotificationDigest(config) {
  const now = config.now ?? /* @__PURE__ */ new Date();
  const admin = createClient(config.supabaseUrl, config.serviceRoleKey);
  const { data: profiles, error } = await admin.from("profiles").select(
    "id, location, notifications_enabled, planting_tips_enabled, weekend_tasks_enabled, weather_alerts_enabled, notifications_timezone"
  ).eq("notifications_enabled", true);
  if (error) throw new Error(error.message);
  let fcmToken = null;
  if (config.firebase) {
    try {
      fcmToken = await getFcmAccessToken(config.firebase);
    } catch (e) {
      return {
        usersChecked: 0,
        notificationsCreated: 0,
        pushSent: 0,
        errors: [e instanceof Error ? e.message : String(e)]
      };
    }
  }
  const result = {
    usersChecked: profiles?.length ?? 0,
    notificationsCreated: 0,
    pushSent: 0,
    errors: []
  };
  for (const profile of profiles ?? []) {
    try {
      const { created, pushSent } = await processUser(
        admin,
        profile.id,
        profile,
        config,
        fcmToken,
        now
      );
      result.notificationsCreated += created;
      result.pushSent += pushSent;
    } catch (e) {
      result.errors.push(
        `${profile.id}: ${e instanceof Error ? e.message : String(e)}`
      );
    }
  }
  return result;
}
export {
  runScheduledNotificationDigest
};
