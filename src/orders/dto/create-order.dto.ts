import { IsArray, IsNotEmpty, IsString } from 'class-validator';

type orderItems = {
  id: string;
  quantity: number;
};

export class CreateOrderDto {
  @IsNotEmpty()
  @IsString()
  user: string;

  @IsNotEmpty()
  @IsArray()
  products: orderItems[];
}
