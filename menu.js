let usuarios = JSON.parse(localStorage.getItem("usuarios")) || [];
let usuarioActivo = null;

let respuesta = Number(prompt("1. Iniciar Sección\n 2. Registrarse\n  "))

switch (respuesta) {
    case 1: inicio(); break;

    case 2: registrase(); break;

    default: console.log("Ingrese un valor valido");
}

function registrase() {
    let id = prompt(" Ingrese idetificación ")
    let user = prompt("Ingrese usuario")
    let email = prompt("Ingrese correo ")
    let password = prompt("Ingrese clave")
    let password2 = prompt("Vuelva a ingresar la clave")

    if (password === password2) {
        const newUser = { id: id, user: user, email: email, password: password, saldo: 0, movimientos: [] };
        usuarios.push(newUser);
        localStorage.setItem("usuarios", JSON.stringify(usuarios));
        console.log("Te has registrado exitosamente !");
    } else {
        console.log("Contrasña no coinciden");
    }
}


function inicio() {

    let intentos = 0;

    let acceso = false;


    while (intentos < 3) {

        console.log(" intento " + (intentos + 1) + " de 3 ");


        let user = prompt("Ingrese usuario");
        let password = prompt("Ingrese clave");

        let usuarioEncontrado = usuarios.find(usuario => usuario.user === user);

        if (usuarioEncontrado) {

            if (usuarioEncontrado.password === password) {

                console.log("Inicio de sesion exitoso");
                acceso = true;
                usuarioActivo = usuarioEncontrado
                menuTransacciones();
                break;


            } else {

                console.log("Contraseña incorrecta");
            }
        } else {

            console.log("El usuario no existe");
        }

        intentos++;

    }

    if (acceso === false) {

        console.log("Cuenta bloqueada por 24 horas, comunicate con tu banco");

    }
}
function menuTransacciones() {
    let continuar = true;

    while (continuar) {
        let consultaMovimientos = Number(prompt("1. Retirar\n 2.Consultar Saldo\n  3. Consignar\n 4. Consultar Movimientos\n 5. Salir\n "));

        switch (consultaMovimientos) {
            case 1: retirar(); break;
            case 2: saldo(); break;
            case 3: consignar(); break;
            case 4: movimientos(); break;
            case 5:
                console.log("Sesión finalizada. ¡Gracias por usar Mi Plata!");
                continuar = false;
                break;
        }
    }
}
function retirar() {
    if (usuarioActivo.saldo > 0) {
        let solicitudRetirar = Number(prompt("¿Cuánto desea retirar?"));

        if (solicitudRetirar <= usuarioActivo.saldo) {
            usuarioActivo.saldo = usuarioActivo.saldo - solicitudRetirar;
            usuarioActivo.movimientos.push({ fecha: new Date().toLocaleString(), tipo: "Retiro",
             valor: solicitudRetirar, saldo: usuarioActivo.saldo });
            localStorage.setItem("usuarios", JSON.stringify(usuarios));
            console.log(`Has retirado ${solicitudRetirar}. Tu nuevo saldo es ${usuarioActivo.saldo}`);
        } else {
            console.log("Saldo insuficiente");
        }
    } else {
        console.log("No tienes saldo disponible para retirar");
    }
}

function consignar() {
    let solicitudConsignar = Number(prompt(" Ingrese valor a consignar "))
    if (solicitudConsignar > 0) {
        usuarioActivo.saldo = usuarioActivo.saldo + solicitudConsignar
        usuarioActivo.movimientos.push({ fecha: new Date().toLocaleString(), tipo: "Consignación", 
        valor: solicitudConsignar, saldo: usuarioActivo.saldo });
        localStorage.setItem("usuarios", JSON.stringify(usuarios));
        console.log(`Has consignado exitosamente ${solicitudConsignar}. Tu nuevo saldo es ${usuarioActivo.saldo}`);

    } else {
        console.log("Valor no valido");
    }
}

function saldo() {
    console.log(`Tu saldo actual es ${usuarioActivo.saldo}`);
}

function movimientos(){
     if (usuarioActivo.movimientos.length === 0) {
    console.log(" Aún no tiene movimientos ");
    return;
}
     console.log(` *** HISTORIAL DE MOVIMIENTOS ***`);
    for(let i=0; i < usuarioActivo.movimientos.length; i ++){
        let registro = usuarioActivo.movimientos[i];
        console.log(`
         FECHA Y HORA --> ${registro.fecha}
         CONCEPTO ------> ${registro.tipo}  
         VALOR ---------> ${registro.valor}
         SALDO ---------> ${registro.saldo}`);

        

    }
}