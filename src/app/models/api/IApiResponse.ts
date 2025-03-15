export interface IApiResponse<T> {
  success: boolean,
  message?: string,
  error?: string,
  data: T
}
