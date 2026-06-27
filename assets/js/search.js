/* =========================================
   THE LAST LIGHT SURVIVAL GUIDE
   search.js — Client-side full-text search
   ========================================= */

(function () {
  'use strict';

  /* =================== SEARCH INDEX =================== */
  /* Pre-built index of all guide content.
     Each entry: { id, title, section, sectionLabel, file, anchor, content, tags } */
  const SEARCH_INDEX = [
    /* HOME */
    { id:'home-intro', title:'Survival Guide Home', section:'home', sectionLabel:'Home', file:'index.html', anchor:'', content:'survival guide emergency preparedness offline last light introduction overview dashboard', tags:['survival','guide','home','intro'] },

    /* FOOD & WATER */
    { id:'food-water-overview', title:'Food, Water & Sanitation Overview', section:'food', sectionLabel:'Food & Water', file:'sections/food.html', anchor:'', content:'food water sanitation survival basics overview', tags:['food','water','overview'] },
    { id:'food-water-sourcing', title:'Water Sourcing', section:'food', sectionLabel:'Food & Water', file:'sections/food.html', anchor:'#water-sourcing', content:'water sourcing finding water streams rivers rain groundwater springs water table digging wells', tags:['water','sourcing','well','stream','rain'] },
    { id:'food-water-purification', title:'Water Purification', section:'food', sectionLabel:'Food & Water', file:'sections/food.html', anchor:'#water-purification', content:'water purification boiling bleach sodium hypochlorite solar disinfection SODIS filter activated carbon sand gravel distillation iodine tablets', tags:['water','purification','boiling','bleach','filter','SODIS','distillation'] },
    { id:'food-water-storage', title:'Water Storage', section:'food', sectionLabel:'Food & Water', file:'sections/food.html', anchor:'#water-storage', content:'water storage containers food grade BPA free rotation schedule long term barrels', tags:['water','storage','containers'] },
    { id:'food-rainwater', title:'Rainwater Collection', section:'food', sectionLabel:'Food & Water', file:'sections/food.html', anchor:'#rainwater', content:'rainwater collection system catchment roof gutters first flush diverter barrel storage cistern', tags:['rainwater','collection','catchment'] },
    { id:'food-preservation', title:'Food Preservation', section:'food', sectionLabel:'Food & Water', file:'sections/food.html', anchor:'#food-preservation', content:'food preservation canning pressure canning water bath canning smoking salt curing fermentation dehydration freeze drying jerky', tags:['food','preservation','canning','smoking','salt','fermentation','dehydration'] },
    { id:'food-foraging', title:'Foraging & Wild Plants', section:'food', sectionLabel:'Food & Water', file:'sections/food.html', anchor:'#foraging', content:'foraging wild edible plants mushrooms identification dandelion cattail acorn pine needle berries nuts roots tubers avoid poisonous', tags:['foraging','wild plants','edible','mushrooms','berries'] },
    { id:'food-hunting', title:'Hunting & Trapping', section:'food', sectionLabel:'Food & Water', file:'sections/food.html', anchor:'#hunting', content:'hunting trapping snares deadfall trap figure four box trap rabbit squirrel deer field dressing game cleaning', tags:['hunting','trapping','snares','deadfall','game'] },
    { id:'food-fishing', title:'Passive Fishing', section:'food', sectionLabel:'Food & Water', file:'sections/food.html', anchor:'#fishing', content:'passive fishing trotline set line jug line limb line fish trap funnel basket weir gill net subsistence catch fish overnight', tags:['fishing','trotline','gill net','fish trap','weir'] },
    { id:'food-sanitation', title:'Sanitation Without Running Water', section:'food', sectionLabel:'Food & Water', file:'sections/food.html', anchor:'#sanitation', content:'sanitation latrine outhouse composting toilet greywater waste disposal hygiene hand washing soap disease prevention cholera typhoid', tags:['sanitation','latrine','hygiene','disease','greywater'] },

    /* MEDICAL */
    { id:'med-overview', title:'Medical & First Aid Overview', section:'medical', sectionLabel:'Medical', file:'sections/medical.html', anchor:'', content:'medical first aid emergency treatment survival overview', tags:['medical','first aid','overview'] },
    { id:'med-wounds', title:'Wound Care & Infection Control', section:'medical', sectionLabel:'Medical', file:'sections/medical.html', anchor:'#wound-care', content:'wound care cleaning irrigation suturing improvised stitches butterfly closure steri-strips infection control antibiotics signs of infection', tags:['wounds','sutures','infection','bleeding'] },
    { id:'med-fractures', title:'Fractures & Splinting', section:'medical', sectionLabel:'Medical', file:'sections/medical.html', anchor:'#fractures', content:'fracture broken bone splinting immobilization improvised splint traction closed open fracture reduction', tags:['fracture','broken bone','splint'] },
    { id:'med-burns', title:'Burns Treatment', section:'medical', sectionLabel:'Medical', file:'sections/medical.html', anchor:'#burns', content:'burns first second third degree cool water no ice butter treatment dressing infection', tags:['burns','treatment'] },
    { id:'med-hypothermia', title:'Hypothermia & Heat Stroke', section:'medical', sectionLabel:'Medical', file:'sections/medical.html', anchor:'#temperature', content:'hypothermia heat stroke heat exhaustion temperature core body warming cooling treatment signs symptoms', tags:['hypothermia','heat stroke','temperature'] },
    { id:'med-childbirth', title:'Emergency Childbirth', section:'medical', sectionLabel:'Medical', file:'sections/medical.html', anchor:'#childbirth', content:'emergency childbirth delivery labor complications umbilical cord placenta postpartum', tags:['childbirth','delivery','labor'] },
    { id:'med-herbal', title:'Herbal Medicine', section:'medical', sectionLabel:'Medical', file:'sections/medical.html', anchor:'#herbal', content:'herbal medicine plants medicinal yarrow plantain garlic willow bark aspirin fever pain infection tincture poultice', tags:['herbal','medicine','plants','tincture','poultice'] },
    { id:'med-meds', title:'Medications & Stockpiling', section:'medical', sectionLabel:'Medical', file:'sections/medical.html', anchor:'#medications', content:'medications stockpiling antibiotics painkillers antihistamine antidiarrheal epinephrine insulin storage expiration rationing', tags:['medications','stockpile','antibiotics'] },
    { id:'med-triage', title:'Triage & Mass Casualty', section:'medical', sectionLabel:'Medical', file:'sections/medical.html', anchor:'#triage', content:'triage mass casualty START triage red yellow green black tag prioritization multiple victims', tags:['triage','mass casualty','START'] },
    { id:'med-mental', title:'Mental Health in Survival', section:'medical', sectionLabel:'Medical', file:'sections/medical.html', anchor:'#mental-health', content:'mental health survival stress anxiety PTSD grief community support routine normalcy children', tags:['mental health','stress','anxiety','PTSD'] },
    { id:'med-animal-bites', title:'Animal Bites & Rabies', section:'medical', sectionLabel:'Medical', file:'sections/medical.html', anchor:'#animal-bites', content:'animal bite rabies dog cat bat wound washing soap post exposure observation 10 day pasteurella infection mammal', tags:['rabies','animal bite','wound','infection'] },
    { id:'med-tetanus', title:'Tetanus', section:'medical', sectionLabel:'Medical', file:'sections/medical.html', anchor:'#tetanus', content:'tetanus clostridium lockjaw rusty nail puncture wound booster vaccine spasms muscle rigidity debride dirty wound', tags:['tetanus','lockjaw','vaccine','puncture'] },
    { id:'med-anaphylaxis', title:'Anaphylaxis & Severe Allergy', section:'medical', sectionLabel:'Medical', file:'sections/medical.html', anchor:'#anaphylaxis', content:'anaphylaxis severe allergic reaction epinephrine epipen auto injector bee sting nut shellfish airway swelling hives biphasic antihistamine benadryl', tags:['anaphylaxis','allergy','epinephrine','epipen'] },
    { id:'med-eye-injuries', title:'Eye Injuries', section:'medical', sectionLabel:'Medical', file:'sections/medical.html', anchor:'#eye-injuries', content:'eye injury chemical splash irrigation flush foreign body embedded object penetrating cover both eyes snow blindness flash burn arc welding hyphema', tags:['eye','irrigation','foreign body','snow blindness'] },
    { id:'med-meds-out', title:'When the Medicines Run Out', section:'medical', sectionLabel:'Medical', file:'sections/medical.html', anchor:'#meds-out', content:'medicines run out chronic medication insulin diabetes thyroid blood pressure beta blocker seizure asthma antidepressant taper do not stop suddenly stockpile shelf life expiry rationing lifestyle', tags:['medications','chronic','insulin','tapering','stockpile'] },
    { id:'med-vision', title:'Vision & Eye Protection', section:'medical', sectionLabel:'Medical', file:'sections/medical.html', anchor:'#vision', content:'vision eyesight spare glasses prescription pinhole glasses eye protection snow blindness sunglasses slit goggles vitamin A night blindness magnifying readers losing glasses', tags:['vision','glasses','eye protection','pinhole','vitamin A'] },
    { id:'med-death', title:'Death, Bodies & Burial', section:'medical', sectionLabel:'Medical', file:'sections/medical.html', anchor:'#death', content:'death dead bodies burial corpse disposal disease handling the dead grave depth lime cremation shroud confirming death grief ritual records', tags:['death','burial','bodies','disease','grief'] },

    /* ENERGY */
    { id:'energy-overview', title:'Energy Creation & Management', section:'energy', sectionLabel:'Energy', file:'sections/energy.html', anchor:'', content:'energy solar wind hydro battery generator power survival electricity', tags:['energy','power','solar','battery'] },
    { id:'energy-solar', title:'Solar Power Systems', section:'energy', sectionLabel:'Energy', file:'sections/energy.html', anchor:'#solar', content:'solar panels photovoltaic wiring battery bank charge controller MPPT PWM inverter sizing watt hour ampere 12V 24V 48V system', tags:['solar','panels','battery','inverter','MPPT'] },
    { id:'energy-generator', title:'Hand-Crank & Pedal Generators', section:'energy', sectionLabel:'Energy', file:'sections/energy.html', anchor:'#generators', content:'hand crank pedal generator bicycle alternator DIY build motor winding coil magnet', tags:['generator','pedal','bicycle','hand crank'] },
    { id:'energy-hydro', title:'Micro-Hydro Power', section:'energy', sectionLabel:'Energy', file:'sections/energy.html', anchor:'#hydro', content:'micro hydro power stream water wheel turbine pelton wheel flow rate head pressure piping', tags:['hydro','water wheel','turbine','stream'] },
    { id:'energy-wind', title:'Wind Turbines', section:'energy', sectionLabel:'Energy', file:'sections/energy.html', anchor:'#wind', content:'wind turbine DIY blades alternator tower guy wires furling tail rotor', tags:['wind','turbine','DIY'] },
    { id:'energy-gasification', title:'Wood Gasification', section:'energy', sectionLabel:'Energy', file:'sections/energy.html', anchor:'#gasification', content:'wood gas gasification producer gas syngas wood charcoal gasifier engine run generator', tags:['gasification','wood gas','syngas'] },
    { id:'energy-batteries', title:'Battery Maintenance & Improvised Batteries', section:'energy', sectionLabel:'Energy', file:'sections/energy.html', anchor:'#batteries', content:'battery lead acid lithium maintenance desulfation equalization improvised battery electrolyte specific gravity hydrometer', tags:['battery','maintenance','lead acid'] },
    { id:'energy-faraday', title:'Faraday Cages & EMP Protection', section:'energy', sectionLabel:'Energy', file:'sections/energy.html', anchor:'#faraday', content:'faraday cage EMP electromagnetic pulse protection electronics metal box grounding nested shielding', tags:['faraday','EMP','protection','electronics'] },
    { id:'energy-fuel', title:'Fuel Storage Safety', section:'energy', sectionLabel:'Energy', file:'sections/energy.html', anchor:'#fuel', content:'fuel storage gasoline propane diesel safety stabilizer rotation container venting fire hazard', tags:['fuel','storage','gasoline','propane','diesel'] },

    /* SHELTER */
    { id:'shelter-overview', title:'Shelter & Construction Overview', section:'shelter', sectionLabel:'Shelter', file:'sections/shelter.html', anchor:'', content:'shelter construction building site emergency survival housing', tags:['shelter','construction','building'] },
    { id:'shelter-site', title:'Site Selection', section:'shelter', sectionLabel:'Shelter', file:'sections/shelter.html', anchor:'#site-selection', content:'site selection flood plain elevation wind sun orientation defensibility water access soil type drainage', tags:['site selection','location','flood','wind'] },
    { id:'shelter-emergency', title:'Emergency Shelters', section:'shelter', sectionLabel:'Shelter', file:'sections/shelter.html', anchor:'#emergency-shelters', content:'emergency shelter debris hut lean-to tarp setup A-frame quinzhee snow shelter immediate improvised', tags:['emergency shelter','debris hut','lean-to','tarp'] },
    { id:'shelter-longterm', title:'Long-Term Construction', section:'shelter', sectionLabel:'Shelter', file:'sections/shelter.html', anchor:'#long-term', content:'long term construction timber frame earthbag cob building natural building post and beam mortise tenon joinery', tags:['construction','timber frame','earthbag','cob'] },
    { id:'shelter-insulation', title:'Insulation & Ventilation', section:'shelter', sectionLabel:'Shelter', file:'sections/shelter.html', anchor:'#insulation', content:'insulation ventilation passive solar thermal mass air flow vapor barrier R-value natural materials straw clay', tags:['insulation','ventilation','passive solar'] },
    { id:'shelter-tools', title:'Construction Tools', section:'shelter', sectionLabel:'Shelter', file:'sections/shelter.html', anchor:'#tools', content:'tools hand tools saw axe chisel mallet level square plane drawknife froe improvised tools', tags:['tools','hand tools','construction'] },

    /* COMMUNICATIONS */
    { id:'comms-overview', title:'Communications & Signals Overview', section:'communications', sectionLabel:'Communications', file:'sections/communications.html', anchor:'', content:'communications radio signals emergency contact ham radio frequency', tags:['communications','radio','signals'] },
    { id:'comms-ham', title:'Ham Radio Basics', section:'communications', sectionLabel:'Communications', file:'sections/communications.html', anchor:'#ham-radio', content:'ham radio amateur radio licensing Technician General Extra frequencies VHF UHF HF bands repeater simplex APRS', tags:['ham radio','amateur radio','frequencies','repeater'] },
    { id:'comms-baofeng', title:'Baofeng Radio Guide', section:'communications', sectionLabel:'Communications', file:'sections/communications.html', anchor:'#baofeng', content:'baofeng UV-5R UV-82 programming setup CHIRP frequencies emergency police fire NOAA weather channels memory', tags:['baofeng','UV-5R','programming','CHIRP'] },
    { id:'comms-morse', title:'Morse Code Reference', section:'communications', sectionLabel:'Communications', file:'sections/communications.html', anchor:'#morse', content:'morse code CW telegraph dots dashes SOS emergency signals alphabet numbers international', tags:['morse code','CW','SOS','telegraph'] },
    { id:'comms-signals', title:'Visual Signals', section:'communications', sectionLabel:'Communications', file:'sections/communications.html', anchor:'#visual-signals', content:'signal fire mirror heliograph ground to air signals rescue pattern sos X V arrow markings rocks', tags:['signal fire','mirror','ground to air','rescue'] },
    { id:'comms-mesh', title:'Mesh Networks (Meshtastic/LoRa)', section:'communications', sectionLabel:'Communications', file:'sections/communications.html', anchor:'#mesh', content:'meshtastic LoRa mesh network decentralized no internet radio packet T-Beam T-Echo local network community', tags:['meshtastic','LoRa','mesh','network'] },
    { id:'comms-noaa', title:'NOAA Weather Radio', section:'communications', sectionLabel:'Communications', file:'sections/communications.html', anchor:'#noaa', content:'NOAA weather radio WX frequencies 162.400 alerts EAS emergency alert system battery hand crank', tags:['NOAA','weather radio','alerts'] },
    { id:'comms-deaddrops', title:'Dead Drop Communication', section:'communications', sectionLabel:'Communications', file:'sections/communications.html', anchor:'#dead-drops', content:'dead drop communication OPSEC covert messaging locations codes ciphers signal chalk mark', tags:['dead drop','covert','OPSEC','cipher'] },
    { id:'comms-crystal', title:'No-Power Radio (Crystal Set)', section:'communications', sectionLabel:'Communications', file:'sections/communications.html', anchor:'#crystal-radio', content:'crystal radio foxhole radio no power no battery receiver AM broadcast antenna ground coil germanium diode 1N34A cat whisker razor blade piezo earpiece emergency broadcast', tags:['crystal radio','foxhole radio','no power','receiver','antenna'] },

    /* NAVIGATION */
    { id:'nav-overview', title:'Navigation & Maps Overview', section:'navigation', sectionLabel:'Navigation', file:'sections/navigation.html', anchor:'', content:'navigation maps compass topographic celestial natural landmarks', tags:['navigation','maps','compass'] },
    { id:'nav-topo', title:'Topographic Maps', section:'navigation', sectionLabel:'Navigation', file:'sections/navigation.html', anchor:'#topo-maps', content:'topographic map reading contour lines elevation relief scale legend symbols trails water features UTM grid MGRS', tags:['topographic','maps','contour','UTM'] },
    { id:'nav-compass', title:'Compass Use & Triangulation', section:'navigation', sectionLabel:'Navigation', file:'sections/navigation.html', anchor:'#compass', content:'compass bearing declination magnetic north true north triangulation resection baseplate lensatic using compass', tags:['compass','bearing','declination','triangulation'] },
    { id:'nav-celestial', title:'Celestial Navigation', section:'navigation', sectionLabel:'Navigation', file:'sections/navigation.html', anchor:'#celestial', content:'celestial navigation stars north star polaris big dipper orion southern cross sun shadow stick position latitude longitude', tags:['celestial','stars','polaris','sun','navigation'] },
    { id:'nav-natural', title:'Natural Navigation', section:'navigation', sectionLabel:'Navigation', file:'sections/navigation.html', anchor:'#natural', content:'natural navigation moss trees wind patterns water flow animal trails landscape sun position time of day', tags:['natural navigation','moss','wind','water flow'] },
    { id:'nav-maps', title:'Creating Your Own Maps', section:'navigation', sectionLabel:'Navigation', file:'sections/navigation.html', anchor:'#map-making', content:'map making cartography sketch dead reckoning pace counting landmarks local area survey hand drawn', tags:['map making','cartography','sketch'] },

    /* SECURITY */
    { id:'sec-overview', title:'Security & Defense Overview', section:'security', sectionLabel:'Security', file:'sections/security.html', anchor:'', content:'security defense community protection watch perimeter', tags:['security','defense','protection'] },
    { id:'sec-community', title:'Community Organization & Watch', section:'security', sectionLabel:'Security', file:'sections/security.html', anchor:'#community', content:'community organization neighborhood watch shifts roles responsibilities communication chain of command council leadership', tags:['community','watch','organization'] },
    { id:'sec-perimeter', title:'Perimeter Security', section:'security', sectionLabel:'Security', file:'sections/security.html', anchor:'#perimeter', content:'perimeter security trip wire alarm noise makers lights dog patrol fence wall barrier detection early warning', tags:['perimeter','trip wire','alarm','detection'] },
    { id:'sec-negotiation', title:'Conflict De-escalation', section:'security', sectionLabel:'Security', file:'sections/security.html', anchor:'#negotiation', content:'conflict de-escalation negotiation communication trade barter peaceful resolution threat assessment', tags:['negotiation','de-escalation','conflict'] },
    { id:'sec-firearms', title:'Firearms Basics', section:'security', sectionLabel:'Security', file:'sections/security.html', anchor:'#firearms', content:'firearms handgun rifle shotgun caliber ammunition storage maintenance cleaning safe storage legal', tags:['firearms','handgun','rifle','ammunition','safety'] },
    { id:'sec-nonlethal', title:'Non-Lethal Defense', section:'security', sectionLabel:'Security', file:'sections/security.html', anchor:'#non-lethal', content:'non lethal defense pepper spray taser stun baton improvised barriers alarm deterrent dog patrol', tags:['non-lethal','pepper spray','defense'] },
    { id:'sec-opsec', title:'Operational Security (OPSEC)', section:'security', sectionLabel:'Security', file:'sections/security.html', anchor:'#opsec', content:'OPSEC operational security what not to share information security loose lips stockpile secrecy community trust anonymity', tags:['OPSEC','security','information'] },
    { id:'sec-fortify', title:'Fortifying a Building', section:'security', sectionLabel:'Security', file:'sections/security.html', anchor:'#fortification', content:'fortification building hardening door reinforcement window barricade safe room bottleneck entry points defensive', tags:['fortification','hardening','door','windows'] },
    { id:'sec-bugout', title:'Bug-Out vs Bug-In Decision', section:'security', sectionLabel:'Security', file:'sections/security.html', anchor:'#bug-out', content:'bug out bug in decision framework shelter in place evacuation go bag BOB 72 hour kit when to leave stay', tags:['bug out','bug in','evacuation','go bag'] },
    { id:'sec-caching', title:'Caching Supplies', section:'security', sectionLabel:'Security', file:'sections/security.html', anchor:'#caching', content:'cache caching supplies buried stash PVC pipe ammo can waterproof airtight desiccant distributed get-home cache fallback hidden reserve metal detector OPSEC secret location', tags:['cache','caching','buried supplies','PVC','OPSEC'] },

    /* KNOWLEDGE */
    { id:'know-overview', title:'Knowledge Preservation Overview', section:'knowledge', sectionLabel:'Knowledge', file:'sections/knowledge.html', anchor:'', content:'knowledge preservation library books education community learning', tags:['knowledge','preservation','library','education'] },
    { id:'know-preserve', title:'Preserving Books & Documents', section:'knowledge', sectionLabel:'Knowledge', file:'sections/knowledge.html', anchor:'#preserve', content:'preserving books documents lamination dry storage mylar silica gel archival acid-free paper dark storage humidity', tags:['books','preservation','documents','storage'] },
    { id:'know-reading', title:'Essential Reading List', section:'knowledge', sectionLabel:'Knowledge', file:'sections/knowledge.html', anchor:'#reading-list', content:'essential books reading list medicine engineering farming agriculture law history psychology philosophy survival reference', tags:['books','reading list','essential','reference'] },
    { id:'know-library', title:'Community Library Setup', section:'knowledge', sectionLabel:'Knowledge', file:'sections/knowledge.html', anchor:'#library', content:'community library post-collapse catalog system checkout lending repair rebind organization volunteer librarian', tags:['library','community','organization'] },
    { id:'know-teaching', title:'Teaching & Apprenticeship', section:'knowledge', sectionLabel:'Knowledge', file:'sections/knowledge.html', anchor:'#teaching', content:'teaching apprenticeship skills transfer hands on learning mentorship guild system children education curriculum', tags:['teaching','apprenticeship','education','children'] },
    { id:'know-digital', title:'Archiving Digital Data Offline', section:'knowledge', sectionLabel:'Knowledge', file:'sections/knowledge.html', anchor:'#digital', content:'digital archiving offline hard drive SSD optical disc DVD M-DISC microfilm USB cold storage backup redundancy', tags:['digital','archiving','hard drive','backup','M-DISC'] },
    { id:'know-records', title:'Record Keeping Without Computers', section:'knowledge', sectionLabel:'Knowledge', file:'sections/knowledge.html', anchor:'#records', content:'record keeping without computers ledger journal ink paper quill writing census inventory supply tracking', tags:['records','keeping','paper','ledger'] },
    { id:'know-children', title:'Teaching Children Essential Skills', section:'knowledge', sectionLabel:'Knowledge', file:'sections/knowledge.html', anchor:'#children', content:'children skills teaching first aid fire starting navigation plants food preservation community values responsibility age appropriate', tags:['children','teaching','skills','education'] },

    /* PRACTICAL SKILLS */
    { id:'skills-sharpening', title:'Sharpening a Blade', section:'skills', sectionLabel:'Practical Skills', file:'skills.html', anchor:'', content:'sharpening blade knife axe whetstone stone grit angle burr strop hone edge dull tools maintenance', tags:['sharpening','knife','whetstone','tools','edge'] },

    /* FIRST PRINCIPLES / SCIENCE */
    { id:'sci-overview', title:'First Principles — Science, Maths & Invention', section:'science', sectionLabel:'First Principles', file:'sections/science.html', anchor:'', content:'science physics chemistry maths mathematics equations first principles invention engineering why it works reasoning from scratch', tags:['science','physics','chemistry','maths','first principles'] },
    { id:'sci-ptable', title:'The Periodic Table', section:'science', sectionLabel:'First Principles', file:'sections/science.html', anchor:'#ptable', content:'periodic table elements chemistry carbon iron copper salt sodium calcium sulfur lead silver gold magnesium oxygen nitrogen atomic number symbol element categories metals', tags:['periodic table','elements','chemistry','metals'] },
    { id:'sci-constants', title:'Constants, Units & Conversions', section:'science', sectionLabel:'First Principles', file:'sections/science.html', anchor:'#constants', content:'constants units conversions gravity water density pressure temperature celsius fahrenheit metric imperial calories joules horsepower watts', tags:['constants','units','conversions','metric','imperial'] },
    { id:'sci-equations', title:'Equations That Matter', section:'science', sectionLabel:'First Principles', file:'sections/science.html', anchor:'#equations', content:'equations ohms law power voltage current mechanical advantage lever water pressure head pythagoras 3-4-5 heat energy gear ratio pulley projectile range battery runtime', tags:['equations','ohms law','lever','pressure','pythagoras','battery'] },
    { id:'sci-physics', title:'Physics First Principles', section:'science', sectionLabel:'First Principles', file:'sections/science.html', anchor:'#physics', content:'physics energy conservation heat transfer conduction convection radiation pressure fluids mechanical advantage levers pulleys insulation', tags:['physics','energy','heat','pressure','mechanical advantage'] },
    { id:'sci-chemistry', title:'Chemistry First Principles', section:'science', sectionLabel:'First Principles', file:'sections/science.html', anchor:'#chemistry', content:'chemistry acids bases pH scale neutralisation oxidation rust fire combustion preservation salt sugar fermentation distillation states of matter', tags:['chemistry','pH','acid','base','oxidation','distillation']},
    { id:'sci-maths', title:'Field Mathematics', section:'science', sectionLabel:'First Principles', file:'sections/science.html', anchor:'#maths', content:'field mathematics estimation measuring body span pace right angle 3-4-5 tree height river width area circle volume tank angles fist latitude geometry', tags:['maths','estimation','geometry','measuring','angles'] },
    { id:'sci-invention', title:'The Invention Method', section:'science', sectionLabel:'First Principles', file:'sections/science.html', anchor:'#invention', content:'invention method first principles thinking design loop prototype reverse engineering materials substitution analogy testing to failure safety factor improvise build your own systems workarounds', tags:['invention','design','prototype','first principles','improvise'] },

    /* NBC / EMP */
    { id:'nbc-overview', title:'NBC & EMP Threats Overview', section:'nbc', sectionLabel:'NBC Threats', file:'sections/nbc.html', anchor:'', content:'nuclear biological chemical EMP threats CBRN overview', tags:['NBC','nuclear','biological','chemical','EMP'] },
    { id:'nbc-nuclear', title:'Nuclear Threats & Blast Zones', section:'nbc', sectionLabel:'NBC Threats', file:'sections/nbc.html', anchor:'#nuclear', content:'nuclear detonation tactical dirty bomb RDD reactor accident blast radius fireball thermal pulse overpressure fallout', tags:['nuclear','blast','fireball','dirty bomb','fallout'] },
    { id:'nbc-fallout', title:'Fallout Shelter & 7-10 Rule', section:'nbc', sectionLabel:'NBC Threats', file:'sections/nbc.html', anchor:'#fallout', content:'fallout shelter 7-10 rule radiation decay protection factor PF basement concrete underground shelter in place', tags:['fallout','shelter','7-10 rule','protection factor','radiation'] },
    { id:'nbc-kfm', title:'Kearny Fallout Meter (KFM)', section:'nbc', sectionLabel:'NBC Threats', file:'sections/nbc.html', anchor:'#kfm', content:'KFM kearny fallout meter improvised dosimeter radiation measurement aluminum foil thread desiccant build DIY', tags:['KFM','dosimeter','radiation meter','kearny','fallout'] },
    { id:'nbc-ki', title:'Potassium Iodide (KI) Dosing', section:'nbc', sectionLabel:'NBC Threats', file:'sections/nbc.html', anchor:'#ki-dosing', content:'potassium iodide KI dosing thyroid iodine-131 reactor nuclear adult child infant dosage 130mg 65mg 32mg 16mg', tags:['KI','potassium iodide','thyroid','radiation','dosing'] },
    { id:'nbc-radsick', title:'Radiation Sickness Stages', section:'nbc', sectionLabel:'NBC Threats', file:'sections/nbc.html', anchor:'#rad-sickness', content:'radiation sickness ARS acute radiation syndrome stages subclinical mild moderate severe lethal dose rad supportive care decontamination', tags:['radiation sickness','ARS','dose','treatment'] },
    { id:'nbc-emp', title:'EMP — Electromagnetic Pulse', section:'nbc', sectionLabel:'NBC Threats', file:'sections/nbc.html', anchor:'#emp', content:'EMP electromagnetic pulse nuclear high altitude HEMP Carrington solar geomagnetic storm damage electronics grid recovery E1 E2 E3', tags:['EMP','electromagnetic pulse','Carrington','solar storm','grid'] },
    { id:'nbc-faraday', title:'Faraday Cage Construction', section:'nbc', sectionLabel:'NBC Threats', file:'sections/nbc.html', anchor:'#faraday', content:'faraday cage EMP protection metal trash can insulation no grounding nested shielding electronics protection ham radio charge controller', tags:['faraday','EMP protection','shielding','grounding','trash can'] },
    { id:'nbc-bio', title:'Biological Threats & Quarantine', section:'nbc', sectionLabel:'NBC Threats', file:'sections/nbc.html', anchor:'#biological', content:'biological threats pandemic engineered pathogen quarantine sick room PPE decontamination bleach alcohol disinfection vector control', tags:['biological','pandemic','quarantine','PPE','decontamination'] },
    { id:'nbc-diseases', title:'Disease Threat Table', section:'nbc', sectionLabel:'NBC Threats', file:'sections/nbc.html', anchor:'#diseases', content:'influenza cholera typhoid plague smallpox disease threats recognition incubation transmission treatment', tags:['cholera','typhoid','plague','smallpox','influenza','disease'] },
    { id:'nbc-chem', title:'Chemical Threats & Detection', section:'nbc', sectionLabel:'NBC Threats', file:'sections/nbc.html', anchor:'#chemical', content:'chemical threats detection nerve agent blister blood choking industrial chemicals shelter in place evacuate upwind uphill', tags:['chemical','nerve agent','SLUDGE','blister','choking','shelter in place'] },
    { id:'nbc-decon', title:'Decontamination Protocols', section:'nbc', sectionLabel:'NBC Threats', file:'sections/nbc.html', anchor:'#decon', content:'decontamination 80% rule remove clothing water flush soap biological radiological chemical universal decon', tags:['decontamination','decon','80% rule','wash','flush'] },

    /* DISASTERS */
    { id:'disasters-overview', title:'Disaster Playbooks Overview', section:'disasters', sectionLabel:'Disasters', file:'sections/disasters.html', anchor:'', content:'disaster playbooks earthquake hurricane wildfire flood pandemic grid-down civil unrest chemical spill EMP', tags:['disaster','playbook','emergency','response'] },
    { id:'disasters-earthquake', title:'Earthquake Response', section:'disasters', sectionLabel:'Disasters', file:'sections/disasters.html', anchor:'#earthquake', content:'earthquake drop cover hold on aftershock structural collapse search rescue gas leak fire building damage', tags:['earthquake','drop cover','aftershock','structural collapse'] },
    { id:'disasters-hurricane', title:'Hurricane Survival', section:'disasters', sectionLabel:'Disasters', file:'sections/disasters.html', anchor:'#hurricane', content:'hurricane typhoon cyclone shelter evacuation storm surge flood wind damage Katrina lesson attic axe', tags:['hurricane','storm surge','evacuation','shelter'] },
    { id:'disasters-wildfire', title:'Wildfire Evacuation', section:'disasters', sectionLabel:'Disasters', file:'sections/disasters.html', anchor:'#wildfire', content:'wildfire evacuation go bag fire shelter defensible space smoke air quality shelter structure survival', tags:['wildfire','evacuation','smoke','fire shelter'] },
    { id:'disasters-flood', title:'Flood Survival', section:'disasters', sectionLabel:'Disasters', file:'sections/disasters.html', anchor:'#flood', content:'flood flash flood evacuation route high ground water contamination sandbag vehicle escape drowning', tags:['flood','flash flood','evacuation','high ground'] },
    { id:'disasters-gridown', title:'Grid-Down / EMP Response', section:'disasters', sectionLabel:'Disasters', file:'sections/disasters.html', anchor:'#grid-down', content:'grid down EMP power outage generator fuel water storage food refrigeration communications alternative energy', tags:['grid down','EMP','power outage','generator'] },
    { id:'disasters-phases', title:'Phases of Collapse — A Timeline', section:'disasters', sectionLabel:'Disasters', file:'sections/disasters.html', anchor:'#phases', content:'phases of collapse timeline stages impact realisation adaptation rebuilding continuity 72 hours weeks months years die-off long term what to prep two is one one is none redundancy', tags:['collapse','timeline','phases','long-term','strategy'] },

    /* AGRICULTURE */
    { id:'agri-overview', title:'Agriculture & Food Production Overview', section:'agriculture', sectionLabel:'Agriculture', file:'sections/agriculture.html', anchor:'', content:'agriculture food production gardening crops livestock soil water planting calendar', tags:['agriculture','gardening','crops','soil','food production'] },
    { id:'agri-soil', title:'Soil Building Without Inputs', section:'agriculture', sectionLabel:'Agriculture', file:'sections/agriculture.html', anchor:'#soil', content:'soil building no inputs composting biochar vermicomposting sheet mulching no-till cover crops nitrogen fixation fertility', tags:['soil','composting','biochar','vermicomposting','fertility'] },
    { id:'agri-crops', title:'Crop Planning & Rotation', section:'agriculture', sectionLabel:'Agriculture', file:'sections/agriculture.html', anchor:'#crops', content:'crop rotation planning four year rotation legumes brassicas roots alliums companion planting three sisters', tags:['crop rotation','companion planting','three sisters','planning'] },
    { id:'agri-calendar', title:'Planting Calendar by Zone', section:'agriculture', sectionLabel:'Agriculture', file:'sections/agriculture.html', anchor:'#calendar', content:'planting calendar zone arctic cold temperate warm tropical month by month seasonal schedule seeds transplants harvest', tags:['planting calendar','zones','seasonal','seeds','harvest'] },
    { id:'agri-water', title:'Water Management & Irrigation', section:'agriculture', sectionLabel:'Agriculture', file:'sections/agriculture.html', anchor:'#water', content:'water management irrigation swale contour drip wicking beds rainwater harvest drought resilience keyline', tags:['irrigation','swale','rainwater','drought','water management'] },
    { id:'agri-livestock', title:'Livestock Management', section:'agriculture', sectionLabel:'Agriculture', file:'sections/agriculture.html', anchor:'#livestock', content:'livestock chickens goats rabbits pigs ducks bees management feeding breeding disease butchering', tags:['livestock','chickens','goats','rabbits','pigs','bees'] },
    { id:'agri-seeds', title:'Seed Saving', section:'agriculture', sectionLabel:'Agriculture', file:'sections/agriculture.html', anchor:'#seeds', content:'seed saving open pollinated heirloom isolation fermentation drying storage varieties year after year', tags:['seed saving','heirloom','open pollinated','isolation'] },
    { id:'agri-aqua', title:'Aquaponics', section:'agriculture', sectionLabel:'Agriculture', file:'sections/agriculture.html', anchor:'#aquaponics', content:'aquaponics fish plants nitrogen cycle tilapia catfish NFT media bed water culture integrated system', tags:['aquaponics','fish','nitrogen cycle','tilapia'] },

    /* METALLURGY */
    { id:'metal-overview', title:'Metallurgy & Blacksmithing Overview', section:'metallurgy', sectionLabel:'Metallurgy', file:'sections/metallurgy.html', anchor:'', content:'metallurgy blacksmithing forge anvil tools heat treating steel iron casting', tags:['metallurgy','blacksmithing','forge','anvil','steel'] },
    { id:'metal-forge', title:'Building a Forge', section:'metallurgy', sectionLabel:'Metallurgy', file:'sections/metallurgy.html', anchor:'#forge', content:'forge building brake drum forge pipe blower air supply fire pot coal charcoal coke refractory', tags:['forge','brake drum','coal','charcoal','blower'] },
    { id:'metal-technique', title:'Blacksmithing Techniques', section:'metallurgy', sectionLabel:'Metallurgy', file:'sections/metallurgy.html', anchor:'#technique', content:'blacksmithing hammer anvil drawing upsetting punching drifting bending welding forge weld heat color temperature', tags:['blacksmithing','hammer','drawing','forge weld','heat color'] },
    { id:'metal-heat', title:'Heat Treating & Tempering', section:'metallurgy', sectionLabel:'Metallurgy', file:'sections/metallurgy.html', anchor:'#heat-treating', content:'heat treating tempering quench hardening annealing normalizing steel carbon high medium low temperature color', tags:['heat treating','tempering','quench','hardening','annealing'] },
    { id:'metal-casting', title:'Metal Casting', section:'metallurgy', sectionLabel:'Metallurgy', file:'sections/metallurgy.html', anchor:'#casting', content:'metal casting crucible furnace sand casting green sand cope drag pattern pouring aluminum bronze copper', tags:['casting','crucible','sand casting','aluminum','bronze'] },

    /* CLIMATE & REGIONAL */
    { id:'climate-overview', title:'Climate & Regional Survival Overview', section:'climate', sectionLabel:'Climate & Regional', file:'sections/climate.html', anchor:'', content:'climate zones regional survival temperate maritime mediterranean continental tropical desert arctic UK foraging wild edibles', tags:['climate','regional','zones','UK','foraging','survival'] },
    { id:'climate-maritime', title:'Temperate Maritime Survival (UK)', section:'climate', sectionLabel:'Climate & Regional', file:'sections/climate.html', anchor:'#climate-zones', content:'temperate maritime UK Ireland Pacific NW hypothermia wet cold flooding ticks Lyme disease fog moorland hedgerow birch bark', tags:['maritime','UK','temperate','hypothermia','wet cold','flooding'] },
    { id:'climate-uk-focus', title:'United Kingdom Field Guide', section:'climate', sectionLabel:'Climate & Regional', file:'sections/climate.html', anchor:'#uk-focus', content:'UK survival guide foraging calendar water sources shelter fire starting navigation OS maps rights of way chalk streams moorland', tags:['UK','field guide','foraging','chalk streams','OS maps','shelter'] },
    { id:'climate-uk-edibles', title:'UK Wild Edibles A–Z', section:'climate', sectionLabel:'Climate & Regional', file:'sections/climate.html', anchor:'#uk-edibles', content:'UK wild edibles nettle wild garlic blackberry elder rosehip hawthorn hazel sloe crab apple sweet chestnut dandelion watercress samphire fungi chanterelle porcini', tags:['UK edibles','foraging','nettle','wild garlic','blackberry','mushrooms','plants'] },
    { id:'climate-hazards', title:'UK-Specific Hazards', section:'climate', sectionLabel:'Climate & Regional', file:'sections/climate.html', anchor:'#uk-hazards', content:'UK hazards hypothermia Lyme disease ticks flooding moorland bog cattle livestock toxic plants hemlock nightshade blue-green algae 999 mountain rescue', tags:['UK hazards','hypothermia','Lyme disease','flooding','toxic plants','999'] },
    { id:'climate-desert', title:'Desert / Arid Zone Survival', section:'climate', sectionLabel:'Climate & Regional', file:'sections/climate.html', anchor:'#climate-zones', content:'desert survival arid dehydration heat stroke solar still dew collection prickly pear wadi dry riverbed scorpion travel dawn dusk', tags:['desert','arid','dehydration','heat stroke','solar still','prickly pear'] },
    { id:'climate-arctic', title:'Subarctic / Arctic Survival', section:'climate', sectionLabel:'Climate & Regional', file:'sections/climate.html', anchor:'#climate-zones', content:'arctic subarctic survival frostbite hypothermia whiteout quinzhee snow trench carbon monoxide ice safety polar bear fish ptarmigan lichen', tags:['arctic','subarctic','frostbite','quinzhee','snow shelter','polar bear'] },
    { id:'climate-plant-safety', title:'Plant ID Safety Rules', section:'climate', sectionLabel:'Climate & Regional', file:'sections/climate.html', anchor:'#plant-safety', content:'plant identification safety rules hemlock water dropwort deadly nightshade lily of the valley lords ladies universal edibility test fungi death cap', tags:['plant safety','hemlock','nightshade','identification','universal edibility test','fungi'] },

    /* GOVERNANCE */
    { id:'gov-overview', title:'Community Governance Overview', section:'governance', sectionLabel:'Governance', file:'sections/governance.html', anchor:'', content:'community governance group organization council leadership roles decision making post collapse', tags:['governance','community','council','leadership','organization'] },
    { id:'gov-forming', title:'Forming a Group', section:'governance', sectionLabel:'Governance', file:'sections/governance.html', anchor:'#forming', content:'forming group optimal size Dunbar number 150 village squad platoon skill inventory free rider problem', tags:['group formation','Dunbar','group size','community','free rider'] },
    { id:'gov-roles', title:'Critical Community Roles', section:'governance', sectionLabel:'Governance', file:'sections/governance.html', anchor:'#roles', content:'critical roles medical officer security lead logistics communications agriculture council lead education construction engineering', tags:['roles','medical officer','security lead','logistics','community roles'] },
    { id:'gov-vetting', title:'Vetting Strangers & Probationary Membership', section:'governance', sectionLabel:'Governance', file:'sections/governance.html', anchor:'#vetting', content:'vetting strangers trust probationary membership information compartmentalization observe hold tier security non-negotiable rules', tags:['vetting','strangers','probation','trust','security'] },
    { id:'gov-models', title:'Governance Models', section:'governance', sectionLabel:'Governance', file:'sections/governance.html', anchor:'#governance', content:'governance models council meritocracy hybrid Althing Iroquois Swiss Landsgemeinde kibbutz scale quorum veto', tags:['governance models','council','meritocracy','Althing','Iroquois','hybrid'] },
    { id:'gov-tyranny', title:'Tyranny Warning Signs & Recall', section:'governance', sectionLabel:'Governance', file:'sections/governance.html', anchor:'#tyranny', content:'tyranny warning signs information control appointment creep resource asymmetry recall removal mechanism succession', tags:['tyranny','warning signs','recall','removal','succession'] },
    { id:'gov-justice', title:'Laws & Justice System', section:'governance', sectionLabel:'Governance', file:'sections/governance.html', anchor:'#justice', content:'laws justice conflict resolution mediation evidence standards punishment exile restorative punitive deterrent', tags:['justice','laws','conflict resolution','mediation','exile','punishment'] },
    { id:'gov-trade', title:'Trade & Post-Collapse Economics', section:'governance', sectionLabel:'Governance', file:'sections/governance.html', anchor:'#trade', content:'trade economics barter salt grain labor hours alcohol gold silver exchange ratio market day credit ledger hoarding black market', tags:['trade','barter','economics','exchange','market','hoarding'] },
    { id:'gov-outsiders', title:'Integrating Outsiders & Refugees', section:'governance', sectionLabel:'Governance', file:'sections/governance.html', anchor:'#outsiders', content:'outsiders refugees integration assessment skills to mouths ratio children orphans cultural integration probation', tags:['outsiders','refugees','integration','assessment','children'] },
    { id:'gov-records', title:'Record Keeping System', section:'governance', sectionLabel:'Governance', file:'sections/governance.html', anchor:'#records', content:'record keeping paper ledger archival acid-free membership register supply inventory decision log land registry trade ledger census', tags:['records','ledger','archival','registry','census','documentation'] },
    { id:'gov-templates', title:'Community Charter & Templates', section:'governance', sectionLabel:'Governance', file:'sections/governance.html', anchor:'#templates', content:'community charter template skill inventory membership agreement conflict resolution flowchart trade ledger printable', tags:['charter','template','skill inventory','membership','printable'] },

    /* PSYCHOLOGY */
    { id:'psych-overview', title:'Psychology & Morale Overview', section:'psychology', sectionLabel:'Psychology', file:'sections/psychology.html', anchor:'', content:'psychology morale trauma PTSD grief group dynamics survivor traits mental health crisis', tags:['psychology','morale','trauma','PTSD','mental health'] },
    { id:'psych-survive', title:'Who Survives & Why', section:'psychology', sectionLabel:'Psychology', file:'sections/psychology.html', anchor:'#survive', content:'who survives survivor traits Gonzales twelve traits perception curiosity decisiveness adaptability play calm leadership', tags:['survivor traits','Gonzales','who survives','psychology'] },
    { id:'psych-stress', title:'Acute Stress & Tactical Breathing', section:'psychology', sectionLabel:'Psychology', file:'sections/psychology.html', anchor:'#stress', content:'acute stress tactical breathing box breathing 4-4-4-4 cortisol adrenaline freeze panic response grounding 5-4-3-2-1', tags:['stress','tactical breathing','box breathing','grounding','panic'] },
    { id:'psych-trauma', title:'Trauma, Grief & PTSD', section:'psychology', sectionLabel:'Psychology', file:'sections/psychology.html', anchor:'#trauma', content:'trauma PTSD grief processing stages acute stress disorder psychological first aid moral injury survivors guilt', tags:['trauma','PTSD','grief','moral injury','psychological first aid'] },
    { id:'psych-morale', title:'Morale Management', section:'psychology', sectionLabel:'Psychology', file:'sections/psychology.html', anchor:'#morale', content:'morale management routine ritual celebration Shackleton leadership purpose meaning small wins recognition', tags:['morale','routine','Shackleton','leadership','meaning','ritual'] },
    { id:'psych-group', title:'Group Dynamics & Conflict', section:'psychology', sectionLabel:'Psychology', file:'sections/psychology.html', anchor:'#group', content:'group dynamics conflict factions scapegoating rumor control decision making under pressure leadership crisis', tags:['group dynamics','conflict','factions','rumor','decision making'] },
    { id:'psych-children', title:'Children in Crisis', section:'psychology', sectionLabel:'Psychology', file:'sections/psychology.html', anchor:'#children', content:'children crisis resilience age appropriate explanation routines play normalcy processing trauma regression school community', tags:['children','crisis','resilience','trauma','routine'] },

    /* CHEMISTRY */
    { id:'chem-overview', title:'Chemistry & Materials Overview', section:'chemistry', sectionLabel:'Chemistry', file:'sections/chemistry.html', anchor:'', content:'chemistry materials soap lye alcohol fermentation charcoal tanning dyes disinfectants vinegar', tags:['chemistry','soap','lye','alcohol','charcoal','tanning'] },
    { id:'chem-lye', title:'Lye from Wood Ash', section:'chemistry', sectionLabel:'Chemistry', file:'sections/chemistry.html', anchor:'#lye', content:'lye wood ash potassium hydroxide KOH leaching rain water hardwood ash lye testing potato egg float saponification', tags:['lye','wood ash','potassium hydroxide','KOH','leaching','saponification'] },
    { id:'chem-soap', title:'Soap Making (Cold Process)', section:'chemistry', sectionLabel:'Chemistry', file:'sections/chemistry.html', anchor:'#soap', content:'soap making cold process saponification tallow lard fat oil ash lye soft soap hard soap mold cure weeks', tags:['soap','cold process','saponification','tallow','lard','fat'] },
    { id:'chem-alcohol', title:'Alcohol Fermentation & Distillation', section:'chemistry', sectionLabel:'Chemistry', file:'sections/chemistry.html', anchor:'#alcohol', content:'alcohol fermentation distillation yeast sugar fruit grain ethanol methanol pot still column still wort wash', tags:['alcohol','fermentation','distillation','ethanol','methanol','still','yeast'] },
    { id:'chem-charcoal', title:'Activated Charcoal Production', section:'chemistry', sectionLabel:'Chemistry', file:'sections/chemistry.html', anchor:'#charcoal', content:'activated charcoal TLUD retort kiln biochar zinc chloride steam activation water filter adsorption', tags:['charcoal','activated charcoal','biochar','TLUD','adsorption','filter'] },
    { id:'chem-tanning', title:'Bark & Brain Tanning', section:'chemistry', sectionLabel:'Chemistry', file:'sections/chemistry.html', anchor:'#tanning', content:'tanning bark oak tannin brain brains hide leather brain tanning smoke process buckskin dehairing fleshing', tags:['tanning','bark tanning','brain tanning','leather','hide','buckskin'] },
    { id:'chem-dyes', title:'Natural Dyes & Mordants', section:'chemistry', sectionLabel:'Chemistry', file:'sections/chemistry.html', anchor:'#dyes', content:'natural dyes mordants alum iron tannin onion skin indigo weld woad walnut madder color fiber wool cotton', tags:['natural dyes','mordants','alum','indigo','onion skin','color'] },
    { id:'chem-disinfect', title:'Improvised Disinfectants', section:'chemistry', sectionLabel:'Chemistry', file:'sections/chemistry.html', anchor:'#disinfect', content:'disinfectants bleach hydrogen peroxide alcohol pine tar creosote phenol improvised antiseptic surface disinfection', tags:['disinfectants','bleach','alcohol','antiseptic','hydrogen peroxide'] },

    /* TEXTILES */
    { id:'text-overview', title:'Textiles & Clothing Overview', section:'textiles', sectionLabel:'Textiles', file:'sections/textiles.html', anchor:'', content:'textiles clothing fiber spinning weaving knitting sewing leather waterproofing cotton wool', tags:['textiles','clothing','fiber','spinning','weaving','leather'] },
    { id:'text-fiber', title:'Fiber Sources & Processing', section:'textiles', sectionLabel:'Textiles', file:'sections/textiles.html', anchor:'#fiber', content:'fiber sources wool cotton flax linen hemp nettles animal plant processing carding combing retting retting scutching', tags:['fiber','wool','cotton','flax','hemp','carding','spinning'] },
    { id:'text-spinning', title:'Drop Spindle & Spinning', section:'textiles', sectionLabel:'Textiles', file:'sections/textiles.html', anchor:'#spinning', content:'drop spindle spinning wheel yarn ply twist draft drafting whorl spindle DIY wood disk dowel', tags:['drop spindle','spinning','yarn','ply','twist'] },
    { id:'text-weaving', title:'Weaving on a Frame Loom', section:'textiles', sectionLabel:'Textiles', file:'sections/textiles.html', anchor:'#weaving', content:'weaving loom warp weft plain weave twill shed heddle shuttle frame loom backstrap cardweaving', tags:['weaving','loom','warp','weft','plain weave','twill'] },
    { id:'text-sewing', title:'Hand Sewing & Repair', section:'textiles', sectionLabel:'Textiles', file:'sections/textiles.html', anchor:'#sewing', content:'hand sewing repair patch darning saddle stitch running stitch backstitch waxed thread needle awl buttonhole', tags:['sewing','repair','patch','saddle stitch','darning','needle'] },
    { id:'text-leather', title:'Leather Working', section:'textiles', sectionLabel:'Textiles', file:'sections/textiles.html', anchor:'#leather', content:'leather working stitching awl waxed thread saddler stitch harness moccasin boots belt pouch punch needle', tags:['leather','saddler stitch','awl','moccasin','boots'] },
    { id:'text-waterproof', title:'Waterproofing & Treatment', section:'textiles', sectionLabel:'Textiles', file:'sections/textiles.html', anchor:'#waterproof', content:'waterproofing wax canvas oilskin lanolin pine tar linseed oil treatment clothing repellent wet cotton hypothermia warning', tags:['waterproofing','wax','oilskin','lanolin','pine tar','wet cotton'] },

    /* VEHICLES */
    { id:'veh-overview', title:'Vehicles & Transport Overview', section:'vehicles', sectionLabel:'Vehicles', file:'sections/vehicles.html', anchor:'', content:'vehicles transport engine repair fuel biodiesel wood gas ethanol bicycle animal boat', tags:['vehicles','transport','engine','fuel','bicycle','biodiesel'] },
    { id:'veh-repair', title:'Basic Engine Repair', section:'vehicles', sectionLabel:'Vehicles', file:'sections/vehicles.html', anchor:'#repair', content:'engine repair diagnostic SFEC spark fuel engine compression carburetor battery ignition alternator belt fluid check', tags:['engine repair','diagnostic','SFEC','spark','compression','carburetor'] },
    { id:'veh-biodiesel', title:'Biodiesel Production', section:'vehicles', sectionLabel:'Vehicles', file:'sections/vehicles.html', anchor:'#biodiesel', content:'biodiesel production vegetable oil NaOH sodium hydroxide methanol transesterification glycerin batch recipe liter', tags:['biodiesel','vegetable oil','transesterification','methanol','NaOH','fuel'] },
    { id:'veh-woodgas', title:'Wood Gas Gasifier', section:'vehicles', sectionLabel:'Vehicles', file:'sections/vehicles.html', anchor:'#woodgas', content:'wood gas gasifier downdraft updraft generator vehicle run fuel producer gas syngas carbon monoxide Sweden WWII history', tags:['wood gas','gasifier','downdraft','producer gas','syngas','Sweden'] },
    { id:'veh-bicycle', title:'Bicycle Maintenance & Use', section:'vehicles', sectionLabel:'Vehicles', file:'sections/vehicles.html', anchor:'#bicycle', content:'bicycle maintenance repair tire tube patch chain derailleur brake cable spoke tension cargo trailer hauling', tags:['bicycle','maintenance','chain','tire','cargo','trailer'] },
    { id:'veh-animal', title:'Draft Animal Transport', section:'vehicles', sectionLabel:'Vehicles', file:'sections/vehicles.html', anchor:'#animal', content:'draft animal horse mule donkey ox cart harness collar collar hitch wagon team plowing cultivation', tags:['draft animal','horse','mule','ox','harness','wagon'] },
    { id:'veh-boat', title:'Boats & Water Transport', section:'vehicles', sectionLabel:'Vehicles', file:'sections/vehicles.html', anchor:'#boat', content:'boat construction flat bottom skiff plywood canoe dugout portage paddle oar sail river lake transport', tags:['boat','flat bottom','skiff','plywood','canoe','paddle'] },

    /* ANIMAL HUSBANDRY */
    { id:'animal-overview', title:'Animal Husbandry Overview', section:'animal', sectionLabel:'Animal Husbandry', file:'sections/animal.html', anchor:'', content:'animal husbandry livestock chickens goats rabbits cattle pigs veterinary care slaughter breeding', tags:['animal husbandry','livestock','veterinary','breeding','slaughter'] },
    { id:'animal-chickens', title:'Chickens — Laying Hens & Meat Breeds', section:'animal', sectionLabel:'Animal Husbandry', file:'sections/animal.html', anchor:'#chickens', content:'chickens laying hens meat breeds Rhode Island Red Plymouth Rock Cornish cross egg production feed grain scratch water housing coop predator proofing', tags:['chickens','hens','eggs','coop','poultry','laying'] },
    { id:'animal-goats', title:'Goats — Dairy & Meat', section:'animal', sectionLabel:'Animal Husbandry', file:'sections/animal.html', anchor:'#goats', content:'goats dairy Nubian Alpine LaMancha meat Boer milk production breeding kidding minerals deworming parasite fencing browse', tags:['goats','dairy','milk','Nubian','Boer','kidding','deworming'] },
    { id:'animal-rabbits', title:'Rabbits for Meat & Fiber', section:'animal', sectionLabel:'Animal Husbandry', file:'sections/animal.html', anchor:'#rabbits', content:'rabbits meat breed New Zealand Californian fiber Angora hutch housing breeding gestation litter butchering pelts', tags:['rabbits','meat','Angora','fiber','hutch','breeding'] },
    { id:'animal-cattle', title:'Cattle — Beef & Dairy', section:'animal', sectionLabel:'Animal Husbandry', file:'sections/animal.html', anchor:'#cattle', content:'cattle beef dairy milking Dexter Guernsey Jersey breeding calving pasture rotation worming vaccination herd management', tags:['cattle','beef','dairy','milking','calving','pasture'] },
    { id:'animal-pigs', title:'Pigs — Raising & Processing', section:'animal', sectionLabel:'Animal Husbandry', file:'sections/animal.html', anchor:'#pigs', content:'pigs hogs swine heritage breed Berkshire Large Black foraging pasture raising feeding slaughter butchering lard curing ham', tags:['pigs','hogs','swine','Berkshire','lard','butchering'] },
    { id:'animal-vet', title:'Field Veterinary Care', section:'animal', sectionLabel:'Animal Husbandry', file:'sections/animal.html', anchor:'#veterinary', content:'field veterinary care wound dressing abscess infection deworming parasite FAMACHA eye score ivermectin penicillin temperature normal vital signs', tags:['veterinary','wound','parasite','deworming','ivermectin','FAMACHA'] },
    { id:'animal-bees', title:'Beekeeping Basics', section:'animal', sectionLabel:'Animal Husbandry', file:'sections/animal.html', anchor:'#bees', content:'beekeeping langstroth top bar hive honey beeswax propolis colony inspection varroa mite treatment queen swarm split harvest extraction', tags:['beekeeping','bees','honey','beeswax','hive','varroa','swarm'] },
    { id:'animal-dogs', title:'Working Dogs', section:'animal', sectionLabel:'Animal Husbandry', file:'sections/animal.html', anchor:'#working-dogs', content:'working dogs guard dog early warning livestock guardian herding hunting vermin rat terrier security barking feeding scraps raw bones training breeding watch', tags:['working dogs','guard dog','herding','security','hunting'] },

    /* VETERINARY CARE */
    { id:'vet-overview', title:'Veterinary Care Without a Vet', section:'veterinary', sectionLabel:'Veterinary Care', file:'sections/veterinary.html', anchor:'', content:'veterinary livestock health sick animal disease treatment without a vet cattle goats sheep pigs poultry rabbits', tags:['veterinary','livestock','disease','health'] },
    { id:'vet-vitals', title:'Animal Vital Signs', section:'veterinary', sectionLabel:'Veterinary Care', file:'sections/veterinary.html', anchor:'#vitals', content:'normal vital signs temperature heart rate breathing cattle goat sheep pig horse chicken rabbit thermometer daily health check', tags:['vital signs','temperature','heart rate','livestock'] },
    { id:'vet-sick', title:'Recognising a Sick Animal', section:'veterinary', sectionLabel:'Veterinary Care', file:'sections/veterinary.html', anchor:'#sick', content:'sick animal signs off feed not chewing cud separating dull eyes scouring diarrhoea fever isolate bloat', tags:['sick animal','symptoms','fever','bloat'] },
    { id:'vet-diseases', title:'Common Livestock Diseases', section:'veterinary', sectionLabel:'Veterinary Care', file:'sections/veterinary.html', anchor:'#diseases', content:'bloat milk fever mastitis pneumonia foot rot scours erysipelas coccidiosis egg binding GI stasis snuffles zoonoses anthrax brucellosis', tags:['bloat','mastitis','pneumonia','disease','zoonoses']},
    { id:'vet-parasites', title:'Livestock Parasites & Deworming', section:'veterinary', sectionLabel:'Veterinary Care', file:'sections/veterinary.html', anchor:'#parasites', content:'parasites worms deworming FAMACHA barber pole worm anaemia bottle jaw pasture rotation lice mites mange fly strike ticks', tags:['parasites','worms','deworming','FAMACHA','fly strike'] },
    { id:'vet-wounds', title:'Animal Wounds, Abscesses & Hoof Care', section:'veterinary', sectionLabel:'Veterinary Care', file:'sections/veterinary.html', anchor:'#wounds', content:'animal wound care abscess lance drain hoof trimming foot rot caseous lymphadenitis tetanus livestock', tags:['wounds','abscess','hoof','foot rot'] },
    { id:'vet-birthing', title:'Animal Birthing & Dystocia', section:'veterinary', sectionLabel:'Veterinary Care', file:'sections/veterinary.html', anchor:'#birthing', content:'animal birthing calving kidding lambing farrowing dystocia presentation breech colostrum retained placenta navel iodine', tags:['birthing','calving','dystocia','colostrum'] },
    { id:'vet-biosecurity', title:'Biosecurity, Quarantine & Culling', section:'veterinary', sectionLabel:'Veterinary Care', file:'sections/veterinary.html', anchor:'#biosecurity', content:'biosecurity quarantine new animal isolate disease prevention carcass disposal culling humane slaughter when to cull', tags:['biosecurity','quarantine','culling','disease prevention'] },

    /* PREGNANCY & INFANT CARE */
    { id:'mat-overview', title:'Pregnancy, Birth & Infant Care', section:'maternal', sectionLabel:'Pregnancy & Infant Care', file:'sections/maternal.html', anchor:'', content:'pregnancy birth infant care midwife childbirth labour delivery postpartum newborn baby without a hospital book for midwives', tags:['pregnancy','birth','infant','newborn','midwife'] },
    { id:'mat-prenatal', title:'Prenatal Care', section:'maternal', sectionLabel:'Pregnancy & Infant Care', file:'sections/maternal.html', anchor:'#prenatal', content:'prenatal care pregnancy nutrition iron anaemia due date pre-eclampsia warning signs swelling headache movement', tags:['prenatal','pregnancy','nutrition','pre-eclampsia'] },
    { id:'mat-labour', title:'Labour & Normal Birth', section:'maternal', sectionLabel:'Pregnancy & Infant Care', file:'sections/maternal.html', anchor:'#labour', content:'labour stages contractions cervix pushing crowning delivery placenta third stage cord clamp cut birth', tags:['labour','birth','delivery','contractions','placenta'] },
    { id:'mat-danger', title:'Birth Danger Signs', section:'maternal', sectionLabel:'Pregnancy & Infant Care', file:'sections/maternal.html', anchor:'#danger-birth', content:'postpartum haemorrhage heavy bleeding after birth uterine massage obstructed labour cord prolapse eclampsia seizure misoprostol oxytocin', tags:['postpartum haemorrhage','bleeding','obstructed labour','cord prolapse','eclampsia'] },
    { id:'mat-postpartum', title:'Postpartum Care', section:'maternal', sectionLabel:'Pregnancy & Infant Care', file:'sections/maternal.html', anchor:'#postpartum', content:'postpartum care mother bleeding lochia infection fever rest iron perineum baby blues depression', tags:['postpartum','recovery','infection','mental health'] },
    { id:'mat-newborn', title:'Newborn Care & Resuscitation', section:'maternal', sectionLabel:'Pregnancy & Infant Care', file:'sections/maternal.html', anchor:'#newborn', content:'newborn care dry warm skin to skin not breathing rescue breaths resuscitation cord stump jaundice colostrum first hours', tags:['newborn','resuscitation','jaundice','cord care'] },
    { id:'mat-feeding', title:'Breastfeeding & Infant Feeding', section:'maternal', sectionLabel:'Pregnancy & Infant Care', file:'sections/maternal.html', anchor:'#feeding', content:'breastfeeding latch milk supply mastitis cracked nipples wet nurse formula weaning solids colostrum infant feeding', tags:['breastfeeding','latch','milk supply','feeding'] },
    { id:'mat-infant-danger', title:'Infant Illness Danger Signs', section:'maternal', sectionLabel:'Pregnancy & Infant Care', file:'sections/maternal.html', anchor:'#infant-danger', content:'infant illness danger signs baby won’t feed fast breathing floppy fever dehydration convulsions jaundice sepsis pneumonia oral rehydration', tags:['infant illness','dehydration','sepsis','danger signs'] },

    /* PRACTICAL PROJECTS */
    { id:'proj-overview', title:'Practical Projects', section:'projects', sectionLabel:'Practical Projects', file:'sections/projects.html', anchor:'', content:'practical projects how to build make cooling aircon air filter dam hydro pump water toilet radiation mill breeding food storage self reliance', tags:['projects','build','how-to','diy'] },
    { id:'proj-cooling', title:'Evaporative Cooling & DIY Air Conditioning', section:'projects', sectionLabel:'Practical Projects', file:'sections/projects.html', anchor:'#cooling', content:'how to make air conditioning aircon evaporative cooling swamp cooler zeer pot fridge wet sheet fan ice passive cooling earth tube shade thermal mass', tags:['cooling','aircon','evaporative','zeer','swamp cooler'] },
    { id:'proj-airfilter', title:'Air Filtration & Clean Air', section:'projects', sectionLabel:'Practical Projects', file:'sections/projects.html', anchor:'#airfilter', content:'air filter filtration clean air box fan corsi rosenthal cube MERV HEPA smoke wildfire dust mask activated charcoal carbon monoxide shelter air', tags:['air filter','smoke','HEPA','box fan','clean air'] },
    { id:'proj-dams', title:'Dams & Hydro Power', section:'projects', sectionLabel:'Practical Projects', file:'sections/projects.html', anchor:'#dams', content:'how to build dam power dam hydro dam hydroelectric check dam weir gabion spillway head flow pelton wheel water wheel penstock micro hydro', tags:['dam','hydro','power dam','water wheel','pelton'] },
    { id:'proj-pumping', title:'Pumping Water Without Power', section:'projects', sectionLabel:'Practical Projects', file:'sections/projects.html', anchor:'#pumping', content:'how to pump water without power hydraulic ram pump rope washer pump hand pump treadle archimedes screw chain pump shadoof siphon well irrigation', tags:['pump water','ram pump','hand pump','siphon','irrigation'] },
    { id:'proj-toilets', title:'Toilets & Sanitation Systems', section:'projects', sectionLabel:'Practical Projects', file:'sections/projects.html', anchor:'#toilets', content:'how to build a toilet composting humanure sawdust bucket pit latrine VIP twin pit arborloo siting distance from water handwashing tippy tap sanitation', tags:['toilet','latrine','composting','sanitation','humanure'] },
    { id:'proj-radiation', title:'Checking for Radiation', section:'projects', sectionLabel:'Practical Projects', file:'sections/projects.html', anchor:'#radiation', content:'how to check for radiation geiger counter dosimeter kearny fallout meter KFM electroscope time distance shielding 7/10 rule decontamination fallout nuclear', tags:['radiation','geiger','dosimeter','KFM','fallout'] },
    { id:'proj-mill', title:'Building a Grain Mill', section:'projects', sectionLabel:'Practical Projects', file:'sections/projects.html', anchor:'#mill', content:'how to build a mill grain mill quern stone rotary saddle burr plate mill flour grinding water wheel windmill pedal animal horse mill wheat maize', tags:['mill','grain','quern','flour','grinding'] },
    { id:'proj-breeding', title:'Breeding Herd Animals & Chickens', section:'projects', sectionLabel:'Practical Projects', file:'sections/projects.html', anchor:'#breeding', content:'how to breed herd animals chickens rooster fertile eggs broody hen incubator 21 days candling chicks goats sheep cattle pigs gestation inbreeding bloodline selection', tags:['breeding','chickens','livestock','incubation','genetics'] },
    { id:'proj-storage', title:'Long-Term Food Storage', section:'projects', sectionLabel:'Practical Projects', file:'sections/projects.html', anchor:'#storage', content:'how to store food long term storage grains beans rice mylar bags oxygen absorbers food grade buckets root cellar canning drying salting fermenting pests weevils diatomaceous earth rotation', tags:['food storage','grain','mylar','root cellar','preservation'] },
    { id:'proj-waterfilter', title:'DIY Gravity Bio-Water Filter', section:'projects', sectionLabel:'Practical Projects', file:'sections/projects.html', anchor:'#waterfilter', content:'how to build water filter gravity bio sand filter biosand charcoal gravel ceramic pot colloidal silver continuous no power filter murky water clean drinking', tags:['water filter','biosand','charcoal','ceramic','gravity filter'] },
    { id:'proj-salt', title:'Making Salt', section:'projects', sectionLabel:'Practical Projects', file:'sections/projects.html', anchor:'#salt', content:'how to make salt production seawater evaporation salt pan boiling brine salt spring lick rock salt halite electrolytes preservation curing', tags:['salt','salt production','evaporation','seawater','preservation'] },
    { id:'proj-firefighting', title:'Firefighting Without a Brigade', section:'projects', sectionLabel:'Practical Projects', file:'sections/projects.html', anchor:'#firefighting', content:'how to fight a fire firefighting without fire brigade smother water sand blanket grease oil fire electrical fire firebreak chimney creosote prevention escape plan', tags:['firefighting','fire safety','grease fire','firebreak'] },

    /* OFFLINE MAPS */
    { id:'maps', title:'Offline Maps — In Your Browser', section:'maps', sectionLabel:'Offline Maps', file:'maps.html', anchor:'', content:'offline map browser pmtiles openstreetmap leaflet protomaps northern england yorkshire GPS locate navigation no internet vector tiles minimal server raspberry pi extract region', tags:['maps','offline','pmtiles','GPS','navigation','openstreetmap'] },

    /* EXPANSION LIBRARY */
    { id:'expansion', title:'Expansion Library — Wikipedia, Gutenberg & Offline Maps', section:'expansion', sectionLabel:'Expansion Library', file:'expansion.html', anchor:'', content:'expansion library kiwix zim wikipedia offline project gutenberg download all human knowledge medical wikipedia wikimed simple english wiktionary ifixit wikivoyage wikibooks wikisource encyclopedia pen drive offline reader maps offline map navigation GPS organic maps osmand geofabrik openstreetmap osm topographic contour UK England Great Britain protomaps pmtiles ordnance survey', tags:['kiwix','zim','wikipedia','gutenberg','offline','expansion','download','maps','navigation','GPS','osm'] },

    /* TOOLS (ROOT LEVEL) */
    { id:'tools-calc', title:'Survival Calculators & Tools', section:'tools', sectionLabel:'Tools', file:'tools.html', anchor:'', content:'calculators calorie water solar sizing supply tracker skill inventory planting calendar bug out decision radio frequencies medication interactive tools', tags:['calculators','tools','calorie','water','solar','supply tracker'] },
    { id:'tools-calorie', title:'Calorie Needs Calculator', section:'tools', sectionLabel:'Tools', file:'tools.html', anchor:'#tool-1', content:'calorie calculator BMR daily needs people group age gender activity level food supply days remaining', tags:['calorie','calculator','BMR','food supply','days remaining'] },
    { id:'tools-water', title:'Water Requirements Calculator', section:'tools', sectionLabel:'Tools', file:'tools.html', anchor:'#tool-2', content:'water requirements calculator climate activity stored collected needed daily liters gallons', tags:['water','calculator','requirements','climate','activity'] },
    { id:'tools-solar', title:'Solar Sizing Tool', section:'tools', sectionLabel:'Tools', file:'tools.html', anchor:'#tool-3', content:'solar sizing tool panel watts battery bank watt hours sun hours depth of discharge loads calculator', tags:['solar','sizing','panel','battery','watt hours','calculator'] },
    { id:'tools-supply', title:'Supply Tracker', section:'tools', sectionLabel:'Tools', file:'tools.html', anchor:'#tool-4', content:'supply tracker inventory days remaining items consumption rate CSV export storage tracking', tags:['supply tracker','inventory','days remaining','consumption'] },
    { id:'tools-skills', title:'Community Skill Inventory', section:'tools', sectionLabel:'Tools', file:'tools.html', anchor:'#tool-5', content:'skill inventory community 22 skills medical agricultural mechanical radio beginner intermediate expert gap detection', tags:['skill inventory','community','skills','gap detection'] },
    { id:'tools-planting', title:'Planting Calendar', section:'tools', sectionLabel:'Tools', file:'tools.html', anchor:'#tool-6', content:'planting calendar USDA zone month direct sow start indoors harvest frost date crops vegetables zone 3 4 5 6 7 8 9 10', tags:['planting calendar','zone','frost','seeds','harvest','direct sow'] },
    { id:'tools-bugout', title:'Bug-Out Decision Tree', section:'tools', sectionLabel:'Tools', file:'tools.html', anchor:'#tool-7', content:'bug out decision tree stay go shelter in place evacuate immediate danger yes no interactive checklist recommendation', tags:['bug out','stay','go','evacuation','decision tree','shelter in place'] },
    { id:'tools-radio', title:'Emergency Radio Frequencies', section:'tools', sectionLabel:'Tools', file:'tools.html', anchor:'#tool-8', content:'radio frequencies NOAA VHF UHF ham calling marine CB channel 16 9 FRS MURS GMRS Meshtastic LoRa emergency custom', tags:['radio','frequencies','NOAA','ham','CB','marine','FRS','GMRS'] },
    { id:'tools-meds', title:'Medication Reference & Drug Interactions', section:'tools', sectionLabel:'Tools', file:'tools.html', anchor:'#tool-9', content:'medication reference drug interactions amoxicillin doxycycline ciprofloxacin metronidazole ibuprofen acetaminophen epinephrine naloxone potassium iodide dosage checker', tags:['medication','drugs','antibiotics','interactions','dosage','reference'] },
    { id:'tools-antibiotic', title:'Antibiotic Dosing Calculator', section:'tools', sectionLabel:'Tools', file:'tools.html', anchor:'#tool-10', content:'antibiotic dosing calculator weight based mg per kg pediatric child adult amoxicillin augmentin cephalexin azithromycin doxycycline bactrim co-trimoxazole metronidazole ciprofloxacin dose per kg tablets suspension milligrams', tags:['antibiotic','dosing','calculator','weight based','pediatric','mg/kg'] },
    { id:'tools-timer', title:'Survival Timer & Priorities', section:'tools', sectionLabel:'Tools', file:'tools.html', anchor:'#tool-11', content:'survival timer countdown rule of three 3 minutes air hours shelter days water weeks food boil water bleach contact CPR cycle tourniquet reassess ORS beep', tags:['timer','countdown','rule of 3','priorities'] },
    { id:'tools-latitude', title:'Celestial Latitude Finder', section:'tools', sectionLabel:'Tools', file:'tools.html', anchor:'#tool-12', content:'celestial navigation latitude finder polaris north star altitude noon sun declination sextant no GPS find position degrees north south', tags:['latitude','celestial','navigation','polaris','sun','no GPS'] },
    { id:'tools-firewood', title:'Firewood & Heating Estimator', section:'tools', sectionLabel:'Tools', file:'tools.html', anchor:'#tool-13', content:'firewood heating estimator BTU cords seasoned hardwood wood stove how much wood to heat space winter days insulation', tags:['firewood','heating','BTU','cords','wood','winter'] },
    { id:'tools-crop', title:'Crop Spacing & Seed Planner', section:'tools', sectionLabel:'Tools', file:'tools.html', anchor:'#tool-14', content:'crop spacing seed planner plants per bed garden square feet how many seeds germination yield days to harvest tomato potato bean carrot lettuce onion cabbage', tags:['crop','spacing','seeds','garden','planting','yield'] },

    /* LITERATURE */
    { id:'lit-overview', title:'Reference Library — 60 Books', section:'literature', sectionLabel:'Reference Library', file:'literature.html', anchor:'', content:'reference library books 60 survival preparedness medicine agriculture engineering communications security psychology history', tags:['library','books','reference','survival','reading list'] },
    { id:'lit-medicine', title:'Medical Reference Books', section:'literature', sectionLabel:'Reference Library', file:'literature.html', anchor:'', content:'where there is no doctor werner dentist emergency war surgery NATO nuclear war survival skills kearny ditch medicine wilderness medicine', tags:['medical books','where there is no doctor','werner','kearny','ditch medicine'] },
    { id:'lit-agriculture', title:'Agriculture & Food Books', section:'literature', sectionLabel:'Reference Library', file:'literature.html', anchor:'', content:'encyclopedia country living emery gardening when it counts solomon humanure handbook jenkins seed to seed ashworth four season harvest', tags:['agriculture books','emery','solomon','jenkins','humanure','seed saving'] },
    { id:'lit-engineering', title:'Engineering & Energy Books', section:'literature', sectionLabel:'Reference Library', file:'literature.html', anchor:'', content:'when technology fails stein foxfire book wigginton back to basics army survival manual solar living sourcebook', tags:['engineering books','stein','foxfire','army survival manual','solar'] },
    { id:'lit-72hr', title:'72-Hour Reading List', section:'literature', sectionLabel:'Reference Library', file:'literature.html', anchor:'', content:'72 hour reading list five books emergency where there is no doctor nuclear war survival SAS survival handbook deep survival encyclopedia country living', tags:['72 hour','reading list','emergency','must read'] },

    /* AI SETUP */
    { id:'ai-setup', title:'Bunker Bot Setup Guide', section:'ai-setup', sectionLabel:'Bunker Bot Setup', file:'ai-setup.html', anchor:'', content:'Bunker Bot ollama AI setup llama3 gemma3 phi3 install download model offline local LLM', tags:['Bunker Bot','ollama','AI','LLM','setup'] },

    /* QUICK REFERENCE */
    { id:'quick-ref', title:'Emergency Quick Reference Card', section:'quick-reference', sectionLabel:'Quick Reference', file:'quick-reference.html', anchor:'', content:'emergency quick reference card printable critical information first aid water purification signals', tags:['emergency','quick reference','printable','card'] },

    /* GEAR LIST */
    { id:'gear-overview', title:'Master Gear List', section:'gear', sectionLabel:'Gear List', file:'gear.html', anchor:'', content:'gear list checklist equipment supplies critical important preparedness readiness checklist survival kit', tags:['gear','checklist','equipment','supplies','kit'] },
    { id:'gear-water', title:'Water & Purification Gear', section:'gear', sectionLabel:'Gear List', file:'gear.html', anchor:'#cat-water', content:'water filter purification bleach iodine tablets storage containers LifeStraw Sawyer', tags:['gear','water','filter','purification'] },
    { id:'gear-medical', title:'Medical Gear & First Aid Supplies', section:'gear', sectionLabel:'Gear List', file:'gear.html', anchor:'#cat-medical', content:'tourniquet hemostatic gauze first aid supplies trauma kit medical equipment medications antibiotics', tags:['gear','medical','first aid','tourniquet'] },
    { id:'gear-bob', title:'Bug-Out Bag Contents', section:'gear', sectionLabel:'Gear List', file:'gear.html', anchor:'#cat-bob', content:'bug out bag 72 hour kit go bag evacuation backpack essentials food water shelter fire navigation', tags:['gear','bug out bag','72 hour','go bag'] },

    /* BUNKER BOT PROMPT */
    { id:'aria-prompt', title:'Bunker Bot System Prompt', section:'aria-prompt', sectionLabel:'Bunker Bot Prompt', file:'bunker-bot-prompt.html', anchor:'', content:'Bunker Bot system prompt copy ChatGPT Claude Gemini Ollama AI persona survival assistant instructions Modelfile', tags:['Bunker Bot','system prompt','ChatGPT','Claude','Ollama','AI'] },

    /* CHANGELOG */
    { id:'changelog', title:'Changelog & Version History', section:'changelog', sectionLabel:'Changelog', file:'changelog.html', anchor:'', content:'changelog version history updates improvements release notes what changed', tags:['changelog','version','history','updates'] },
  ];

  /* =================== STOP WORDS =================== */
  const STOP_WORDS = new Set(['a','an','the','and','or','but','in','on','at','to','for','of','with','by','from','how','what','when','where','which','who','is','are','was','were','be','been','have','has','had','do','does','did','will','would','could','should','may','might','can','i','we','you','it','its','this','that','these','those','if','not','no','all','also','just','so','as','up']);

  /* =================== SEARCH ENGINE =================== */
  function tokenize(text) {
    return text.toLowerCase()
      .replace(/[^a-z0-9\s]/g, ' ')
      .split(/\s+/)
      .filter(w => w.length > 1 && !STOP_WORDS.has(w));
  }

  function scoreEntry(entry, queryTokens) {
    let score = 0;
    const titleTokens   = tokenize(entry.title);
    const contentTokens = tokenize(entry.content);
    const tagTokens     = entry.tags.flatMap(t => tokenize(t));

    for (const q of queryTokens) {
      /* Exact title word match */
      if (titleTokens.some(t => t === q)) score += 15;
      /* Title starts-with */
      else if (titleTokens.some(t => t.startsWith(q))) score += 10;
      /* Tag exact match */
      if (tagTokens.some(t => t === q)) score += 8;
      /* Tag starts-with */
      else if (tagTokens.some(t => t.startsWith(q))) score += 5;
      /* Content match */
      const contentMatches = contentTokens.filter(t => t === q || t.startsWith(q)).length;
      score += contentMatches * 2;
    }

    /* Boost if all query tokens match */
    const allMatch = queryTokens.every(q =>
      [...titleTokens, ...contentTokens, ...tagTokens].some(t => t.startsWith(q)));
    if (allMatch && queryTokens.length > 1) score += 20;

    return score;
  }

  function search(query) {
    if (!query || query.trim().length < 2) return [];
    const tokens = tokenize(query);
    if (tokens.length === 0) return [];

    const results = SEARCH_INDEX
      .map(entry => ({ entry, score: scoreEntry(entry, tokens) }))
      .filter(r => r.score > 0)
      .sort((a, b) => b.score - a.score)
      .slice(0, 10)
      .map(r => r.entry);

    return results;
  }

  /* =================== UI =================== */
  function renderResults(results, query) {
    const container = document.getElementById('search-results');
    if (!container) return;

    if (results.length === 0) {
      container.innerHTML = `<div class="search-no-results">No results for "<strong>${escapeHtml(query)}</strong>"</div>`;
      container.classList.add('active');
      return;
    }

    const isSection = window.location.pathname.includes('/sections/');
    const base = isSection ? '../' : '';

    /* Group by section */
    const groups = {};
    results.forEach(r => {
      if (!groups[r.sectionLabel]) groups[r.sectionLabel] = [];
      groups[r.sectionLabel].push(r);
    });

    let globalIdx = 0;
    let html = `<div class="search-count">${results.length} result${results.length === 1 ? '' : 's'}</div>`;
    Object.entries(groups).forEach(([label, items]) => {
      html += `<div class="search-group-label">${escapeHtml(label)}</div>`;
      items.forEach(r => {
        html += `<a href="${base}${r.file}${r.anchor}" class="search-result-item" data-idx="${globalIdx++}" role="option">
          <div class="result-title">${highlightMatch(r.title, query)}</div>
        </a>`;
      });
    });

    container.innerHTML = html;
    container.classList.add('active');
  }

  function highlightMatch(text, query) {
    const tokens = tokenize(query);
    let result = escapeHtml(text);
    tokens.forEach(t => {
      const re = new RegExp(`(${t})`, 'gi');
      result = result.replace(re, '<mark style="background:var(--amber-dim);color:var(--amber-light);border-radius:2px;padding:0 2px">$1</mark>');
    });
    return result;
  }

  function escapeHtml(str) {
    return String(str)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;');
  }

  /* =================== INIT =================== */
  document.addEventListener('DOMContentLoaded', function () {
    setupSearch();
  });

  /* Re-run when sidebar is dynamically built by app.js */
  document.addEventListener('click', function () {
    if (!document.getElementById('search-input')?._searchAttached) {
      setupSearch();
    }
  }, { once: true, capture: true });

  function setupSearch() {
    const input     = document.getElementById('search-input');
    const resultsEl = document.getElementById('search-results');
    if (!input || input._searchAttached) return;
    input._searchAttached = true;

    /* Restore last query from this session */
    const lastQ = sessionStorage.getItem('search-last-query');
    if (lastQ) input.value = lastQ;

    let debounceTimer;
    let focusedIdx = -1;

    input.addEventListener('input', () => {
      clearTimeout(debounceTimer);
      focusedIdx = -1;
      debounceTimer = setTimeout(() => {
        const q = input.value.trim();
        sessionStorage.setItem('search-last-query', q);
        if (q.length < 2) {
          resultsEl?.classList.remove('active');
          return;
        }
        const results = search(q);
        renderResults(results, q);
      }, 180);
    });

    input.addEventListener('keydown', e => {
      const items = resultsEl?.querySelectorAll('.search-result-item');
      if (!items || items.length === 0) return;

      if (e.key === 'ArrowDown') {
        e.preventDefault();
        focusedIdx = Math.min(focusedIdx + 1, items.length - 1);
        updateFocus(items, focusedIdx);
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        focusedIdx = Math.max(focusedIdx - 1, -1);
        updateFocus(items, focusedIdx);
      } else if (e.key === 'Enter' && focusedIdx >= 0) {
        e.preventDefault();
        items[focusedIdx]?.click();
      }
    });

    document.addEventListener('click', e => {
      if (!input.contains(e.target) && !resultsEl?.contains(e.target)) {
        resultsEl?.classList.remove('active');
        focusedIdx = -1;
      }
    });

    /* Cmd+K / Ctrl+K to focus search from anywhere on the page */
    document.addEventListener('keydown', e => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        input.focus();
        input.select();
      }
    });
  }

  function updateFocus(items, idx) {
    items.forEach((item, i) => item.classList.toggle('focused', i === idx));
    if (idx >= 0) items[idx]?.scrollIntoView({ block: 'nearest' });
  }

  /* Expose for testing */
  window.guideSearch = search;

})();
