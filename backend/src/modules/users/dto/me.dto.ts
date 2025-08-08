//DTO for the me endpoint

import { ApiProperty } from '@nestjs/swagger';

export class MeResponse {
  @ApiProperty({
    description: 'The id of the user',
    example: '1',
  })
  id: string;

  @ApiProperty({
    description: 'The name of the user',
    example: 'John Doe',
  })
  name: string;

  @ApiProperty({
    description: 'The email of the user',
    example: 'john.doe@example.com',
  })
  email: string;

  @ApiProperty({
    description: 'The created at date of the user',
    example: '2021-01-01',
  })
  createdAt: Date;

  @ApiProperty({
    description: 'The updated at date of the user',
    example: '2021-01-01',
  })
  updatedAt: Date;
}
