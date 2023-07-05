// TODO: Once your application is deployed, copy an API id here so that the frontend could interact with it
const apiId = '0mjrmiea9l'
export const apiEndpoint = `https://${apiId}.execute-api.us-east-1.amazonaws.com/dev`

export const authConfig = {
  // TODO: Create an Auth0 application and copy values from it into this map. For example:
  // domain: 'dev-nd9990-p4.us.auth0.com',
  domain: 'dev-cl086mx47plg6xzl.us.auth0.com',            // Auth0 domain
  clientId: 'L62gr0kvrB8uD2nn6psxpwYoOMU0t9f1',          // Auth0 client id
  callbackUrl: 'http://serverless-c4-todo-images-hungnn-frontend-dev.s3-website-us-east-1.amazonaws.com/callback'
}
