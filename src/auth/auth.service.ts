import { TokenDto } from './dto/token.dto';
import { UsuarioEntity } from 'src/usuario/usuario.entity';
import { BadRequestException, Injectable, InternalServerErrorException, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { MessageDto } from 'src/common/message.dto';
import { RolEntity } from 'src/rol/rol.entity';
import { RolNombre } from 'src/rol/rol.enum';
import { RolRepository } from 'src/rol/rol.repository';
import { AuthRepository } from './auth.repository';
import { LoginUsuarioDto } from './dto/login.dto';
import { NuevoUsuarioDto } from './dto/nuevo-usuario.dto';
import { PayloadInterface } from './payload.interface';
import { compare } from 'bcryptjs';
import { v4 as uuid } from 'uuid';
import * as nodemailer from 'nodemailer';
import * as bcrypt from 'bcrypt';


@Injectable()
export class AuthService {

    constructor(
        @InjectRepository(RolEntity)
        private readonly rolRepository: RolRepository,
        @InjectRepository(UsuarioEntity)
        private readonly authRepository: AuthRepository,
        private readonly jwtService: JwtService,
        ) {}

    async getall(): Promise<UsuarioEntity[]> {
        const usuarios = await this.authRepository.find();
        if(!usuarios.length) throw new NotFoundException(new MessageDto('no hay usuarios en la lista'));
        return usuarios;
    }
    
    async create(dto: NuevoUsuarioDto): Promise<any> {
        const {nombreUsuario } = dto;
        const exists = await this.authRepository.findOne({where: [{nombreUsuario: nombreUsuario}]});
        if(exists) throw new BadRequestException(new MessageDto('ese usuario ya existe'));
        const rolUser = await this.rolRepository.findOne({where: {rolNombre: RolNombre.USER}});
        if(!rolUser) throw new InternalServerErrorException(new MessageDto('los roles aún no han sido creados'));
        const user = this.authRepository.create(dto);
        user.roles = [rolUser];
        await this.authRepository.save(user);
        return new MessageDto('usuario creado');
    }
    
    async login(dto: LoginUsuarioDto): Promise<any> {
      const {nombreUsuario} = dto;
      const usuario = await this.authRepository.findOne({where: [{nombreUsuario: nombreUsuario}, {correo: nombreUsuario}]});
      if(!usuario) return new UnauthorizedException(new MessageDto('no existe el usuario'));
      const passwordOK = await compare(dto.password, usuario.password);
      if(!passwordOK) return new UnauthorizedException(new MessageDto('contraseña errónea'));
      const payload: PayloadInterface = {
          id: usuario.id,
          nombreUsuario: usuario.nombreUsuario,
          correo: usuario.correo,
          roles: usuario.roles.map(rol => rol.rolNombre as RolNombre)
      }
      const token = await this.jwtService.sign(payload);
      return {token};
  }   

        async refresh(dto: TokenDto): Promise<any>{

            const usuario = await this.jwtService.decode(dto.token);
            const payload: PayloadInterface = {
                id: usuario [`id`],
                nombreUsuario: usuario[`nombreUsuario`],
                correo: usuario[`correo`],
                roles: usuario[`roles`]
            }

            const token = await this.jwtService.sign(payload);
            return {token};
    }

    async verifyToken(token: string): Promise<PayloadInterface> {
        try {
          const payload = await this.jwtService.verifyAsync(token);
          return payload;
        } catch (e) {
          throw new UnauthorizedException(new MessageDto('Token inválido'));
        }
      }


      async recuperarContrasena(correo: string) {
        const usuario = await this.authRepository.findOne({ correo });
        if (!usuario) {
          throw new BadRequestException(new MessageDto('No existe un usuario con ese correo electrónico'));
        }
      
        const token = uuid(); // generamos un token único
        usuario.resetPasswordToken = token;
        await this.authRepository.save(usuario);
      
        const url = `http://localhost:4200/nueva-contrasena/${token}`; // URL del frontend para restablecer la contraseña
      
        const transporter = nodemailer.createTransport({
          host: 'smtp.gmail.com',
          port: 587,
          secure: false,
          auth: {
            user: 'brayanrank@gmail.com',       
            pass: 'gcgsnnwounoxrgwh'

          },
          tls: {
            rejectUnauthorized: false,
          },
        });
      
        const message = {
          from: 'brayanrank@gmail.com',
          to: usuario.correo,
          subject: 'Restablecer contraseña',
          text: `Haz clic en el siguiente enlace para restablecer tu contraseña: ${url}`,
          html: `<p>Haz clic en el siguiente enlace para restablecer tu contraseña:</p><p><a href="${url}">${url}</a></p>`,
        };
      
        transporter.sendMail(message, (error, info) => {
          if (error) {
            console.log(error);
          } else {
            console.log(`Se ha enviado un correo electrónico a ${usuario.correo} con el enlace ${url}`);
          }
        });
      }

      async actualizarContrasena(token: string, nuevaContrasena: string): Promise<any> {
        const usuario = await this.authRepository.findOne({ resetPasswordToken: token });
        console.log('usuario:', usuario);
        if (!usuario) {
            throw new BadRequestException(new MessageDto('El token de recuperación de contraseña no es válido o ha expirado.'));
        }
        
        if (usuario.resetPasswordToken !== token) {
            throw new BadRequestException(new MessageDto('El token de recuperación de contraseña no es válido o ha expirado.'));
        }
    
        const salt = await bcrypt.genSalt();
        console.log('salt:', salt);
        usuario.password = await bcrypt.hash(nuevaContrasena, salt);
        usuario.resetPasswordToken = null;
        console.log('usuario actualizado:', usuario);
        await this.authRepository.save(usuario);
        console.log('nueva contraseña:', usuario.password);
        
        return new MessageDto('Contraseña actualizada con éxito.');
    }

  }
  
