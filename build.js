const fs = require('fs');
const path = require('path');

// Fallbacks if Vercel env vars aren't set
const SUPABASE_URL = process.env.SUPABASE_URL || 'https://mtakioqtwxdbonbnyshp.supabase.co';
const SUPABASE_ANON_KEY = process.env.SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im10YWtpb3F0d3hkYm9uYnluc2hwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzE4NTkxMjEsImV4cCI6MjA4NzQzNTEyMX0.T7I-boaiZjCWCSg6Sic-DPhYyqPc_2noMKVWm3OvD08';

const htmlPath = path.join(__dirname, 'public', 'index.html');
let html = fs.readFileSync(htmlPath, 'utf8');

html = html.replace('__SUPABASE_URL__', SUPABASE_URL);
html = html.replace('__SUPABASE_ANON_KEY__', SUPABASE_ANON_KEY);

fs.writeFileSync(htmlPath, html);
console.log('Injected Supabase config into index.html');
