import {
  AuthenticationError,
  SchemaDirectiveVisitor,
} from "apollo-server-express";
import { defaultFieldResolver } from "graphql";
class AuthDirective extends SchemaDirectiveVisitor {
  visitFieldDefinition(field: any) {
    const { resolve = defaultFieldResolver } = field;
    field.resolve = async function (...args: any) {
      const [, , context] = args;
      if (!context || !context.user || !context.user.id) {
        throw new AuthenticationError("You must be signed in");
      }
      return resolve.apply(this, args);
    };
  }
}
export default AuthDirective;
