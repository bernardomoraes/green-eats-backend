import { IsArray, IsNumber, IsString } from 'class-validator';

export class CreateProductDto {
  @IsString()
  title: string;
  @IsString()
  image_url: string;
  @IsString()
  description: string;
  @IsNumber()
  discount: number;
  @IsNumber()
  weight: number;
  @IsNumber()
  price: number;
  @IsArray()
  categories: string[];
}
