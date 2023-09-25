import {
  IsAlpha,
  IsEmail,
  IsNotEmpty,
  IsString,
  Matches,
} from 'class-validator';

export class CreateUsersDto {
  @IsEmail()
  @IsNotEmpty()
  @IsString()
  email: string;

  @IsNotEmpty()
  password: string;

  @IsNotEmpty()
  @IsString()
  @IsAlpha()
  full_name: string;

  @IsNotEmpty()
  @IsString()
  // @Matches(/\d{3}[\.]?\d{3}[\.]?\d{3}[\-]?\d{2}/)
  cpf: string;

  @IsNotEmpty()
  @IsString()
  phone_number: string;
}
