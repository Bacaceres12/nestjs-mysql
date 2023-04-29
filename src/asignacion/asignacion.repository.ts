import { EntityRepository, Repository } from "typeorm";
import { AsignacionEntity } from "./asignacion.entity";



@EntityRepository(AsignacionEntity)
export class AsignacionRespository extends Repository<AsignacionEntity>{}
