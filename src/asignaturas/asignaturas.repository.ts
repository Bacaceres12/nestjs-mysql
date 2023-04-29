import { AsignaturaEntity } from './asignaturas.entity';
import { EntityRepository, Repository } from 'typeorm';

@EntityRepository(AsignaturaEntity)
export class AsignaturasRespository extends Repository<AsignaturaEntity>{}
