import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';

// enums
import { RequestWithUser } from 'src/interfaces';
import { EUserStatus } from 'src/enums';

@Injectable()
export class StatusGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const status = this.reflector.get<EUserStatus>(
      'status',
      context.getHandler(),
    );

    if (!status) {
      return true;
    }
    const request = context.switchToHttp().getRequest<RequestWithUser>();

    return request.user.status === EUserStatus.ACTIVE;
  }
}
