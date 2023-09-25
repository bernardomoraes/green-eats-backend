import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  HttpException,
} from '@nestjs/common';
import { OrdersService } from './orders.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';
import { CustomHTTPException } from 'src/exception/customHTTP.exception';

@Controller('orders')
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}
  @Post()
  async create(@Body() input: CreateOrderDto) {
    try {
      if (input.items?.length === 0) {
        throw new Error('You must provide at least one item');
      }

      if (input.items.some((item) => item.quantity <= 0)) {
        throw new Error('Quantity must be greater than 0');
      }

      if (input.userId === undefined) {
        throw new Error('You must provide a user id');
      }

      if (input.items.some((item) => item.productId === undefined)) {
        throw new Error('You must provide a product id');
      }
      const response = await this.ordersService.create(input);
      return response;
    } catch (error) {
      throw new HttpException(
        {
          message: error.message,
          status: error.status || 400,
        },
        error.status || 400,
      );
    }
  }

  @Get()
  findAll() {
    return this.ordersService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    try {
      return await this.ordersService.findOne(+id);
    } catch (error) {
      throw new HttpException(error.message, error.status || 400);
    }
  }

  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body() updateOrderDto: UpdateOrderDto,
  ) {
    return await this.ordersService.update(+id, updateOrderDto);
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    return await this.ordersService.remove(+id);
  }
}
