import { ConflictException } from '@nestjs/common';

export default class AlreadyUsedException extends ConflictException {
  constructor(type: string, value: string) {
    super(`${type} ${value} is already used!`);
  }
}
