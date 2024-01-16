import { PropertyType } from '@prisma/client';

export type UpdateHomeParameters = {
  address?: string;
  city?: string;
  landSize?: number;
  numberOfBathrooms?: number;
  numberOfBedrooms?: number;
  price?: number;
  propertyType?: PropertyType;
};
