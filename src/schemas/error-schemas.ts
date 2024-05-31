import { ApiProperty } from '@nestjs/swagger';

class RegistrationErrorSchema {
  @ApiProperty({ type: 'string' })
  message: string;
}

export { RegistrationErrorSchema };
