import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsString, MinLength } from 'class-validator';

export class RegisterDto {
  @ApiProperty({
    example: 'Lia',
    description: 'Username pengguna',
  })
  @IsString()
  username: string;

  @ApiProperty({
    example: 'lia@wmail.com',
    description: 'Email pengguna',
  })
  @IsEmail()
  email: string;

  @ApiProperty({
    example: 'apabagus',
    description: 'Password pengguna',
    minLength: 6,
  })
  @IsString()
  @MinLength(6)
  password: string;
}
