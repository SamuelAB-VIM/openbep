/* Plan-view sketches of what changes from one LOD to the next, for three kinds of element:
   a door (an element hosted in a wall), a duct run (a linear system) and an air handling unit
   (equipment). Each part is drawn from one level and, if it is replaced later, until another;
   parts new at the level shown take that level's colour, earlier parts are grey.
   Drawings are OpenBEP's own. */
(function(){
  const COL={'100':'#6F8796','200':'#2E9E8F','300':'#2E6FD9','350':'#7B5CC4','400':'#D98A1C','500':'#B23A48'};
  const OLD='#9AA5A0';
  // [from, until (exclusive, '' = never replaced), svg with {c} for the stroke/fill colour]
  const SK={
    door:{cap:{
      '100':'Opening allowance or symbol only',
      '200':'Generic door, approximate size and swing',
      '300':'Designed leaf and frame, clear width measurable',
      '350':'Clearance zones, closer and wall interface',
      '400':'Frame profile and hardware preparations from shop drawings',
      '500':'Installed position checked on site to the stated tolerance'},
    parts:[
      ['100','200','<rect x="10" y="62" width="140" height="16" fill="none" stroke="{c}" stroke-width="1.5"/><circle cx="80" cy="70" r="9" fill="#fff" stroke="{c}" stroke-dasharray="3 2"/><text x="80" y="74" font-size="10" text-anchor="middle" fill="{c}" font-family="monospace">D</text>'],
      ['200','','<path d="M10 62H56V78H10ZM104 62H150V78H104Z" fill="none" stroke="{c}" stroke-width="1.5"/>'],
      ['200','300','<rect x="57" y="22" width="5" height="40" fill="{c}" opacity=".55"/><path d="M62 22A40 40 0 0 1 102 62" fill="none" stroke="{c}" stroke-dasharray="3 3"/>'],
      ['300','','<rect x="56" y="62" width="5" height="16" fill="{c}"/><rect x="99" y="62" width="5" height="16" fill="{c}"/><rect x="61" y="24" width="3" height="38" fill="{c}"/><path d="M64 24A38 38 0 0 1 99 62" fill="none" stroke="{c}"/><path d="M61 92H99M61 88V96M99 88V96" stroke="{c}"/><text x="80" y="104" font-size="8" text-anchor="middle" fill="{c}" font-family="monospace">clear width</text>'],
      ['350','','<rect x="40" y="16" width="80" height="44" fill="{c}" opacity=".12" stroke="{c}" stroke-dasharray="4 3"/><rect x="40" y="80" width="80" height="0.1" stroke="none"/><rect x="64" y="30" width="8" height="4" fill="{c}"/><path d="M53 66l3 3M53 74l3-3M107 66l-3 3M107 74l-3-3" stroke="{c}" stroke-width="1.5"/>'],
      ['400','','<path d="M56 62h5v4h-2v8h2v4h-5z" fill="#fff" stroke="{c}" stroke-width="1.2"/><path d="M104 62h-5v4h2v8h-2v4h5z" fill="#fff" stroke="{c}" stroke-width="1.2"/><rect x="61" y="44" width="3" height="5" fill="{c}"/><rect x="61" y="30" width="3" height="3" fill="{c}"/>'],
      ['500','','<g stroke="{c}" fill="none"><circle cx="58" cy="70" r="5"/><path d="M50 70h16M58 62v16"/><circle cx="102" cy="70" r="5"/><path d="M94 70h16M102 62v16"/></g><text x="80" y="116" font-size="8" text-anchor="middle" fill="{c}" font-family="monospace">± tolerance</text>']]},
    duct:{cap:{
      '100':'Service zone reserved, no duct drawn',
      '200':'Generic duct at approximate size and height',
      '300':'Designed size, fittings and connections',
      '350':'Insulation envelope, hangers and access zones',
      '400':'Fabrication segments and joints from shop drawings',
      '500':'Installed run checked on site to the stated tolerance'},
    parts:[
      ['100','200','<rect x="8" y="34" width="144" height="36" fill="{c}" opacity=".12" stroke="{c}" stroke-dasharray="5 3"/><text x="80" y="56" font-size="8" text-anchor="middle" fill="{c}" font-family="monospace">service zone</text>'],
      ['200','300','<rect x="10" y="44" width="140" height="16" fill="{c}" opacity=".5"/>'],
      ['300','','<path d="M10 44H118Q132 44 132 58V110H116V64Q116 60 112 60H10Z" fill="none" stroke="{c}" stroke-width="1.5"/><rect x="58" y="60" width="10" height="14" fill="none" stroke="{c}"/><rect x="53" y="74" width="20" height="20" fill="none" stroke="{c}"/><path d="M53 74l20 20M73 74l-20 20" stroke="{c}" stroke-width=".6"/>'],
      ['350','','<path d="M10 39H120Q137 39 137 58V110M111 110V66Q111 65 110 65H10" fill="none" stroke="{c}" stroke-dasharray="4 2"/><g stroke="{c}" stroke-width="1.4"><path d="M30 34v36M70 34v36M100 34v36"/></g><rect x="84" y="66" width="22" height="16" fill="{c}" opacity=".15" stroke="{c}" stroke-dasharray="3 2"/>'],
      ['400','','<g stroke="{c}" stroke-width="2"><path d="M45 42v20M80 42v20M110 42v20"/></g><text x="28" y="30" font-size="7" fill="{c}" font-family="monospace">L=1500</text>'],
      ['500','','<g stroke="{c}" fill="none"><circle cx="20" cy="52" r="5"/><path d="M12 52h16M20 44v16"/><circle cx="124" cy="100" r="5"/><path d="M116 100h16M124 92v16"/></g>']]},
    equip:{cap:{
      '100':'Space allowance for the plant',
      '200':'Generic box at approximate size',
      '300':'Designed size with duct and pipe connections',
      '350':'Service clearance, coil pull zone and pad',
      '400':'Sections and access doors of the approved unit',
      '500':'Installed unit checked on site to the stated tolerance'},
    parts:[
      ['100','200','<rect x="18" y="24" width="124" height="70" fill="{c}" opacity=".12" stroke="{c}" stroke-dasharray="5 3"/><path d="M18 24l124 70M142 24L18 94" stroke="{c}" stroke-width=".6"/>'],
      ['200','300','<rect x="30" y="36" width="96" height="40" fill="{c}" opacity=".5"/>'],
      ['300','','<rect x="34" y="38" width="92" height="34" fill="none" stroke="{c}" stroke-width="1.5"/><rect x="40" y="26" width="18" height="12" fill="none" stroke="{c}"/><rect x="100" y="26" width="18" height="12" fill="none" stroke="{c}"/><path d="M80 72v12M88 72v12" stroke="{c}" stroke-width="2"/>'],
      ['350','','<rect x="28" y="33" width="104" height="44" fill="none" stroke="{c}" stroke-dasharray="2 2"/><rect x="34" y="72" width="92" height="26" fill="{c}" opacity=".13" stroke="{c}" stroke-dasharray="4 3"/><rect x="126" y="44" width="28" height="20" fill="{c}" opacity=".13" stroke="{c}" stroke-dasharray="4 3"/>'],
      ['400','','<path d="M56 38v34M78 38v34M104 38v34" stroke="{c}"/><rect x="60" y="70" width="14" height="3" fill="{c}"/><rect x="84" y="70" width="14" height="3" fill="{c}"/>'],
      ['500','','<g stroke="{c}" fill="none"><circle cx="34" cy="38" r="5"/><path d="M26 38h16M34 30v16"/><circle cx="126" cy="72" r="5"/><path d="M118 72h16M126 64v16"/></g>']]}
  };
  // Which element types each sketch stands for.
  const OF={door:'door',window:'door',curtain_wall:'door',duct:'duct',pipe:'duct',cable_carrier:'duct',utility_pipe:'duct',
    ahu:'equip',pump:'equip',boiler:'equip',chiller:'equip',cooling_tower:'equip',fan:'equip',vav_box:'equip',heat_exchanger:'equip',
    water_heater:'equip',distribution_board:'equip',transformer:'equip',generator:'equip',specialty_equipment:'equip'};
  function svg(kind,lod){const k=SK[kind]; if(!k) return '';
    const body=k.parts.filter(([f,u])=>+f<=+lod&&(!u||+u>+lod)).map(([f,,s])=>s.replace(/\{c\}/g,f===lod?COL[f]:OLD)).join('');
    return `<svg viewBox="0 0 160 120" role="img" aria-label="${k.cap[lod]}" class="ill"><rect width="160" height="120" fill="#fff"/>${body}</svg>`}
  window.OPENBEP_LOD_ILL={svg,cap:(kind,lod)=>(SK[kind]||{cap:{}}).cap[lod]||'',of:id=>OF[id]||'',kinds:Object.keys(SK)};
})();
