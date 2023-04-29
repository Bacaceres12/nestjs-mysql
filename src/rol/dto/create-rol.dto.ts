import { IsEnum } from "class-validator";
import { RolNombre } from "../rol.enum";

export class CreateRolDto{

    @IsEnum(RolNombre, {message: 'el rol solo es para el uso de admin, usuario y director'})
    rolNombre: string;
}