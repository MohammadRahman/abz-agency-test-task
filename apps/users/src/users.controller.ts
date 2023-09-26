import {
  Body,
  Controller,
  DefaultValuePipe,
  FileTypeValidator,
  Get,
  MaxFileSizeValidator,
  Param,
  ParseFilePipe,
  Post,
  Query,
  Req,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { TokenMiddleware } from '@app/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { IsOptional } from 'class-validator';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post('seeder')
  async runSeeder() {
    return await this.usersService.uploadExampleData();
  }
  @Get('token')
  async getToken() {
    return await this.usersService.generateToken();
  }
  @UseGuards(TokenMiddleware)
  @UseInterceptors(FileInterceptor('file'))
  @Post('create')
  async createUser(
    @Body() userDto: CreateUserDto,
    @Req() req: Request,
    @UploadedFile(
      new ParseFilePipe({
        validators: [
          new MaxFileSizeValidator({ maxSize: 5 * 1024 * 1024 }),
          new FileTypeValidator({ fileType: 'image/jpeg' }),
        ],
      }),
    )
    file: Express.Multer.File,
  ) {
    return await this.usersService.create(userDto, req, file);
  }
  @Get('')
  async getUser(
    @Query('limit') limit: string,
    @Query('afterId') afterId?: number,
  ) {
    // Parse limit as a number
    const parsedLimit = parseInt(limit);
    if (!limit) {
      return {
        hasNext: true,
        users: [],
      };
    }
    // if (isNaN(parsedLimit)) {
    //   // Handle invalid limit value, for example, set a default limit
    //   return await this.usersService.getUser(10, afterId);
    // }
    return await this.usersService.getUser(parsedLimit, afterId);
  }
}
