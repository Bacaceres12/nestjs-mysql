import { UsuarioEntity } from "src/usuario/usuario.entity";
import { Column, Entity, ManyToMany, PrimaryGeneratedColumn } from "typeorm";
import { RolNombre } from "./rol.enum";
@Entity({name: 'rol'})
export class RolEntity{

    @PrimaryGeneratedColumn('increment')
    id: number;
    
    @Column({type: 'varchar', length: 10, nullable: false, unique: true})
    rolNombre: RolNombre;
    
    @ManyToMany(type => UsuarioEntity, usuario => usuario.roles)
    usuarios: UsuarioEntity[];

    
}