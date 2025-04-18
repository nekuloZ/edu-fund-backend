// src/dashboard/dto/dashboard-stats.dto.ts
import { ApiProperty, ApiTags } from '@nestjs/swagger';

@ApiTags('仪表盘-捐赠统计')
export class DonationStatsDto {
  @ApiProperty({
    description: '总捐赠金额',
    example: 1000000,
    type: 'number',
  })
  totalAmount: number;

  @ApiProperty({
    description: '本月捐赠金额',
    example: 50000,
    type: 'number',
  })
  monthlyAmount: number;

  @ApiProperty({
    description: '捐赠笔数',
    example: 100,
    type: 'number',
  })
  totalCount: number;

  @ApiProperty({
    description: '本月捐赠笔数',
    example: 20,
    type: 'number',
  })
  monthlyCount: number;
}

@ApiTags('仪表盘-项目统计')
export class ProjectStatsDto {
  @ApiProperty({
    description: '进行中的项目数',
    example: 5,
    type: 'number',
  })
  activeCount: number;

  @ApiProperty({
    description: '已完成的项目数',
    example: 10,
    type: 'number',
  })
  completedCount: number;

  @ApiProperty({
    description: '待审核的项目数',
    example: 2,
    type: 'number',
  })
  pendingCount: number;
}

@ApiTags('仪表盘-资金统计')
export class FundStatsDto {
  @ApiProperty({
    description: '总资金池余额',
    example: 2000000,
    type: 'number',
  })
  totalBalance: number;

  @ApiProperty({
    description: '已分配资金总额',
    example: 800000,
    type: 'number',
  })
  allocatedAmount: number;

  @ApiProperty({
    description: '可用资金总额',
    example: 1200000,
    type: 'number',
  })
  availableAmount: number;
}

@ApiTags('仪表盘-学生统计')
export class StudentStatsDto {
  @ApiProperty({
    description: '总学生数',
    example: 200,
    type: 'number',
  })
  totalCount: number;

  @ApiProperty({
    description: '受资助学生数',
    example: 150,
    type: 'number',
  })
  aidedCount: number;

  @ApiProperty({
    description: '本月新增学生数',
    example: 20,
    type: 'number',
  })
  monthlyNewCount: number;
}

@ApiTags('仪表盘-总体统计')
export class DashboardStatsDto {
  @ApiProperty({
    description: '捐赠统计',
    type: DonationStatsDto,
  })
  donation: DonationStatsDto;

  @ApiProperty({
    description: '项目统计',
    type: ProjectStatsDto,
  })
  project: ProjectStatsDto;

  @ApiProperty({
    description: '资金统计',
    type: FundStatsDto,
  })
  fund: FundStatsDto;

  @ApiProperty({
    description: '学生统计',
    type: StudentStatsDto,
  })
  student: StudentStatsDto;
}
