import { PropertyType } from '@prisma/client';
import { Exclude, Expose } from 'class-transformer';

export class HomeResponseDTO {
  id: number;
  address: string;

  @Exclude()
  number_of_bedrooms: number;
  @Expose({ name: 'numberOfBedrooms' })
  numberOfBedrooms() {
    return this.number_of_bedrooms;
  }

  @Exclude()
  number_of_bathrooms: number;
  @Expose({ name: 'numberOfBathrooms' })
  numberOfBathrooms() {
    return this.number_of_bathrooms;
  }

  city: string;
  listedDate: Date;
  price: number;

  @Exclude()
  land_size: number;
  @Expose({ name: 'landSize' })
  landSize() {
    return this.land_size;
  }

  propertyType: PropertyType;

  @Exclude()
  created_at: Date;
  @Exclude()
  updated_at: Date;

  realtor_id: number;

  @Exclude()
  images: { url: string }[];

  @Expose({ name: 'image' })
  getImage() {
    return this.images[0]?.url ?? null;
  }

  constructor(partial: Partial<HomeResponseDTO>) {
    Object.assign(this, partial);
  }
}

export type HomeFilters = {
  city?: string;
  minPrice?: number;
  maxPrice?: number;
  propertyType?: string;
};
