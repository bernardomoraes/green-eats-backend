import { IsEmail, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateUsersDto {
  @IsEmail()
  @IsNotEmpty()
  @IsString()
  email: string;

  @IsNotEmpty()
  password: string;

  @IsNotEmpty()
  @IsString()
  name: string;

  @IsNotEmpty()
  @IsString()
  // @Matches(/\d{3}[\.]?\d{3}[\.]?\d{3}[\-]?\d{2}/)
  document: string;

  @IsString()
  @IsOptional()
  phone_number?: string;
}
