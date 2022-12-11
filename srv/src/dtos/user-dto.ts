import { User } from "models";

class UserDto {
  id;
  email;
  isActivated;
  name;
  surname;

  constructor (model: User) {
    this.id = model.id;
    this.email = model.email;
    this.isActivated = model.isActivated;
    this.name = model.name;
    this.surname = model.surname;
  }
}

export default UserDto ;