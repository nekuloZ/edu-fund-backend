import { applyDecorators, UseInterceptors } from '@nestjs/common';
import { createAuditLogInterceptor } from '../interceptors/audit-log.interceptor';
import { AuditLogService } from '../audit-log.service';

interface AuditLogOptions {
  action: string;
  entity: string;
}

/**
 * 审计日志装饰器，用于自动记录操作日志
 * @param auditLogService 审计日志服务实例
 * @param options 日志选项
 */
export function AuditLog(
  auditLogService: AuditLogService,
  options: AuditLogOptions,
) {
  return applyDecorators(
    UseInterceptors(createAuditLogInterceptor(auditLogService, options)),
  );
}
