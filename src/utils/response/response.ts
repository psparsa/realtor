export type ErrorResponseProperties = {
  message: string;
  errors?: Array<{
    message: string;
    field?: string;
  }>;
};

export const errorResponse = (data: ErrorResponseProperties) => data;

export type SuccessResponseProperties<T> = {
  message?: string;
  data: T;
};

export const successResponse = <T>(data: SuccessResponseProperties<T>) => data;
