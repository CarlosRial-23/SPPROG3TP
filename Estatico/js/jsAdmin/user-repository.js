const crypto = require('crypto');
const bcrypt = require('bcrypt');
const SALT_ROUNDS = process.env.SALT_ROUNDS;
const user = require('../../../Modelo/userModelo.js') //****moverlo despues a la carpeta de MODELO.

class Validation{
    static username(username){
        if (typeof username != 'string') throw new Error('El nombre de usuario tiene que ser un String');
        if (username.length < 3) throw new Error('El nombre de usuario tiene que tener como minimo 3 caracteres');
    }

    static email(email){
        if(typeof email != 'string' || !email.includes('@')){throw new Error ('Email invalido')}}
        
    static password(password){
        if (typeof password != 'string') throw new Error('Error de password');
        if (password.length < 5) throw new Error('Error de password');
    }

    static rol(rol){
        const rolesPermitidos = ['admin', 'user'];
        if(!rolesPermitidos.includes(rol)) throw new Error('Rol invalido. Debe ser admin o user')
    }
}


//tengo que tener el modelo del usuario que importo.
export class UserRepository{
    //Crear un usuario
    static async create({email, name, password, rol}){
        Validation.email(email);
        Validation.username(name);
        Validation.password(password);
        Validation.rol(rol);
        const nuevoUsuario = await user.findOne({where: {email: email}});
        if(nuevoUsuario) throw new Error ('El usuario ya se encuentra registrado');

        const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS);

        return await user.create({
            email: email,
            name: name,
            password: hashedPassword,
            rol: rol,
        })
    }

    static async login({email, password}){
        Validation.email(email);
        Validation.password(password);
        const usuarioRegistrado = await user.findOne({where: {email: email}});
        if(!usuarioRegistrado) throw new Error('El usuario no existe en la BD');

        const passwordValido = await bcrypt.compare(password, usuarioRegistrado.password);
        if(!passwordValido) throw new Error('El password es invalido');

        //convierto a JSON porque estaba trabajando eon el modelo de Sequelize
        const {password: _, ...usuarioPublico} = usuarioRegistrado.toJSON();
        return usuarioPublico;
    }
}




