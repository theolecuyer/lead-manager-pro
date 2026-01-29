import { defineBackend } from '@aws-amplify/backend';
import { testFunction } from './test-function/resource';
import { auth } from './auth/resource';
import { data } from './data/resource';

defineBackend({
  auth,
  // data, Using self-managed AppSync API
  testFunction,
});
