import { TramitesEntity } from './tramites.entity';
import { EntityRepository, Repository } from 'typeorm';

@EntityRepository(TramitesEntity)
export class TramitesRepository extends Repository<TramitesEntity>{}
