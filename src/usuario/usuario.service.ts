import { RolEntity } from './../rol/rol.entity';
import { RolRepository } from './../rol/rol.repository';
import { CreateUsuarioDto } from './dto/create-usuario.dto';
import { MessageDto } from './../common/message.dto';
import { UsuarioRepository } from './usuario.repository';
import { UsuarioEntity } from './usuario.entity';
import { BadRequestException, HttpException, Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { RolNombre } from 'src/rol/rol.enum';
import { UpdateUsuarioDto } from './dto/update-usuario.dto';
import { AsignarRolesDto } from './dto/asignar-roles.dto';
import { createReadStream, createWriteStream } from 'fs';
import { join } from 'path';


@Injectable()
export class UsuarioService {

    constructor(
        @InjectRepository(RolEntity)
        private readonly rolRepository: RolRepository,
        @InjectRepository(UsuarioEntity)
        private readonly usuarioRepository: UsuarioRepository
    ) {}

    async getall(): Promise<UsuarioEntity[]> {
        const usuarios = await this.usuarioRepository.find();
        if(!usuarios.length) throw new NotFoundException(new MessageDto('no hay usuarios en la lista'));
        return usuarios;
    }

    async create(dto: CreateUsuarioDto): Promise<any> {
        const {nombreUsuario, correo } = dto;
        const exists = await this.usuarioRepository.findOne({where: [{nombreUsuario: nombreUsuario}, {correo: correo}]});
        if(exists) throw new BadRequestException(new MessageDto('ese usuario ya existe'));
        const rolAdmin = await this.rolRepository.findOne({where: {rolNombre: RolNombre.ADMIN}});
        const rolDirector = await this.rolRepository.findOne({where: {rolNombre: RolNombre.DIRECTOR}});
        const rolUser = await this.rolRepository.findOne({where: {rolNombre: RolNombre.USER}});
        if(!rolAdmin || !rolUser || !rolDirector) throw new InternalServerErrorException(new MessageDto('los roles aún no han sido creados'));
        const admin = this.usuarioRepository.create(dto);
        admin.roles = [rolAdmin, rolUser, rolDirector];
        await this.usuarioRepository.save(admin);
        return new MessageDto('admin creado');
    }

    async edit(id: number, dto: UpdateUsuarioDto): Promise<UsuarioEntity> {
        try {
          const usuario = await this.usuarioRepository.findOne(id);
          if (!usuario) throw new NotFoundException(new MessageDto('Usuario no encontrado'));
      
          // Actualizar los demás campos del usuario
          usuario.programa = dto.programa ?? usuario.programa;
          usuario.correo = dto.correo ?? usuario.correo;
      
          await this.usuarioRepository.save(usuario);
          return usuario;
        } catch (error) {
          throw new InternalServerErrorException(new MessageDto('No se pudo actualizar el usuario'));
        }
      }


      async asignarRol(id: number, dto: AsignarRolesDto): Promise<UsuarioEntity> {
        const usuario = await this.usuarioRepository.findOne(id, {
          relations: ['roles'],
        });
        if (!usuario) {
          throw new NotFoundException('Usuario no encontrado');
        }
      
        // Obtener los roles existentes
        const roles = await this.rolRepository.find();
        const rolesPermitidos = roles.map((r) => r.rolNombre);
      
        // Validar que los valores enviados en la solicitud sean válidos
        for (const rol of dto.roles) {
          if (!rolesPermitidos.includes(rol)) {
            throw new BadRequestException('El rol asignado es inválido');
          }
        }
      
        // Asignar los roles al usuario
        const nuevosRoles = await Promise.all(
          dto.roles.map(async (rol) => {
            const rolEntity = await this.rolRepository.findOne({
              where: { rolNombre: rol },
            });
            if (!rolEntity) {
              throw new InternalServerErrorException(
                'No se pudo asignar el rol al usuario'
              );
            }
            return rolEntity;
          })
        );
      
        usuario.roles = nuevosRoles;
        await this.usuarioRepository.save(usuario);
      
        return usuario;
      }

      async uploadFoto(id: number, file: Express.Multer.File): Promise<string> {
        const usuario = await this.usuarioRepository.findOne(id);
        if (!usuario) {
          throw new NotFoundException('Usuario no encontrado');
        }
      
        const filePath = join(__dirname, '..', 'uploads', file.filename);
        await new Promise((resolve, reject) =>
          createReadStream(file.path)
            .pipe(createWriteStream(filePath))
            .on('finish', resolve)
            .on('error', reject)
        );
      
        // Guarda solo el nombre del archivo en la entidad del usuario
        usuario.foto = file.filename;
      
        await this.usuarioRepository.save(usuario);
      
        return file.filename; // Retorna el nombre del archivo
      }
      
}