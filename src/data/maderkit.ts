import type { CustomFix, CustomPart, CustomStep, Vec3 } from "@/lib/types";

/*
 * Closet FLORENCIA, Maderkit S.A. (sold at Homecenter Colombia as Just Home Collection), read from the maker's own
 * manual M01639CL (rev. 02, 14/08/2023). 90 x 200 x 50 cm, 15 mm particleboard, 3 doors and 2 drawers.
 *
 * How it really goes together: the upper half is one hanging space with a chrome tube from side to side. A divider
 * stands on the base up to a fixed shelf (06) at mid height: left of it two loose shelves (07), right of it two
 * drawers on metal runners under the fixed shelf, two cross rails (14) under the drawers and an open compartment at
 * the bottom. Left door (11) is full height, right upper door (12) covers the hanging space over the drawers, a short
 * door (13) closes the bottom compartment. Built lying on its back, turned onto its front for the two hardboard backs
 * (joined by an H profile), stood up, then drawers, doors and the wall kit.
 *
 * Our own drawings and words. Part numbers (01..18) and fitting references are the manual's, so the guide matches
 * the printed sheet in the box.
 */

const T = 15; // board
const W = 900, H = 2000, D = 500;
const X0 = -W / 2, X1 = W / 2;
const XS = X1 - T / 2; // side centres
const XI = X1 - T; // inner faces of the sides
const ZB = -D / 2, ZF = D / 2; // back and front faces of the carcass
const ZD = ZF + T / 2 + 1; // doors and drawer fronts

const Y_BASE = 50 + T / 2; // base sits 50 mm up, on the sides
const Y_BASE_TOP = 50 + T;
const Y_TOP = H - T / 2;
const Y_TOP_UND = H - T;

const X_DIV = -45; // divider centre: 382 mm clear on the left, 472 mm on the right
const XL0 = -XI, XL1 = X_DIV - T / 2; // left bay
const XR0 = X_DIV + T / 2, XR1 = XI; // right bay
const LW = XL1 - XL0, RW = XR1 - XR0;
const XL = (XL0 + XL1) / 2, XR = (XR0 + XR1) / 2;

const Y_SHELF6 = 1100; // fixed shelf centre
const Y_DIV = (Y_BASE_TOP + (Y_SHELF6 - T / 2)) / 2;
const H_DIV = Y_SHELF6 - T / 2 - Y_BASE_TOP;

const DRW_H = 215, DRW_GAP = 5;
const Y_D15 = Y_SHELF6 - T / 2 - DRW_GAP - DRW_H / 2; // upper drawer front centre
const Y_D16 = Y_D15 - DRW_H - DRW_GAP;
const Y_RAIL = Y_D16 - DRW_H / 2 - 35; // cross rails just under the lower drawer
const RAIL_H = 60;
const Y_DOOR13 = (Y_BASE_TOP + (Y_RAIL - RAIL_H / 2)) / 2;
const H_DOOR13 = Y_RAIL - RAIL_H / 2 - Y_BASE_TOP - 4;
const Y_DOOR12 = (Y_SHELF6 + T / 2 + 4 + Y_TOP_UND) / 2;
const H_DOOR12 = Y_TOP_UND - (Y_SHELF6 + T / 2) - 8;
const Y_DOOR11 = (Y_BASE_TOP + Y_TOP_UND) / 2;
const H_DOOR11 = Y_TOP_UND - Y_BASE_TOP - 6;

const Y_TUBE = H - 110;
const SHELF7_Y = [430, 820];

// drawers: box of 15 mm sides on 400 mm runners, hardboard bottom
const DRW_BOX_W = RW - 2 * 13; // runners take 13 mm a side
const DRW_DEPTH = 400;
const DRW_SIDE_H = 150;
const Z_DRW = ZF - DRW_DEPTH / 2; // box centre

const S2 = [-1, 1] as const;
const at = (kind: CustomFix["kind"], pts: Vec3[], dir: Vec3, o: Partial<CustomFix> = {}): CustomFix => ({ kind, count: pts.length, at: pts, dir, ...o });

const SHORT = { len: 16, dia: 3.5, name: "Tornillo 6 x 5/8 (corto)" }; // 0004705
const LONG = { len: 50, dia: 3.5, name: "Tornillo 6 x 2 autoperforante (largo)" }; // 0000152
const DOWEL = { len: 30, dia: 8, name: "Tarugo 8 x 30" }; // 20030001
const CAMSCREW = { len: 34, dia: 7, name: "Perno de anclaje 15 mm" }; // 0007374 (perno)
const CAM = { len: 12, dia: 15, name: "Excentrica 15 mm" }; // 0007374 (excentrica)
const NAIL = { len: 19, dia: 1.6, name: "Puntilla de acero 3/4" }; // 20020006

function drawer(n: 15 | 16, yFront: number) {
  const yBox = yFront - DRW_H / 2 + 20 + DRW_SIDE_H / 2;
  const side = (lab: "08" | "10", x: number): CustomPart => ({ id: `${lab}${n}`, label: lab, name: lab === "08" ? "Lateral izquierdo de cajon" : "Lateral derecho de cajon", size: [T, DRW_SIDE_H, DRW_DEPTH - T], pos: [x, yBox, Z_DRW - T / 2] });
  const parts: CustomPart[] = [
    { id: `F${n}`, label: String(n), name: n === 15 ? "Frente de cajon superior" : "Frente de cajon inferior", size: [RW - 4, DRW_H, T], pos: [XR, yFront, ZD] },
    side("08", XR - DRW_BOX_W / 2 + T / 2),
    side("10", XR + DRW_BOX_W / 2 - T / 2),
    { id: `B${n}`, label: "09", name: "Trasera de cajon", size: [DRW_BOX_W - 2 * T, DRW_SIDE_H, T], pos: [XR, yBox, ZF - DRW_DEPTH + T / 2] },
    { id: `U${n}`, label: "17", name: "Fondo de cajon", size: [DRW_BOX_W, 3, DRW_DEPTH], pos: [XR, yBox - DRW_SIDE_H / 2 + 12, Z_DRW], material: "fiber" },
  ];
  return { parts, yBox };
}

const d15 = drawer(15, Y_D15);
const d16 = drawer(16, Y_D16);

export const FLORENCIA_PARTS: CustomPart[] = [
  { id: "S01", label: "01", name: "Lateral izquierdo", size: [T, H, D], pos: [-XS, H / 2, 0] },
  { id: "S02", label: "02", name: "Lateral derecho", size: [T, H, D], pos: [XS, H / 2, 0] },
  { id: "P03", label: "03", name: "Techo", size: [W - 2 * T, T, D], pos: [0, Y_TOP, 0] },
  { id: "P04", label: "04", name: "Base", size: [W - 2 * T, T, D], pos: [0, Y_BASE, 0] },
  { id: "P05", label: "05", name: "Divisor central", size: [T, H_DIV, D], pos: [X_DIV, Y_DIV, 0] },
  { id: "P06", label: "06", name: "Entrepano fijo", size: [RW, T, D], pos: [XR, Y_SHELF6, 0] },
  ...SHELF7_Y.map((y, i): CustomPart => ({ id: `P07${i}`, label: "07", name: "Entrepano movil", size: [LW - 4, T, D - 30], pos: [XL, y, -15] })),
  ...S2.map((s, i): CustomPart => ({ id: `R14${i}`, label: "14", name: "Travesano", size: [RW, RAIL_H, T], pos: [XR, Y_RAIL, s * (D / 2 - T / 2 - 10)] })),
  ...S2.map((s, i): CustomPart => ({ id: `K18${i}`, label: "18", name: "Fondo", size: [W / 2 - 2, H - 60, 3], pos: [(s * W) / 4, H / 2 + 20, ZB - 1.5], material: "fiber" })),
  { id: "TUBE", name: "Tubo cromado para colgar", size: [859, 25, 25], pos: [0, Y_TUBE, 0], shape: "cyl", material: "metal" },
  ...d15.parts,
  ...d16.parts,
  { id: "D11", label: "11", name: "Puerta izquierda", size: [LW - 4, H_DOOR11, T], pos: [XL, Y_DOOR11, ZD] },
  { id: "D12", label: "12", name: "Puerta derecha superior", size: [RW - 4, H_DOOR12, T], pos: [XR, Y_DOOR12, ZD] },
  { id: "D13", label: "13", name: "Puerta derecha inferior", size: [RW - 4, H_DOOR13, T], pos: [XR, Y_DOOR13, ZD] },
];

// fixed runners on the divider's right face and the right side's left face, one pair per drawer
const runnerY = (yBox: number) => yBox - DRW_SIDE_H / 2 + 25;
const runnerPts = (x: number) => [d15.yBox, d16.yBox].map((yb) => [x, runnerY(yb), Z_DRW] as Vec3);
const runnerScrews = (x: number) => [d15.yBox, d16.yBox].flatMap((yb) => [-150, 0, 150].map((dz) => [x, runnerY(yb), Z_DRW + dz] as Vec3));

const tubeHolder = (s: -1 | 1): CustomFix[] => [
  at("clip", [[s * XI, Y_TUBE, 0]], [s, 0, 0], { len: 30, dia: 32, name: "Soporte de tubo", on: s < 0 ? "S01" : "S02" }),
  at("screw", [-14, 14].map((dy) => [s * XI, Y_TUBE + dy, 0] as Vec3), [s, 0, 0], { ...SHORT, on: s < 0 ? "S01" : "S02" }),
];

const endDowels = (id: string, x: number, y: number, dir: Vec3, zs = [-180, 0, 180]): CustomFix => at("dowel", zs.map((z) => [x, y, z] as Vec3), dir, { ...DOWEL, on: id });

const hingeYs11 = [Y_BASE_TOP + 120, Y_DOOR11, Y_TOP_UND - 120];
const hingeYs12 = [Y_SHELF6 + 140, Y_TOP_UND - 120];
const hingeYs13 = [Y_BASE_TOP + 90, Y_RAIL - RAIL_H / 2 - 90];

const hingeOn = (ys: number[], x: number, s: -1 | 1, on: string) => at("hinge", ys.map((y) => [x, y, ZF - 40] as Vec3), [s, 0, 0], { len: 50, dia: 35, name: "Bisagra semiparche 35 mm", on });
const hingeScrews = (ys: number[], x: number, s: -1 | 1, on: string) => at("screw", ys.flatMap((y) => [-16, 16].map((dy) => [x, y + dy, ZF - 52] as Vec3)), [s, 0, 0], { ...SHORT, on });

export const FLORENCIA_STEPS: CustomStep[] = [
  {
    title: "Prepara el lateral izquierdo",
    detail: "Acuesta la pieza 01 sobre el carton de la caja, con la cara de los huecos hacia arriba. Mete los tarugos en los huecos del canto y atornilla el soporte del tubo cerca del borde de arriba, con dos tornillos cortos.",
    add: ["S01"],
    fix: [endDowels("S01", -XI, Y_BASE, [1, 0, 0]), endDowels("S01", -XI, Y_TOP, [1, 0, 0]), ...tubeHolder(-1)],
    tools: ["hammer", "screwdriver"],
    pose: "+z",
    warnings: ["floor"],
  },
  {
    title: "Correderas en el divisor",
    detail: "Separa cada corredera en dos: la parte fija va al mueble y la movil se guarda para el cajon. Atornilla dos partes fijas en la cara derecha del divisor 05, a la altura que marcan los huecos, con tres tornillos cortos cada una.",
    fix: [
      at("runner", runnerPts(X_DIV + T / 2), [1, 0, 0], { len: 400, dia: 13, name: "Corredera metalica 400 mm (parte fija)", on: "P05" }),
      at("screw", runnerScrews(X_DIV + T / 2), [1, 0, 0], { ...SHORT, on: "P05" }),
      endDowels("P05", X_DIV, Y_BASE_TOP, [0, -1, 0], [-150, 150]),
      endDowels("P05", X_DIV, Y_SHELF6 - T / 2, [0, 1, 0], [-150, 150]),
    ],
    wait: ["P05"],
    tools: ["screwdriver", "hammer"],
    pose: "+z",
  },
  {
    title: "Prepara el lateral derecho",
    detail: "Igual que el izquierdo: tarugos en el canto, el soporte del tubo arriba y las otras dos correderas fijas. Ojo: deben quedar exactamente a la misma altura que las del divisor, o los cajones no van a correr.",
    fix: [
      endDowels("S02", XI, Y_BASE, [-1, 0, 0]),
      endDowels("S02", XI, Y_TOP, [-1, 0, 0]),
      ...tubeHolder(1),
      at("runner", runnerPts(XI), [-1, 0, 0], { len: 400, dia: 13, name: "Corredera metalica 400 mm (parte fija)", on: "S02" }),
      at("screw", runnerScrews(XI), [-1, 0, 0], { ...SHORT, on: "S02" }),
    ],
    wait: ["S02"],
    tools: ["screwdriver", "hammer"],
    pose: "+z",
  },
  {
    title: "Entrepano fijo: platina y pernos",
    detail: "En el entrepano 06, tarugos en los cantos, la platina de la cerradura con dos tornillos cortos en el borde de adelante (ahi engancha la chapa del cajon de arriba) y los pernos de anclaje enroscados a mano hasta el fondo.",
    fix: [
      endDowels("P06", XR0, Y_SHELF6, [-1, 0, 0], [-150, 150]),
      at("plate", [[XR, Y_SHELF6 - T / 2, ZF - 30]], [0, -1, 0], { len: 40, dia: 20, name: "Platina de cerradura", on: "P06" }),
      at("screw", [-14, 14].map((dx) => [XR + dx, Y_SHELF6 - T / 2, ZF - 30] as Vec3), [0, -1, 0], { ...SHORT, on: "P06" }),
      at("camScrew", [-150, 150].map((z) => [XR1, Y_SHELF6, z] as Vec3), [1, 0, 0], { ...CAMSCREW, on: "P06" }),
    ],
    wait: ["P06"],
    tools: ["hammer", "screwdriver"],
    pose: "+z",
  },
  {
    title: "Excentricas en la base",
    detail: "Mete las piezas redondas en los huecos grandes de la cara de la base 04, con la flecha mirando hacia el canto. Despues se giran para apretar.",
    add: ["P04"],
    fix: [at("cam", [-1, 1].flatMap((s) => [-150, 150].map((z) => [s * (XI - 34), Y_BASE, z] as Vec3)), [0, 1, 0], { ...CAM, on: "P04" })],
    tools: ["screwdriver"],
    pose: "+z",
  },
  {
    title: "Arma la estructura acostada",
    detail: "Entre dos. Con la base en el piso, encaja el lateral izquierdo, el divisor, los dos travesanos, el entrepano fijo y el techo. Los tarugos caen en sus huecos; empuja cada pieza hasta que tope.",
    add: ["S01", "P05", "R140", "R141", "P06", "P03"],
    fix: [at("dowel", S2.map((s) => [XR0, Y_RAIL, s * (D / 2 - T / 2 - 10)] as Vec3), [-1, 0, 0], { ...DOWEL, on: "R140" })],
    people: 2,
    pose: "+z",
    warnings: ["two"],
  },
  {
    title: "Gira las excentricas",
    detail: "Con el destornillador de estrella, gira cada excentrica en el sentido de la flecha hasta que agarre el perno y la pieza quede firme.",
    fix: [at("cam", [-150, 150].map((z) => [XR1 - 34, Y_SHELF6, z] as Vec3), [0, -1, 0], { ...CAM, on: "P06" })],
    tools: ["screwdriver"],
    pose: "+z",
  },
  {
    title: "Cierra con el lateral derecho",
    detail: "Apoya el lateral 02 sobre los tarugos y los pernos, y fijalo con los tornillos largos autoperforantes: dos en la base, dos en el techo, dos en el entrepano y uno en cada travesano.",
    add: ["S02"],
    fix: [at("screw", [[XS + T / 2, Y_BASE, -150], [XS + T / 2, Y_BASE, 150], [XS + T / 2, Y_TOP, -150], [XS + T / 2, Y_TOP, 150], [XS + T / 2, Y_SHELF6, -150], [XS + T / 2, Y_SHELF6, 150], [XS + T / 2, Y_RAIL, D / 2 - T / 2 - 10], [XS + T / 2, Y_RAIL, -(D / 2 - T / 2 - 10)]], [-1, 0, 0], { ...LONG })],
    tools: ["screwdriver"],
    people: 2,
    pose: "+z",
  },
  {
    title: "Voltealo y revisa la escuadra",
    detail: "Entre dos, gira el mueble para que quede con el frente contra el piso. Mide las dos diagonales: cuando miden lo mismo esta en escuadra. Sin eso, las puertas nunca van a cerrar parejas.",
    pose: "-z",
    people: 2,
    check: "square",
    warnings: ["two", "square"],
  },
  {
    title: "Pon los fondos con el perfil H",
    detail: "Los dos fondos 18 van con la cara lisa hacia adentro. Encaja el perfil H transparente en el borde donde se juntan, en la mitad del mueble.",
    add: ["K180", "K181"],
    fix: [at("clip", [[0, H / 2 + 20, ZB - 3]], [0, 0, 1], { len: 1900, dia: 6, name: "Perfil de empalme H" })],
    pose: "-z",
  },
  {
    title: "Clava los fondos",
    detail: "Primero una puntilla en cada esquina. Despues por todo el borde cada 12 a 15 cm, sobre el techo, la base, los laterales, el divisor y el entrepano. En la union del centro, las grapas de fondo con un tornillo corto cada una.",
    fix: [
      at("nail", [...S2.flatMap((s) => Array.from({ length: 13 }, (_, k) => [s * XS, 80 + k * 150, ZB - 3] as Vec3)), ...Array.from({ length: 6 }, (_, k) => [X0 + 75 + k * 150, Y_TOP, ZB - 3] as Vec3), ...Array.from({ length: 6 }, (_, k) => [X0 + 75 + k * 150, Y_BASE, ZB - 3] as Vec3), ...Array.from({ length: 6 }, (_, k) => [X_DIV, 150 + k * 160, ZB - 3] as Vec3), ...[-150, 0, 150].map((dx) => [XR + dx, Y_SHELF6, ZB - 3] as Vec3), ...Array.from({ length: 8 }, (_, k) => [0, 150 + k * 230, ZB - 3] as Vec3)], [0, 0, 1], NAIL),
      at("plate", Array.from({ length: 8 }, (_, k) => [0, 200 + k * 220, ZB - 4] as Vec3), [0, 0, 1], { len: 30, dia: 20, name: "Grapa de fondo", on: "K180" }),
    ],
    tools: ["hammer", "screwdriver"],
    pose: "-z",
  },
  {
    title: "Deslizadores y de pie",
    detail: "Antes de levantarlo, mete los cinco deslizadores de pata en los huecos de abajo de los laterales y del divisor. Luego, entre dos, parenlo levantandolo desde el techo. No lo arrastren.",
    fix: [at("glide", [[-XS, 0, -200], [-XS, 0, 200], [XS, 0, -200], [XS, 0, 200], [X_DIV, 50, 0]], [0, 1, 0], { len: 8, dia: 40, name: "Deslizador de pata 40 mm" })],
    pose: "+y",
    people: 2,
    warnings: ["two"],
  },
  {
    title: "Tubo y entrepanos moviles",
    detail: "Encaja el tubo cromado en los dos soportes de arriba. En el lado izquierdo, cuatro soportes a presion por nivel y apoya los dos entrepanos 07. Carga maxima: 20 kg en el tubo, 5 kg por entrepano movil, 10 kg en el fijo.",
    add: ["TUBE", "P070", "P071"],
    fix: [at("pin", SHELF7_Y.flatMap((y) => [XL0, XL1].flatMap((x) => [-150, 150].map((z) => [x, y - T / 2, z] as Vec3))), [0, 1, 0], { len: 10, dia: 8, name: "Soporte de entrepano a presion" })],
  },
  {
    title: "Arma el cajon de arriba",
    detail: "En el frente 15 van los pernos de anclaje y la cerradura con sus tornillos. Tarugos en los laterales 08 y 10, excentricas en sus huecos, y encajalos al frente. Cierra atras con la pieza 09 y dos tornillos largos por lado. Gira las excentricas.",
    add: ["F15", "0815", "1015", "B15"],
    fix: [
      at("camScrew", [-1, 1].map((s) => [XR + s * (DRW_BOX_W / 2 - T / 2), d15.yBox, ZF - T] as Vec3), [0, 0, -1], { ...CAMSCREW, on: "F15" }),
      at("cam", [-1, 1].map((s) => [XR + s * (DRW_BOX_W / 2 - T / 2), d15.yBox, ZF - T - 34] as Vec3), [1, 0, 0], { ...CAM }),
      at("knob", [[XR, Y_D15 + 60, ZD + T / 2]], [0, 0, -1], { len: 20, dia: 18, name: "Cerradura de cajon", on: "F15" }),
      at("screw", [-1, 1].flatMap((s) => [-40, 40].map((dy) => [XR + s * (DRW_BOX_W / 2 - T / 2), d15.yBox + dy, ZF - DRW_DEPTH - T / 2] as Vec3)), [0, 0, 1], { ...LONG }),
    ],
    tools: ["screwdriver", "hammer"],
  },
  {
    title: "Fondo y correderas del cajon de arriba",
    detail: "Desliza el fondo 17 y fijalo por debajo con tornillos cortos. Atornilla la parte movil de cada corredera en el lateral del cajon, con la rueda hacia atras.",
    add: ["U15"],
    fix: [
      at("screw", [-120, 0, 120].map((z) => [XR, d15.yBox - DRW_SIDE_H / 2 + 8, Z_DRW + z] as Vec3), [0, 1, 0], { ...SHORT }),
      at("runner", [-1, 1].map((s) => [XR + s * (DRW_BOX_W / 2 + 1), runnerY(d15.yBox), Z_DRW] as Vec3), [1, 0, 0], { len: 400, dia: 13, name: "Corredera metalica 400 mm (parte movil)" }),
      at("screw", [-1, 1].flatMap((s) => [-150, 0, 150].map((dz) => [XR + s * (DRW_BOX_W / 2), runnerY(d15.yBox), Z_DRW + dz] as Vec3)), [1, 0, 0], { ...SHORT }),
    ],
    tools: ["screwdriver"],
  },
  {
    title: "Arma el cajon de abajo",
    detail: "Igual que el de arriba, pero sin cerradura: pernos en el frente 16, tarugos y excentricas en los laterales, trasera 09 con tornillos largos, fondo 17 y las correderas moviles.",
    add: ["F16", "0816", "1016", "B16", "U16"],
    fix: [
      at("camScrew", [-1, 1].map((s) => [XR + s * (DRW_BOX_W / 2 - T / 2), d16.yBox, ZF - T] as Vec3), [0, 0, -1], { ...CAMSCREW, on: "F16" }),
      at("cam", [-1, 1].map((s) => [XR + s * (DRW_BOX_W / 2 - T / 2), d16.yBox, ZF - T - 34] as Vec3), [1, 0, 0], { ...CAM }),
      at("screw", [-1, 1].flatMap((s) => [-40, 40].map((dy) => [XR + s * (DRW_BOX_W / 2 - T / 2), d16.yBox + dy, ZF - DRW_DEPTH - T / 2] as Vec3)), [0, 0, 1], { ...LONG }),
      at("runner", [-1, 1].map((s) => [XR + s * (DRW_BOX_W / 2 + 1), runnerY(d16.yBox), Z_DRW] as Vec3), [1, 0, 0], { len: 400, dia: 13, name: "Corredera metalica 400 mm (parte movil)" }),
    ],
    tools: ["screwdriver", "hammer"],
    from: { F16: [0, 0, 500], "0816": [0, 0, 500], "1016": [0, 0, 500], B16: [0, 0, 500], U16: [0, 0, 500] },
  },
  {
    title: "Mete los cajones",
    detail: "Apoya la corredera del cajon sobre la del mueble y empujalo hasta el fondo: debe sonar un clic. Abrelo y cierralo un par de veces. Carga maxima por cajon: 8 kg.",
    kind: "drawer",
  },
  {
    title: "Bisagras en las puertas",
    detail: "Acuesta las tres puertas boca abajo sobre el carton. Tres bisagras en la puerta izquierda (11) y dos en cada puerta derecha (12 y 13), dos tornillos cortos cada una, con el brazo hacia afuera del borde.",
    fix: [
      hingeOn(hingeYs11, XL0 + 40, -1, "D11"),
      hingeScrews(hingeYs11, XL0 + 40, -1, "D11"),
      hingeOn(hingeYs12, XR1 - 40, 1, "D12"),
      hingeScrews(hingeYs12, XR1 - 40, 1, "D12"),
      hingeOn(hingeYs13, XR1 - 40, 1, "D13"),
      hingeScrews(hingeYs13, XR1 - 40, 1, "D13"),
    ],
    wait: ["D11", "D12", "D13"],
    tools: ["screwdriver"],
    warnings: ["floor"],
  },
  {
    title: "Cuelga las puertas",
    detail: "Entre dos: uno sostiene la puerta y el otro atornilla el brazo de cada bisagra al lateral con dos tornillos cortos. La izquierda abre hacia la izquierda; las dos derechas, hacia la derecha. Ajusta los tornillos de las bisagras hasta que queden parejas.",
    add: ["D11", "D12", "D13"],
    fix: [at("screw", [...hingeYs11.map((y) => [-XI, y, ZF - 40] as Vec3), ...hingeYs12.map((y) => [XI, y, ZF - 40] as Vec3), ...hingeYs13.map((y) => [XI, y, ZF - 40] as Vec3)], [1, 0, 0], { ...SHORT })],
    from: { D11: [0, 0, 420], D12: [0, 0, 420], D13: [0, 0, 420] },
    people: 2,
    tools: ["screwdriver"],
    warnings: ["two"],
  },
  {
    title: "Manijas",
    detail: "Una manija en la puerta izquierda y otra en la derecha superior, cerca del borde que abre, con sus dos tornillos desde adentro.",
    fix: [
      at("handle", [[XL1 - 45, Y_DOOR11 - 60, ZD + T / 2], [XR0 + 45, Y_DOOR12 - 120, ZD + T / 2]], [0, 0, -1], { len: 160, dia: 12, name: "Manija 160 mm", twist: Math.PI / 2 }),
      at("screw", [[XL1 - 45, Y_DOOR11 - 60 - 64, ZD - T / 2], [XL1 - 45, Y_DOOR11 - 60 + 64, ZD - T / 2], [XR0 + 45, Y_DOOR12 - 120 - 64, ZD - T / 2], [XR0 + 45, Y_DOOR12 - 120 + 64, ZD - T / 2]], [0, 0, 1], { len: 25, dia: 4, name: "Tornillo de manija" }),
    ],
    tools: ["screwdriver"],
  },
  {
    title: "Fijalo a la pared",
    detail: "Obligatorio: un closet de dos metros se voltea si un nino se cuelga de un cajon. Marca el borde superior en la pared, taladra, mete el chazo, atornilla el angulo a la pared y despues al techo del closet.",
    fix: [
      at("plug", [[0, H - 30, ZB - 30]], [0, 0, -1], { name: "Chazo", included: true }),
      at("angle", [[0, H - 30, ZB - 8]], [0, 0, -1], { len: 40, dia: 25, name: "Angulo de anclaje", included: true }),
      at("screw", [[0, H - 30, ZB - 8]], [0, 0, -1], { len: 45, dia: 5, name: "Tornillo de pared", included: true }),
      at("screw", [[0, H - 12, ZB + 20]], [0, -1, 0], { ...SHORT }),
    ],
    tools: ["drill", "screwdriver", "pencil"],
    wall: true,
    warnings: ["wall", "tip"],
  },
];
