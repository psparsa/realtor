export type GenerateErrorResponseProperties = {
  message: string;
  fields?: Record<string, string>;
};

export const generateErrorResponse = (data: GenerateErrorResponseProperties) =>
  data;
