import { IsArray, ValidateNested, ArrayMinSize } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';
import { CreateAcademicProgressDto } from './create-academic-progress.dto';

export class BatchCreateProgressDto {
  @ApiProperty({
    description: '学业进度记录数组',
    type: [CreateAcademicProgressDto],
    example: [
      {
        studentId: 'f47ac10b-58cc-4372-a567-0e02b2c3d479',
        semester: '2023-2024学年第一学期',
        grades: [
          { subject: '数学', score: 85, ranking: 5 },
          { subject: '语文', score: 90, ranking: 3 },
        ],
        averageScore: 87.5,
        ranking: 10,
        status: 'good',
        teacherComment: '该学生学习态度认真，但需要加强数学练习。',
        assessment: '良好，建议继续保持学习热情。',
        examDate: '2023-12-25T00:00:00.000Z',
      },
    ],
  })
  @IsArray()
  @ValidateNested({ each: true })
  @ArrayMinSize(1)
  @Type(() => CreateAcademicProgressDto)
  records: CreateAcademicProgressDto[];
}
