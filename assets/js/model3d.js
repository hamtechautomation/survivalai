/* Small 3D models you can turn with a finger. A page asks for one with
   <div class="m3d" data-model="van"></div>; app.js loads this file only when such a
   placeholder exists. No libraries and no WebGL: flat-shaded shapes drawn back to front
   on a 2D canvas, so it works offline on anything. Tap a part (or its button) to read
   what it is. Turning stops for reduced motion and when the model is off screen. */
(function () {
  'use strict';
  const dot = (a, b) => a[0] * b[0] + a[1] * b[1] + a[2] * b[2];
  const sub = (a, b) => [a[0] - b[0], a[1] - b[1], a[2] - b[2]];
  const cross = (a, b) => [a[1] * b[2] - a[2] * b[1], a[2] * b[0] - a[0] * b[2], a[0] * b[1] - a[1] * b[0]];
  const unit = a => { const l = Math.hypot(a[0], a[1], a[2]) || 1; return [a[0] / l, a[1] / l, a[2] / l]; };
  const esc = t => String(t).replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));

  /* ── Shapes → polygons. y is up; boxes sit on y (their bottom). ───────────────── */
  function box(x, y, z, w, h, d) {
    const a = x - w / 2, b = x + w / 2, c = y + h, e = z - d / 2, f = z + d / 2;
    const P = [[a, y, e], [b, y, e], [b, c, e], [a, c, e], [a, y, f], [b, y, f], [b, c, f], [a, c, f]];
    return [[0, 1, 2, 3], [5, 4, 7, 6], [4, 0, 3, 7], [1, 5, 6, 2], [3, 2, 6, 7], [4, 5, 1, 0]].map(q => q.map(i => P[i]));
  }
  /* Cylinder: axis 'y' stands on y; 'x' and 'z' lie centred on (x, y, z). */
  function cyl(x, y, z, r, h, axis, n) {
    axis = axis || 'y'; n = n || 18;
    const pt = (a, t) => { const c = Math.cos(a) * r, s = Math.sin(a) * r;
      return axis === 'y' ? [x + c, y + t, z + s] : axis === 'x' ? [x - h / 2 + t, y + c, z + s] : [x + c, y + s, z - h / 2 + t]; };
    const out = [], r0 = [], r1 = [];
    for (let i = 0; i < n; i++) {
      const a0 = i / n * 2 * Math.PI, a1 = (i + 1) / n * 2 * Math.PI;
      out.push([pt(a0, 0), pt(a1, 0), pt(a1, h), pt(a0, h)]); r0.push(pt(a0, 0)); r1.push(pt(a0, h));
    }
    out.push(r0, r1); return out;
  }
  /* Gable roof, ridge along x. */
  function roof(x, y, z, w, h, d) {
    const a = x - w / 2, b = x + w / 2, e = z - d / 2, f = z + d / 2, t = y + h;
    return [[[a, y, e], [a, y, f], [a, t, z]], [[b, y, e], [b, t, z], [b, y, f]], [[a, y, e], [b, y, e], [b, t, z], [a, t, z]],
            [[a, y, f], [a, t, z], [b, t, z], [b, y, f]], [[a, y, e], [a, y, f], [b, y, f], [b, y, e]]];
  }
  /* A box whose top slopes from height t0 (at x0) to t1 (at x1): a van cab. */
  function ramp(x0, x1, y, t0, t1, z, d) {
    const e = z - d / 2, f = z + d / 2;
    const P = [[x0, y, e], [x1, y, e], [x1, t1, e], [x0, t0, e], [x0, y, f], [x1, y, f], [x1, t1, f], [x0, t0, f]];
    return [[0, 1, 2, 3], [5, 4, 7, 6], [4, 0, 3, 7], [1, 5, 6, 2], [3, 2, 6, 7], [4, 5, 1, 0]].map(q => q.map(i => P[i]));
  }
  const SHAPE = { box, cyl, roof, ramp };

  /* ── Models. Each part: name, what it is, colour, shapes, and optionally alpha (see-through),
     two (draw both sides: shells you look into) and nolabel. Units are metres. ─────────── */
  const W = '#c9ccd0', WOOD = '#9b7a4f', BLUE = '#5b9ad8', RED = '#d9534f', AMBER = '#e2b04a', DARK = '#2b2f33', STEEL = '#8f969c';
  const steps = (n, x0, dx, dy, z, d) => Array.from({ length: n }, (_, i) => ['box', x0 + i * dx, (i + 1) * dy - 0.05, z, dx, 0.05, d]);
  const MODELS = {
    van: { title: 'Campervan', dist: 9, yaw: -0.7, pitch: 0.32, parts: [
      { name: 'Living area (cut away)', info: 'The van’s body, drawn see-through. Insulation in the walls, floor and roof keeps it warm in winter and cooler in summer.', col: W, alpha: 0.13, two: 1, nolabel: 1, shapes: [['box', -0.4, 0.55, 0, 4.2, 2.0, 2.0]] },
      { name: 'Cab', info: 'Driver and passenger seats; many swivel round to become part of the living area. Thermal screens on the cab windows make the biggest difference to warmth.', col: W, alpha: 0.35, two: 1, shapes: [['ramp', 1.7, 3.0, 0.55, 2.55, 1.45, 0, 2.0]] },
      { name: 'Wheels', info: 'Check tyre pressures for the loaded weight, not the empty van. Carry a spare (or a repair kit and a 12 V inflator) and know where the jack is.', col: DARK, nolabel: 1, shapes: [['cyl', -1.6, 0.36, 0.88, 0.36, 0.26, 'z'], ['cyl', -1.6, 0.36, -0.88, 0.36, 0.26, 'z'], ['cyl', 2.3, 0.36, 0.88, 0.36, 0.26, 'z'], ['cyl', 2.3, 0.36, -0.88, 0.36, 0.26, 'z']] },
      { name: 'Solar panel', info: '100–400 W on the roof. In a UK summer 100 W makes roughly 25–30 Ah a day; in winter about a sixth of that. Charges the leisure battery through an MPPT controller.', col: '#2f4f86', shapes: [['box', -0.9, 2.58, 0, 1.7, 0.04, 1.1]] },
      { name: 'Roof vent', info: 'Open it when cooking and sleeping. It lets out water vapour and, with a fan, cools the van in summer.', col: '#e6e6e6', shapes: [['box', 0.75, 2.55, 0, 0.42, 0.12, 0.42]] },
      { name: 'Bed', info: 'A fixed bed over a “garage” gives the most storage: water tank, battery and bulky kit live underneath.', col: '#6f84ad', shapes: [['box', -1.85, 1.05, 0, 1.3, 0.22, 1.9]] },
      { name: 'Fresh water tank', info: 'Usually 40–100 L. Inside the van it is less likely to freeze. Water reaches the taps through an electric pump, so a flat battery means no running water.', col: BLUE, alpha: 0.85, shapes: [['box', -2.1, 0.6, -0.45, 0.8, 0.42, 0.75]] },
      { name: 'Leisure battery', info: 'Runs everything in the living area, separate from the engine battery. Lithium (LiFePO4) gives about 90% of its rating; lead-acid only about half.', col: AMBER, shapes: [['box', -1.5, 0.6, 0.5, 0.38, 0.25, 0.22]] },
      { name: 'Chargers and fuses', info: 'Solar controller (MPPT), battery-to-battery charger from the engine, mains charger, and a fuse for every circuit. Every positive cable is fused close to the battery.', col: STEEL, shapes: [['box', -1.25, 0.62, 0.9, 0.3, 0.35, 0.06]] },
      { name: 'Kitchen', info: 'Two-burner gas hob and sink. A pressure cooker and one-pot meals save gas and water.', col: WOOD, shapes: [['box', 0.05, 0.6, -0.7, 1.1, 0.9, 0.55]] },
      { name: 'Fridge', info: 'A 12 V compressor fridge is the biggest daily power user: about 30–40 Ah a day. Keep it full and the door shut.', col: '#ececec', shapes: [['box', -0.8, 0.6, -0.72, 0.5, 1.05, 0.55]] },
      { name: 'Gas locker', info: 'Sealed off from the living space, with a drop-out vent in its floor: bottled gas is heavier than air and drains out if it leaks. Bottles upright and strapped.', col: RED, alpha: 0.35, two: 1, shapes: [['box', 0.95, 0.6, -0.72, 0.45, 0.75, 0.5]] },
      { name: 'Gas bottle', info: 'Propane (usually red in the UK) works in frost; butane stops near freezing. Turn it off at the bottle when you are not using it.', col: '#c0392b', nolabel: 1, shapes: [['cyl', 0.95, 0.62, -0.72, 0.15, 0.6]] },
      { name: 'Grey water tank', info: 'Under the floor; collects sink and shower water. Empty it only at a campsite or service point. It fills slightly slower than you use fresh water.', col: '#7d8c7a', shapes: [['box', 0.25, 0.22, 0.3, 0.9, 0.24, 0.55]] },
      { name: 'Diesel heater', info: 'Burns a little diesel from the van’s tank under the floor and blows clean warm air inside: roughly 0.1–0.25 L an hour. Keep its exhaust clear.', col: '#cf7c3e', shapes: [['box', 1.3, 0.3, 0.55, 0.38, 0.17, 0.2]] },
      { name: 'Carbon monoxide alarm', info: 'Fit one made for leisure vehicles (BS EN 50291-2) and test it weekly. CO has no smell; it kills people in vans every year.', col: RED, shapes: [['cyl', 0.1, 2.48, 0.3, 0.08, 0.05]] }
    ] },
    bunker: { title: 'Buried shelter', dist: 10, yaw: -0.6, pitch: 0.38, parts: [
      { name: 'Earth cover', info: 'About 1 m of packed earth over the shelter cuts fallout radiation to roughly a thousandth (ten halving thicknesses of 9 cm). It also steadies the temperature.', col: '#8a6a3a', alpha: 0.13, two: 1, shapes: [['box', 0, 0, 0, 6, 3.2, 3.6]] },
      { name: 'Ground surface', info: 'The only signs above ground are the hatch, two pipes and a solar panel. Planning permission is usually needed if anything shows.', col: '#4f8a4f', alpha: 0.55, two: 1, nolabel: 1, shapes: [['box', 0, 3.2, 0, 6, 0.05, 3.6]] },
      { name: 'Shelter shell', info: 'A shape made to be buried: a round pipe or pod, a box culvert or engineered concrete. Round shapes carry the soil load around them. Never a shipping container.', col: '#d8c38e', alpha: 0.32, two: 1, shapes: [['cyl', 0, 1.2, 0, 1.0, 4.2, 'x', 24]] },
      { name: 'Floor', info: 'A flat floor laid inside the curve. Underneath it is a sump at the lowest point, with a hand pump for water that gets in.', col: WOOD, nolabel: 1, shapes: [['box', 0, 0.45, 0, 4.0, 0.05, 1.5]] },
      { name: 'Bunks', info: 'Stacked bunks along one side save floor space. Kearny’s bare minimum was about 1 m² of floor per person.', col: '#6f84ad', shapes: [['box', -0.8, 0.5, -0.45, 1.9, 0.3, 0.6], ['box', -0.8, 1.25, -0.45, 1.9, 0.08, 0.6]] },
      { name: 'Water store', info: '3–5 L per person per day for at least two weeks: for four people that is 170–280 L.', col: BLUE, shapes: [['box', 1.3, 0.5, -0.4, 0.8, 0.6, 0.55]] },
      { name: 'Food shelves', info: 'Two weeks of no-cook and low-cook food. No stove inside: hot food comes from flasks or a small electric kettle on the battery.', col: WOOD, shapes: [['box', 1.3, 0.5, 0.48, 0.8, 1.05, 0.36]] },
      { name: 'Entry shaft and hatch', info: 'A hatch that opens with weight on it, lockable from inside. A bend in the entry stops radiation streaming straight in. Have a second way out at the other end.', col: STEEL, alpha: 0.6, shapes: [['cyl', -1.7, 2.0, 0, 0.42, 1.25], ['cyl', -1.7, 3.25, 0, 0.5, 0.08]] },
      { name: 'Fresh-air intake', info: 'Air is drawn down a pipe with a hood, through a particle (HEPA) filter, by a fan that can also be worked by hand. Size it for 68 m³ an hour per person in hot weather.', col: BLUE, shapes: [['cyl', 1.75, 2.0, 0.45, 0.08, 1.8], ['cyl', 1.75, 3.8, 0.45, 0.17, 0.06]] },
      { name: 'Filter and fan', info: 'The fan pushes air in at one end so it sweeps past everyone and out the other. When it stops, CO₂ builds up: a sealed room gets stuffy within hours.', col: '#dcdcdc', shapes: [['box', 1.55, 1.65, 0.45, 0.32, 0.25, 0.3]] },
      { name: 'Exhaust and blast valve', info: 'Stale air leaves at the far end. A blast valve snaps shut against a pressure wave and reopens; it only matters near a blast.', col: RED, shapes: [['cyl', -0.8, 2.0, -0.45, 0.08, 1.8], ['box', -0.8, 3.8, -0.45, 0.22, 0.1, 0.22]] },
      { name: 'Battery and solar', info: 'Batteries inside run LED lights, the fan, a radio and phones; a small solar panel on the surface charges them. No generator, stove or candles inside.', col: AMBER, shapes: [['box', 0.4, 0.5, 0.5, 0.42, 0.26, 0.26], ['box', 0.9, 3.26, 1.25, 0.9, 0.04, 0.55]] },
      { name: 'Toilet', info: 'Bucket toilet with bags and absorbent, at the exhaust end of the air flow, with a lid.', col: '#e8e8e8', shapes: [['cyl', -1.9, 0.5, 0.35, 0.18, 0.4]] }
    ] },
    house: { title: 'House: what to find', dist: 15, yaw: -0.55, pitch: 0.3, parts: [
      { name: 'Walls (front cut away)', info: 'A typical two-storey house with the front wall removed so you can see inside.', col: '#7f8780', alpha: 0.28, two: 1, nolabel: 1, shapes: [['box', 0, 0, -2.45, 7, 5, 0.1], ['box', -3.45, 0, 0, 0.1, 5, 5], ['box', 3.45, 0, 0, 0.1, 5, 5]] },
      { name: 'Floors and roof', info: 'The loft above the top floor often holds a cold water tank.', col: '#6c625a', alpha: 0.45, two: 1, nolabel: 1, shapes: [['box', 0, -0.1, 0, 7, 0.1, 5], ['box', 0, 2.5, 0, 7, 0.12, 5], ['box', 0, 5, 0, 7, 0.08, 5], ['roof', 0, 5, 0, 7.4, 2.2, 5.4]] },
      { name: 'Stairs', info: 'The space under the stairs is a good, cool, ground-floor store for water and food.', col: WOOD, nolabel: 1, shapes: steps(8, 0.35, 0.33, 0.31, -1.9, 0.9) },
      { name: 'Water stopcock', info: 'Usually under the kitchen sink. Turn it clockwise to shut off the water for a burst pipe. Turn it off and on once a year so it doesn’t seize.', col: BLUE, shapes: [['cyl', -2.6, 0.25, -1.5, 0.09, 0.14, 'z']] },
      { name: 'Kitchen units', info: 'The kick-boards under kitchen units usually pop off, hiding a long shallow space for tins.', col: WOOD, nolabel: 1, shapes: [['box', -2.6, 0, -1.9, 1.4, 0.9, 0.6]] },
      { name: 'Fridge-freezer', info: 'In a power cut keep it shut. A full freezer stays frozen for about 48 hours; if the fridge reaches 8 °C, bin chilled food after 4 hours.', col: '#ececec', shapes: [['box', -1.45, 0, -1.9, 0.62, 1.8, 0.62]] },
      { name: 'Stored water', info: '25 L jerrycans under the stairs: heavy things on the ground floor. Tap water in clean containers keeps 6 months.', col: BLUE, shapes: [['box', 2.0, 0, -1.9, 0.3, 0.45, 0.2], ['box', 2.4, 0, -1.9, 0.3, 0.45, 0.2]] },
      { name: 'Fuse box', info: 'The consumer unit. The main switch cuts all power; tripped breakers push back up. Keep a torch hanging beside it.', col: STEEL, shapes: [['box', 3.35, 1.9, 1.2, 0.08, 0.35, 0.45]] },
      { name: 'Gas valve and meter', info: 'Lever along the pipe = on; across = off. Smell gas: valve off, no switches or flames, open windows, leave, call 0800 111 999.', col: AMBER, shapes: [['box', 3.6, 0.4, 0.4, 0.15, 0.55, 0.4]] },
      { name: 'Grab bag', info: 'One per person, by the door you leave by.', col: AMBER, shapes: [['box', 2.9, 0, 1.7, 0.35, 0.48, 0.25]] },
      { name: 'Refuge room', info: 'An inner room on the ground floor with few or no windows: for storms, chemical releases (“go in, stay in, tune in”), and, with added mass, fallout.', col: AMBER, alpha: 0.16, two: 1, shapes: [['box', -0.3, 0, 0.6, 1.8, 2.4, 1.6]] },
      { name: 'Bath', info: 'Fill it when a water outage or freeze is forecast. Use it for flushing and washing.', col: '#ececec', shapes: [['box', -2.5, 2.62, -1.75, 1.7, 0.55, 0.75]] },
      { name: 'Hot water cylinder', info: '100–200 L of drinkable water (boil or treat it). Switch off the boiler and immersion heater, let it cool, drain from the bottom tap. Combi boilers have none.', col: '#c8763a', shapes: [['cyl', -0.9, 2.62, -2.0, 0.26, 1.15]] },
      { name: 'Loft water tank', info: '100–230 L. Treat it before drinking: loft tanks collect dust and insects.', col: BLUE, alpha: 0.85, shapes: [['box', 0.6, 5.08, -1.1, 1.0, 0.6, 0.7]] },
      { name: 'Smoke and CO alarms', info: 'A smoke alarm on every floor (BS EN 14604) and a CO alarm near boilers, fires and stoves (BS EN 50291). Test monthly.', col: RED, shapes: [['cyl', 0, 2.42, 0, 0.09, 0.06], ['cyl', 0, 4.92, 0, 0.09, 0.06]] }
    ] },
    flat: { title: 'Block of flats', dist: 26, yaw: -0.6, pitch: 0.28, parts: [
      { name: 'Building (front cut away)', info: 'A four-storey block with the front removed.', col: '#7f8780', alpha: 0.22, two: 1, nolabel: 1, shapes: [['box', 0, 0, -3, 10, 12.4, 0.15], ['box', -5, 0, 0, 0.15, 12.4, 6], ['box', 5, 0, 0, 0.15, 12.4, 6]] },
      { name: 'Floors', info: 'Concrete floors spread weight well, but store heavy water near walls, not mid-room.', col: '#6c625a', alpha: 0.35, two: 1, nolabel: 1, shapes: [['box', 0, -0.1, 0, 10, 0.1, 6], ['box', 0, 3, 0, 10, 0.2, 6], ['box', 0, 6, 0, 10, 0.2, 6], ['box', 0, 9, 0, 10, 0.2, 6], ['box', 0, 12.2, 0, 10, 0.2, 6]] },
      { name: 'Protected stairwell', info: 'Your way out in a fire or power cut. Walk it to the ground now, in daylight, and know where it comes out. Keep it clear of bikes and rubbish.', col: AMBER, alpha: 0.12, two: 1, shapes: [['box', -3.4, 0, -1.2, 3.0, 12.2, 3.4]] },
      { name: 'Stairs', info: 'In a power cut everyone, including people who struggle with stairs, uses them. Neighbours who need help should be known in advance.', col: WOOD, nolabel: 1, shapes: [0, 1, 2, 3].reduce((a, k) => a.concat([['ramp', -4.7, -2.2, 3 * k, 3 * k + 0.1, 3 * k + 1.5, -2.2, 1.2], ['ramp', -2.2, -4.7, 3 * k + 1.4, 3 * k + 1.5, 3 * k + 3, -0.8, 1.2]]), []) },
      { name: 'Emergency lighting', info: 'Battery lights in the stairwell usually last about three hours. After that it’s dark: keep a torch by your front door.', col: '#f2d36b', shapes: [0, 1, 2, 3].map(k => ['box', -4.6, 3 * k + 2.4, 0.3, 0.3, 0.12, 0.12]) },
      { name: 'Fire doors', info: 'Self-closing doors hold smoke back from the stairs. Never wedge them open.', col: '#8a5a32', shapes: [0, 1, 2, 3].map(k => ['box', -1.9, 3 * k + 0.2, -0.4, 0.08, 2.1, 1.0]) },
      { name: 'Lift', info: 'Lifts stop in a power cut, and must never be used in a fire. People trapped in a lift: call the number in the car, or 999 if at risk.', col: STEEL, alpha: 0.35, two: 1, shapes: [['box', -0.6, 0, -2.0, 1.6, 12.2, 1.6], ['box', -0.6, 6.2, -2.0, 1.4, 2.2, 1.4]] },
      { name: 'Water tank and booster pumps', info: 'Taller blocks pump water up from a ground-floor tank. In a power cut the pumps stop and the top floors lose water first: fill containers as soon as the power goes.', col: BLUE, shapes: [['box', 3.3, 0, -2.0, 2.4, 1.4, 1.4]] },
      { name: 'Rising main', info: 'The pipe that carries water up the building. Know where your own flat’s stopcock is.', col: BLUE, nolabel: 1, shapes: [['cyl', 4.5, 1.4, -2.5, 0.09, 10.8]] },
      { name: 'Your flat (top floor)', info: 'Top flats stay warmer in a winter power cut and overheat in summer. Store more water the higher you live.', col: AMBER, alpha: 0.15, two: 1, shapes: [['box', 2.3, 9.2, 0.9, 4.6, 2.6, 3.6]] },
      { name: 'Water stored by the walls', info: 'Containers against walls and spread between rooms, in trays in case of leaks. Use the floor-load checker before storing a lot.', col: BLUE, shapes: [['box', 4.4, 9.2, 2.2, 0.3, 0.45, 0.25], ['box', 4.4, 9.2, 1.8, 0.3, 0.45, 0.25]] },
      { name: 'Fire action notice', info: 'Says whether your block has a “stay put” or “everyone leaves” fire strategy. Read it now.', col: '#ececec', shapes: [['box', -1.8, 1.3, 1.2, 0.05, 0.45, 0.32]] },
      { name: 'Final exit', info: 'Where the stairs lead outside. Agree a meeting point beyond it with your household.', col: '#6cc08f', shapes: [['box', -3.4, 0, 2.98, 1.2, 2.2, 0.1]] }
    ] },
    refuge: { title: 'Fallout refuge room', dist: 10, yaw: -0.65, pitch: 0.42, parts: [
      { name: 'Inner room', info: 'Ground floor, middle of the house, as few windows as possible. Every wall between you and outside cuts the radiation.', col: '#7f8780', alpha: 0.25, two: 1, nolabel: 1, shapes: [['box', 0, 0, -2, 5, 2.5, 0.12], ['box', -2.5, 0, 0, 0.12, 2.5, 4], ['box', 0, -0.08, 0, 5, 0.08, 4]] },
      { name: 'Floor above: the thin spot', info: 'Fallout dust settles on the roof, so radiation comes down through the ceiling. Load the floor above with mass, right over where you will lie, if the floor can carry it.', col: '#6c625a', alpha: 0.3, two: 1, shapes: [['box', 0, 2.5, 0, 5, 0.15, 4]] },
      { name: 'Mass overhead', info: 'Filled water containers, bags of earth or boxes of books on the floor above. 9 cm of earth or about 14 cm of water halves the radiation.', col: BLUE, alpha: 0.75, shapes: [['box', -0.2, 2.65, 0, 2.6, 0.4, 1.6]] },
      { name: 'Sturdy table: the core', info: 'A strong table (or doors laid on supports) makes a core shelter: you lie under it, and the mass goes on and around it.', col: WOOD, shapes: [['box', -0.2, 0.82, 0, 2.2, 0.08, 1.2], ['box', -1.2, 0, -0.5, 0.08, 0.82, 0.08], ['box', 0.8, 0, -0.5, 0.08, 0.82, 0.08], ['box', -1.2, 0, 0.5, 0.08, 0.82, 0.08], ['box', 0.8, 0, 0.5, 0.08, 0.82, 0.08]] },
      { name: 'Mass on the table', info: 'Books, bags of earth or sand piled on top of the core. Check the table can take it.', col: '#8a6a3a', shapes: [['box', -0.2, 0.9, 0, 2.2, 0.35, 1.2]] },
      { name: 'Bags of earth', info: 'Pillowcases or rubble sacks filled with soil, stacked against the sides of the core.', col: '#8a6a3a', shapes: [['box', -1.55, 0, 0, 0.4, 0.85, 1.5]] },
      { name: 'Boxes of books', info: 'Paper is dense: bookcases and boxes of books are good shielding you already own.', col: '#b0763c', shapes: [['box', 1.15, 0, 0, 0.4, 0.85, 1.5]] },
      { name: 'Filled water containers', info: 'Water stacked along the back of the core shields you, and is drinking water later.', col: BLUE, shapes: [['box', -0.2, 0, -0.85, 2.4, 0.85, 0.35]] },
      { name: 'Window blocked', info: 'Windows let radiation straight in. Block them with bags of earth or heavy furniture.', col: '#8a6a3a', shapes: [['box', 1.6, 0.9, -1.92, 1.2, 1.0, 0.12]] },
      { name: 'People lie low, in the core', info: 'Lying down under the table puts the most mass between you and the radiation. Come out only for short, necessary trips.', col: '#d8b48a', shapes: [['cyl', -0.2, 0.2, 0.2, 0.16, 1.5, 'x'], ['cyl', -0.2, 0.2, -0.2, 0.16, 1.5, 'x']] },
      { name: 'Water, food, radio', info: 'Two weeks of water and food within reach, and a battery radio for official advice on when to come out.', col: BLUE, shapes: [['box', 1.9, 0, 1.3, 0.45, 0.4, 0.35]] },
      { name: 'Toilet bucket', info: 'Bucket with bags and a lid, kept in the room so no one needs to leave.', col: '#cfcfcf', shapes: [['cyl', -2.0, 0, 1.4, 0.2, 0.4]] }
    ] },
    rain: { title: 'Rain butt with first flush', dist: 7, yaw: -0.7, pitch: 0.22, parts: [
      { name: 'House wall', info: 'Any roof works: the bigger the roof, the more water. 1 mm of rain on 1 m² of roof is 1 litre.', col: '#9c6a50', alpha: 0.5, two: 1, nolabel: 1, shapes: [['box', 0.4, 0, -0.6, 4, 3, 0.2]] },
      { name: 'Gutter', info: 'Clear it in autumn: leaves rot and foul the water.', col: '#8f969c', shapes: [['box', 0.4, 3.0, -0.35, 4, 0.12, 0.15]] },
      { name: 'Leaf guard', info: 'A mesh over the gutter or a leaf catcher in the downpipe keeps leaves and moss out.', col: '#6cc08f', alpha: 0.7, shapes: [['box', 0.4, 3.12, -0.35, 4, 0.02, 0.15]] },
      { name: 'Downpipe', info: 'Carries roof water down to the diverter.', col: '#8f969c', shapes: [['cyl', 1.6, 2.45, -0.35, 0.05, 0.55]] },
      { name: 'First-flush chamber', info: 'The first water off the roof carries bird droppings and dust. It fills this pipe first; only once it is full does cleaner water flow on to the butt. Size it from the roof area: see Water Systems.', col: '#e8e8e8', shapes: [['cyl', 1.6, 0.5, -0.35, 0.08, 1.95]] },
      { name: 'Ball float', info: 'Rises as the chamber fills and seals it, sending the rest of the water on to the butt.', col: RED, shapes: [['cyl', 1.6, 2.3, -0.35, 0.075, 0.1]] },
      { name: 'Slow-drip release', info: 'A tiny hole or valve at the bottom empties the chamber between showers, so it’s ready for the next one.', col: STEEL, shapes: [['cyl', 1.6, 0.4, -0.35, 0.035, 0.1]] },
      { name: 'Pipe to the butt', info: 'Takes the cleaner water on from the top of the chamber.', col: '#8f969c', nolabel: 1, shapes: [['box', 1.05, 2.38, -0.35, 1.1, 0.08, 0.08], ['cyl', 0.5, 1.5, -0.35, 0.05, 0.9]] },
      { name: 'Water butt', info: 'Dark, opaque and lidded, so algae can’t grow and mosquitoes can’t breed. For drinking, filter and treat the water first.', col: '#3f6b46', shapes: [['cyl', 0.5, 0.45, -0.1, 0.35, 1.0]] },
      { name: 'Lid', info: 'Shut tight: keeps out light, insects, leaves and children.', col: '#2b2f33', shapes: [['cyl', 0.5, 1.45, -0.1, 0.37, 0.05]] },
      { name: 'Stand', info: 'Raises the butt so a bucket or watering can fits under the tap.', col: '#9a9488', shapes: [['box', 0.5, 0, -0.1, 0.8, 0.45, 0.8]] },
      { name: 'Tap', info: 'Fitted a few centimetres above the bottom, so sediment stays behind.', col: '#c9a227', shapes: [['cyl', 0.5, 0.62, 0.3, 0.04, 0.14, 'z']] },
      { name: 'Overflow', info: 'When the butt is full, the overflow goes to a second butt, a soakaway or back to the drain, not against the house wall.', col: '#8f969c', shapes: [['cyl', -0.1, 1.3, -0.1, 0.03, 0.5, 'x']] }
    ] },
    stove: { title: 'Wood stove and flue', dist: 6.4, yaw: -0.62, pitch: 0.25, parts: [
      { name: 'Room', info: 'A living room with a wood-burning stove.', col: '#7f8780', alpha: 0.22, two: 1, nolabel: 1, shapes: [['box', 0, 0, -2, 5, 2.6, 0.1], ['box', -2.5, 0, 0, 0.1, 2.6, 4], ['box', 0, -0.1, 0, 5, 0.1, 4]] },
      { name: 'Ceiling', info: 'Where the flue passes through a ceiling it needs a fire-stop and an insulated pipe.', col: '#6c625a', alpha: 0.2, two: 1, nolabel: 1, shapes: [['box', 0, 2.6, 0, 5, 0.08, 4]] },
      { name: 'Hearth', info: 'Non-combustible, under and in front of the stove. Its size is set by building regulations (Approved Document J in England and Wales): use a registered installer.', col: '#9a9488', shapes: [['box', 0, 0, -1.25, 1.6, 0.05, 1.3]] },
      { name: 'Wood stove', info: 'Works with no power at all: heat, a kettle on top, and a pot for stews. Burn only dry wood.', col: '#2b2f33', shapes: [['box', 0, 0.05, -1.4, 0.6, 0.7, 0.45]] },
      { name: 'Door glass', info: 'Black glass means wet wood or a fire starved of air.', col: '#e08a3c', shapes: [['box', 0, 0.25, -1.17, 0.42, 0.3, 0.02]] },
      { name: 'Flue pipe', info: 'Takes smoke and carbon monoxide out. Have the chimney swept at least once a year.', col: '#1f2326', shapes: [['cyl', 0, 0.75, -1.4, 0.08, 1.85]] },
      { name: 'Fire-stop plate', info: 'Seals the ceiling around the flue and keeps heat away from timber.', col: STEEL, shapes: [['box', 0, 2.6, -1.4, 0.5, 0.05, 0.5]] },
      { name: 'Insulated flue', info: 'Twin-wall pipe above the ceiling keeps the gases hot so they draw well and don’t tar the flue.', col: '#aab0b5', alpha: 0.85, shapes: [['cyl', 0, 2.65, -1.4, 0.11, 1.3]] },
      { name: 'Cowl', info: 'Keeps rain and birds out and helps it draw in wind.', col: '#8f969c', shapes: [['cyl', 0, 3.95, -1.4, 0.18, 0.08], ['box', 0, 4.03, -1.4, 0.3, 0.15, 0.3]] },
      { name: 'CO alarm', info: 'Required when a solid-fuel stove is fitted. On the ceiling 1–3 m from the stove, at least 30 cm from any wall (or high on a wall, above doors and windows). Test monthly.', col: RED, shapes: [['cyl', 1.8, 2.52, -0.6, 0.09, 0.06]] },
      { name: 'Smoke alarm', info: 'In the hall or landing as well: one on every floor.', col: '#ececec', shapes: [['cyl', -1.5, 2.52, 1.2, 0.09, 0.06]] },
      { name: 'Air vent', info: 'A stove needs air to burn. Larger stoves, and those in well-sealed houses, need a permanent vent to outside: never block it.', col: STEEL, shapes: [['box', -2.43, 0.3, -1.1, 0.04, 0.2, 0.32]] },
      { name: 'Dry logs', info: 'Below 20% moisture: split, stacked under cover with open sides, a year or more. A moisture meter settles it.', col: WOOD, shapes: [['box', 1.25, 0, -1.3, 0.5, 0.35, 0.4]] },
      { name: 'Fireguard', info: 'Stove glass and tops reach several hundred degrees. A guard keeps children and pets back.', col: STEEL, alpha: 0.45, two: 1, shapes: [['box', 0, 0, -0.65, 1.0, 0.6, 0.03]] }
    ] },
    gethome: { title: 'Get-home bag, layer by layer', dist: 1.9, yaw: -0.55, pitch: 0.28, parts: [
      { name: 'Back panel and straps', info: 'Packed well, the bag sits close to your back and the weight rides on your hips, not your shoulders.', col: '#2b2f33', alpha: 0.8, shapes: [['box', 0, 0, -0.13, 0.32, 0.66, 0.025]] },
      { name: 'Bottom: needed last', info: 'Warm layer, foil blanket, spare socks. Soft and light, and you only need them if you stop for the night.', col: '#6f84ad', shapes: [['box', 0, 0, 0, 0.28, 0.12, 0.18]] },
      { name: 'Middle, near your back: heaviest', info: 'Water and food sit in the middle, close to your spine, so the bag doesn’t pull you backwards.', col: BLUE, shapes: [['cyl', -0.06, 0.18, -0.05, 0.045, 0.2], ['box', 0.08, 0.18, -0.05, 0.12, 0.1, 0.08]] },
      { name: 'Top: needed fast', info: 'Waterproof jacket and hat on top, where you can grab them when the rain starts.', col: '#c45a4a', shapes: [['box', 0, 0.44, 0, 0.28, 0.06, 0.18]] },
      { name: 'First aid kit', info: 'Blister plasters, dressings, painkillers, your medicines. Near the top.', col: RED, shapes: [['box', 0.07, 0.51, 0.0, 0.1, 0.04, 0.08]] },
      { name: 'Lid pocket', info: 'Head torch, paper map with your second route marked, cash, notebook and pen.', col: AMBER, shapes: [['cyl', -0.06, 0.62, 0.0, 0.02, 0.1, 'x'], ['box', 0.06, 0.61, 0.0, 0.1, 0.01, 0.08]] },
      { name: 'Side pocket', info: 'Filter bottle where you can reach it without stopping.', col: '#5b9ad8', shapes: [['cyl', 0.22, 0.05, 0.0, 0.035, 0.2]] },
      { name: 'Hip-belt pocket', info: 'Phone and power bank, so you never take the bag off to find them.', col: '#4a4f55', shapes: [['box', -0.22, 0.12, 0.04, 0.05, 0.03, 0.1]] },
      { name: 'Walking shoes', info: 'If you work in smart shoes, comfortable walking shoes and thick socks make the walk possible. Strap them outside or keep them under your desk.', col: '#8a6a3a', shapes: [['box', -0.42, 0, -0.03, 0.1, 0.08, 0.26], ['box', -0.54, 0, -0.03, 0.1, 0.08, 0.26]] }
    ] },
    kit: { title: '72-hour kit', dist: 2.4, yaw: -0.45, pitch: 0.6, parts: [
      { name: 'Storage crate', info: 'One lidded crate per household, in a cool cupboard by the door. Grab bags for each person sit on top.', col: '#556066', alpha: 0.35, two: 1, shapes: [['box', 0, 0, 0, 1.2, 0.36, 0.75]] },
      { name: 'Water', info: '9 L per person for three days (3 L a day). Bottled keeps to its date; tap water in your own containers, 6 months.', col: BLUE, alpha: 0.8, shapes: [['cyl', -0.45, 0.04, -0.18, 0.08, 0.32], ['cyl', -0.27, 0.04, -0.18, 0.08, 0.32], ['cyl', -0.45, 0.04, 0.0, 0.08, 0.32], ['cyl', -0.27, 0.04, 0.0, 0.08, 0.32]] },
      { name: 'Food', info: 'Three days of food you normally eat that needs no cooking: ring-pull tins, crackers, peanut butter, bars. Plus a manual tin opener.', col: '#b9b9b9', shapes: [['cyl', -0.05, 0.04, -0.2, 0.06, 0.1], ['cyl', 0.09, 0.04, -0.2, 0.06, 0.1], ['cyl', -0.05, 0.14, -0.2, 0.06, 0.1], ['cyl', 0.09, 0.04, -0.06, 0.06, 0.1]] },
      { name: 'Torch and lantern', info: 'A head torch for each person and an LED lantern. Lithium AA batteries last ten years in a drawer.', col: '#f0d070', shapes: [['cyl', 0.0, 0.075, 0.25, 0.035, 0.22, 'x'], ['cyl', 0.45, 0.04, 0.24, 0.07, 0.2]] },
      { name: 'Radio', info: 'Wind-up, solar or battery FM radio for local news and warnings.', col: '#4a4f55', shapes: [['box', 0.3, 0.04, -0.15, 0.24, 0.14, 0.09]] },
      { name: 'Power bank', info: '20,000 mAh charges most phones four or five times. Top it up every few months.', col: '#2b2f33', shapes: [['box', 0.2, 0.04, 0.12, 0.15, 0.03, 0.08]] },
      { name: 'First aid and medicines', info: 'First aid kit, a week of everyone’s medicines and a written list of them, spare glasses.', col: RED, shapes: [['box', -0.3, 0.04, 0.22, 0.3, 0.12, 0.18]] },
      { name: 'Documents and cash', info: 'Copies of passports, insurance and prescriptions in a waterproof pouch; cash in small notes, because card machines need power.', col: '#d9cfa8', shapes: [['box', 0.0, 0.04, 0.07, 0.2, 0.02, 0.12]] },
      { name: 'Camping stove and gas', info: 'For hot food and drinks, used outdoors or by an open door. Propane-mix cartridges work better in cold weather.', col: '#9aa1a8', shapes: [['cyl', 0.47, 0.04, -0.02, 0.08, 0.1], ['cyl', 0.47, 0.14, -0.02, 0.03, 0.05]] }
    ] }
  };

  function hex(c) { const m = c.replace('#', ''); return [0, 2, 4].map(i => parseInt(m.slice(i, i + 2), 16)); }

  /* Build: polygons with outward normals, grouped by part. */
  function build(model) {
    const parts = model.parts.map((p, pi) => {
      const faces = [];
      p.shapes.forEach(s => {
        const polys = SHAPE[s[0]].apply(null, s.slice(1));
        const all = [].concat.apply([], polys), c = all.reduce((a, q) => [a[0] + q[0] / all.length, a[1] + q[1] / all.length, a[2] + q[2] / all.length], [0, 0, 0]);
        polys.forEach(pts => {
          let n = [0, 0, 0];
          for (let i = 0; i < pts.length; i++) { const a = pts[i], b = pts[(i + 1) % pts.length]; n = [n[0] + (a[1] - b[1]) * (a[2] + b[2]), n[1] + (a[2] - b[2]) * (a[0] + b[0]), n[2] + (a[0] - b[0]) * (a[1] + b[1])]; }
          n = unit(n);
          const fc = pts.reduce((a, q) => [a[0] + q[0] / pts.length, a[1] + q[1] / pts.length, a[2] + q[2] / pts.length], [0, 0, 0]);
          if (dot(n, sub(fc, c)) < 0) n = [-n[0], -n[1], -n[2]];
          faces.push({ pts, n, c: fc });
        });
      });
      const all = [].concat.apply([], faces.map(f => f.pts));
      const lo = [0, 1, 2].map(k => Math.min.apply(null, all.map(q => q[k]))), hi = [0, 1, 2].map(k => Math.max.apply(null, all.map(q => q[k])));
      return { i: pi, name: p.name, info: p.info, rgb: hex(p.col), alpha: p.alpha || 1, two: !!p.two, nolabel: !!p.nolabel, faces,
        anchor: [(lo[0] + hi[0]) / 2, hi[1], (lo[2] + hi[2]) / 2], lo, hi };
    });
    const lo = [0, 1, 2].map(k => Math.min.apply(null, parts.map(p => p.lo[k]))), hi = [0, 1, 2].map(k => Math.max.apply(null, parts.map(p => p.hi[k])));
    return { parts, centre: [(lo[0] + hi[0]) / 2, (lo[1] + hi[1]) / 2, (lo[2] + hi[2]) / 2] };
  }

  const reduced = () => window.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches;

  function viewer(el) {
    const M = MODELS[el.dataset.model]; if (!M) return;
    const G = build(M);
    const labelled = G.parts.filter(p => !p.nolabel);
    el.innerHTML = '<div class="m3d-stage"><canvas role="img" aria-label="3D model: ' + esc(M.title) + '. Drag to turn it; tap a part to read about it."></canvas>' +
      '<div class="m3d-ctl no-print"><button type="button" data-a="spin" aria-pressed="true">⏸ Pause</button><button type="button" data-a="lab" aria-pressed="true">Labels</button>' +
      '<button type="button" data-a="in" aria-label="Zoom in">＋</button><button type="button" data-a="out" aria-label="Zoom out">－</button><button type="button" data-a="reset">Reset</button></div>' +
      '<p class="m3d-hint no-print">Drag to turn · tap a part</p></div>' +
      '<div class="m3d-info" aria-live="polite"><b>' + esc(M.title) + '</b><span>Tap a part, or a name below, to see what it does.</span></div>' +
      '<div class="m3d-parts">' + labelled.map((p, k) => '<button type="button" data-p="' + p.i + '"><i>' + (k + 1) + '</i>' + esc(p.name) + '</button>').join('') + '</div>';
    const cv = el.querySelector('canvas'), ctx = cv.getContext('2d'), info = el.querySelector('.m3d-info');
    const st = { yaw: M.yaw, pitch: M.pitch, zoom: 1, sel: -1, spin: !reduced(), labels: true, drawn: [], visible: true, last: 0 };
    let Wd = 0, Ht = 0, dpr = 1;
    function size() {
      dpr = Math.min(2, window.devicePixelRatio || 1); Wd = cv.clientWidth; Ht = cv.clientHeight;
      cv.width = Math.round(Wd * dpr); cv.height = Math.round(Ht * dpr); draw();
    }
    const css = getComputedStyle(document.documentElement);
    const tone = (v, d) => (css.getPropertyValue(v) || '').trim() || d;
    function draw() {
      if (!Wd) return;
      const cyw = Math.cos(st.yaw), syw = Math.sin(st.yaw), cp = Math.cos(st.pitch), sp = Math.sin(st.pitch);
      const C = G.centre, dist = M.dist / st.zoom, f = Math.min(Wd, Ht * 1.35) * 0.95;
      /* camera looks from +z (the open, cut-away side) and down from above as pitch grows */
      const rot = p => { const x = p[0] - C[0], y = p[1] - C[1], z = C[2] - p[2]; const x1 = x * cyw - z * syw, z1 = x * syw + z * cyw; return [x1, y * cp + z1 * sp, -y * sp + z1 * cp]; };
      const rotN = n => { const x1 = n[0] * cyw + n[2] * syw, z1 = n[0] * syw - n[2] * cyw; return [x1, n[1] * cp + z1 * sp, -n[1] * sp + z1 * cp]; };
      const proj = r => [Wd / 2 + r[0] * f / (r[2] + dist), Ht * 0.52 - r[1] * f / (r[2] + dist)];
      const L = unit([-0.45, 0.75, -0.5]);
      const list = [];
      G.parts.forEach(p => p.faces.forEach(fc => {
        const n = rotN(fc.n), rc = rot(fc.c), cam = [rc[0], rc[1], rc[2] + dist];
        const front = dot(n, cam) < 0;
        if (!front && !p.two) return;
        const r = fc.pts.map(rot);
        if (r.some(q => q[2] + dist < 0.2)) return;
        const lit = Math.abs(dot(n, L)) * (front ? 1 : 0.6);
        list.push({ p, pts: r.map(proj), z: r.reduce((a, q) => a + q[2], 0) / r.length, lit });
      }));
      list.sort((a, b) => b.z - a.z);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0); ctx.clearRect(0, 0, Wd, Ht);
      const edge = tone('--border-hi', '#3a4a40'), amber = tone('--amber', '#e2b04a');
      list.forEach(it => {
        const p = it.p, k = 0.38 + 0.62 * it.lit, dim = st.sel >= 0 && st.sel !== p.i;
        const a = p.alpha * (dim ? 0.28 : 1);
        ctx.beginPath(); it.pts.forEach((q, i) => i ? ctx.lineTo(q[0], q[1]) : ctx.moveTo(q[0], q[1])); ctx.closePath();
        ctx.fillStyle = 'rgba(' + p.rgb.map(v => Math.round(v * k)).join(',') + ',' + a + ')'; ctx.fill();
        ctx.lineWidth = st.sel === p.i ? 1.6 : 0.6; ctx.strokeStyle = st.sel === p.i ? amber : edge; ctx.globalAlpha = dim ? 0.25 : p.alpha < 0.5 ? 0.6 : 0.9; ctx.stroke(); ctx.globalAlpha = 1;
      });
      st.drawn = list;
      st.marks = [];
      if (st.labels) labelled.forEach((p, k) => {
        const q = proj(rot(p.anchor)); st.marks.push([q[0], q[1] - 12, p.i]);
        ctx.beginPath(); ctx.moveTo(q[0], q[1]); ctx.lineTo(q[0], q[1] - 6); ctx.strokeStyle = amber; ctx.lineWidth = 1; ctx.stroke();
        ctx.beginPath(); ctx.arc(q[0], q[1] - 12, 8, 0, 7); ctx.fillStyle = st.sel === p.i ? amber : 'rgba(10,14,12,.82)'; ctx.fill(); ctx.strokeStyle = amber; ctx.stroke();
        ctx.fillStyle = st.sel === p.i ? '#111' : amber; ctx.font = '700 10px Inter, system-ui, sans-serif'; ctx.textAlign = 'center'; ctx.textBaseline = 'middle'; ctx.fillText(String(k + 1), q[0], q[1] - 11.5);
      });
    }
    function select(i) {
      st.sel = st.sel === i ? -1 : i;
      el.querySelectorAll('.m3d-parts button').forEach(b => b.classList.toggle('on', +b.dataset.p === st.sel));
      const p = G.parts[st.sel];
      info.innerHTML = p ? '<b>' + esc(p.name) + '</b><span>' + esc(p.info) + '</span>' : '<b>' + esc(M.title) + '</b><span>Tap a part, or a name below, to see what it does.</span>';
      draw();
    }
    function hit(x, y) {
      if (st.marks) for (const [mx, my, i] of st.marks) if (Math.hypot(x - mx, y - my) < 11) return i;
      for (let j = st.drawn.length - 1; j >= 0; j--) {
        const pts = st.drawn[j].pts; let inside = false;
        for (let a = 0, b = pts.length - 1; a < pts.length; b = a++) {
          if (((pts[a][1] > y) !== (pts[b][1] > y)) && x < (pts[b][0] - pts[a][0]) * (y - pts[a][1]) / (pts[b][1] - pts[a][1]) + pts[a][0]) inside = !inside;
        }
        if (inside && st.drawn[j].p.alpha > 0.2) return st.drawn[j].p.i;
      }
      return -1;
    }
    /* Drag to turn. Touch keeps vertical page scrolling (touch-action: pan-y). */
    let drag = null;
    cv.addEventListener('pointerdown', e => { drag = { x: e.clientX, y: e.clientY, yaw: st.yaw, pitch: st.pitch, moved: false }; cv.setPointerCapture(e.pointerId); });
    cv.addEventListener('pointermove', e => {
      if (!drag) return;
      const dx = e.clientX - drag.x, dy = e.clientY - drag.y;
      if (Math.abs(dx) + Math.abs(dy) > 4) { drag.moved = true; setSpin(false); }
      st.yaw = drag.yaw + dx * 0.01;
      if (e.pointerType === 'mouse') st.pitch = Math.max(-0.2, Math.min(1.35, drag.pitch + dy * 0.008));
      draw();
    });
    const end = e => {
      if (drag && !drag.moved && e.type === 'pointerup') { const r = cv.getBoundingClientRect(); const i = hit(e.clientX - r.left, e.clientY - r.top); if (i >= 0) select(i); }
      drag = null;
    };
    cv.addEventListener('pointerup', end); cv.addEventListener('pointercancel', end);
    function setSpin(on) {
      st.spin = on; const b = el.querySelector('[data-a=spin]');
      b.textContent = on ? '⏸ Pause' : '▶ Turn'; b.setAttribute('aria-pressed', on); if (on) loop();
    }
    el.querySelector('.m3d-ctl').addEventListener('click', e => {
      const a = e.target.closest('button'); if (!a) return;
      const k = a.dataset.a;
      if (k === 'spin') setSpin(!st.spin);
      if (k === 'lab') { st.labels = !st.labels; a.setAttribute('aria-pressed', st.labels); draw(); }
      if (k === 'in') { st.zoom = Math.min(2.4, st.zoom * 1.2); draw(); }
      if (k === 'out') { st.zoom = Math.max(0.6, st.zoom / 1.2); draw(); }
      if (k === 'reset') { st.yaw = M.yaw; st.pitch = M.pitch; st.zoom = 1; select(-1); }
    });
    el.querySelector('.m3d-parts').addEventListener('click', e => { const b = e.target.closest('button'); if (b) select(+b.dataset.p); });
    function loop(t) {
      if (!st.spin || !st.visible) return;
      if (t && st.last) st.yaw += Math.min(50, t - st.last) * 0.00025;
      st.last = t || 0; draw(); requestAnimationFrame(loop);
    }
    if ('IntersectionObserver' in window) new IntersectionObserver(es => es.forEach(en => { st.visible = en.isIntersecting; st.last = 0; if (st.visible && st.spin) requestAnimationFrame(loop); })).observe(el);
    if ('ResizeObserver' in window) new ResizeObserver(size).observe(cv); else window.addEventListener('resize', size);
    if (!st.spin) { const b = el.querySelector('[data-a=spin]'); b.textContent = '▶ Turn'; b.setAttribute('aria-pressed', 'false'); }
    size(); if (st.spin) requestAnimationFrame(loop);
  }
  document.querySelectorAll('.m3d[data-model]').forEach(el => { if (!el.dataset.ready) { el.dataset.ready = '1'; viewer(el); } });
})();
