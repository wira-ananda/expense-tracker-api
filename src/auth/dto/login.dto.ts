import { ApiProperty } from '@nestjs/swagger';
import { IsString, MinLength } from 'class-validator';

export class LoginDto {
  @ApiProperty({
    example: 'lia@wmail.com',
    description: 'Bisa diisi email atau username',
  })
  @IsString()
  usernameOrEmail: string;

  @ApiProperty({
    example: 'apabagus',
    description: 'Password pengguna',
    minLength: 6,
  })
  @IsString()
  @MinLength(6)
  password: string;
}
