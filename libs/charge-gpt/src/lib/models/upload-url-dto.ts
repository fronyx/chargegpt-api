import { ApiProperty } from '@nestjs/swagger';

export class UploadUrlResponseDto {
  @ApiProperty({ example: 'https://charge-gpt-assets.url' })
  url: string;

  @ApiProperty({ example: '577f35dd-86a1-4992-ac55-5bc5e249a521' })
  fileId: string;

  @ApiProperty({ example: '2.0.0' })
  versionNumber: string;
}
