import { GraphqlContext } from '../server.js';
import * as AppError from '../../types/appErrors.types.js';

export const requireAdmin = (user: GraphqlContext['user']) => {
  const allowedRoles = ['admin', 'moderator'];
  if (!user!.role || !allowedRoles.includes(user!.role.toLowerCase())) {
    throw new AppError.ForbiddenError("You don't have permissions to perform this operation");
  }
};
