import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import _ from 'lodash';

// enums
import { RequestWithUser } from 'src/interfaces';
import { EUserRole } from 'src/enums';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const roles = this.reflector.get<EUserRole[]>(
      'roles',
      context.getHandler(),
    );
    if (!roles) {
      return true;
    }
    const request = context.switchToHttp().getRequest<RequestWithUser>();

    return !!_.intersection(request.user.roles, roles).length;
  }
}
