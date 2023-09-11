import { IsNotEmpty, IsOptional, } from 'class-validator';
import { IsNotBlank } from 'src/decorators/is-not-blank.decorator';

export class TramitesDto{
    
   
    numerosd?: string;
    @IsNotEmpty()
    cc?: number;
   @IsNotBlank({message: 'nombre del solicitante no puede estar vacio'})
    nombre?: string;
    @IsNotBlank({message: 'la jornada no puede estar vacio'})
    jornada?: string;
    @IsNotBlank({message: ' la carrera no puede estar vacio'})
    carrera?: string;
    @IsNotBlank({message: 'el tipo de solicitud no puede estar vacio'})
    tiposol?: string;
    @IsNotBlank({message: 'la fecha no puede estar vacio'})
    fecha?: Date;
    @IsOptional({ groups: ['someGroup'] })
    @IsNotBlank({ groups: ['someGroup'] }) 
    asignatura?: string;
    @IsOptional({ groups: ['someGroup'] })
    motivo?: string;
    @IsNotBlank({message: 'Seleccione en que semestre va por favor'})
    semestre?: string;

}