import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { AuditLogService } from '../audit-log.service';

interface AuditLogConfig {
  action: string;
  entity: string;
}

@Injectable()
export class AuditLogInterceptor implements NestInterceptor {
  constructor(
    private readonly auditLogService: AuditLogService,
    private readonly config: AuditLogConfig,
  ) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const request = context.switchToHttp().getRequest();
    const { method, _url, body, user, ip, headers } = request;
    const userAgent = headers['user-agent'];

    // 获取请求参数中的实体ID
    const entityId = this.extractEntityId(request);

    // 记录请求前的数据状态（如果有的话）
    const oldValues = method !== 'GET' && method !== 'POST' ? body : null;

    return next.handle().pipe(
      tap(async (_data) => {
        try {
          // 记录审计日志
          await this.auditLogService.create({
            action: this.config.action,
            entity: this.config.entity,
            entityId,
            oldValues,
            newValues: method === 'POST' || method === 'PUT' ? body : null,
            userId: user?.id,
            ip,
            userAgent,
          });
        } catch (error) {
          // 记录日志失败不应影响主流程
          console.error('Failed to log audit entry:', error);
        }
      }),
    );
  }

  private extractEntityId(request: any): string {
    // 尝试从URL参数中提取ID
    if (request.params && request.params.id) {
      return request.params.id;
    }

    // 尝试从请求体中提取ID
    if (request.body && request.body.id) {
      return request.body.id;
    }

    // 尝试从查询参数中提取ID
    if (request.query && request.query.id) {
      return request.query.id;
    }

    return null;
  }
}

/**
 * 创建审计日志拦截器的工厂函数
 */
export function createAuditLogInterceptor(
  auditLogService: AuditLogService,
  config: AuditLogConfig,
): AuditLogInterceptor {
  return new AuditLogInterceptor(auditLogService, config);
}
