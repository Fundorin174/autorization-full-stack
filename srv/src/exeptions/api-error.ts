export default class ApiError extends Error {
  status;
  errors;

  constructor(status: number  , message: string, errors = []) {
    super(message);
    this.status = status;
    this.errors = errors;
  }

  static UnautorizedError(){
    return new ApiError(401, 'User not Autorized')
  }

  static BadRequest(message: string, errors = []){
    return new ApiError(400, message, errors)
  }
}