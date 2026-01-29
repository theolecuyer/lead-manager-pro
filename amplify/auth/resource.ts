import { defineAuth } from '@aws-amplify/backend';
import { preTokenGeneration } from './pre-token-generation/resource';
import { postConfirmation } from './post-confirmation/resource';
/**
 * Define and configure your auth resource
 * @see https://docs.amplify.aws/gen2/build-a-backend/auth
 */
export const auth = defineAuth({
  loginWith: {
    email: true,
  },
  userAttributes: {
    'custom:inviteCode': {
      dataType: 'String',
      mutable: false
    }
  },
  triggers: {
    preTokenGeneration,
    postConfirmation
  }
});
