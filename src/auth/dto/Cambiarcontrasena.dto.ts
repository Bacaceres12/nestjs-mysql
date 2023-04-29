import { IsEmail, IsNotEmpty, Length} from "class-validator";
import { IsNotBlank } from "src/decorators/is-not-blank.decorator";

export class CambiarcontrasenaDto{

@IsNotBlank({message: 'No puede estar vacio'})
@IsEmail()
correo: string;

@IsNotEmpty()
token: string;

@IsNotEmpty()
@Length(8, 20)
password: string;

@IsNotEmpty()
@Length(8, 20)
confirmarPassword: string;

}