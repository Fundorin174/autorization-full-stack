export default class ApiError extends Error {
  status;
  errors;

  constructor(status: number  , message: string, errors: any[] = []) {
    super(message);
    this.status = status;
    this.errors = errors;
  }

  static UnautorizedError(){
    return new ApiError(401, 'User not Authorized')
  }

  static BadRequest(message: string, errors:any[] = []){
    return new ApiError(400, message, errors)
  }
}