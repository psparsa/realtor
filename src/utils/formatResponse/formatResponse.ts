export type formatErrorResponseProperties = {
  message: string;
  errors?: Array<{
    message: string;
    field?: string;
  }>;
};

export const formatErrorResponse = (data: formatErrorResponseProperties) =>
  data;

export type formatSuccessResponseProperties<T> = {
  message?: string;
  data: T;
};

export const formatSuccessResponse = <T>(
  data: formatSuccessResponseProperties<T>,
) => data;
