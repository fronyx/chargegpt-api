import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class SpeechToTextResponseDto {
  @ApiProperty({ example: true })
  isSuccessful: boolean;

  @ApiProperty({ example: 'I want to charge my car near KFC in Berlin.' })
  text: string;

  @ApiPropertyOptional({ example: 'https://polly-audio.url' })
  audioUrl: string;

  @ApiPropertyOptional({ example: '2.0.0' })
  versionNumber: string;
}
