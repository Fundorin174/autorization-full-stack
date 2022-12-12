import { User } from "models";

class UserDto {
  id;
  email;
  isactivated;
  name;
  surname;

  constructor (model: User) {
    this.id = model.id;
    this.email = model.email;
    this.isactivated = model.isactivated;
    this.name = model.name;
    this.surname = model.surname;
  }
}

export default UserDto ;