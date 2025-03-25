import { PartialType } from '@nestjs/swagger';
import { CreateProjectTimelineDto } from './create-project-timeline.dto';

export class UpdateProjectTimelineDto extends PartialType(
  CreateProjectTimelineDto,
) {}
