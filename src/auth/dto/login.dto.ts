import { IsNotBlank } from "src/decorators/is-not-blank.decorator";

export class LoginUsuarioDto{


@IsNotBlank({message: 'El nombre de usuario no debe estar vacio'})
nombreUsuario: string;

correo:string;

@IsNotBlank({message: 'La contraseña del usuario no puede estar vacia'})
password: string;

}