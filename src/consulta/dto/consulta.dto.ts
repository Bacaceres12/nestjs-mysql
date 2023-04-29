import { IsNotBlank } from 'src/decorators/is-not-blank.decorator';
export class ConsultaDto{
    
   
  
   @IsNotBlank({message: 'EL ESTADO'})
    estado?: string;
    @IsNotBlank({message: 'no puede estar vacio'})
    Respuesta?: string;
    @IsNotBlank({message: 'no puede estar vacio'})
    fechaConsulta?: Date;

}