import { TramitesEntity } from 'src/tramites/tramites.entity';
import { UsuarioEntity } from 'src/usuario/usuario.entity';
import { Repository } from 'typeorm';
import { ConsultaEntity } from './../consulta/consulta.entity';
import { MessageDto } from './../common/message.dto';
import { TramitesDto } from './dto/tramites.dto';
import { TramitesRepository } from './tramites.repository';
import { BadRequestException, Injectable, NotFoundException} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import * as nodemailer from 'nodemailer'; // Importa nodemailer
import * as twilio from 'twilio';


@Injectable()
export class TramitesService {
   

    constructor(

        @InjectRepository(TramitesEntity)
        private tramitesRepository: TramitesRepository,
        @InjectRepository(ConsultaEntity) private consultaRepository: Repository<ConsultaEntity>,


    ) {}
    async getAll(usuario: UsuarioEntity): Promise<TramitesEntity[]> {
      if (!usuario) {
        throw new BadRequestException(new MessageDto('El usuario no ha sido proporcionado'));
      }
      const list = await this.tramitesRepository.find({
        where: { usuario: usuario},
      });
    
      return list;
    }


    async findById(idSolicitud: number, usuario: UsuarioEntity): Promise<TramitesEntity> {
        const tramites = await this.tramitesRepository.findOne({
            where: { idSolicitud: idSolicitud, usuario},
          });
        if(!tramites){
            throw new NotFoundException(new MessageDto ('no existe'));

        }
        return tramites;
    }

    async findByNumerosd(numerosd: string, usuario: UsuarioEntity): Promise<TramitesEntity> {
        const tramites = await this.tramitesRepository.findOne({
            where: { numerosd: numerosd, usuario: usuario },
          });
     return tramites;
        }
        


        async findByNombre(nombre: string, usuario: UsuarioEntity): Promise<TramitesEntity> {
            const tramites = await this.tramitesRepository.findOne({
              where: { nombre: nombre, usuario: usuario },
            });
            return tramites;
          }

        async findByJornada(jornada: string, usuario: UsuarioEntity): Promise<TramitesEntity> {
            const tramites = await this.tramitesRepository.findOne({
                where: { jornada: jornada, usuario: usuario },
              });
         return tramites;
            }

            async findByCarrera(carrera: string, usuario: UsuarioEntity) : Promise<TramitesEntity> {
                const tramites = await this.tramitesRepository.findOne({
                    where: { carrera: carrera, usuario: usuario },
                  });
             return tramites;
                }

                async findByCC(cc: number, usuario: UsuarioEntity): Promise<TramitesEntity> {
                    const tramites = await this.tramitesRepository.findOne({
                        where: { cc: cc, usuario: usuario },
                      });
                 return tramites;
                    }

                    async findByFecha(fecha: Date, usuario: UsuarioEntity): Promise<TramitesEntity> {
                        const tramites = await this.tramitesRepository.findOne({
                            where: { fecha: fecha, usuario: usuario },
                          });
                     return tramites;
                        }


                        async findByAsignatura(asignatura: string, usuario: UsuarioEntity): Promise<TramitesEntity> {
                          const tramites = await this.tramitesRepository.findOne({
                              where: { asignatura: asignatura, usuario: usuario },
                            });
                       return tramites;
                          }

                          
                        async findByMotivo(motivo: string, usuario: UsuarioEntity): Promise<TramitesEntity> {
                          const tramites = await this.tramitesRepository.findOne({
                              where: { motivo: motivo, usuario: usuario },
                            });
                       return tramites;
                          }

                          async findBySemestre(semestre: string, usuario: UsuarioEntity): Promise<TramitesEntity> {
                            const tramites = await this.tramitesRepository.findOne({
                                where: { semestre: semestre, usuario: usuario },
                              });
                         return tramites;
                            }
  
                      
                        async findByTipoSol(tiposol: string, usuario: UsuarioEntity): Promise<TramitesEntity> {
                            const tramites = await this.tramitesRepository.findOne({
                                where: { tiposol: tiposol, usuario: usuario },
                              });
                         return tramites;
                            }

                            async findOne(tramiteId: number): Promise<TramitesEntity> {
                              return this.tramitesRepository.findOne(tramiteId);
                            }

    
                            async create(dto: TramitesDto, usuario: UsuarioEntity): Promise<any> {
                              const exists = await this.findByCC(dto.cc, usuario);
                              if (exists) {
                                  throw new BadRequestException('Ese número CC ya lo tiene otro usuario');
                              }
                      
                              const tramites = this.tramitesRepository.create(dto);
                              tramites.usuario = usuario;
                              tramites.nombre = dto.nombre;
                              await this.tramitesRepository.save(tramites);
                      
                              const consulta = this.consultaRepository.create({
                                  tramitesEntity: tramites,
                                  fechaConsulta: new Date(),
                                  estado: 'En tramite',
                                  Respuesta: '',
                              });
                              await this.consultaRepository.save(consulta);
                      
                              // Enviar notificación por correo electrónico
                              const transporter = nodemailer.createTransport({
                                service: 'Gmail',
                                auth: {
                                    user: 'bryanadrank@gmail.com',
                                    pass: 'fxszwtajhlduguuk',
                                },
                                tls: {
                                    rejectUnauthorized: false // Deshabilitar la validación del certificado
                                }
                            });
                            
                            const destinatarios = [
                                'bryanadrank@gmail.com',
                                'brayanrank@gmail.com',
                      
                                // Agrega más correos electrónicos 
                            ];
                            
                            const mailOptions = {
                                from: 'bryanadrank@gmail.com',
                                to: destinatarios.join(', '), // Concatenar los correos electrónicos con una coma y un espacio
                                subject: 'Nuevo trámite creado',
                                text: `Hola Director, se ha creado un nuevo trámite en la aplicación uniajcsgit.\nEstudiante:${dto.nombre}\nCarrera:${dto.carrera}\nJornada:${dto.jornada}\nFecha de la solcitud:${dto.fecha}\nTipo de Solicitud:${dto.tiposol}`,
                            };
                            
                            await transporter.sendMail(mailOptions);
                      
                              // Enviar notificación por mensaje de texto (Twilio)
                              const client = twilio('ACd6c72172078222d60537a71e9a09f536', 'c0b8011de6bb6e6cfc14d648d17c7da7');
                      
                              const numerosTelefonicos = [
                                '+573142889518', // Número para WhatsApp
                                '+573052647122', // Otro número para SMS
                              ];
                              
                              // Enviar notificaciones a ambos números (WhatsApp y SMS)
                              for (const numero of numerosTelefonicos) {
                                await client.messages.create({
                                  body: `Hola Director, se ha creado un nuevo trámite en la aplicación uniajcsgit.\nUsuario: ${dto.nombre}\nUsuario: ${dto.carrera}\nTipo de Solicitud: ${dto.tiposol}`,
                                  from: 'whatsapp:+14155238886',
                                  to: `whatsapp:${numero}`,
                                });
                              
                                await client.messages.create({
                                  body: `Hola Director, se ha creado un nuevo trámite en la aplicación uniajcsgit.\nUsuario: ${dto.nombre}\nTipo de Solicitud: ${dto.tiposol}`,
                                  from: '+12184387458', // Número de Twilio para SMS
                                  to: numero,
                                });
                                
                              return { message: 'Trámite creado con éxito' };
                          }
                        }
                      

                   

                            async update(idSolicitud: number, dto: TramitesDto, usuario: UsuarioEntity): Promise<any>{
                                const tramites = await this.findById(idSolicitud, usuario);
                                if(!tramites) {
                                    throw new BadRequestException({message: 'ese tramite no existe'});
                                }
                                const exists = await this.findByCC(dto.cc, usuario);
                                if (exists && exists.idSolicitud !== idSolicitud) {
                                    throw new BadRequestException(new MessageDto('esa CC ya existe patron'));
                                }
                                dto.numerosd ? tramites.numerosd = dto.numerosd : tramites.numerosd = tramites.numerosd;
                                dto.nombre ? tramites.nombre = dto.nombre : tramites.nombre = tramites.nombre;
                                dto.cc ? tramites.cc = dto.cc : tramites.cc = tramites.cc;
                                dto.jornada ? tramites.jornada = dto.jornada : tramites.jornada = tramites.jornada;
                                dto.carrera ? tramites.carrera = dto.carrera : tramites.carrera = tramites.carrera;
                                dto.tiposol ? tramites.tiposol = dto.tiposol : tramites.tiposol = tramites.tiposol;
                                dto.asignatura ? tramites.asignatura = dto.asignatura : tramites.asignatura = tramites.asignatura;
                                dto.motivo ? tramites.motivo = dto.motivo : tramites.motivo = tramites.motivo;
                                dto.semestre ? tramites.semestre = dto.semestre : tramites.semestre = tramites.semestre;
                                dto.fecha ? tramites.fecha = dto.fecha : tramites.fecha = tramites.fecha;
                                tramites.usuario = usuario;
                                await this.tramitesRepository.save(tramites);
                                return new MessageDto('tramite actualizado');
                            }

      async delete(idSolicitud: number, usuario: UsuarioEntity): Promise<any>{
        const tramite = await this.findById(idSolicitud, usuario);
        const consulta = await this.consultaRepository.findOne({ where: { tramitesEntity: tramite } });
        if (consulta) {
          await this.consultaRepository.delete(consulta);
        }
        await this.tramitesRepository.delete(tramite);
        return new MessageDto('Trámite eliminado con éxito.');
      }
    }




