export * from './audit-log.module';
export * from './audit-log.service';
export * from './audit-log.controller';
export { AuditLog as AuditLogEntity } from './entities/audit-log.entity';
// 问题解决方法：将实体导出重命名为 AuditLogEntity，避免与装饰器名称冲突。
// 维护原始设计意图：实体类和装饰器在各自文件中的命名可能都有其合理性，通过导出时重命名可以同时保留两者的设计意图
export * from './dto/create-audit-log.dto';
export * from './dto/query-audit-log.dto';
export * from './interceptors/audit-log.interceptor';
export * from './decorators/audit-log.decorator';
