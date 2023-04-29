import { ConsultaEntity } from './consulta.entity';
import { EntityRepository, Repository } from 'typeorm';

@EntityRepository(ConsultaEntity)
export class ConsultaRespository extends Repository<ConsultaEntity>{}