let usuarios = [];

const usuariosGuardados = localStorage.getItem("usuarios");

// Esta parta es para asegurarnos de que e
if (usuariosGuardados !== null) {
    usuarios = JSON.parse(usuariosGuardados); // Se convierte el texto guardado en un objeto / array con JSON.parse();
}

// Pedir datos
function registrar() {
    let usuario = prompt("Inserte su nombre de usuario")
    let identificacion = prompt("Inserte su identificacion")
    let correo = prompt("Inserte correo electrónico")
    let clave = prompt("Inserte una clave")
    let repetirClave = prompt("Repita la misma clave")

    while (clave !== repetirClave) {
        console.log("Las claves no coinciden")
        repetirClave = prompt("La claves no coinciden, repita nuevamente la clave")
    }

    let saldoInicial = Number(prompt("Ingrese su saldo inicial"))

        while (isNaN(saldoInicial) || saldoInicial < 0) {
        console.log("El saldo debe ser un número mayor o igual a 0")
        saldoInicial = Number(prompt("Digite un valor mayor o igual a 0. Ingrese nuevamente su saldo inicial"))
        }

    let existe = false

        for (let i = 0; i < usuarios.length; i++) {

            if (usuarios[i].usuario === usuario || usuarios[i].identificacion === identificacion) {
                existe = true
            }
        }  
    
        if (existe) {
            console.log("El usuario o la identificación ya existe")
        } else {
            let nuevoUsuario={
            usuario: usuario,
            identificacion: identificacion,
            correo: correo,
            clave: clave,
            saldo: saldoInicial,
            movimientos: [],
            bloqueadoHasta: null
            }

        usuarios.push(nuevoUsuario)

        localStorage.setItem("usuarios", JSON.stringify(usuarios))
        }

}

// Pedir datos para iniciar sesión
function iniciar() {
    let intentos = 0
    let acceso = false
    let usuarioEncontrado = null

    let usuario = prompt("Inserte su nombre de usuario")

    if (usuario === null) {
        return
    }

    let existe = false

    for (let i = 0; i < usuarios.length; i++) {

        if (usuarios[i].usuario === usuario) {
            existe = true
            usuarioEncontrado = usuarios[i]
        }
    }

    if (existe) {
        console.log("Usuario encontrado")

        if (usuarioEncontrado.bloqueadoHasta !== null) {

            let fechaActual = new Date()
            let fechaBloqueo = new Date(usuarioEncontrado.bloqueadoHasta)

            if (fechaActual < fechaBloqueo) {
                console.log("Este usuario está bloqueado por 24 horas, comunicate con tu banco")
                return
            } else {
                usuarioEncontrado.bloqueadoHasta = null
                localStorage.setItem("usuarios", JSON.stringify(usuarios))
            }
        }

        while (intentos < 3 && acceso === false) {

            let clave = prompt("Inserte clave de acceso")

            if (clave === null) {
                break
            }

            if (usuarioEncontrado.clave === clave) {
                console.log(`Bienvenido ${usuarioEncontrado.usuario}`)
                acceso = true

                transacciones(usuarioEncontrado)
                break

            } else {
                console.log("La contraseña no coincide")
                intentos++
                console.log(`Intento ${intentos} de 3`)

                if (intentos === 3) {
                    let fechaBloqueo = new Date()
                    fechaBloqueo.setHours(fechaBloqueo.getHours() + 24)

                    usuarioEncontrado.bloqueadoHasta = fechaBloqueo

                    localStorage.setItem("usuarios", JSON.stringify(usuarios))

                    console.log("Cuenta bloqueada por 24 horas, comunicate con tu banco")
                }
            }
        }

    } else {
        console.log("El usuario no existe")
    }
}


function transacciones(usuario) {

    let seleccion = 0

    while (seleccion !== 5) {

        seleccion = Number(prompt(`*** Seleccione una de las 5 opciones ***
            1. Retirar
            2. Consignar
            3. Consultar Saldo
            4. Consultar Movimientos
            5. Salir`
        ))

        switch (seleccion) {

            case 1:
                let cantRetirar = Number(prompt("Ingrese la cantidad a retirar"))
                
                    while (isNaN(cantRetirar) || cantRetirar <= 0 || cantRetirar > usuario.saldo) {
                        console.log("El valor a retirar debe ser mayor a 0 y no puede superar el saldo actual")
                        cantRetirar = Number(prompt("Ingrese nuevamente la cantidad a retirar"))
                    }

                    const nuevoSaldoRetiro= ((usuario.saldo) - cantRetirar)
                    usuario.saldo = nuevoSaldoRetiro
                    

                    let movimientoRetiro ={
                        fecha: new Date(),
                        concepto: "Retiro",
                        monto: cantRetirar,
                        saldo: usuario.saldo
                    }
                    
                    usuario.movimientos.push(movimientoRetiro)

                    localStorage.setItem("usuarios", JSON.stringify(usuarios))

                    console.log(`Retiro exitoso. Su nuevo saldo es ${usuario.saldo}`)

                break

            case 2:
                let cantConsignar = Number(prompt("Ingrese la cantidad a consignar"))
                
                    while (isNaN(cantConsignar) || cantConsignar <= 0) {
                        console.log("El valor a consignar debe ser mayor a 0")
                        cantConsignar = Number(prompt("Ingrese nuevamente la cantidad a consignar"))
                    }

                    const nuevoSaldoConsignado= ((usuario.saldo) + cantConsignar)
                    usuario.saldo = nuevoSaldoConsignado
                    
                    let movimientoConsignar ={
                        fecha: new Date(),
                        concepto: "Consignar",
                        monto: cantConsignar,
                        saldo: usuario.saldo
                    }
                    
                    usuario.movimientos.push(movimientoConsignar)

                    localStorage.setItem("usuarios", JSON.stringify(usuarios))

                    console.log(`Consignación exitosa. Su nuevo saldo es ${usuario.saldo}`)

                break

            case 3:
                console.log(`Su saldo actual es de ${usuario.saldo}`)

                    let movimientoConsulta ={
                        fecha: new Date(),
                        concepto: "Consulta",
                        monto: 0,
                        saldo: usuario.saldo
                    }
                    
                    usuario.movimientos.push(movimientoConsulta)

                    localStorage.setItem("usuarios", JSON.stringify(usuarios))

                break
            case 4:
                console.log(`\n      ***     Sus movimientos:     ***
                    `)

                for (let i = 0; i < usuario.movimientos.length; i++) {
                    console.log(`
                        FECHA Y HORA --> ${new Date(usuario.movimientos[i].fecha).toLocaleString()}
                        CONCEPTO ------> ${usuario.movimientos[i].concepto}
                        VALOR ---------> ${usuario.movimientos[i].monto}
                        SALDO ---------> ${usuario.movimientos[i].saldo}
                    `)

                }
                break

            case 5:
                console.log("Gracias por utilizar Mi Plata")
                break

            default:
                console.log("Opción no válida")
        }
    }
}

function menuInicio() {

    let seleccion = 0

    while (seleccion !== 3) {
        
        seleccion = Number(prompt(`--> Bienvenido a Mi Plata Ya <--
Seleccione una de las 3 opciones\n1. Iniciar\n2. Registrar\n3. Salir`))

            switch (seleccion) {
            case 1:
                iniciar()
                break
            case 2:
                registrar()
                break
            case 3:
                console.log("Gracias por utilizar Mi Plata")
                break

            default:
                console.log("Opción no valida")
        }
    }
}

menuInicio();