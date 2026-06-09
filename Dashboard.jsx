import { useState, useEffect, useCallback, useRef } from 'react'
import { supabase } from '../lib/supabase'

// ─── CSS ──────────────────────────────────────────────────────────────────────
const CSS = `
  @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&display=swap');

  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

  :root {
    --bg: #0f1117; --bg2: #161b27; --bg3: #1c2235; --bg4: #212840;
    --border: #2a3350; --border2: #1e2a45;
    --blue: #4f8ef7; --blue2: #3b7de8; --blue-glow: rgba(79,142,247,0.15);
    --green: #22c55e; --green2: #16a34a; --green-glow: rgba(34,197,94,0.12);
    --red: #ef4444; --red2: #dc2626; --red-glow: rgba(239,68,68,0.12);
    --amber: #f59e0b; --amber-glow: rgba(245,158,11,0.12);
    --purple: #a855f7; --purple-glow: rgba(168,85,247,0.12);
    --text: #e2e8f0; --text2: #94a3b8; --text3: #4a5568;
    --sidebar-w: 220px; --header-h: 64px;
    --radius: 12px; --radius-sm: 8px;
    --shadow: 0 4px 24px rgba(0,0,0,0.4);
  }

  html, body { height: 100%; overflow: hidden; }
  body { background: var(--bg); color: var(--text); font-family: 'Inter', sans-serif; font-size: 14px; line-height: 1.5; }

  .layout { display: flex; height: 100vh; overflow: hidden; }

  /* ── SIDEBAR ── */
  .sidebar {
    width: var(--sidebar-w); background: var(--bg2); border-right: 1px solid var(--border2);
    display: flex; flex-direction: column; flex-shrink: 0; height: 100vh;
    overflow-y: auto; overflow-x: hidden;
  }
  .sidebar::-webkit-scrollbar { width: 0; }

  .sidebar-logo {
    display: flex; align-items: center; gap: 10px;
    padding: 20px 18px 16px; border-bottom: 1px solid var(--border2);
  }
  .logo-shield {
    width: 36px; height: 36px;
    background: linear-gradient(135deg, #1a3a6b 0%, #1e4d9b 100%);
    border-radius: 9px; display: flex; align-items: center; justify-content: center;
    flex-shrink: 0; border: 1px solid rgba(79,142,247,0.3);
  }
  .logo-shield svg { width: 20px; height: 20px; }
  .logo-texts { line-height: 1.1; }
  .logo-name { font-size: 15px; font-weight: 700; color: var(--text); letter-spacing: -0.3px; }
  .logo-name span { color: var(--blue); }
  .logo-tag { font-size: 9px; color: var(--text3); letter-spacing: 1.5px; text-transform: uppercase; margin-top: 1px; }

  .sidebar-section { padding: 12px 10px 4px; }
  .sidebar-section-label { font-size: 9px; letter-spacing: 1.5px; text-transform: uppercase; color: var(--text3); padding: 0 8px; margin-bottom: 4px; font-weight: 600; }

  .nav-item {
    display: flex; align-items: center; gap: 10px; padding: 9px 10px;
    border-radius: var(--radius-sm); cursor: pointer; transition: all 0.15s;
    font-size: 13px; font-weight: 500; color: var(--text2); margin-bottom: 1px;
    position: relative; user-select: none;
  }
  .nav-item:hover { background: rgba(255,255,255,0.04); color: var(--text); }
  .nav-item.active { background: rgba(79,142,247,0.12); color: var(--blue); }
  .nav-item.active .nav-icon { color: var(--blue); }
  .nav-icon { width: 16px; height: 16px; flex-shrink: 0; opacity: 0.8; }
  .nav-item.active .nav-icon { opacity: 1; }
  .nav-badge {
    margin-left: auto; background: var(--red); color: #fff;
    font-size: 9px; font-weight: 700; padding: 1px 6px; border-radius: 99px;
    min-width: 18px; text-align: center;
  }

  .sidebar-bottom { margin-top: auto; border-top: 1px solid var(--border2); padding: 12px 10px; }
  .plan-box {
    background: var(--bg3); border: 1px solid var(--border);
    border-radius: var(--radius-sm); padding: 12px 14px; margin-bottom: 12px;
  }
  .plan-label { font-size: 9px; color: var(--text3); letter-spacing: 1px; text-transform: uppercase; margin-bottom: 4px; }
  .plan-name { font-size: 13px; font-weight: 700; color: var(--text); display: flex; align-items: center; gap: 6px; }
  .plan-active { font-size: 9px; background: var(--green-glow); color: var(--green); border: 1px solid var(--green2); border-radius: 99px; padding: 1px 7px; font-weight: 600; }
  .plan-billing { font-size: 10px; color: var(--text3); margin-top: 4px; }

  .user-row {
    display: flex; align-items: center; gap: 10px; padding: 8px 4px;
    border-radius: var(--radius-sm); cursor: pointer; transition: background 0.15s;
    position: relative;
  }
  .user-row:hover { background: rgba(255,255,255,0.04); }
  .user-avatar {
    width: 32px; height: 32px;
    background: linear-gradient(135deg, #1a3a8c, #3b7de8);
    border-radius: 8px; display: flex; align-items: center; justify-content: center;
    font-size: 11px; font-weight: 700; color: #fff; flex-shrink: 0;
  }
  .user-name { font-size: 12px; font-weight: 600; color: var(--text); line-height: 1.2; }
  .user-email { font-size: 10px; color: var(--text3); }
  .user-company { font-size: 10px; color: var(--text3); margin-top: 2px; }

  .logout-popup {
    position: absolute; bottom: 48px; left: 0; right: 0;
    background: var(--bg4); border: 1px solid var(--border);
    border-radius: var(--radius-sm); padding: 6px;
    z-index: 50; box-shadow: var(--shadow);
  }
  .logout-btn {
    width: 100%; background: transparent; border: none;
    color: var(--red); font-size: 12px; font-weight: 600;
    font-family: 'Inter', sans-serif; padding: 8px 12px;
    border-radius: 6px; cursor: pointer; text-align: left;
    transition: background 0.15s;
  }
  .logout-btn:hover { background: var(--red-glow); }

  /* ── MAIN AREA ── */
  .main-wrap { flex: 1; display: flex; flex-direction: column; overflow: hidden; min-width: 0; }

  /* ── TOPBAR ── */
  .topbar {
    height: var(--header-h); background: var(--bg2); border-bottom: 1px solid var(--border2);
    display: flex; align-items: center; padding: 0 24px; gap: 16px; flex-shrink: 0;
  }
  .topbar-greeting { flex: 1; }
  .topbar-greeting h1 { font-size: 18px; font-weight: 700; letter-spacing: -0.3px; }
  .topbar-greeting p { font-size: 12px; color: var(--text2); margin-top: 1px; }
  .topbar-search {
    display: flex; align-items: center; background: var(--bg3);
    border: 1px solid var(--border); border-radius: var(--radius-sm);
    padding: 0 12px; gap: 8px; width: 260px; transition: border-color 0.15s;
  }
  .topbar-search:focus-within { border-color: var(--blue); }
  .topbar-search input {
    background: none; border: none; outline: none;
    font-size: 12px; color: var(--text); font-family: 'Inter', sans-serif;
    width: 100%; padding: 8px 0;
  }
  .topbar-search input::placeholder { color: var(--text3); }
  .topbar-actions { display: flex; align-items: center; gap: 8px; }
  .topbar-date {
    display: flex; align-items: center; gap: 6px;
    background: var(--bg3); border: 1px solid var(--border);
    border-radius: var(--radius-sm); padding: 7px 12px;
    font-size: 11px; color: var(--text2); white-space: nowrap;
  }
  .icon-btn {
    width: 34px; height: 34px; background: var(--bg3); border: 1px solid var(--border);
    border-radius: var(--radius-sm); display: flex; align-items: center; justify-content: center;
    cursor: pointer; transition: all 0.15s; position: relative; color: var(--text2); flex-shrink: 0;
  }
  .icon-btn:hover { border-color: var(--blue); color: var(--text); }
  .icon-btn svg { width: 15px; height: 15px; }
  .notif-badge {
    position: absolute; top: -4px; right: -4px;
    background: var(--red); color: #fff; font-size: 8px; font-weight: 700;
    width: 16px; height: 16px; border-radius: 50%;
    display: flex; align-items: center; justify-content: center;
    border: 2px solid var(--bg2);
  }

  /* ── SCROLL AREA ── */
  .scroll-area { flex: 1; overflow-y: auto; overflow-x: hidden; padding: 20px 24px; }
  .scroll-area::-webkit-scrollbar { width: 4px; }
  .scroll-area::-webkit-scrollbar-track { background: transparent; }
  .scroll-area::-webkit-scrollbar-thumb { background: var(--border); border-radius: 4px; }

  /* ── KPI CARDS ── */
  .kpi-grid { display: grid; grid-template-columns: repeat(5, 1fr); gap: 14px; margin-bottom: 20px; }
  .kpi-card {
    background: var(--bg2); border: 1px solid var(--border2);
    border-radius: var(--radius); padding: 16px; transition: border-color 0.2s, transform 0.2s; cursor: default;
  }
  .kpi-card:hover { border-color: var(--border); transform: translateY(-1px); }
  .kpi-card.danger { border-color: rgba(239,68,68,0.3); background: rgba(239,68,68,0.04); }
  .kpi-header { display: flex; align-items: flex-start; justify-content: space-between; margin-bottom: 10px; }
  .kpi-icon-wrap {
    width: 36px; height: 36px; border-radius: 9px;
    display: flex; align-items: center; justify-content: center; flex-shrink: 0;
  }
  .kpi-icon-wrap.blue { background: var(--blue-glow); }
  .kpi-icon-wrap.green { background: var(--green-glow); }
  .kpi-icon-wrap.purple { background: var(--purple-glow); }
  .kpi-icon-wrap.amber { background: var(--amber-glow); }
  .kpi-icon-wrap.red { background: var(--red-glow); }
  .kpi-icon-wrap svg { width: 18px; height: 18px; }
  .kpi-icon-wrap.blue svg { color: var(--blue); }
  .kpi-icon-wrap.green svg { color: var(--green); }
  .kpi-icon-wrap.purple svg { color: var(--purple); }
  .kpi-icon-wrap.amber svg { color: var(--amber); }
  .kpi-icon-wrap.red svg { color: var(--red); }
  .kpi-label { font-size: 11px; color: var(--text2); font-weight: 500; margin-bottom: 2px; }
  .kpi-value { font-size: 24px; font-weight: 800; letter-spacing: -0.5px; color: var(--text); line-height: 1.1; }
  .kpi-value.blue { color: var(--blue); } .kpi-value.green { color: var(--green); }
  .kpi-value.purple { color: var(--purple); } .kpi-value.amber { color: var(--amber); }
  .kpi-value.red { color: var(--red); }
  .kpi-change { font-size: 11px; margin-top: 4px; display: flex; align-items: center; gap: 3px; }
  .kpi-change.up { color: var(--green); } .kpi-change.down { color: var(--red); }
  .kpi-change.neutral { color: var(--text3); }

  /* ── PANELS ── */
  .chart-row { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; margin-bottom: 16px; }
  .panel { background: var(--bg2); border: 1px solid var(--border2); border-radius: var(--radius); overflow: hidden; }
  .panel-head {
    display: flex; align-items: center; justify-content: space-between;
    padding: 14px 18px 12px; border-bottom: 1px solid var(--border2);
  }
  .panel-title { font-size: 13px; font-weight: 600; color: var(--text); }
  .panel-subtitle { font-size: 11px; color: var(--text3); margin-top: 1px; }
  .panel-ctrl {
    display: flex; align-items: center; gap: 6px;
    background: var(--bg3); border: 1px solid var(--border);
    border-radius: var(--radius-sm); padding: 5px 10px;
    font-size: 11px; color: var(--text2); cursor: pointer; transition: all 0.15s;
  }
  .panel-ctrl:hover { border-color: var(--blue); color: var(--text); }
  .panel-ctrl svg { width: 12px; height: 12px; }
  .panel-body { padding: 18px; }

  /* ── CHART SVG ── */
  .chart-svg-wrap { position: relative; }
  .chart-svg { width: 100%; overflow: visible; }
  .chart-tooltip {
    position: absolute; background: var(--bg4); border: 1px solid var(--border);
    border-radius: var(--radius-sm); padding: 6px 10px;
    font-size: 11px; font-weight: 600; color: var(--text);
    pointer-events: none; white-space: nowrap;
    transform: translate(-50%, -100%); margin-top: -8px; box-shadow: var(--shadow);
  }
  .chart-grid-line { stroke: var(--border2); stroke-width: 1; }
  .chart-axis-label { fill: var(--text3); font-size: 10px; font-family: 'Inter', sans-serif; }

  /* ── TABLE ── */
  .table-panel { margin-bottom: 16px; }
  .table-head-row {
    display: flex; align-items: center; justify-content: space-between;
    padding: 14px 18px 12px; border-bottom: 1px solid var(--border2);
  }
  .view-all-btn {
    background: transparent; border: 1px solid var(--border); color: var(--text2);
    font-size: 11px; font-weight: 600; padding: 5px 12px; border-radius: 6px;
    cursor: pointer; font-family: 'Inter', sans-serif; transition: all 0.15s;
  }
  .view-all-btn:hover { border-color: var(--blue); color: var(--blue); }
  .data-table { width: 100%; border-collapse: collapse; }
  .data-table th {
    text-align: left; font-size: 10px; font-weight: 700; color: var(--text3);
    letter-spacing: 0.8px; text-transform: uppercase; padding: 10px 18px;
    background: var(--bg3); border-bottom: 1px solid var(--border2);
  }
  .data-table td { padding: 11px 18px; border-bottom: 1px solid rgba(42,51,80,0.5); font-size: 12px; }
  .data-table tbody tr:last-child td { border-bottom: none; }
  .data-table tbody tr:hover td { background: rgba(255,255,255,0.02); }
  .data-table td.blue { color: var(--blue); font-weight: 600; }
  .data-table td.green { color: var(--green); font-weight: 600; }
  .data-table td.red { color: var(--red); font-weight: 600; }
  .data-table td.amber { color: var(--amber); font-weight: 600; }
  .data-table td.text2 { color: var(--text2); }
  .data-table td.text3 { color: var(--text3); }

  /* ── STATUS PILLS ── */
  .pill { font-size: 10px; font-weight: 700; padding: 2px 8px; border-radius: 99px; border: 1px solid; letter-spacing: 0.3px; white-space: nowrap; }
  .pill-high { background: var(--red-glow); color: var(--red); border-color: rgba(239,68,68,0.3); }
  .pill-med { background: var(--amber-glow); color: var(--amber); border-color: rgba(245,158,11,0.3); }
  .pill-low { background: var(--green-glow); color: var(--green); border-color: rgba(34,197,94,0.3); }
  .pill-pending { background: var(--amber-glow); color: var(--amber); border-color: rgba(245,158,11,0.3); }
  .pill-paid { background: var(--green-glow); color: var(--green); border-color: rgba(34,197,94,0.3); }
  .pill-overdue { background: var(--red-glow); color: var(--red); border-color: rgba(239,68,68,0.3); }

  /* ── BOTTOM GRID ── */
  .bottom-row { display: grid; grid-template-columns: repeat(4, 1fr); gap: 14px; margin-bottom: 16px; }
  .mini-card {
    background: var(--bg2); border: 1px solid var(--border2);
    border-radius: var(--radius); padding: 14px 16px;
    display: flex; align-items: center; gap: 12px;
  }
  .mini-icon { width: 38px; height: 38px; border-radius: 9px; display: flex; align-items: center; justify-content: center; flex-shrink: 0; }
  .mini-icon svg { width: 18px; height: 18px; }
  .mini-label { font-size: 10px; color: var(--text3); font-weight: 500; margin-bottom: 2px; }
  .mini-value { font-size: 18px; font-weight: 700; letter-spacing: -0.3px; }
  .mini-change { font-size: 10px; color: var(--text3); margin-top: 2px; }
  .mini-sparkline { margin-left: auto; flex-shrink: 0; }

  /* ── LAST ROW ── */
  .last-row { display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 14px; margin-bottom: 16px; }
  .alert-item {
    padding: 10px 14px; border-bottom: 1px solid rgba(42,51,80,0.5);
    display: flex; gap: 10px; align-items: flex-start;
    transition: background 0.15s; cursor: pointer;
  }
  .alert-item:last-child { border-bottom: none; }
  .alert-item:hover { background: rgba(255,255,255,0.02); }
  .alert-dot { width: 8px; height: 8px; border-radius: 50%; flex-shrink: 0; margin-top: 4px; }
  .alert-dot.red { background: var(--red); box-shadow: 0 0 6px var(--red); }
  .alert-dot.amber { background: var(--amber); }
  .alert-dot.blue { background: var(--blue); }
  .alert-title { font-size: 12px; font-weight: 600; color: var(--text); margin-bottom: 2px; }
  .alert-desc { font-size: 10px; color: var(--text3); }
  .alert-time { font-size: 9px; color: var(--text3); margin-left: auto; white-space: nowrap; flex-shrink: 0; }

  /* ── DONUT ── */
  .donut-wrap { display: flex; align-items: center; gap: 20px; padding: 16px 18px; }
  .donut-legend { flex: 1; display: flex; flex-direction: column; gap: 10px; }
  .legend-item { display: flex; align-items: center; gap: 8px; }
  .legend-dot { width: 10px; height: 10px; border-radius: 3px; flex-shrink: 0; }
  .legend-label { font-size: 11px; color: var(--text2); flex: 1; }
  .legend-value { font-size: 12px; font-weight: 600; color: var(--text); }
  .legend-pct { font-size: 10px; color: var(--text3); }

  /* ── QUICK ACTIONS ── */
  .qa-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 8px; padding: 14px; }
  .qa-btn {
    background: var(--bg3); border: 1px solid var(--border);
    border-radius: var(--radius-sm); padding: 12px;
    cursor: pointer; transition: all 0.15s;
    display: flex; align-items: flex-start; gap: 8px; text-align: left;
  }
  .qa-btn:hover { border-color: var(--blue); background: var(--blue-glow); }
  .qa-icon { width: 28px; height: 28px; border-radius: 7px; display: flex; align-items: center; justify-content: center; flex-shrink: 0; }
  .qa-icon svg { width: 14px; height: 14px; }
  .qa-label { font-size: 11px; font-weight: 700; line-height: 1.2; }
  .qa-sub { font-size: 10px; color: var(--text3); margin-top: 2px; }

  /* ── FORM ── */
  .tab-panel { animation: fadeIn 0.2s ease; }
  @keyframes fadeIn { from { opacity: 0; transform: translateY(6px); } to { opacity: 1; transform: translateY(0); } }
  .two-col { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; margin-bottom: 16px; }
  .three-col { display: grid; grid-template-columns: repeat(3, 1fr); gap: 14px; margin-bottom: 16px; }
  .four-col { display: grid; grid-template-columns: repeat(4, 1fr); gap: 14px; margin-bottom: 16px; }
  .form-group { display: flex; flex-direction: column; gap: 5px; }
  .form-label { font-size: 10px; font-weight: 600; color: var(--text3); letter-spacing: 0.8px; text-transform: uppercase; }
  .form-input {
    background: var(--bg3); border: 1px solid var(--border); border-radius: var(--radius-sm);
    color: var(--text); font-size: 13px; font-family: 'Inter', sans-serif;
    padding: 9px 12px; outline: none; transition: border-color 0.15s; width: 100%;
  }
  .form-input:focus { border-color: var(--blue); }
  .form-input::placeholder { color: var(--text3); }
  .btn {
    font-family: 'Inter', sans-serif; font-size: 12px; font-weight: 600;
    padding: 9px 18px; border-radius: var(--radius-sm); border: none; cursor: pointer;
    transition: all 0.15s; display: inline-flex; align-items: center; gap: 6px; white-space: nowrap;
  }
  .btn-primary { background: var(--blue); color: #fff; }
  .btn-primary:hover { background: var(--blue2); }
  .btn-secondary { background: var(--bg3); color: var(--text2); border: 1px solid var(--border); }
  .btn-secondary:hover { border-color: var(--blue); color: var(--text); }
  .btn-danger { background: transparent; color: var(--red); border: 1px solid rgba(239,68,68,0.4); }
  .btn-danger:hover { background: var(--red-glow); }
  .btn-success { background: transparent; color: var(--green); border: 1px solid rgba(34,197,94,0.4); }
  .btn-success:hover { background: var(--green-glow); }
  .btn:disabled { opacity: 0.4; cursor: not-allowed; }
  .btn svg { width: 13px; height: 13px; }

  .result-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 12px; margin-bottom: 16px; }
  .result-item { background: var(--bg3); border: 1px solid var(--border2); border-radius: var(--radius-sm); padding: 12px 14px; }
  .result-key { font-size: 10px; color: var(--text3); font-weight: 600; text-transform: uppercase; letter-spacing: 0.8px; margin-bottom: 4px; }
  .result-val { font-size: 18px; font-weight: 700; }
  .result-val.green { color: var(--green); } .result-val.red { color: var(--red); }
  .result-val.amber { color: var(--amber); } .result-val.blue { color: var(--blue); }

  .risk-bar-bg { background: var(--bg4); border-radius: 4px; height: 6px; overflow: hidden; margin: 6px 0; }
  .risk-bar-fill { height: 100%; border-radius: 4px; transition: width 0.5s ease; }

  .infobox { border-radius: var(--radius-sm); padding: 10px 14px; font-size: 12px; display: flex; align-items: flex-start; gap: 8px; border: 1px solid; margin-top: 10px; }
  .infobox.warn { background: var(--amber-glow); border-color: rgba(245,158,11,0.3); color: #fcd34d; }
  .infobox.danger { background: var(--red-glow); border-color: rgba(239,68,68,0.3); color: #fca5a5; }
  .infobox.ok { background: var(--green-glow); border-color: rgba(34,197,94,0.3); color: #86efac; }

  /* ── AI ── */
  .ai-wrap { max-width: 900px; }
  .quick-prompts { display: flex; flex-wrap: wrap; gap: 8px; margin-bottom: 16px; }
  .qp-btn {
    background: var(--bg3); border: 1px solid var(--border);
    color: var(--text2); font-size: 11px; font-weight: 500;
    padding: 7px 14px; border-radius: 99px;
    cursor: pointer; transition: all 0.15s; font-family: 'Inter', sans-serif;
  }
  .qp-btn:hover { border-color: var(--blue); color: var(--blue); background: var(--blue-glow); }
  .ai-input-row { display: flex; gap: 10px; margin-bottom: 16px; }
  .ai-response {
    background: var(--bg3); border: 1px solid var(--border2);
    border-radius: var(--radius); padding: 20px;
    font-size: 13px; line-height: 1.75; color: var(--text2);
    white-space: pre-wrap; min-height: 140px;
  }
  .ai-typing { color: var(--blue); font-weight: 500; }
  .ai-blink { animation: blink 0.7s infinite; }
  @keyframes blink { 0%,100% { opacity: 1; } 50% { opacity: 0; } }

  /* ── CF ── */
  .cf-status { padding: 14px 18px 0; border-bottom: 1px solid var(--border2); }
  .cf-status-text { font-size: 13px; font-weight: 700; color: var(--green); }
  .cf-status-sub { font-size: 11px; color: var(--text3); margin-top: 2px; margin-bottom: 8px; }
  .cf-balance { font-size: 28px; font-weight: 800; color: var(--text); letter-spacing: -0.5px; margin-bottom: 14px; }

  /* ── EMPTY STATE ── */
  .empty-state { padding: 48px; text-align: center; color: var(--text3); font-size: 13px; }
  .empty-state-icon { font-size: 36px; margin-bottom: 12px; }
  .empty-state-title { font-size: 15px; font-weight: 700; color: var(--text2); margin-bottom: 6px; }

  /* ── DB LOADING ── */
  .db-loading { padding: 32px; text-align: center; color: var(--text3); font-size: 12px; }

  /* ── RESPONSIVE ── */
  @media (max-width: 1200px) { .kpi-grid { grid-template-columns: repeat(3, 1fr); } .last-row { grid-template-columns: 1fr 1fr; } }
  @media (max-width: 900px) {
    :root { --sidebar-w: 56px; }
    .logo-texts, .nav-item span, .sidebar-section-label, .plan-box, .user-name, .user-email, .user-company { display: none; }
    .nav-item { justify-content: center; padding: 10px; }
    .chart-row, .two-col, .three-col, .four-col, .bottom-row, .last-row { grid-template-columns: 1fr; }
    .kpi-grid { grid-template-columns: repeat(2, 1fr); }
    .result-grid { grid-template-columns: repeat(2, 1fr); }
  }
`

// ─── HELPERS ──────────────────────────────────────────────────────────────────
const fmt = (n) => '$' + Math.abs(n).toLocaleString('en-US', { minimumFractionDigits: 0 })
const fmtPct = (n) => n.toFixed(1) + '%'
const today = () => new Date().toISOString().split('T')[0]
const daysDiff = (d) => Math.round((new Date(d) - new Date()) / 86400000)

function calcLoad(load) {
  const revenue = parseFloat(load.customer_rate) || 0
  const carrier = parseFloat(load.carrier_cost) || 0
  const fuel = parseFloat(load.fuel) || 0
  const other = parseFloat(load.other) || 0
  const totalCost = carrier + fuel + other
  const profit = revenue - totalCost
  const margin = revenue > 0 ? (profit / revenue) * 100 : 0
  let risk = margin < 5 ? 90 : margin < 10 ? 70 : margin < 15 ? 45 : margin < 20 ? 25 : 10
  return { revenue, carrier, fuel, other, totalCost, profit, margin, risk, carrierSurge5: profit - carrier * 0.05 }
}

function riskLabel(s) {
  if (s >= 70) return { label: 'High Risk', cls: 'pill-high' }
  if (s >= 40) return { label: 'Medium Risk', cls: 'pill-med' }
  return { label: 'Low Risk', cls: 'pill-low' }
}

const ICONS = {
  dashboard: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/></svg>,
  loads: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="1" y="3" width="15" height="13" rx="2"/><polygon points="16 8 20 8 23 11 23 16 16 16 16 8"/><circle cx="5.5" cy="18.5" r="2.5"/><circle cx="18.5" cy="18.5" r="2.5"/></svg>,
  profit: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="22 7 13.5 15.5 8.5 10.5 2 17"/><polyline points="16 7 22 7 22 13"/></svg>,
  invoices: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/></svg>,
  expenses: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="16"/><line x1="8" y1="12" x2="16" y2="12"/></svg>,
  cashflow: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M22 12h-4l-3 9L9 3l-3 9H2"/></svg>,
  customers: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>,
  carriers: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="1" y="3" width="15" height="13"/><polygon points="16 8 20 8 23 11 23 16 16 16 16 8"/><circle cx="5.5" cy="18.5" r="2.5"/><circle cx="18.5" cy="18.5" r="2.5"/></svg>,
  reports: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/></svg>,
  alerts: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 0 1-3.46 0"/></svg>,
  documents: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>,
  integrations: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="18" cy="18" r="3"/><circle cx="6" cy="6" r="3"/><path d="M13 6h3a2 2 0 0 1 2 2v7"/><line x1="6" y1="9" x2="6" y2="21"/></svg>,
  ai: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 2a10 10 0 0 1 10 10c0 5.52-4.48 10-10 10S2 17.52 2 12 6.48 2 12 2z"/><path d="M12 8v4l3 3"/></svg>,
  settings: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="3"/><path d="M19.07 4.93a10 10 0 0 0-14.14 0M4.93 19.07a10 10 0 0 0 14.14 0M12 2v2M12 20v2M2 12h2M20 12h2"/></svg>,
}

const NAV = [
  { id: 'dashboard', label: 'Dashboard', section: 'main' },
  { id: 'loads', label: 'Loads', section: 'main' },
  { id: 'invoices', label: 'Invoices', section: 'main' },
  { id: 'cashflow', label: 'Cash Flow Radar', section: 'main' },
  { id: 'reports', label: 'Reports', section: 'tools' },
  { id: 'ai', label: 'AI Advisor', section: 'tools' },
  { id: 'settings', label: 'Settings', section: 'tools' },
]

// ─── SPARKLINE ────────────────────────────────────────────────────────────────
function Sparkline({ data, color = '#4f8ef7', width = 72, height = 28 }) {
  if (!data || data.length < 2) return null
  const min = Math.min(...data), max = Math.max(...data)
  const range = max - min || 1
  const pts = data.map((v, i) => {
    const x = (i / (data.length - 1)) * width
    const y = height - ((v - min) / range) * height
    return `${x},${y}`
  }).join(' ')
  return (
    <svg width={width} height={height} style={{ overflow: 'visible' }}>
      <polyline points={pts} fill="none" stroke={color} strokeWidth="1.5" strokeLinejoin="round" strokeLinecap="round" />
    </svg>
  )
}

// ─── LINE CHART ───────────────────────────────────────────────────────────────
function LineChart({ data, labels, color = '#4f8ef7', height = 180, prefix = '$' }) {
  const [hover, setHover] = useState(null)
  const svgRef = useRef(null)
  const W = 520, H = height, PAD = { t: 10, r: 10, b: 28, l: 48 }
  const cW = W - PAD.l - PAD.r, cH = H - PAD.t - PAD.b
  const max = Math.max(...data) * 1.15 || 1
  const xScale = (i) => PAD.l + (i / Math.max(data.length - 1, 1)) * cW
  const yScale = (v) => PAD.t + cH - (v / max) * cH
  const pts = data.map((v, i) => `${xScale(i)},${yScale(v)}`).join(' ')
  const areaPath = `M${xScale(0)},${PAD.t + cH} ` + data.map((v, i) => `L${xScale(i)},${yScale(v)}`).join(' ') + ` L${xScale(data.length - 1)},${PAD.t + cH} Z`
  const gridVals = [0, max * 0.25, max * 0.5, max * 0.75, max].map(v => Math.round(v))

  return (
    <div className="chart-svg-wrap">
      <svg ref={svgRef} viewBox={`0 0 ${W} ${H}`} className="chart-svg"
        onMouseLeave={() => setHover(null)}
        onMouseMove={(e) => {
          const rect = svgRef.current?.getBoundingClientRect()
          if (!rect) return
          const mx = (e.clientX - rect.left) * (W / rect.width)
          let best = 0, bestDist = Infinity
          data.forEach((_, i) => { const d = Math.abs(xScale(i) - mx); if (d < bestDist) { bestDist = d; best = i } })
          setHover(bestDist < 30 ? best : null)
        }}>
        <defs>
          <linearGradient id={`grad-${color.replace('#', '')}`} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={color} stopOpacity="0.18" />
            <stop offset="100%" stopColor={color} stopOpacity="0.01" />
          </linearGradient>
        </defs>
        {gridVals.map((v, i) => (
          <g key={i}>
            <line x1={PAD.l} y1={yScale(v)} x2={PAD.l + cW} y2={yScale(v)} className="chart-grid-line" />
            <text x={PAD.l - 6} y={yScale(v) + 4} textAnchor="end" className="chart-axis-label">
              {v >= 1000 ? prefix + (v / 1000).toFixed(0) + 'K' : prefix + v}
            </text>
          </g>
        ))}
        {labels.map((lbl, i) => i % Math.ceil(labels.length / 6) === 0 || i === labels.length - 1
          ? <text key={i} x={xScale(i)} y={H - 4} textAnchor="middle" className="chart-axis-label">{lbl}</text>
          : null
        )}
        <path d={areaPath} fill={`url(#grad-${color.replace('#', '')})`} />
        <polyline points={pts} fill="none" stroke={color} strokeWidth="2" strokeLinejoin="round" strokeLinecap="round" />
        {data.map((v, i) => (
          <circle key={i} cx={xScale(i)} cy={yScale(v)} r={hover === i ? 5 : 3}
            fill={hover === i ? color : 'var(--bg2)'} stroke={color} strokeWidth="2"
            style={{ cursor: 'crosshair', transition: 'r 0.15s' }} />
        ))}
        {hover !== null && <line x1={xScale(hover)} y1={PAD.t} x2={xScale(hover)} y2={PAD.t + cH} stroke={color} strokeWidth="1" strokeDasharray="3,4" opacity="0.5" />}
      </svg>
      {hover !== null && (
        <div className="chart-tooltip" style={{ left: `${(xScale(hover) / W) * 100}%`, top: `${(yScale(data[hover]) / H) * 100}%` }}>
          {prefix}{data[hover].toLocaleString()}
        </div>
      )}
    </div>
  )
}

// ─── DONUT ────────────────────────────────────────────────────────────────────
function DonutChart({ segments, total, centerLabel, centerSub, size = 130 }) {
  const [hov, setHov] = useState(null)
  const r = 44, cx = size / 2, cy = size / 2, stroke = 20
  const circ = 2 * Math.PI * r
  let cum = 0
  const paths = segments.map((seg, i) => {
    const pct = seg.value / total
    const dash = pct * circ, gap = circ - dash, offset = circ - cum * circ
    cum += pct
    return { ...seg, dash, gap, offset, i }
  })
  return (
    <div className="donut-wrap">
      <div style={{ position: 'relative', width: size, height: size, flexShrink: 0 }}>
        <svg width={size} height={size} style={{ transform: 'rotate(-90deg)' }}>
          <circle cx={cx} cy={cy} r={r} fill="none" stroke="var(--bg4)" strokeWidth={stroke} />
          {paths.map((p) => (
            <circle key={p.i} cx={cx} cy={cy} r={r} fill="none"
              stroke={p.color} strokeWidth={hov === p.i ? stroke + 3 : stroke}
              strokeDasharray={`${p.dash} ${p.gap}`} strokeDashoffset={p.offset}
              style={{ cursor: 'pointer', transition: 'stroke-width 0.2s' }}
              onMouseEnter={() => setHov(p.i)} onMouseLeave={() => setHov(null)} />
          ))}
        </svg>
        <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
          <div style={{ fontSize: 14, fontWeight: 800, color: 'var(--text)', letterSpacing: '-0.3px' }}>{centerLabel}</div>
          <div style={{ fontSize: 9, color: 'var(--text3)', textAlign: 'center', marginTop: 2 }}>{centerSub}</div>
        </div>
      </div>
      <div className="donut-legend">
        {segments.map((seg, i) => (
          <div key={i} className="legend-item" onMouseEnter={() => setHov(i)} onMouseLeave={() => setHov(null)}
            style={{ cursor: 'pointer', opacity: hov === null || hov === i ? 1 : 0.5, transition: 'opacity 0.2s' }}>
            <div className="legend-dot" style={{ background: seg.color }} />
            <div className="legend-label">{seg.label}</div>
            <div className="legend-value">{fmt(seg.value)}</div>
            <div className="legend-pct">({total > 0 ? Math.round(seg.value / total * 100) : 0}%)</div>
          </div>
        ))}
      </div>
    </div>
  )
}

// ─── DASHBOARD VIEW ───────────────────────────────────────────────────────────
function DashboardView({ loads, invoices, expenses }) {
  const allCalc = loads.map(calcLoad)
  const totalRevenue = allCalc.reduce((s, c) => s + c.revenue, 0)
  const totalProfit = allCalc.reduce((s, c) => s + c.profit, 0)
  const avgMargin = allCalc.length ? allCalc.reduce((s, c) => s + c.margin, 0) / allCalc.length : 0
  const highRiskLoads = loads.filter((_, i) => allCalc[i].risk >= 70).length

  const totalExpenses = Object.values(expenses).reduce((s, v) => s + (parseFloat(v) || 0), 0)

  // Build profit trend from actual loads by date
  const profitByDate = {}
  loads.forEach((l, i) => {
    const d = l.date || today()
    if (!profitByDate[d]) profitByDate[d] = 0
    profitByDate[d] += allCalc[i].profit
  })
  const sortedDates = Object.keys(profitByDate).sort()
  const profitData = sortedDates.length > 1 ? sortedDates.map(d => profitByDate[d]) : [0, totalProfit || 0]
  const profitLabels = sortedDates.length > 1 ? sortedDates.map(d => d.slice(5)) : ['Start', 'Now']

  // Cash flow projection
  const weeklyExp = totalExpenses / 4
  let cum = 0
  const cfData = Array.from({ length: 8 }, (_, i) => {
    const inc = loads.reduce((s, l) => {
      const pd = parseFloat(l.payment_days) || 30
      const c = calcLoad(l)
      return (pd >= i * 7 && pd < (i + 1) * 7) ? s + c.revenue : s
    }, 0)
    cum += inc - weeklyExp
    return Math.max(0, cum + totalRevenue * 0.1)
  })
  const cfLabels = cfData.map((_, i) => {
    const d = new Date(); d.setDate(d.getDate() + i * 7)
    return `${d.toLocaleString('default', { month: 'short' })} ${d.getDate()}`
  })

  const invoiceSegs = [
    { label: 'Paid', color: '#22c55e', value: invoices.filter(i => i.status === 'paid').reduce((s, i) => s + (i.amount || 0), 0) },
    { label: 'Pending', color: '#4f8ef7', value: invoices.filter(i => i.status === 'pending').reduce((s, i) => s + (i.amount || 0), 0) },
    { label: 'Overdue', color: '#ef4444', value: invoices.filter(i => i.status === 'overdue').reduce((s, i) => s + (i.amount || 0), 0) },
  ].filter(s => s.value > 0)
  const invTotal = invoiceSegs.reduce((s, seg) => s + seg.value, 0)
  const outstanding = invoiceSegs.filter(s => s.label !== 'Paid').reduce((s, seg) => s + seg.value, 0)

  const overdueInvoices = invoices.filter(i => i.status === 'overdue')
  const alerts = [
    ...loads.filter((_, i) => allCalc[i].risk >= 70).slice(0, 2).map(l => ({ color: 'red', title: 'High Risk Load', desc: `Load ${l.load_id || l.id} has critically low margin`, time: 'recent' })),
    ...overdueInvoices.slice(0, 2).map(inv => ({ color: 'amber', title: 'Invoice Overdue', desc: `${inv.invoice_no} — ${inv.customer} overdue ${Math.abs(daysDiff(inv.due_date))}d`, time: 'recent' })),
  ]

  return (
    <div className="tab-panel">
      <div className="kpi-grid">
        {[
          { label: 'Total Revenue', val: fmt(totalRevenue), cls: 'blue', change: `${loads.length} loads tracked`, dir: 'neutral', icon: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/></svg>, iconCls: 'blue' },
          { label: 'Gross Profit', val: fmt(totalProfit), cls: 'green', change: avgMargin > 0 ? `Avg margin ${fmtPct(avgMargin)}` : 'No loads yet', dir: totalProfit >= 0 ? 'up' : 'down', icon: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="22 7 13.5 15.5 8.5 10.5 2 17"/></svg>, iconCls: 'green' },
          { label: 'Avg Margin', val: fmtPct(avgMargin), cls: 'purple', change: avgMargin >= 15 ? '✅ Healthy' : avgMargin >= 8 ? '⚠️ Thin' : '🔴 Critical', dir: 'neutral', icon: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><path d="M12 8v8M8 12h8"/></svg>, iconCls: 'purple' },
          { label: 'Outstanding A/R', val: fmt(outstanding), cls: 'amber', change: `${invoices.filter(i => i.status !== 'paid').length} open invoices`, dir: 'neutral', icon: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="2" y="7" width="20" height="14" rx="2"/><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"/></svg>, iconCls: 'amber' },
        ].map((k, i) => (
          <div key={i} className="kpi-card">
            <div className="kpi-header">
              <div>
                <div className="kpi-label">{k.label}</div>
                <div className={`kpi-value ${k.cls}`}>{k.val}</div>
                <div className={`kpi-change ${k.dir}`}>{k.change}</div>
              </div>
              <div className={`kpi-icon-wrap ${k.iconCls}`}>{k.icon}</div>
            </div>
          </div>
        ))}
        <div className={`kpi-card ${highRiskLoads > 0 ? 'danger' : ''}`}>
          <div className="kpi-header">
            <div>
              <div className="kpi-label">High Risk Loads</div>
              <div className={`kpi-value ${highRiskLoads > 0 ? 'red' : 'green'}`}>{highRiskLoads}</div>
              <div className="kpi-change neutral">{highRiskLoads > 0 ? 'Needs attention' : 'All loads healthy'}</div>
            </div>
            <div className="kpi-icon-wrap red">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>
            </div>
          </div>
        </div>
      </div>

      <div className="chart-row">
        <div className="panel">
          <div className="panel-head">
            <div className="panel-title">Profit Trend</div>
            <div className="panel-ctrl">{loads.length} loads</div>
          </div>
          <div className="panel-body">
            {loads.length > 0
              ? <LineChart data={profitData} labels={profitLabels} color="#4f8ef7" height={180} />
              : <div className="empty-state"><div className="empty-state-icon">📊</div><div className="empty-state-title">No loads yet</div>Add your first load to see profit trends</div>
            }
          </div>
        </div>
        <div className="panel">
          <div className="cf-status">
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div className="panel-title">Cash Flow Radar</div>
              <div className="panel-ctrl">8-Week Forecast</div>
            </div>
            <div className="cf-status-text">✦ {totalRevenue > totalExpenses ? 'Cash flow positive' : 'Monitor cash position'}</div>
            <div className="cf-status-sub">Projected based on your loads & expenses</div>
            <div style={{ fontSize: 11, color: 'var(--text3)', marginTop: 4 }}>Projected Cash Balance</div>
            <div className="cf-balance">{fmt(Math.max(0, totalRevenue - totalExpenses))}</div>
          </div>
          <div className="panel-body" style={{ paddingTop: 10 }}>
            <LineChart data={cfData} labels={cfLabels} color="#22c55e" height={130} />
          </div>
        </div>
      </div>

      <div className="panel table-panel">
        <div className="table-head-row">
          <div className="panel-title">Recent Loads</div>
          <span style={{ fontSize: 11, color: 'var(--text3)' }}>{loads.length} total</span>
        </div>
        {loads.length === 0
          ? <div className="empty-state"><div className="empty-state-icon">🚛</div><div className="empty-state-title">No loads yet</div>Go to Loads tab to add your first load</div>
          : <table className="data-table">
              <thead><tr><th>Load ID</th><th>Customer</th><th>Route</th><th>Revenue</th><th>Profit</th><th>Margin</th><th>Risk</th><th>Status</th></tr></thead>
              <tbody>
                {loads.slice(0, 5).map((l, i) => {
                  const c = calcLoad(l)
                  const rl = riskLabel(c.risk)
                  return (
                    <tr key={l.id}>
                      <td className="blue">{l.load_id || `LD-${l.id?.toString().slice(-4)}`}</td>
                      <td className="text2">{l.customer}</td>
                      <td className="text3">{l.origin} → {l.dest}</td>
                      <td className="blue">{fmt(c.revenue)}</td>
                      <td className={c.profit >= 0 ? 'green' : 'red'}>{fmt(c.profit)}</td>
                      <td className={c.margin >= 15 ? 'green' : c.margin >= 8 ? '' : 'red'}>{fmtPct(c.margin)}</td>
                      <td><span style={{ fontWeight: 700, color: c.risk >= 70 ? 'var(--red)' : c.risk >= 40 ? 'var(--amber)' : 'var(--green)' }}>{c.risk}</span></td>
                      <td><span className={`pill ${rl.cls}`}>{rl.label}</span></td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
        }
      </div>

      <div className="last-row">
        <div className="panel">
          <div className="panel-head"><div className="panel-title">Live Alerts</div></div>
          {alerts.length === 0
            ? <div className="empty-state" style={{ padding: 24 }}><div style={{ fontSize: 24, marginBottom: 8 }}>✅</div>No active alerts</div>
            : alerts.map((a, i) => (
              <div key={i} className="alert-item">
                <div className={`alert-dot ${a.color}`} />
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div className="alert-title">{a.title}</div>
                  <div className="alert-desc">{a.desc}</div>
                </div>
                <div className="alert-time">{a.time}</div>
              </div>
            ))
          }
        </div>

        <div className="panel">
          <div className="table-head-row"><div className="panel-title">Invoices Overview</div></div>
          {invTotal > 0
            ? <DonutChart segments={invoiceSegs} total={invTotal} centerLabel={fmt(outstanding)} centerSub="Outstanding" />
            : <div className="empty-state" style={{ padding: 24 }}><div className="empty-state-icon">📄</div>No invoices yet</div>
          }
        </div>

        <div className="panel">
          <div style={{ padding: '12px 18px 8px', borderBottom: '1px solid var(--border2)' }}>
            <div className="panel-title">Quick Actions</div>
          </div>
          <div className="qa-grid">
            {[
              { icon: 'loads', color: '#4f8ef7', bg: 'var(--blue-glow)', label: 'Add New Load', sub: 'Create a new load', tab: 'loads' },
              { icon: 'invoices', color: '#22c55e', bg: 'var(--green-glow)', label: 'Create Invoice', sub: 'Generate invoice', tab: 'invoices' },
              { icon: 'cashflow', color: '#a855f7', bg: 'var(--purple-glow)', label: 'Cash Flow', sub: 'Check forecast', tab: 'cashflow' },
              { icon: 'ai', color: '#f59e0b', bg: 'var(--amber-glow)', label: 'AI Advisor', sub: 'Get insights', tab: 'ai' },
            ].map((qa, i) => (
              <div key={i} className="qa-btn">
                <div className="qa-icon" style={{ background: qa.bg }}>
                  <span style={{ color: qa.color }}>{ICONS[qa.icon]}</span>
                </div>
                <div><div className="qa-label" style={{ color: qa.color }}>{qa.label}</div><div className="qa-sub">{qa.sub}</div></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

// ─── LOADS VIEW ───────────────────────────────────────────────────────────────
function LoadsView({ loads, setLoads, userId }) {
  const empty = { load_id: '', origin: '', dest: '', customer: '', customer_rate: '', carrier_cost: '', fuel: '', other: '', payment_days: '30' }
  const [form, setForm] = useState(empty)
  const [result, setResult] = useState(null)
  const [saving, setSaving] = useState(false)
  const fc = (k, v) => setForm(f => ({ ...f, [k]: v }))

  const handleCalc = () => {
    if (!form.customer_rate || !form.carrier_cost) return
    setResult(calcLoad(form))
  }

  const handleAdd = async () => {
    if (!result) return
    setSaving(true)
    const payload = { ...form, user_id: userId, date: today(), customer_rate: parseFloat(form.customer_rate), carrier_cost: parseFloat(form.carrier_cost), fuel: parseFloat(form.fuel) || 0, other: parseFloat(form.other) || 0, payment_days: parseInt(form.payment_days) || 30 }
    const { data, error } = await supabase.from('loads').insert([payload]).select()
    if (!error && data) { setLoads(p => [data[0], ...p]); setForm(empty); setResult(null) }
    else console.error('Insert load error:', error)
    setSaving(false)
  }

  const handleDelete = async (id) => {
    await supabase.from('loads').delete().eq('id', id)
    setLoads(p => p.filter(x => x.id !== id))
  }

  const r = result
  const rl = r ? riskLabel(r.risk) : null

  return (
    <div className="tab-panel">
      <div className="chart-row">
        <div className="panel">
          <div className="panel-head"><div className="panel-title">Load Entry</div></div>
          <div className="panel-body">
            <div className="two-col" style={{ marginBottom: 14 }}>
              {[['load_id', 'Load ID', 'LD-010'], ['customer', 'Customer', 'Apex Logistics'], ['origin', 'Origin', 'Chicago, IL'], ['dest', 'Destination', 'Dallas, TX']].map(([k, l, ph]) => (
                <div key={k} className="form-group">
                  <label className="form-label">{l}</label>
                  <input className="form-input" placeholder={ph} value={form[k]} onChange={e => fc(k, e.target.value)} />
                </div>
              ))}
            </div>
            <div className="two-col" style={{ marginBottom: 14 }}>
              {[['customer_rate', 'Customer Rate ($)', '3000'], ['carrier_cost', 'Carrier Cost ($)', '2400'], ['fuel', 'Fuel ($)', '200'], ['other', 'Other Expenses ($)', '100']].map(([k, l, ph]) => (
                <div key={k} className="form-group">
                  <label className="form-label">{l}</label>
                  <input className="form-input" type="number" placeholder={ph} value={form[k]} onChange={e => fc(k, e.target.value)} />
                </div>
              ))}
            </div>
            <div className="form-group" style={{ marginBottom: 16 }}>
              <label className="form-label">Payment Terms (days)</label>
              <input className="form-input" type="number" placeholder="30" value={form.payment_days} onChange={e => fc('payment_days', e.target.value)} />
            </div>
            <div style={{ display: 'flex', gap: 10 }}>
              <button className="btn btn-primary" onClick={handleCalc}>⚡ Calculate</button>
              {r && <button className="btn btn-secondary" onClick={handleAdd} disabled={saving}>{saving ? 'Saving…' : '+ Save Load'}</button>}
            </div>
          </div>
        </div>

        <div className="panel">
          <div className="panel-head">
            <div className="panel-title">Analysis</div>
            {rl && <span className={`pill ${rl.cls}`}>{rl.label}</span>}
          </div>
          <div className="panel-body">
            {!r
              ? <div style={{ color: 'var(--text3)', textAlign: 'center', padding: '40px 0', fontSize: 13 }}>Enter load data and click Calculate</div>
              : <>
                  <div className="result-grid">
                    <div className="result-item"><div className="result-key">Revenue</div><div className="result-val blue">{fmt(r.revenue)}</div></div>
                    <div className="result-item"><div className="result-key">Total Cost</div><div className="result-val red">{fmt(r.totalCost)}</div></div>
                    <div className="result-item"><div className="result-key">Net Profit</div><div className={`result-val ${r.profit >= 0 ? 'green' : 'red'}`}>{fmt(r.profit)}</div></div>
                    <div className="result-item"><div className="result-key">Margin</div><div className={`result-val ${r.margin >= 15 ? 'green' : r.margin >= 8 ? 'amber' : 'red'}`}>{fmtPct(r.margin)}</div></div>
                    <div className="result-item"><div className="result-key">Carrier</div><div className="result-val">{fmt(r.carrier)}</div></div>
                    <div className="result-item"><div className="result-key">Fuel</div><div className="result-val">{fmt(r.fuel)}</div></div>
                  </div>
                  <div style={{ marginBottom: 16 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
                      <span style={{ fontSize: 11, color: 'var(--text3)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.8px' }}>Risk Score</span>
                      <span style={{ fontSize: 20, fontWeight: 800, color: r.risk >= 70 ? 'var(--red)' : r.risk >= 40 ? 'var(--amber)' : 'var(--green)' }}>{r.risk}/100</span>
                    </div>
                    <div className="risk-bar-bg">
                      <div className="risk-bar-fill" style={{ width: r.risk + '%', background: r.risk >= 70 ? 'var(--red)' : r.risk >= 40 ? 'var(--amber)' : 'var(--green)' }} />
                    </div>
                  </div>
                  {r.risk >= 70 && <div className="infobox danger">⚠️ HIGH RISK — Margin critically low. Renegotiate before accepting.</div>}
                  {r.risk >= 40 && r.risk < 70 && <div className="infobox warn">⚠️ MEDIUM RISK — Thin margin. Monitor carrier rates.</div>}
                  {r.carrierSurge5 < 0 && <div className="infobox danger">⚠️ A 5% carrier increase will turn this load into a LOSS</div>}
                  {r.margin >= 20 && <div className="infobox ok">✅ Healthy margin — Good load to accept.</div>}
                </>
            }
          </div>
        </div>
      </div>

      <div className="panel">
        <div className="panel-head">
          <div className="panel-title">Load Portfolio</div>
          <span style={{ fontSize: 11, color: 'var(--text3)' }}>{loads.length} loads</span>
        </div>
        {loads.length === 0
          ? <div className="empty-state"><div className="empty-state-icon">🚛</div><div className="empty-state-title">No loads yet</div>Add your first load above to get started</div>
          : <table className="data-table">
              <thead><tr><th>Load ID</th><th>Route</th><th>Customer</th><th>Revenue</th><th>Cost</th><th>Profit</th><th>Margin</th><th>Risk</th><th>Terms</th><th></th></tr></thead>
              <tbody>
                {loads.map(l => {
                  const c = calcLoad(l)
                  const rl = riskLabel(c.risk)
                  return (
                    <tr key={l.id}>
                      <td className="blue">{l.load_id || '—'}</td>
                      <td className="text3">{l.origin} → {l.dest}</td>
                      <td className="text2">{l.customer || '—'}</td>
                      <td className="blue">{fmt(c.revenue)}</td>
                      <td className="text2">{fmt(c.totalCost)}</td>
                      <td className={c.profit >= 0 ? 'green' : 'red'}>{fmt(c.profit)}</td>
                      <td className={c.margin >= 15 ? 'green' : c.margin >= 8 ? '' : 'red'}>{fmtPct(c.margin)}</td>
                      <td><span className={`pill ${rl.cls}`}>{c.risk}</span></td>
                      <td className="text3">{l.payment_days}d</td>
                      <td><button className="btn btn-danger" style={{ padding: '4px 8px', fontSize: 10 }} onClick={() => handleDelete(l.id)}>✕</button></td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
        }
      </div>
    </div>
  )
}

// ─── INVOICES VIEW ────────────────────────────────────────────────────────────
function InvoicesView({ invoices, setInvoices, userId }) {
  const empty = { invoice_no: '', customer: '', amount: '', issue_date: today(), due_date: '', status: 'pending' }
  const [form, setForm] = useState(empty)
  const [showForm, setShowForm] = useState(false)
  const [saving, setSaving] = useState(false)

  const processed = invoices.map(i => i.status !== 'paid' && i.due_date && daysDiff(i.due_date) < 0 ? { ...i, status: 'overdue' } : i)
  const overdueTot = processed.filter(i => i.status === 'overdue').reduce((s, i) => s + (i.amount || 0), 0)
  const pendTot = processed.filter(i => i.status === 'pending').reduce((s, i) => s + (i.amount || 0), 0)
  const paidTot = processed.filter(i => i.status === 'paid').reduce((s, i) => s + (i.amount || 0), 0)

  const handleAdd = async () => {
    if (!form.invoice_no || !form.amount || !form.due_date) return
    setSaving(true)
    const payload = { ...form, user_id: userId, amount: parseFloat(form.amount) }
    const { data, error } = await supabase.from('invoices').insert([payload]).select()
    if (!error && data) { setInvoices(p => [data[0], ...p]); setForm(empty); setShowForm(false) }
    setSaving(false)
  }

  const handleMarkPaid = async (id) => {
    await supabase.from('invoices').update({ status: 'paid' }).eq('id', id)
    setInvoices(p => p.map(i => i.id === id ? { ...i, status: 'paid' } : i))
  }

  const handleDelete = async (id) => {
    await supabase.from('invoices').delete().eq('id', id)
    setInvoices(p => p.filter(i => i.id !== id))
  }

  return (
    <div className="tab-panel">
      <div className="three-col">
        {[
          { label: 'Overdue', val: fmt(overdueTot), sub: processed.filter(i => i.status === 'overdue').length + ' invoice(s)', color: 'var(--red)' },
          { label: 'Pending', val: fmt(pendTot), sub: processed.filter(i => i.status === 'pending').length + ' invoice(s)', color: 'var(--amber)' },
          { label: 'Paid', val: fmt(paidTot), sub: processed.filter(i => i.status === 'paid').length + ' invoice(s)', color: 'var(--green)' },
        ].map((card, i) => (
          <div key={i} className="panel" style={{ padding: 18 }}>
            <div style={{ fontSize: 10, fontWeight: 600, color: 'var(--text3)', textTransform: 'uppercase', letterSpacing: '0.8px', marginBottom: 6 }}>{card.label}</div>
            <div style={{ fontSize: 26, fontWeight: 800, color: card.color, letterSpacing: '-0.5px' }}>{card.val}</div>
            <div style={{ fontSize: 11, color: 'var(--text3)', marginTop: 4 }}>{card.sub}</div>
          </div>
        ))}
      </div>

      <div className="panel">
        <div className="table-head-row">
          <div className="panel-title">Invoice Tracker</div>
          <button className="btn btn-primary" style={{ fontSize: 11 }} onClick={() => setShowForm(v => !v)}>
            {showForm ? '✕ Cancel' : '+ New Invoice'}
          </button>
        </div>

        {showForm && (
          <div className="panel-body" style={{ borderBottom: '1px solid var(--border2)' }}>
            <div className="two-col" style={{ marginBottom: 14 }}>
              {[['invoice_no', 'Invoice No', 'INV-001'], ['customer', 'Customer', 'Apex Logistics']].map(([k, l, ph]) => (
                <div key={k} className="form-group">
                  <label className="form-label">{l}</label>
                  <input className="form-input" placeholder={ph} value={form[k]} onChange={e => setForm(f => ({ ...f, [k]: e.target.value }))} />
                </div>
              ))}
            </div>
            <div className="three-col" style={{ marginBottom: 14 }}>
              <div className="form-group">
                <label className="form-label">Amount ($)</label>
                <input className="form-input" type="number" placeholder="5000" value={form.amount} onChange={e => setForm(f => ({ ...f, amount: e.target.value }))} />
              </div>
              <div className="form-group">
                <label className="form-label">Issue Date</label>
                <input className="form-input" type="date" value={form.issue_date} onChange={e => setForm(f => ({ ...f, issue_date: e.target.value }))} />
              </div>
              <div className="form-group">
                <label className="form-label">Due Date</label>
                <input className="form-input" type="date" value={form.due_date} onChange={e => setForm(f => ({ ...f, due_date: e.target.value }))} />
              </div>
            </div>
            <button className="btn btn-primary" onClick={handleAdd} disabled={saving}>{saving ? 'Saving…' : 'Save Invoice'}</button>
          </div>
        )}

        {processed.length === 0
          ? <div className="empty-state"><div className="empty-state-icon">📄</div><div className="empty-state-title">No invoices yet</div>Create your first invoice above</div>
          : <table className="data-table">
              <thead><tr><th>Invoice #</th><th>Customer</th><th>Amount</th><th>Issue Date</th><th>Due Date</th><th>Days</th><th>Status</th><th></th></tr></thead>
              <tbody>
                {processed.map(inv => {
                  const days = inv.due_date ? daysDiff(inv.due_date) : null
                  return (
                    <tr key={inv.id}>
                      <td className="blue">{inv.invoice_no}</td>
                      <td className="text2">{inv.customer}</td>
                      <td className="blue">{fmt(inv.amount)}</td>
                      <td className="text3">{inv.issue_date}</td>
                      <td className="text3">{inv.due_date}</td>
                      <td className={inv.status === 'overdue' ? 'red' : inv.status === 'paid' ? 'text3' : 'amber'}>
                        {days === null ? '—' : inv.status === 'paid' ? '—' : days >= 0 ? `+${days}d` : `${days}d`}
                      </td>
                      <td><span className={`pill pill-${inv.status}`}>{inv.status}</span></td>
                      <td>
                        <div style={{ display: 'flex', gap: 6 }}>
                          {inv.status !== 'paid' && <button className="btn btn-success" style={{ padding: '4px 8px', fontSize: 10 }} onClick={() => handleMarkPaid(inv.id)}>✓ Paid</button>}
                          <button className="btn btn-danger" style={{ padding: '4px 8px', fontSize: 10 }} onClick={() => handleDelete(inv.id)}>✕</button>
                        </div>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
        }
      </div>
    </div>
  )
}

// ─── CASH FLOW VIEW ───────────────────────────────────────────────────────────
function CashFlowView({ loads, expenses, setExpenses, userId }) {
  const [saving, setSaving] = useState(false)

  const totalExp = Object.values(expenses).reduce((s, v) => s + (parseFloat(v) || 0), 0)
  const weeklyExp = totalExp / 4
  let cum = 0
  const weekData = Array.from({ length: 8 }, (_, i) => {
    const inc = loads.reduce((s, l) => {
      const pd = parseFloat(l.payment_days) || 30
      const c = calcLoad(l)
      return (pd >= i * 7 && pd < (i + 1) * 7) ? s + c.revenue : s
    }, 0)
    cum += inc - weeklyExp
    return { week: i + 1, incoming: inc, outgoing: weeklyExp, balance: cum }
  })
  const totalPending = loads.reduce((s, l) => s + (parseFloat(l.customer_rate) || 0), 0)
  const next30 = weekData.slice(0, 4).reduce((s, w) => s + w.incoming, 0)
  const shortage = Math.min(0, next30 - totalExp)

  const handleSave = async () => {
    setSaving(true)
    const payload = { user_id: userId, ...expenses }
    const { data } = await supabase.from('expenses').select('id').eq('user_id', userId).single()
    if (data) await supabase.from('expenses').update(payload).eq('user_id', userId)
    else await supabase.from('expenses').insert([payload])
    setSaving(false)
  }

  return (
    <div className="tab-panel">
      <div className="chart-row">
        <div className="panel">
          <div className="panel-head">
            <div className="panel-title">Monthly Expenses</div>
            <span style={{ color: 'var(--amber)', fontWeight: 700, fontSize: 14 }}>{fmt(totalExp)}/mo</span>
          </div>
          <div className="panel-body">
            {[['payroll', 'Payroll'], ['insurance', 'Insurance'], ['fuel', 'Fuel'], ['other', 'Other Expenses']].map(([k, l]) => (
              <div key={k} className="form-group" style={{ marginBottom: 14 }}>
                <label className="form-label">{l}</label>
                <input className="form-input" type="number" value={expenses[k] || ''} placeholder="0" onChange={e => setExpenses(p => ({ ...p, [k]: e.target.value }))} />
              </div>
            ))}
            <button className="btn btn-primary" onClick={handleSave} disabled={saving}>{saving ? 'Saving…' : '💾 Save Expenses'}</button>
          </div>
        </div>

        <div className="panel">
          <div className="panel-head"><div className="panel-title">Cash Position Forecast</div></div>
          <div className="panel-body">
            <div className="two-col" style={{ marginBottom: 16 }}>
              <div className="result-item"><div className="result-key">Total Pending A/R</div><div className="result-val blue">{fmt(totalPending)}</div></div>
              <div className="result-item"><div className="result-key">Next 30d Incoming</div><div className={`result-val ${shortage < 0 ? 'red' : 'green'}`}>{fmt(next30)}</div></div>
            </div>
            {shortage < 0 && <div className="infobox danger" style={{ marginBottom: 14 }}>⚠️ CASH SHORTAGE — Projected shortfall of {fmt(Math.abs(shortage))} in next 30 days.</div>}
            {shortage >= 0 && <div className="infobox ok" style={{ marginBottom: 14 }}>✅ Cash flow stable for next 30 days.</div>}
            <div style={{ fontSize: 10, fontWeight: 600, color: 'var(--text3)', letterSpacing: '0.8px', textTransform: 'uppercase', marginBottom: 10 }}>8-Week Running Balance</div>
            {weekData.map(w => (
              <div key={w.week} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: 'var(--bg3)', border: '1px solid var(--border2)', borderRadius: 8, padding: '10px 14px', marginBottom: 6 }}>
                <div style={{ fontSize: 11, color: 'var(--text3)' }}>Week {w.week} {w.incoming > 0 && `(+${fmt(w.incoming)})`}</div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <div style={{ width: Math.max(4, (Math.abs(w.balance) / Math.max(...weekData.map(x => Math.abs(x.balance)), 1)) * 80), height: 4, borderRadius: 2, background: w.balance >= 0 ? 'var(--green)' : 'var(--red)' }} />
                  <div style={{ fontWeight: 700, fontSize: 13, color: w.balance >= 0 ? 'var(--green)' : 'var(--red)' }}>
                    {w.balance < 0 ? '-' : ''}{fmt(Math.abs(w.balance))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

// ─── REPORTS VIEW ─────────────────────────────────────────────────────────────
function ReportsView({ loads, invoices, expenses }) {
  const allCalc = loads.map(calcLoad)
  const totalRev = allCalc.reduce((s, c) => s + c.revenue, 0)
  const totalProfit = allCalc.reduce((s, c) => s + c.profit, 0)
  const avgMargin = allCalc.length ? allCalc.reduce((s, c) => s + c.margin, 0) / allCalc.length : 0
  const totalExp = Object.values(expenses).reduce((s, v) => s + (parseFloat(v) || 0), 0)

  return (
    <div className="tab-panel">
      <div className="four-col">
        {[
          { label: 'Total Revenue', val: fmt(totalRev), color: 'var(--blue)' },
          { label: 'Total Profit', val: fmt(totalProfit), color: 'var(--green)' },
          { label: 'Avg Margin', val: fmtPct(avgMargin), color: 'var(--purple)' },
          { label: 'Monthly Expenses', val: fmt(totalExp), color: 'var(--amber)' },
        ].map((c, i) => (
          <div key={i} className="panel" style={{ padding: 18 }}>
            <div style={{ fontSize: 10, fontWeight: 600, color: 'var(--text3)', textTransform: 'uppercase', letterSpacing: '0.8px', marginBottom: 6 }}>{c.label}</div>
            <div style={{ fontSize: 26, fontWeight: 800, color: c.color, letterSpacing: '-0.5px' }}>{c.val}</div>
          </div>
        ))}
      </div>
      <div className="panel">
        <div className="panel-head"><div className="panel-title">Load Performance Report</div></div>
        {loads.length === 0
          ? <div className="empty-state"><div className="empty-state-icon">📊</div><div className="empty-state-title">No loads to report</div>Add loads first</div>
          : <table className="data-table">
              <thead><tr><th>Load ID</th><th>Customer</th><th>Route</th><th>Revenue</th><th>Cost</th><th>Profit</th><th>Margin</th><th>Risk</th></tr></thead>
              <tbody>
                {loads.map(l => {
                  const c = calcLoad(l)
                  const rl = riskLabel(c.risk)
                  return (
                    <tr key={l.id}>
                      <td className="blue">{l.load_id}</td>
                      <td className="text2">{l.customer}</td>
                      <td className="text3">{l.origin} → {l.dest}</td>
                      <td className="blue">{fmt(c.revenue)}</td>
                      <td className="text2">{fmt(c.totalCost)}</td>
                      <td className={c.profit >= 0 ? 'green' : 'red'}>{fmt(c.profit)}</td>
                      <td className={c.margin >= 15 ? 'green' : c.margin >= 8 ? '' : 'red'}>{fmtPct(c.margin)}</td>
                      <td><span className={`pill ${rl.cls}`}>{rl.label}</span></td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
        }
      </div>
    </div>
  )
}

// ─── AI VIEW ─────────────────────────────────────────────────────────────────
function AIView({ loads, invoices, expenses }) {
  const [query, setQuery] = useState('')
  const [response, setResponse] = useState('')
  const [loading, setLoading] = useState(false)

  const totalExp = Object.values(expenses).reduce((s, v) => s + (parseFloat(v) || 0), 0)
  const GEMINI_KEY = import.meta.env.VITE_GEMINI_API_KEY

  const analyze = useCallback(async (q) => {
    if (!GEMINI_KEY || GEMINI_KEY === 'YOUR_GEMINI_API_KEY') {
      setResponse('⚠️ No Gemini API key found. Add VITE_GEMINI_API_KEY to your .env file.')
      return
    }
    setLoading(true); setResponse('')
    const loadsData = loads.map(l => {
      const c = calcLoad(l)
      return `Load ${l.load_id}: ${l.origin}→${l.dest}, Rev=$${l.customer_rate}, Cost=$${c.totalCost}, Profit=$${c.profit.toFixed(0)}, Margin=${c.margin.toFixed(1)}%, Risk=${c.risk}/100`
    }).join('\n')
    const invoicesData = invoices.map(i => {
      const d = i.due_date ? daysDiff(i.due_date) : 0
      return `${i.invoice_no}: ${i.customer} $${i.amount} (${d >= 0 ? d + 'd left' : Math.abs(d) + 'd overdue'}) — ${i.status}`
    }).join('\n')
    const prompt = `You are RateShield AI, an expert freight broker financial advisor. Be concise, direct, actionable. Use ⚠️ for warnings, ✅ for good, 💡 for tips. Under 250 words. Clear sections.\n\nLoads:\n${loadsData || 'None'}\n\nInvoices:\n${invoicesData || 'None'}\n\nMonthly expenses: $${totalExp}\nQuestion: ${q || 'Full financial health check and top 3 actions.'}`
    try {
      const res = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${GEMINI_KEY}`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            contents: [{ parts: [{ text: prompt }] }],
            generationConfig: { maxOutputTokens: 1000, temperature: 0.7 },
          }),
        }
      )
      const data = await res.json()
      if (data.error) { setResponse(`⚠️ Gemini Error: ${data.error.message}`); setLoading(false); return }
      const text = data.candidates?.[0]?.content?.parts?.[0]?.text
      setResponse(text || 'Analysis unavailable.')
    } catch {
      setResponse('Error connecting to Gemini. Check your API key and network.')
    }
    setLoading(false)
  }, [loads, invoices, totalExp, GEMINI_KEY])

  const quickPrompts = ['Full financial health check', 'Which loads to reject?', 'How to improve cash flow?', 'Overdue invoice strategy']

  return (
    <div className="tab-panel ai-wrap">
      <div className="panel" style={{ marginBottom: 16 }}>
        <div className="panel-head">
          <div>
            <div className="panel-title">RateShield AI Advisor</div>
            <div className="panel-subtitle">Powered by Gemini · Analyze your freight portfolio</div>
          </div>
          <div style={{ fontSize: 10, fontWeight: 700, color: '#22c55e', letterSpacing: '1px', background: 'rgba(34,197,94,0.1)', border: '1px solid rgba(34,197,94,0.25)', borderRadius: 6, padding: '4px 10px' }}>POWERED BY GEMINI</div>
        </div>
        <div className="panel-body">
          <div className="quick-prompts">
            {quickPrompts.map(p => <button key={p} className="qp-btn" onClick={() => analyze(p)}>{p}</button>)}
          </div>
          <div className="ai-input-row">
            <input className="form-input" placeholder="Ask anything about your loads, cash flow, or invoices..."
              value={query} onChange={e => setQuery(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && analyze(query)}
              style={{ flex: 1 }} />
            <button className="btn btn-primary" onClick={() => analyze(query)} disabled={loading} style={{ flexShrink: 0 }}>
              {loading ? 'Analyzing…' : 'Analyze →'}
            </button>
          </div>
          <div className="ai-response">
            {loading
              ? <span className="ai-typing">▊<span className="ai-blink"> Analyzing your portfolio…</span></span>
              : response || 'Click a quick prompt above or ask your own question.'}
          </div>
        </div>
      </div>
      <div className="panel">
        <div className="panel-head"><div className="panel-title">Portfolio Snapshot</div></div>
        <div className="panel-body">
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 12 }}>
            {[
              { icon: '📦', label: 'Loads Tracked', val: loads.length, color: 'var(--blue)' },
              { icon: '📄', label: 'Total Invoices', val: invoices.length, color: 'var(--amber)' },
              { icon: '⚠️', label: 'Overdue', val: invoices.filter(i => i.status === 'overdue').length, color: 'var(--red)' },
              { icon: '💸', label: 'Monthly Expenses', val: fmt(totalExp), color: 'var(--purple)' },
            ].map((item, i) => (
              <div key={i} className="result-item">
                <div className="result-key">{item.icon} {item.label}</div>
                <div style={{ fontSize: 20, fontWeight: 700, color: item.color, marginTop: 4 }}>{item.val}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

// ─── SETTINGS VIEW ────────────────────────────────────────────────────────────
function SettingsView({ session, profile }) {
  const meta = session?.user?.user_metadata || {}
  return (
    <div className="tab-panel">
      <div className="panel" style={{ maxWidth: 560 }}>
        <div className="panel-head"><div className="panel-title">Account Settings</div></div>
        <div className="panel-body">
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            {[
              ['Name', `${meta.first_name || ''} ${meta.last_name || ''}`.trim() || 'Not set'],
              ['Email', session?.user?.email || '—'],
              ['Company', meta.company || 'Not set'],
              ['Account Created', session?.user?.created_at ? new Date(session.user.created_at).toLocaleDateString() : '—'],
            ].map(([label, val]) => (
              <div key={label} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px 0', borderBottom: '1px solid var(--border2)' }}>
                <div style={{ fontSize: 11, fontWeight: 700, color: 'var(--text3)', textTransform: 'uppercase', letterSpacing: '0.8px' }}>{label}</div>
                <div style={{ fontSize: 13, color: 'var(--text)', fontWeight: 500 }}>{val}</div>
              </div>
            ))}
          </div>
          <div style={{ marginTop: 24, padding: 16, background: 'var(--bg3)', borderRadius: 8, border: '1px solid var(--border)', fontSize: 12, color: 'var(--text3)' }}>
            <div style={{ fontWeight: 700, color: 'var(--text2)', marginBottom: 8 }}>🔧 Environment Variables Needed</div>
            <div style={{ fontFamily: 'monospace', fontSize: 11, lineHeight: 1.8 }}>
              VITE_SUPABASE_URL=your_project_url<br/>
              VITE_SUPABASE_ANON_KEY=your_anon_key<br/>
              VITE_GEMINI_API_KEY=your_gemini_api_key
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

// ─── MAIN DASHBOARD ───────────────────────────────────────────────────────────
export default function Dashboard({ session }) {
  const [tab, setTab] = useState('dashboard')
  const [loads, setLoads] = useState([])
  const [invoices, setInvoices] = useState([])
  const [expenses, setExpenses] = useState({ payroll: 0, insurance: 0, fuel: 0, other: 0 })
  const [dbLoading, setDbLoading] = useState(true)
  const [showLogout, setShowLogout] = useState(false)

  const userId = session?.user?.id
  const meta = session?.user?.user_metadata || {}
  const firstName = meta.first_name || session?.user?.email?.split('@')[0] || 'User'
  const lastName = meta.last_name || ''
  const company = meta.company || ''
  const initials = `${firstName[0] || ''}${lastName[0] || ''}`.toUpperCase() || 'U'

  // Fetch all data on mount
  useEffect(() => {
    if (!userId) return
    Promise.all([
      supabase.from('loads').select('*').eq('user_id', userId).order('created_at', { ascending: false }),
      supabase.from('invoices').select('*').eq('user_id', userId).order('created_at', { ascending: false }),
      supabase.from('expenses').select('*').eq('user_id', userId).single(),
    ]).then(([loadsRes, invoicesRes, expRes]) => {
      if (loadsRes.data) setLoads(loadsRes.data)
      if (invoicesRes.data) setInvoices(invoicesRes.data)
      if (expRes.data) setExpenses({ payroll: expRes.data.payroll || 0, insurance: expRes.data.insurance || 0, fuel: expRes.data.fuel || 0, other: expRes.data.other || 0 })
      setDbLoading(false)
    })
  }, [userId])

  const overdueCount = invoices.filter(i => i.status === 'overdue' || (i.status !== 'paid' && i.due_date && daysDiff(i.due_date) < 0)).length
  const highRiskCount = loads.filter(l => calcLoad(l).risk >= 70).length
  const alertCount = overdueCount + highRiskCount

  const mainNav = NAV.filter(n => n.section === 'main')
  const toolNav = NAV.filter(n => n.section === 'tools')

  const greetingHour = new Date().getHours()
  const greeting = greetingHour < 12 ? 'Good morning' : greetingHour < 17 ? 'Good afternoon' : 'Good evening'

  const handleLogout = async () => {
    await supabase.auth.signOut()
  }

  return (
    <div className="layout">
      <style>{CSS}</style>

      {/* SIDEBAR */}
      <aside className="sidebar">
        <div className="sidebar-logo">
          <div className="logo-shield">
            <svg viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2">
              <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
            </svg>
          </div>
          <div className="logo-texts">
            <div className="logo-name">RateShield <span>AI</span></div>
            <div className="logo-tag">Freight Profit Protection</div>
          </div>
        </div>

        <div className="sidebar-section">
          <div className="sidebar-section-label">Main</div>
          {mainNav.map(n => (
            <div key={n.id} className={`nav-item ${tab === n.id ? 'active' : ''}`} onClick={() => setTab(n.id)}>
              <span className="nav-icon">{ICONS[n.id]}</span>
              <span>{n.label}</span>
              {n.id === 'alerts' && alertCount > 0 && <span className="nav-badge">{alertCount}</span>}
            </div>
          ))}
        </div>

        <div className="sidebar-section">
          <div className="sidebar-section-label">Tools</div>
          {toolNav.map(n => (
            <div key={n.id} className={`nav-item ${tab === n.id ? 'active' : ''}`} onClick={() => setTab(n.id)}>
              <span className="nav-icon">{ICONS[n.id]}</span>
              <span>{n.label}</span>
            </div>
          ))}
        </div>

        <div className="sidebar-bottom">
          <div className="plan-box">
            <div className="plan-label">Current Plan</div>
            <div className="plan-name">Pro Plan <span className="plan-active">Active</span></div>
            <div className="plan-billing">Unlimited loads</div>
          </div>
          <div className="user-row" onClick={() => setShowLogout(v => !v)} style={{ position: 'relative' }}>
            <div className="user-avatar">{initials}</div>
            <div>
              <div className="user-name">{firstName} {lastName}</div>
              <div className="user-email">{session?.user?.email}</div>
              {company && <div className="user-company">{company}</div>}
            </div>
            {showLogout && (
              <div className="logout-popup">
                <button className="logout-btn" onClick={handleLogout}>🚪 Sign Out</button>
              </div>
            )}
          </div>
        </div>
      </aside>

      {/* MAIN */}
      <div className="main-wrap">
        <div className="topbar">
          <div className="topbar-greeting">
            <h1>{greeting}, {firstName}! 👋</h1>
            <p>Here's what's happening with your brokerage today.</p>
          </div>
          <div className="topbar-search">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="var(--text3)" strokeWidth="2"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
            <input placeholder="Search loads, invoices, customers…" />
          </div>
          <div className="topbar-actions">
            <div className="topbar-date">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>
              {new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
            </div>
            <div className="icon-btn" style={{ position: 'relative' }}>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 0 1-3.46 0"/></svg>
              {alertCount > 0 && <div className="notif-badge">{alertCount}</div>}
            </div>
          </div>
        </div>

        <div className="scroll-area">
          {dbLoading
            ? <div className="db-loading">⏳ Loading your data…</div>
            : <>
                {tab === 'dashboard' && <DashboardView loads={loads} invoices={invoices} expenses={expenses} />}
                {tab === 'loads' && <LoadsView loads={loads} setLoads={setLoads} userId={userId} />}
                {tab === 'invoices' && <InvoicesView invoices={invoices} setInvoices={setInvoices} userId={userId} />}
                {tab === 'cashflow' && <CashFlowView loads={loads} expenses={expenses} setExpenses={setExpenses} userId={userId} />}
                {tab === 'reports' && <ReportsView loads={loads} invoices={invoices} expenses={expenses} />}
                {tab === 'ai' && <AIView loads={loads} invoices={invoices} expenses={expenses} />}
                {tab === 'settings' && <SettingsView session={session} />}
              </>
          }
        </div>
      </div>
    </div>
  )
}
