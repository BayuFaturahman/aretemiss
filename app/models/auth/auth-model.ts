import { Instance, SnapshotOut, types } from "mobx-state-tree"

/**
 * Rick and Morty character model.
 */
export const AuthModel = types.model("AuthUser").props({
  id: types.string,
  name: types.maybe(types.string),
  email: types.maybe(types.string),
  phoneNumber: types.maybe(types.string),
  isVerify: types.maybe(types.boolean),
  createdAt: types.maybe(types.string),
  updatedAt: types.maybe(types.string),
  token: types.maybe(types.string),
  otp: types.maybeNull(types.number),
  otpHash: types.maybe(types.string),
  needChangePassword: types.maybe(types.boolean)
})

type AuthUserType = Instance<typeof AuthModel>
export interface AuthUser extends AuthUserType {}
type AuthSnapshotType = SnapshotOut<typeof AuthModel>
export interface AuthSnapshot extends AuthSnapshotType {}
export const createAuthDefaultModel = () => types.optional(AuthModel, {})
