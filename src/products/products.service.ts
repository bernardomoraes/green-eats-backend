import { Injectable } from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class ProductsService {
  constructor(private prisma: PrismaService) {}
  create(createProductDto: CreateProductDto) {
    return this.prisma.products.create({
      data: createProductDto,
    });
  }

  findAll() {
    return this.prisma.products.findMany();
  }

  findOne(id: number) {
    return this.prisma.products.findUniqueOrThrow({
      where: { id },
    });
  }

  update(id: number, updateProductDto: UpdateProductDto) {
    return this.prisma.products.update({
      where: { id },
      data: updateProductDto,
    });
  }

  remove(id: number) {
    return this.prisma.products.delete({
      where: { id },
    });
  }
}
