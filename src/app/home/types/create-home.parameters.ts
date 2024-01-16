import { PropertyType } from '@prisma/client';

export type CreateHomeParameters = {
  address: string;
  city: string;
  landSize: number;
  numberOfBathrooms: number;
  numberOfBedrooms: number;
  price: number;
  propertyType: PropertyType;
  images: Array<Record<'url', string>>;
};
