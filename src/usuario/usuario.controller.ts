import { CreateUsuarioDto } from './dto/create-usuario.dto';
import { UsuarioService } from './usuario.service';
import { Body, Controller, Get, Post, UsePipes, ValidationPipe, Put, Param, InternalServerErrorException, HttpException, UploadedFile, UseInterceptors, Req } from '@nestjs/common';
import { UpdateUsuarioDto } from './dto/update-usuario.dto';
import { AsignarRolesDto } from './dto/asignar-roles.dto';
import { UsuarioEntity } from './usuario.entity';
import { Express } from 'express';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';

@Controller('usuario')
export class UsuarioController {

    constructor(private readonly usuarioService: UsuarioService) {}

    @Get()
    getAll() {
        return this.usuarioService.getall();
    }

    @UsePipes(new ValidationPipe({whitelist: true}))
    @Post()
    create(@Body() dto: CreateUsuarioDto) {
        return this.usuarioService.create(dto);
    }

    @Put(':id')
    @UsePipes(new ValidationPipe({ whitelist: true }))
    edit(@Param('id') id: number, @Body() dto: UpdateUsuarioDto) {
       return this.usuarioService.edit(id, dto);
}


@Put(':id/roles')
async asignarRol(@Param('id') id: number, @Body() dto: AsignarRolesDto): Promise<{ message: string, usuario: UsuarioEntity }>{
  try {
    const usuario = await this.usuarioService.asignarRol(id, dto)
    return { message: 'Roles asignados correctamente', usuario };
  } catch (error) {
    if (error instanceof HttpException) {
      throw error;
    } else {
      throw new InternalServerErrorException('No se pudieron asignar los roles al usuario');
    }
  }
}

@Post(':id/foto')
@UseInterceptors(
    FileInterceptor('foto', {
        storage: diskStorage({
            destination: './uploads', // Carpeta donde se guardarán las imágenes
            filename: (req, file, callback) => {
                // Genera un nombre único para la imagen
                const randomName = Array(32)
                    .fill(null)
                    .map(() => Math.round(Math.random() * 16).toString(16))
                    .join('');
                // Obtiene la extensión del archivo original
                const extension = extname(file.originalname);
                // Llama al callback con el nombre de archivo único
                callback(null, `${randomName}${extension}`);
            },
        }),
    })
)
async uploadFoto(
    @Param('id') id: number,
    @UploadedFile() file: Express.Multer.File // Corregir el tipo de la variable "file"
): Promise<string> { // Cambiar el tipo de retorno a string
    return this.usuarioService.uploadFoto(id, file);
}


}