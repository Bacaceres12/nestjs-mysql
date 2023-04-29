import { IsEmail, IsString, MaxLength } from "class-validator";
import { IsNotBlank } from "src/decorators/is-not-blank.decorator";

export class UpdateUsuarioDto {
    @IsString()
    @MaxLength(10, { message: 'nombre: longitud maxima de 10' })
    nombre: string;
  
    @IsEmail()
    correo: string;
  
    @IsNotBlank({ message: 'Este campo esta vacio' })
    tel: string;
  
    @IsNotBlank({ message: 'Por favor complete este campo' })
    jornada: string;
  
    @IsNotBlank({ message: 'Por favor Seleccione el programa cursando' })
    programa: string;


  }