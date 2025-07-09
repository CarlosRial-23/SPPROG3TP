const crypto = require('crypto');
const bcrypt = require('bcrypt');
const SALT_ROUNDS = 10 //Esto lo tengo que traner del ".env"
const user = require('./userModelo.js') //****moverlo despues a la carpeta de MODELO.

class Validation{
    static username(username){
        if (typeof username != 'string') throw new Error('user name must be a a string');
        if (username.length < 3) throw new Error('user name must be at least 3 characters long');
    }

    static password(password){
        if (typeof password != 'string') throw new Error('Error de password');
        if (password.length < 6) throw new Error('Error de password');
    }

    static rol(rol){
        const rolesPermitidos = ['admin', 'user'];
        if(!rolesPermitidos.includes(rol)) throw new Error('Rol invalido. Debe ser admin o user')
    }
}


//tengo que tener el modelo del usuario que importo.
export class UserRepository{
    //Crear un usuario
    static async create({usernameEmail, name, password, rol}){
        Validation.username(usernameEmail);
        Validation.username(name);
        Validation.password(password);
        Validation.rol(rol);
        const nuevoUsuario = await user.findOne({where: {email: usernameEmail}});
        if(nuevoUsuario) throw new Error ('El usuario ya se encuentra registrado');

        const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS);

        return await user.create({
            email: usernameEmail,
            name: name,
            password: hashedPassword,
            rol: rol,
        })
    }

    static async login({usernameEmail, password}){
        Validation.username(usernameEmail),
        Validation.password(password);
        const usuarioRegistrado = await user.findOne({where: {email: usernameEmail}});
        if(!usuarioRegistrado) throw new Error('El usuario no existe en la BD');

        const passwordValido = await bcrypt.compare(password, usuarioRegistrado.password);
        if(!passwordValido) throw new Error('El password es invalido');

        //convierto a JSON porque estaba trabajando eon el modelo de Sequelize
        const {password: _, ...usuarioPublico} = usuarioRegistrado.toJSON();
        return usuarioPublico;
    }


}




