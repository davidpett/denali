/**
 *
 * This is the main module exported by Denali when it is loaded via
 * `require/import`.
 *
 * This exports convenient shortcuts to other modules within Denali.
 * Rather than having to `import Addon from 'denali/dist/lib/runtime/addon'`,
 * you can just `import { Addon } from 'denali'`.
 *
 * ## Exports
 *
 * ### `Serializer`
 *
 * Serializers are responsible for determining what data gets sent over the
 * wire, and how that data is rendered into a JSON response. Check out the
 * [guides](serializers) for details.
 *
 * ### `Errors`
 *
 * An errors module based on
 * [http-errors](https://github.com/jshttp/http-errors). Useful for
 * standardizing how you handle error responses. Check out the [guides](errors)
 * or the [http-errors docs](https://github.com/jshttp/http-errors) for details.
 *
 * @module denali
 * @main denali
 */

// Data
import { attr, hasMany, hasOne } from './data/descriptors';
import Model from './data/model';
import ORMAdapter from './data/orm-adapter';
import Serializer from './data/serializer';
import FlatSerializer from './data/serializers/flat';
import JSONAPISerializer from './data/serializers/json-api';

// Metal
import Instrumentation from './metal/instrumentation';
import mixin, { createMixin } from './metal/mixin';
import eachPrototype from './metal/each-prototype';

// Runtime
import Action from './runtime/action';
import Addon from './runtime/addon';
import Application from './runtime/application';
import Container from './runtime/container';
import Errors from './runtime/errors';
import Logger from './runtime/logger';
import Request from './runtime/request';
import Response from './runtime/response';
import Router from './runtime/router';
import Service from './runtime/service';

// Test
import appAcceptanceTest, { AppAcceptance } from './test/app-acceptance';
import BlueprintAcceptanceTest from './test/blueprint-acceptance';
import CommandAcceptanceTest from './test/command-acceptance';
import MockRequest from './test/mock-request';
import MockResponse from './test/mock-response';

export {
  attr,
  hasMany,
  hasOne,
  Model,
  ORMAdapter,
  Serializer,
  FlatSerializer,
  JSONAPISerializer,

  // Metal
  Instrumentation,
  mixin,
  createMixin,
  eachPrototype,

  // Runtime
  Action,
  Addon,
  Application,
  Container,
  Errors,
  Logger,
  Request,
  Response,
  Router,
  Service,

  // Test
  AppAcceptance,
  appAcceptanceTest,
  BlueprintAcceptanceTest,
  CommandAcceptanceTest,
  MockRequest,
  MockResponse
};
