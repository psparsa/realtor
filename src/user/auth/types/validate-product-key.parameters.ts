import { UserType } from '@prisma/client';

export type ValidateProductKeyParameters = {
  email: string;
  userType: UserType;
  productKey: string;
};
