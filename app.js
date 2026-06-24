/* =========================================================
   Navigator CRM - Project Admin Console (prototype)
   Model: PROJECT (sales line) = container.
          ZONE (Div/ZM) = optional nested layer.
   Two-stage routing: project -> zone (if zoned).
   S0-S7 pipeline is constant across all projects.
========================================================= */

/* ---------- Zones ---------- */
const ZONES = ['North', 'South', 'East', 'West', 'Mumbai'];
const ZONE_DOT = {
  North: 'var(--color-blue-50)', South: 'var(--color-purple-50)',
  East: 'var(--color-orange-50)', West: 'var(--color-success-50)',
  Mumbai: 'var(--color-secondary-50)',
};

/* City -> zone. Mumbai is its own zone; rest of Maharashtra = West. */
const CITY_ZONE = {
  Mumbai: 'Mumbai', Pune: 'West', Nagpur: 'West', Ahmedabad: 'West', Surat: 'West',
  Delhi: 'North', Jaipur: 'North', Lucknow: 'North',
  Bengaluru: 'South', Chennai: 'South', Hyderabad: 'South',
  Kolkata: 'East', Patna: 'East', Guwahati: 'East',
};
/* 22 focus cities (representative subset for the prototype) */
const FOCUS_CITIES = ['Mumbai', 'Pune', 'Ahmedabad', 'Surat', 'Delhi', 'Jaipur', 'Lucknow', 'Bengaluru', 'Chennai', 'Hyderabad', 'Kolkata'];
const ALL_CITIES = Object.keys(CITY_ZONE);

/* ---------- Pipeline (constant) ---------- */
const STAGES = [
  { id: 'S0', label: 'Captured' }, { id: 'S1', label: 'Discovery' },
  { id: 'S2', label: 'Qualified' }, { id: 'S3', label: 'Demo' },
  { id: 'S4', label: 'Proposal' }, { id: 'S5', label: 'Negotiation' },
  { id: 'S6', label: 'Contract' }, { id: 'S7', label: 'Won' },
];

/* ---------- Project types (priority: lower wins first) ---------- */
const TYPE_META = {
  key_account: { label: 'Key accounts', priority: 1 },
  acad:        { label: 'ACAD sales',   priority: 2 },
  digital:     { label: 'Digital sales',priority: 3 },
  direct:      { label: 'Direct sales', priority: 4 },
  inside:      { label: 'Inside sales', priority: 5 },
};

/* ---------- Parameter fields for the rule builder ---------- */
const FIELDS = {
  branch_count:        { label: 'Branch count',               type: 'number', operators: ['>=', '>', '<=', '<', '=='] },
  engagement_type:     { label: 'Engagement type',            type: 'enum',   options: ['inbound', 'outbound'],        operators: ['=='] },
  lead_source:         { label: 'Lead source',                type: 'enum',   options: ['campaign', 'website', 'cold_call', 'referral', 'event', 'walk_in'], operators: ['=='] },
  city_focus:          { label: 'City is focus-22',           type: 'bool',   operators: ['=='] },
  is_existing_customer:{ label: 'Existing customer (orders)', type: 'bool',   operators: ['=='] },
  account_stage:       { label: 'Account stage (orders)',      type: 'enum',   options: ['new_0_1yr', 'mature_2yr_plus'], operators: ['=='] },
};

/* ---------- People ---------- */
const PEOPLE = [
  { id: 'u_rajiv',   name: 'Rajiv Malhotra',  role: 'BU Head' },
  { id: 'u_karthik', name: 'Karthik Iyer',    role: 'BU Head' },
  { id: 'u_sahdev',  name: 'Sahdev Rana',     role: 'BU Head' },
  { id: 'u_meera',   name: 'Meera Nair',      role: 'BU Head' },
  { id: 'u_aji',     name: 'Aji Mathew',      role: 'BU Head' },
  { id: 'u_priya',   name: 'Priya Verma',     role: 'Zone Manager' },
  { id: 'u_anil',    name: 'Anil Kumar',      role: 'Zone Manager' },
  { id: 'u_sunita',  name: 'Sunita Rao',      role: 'Zone Manager' },
  { id: 'u_rohan',   name: 'Rohan Shah',      role: 'Zone Manager' },
  { id: 'u_farhan',  name: 'Farhan Shaikh',   role: 'Zone Manager' },
  { id: 'u_geeta',   name: 'Geeta Reddy',     role: 'Zone Manager' },
  { id: 'u_manish',  name: 'Manish Tiwari',   role: 'Zone Manager' },
  { id: 'u_vikram',  name: 'Vikram Singh',    role: 'RM' },
  { id: 'u_neha',    name: 'Neha Gupta',      role: 'RM' },
  { id: 'u_arjun',   name: 'Arjun Patel',     role: 'RM' },
  { id: 'u_kavya',   name: 'Kavya Menon',     role: 'RM' },
  { id: 'u_deepak',  name: 'Deepak Joshi',    role: 'RM' },
  { id: 'u_sneha',   name: 'Sneha Pillai',    role: 'RM' },
  { id: 'u_imran',   name: 'Imran Khan',      role: 'RM' },
  { id: 'u_pooja',   name: 'Pooja Desai',     role: 'RM' },
];

/* ---------- Seed projects ---------- */
const SEED_PROJECTS = [
  {
    id: 'p_direct', key: 'DIR', name: 'Direct Sales', type: 'direct', ownerId: 'u_rajiv',
    zoned: true,
    zones: [
      { zone: 'North',  zmId: 'u_priya',  rmIds: ['u_vikram', 'u_neha'] },
      { zone: 'South',  zmId: 'u_anil',   rmIds: ['u_kavya'] },
      { zone: 'East',   zmId: 'u_sunita', rmIds: ['u_imran'] },
      { zone: 'West',   zmId: 'u_rohan',  rmIds: ['u_arjun', 'u_pooja'] },
      { zone: 'Mumbai', zmId: 'u_farhan', rmIds: ['u_deepak'] },
    ],
    rules: [{ field: 'city_focus', op: '==', value: true }], leadCount: 38,
  },
  {
    id: 'p_inside', key: 'INS', name: 'Inside Sales', type: 'inside', ownerId: 'u_karthik',
    zoned: false, zones: [], memberIds: ['u_neha', 'u_deepak', 'u_sneha'],
    rules: [{ field: 'engagement_type', op: '==', value: 'inbound' }], leadCount: 24,
  },
  {
    id: 'p_key', key: 'KAC', name: 'Key Accounts', type: 'key_account', ownerId: 'u_sahdev',
    zoned: false, zones: [], memberIds: ['u_arjun', 'u_kavya'],
    rules: [{ field: 'branch_count', op: '>=', value: 20 }], leadCount: 9,
  },
  {
    id: 'p_acad', key: 'ACD', name: 'ACAD Sales', type: 'acad', ownerId: 'u_meera',
    zoned: true,
    zones: [
      { zone: 'North',  zmId: 'u_geeta',  rmIds: ['u_neha'] },
      { zone: 'South',  zmId: 'u_anil',   rmIds: ['u_kavya'] },
      { zone: 'West',   zmId: 'u_manish', rmIds: ['u_pooja'] },
      { zone: 'Mumbai', zmId: 'u_farhan', rmIds: ['u_deepak'] },
    ],
    rules: [{ field: 'is_existing_customer', op: '==', value: true }], leadCount: 31,
  },
  {
    id: 'p_digital', key: 'DGS', name: 'Digital Sales', type: 'digital', ownerId: 'u_aji',
    zoned: false, zones: [], memberIds: ['u_sneha', 'u_imran'],
    rules: [
      { field: 'engagement_type', op: '==', value: 'inbound' },
      { field: 'lead_source',     op: '==', value: 'campaign' },
    ], leadCount: 27,
  },
];

/* ---------- State ---------- */
let projects = [];
let leads    = [];
let editingId  = null;
let modalRules = [];
let modalZones = {};

const $  = (sel, root = document) => root.querySelector(sel);
const $$ = (sel, root = document) => Array.from(root.querySelectorAll(sel));
const person   = (id)   => PEOPLE.find((p) => p.id === id);
const initials = (name) => name.split(' ').map((w) => w[0]).slice(0, 2).join('').toUpperCase();
const projectRmIds  = (p) => p.zoned ? [...new Set(p.zones.flatMap((z) => z.rmIds))] : (p.memberIds || []);
const projectZmCount = (p) => p.zoned ? new Set(p.zones.map((z) => z.zmId)).size : 0;

function loadSeed() { projects = JSON.parse(JSON.stringify(SEED_PROJECTS)); leads = []; }

/* =========================================================
   PROJECTS GRID
========================================================= */
function renderGrid() {
  const grid = $('#projects-grid');
  const ranked = [...projects].sort((a, b) => TYPE_META[a.type].priority - TYPE_META[b.type].priority);
  grid.innerHTML = ranked.map(renderProjectCard).join('');
  $$('.pcard', grid).forEach((card) => {
    card.onclick = (e) => { if (e.target.closest('[data-stop]')) return; openDetail(card.dataset.id); };
    card.querySelector('[data-edit]').onclick   = () => openProjectModal(card.dataset.id);
    card.querySelector('[data-delete]').onclick = () => dismantleProject(card.dataset.id);
  });
}

function renderProjectCard(p) {
  const owner  = person(p.ownerId);
  const params = p.rules.length
    ? p.rules.map((r) => `<span class="chip chip--param">${humanRule(r)}</span>`).join('')
    : '<span class="chip">Default / manual queue</span>';
  const zoneInfo = p.zoned
    ? p.zones.map((z) => `<span class="chip chip--zone"><span class="board__col-dot" style="width:7px;height:7px;background:${ZONE_DOT[z.zone]}"></span>${z.zone}</span>`).join('')
    : '<span class="chip chip--panindia">Zone-less · Pan-India</span>';
  const rmCount = projectRmIds(p).length;
  return `
<article class="pcard" data-id="${p.id}" data-type="${p.type}">
  <div class="pcard__top">
    <span class="pcard__key">${p.key}</span>
    <span class="chip chip--type" data-type="${p.type}">${TYPE_META[p.type].label}</span>
  </div>
  <div class="pcard__title">${p.name}</div>
  <div class="pcard__owner"><span class="avatar avatar--sm">${owner ? initials(owner.name) : '?'}</span>${owner ? owner.name : 'Unassigned'} · <span class="muted">BU owner</span></div>
  <div class="pcard__section-lbl">Routing parameters</div>
  <div class="pcard__params">${params}</div>
  <div class="pcard__section-lbl">${p.zoned ? 'Zones (Div/ZM layer)' : 'Structure'}</div>
  <div class="pcard__zones">${zoneInfo}</div>
  <div class="pcard__foot">
    <div class="pcard__stats">
      <span><b>${p.leadCount}</b><br>leads</span>
      <span><b>${p.zoned ? projectZmCount(p) : 0}</b><br>ZMs</span>
      <span><b>${rmCount}</b><br>RMs</span>
    </div>
    <div class="project-card__menu" data-stop>
      <button class="icon-btn" data-edit title="Edit">✎</button>
      <button class="icon-btn icon-btn--danger" data-delete title="Dismantle">🗒</button>
    </div>
  </div>
</article>`;
}

function humanRule(r) {
  switch (r.field) {
    case 'branch_count':        return `branches ${r.op} ${r.value}`;
    case 'engagement_type':     return `${r.value}`;
    case 'lead_source':         return `source = ${r.value}`;
    case 'city_focus':          return r.value ? 'focus-22 city' : 'non-focus city';
    case 'is_existing_customer':return r.value ? 'existing customer (orders)' : 'new customer';
    case 'account_stage':       return r.value === 'new_0_1yr' ? 'cohort 0-1yr' : 'cohort 2+yr';
    default:                    return `${r.field} ${r.op} ${r.value}`;
  }
}

/* =========================================================
   PROJECT DETAIL
========================================================= */
function openDetail(id) {
  const p     = projects.find((x) => x.id === id);
  const owner = person(p.ownerId);
  const rmCount = projectRmIds(p).length;

  let body;
  if (p.zoned) {
    body = `<div class="board">${p.zones.map((z) => {
      const zm  = person(z.zmId);
      const rms = z.rmIds.map((rid) => { const r = person(rid); return `<div class="zone-member"><span class="avatar avatar--sm">${initials(r.name)}</span><span>${r.name}<span class="zone-member__role">RM</span></span></div>`; }).join('') || '<div class="board__empty">No RMs yet</div>';
      return `<section class="board__col">
        <div class="board__col-head">
          <div class="board__col-title"><span class="board__col-dot" style="background:${ZONE_DOT[z.zone]}"></span>${z.zone}</div>
          <span class="board__col-count">${z.rmIds.length}</span>
        </div>
        <div class="board__col-body">
          <div class="zone-member zone-member--zm"><span class="avatar avatar--sm">${zm ? initials(zm.name) : '?'}</span><span>${zm ? zm.name : 'Unassigned'}<span class="zone-member__role">Zone Manager (Div head)</span></span></div>
          ${rms}
        </div>
      </section>`;
    }).join('')}</div>`;
  } else {
    const rms  = projectRmIds(p).map((rid) => { const r = person(rid); return `<div class="zone-member"><span class="avatar avatar--sm">${initials(r.name)}</span><span>${r.name}<span class="zone-member__role">RM</span></span></div>`; }).join('') || '<div class="board__empty">No RMs yet</div>';
    const note = p.type === 'digital' ? 'Customers are tracked from online mediums and routed pan-India - no Div/ZM layer.' : 'Pan-India line - no Div/ZM layer.';
    body = `<div class="zoneless-banner"><span>🌐</span><span><b>Zone-less · Pan-India.</b> ${note}</span></div>
    <div class="board"><section class="board__col" style="flex-basis:360px;">
      <div class="board__col-head"><div class="board__col-title">RM pool</div><span class="board__col-count">${rmCount}</span></div>
      <div class="board__col-body">${rms}</div>
    </section></div>`;
  }

  const params = p.rules.length ? p.rules.map((r) => `<span class="chip chip--param">${humanRule(r)}</span>`).join('') : '<span class="chip">Default / manual queue</span>';

  $('#project-detail').innerHTML = `
  <button class="detail-back" id="detail-back">← All projects</button>
  <div class="detail-head">
    <div>
      <div class="detail-title">
        <span class="pcard__key">${p.key}</span>
        <h1>${p.name}</h1>
        <span class="chip chip--type" data-type="${p.type}">${TYPE_META[p.type].label}</span>
      </div>
      <div class="detail-meta">
        <div class="detail-meta__item"><span class="muted">BU owner</span><b>${owner ? owner.name : '-'}</b></div>
        <div class="detail-meta__item"><span class="muted">Structure</span><b>${p.zoned ? p.zones.length + ' zones' : 'Zone-less · Pan-India'}</b></div>
        <div class="detail-meta__item"><span class="muted">RMs</span><b>${rmCount}</b></div>
        <div class="detail-meta__item"><span class="muted">Active leads</span><b>${p.leadCount}</b></div>
      </div>
    </div>
    <div class="page-head__actions">
      <button class="btn btn--secondary" id="detail-edit">Edit project</button>
      <button class="btn btn--danger" id="detail-delete">Dismantle</button>
    </div>
  </div>
  <div class="card mb-8">
    <div class="section-label">Routing parameters</div>
    <div class="pcard__params" style="margin:0;">${params}</div>
  </div>
  <div class="section-label">${p.zoned ? 'Zones · Div heads (ZM) & RMs' : 'Team'}</div>
  ${body}`;

  $('#detail-back').onclick   = closeDetail;
  $('#detail-edit').onclick   = () => openProjectModal(p.id);
  $('#detail-delete').onclick = () => dismantleProject(p.id);
  $('#projects-list').classList.add('hidden');
  $('#project-detail').classList.remove('hidden');
}
function closeDetail() { $('#project-detail').classList.add('hidden'); $('#projects-list').classList.remove('hidden'); }

/* =========================================================
   PROJECT MODAL - create / edit
========================================================= */
function openProjectModal(id) {
  editingId = id || null;
  const p = id ? projects.find((x) => x.id === id) : null;
  $('#modal-title').textContent = p ? 'Edit project' : 'Create project';
  $('#f-name').value  = p ? p.name  : '';
  $('#f-key').value   = p ? p.key   : '';
  $('#f-type').value  = p ? p.type  : 'direct';
  $('#f-zoned').checked = p ? p.zoned : true;
  modalRules = p ? JSON.parse(JSON.stringify(p.rules)) : [];
  modalZones = {};
  if (p && p.zoned) p.zones.forEach((z) => { modalZones[z.zone] = z.zmId; });

  $('#f-owner').innerHTML = PEOPLE.filter((u) => u.role === 'BU Head')
    .map((u) => `<option value="${u.id}" ${p && p.ownerId === u.id ? 'selected' : ''}>${u.name}</option>`).join('');

  const selectedRms = p ? projectRmIds(p) : [];
  $('#members-grid').innerHTML = PEOPLE.filter((u) => u.role === 'RM').map((u) => {
    const sel = selectedRms.includes(u.id);
    return `<label class="people-opt ${sel ? 'selected' : ''}">
      <input type="checkbox" value="${u.id}" ${sel ? 'checked' : ''} />
      <span class="avatar avatar--sm">${initials(u.name)}</span>
      <span>${u.name}<span class="people-opt__role">RM</span></span>
    </label>`;
  }).join('');
  $$('#members-grid .people-opt').forEach((el) => { el.querySelector('input').onchange = (e) => el.classList.toggle('selected', e.target.checked); });

  $('#btn-delete-project').style.display = p ? 'inline-flex' : 'none';
  renderRules();
  renderZonesConfig();
  $('#f-zoned').onchange = renderZonesConfig;
  $('#project-modal').classList.add('open');
}

function renderZonesConfig() {
  const zoned = $('#f-zoned').checked;
  $('#zones-config').style.display = zoned ? 'block' : 'none';
  if (!zoned) return;
  const zms = PEOPLE.filter((u) => u.role === 'Zone Manager');
  $('#zones-list').innerHTML = ZONES.map((z) => {
    const included = z in modalZones;
    const zmId = modalZones[z] || '';
    return `<div class="zone-cfg">
      <span class="switch" style="width:auto;height:auto;">
        <input type="checkbox" class="zone-incl" data-zone="${z}" ${included ? 'checked' : ''} style="display:inline-block;width:18px;height:18px;" />
      </span>
      <span class="zone-cfg__name"><span class="board__col-dot" style="display:inline-block;width:8px;height:8px;background:${ZONE_DOT[z]}"></span> ${z}</span>
      <select class="select zone-zm" data-zone="${z}" ${included ? '' : 'disabled'}>
        <option value="">Select Zone Manager...</option>
        ${zms.map((u) => `<option value="${u.id}" ${u.id === zmId ? 'selected' : ''}>${u.name}</option>`).join('')}
      </select>
    </div>`;
  }).join('');
  $$('.zone-incl').forEach((cb) => {
    cb.onchange = () => {
      const z = cb.dataset.zone;
      if (cb.checked) modalZones[z] = modalZones[z] || '';
      else delete modalZones[z];
      const sel = $(('.zone-zm[data-zone="' + z + '"]'));
      sel.disabled = !cb.checked;
    };
  });
  $$('.zone-zm').forEach((sel) => { sel.onchange = () => { modalZones[sel.dataset.zone] = sel.value; }; });
}

function renderRules() {
  const list = $('#rules-list');
  if (!modalRules.length) { list.innerHTML = '<p class="muted" style="font-size:var(--text-body-sm);margin-bottom:8px;">No parameters - default / manual queue.</p>'; return; }
  list.innerHTML = modalRules.map((r, i) => {
    const f = FIELDS[r.field];
    const fieldSel = `<select class="select" data-ri="${i}" data-k="field">${Object.entries(FIELDS).map(([k, v]) => `<option value="${k}" ${k === r.field ? 'selected' : ''}>${v.label}</option>`).join('')}</select>`;
    const opSel    = `<select class="select" data-ri="${i}" data-k="op">${f.operators.map((o) => `<option value="${o}" ${o === r.op ? 'selected' : ''}>${o}</option>`).join('')}</select>`;
    let valCtrl;
    if (f.type === 'number') valCtrl = `<input class="input" type="number" data-ri="${i}" data-k="value" value="${r.value}" />`;
    else if (f.type === 'bool') valCtrl = `<select class="select" data-ri="${i}" data-k="value"><option value="true" ${r.value === true ? 'selected' : ''}>Yes</option><option value="false" ${r.value === false ? 'selected' : ''}>No</option></select>`;
    else valCtrl = `<select class="select" data-ri="${i}" data-k="value">${f.options.map((o) => `<option value="${o}" ${o === r.value ? 'selected' : ''}>${o}</option>`).join('')}</select>`;
    const divider = i > 0 ? '<div class="rule-divider">AND</div>' : '';
    return `${divider}<div class="rule-row">${fieldSel}${opSel}${valCtrl}<button class="icon-btn icon-btn--danger" data-remove="${i}">✕</button></div>`;
  }).join('');

  $$('[data-k]', list).forEach((el) => {
    el.onchange = () => {
      const i = +el.dataset.ri, k = el.dataset.k;
      if (k === 'field') { const f = FIELDS[el.value]; modalRules[i] = { field: el.value, op: f.operators[0], value: defaultVal(f) }; renderRules(); }
      else if (k === 'value') modalRules[i].value = coerceVal(modalRules[i].field, el.value);
      else modalRules[i][k] = el.value;
    };
  });
  $$('[data-remove]', list).forEach((b) => { b.onclick = () => { modalRules.splice(+b.dataset.remove, 1); renderRules(); }; });
}

function defaultVal(f) { if (f.type === 'number') return 20; if (f.type === 'bool') return true; return f.options[0]; }
function coerceVal(field, raw) { const f = FIELDS[field]; if (f.type === 'number') return Number(raw); if (f.type === 'bool') return raw === 'true' || raw === true; return raw; }

function saveProject() {
  const name = $('#f-name').value.trim();
  if (!name) { toast('Project name is required', 'info'); return; }
  const key   = ($('#f-key').value.trim() || name.slice(0, 3)).toUpperCase();
  const zoned = $('#f-zoned').checked;
  const rmIds = $$('#members-grid input:checked').map((i) => i.value);

  let zones = [];
  if (zoned) {
    zones = Object.keys(modalZones).map((z) => ({ zone: z, zmId: modalZones[z], rmIds: [...rmIds] }));
    if (!zones.length) { toast('Add at least one zone, or turn off zones', 'info'); return; }
  }

  const data = {
    name, key, type: $('#f-type').value, ownerId: $('#f-owner').value,
    zoned, zones, memberIds: zoned ? [] : rmIds, rules: modalRules,
  };

  if (editingId) { Object.assign(projects.find((x) => x.id === editingId), data); toast('Project updated', 'success'); }
  else { projects.push({ id: 'p_' + Date.now(), leadCount: 0, ...data }); toast('Project created', 'success'); }

  closeModal(); closeDetail(); renderGrid();
}

function dismantleProject(id) {
  const p = projects.find((x) => x.id === id);
  if (!confirm(`Dismantle "${p.name}"? Its leads keep the same S0-S7 pipeline.`)) return;
  projects = projects.filter((x) => x.id !== id);
  closeModal(); closeDetail(); renderGrid();
  toast(`Project "${p.name}" dismantled`, 'info');
}

function closeModal() { $('#project-modal').classList.remove('open'); editingId = null; }

/* =========================================================
   TWO-STAGE ASSIGNMENT ENGINE
========================================================= */
function ruleMatches(rule, c) {
  let actual;
  switch (rule.field) {
    case 'branch_count':        actual = c.branch_count; break;
    case 'engagement_type':     actual = c.engagement_type; break;
    case 'lead_source':         actual = c.lead_source; break;
    case 'city_focus':          actual = FOCUS_CITIES.includes(c.city); break;
    case 'is_existing_customer':actual = c.account_stage !== 'none'; break;
    case 'account_stage':       actual = c.account_stage; break;
  }
  switch (rule.op) {
    case '>=': return actual >= rule.value;
    case '>':  return actual >  rule.value;
    case '<=': return actual <= rule.value;
    case '<':  return actual <  rule.value;
    case '==': return actual === rule.value;
  }
  return false;
}

function evaluate(c) {
  const ranked = [...projects].sort((a, b) => TYPE_META[a.type].priority - TYPE_META[b.type].priority);
  const steps  = [];
  let winner   = null;
  for (const p of ranked) {
    if (!p.rules.length) continue;
    const results = p.rules.map((r) => ({ r, ok: ruleMatches(r, c) }));
    const allOk   = results.every((x) => x.ok);
    steps.push({ project: p, results, allOk, win: allOk && !winner });
    if (allOk && !winner) winner = p;
  }
  if (!winner) winner = ranked.find((p) => p.type === 'inside') || null;
  return { steps, winner };
}

function runEngine() {
  const c = {
    name:            $('#cust-name').value.trim() || 'Unnamed school',
    branch_count:    Number($('#cust-branches').value) || 0,
    engagement_type: $('#cust-engagement').value,
    lead_source:     $('#cust-source').value,
    city:            $('#cust-city').value,
    account_stage:   $('#cust-account').value,
  };
  const { steps, winner } = evaluate(c);

  $('#eval-output').innerHTML = `<div class="muted" style="font-size:var(--text-label-sm);font-weight:700;margin-bottom:6px;">STAGE 1 · PROJECT ROUTING (priority order)</div>` +
    steps.map((s) => {
      const cls  = s.win ? 'win' : (s.allOk ? 'pass' : 'fail');
      const icon = s.win ? '🎯' : (s.allOk ? '✓' : '-');
      const detail = s.results.map((x) => `${humanRule(x.r)} ${x.ok ? '✓' : '✗'}`).join(' · ');
      return `<div class="eval-step ${cls}"><span class="eval-step__icon">${icon}</span><span><b>${s.project.key}</b> ${s.project.name} <span class="muted">- ${detail}</span></span></div>`;
    }).join('');

  if (!winner) { $('#result-output').innerHTML = '<div class="callout mt-16"><span>⚠️</span><span>No project matched - lead goes to the manager queue.</span></div>'; return; }

  const zone    = winner.zoned ? (CITY_ZONE[c.city] || null) : null;
  const zoneObj = zone ? winner.zones.find((z) => z.zone === zone) : null;
  const zm      = zoneObj ? person(zoneObj.zmId) : null;
  const owner   = person(winner.ownerId);

  let extraNote = '';
  if (winner.type === 'inside' && FOCUS_CITIES.includes(c.city)) {
    extraNote = `<div class="callout mt-16" style="background:var(--color-blue-10);color:var(--color-blue-70);border-color:var(--color-blue-50)"><span>🔄</span><span>At <b>S2</b>: ${c.city} is a focus-22 city - re-plug to <b>Direct Sales / ${CITY_ZONE[c.city]} zone</b>.</span></div>`;
  }

  const stage2 = winner.zoned
    ? (zoneObj ? `${zone} zone · ZM ${zm ? zm.name : '-'}` : `${c.city} not mapped - manager queue`)
    : 'Zone-less · Pan-India';

  $('#result-output').innerHTML = `
  <div class="result-card mt-16">
    <div class="result-card__route">${c.name} → ${winner.key} ${winner.name}${winner.zoned && zoneObj ? ' · ' + zone : ''}</div>
    <div class="mt-16" style="display:flex;gap:16px;flex-wrap:wrap;font-size:var(--text-body-sm);">
      <div><span class="muted">Stage 1 · Project</span><br><b>${winner.name}</b></div>
      <div><span class="muted">Stage 2 · Zone</span><br><b>${stage2}</b></div>
      <div><span class="muted">BU owner</span><br><b>${owner ? owner.name : '-'}</b></div>
      <div><span class="muted">Entry stage</span><br><b>S0 · Captured</b></div>
    </div>
  </div>${extraNote}`;

  winner.leadCount += 1;
  leads.unshift({ c, project: winner, zone: zoneObj ? zone : (winner.zoned ? '-' : 'Pan-India'), zm });
  renderLeads(); renderGrid();
  toast(`${c.name} → ${winner.name}${zoneObj ? ' / ' + zone : ''}`, 'success');
}

function renderLeads() {
  const tb = $('#leads-tbody');
  if (!leads.length) { tb.innerHTML = '<tr><td colspan="6" class="muted" style="text-align:center;padding:24px;">No leads routed yet.</td></tr>'; return; }
  tb.innerHTML = leads.map((l) => {
    const owner = person(l.project.ownerId);
    const personLabel = l.zm ? l.zm.name : (owner ? owner.name : '-');
    return `<tr>
      <td><b>${l.c.name}</b><br><span class="muted" style="font-size:var(--text-label-sm)">${l.c.branch_count} br · ${l.c.engagement_type} · ${l.c.lead_source} · ${l.c.city}</span></td>
      <td><span class="chip chip--type" data-type="${l.project.type}">${l.project.key}</span> ${l.project.name}</td>
      <td>${l.project.zoned ? (l.zone === '-' ? '<span class="muted">unmapped</span>' : l.zone) : '<span class="chip chip--panindia">Pan-India</span>'}</td>
      <td><span class="avatar avatar--sm">${initials(personLabel)}</span> ${personLabel}</td>
      <td><span class="pipeline__dot active" style="display:inline-flex">S0</span></td>
      <td><span class="muted">-</span></td>
    </tr>`;
  }).join('');
}

/* ---------- Sample customers ---------- */
const SAMPLES = {
  kv:     { name: 'KV School',           branches: 1200, engagement: 'outbound', source: 'referral',  city: 'Delhi',     account: 'none' },
  oxford: { name: 'Oxford School',       branches: 4,    engagement: 'inbound',  source: 'campaign',  city: 'Mumbai',    account: 'none' },
  direct: { name: 'Sunrise Public',      branches: 2,    engagement: 'outbound', source: 'cold_call', city: 'Ahmedabad', account: 'none' },
  acad:   { name: 'Greenfield Academy',  branches: 3,    engagement: 'inbound',  source: 'referral',  city: 'Pune',      account: 'new_0_1yr' },
  inside: { name: 'Little Stars School', branches: 1,    engagement: 'inbound',  source: 'website',   city: 'Patna',     account: 'none' },
};
function applySample(key) {
  const s = SAMPLES[key];
  $('#cust-name').value = s.name; $('#cust-branches').value = s.branches;
  $('#cust-engagement').value = s.engagement; $('#cust-source').value = s.source;
  $('#cust-city').value = s.city; $('#cust-account').value = s.account;
}

function fillCities() {
  $('#cust-city').innerHTML = ALL_CITIES.map((city) => {
    const focus = FOCUS_CITIES.includes(city) ? 'focus-22' : 'non-focus';
    return `<option value="${city}">${city} · ${CITY_ZONE[city]} zone · ${focus}</option>`;
  }).join('');
}

function renderPipeline(el, activeIdx = 0) {
  el.innerHTML = STAGES.map((s, i) => {
    const line = i < STAGES.length - 1 ? '<span class="pipeline__line"></span>' : '';
    return `<div class="pipeline__stage"><div class="pipeline__node"><span class="pipeline__dot ${i === activeIdx ? 'active' : ''}">${s.id}</span><span class="pipeline__label">${s.label}</span></div>${line}</div>`;
  }).join('');
}

function toast(msg, type = 'info') {
  const t = document.createElement('div');
  t.className = `toast toast--${type}`;
  t.innerHTML = `<span>${type === 'success' ? '✓' : 'ℹ'}</span><span>${msg}</span>`;
  $('#toast-wrap').appendChild(t);
  setTimeout(() => { t.style.opacity = '0'; t.style.transition = 'opacity .3s'; setTimeout(() => t.remove(), 300); }, 3200);
}

function switchTab(name) {
  $$('.tab').forEach((t) => t.classList.toggle('active', t.dataset.tab === name));
  $$('.page').forEach((p) => p.classList.toggle('active', p.id === 'page-' + name));
}

function init() {
  loadSeed(); fillCities(); renderGrid(); renderPipeline($('#pipeline-full'), 0);
  $('#btn-new-project').onclick = () => openProjectModal(null);
  $('#btn-add-rule').onclick    = () => { modalRules.push({ field: 'branch_count', op: '>=', value: 20 }); renderRules(); };
  $('#btn-save-project').onclick   = saveProject;
  $('#btn-delete-project').onclick = () => dismantleProject(editingId);
  $$('[data-close-modal]').forEach((b) => (b.onclick = closeModal));
  $('#project-modal').onclick = (e) => { if (e.target.id === 'project-modal') closeModal(); };
  $('#btn-reset').onclick = () => {
    loadSeed(); closeDetail(); renderGrid(); renderLeads();
    $('#eval-output').innerHTML = '<p class="muted" style="font-size:var(--text-body-sm)">Add a customer to see how the rules engine routes it.</p>';
    $('#result-output').innerHTML = ''; toast('Demo reset', 'info');
  };
  $('#btn-run-engine').onclick = runEngine;
  $$('.sample-chip').forEach((b) => (b.onclick = () => applySample(b.dataset.sample)));
  $$('.tab').forEach((t) => (t.onclick = () => switchTab(t.dataset.tab)));
}

document.addEventListener('DOMContentLoaded', init);
