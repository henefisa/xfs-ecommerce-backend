import { Request } from 'express';

// entities
import { User } from 'src/entities';

export interface RequestWithUser extends Request {
  user: User;
}
