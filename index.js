#!/usr/bin/env node
// ECPRO CLI：終端機查台灣網站情報。用法：npx ecpro <網域> [--json] [--competitors]
const BASE = process.env.ECPRO_API_BASE || 'https://ecpro.pages.dev/api/v1';
const args = process.argv.slice(2);
const flags = new Set(args.filter((a) => a.startsWith('--')));
const domain = args.find((a) => !a.startsWith('--'));

const C = { b: '\x1b[1m', dim: '\x1b[2m', blue: '\x1b[34m', green: '\x1b[32m', cyan: '\x1b[36m', y: '\x1b[33m', r: '\x1b[0m' };

if (!domain || flags.has('--help')) {
  console.log(`${C.b}ECPRO 電商博士 CLI${C.r} — 查台灣網站情報\n\n用法：\n  npx ecpro <網域>              查平台 / 技術 / 廣告\n  npx ecpro <網域> --competitors  附同業競品\n  npx ecpro <網域> --json       輸出 JSON\n\n例：npx ecpro pinkoi.com\n資料來源 ecpro.tw`);
  process.exit(domain ? 0 : 1);
}

const api = async (path) => { const r = await fetch(`${BASE}${path}`, { headers: { accept: 'application/json' } }); return r.json(); };

try {
  const d = await api(`/detect?url=${encodeURIComponent(domain)}`);
  if (flags.has('--json')) {
    if (flags.has('--competitors')) d.competitors = (await api(`/competitors?domain=${encodeURIComponent(domain)}`)).competitors;
    console.log(JSON.stringify(d, null, 2)); process.exit(0);
  }
  if (!d.ok) { console.error(`${C.y}無法偵測 ${domain}：${d.error || '失敗'}${C.r}`); process.exit(1); }
  console.log(`\n${C.b}${C.blue}● ${d.host}${C.r}  ${C.dim}${d.title || ''}${C.r}`);
  console.log(`  ${C.dim}開店平台${C.r}  ${C.b}${d.platform}${C.r}`);
  console.log(`  ${C.dim}投放平台${C.r}  ${(d.ads && d.ads.length) ? C.green + d.ads.join('、') + C.r : C.dim + '未偵測' + C.r}`);
  console.log(`  ${C.dim}分析追蹤${C.r}  ${(d.analytics && d.analytics.length) ? d.analytics.join('、') : C.dim + '—' + C.r}`);
  console.log(`  ${C.dim}技術數量${C.r}  ${d.techCount} 項`);
  const cats = Object.keys(d.tech || {});
  if (cats.length) { console.log(`  ${C.dim}技術堆疊${C.r}`); cats.forEach((c) => console.log(`    ${C.cyan}${c}${C.r}: ${d.tech[c].join('、')}`)); }
  if (flags.has('--competitors')) {
    const co = await api(`/competitors?domain=${encodeURIComponent(domain)}`);
    if (co.ok && co.competitors?.length) { console.log(`  ${C.dim}同業競品（${co.category}）${C.r}`); co.competitors.slice(0, 8).forEach((x) => console.log(`    · ${x.domain} ${C.dim}${x.platform}${C.r}`)); }
  }
  console.log(`\n  ${C.dim}完整報告 https://ecpro.tw/competitor?host=${d.host}${C.r}\n`);
} catch (e) { console.error('連線錯誤：' + e.message); process.exit(1); }
