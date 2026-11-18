// La página del proyecto escolar (proyecto/index.html) es estática: solo pone la cuenta y el carrito en la
// cabecera, al llegar y cada vez que se vuelve a ella sin recargar (js/paginas.js).
import { iniciarCabecera } from './cabecera.js';

iniciarCabecera();
addEventListener('tm:pagina', () => { if (location.pathname.startsWith('/proyecto/')) iniciarCabecera(); });
