import { Types } from "mongoose";
import { UnauthorizedError } from "../libraries/errors/unauthorizedError.js";
import {translate} from "../libraries/requestContext.js"
import { USER_NOT_AUTHORIZED_ADMIN } from "../constants.js";
import type { InterfaceUserFamily } from "../models/userFamily.js";
import { User } from "../models/User.js";
/**
 * If the current user is an admin of the organization, this function returns `true` otherwise it returns `false`.
 * @remarks
 * This is a utility method.
 * @param userId - Current user id.
 * @param userFamily - userFamily data of `InterfaceuserFamily` type.
 * @returns `True` or `False`.
 */
export const adminCheck = async (
  userId: string | Types.ObjectId,
  userFamily: InterfaceUserFamily,
): Promise<void> => {
  const userIsUserFamilyAdmin = userFamily.admins.some(
    (admin) => admin === userId || Types.ObjectId(admin).equals(userId),
  );

  const user = await User.findOne({
    _id: userId,
  });
  const isUserSuperAdmin: boolean = user
    ? user.userType === "SUPERADMIN"
    : false;

  if (!userIsUserFamilyAdmin && !isUserSuperAdmin) {
    throw new UnauthorizedError(
      translate(`${USER_NOT_AUTHORIZED_ADMIN.MESSAGE}`),
      USER_NOT_AUTHORIZED_ADMIN.CODE,
      USER_NOT_AUTHORIZED_ADMIN.PARAM,
    );
  }
};