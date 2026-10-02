type Props = { kind?: 'hero' | 'dky' | 'kitchen' | 'kanban' | 'zofloridane' | 'glamour'; className?: string };
export default function Sketch({ kind = 'hero', className = '' }: Props) {
  const label = { hero: 'Boceto a lápiz de una página web y una aplicación móvil', dky: 'Esquema dibujado de una tienda de joyería', kitchen: 'Esquema dibujado de las pantallas de Kitchen Cabinet', zofloridane: 'Boceto de una tienda de comestibles con entrega a domicilio en Cuba', glamour: 'Boceto de una web de reservas para un salón de uñas', kanban: 'Tablero Kanban dibujado con notas de tareas' }[kind];
  return <svg className={`sketch-art ${className}`} viewBox="0 0 520 440" role="img" aria-label={label}>
    <g className="sketch-lines" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
      {kind === 'hero' && <>
        <path className="pencil-draw" pathLength="1" d="m64 76 350-8 5 223-356 9Z" /><path className="pencil-draw" pathLength="1" d="m60 79 351-7 4 224-345 8Z" opacity=".3" />
        <path className="pencil-draw" pathLength="1" d="m65 107 350-7M87 91h23m16-1h12m19 0h13m17-1h16M87 139h136v84H87Z" />
        <path className="pencil-draw" pathLength="1" d="m98 212 35-40 28 27 22-29 28 39M244 143h140m-140 18h111m-111 17h132m-132 18h74M92 252h107m48-4h96m-98 17h72" />
        <path className="pencil-draw" pathLength="1" d="m292 259 117 6-12 161-117-9Z" fill="var(--paper)" /><path className="pencil-draw" pathLength="1" d="m298 273 104 7M293 303h105m-93 12h37m-40 26h78m-79 14h57m-59 32h71" />
        <path className="pencil-draw" pathLength="1" d="m296 327 32 1v35h-35m56-34 35 1-1 35h-37M322 408h34" />
        <path className="pencil-draw" pathLength="1" d="M429 138q68 47 37 155m-7-18 5 23 23-10M103 315q-37 50 78 76m-20-19 26 21-30 5" />
        <path className="pencil-draw" pathLength="1" d="m63 354-17 8m11-23-5-14m29 25 12-6M410 333l17 3m-9-17 3-11M236 51l6-11 6 11-6 10Z" />
      </>}
      {kind === 'dky' && <>
        <path className="pencil-draw" pathLength="1" d="m37 60 446 4-5 313-447-4Z" fill="var(--paper)" /><path className="pencil-draw" pathLength="1" d="m34 57 451 6-4 316-451-5Z" opacity=".25" />
        <path className="pencil-draw" pathLength="1" d="m39 97 440 4M57 77h76m204 5h30m17 0h35M61 126h159v135H61Z" fill="var(--project-wash)" />
        <path className="pencil-draw" pathLength="1" d="M133 159q-39 9-39 42t43 40q37-9 37-42t-41-40Z" strokeWidth="4" />
        <path className="pencil-draw" pathLength="1" d="m132 157-15-17 15-18 16 18-16 17m-11-13h24m-13-21v31M250 134h187m-186 21h124m-124 20h167m-166 51h100m-100 20h81M64 291h114m28 0h112m24 0h112M64 307h86m61 0h82m49 0h90" />
        <path className="pencil-draw" pathLength="1" d="m250 191 81 1 1 17-83-1Z" fill="var(--highlight)" />
        <path className="pencil-draw" pathLength="1" d="M134 394q59 20 95-4m-14-7 19 5-9 17M474 190l15-3m-12-9 2-8" />
      </>}
      {kind === 'zofloridane' && <>
        <path className="pencil-draw" pathLength="1" d="m37 60 446 4-5 313-447-4Z" fill="var(--paper)" /><path className="pencil-draw" pathLength="1" d="m34 57 451 6-4 316-451-5Z" opacity=".25" />
        <path className="pencil-draw" pathLength="1" d="m39 97 440 4M57 79h62M152 70h118q9 0 9 9t-9 9H152q-9 0-9-9t9-9ZM160 75q0-5 5-5t5 5q0 4-5 9-5-5-5-9ZM182 79h70M412 72h9l7 17h24l6-13h-33M431 96a2.5 2.5 0 1 0 .1 0M449 96a2.5 2.5 0 1 0 .1 0" />
        <path className="pencil-draw" pathLength="1" d="m57 114 406 2-1 72-405-2Z" fill="var(--project-wash)" />
        <path className="pencil-draw" pathLength="1" d="M75 134h178M75 151h122m-121 15 72 1-1 14-72-1Z" fill="var(--highlight)" />
        <path className="pencil-draw" pathLength="1" d="m57 204 85 1-1 95-84-1ZM158 205h85l1 95-86-1ZM259 204l85 2-1 94-84-1ZM360 205h85v95l-86-1Z" />
        <path className="pencil-draw" pathLength="1" d="M93 222h12v6l6 7v39H87v-39l6-7ZM87 248h24M181 240q20-9 42 0l-4 36h-34ZM187 240q15 7 30 0M285 230h34v44h-34ZM285 239h34M285 265h34M381 236h45l-4 38h-37ZM392 236v-8h23v8M66 289h38m56 0h40m61 0h38m62 0h40" />
        <path className="pencil-draw" pathLength="1" d="M48 401a13 13 0 1 0 26 0a13 13 0 1 0-26 0M48 401h26M61 388q-8 13 0 26q8-13 0-26M78 400q92 15 190 2t178-4M449 414v-17l14-11 14 11v17ZM459 414v-9h8v9M463 380q-5-6-9-2t1 9l8 6 8-6q5-5 1-9t-9 2Z" />
      </>}
      {kind === 'glamour' && <>
        <path className="pencil-draw" pathLength="1" d="m170 52 182-3 6 352-186 4Z" fill="var(--paper)" /><path className="pencil-draw" pathLength="1" d="m166 57 183-4 5 350-185 3Z" opacity=".3" />
        <path className="pencil-draw" pathLength="1" d="m182 70 160-2 1 92-160 2ZM228 128q22-24 50-11t34-6M246 112l7-7m11 2 5-9M302 100l5 5 5-5-5-5Z" fill="var(--project-wash)" />
        <path className="pencil-draw" pathLength="1" d="M184 184h70m6 0h44M184 200h118M188 214l140 1v18l-141-1Z" />
        <path className="pencil-draw" pathLength="1" d="M182 252a8 8 0 1 0 .1 0M206 252a8 8 0 1 0 .1 0M230 252a8 8 0 1 0 .1 0M278 252a8 8 0 1 0 .1 0M302 252a8 8 0 1 0 .1 0M326 252a8 8 0 1 0 .1 0" />
        <path className="pencil-draw" pathLength="1" d="M186 284h40v16h-40ZM236 284h40v16h-40ZM286 284h40v16h-40ZM186 308h40v16h-40ZM236 308h40v16h-40ZM286 308h40v16h-40ZM186 332h40v16h-40ZM236 332h40v16h-40Z" />
        <path className="pencil-draw" pathLength="1" d="m188 362 144 1v22l-145-1ZM254 244a10 10 0 1 0 .1 0" fill="var(--highlight)" />
        <path className="pencil-draw" pathLength="1" d="M404 250h28v52q0 10-14 10t-14-10ZM410 250v-18h16v18M412 232v-26h12v26M88 150l6-14 6 14-6 14ZM112 196l4-8 4 8-4 8ZM96 300q40 30 80-38m-14 6 14-6 2 15" />
      </>}
      {kind === 'kitchen' && <>
        <path className="pencil-draw" pathLength="1" d="m78 72 150-3 4 286-154 5Z" fill="var(--paper)" /><path className="pencil-draw" pathLength="1" d="m75 75 151-4 5 286-151 6Z" opacity=".35" />
        <path className="pencil-draw" pathLength="1" d="m105 90 92-2M143 344h26M94 123h120m-119 20h67M96 163h114v57H96Z" fill="var(--project-wash)" />
        <path className="pencil-draw" pathLength="1" d="M152 180q-24-11-28 8t29 19q31-2 30-16t-31-11M96 236h80m-79 15h110m-109 18h89M95 291h34m11 0h30m12 0h25" />
        <path className="pencil-draw" pathLength="1" d="m287 92 150 4-3 286-152-4Z" fill="var(--paper)" /><path className="pencil-draw" pathLength="1" d="m285 97 150 3-1 281-153-3Z" opacity=".3" />
        <path className="pencil-draw" pathLength="1" d="M310 114h100M340 367h24M303 147h117m-117 18h58M306 190h12v13h-12Zm25 6h82M304 227h12v13h-12Zm26 6h75M304 264h12v13h-12Zm26 6h84M304 303h12v13h-12Zm26 6h69" />
        <path className="pencil-draw" pathLength="1" d="m308 231 4 5 10-13m-17 84 6 5 10-13M244 193q25-30 40-35m-19 0 23-6-10 21" />
      </>}
      {kind === 'kanban' && <>
        <path className="pencil-draw" pathLength="1" d="m30 63 451-4 9 298-460 5Z" fill="var(--paper)" /><path className="pencil-draw" pathLength="1" d="m27 66 456-3 5 301-460 1Z" opacity=".3" />
        <path className="pencil-draw" pathLength="1" d="M32 103h453M54 85h103m142-1h55m35 0h69M179 120l-1 220m150-221 1 220M53 136h71m72 0h65m87 0h66" />
        <path className="pencil-draw" pathLength="1" d="m49 156 109 2-1 73-110-2Z" fill="#eadcaf" /><path className="pencil-draw" pathLength="1" d="m48 245 110-3 2 73-109 3Z" fill="#e4d5c5" />
        <path className="pencil-draw" pathLength="1" d="m193 163 114-4 2 91-115 1Z" fill="#ced9c7" /><path className="pencil-draw" pathLength="1" d="m347 160 116 1-1 73-113 1Z" fill="#e7d5c1" />
        <path className="pencil-draw" pathLength="1" d="M60 177h82m-81 13h61m-60 23h28M66 263h76m-75 13h59m-59 22h24M210 180h78m-80 13h64m-64 16h70m-68 24h32M361 178h84m-84 13h61m-61 23h25M250 288q47 23 87-11m-23-1 26-2-12 22M421 288l9 10 22-24" />
      </>}
    </g>
    <g className="sketch-labels" fill="var(--pencil)">
      {kind === 'hero' && <><text x="57" y="43" transform="rotate(-4 57 43)">hacerlo claro ↓</text><text x="93" y="427" transform="rotate(-4 93 427)">de la idea a la pantalla</text></>}
      {kind === 'dky' && <><text x="64" y="39">una tienda que funciona</text><text x="243" y="408" transform="rotate(-3 243 408)">el producto, primero ↗</text></>}
      {kind === 'glamour' && <><text x="150" y="36">reservar sin llamadas</text><text x="40" y="426" transform="rotate(-3 40 426)">su agenda, en orden ↗</text></>}
      {kind === 'zofloridane' && <><text x="64" y="39">comprar desde lejos, entregar cerca</text><text x="128" y="433" transform="rotate(-2 128 433)">del carrito a su puerta ↗</text></>}
      {kind === 'kitchen' && <><text x="64" y="43">recetas</text><text x="302" y="66">lista de la compra</text><text x="158" y="414" transform="rotate(-3 158 414)">un poco de orden para cocinar</text></>}
      {kind === 'kanban' && <><text x="45" y="40">Por hacer</text><text x="201" y="39">En marcha</text><text x="369" y="37">¡Hecho!</text><text x="70" y="412" transform="rotate(-3 70 412)">cada idea tiene su lugar.</text></>}
    </g>
  </svg>;
}
export function PencilArrow({ className = '' }: { className?: string }) {
  return <svg className={`pencil-arrow ${className}`} viewBox="0 0 120 70" fill="none" aria-hidden="true"><path className="pencil-draw" pathLength="1" d="M7 8q-7 46 96 37m-23-11 26 11-22 16" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" /></svg>;
}


