//Error con status HTTP: el errorMiddleware lo convierte en la respuesta
const httpError = (status, message) => Object.assign(new Error(message), { status })

//Valida el body contra un esquema {campo: 'texto' | 'entero'} y regresa solo esos campos.
//parcial = true acepta que falten campos (para PUT)
const validar = (datos = {}, esquema, parcial = false) => {
    const limpio = {}
    for (const [campo, tipo] of Object.entries(esquema)) {
        const valor = datos[campo]
        if (valor === undefined && parcial) continue
        const ok = tipo === 'entero'
            ? Number.isInteger(valor) && valor >= 0
            : typeof valor === 'string' && valor.trim() !== ''
        if (!ok) throw httpError(400, `Dato faltante o inválido: ${campo} (${tipo})`)
        limpio[campo] = valor
    }
    return limpio
}

module.exports = { httpError, validar }
