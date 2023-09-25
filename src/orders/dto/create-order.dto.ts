import { IsNotEmpty } from 'class-validator';

type orderItems = {
  productId: number;
  quantity: number;
};

export class CreateOrderDto {
  @IsNotEmpty()
  userId: number;
  items: orderItems[];
}
