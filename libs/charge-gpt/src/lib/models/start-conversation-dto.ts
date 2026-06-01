import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class StartConversationResponseDto {
  @ApiProperty({ example: '2518c990-e732-4786-aa1f-1c2d1619aa49' })
  conversationId: string;

  @ApiProperty({ example: 'assistant' })
  role: string;

  @ApiProperty({ example: 'Where and when do you want to charge?' })
  prompt: string;

  @ApiPropertyOptional({ example: 'https://polly.audio.url' })
  audioUrl: string;

  @ApiProperty({ example: false })
  isClosed: boolean;

  @ApiProperty({
    example: '2518c990-e732-4786-aa1f-1c2d1619aa49_1707390689408',
  })
  responseId: string;

  @ApiProperty({ example: '2.0.0' })
  versionNumber: string;
}
