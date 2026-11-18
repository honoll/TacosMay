// El pedido de tacos a domicilio, sin pantalla, en el orden del flujo de referencia (Toks; docs/diseno/domicilio.md):
// cómo lo quieres (a domicilio o recoger) y dónde → menú → tu orden → pagar → confirmación y seguimiento,
// más el historial de pedidos de prueba. La página (domicilio.js) solo pinta este estado. Se guarda en
// localStorage para que una recarga no pierda nada. Habla con el reparto solo por reparto.js.
import { pedidoDe, guiso, MAX_POR_GUISO, MAX_NOTA } from './menu.js';
import { abierta, estadoEnBarra, PASOS_BARRA } from './sucursales.js';

const CLAVE = 'tm_domicilio';
const CLAVE_PEDIDOS = 'tm_domicilio_pedidos';
const MAX_HISTORIAL = 20;
export const PROPINAS = [0, 10, 15, 20]; // por ciento del subtotal; la elige el cliente
const VACIO = () => ({
  vista: 'modo', modo: null, sucursal: null, destino: null, cotizacion: null, problema: null,
  cantidades: {}, notas: {}, contacto: { nombre: '', telefono: '', correo: '' },
  propina_pct: 0, pago: 'al_recibir', horario: 'ahora', pedido: null,
});
const leer = (almacen, clave, defecto) => { try { return JSON.parse(almacen?.getItem(clave)) ?? defecto; } catch { return defecto; } };
const final = (paso) => paso === 'entregado' || paso === 'cancelado';

export function flujo(reparto, almacen = globalThis.localStorage, reloj = () => Date.now()) {
  let s = { ...VACIO(), ...leer(almacen, CLAVE, {}) };
  let pedidos = leer(almacen, CLAVE_PEDIDOS, []);
  const guardar = () => {
    try { almacen?.setItem(CLAVE, JSON.stringify(s)); almacen?.setItem(CLAVE_PEDIDOS, JSON.stringify(pedidos)); } catch { /* sin almacenamiento: sigue en memoria */ }
  };
  const pedido = () => pedidoDe(s.cantidades, s.notas);
  const enCurso = () => Boolean(s.pedido && !final(s.pedido.ultimo));
  const listoParaMenu = () => (s.modo === 'domicilio' ? Boolean(s.cotizacion) : s.modo === 'recoger' && Boolean(s.sucursal));
  const anotar = (cambios) => {
    pedidos = pedidos.map((p) => (p.numero === s.pedido?.numero ? { ...p, ...cambios } : p));
  };

  function cuentas() {
    const { subtotal_centavos: subtotal, piezas } = pedido();
    const envio = s.modo === 'domicilio' ? s.cotizacion?.envio_centavos ?? null : 0;
    const propina = Math.round(subtotal * s.propina_pct / 100);
    // Cuota de servicio: concepto por definir con la taquería (PENDIENTE-CLIENTE); no suma.
    return { piezas, subtotal, envio, cuota: null, propina, total: subtotal + (envio ?? 0) + propina };
  }

  return {
    get estado() { return s; },
    pedido,
    cuentas,
    listoParaMenu,
    enCurso,
    get pedidos() { return pedidos; },

    // ---------- 1 · Cómo lo quieres y dónde ----------
    elegirModo(modo) {
      if (enCurso() || !['domicilio', 'recoger'].includes(modo) || modo === s.modo) return;
      s.modo = modo;
      s.problema = null;
      s.cotizacion = null;
      s.sucursal = null;
      guardar();
    },
    async cotizar(destino) {
      if (s.modo !== 'domicilio') return null;
      s.destino = destino;
      s.problema = null;
      s.cotizacion = null;
      if (!abierta()) s.problema = 'cerrado';
      else {
        const r = await reparto.cotizar(destino);
        if (r.ok) { s.cotizacion = r; s.sucursal = 'centro'; } else s.problema = r.motivo;
      }
      guardar();
      return s.cotizacion ?? { ok: false, motivo: s.problema };
    },
    elegirSucursal(id) {
      if (s.modo !== 'recoger') return;
      s.problema = abierta() ? null : 'cerrado';
      s.sucursal = s.problema ? null : id;
      guardar();
    },

    // ---------- Ir de una vista a otra (con sus candados) ----------
    ir(vista) {
      if (enCurso() && vista !== 'seguimiento') return;
      if (vista === 'menu' && !listoParaMenu()) return;
      if (vista === 'pagar' && (!listoParaMenu() || !pedido().piezas)) return;
      if (vista === 'seguimiento' && !s.pedido) return;
      s.vista = vista;
      if (vista !== 'modo') s.problema = null;
      guardar();
    },

    // ---------- 2 y 3 · Menú, detalle del taco y tu orden ----------
    poner(id, cantidad, nota = '') {
      if (enCurso() || !guiso(id)) return;
      const n = Math.max(0, Math.min(MAX_POR_GUISO, Math.trunc(cantidad) || 0));
      s.cantidades = { ...s.cantidades, [id]: n };
      s.notas = { ...s.notas, [id]: String(nota).trim().slice(0, MAX_NOTA) };
      if (!n) { delete s.cantidades[id]; delete s.notas[id]; }
      guardar();
    },
    cambiar(id, delta) { this.poner(id, (s.cantidades[id] ?? 0) + delta, s.notas[id]); },
    quitar(id) { this.poner(id, 0); },
    propina(pct) {
      if (!PROPINAS.includes(pct) || enCurso()) return;
      s.propina_pct = pct;
      guardar();
    },

    // ---------- 4 · Pagar: contacto, horario, propina y pago. Crea el pedido ----------
    async confirmar({ contacto, pago = 'al_recibir', horario = 'ahora' }) {
      if (pago !== 'al_recibir') throw new Error('El pago en línea está por conectar.');
      if (horario !== 'ahora') throw new Error('Programar la hora está por conectar.');
      if (!pedido().piezas || !listoParaMenu()) throw new Error('Falta armar el pedido.');
      if (!contacto?.nombre?.trim() || !/^\d{10}$/.test(contacto?.telefono ?? '')) throw new Error('Faltan tu nombre y un teléfono de 10 dígitos.');
      s.contacto = { nombre: contacto.nombre.trim(), telefono: contacto.telefono, correo: (contacto.correo ?? '').trim() };
      s.pago = pago;
      s.problema = null;
      if (!abierta()) { s.problema = 'cerrado'; guardar(); return { ok: false, motivo: 'cerrado' }; }
      const ahora = reloj();
      const items = pedido().items;
      const numero = `TM-${String(ahora).slice(-5)}`;
      let entrega = null;
      if (s.modo === 'domicilio') {
        // La cotización vence: si ya venció se pide otra y, si cambió el envío, se enseña antes de pedir.
        if (ahora > s.cotizacion.vence) {
          const antes = s.cotizacion.envio_centavos;
          const r = await reparto.cotizar(s.destino);
          if (!r.ok) { s.cotizacion = null; s.problema = r.motivo; s.vista = 'modo'; guardar(); return r; }
          s.cotizacion = r;
          if (r.envio_centavos !== antes) { s.problema = 'envio_cambio'; guardar(); return { ok: false, motivo: 'envio_cambio' }; }
        }
        entrega = await reparto.crearEntrega({ pedidoId: numero, cotizacion: s.cotizacion, destino: s.destino, contacto: s.contacto, items });
        if (!entrega.ok) { s.problema = entrega.motivo === 'cotizacion_vencida' ? 'envio_cambio' : 'error'; guardar(); return entrega; }
      }
      const c = cuentas();
      s.pedido = { numero, creado: ahora, modo: s.modo, sucursal: s.sucursal, items, cuentas: c, entregaId: entrega?.entregaId ?? null, seguimiento: entrega?.seguimiento ?? null, recogido: false, cancelado: false, ultimo: 'recibido' };
      pedidos = [{ numero, creado: ahora, modo: s.modo, piezas: c.piezas, total_centavos: c.total, items, estado: 'recibido' }, ...pedidos].slice(0, MAX_HISTORIAL);
      s.vista = 'seguimiento';
      guardar();
      return { ok: true, numero };
    },

    // ---------- 5 · Seguimiento ----------
    async seguir() {
      const p = s.pedido;
      if (!p) return null;
      let e;
      if (p.cancelado) e = { paso: 'cancelado', indice: -1, llega: null, repartidor: null };
      else if (p.modo === 'domicilio') e = await reparto.estado(p.entregaId);
      else e = { ...estadoEnBarra(p.creado, reloj(), p.recogido), llega: p.creado + 15 * 60 * 1000, repartidor: null };
      const pasos = p.modo === 'domicilio' ? reparto.PASOS : [...PASOS_BARRA.map(([paso]) => paso), 'entregado'];
      if (e.paso !== p.ultimo) { p.ultimo = e.paso; anotar({ estado: e.paso }); guardar(); }
      return { ...e, pasos, cancelable: e.paso === 'recibido' };
    },
    async recogido() {
      if (s.pedido?.modo !== 'recoger' || s.pedido.cancelado) return;
      s.pedido.recogido = true;
      await this.seguir();
    },
    // Se puede cancelar mientras la cocina no empieza (después ya hay tacos servidos y, a domicilio, el
    // proveedor puede negarse o cobrar). Dice por qué no cuando no se puede.
    async cancelar() {
      const e = await this.seguir();
      if (!e || final(e.paso)) return { ok: false, motivo: 'terminado' };
      if (!e.cancelable) return { ok: false, motivo: 'ya_empezo' };
      if (s.pedido.modo === 'domicilio') {
        const r = await reparto.cancelar(s.pedido.entregaId);
        if (!r.ok) return r;
      }
      s.pedido.cancelado = true;
      await this.seguir();
      return { ok: true };
    },

    // ---------- Otro pedido y el historial ----------
    nuevo() {
      if (enCurso()) return;
      const { modo, sucursal, destino, cotizacion, contacto } = s;
      s = { ...VACIO(), modo, sucursal, destino, cotizacion, contacto };
      s.vista = listoParaMenu() ? 'menu' : 'modo';
      guardar();
    },
    repetir(numero) {
      const anterior = pedidos.find((p) => p.numero === numero);
      if (!anterior || enCurso()) return;
      this.nuevo();
      for (const i of anterior.items) if (guiso(i.id)) this.poner(i.id, i.cantidad, i.nota);
      s.vista = listoParaMenu() ? 'orden' : 'modo';
      guardar();
    },
    // La entrega de prueba en curso se cancela y todo vuelve al principio (también el historial).
    async reiniciar() {
      if (s.pedido?.entregaId && !final(s.pedido.ultimo)) await reparto.cancelar(s.pedido.entregaId);
      s = VACIO();
      pedidos = [];
      guardar();
    },
  };
}
