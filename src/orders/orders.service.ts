import { Injectable } from '@nestjs/common';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class OrdersService {
  constructor(private readonly prisma: PrismaService) {}
  create(createOrderDto: CreateOrderDto) {
    return this.prisma.orders.create({
      data: createOrderDto,
    });
  }

  findAll() {
    return this.prisma.orders.findMany();
  }

  findOne(id: number) {
    return this.prisma.orders.findUniqueOrThrow({
      where: { id },
    });
  }

  update(id: number, updateOrderDto: UpdateOrderDto) {
    return this.prisma.orders.update({
      where: { id },
      data: updateOrderDto,
    });
  }

  remove(id: number) {
    return this.prisma.orders.delete({
      where: { id },
    });
  }
}
