#!/usr/bin/env node

/**
 * Promote a Supabase user to admin by setting profiles.role
 * - Finds the auth user by email using Admin API
 * - Ensures a profiles row exists for the user
 * - Sets role to 'supreme_admin' or 'campus_admin'
 *
 * Usage (PowerShell):
 *   $env:VITE_SUPABASE_URL="https://<ref>.supabase.co"; \
 *   $env:SUPABASE_SERVICE_ROLE_KEY="<service-role-key>"; \
 *   node scripts/promote-admin.js --email "admin@example.com" --role "supreme_admin"
 */

import { createClient } from '@supabase/supabase-js'

function parseArgs() {
  const args = process.argv.slice(2)
  const out = {}
  for (let i = 0; i < args.length; i++) {
    const a = args[i]
    if (a.startsWith('--')) {
      const key = a.replace(/^--/, '')
      const val = args[i + 1] && !args[i + 1].startsWith('--') ? args[++i] : true
      out[key] = val
    }
  }
  return out
}

function decodeJwtPayload(token) {
  try {
    const [, payload] = token.split('.')
    const json = Buffer.from(payload, 'base64').toString('utf8')
    return JSON.parse(json)
  } catch (_) {
    return null
  }
}

function deriveSupabaseUrlFromServiceKey(serviceKey) {
  const payload = decodeJwtPayload(serviceKey)
  const ref = payload?.ref
  if (!ref) return null
  return `https://${ref}.supabase.co`
}

async function findUserByEmail(adminClient, email) {
  let page = 1
  const perPage = 1000
  const target = email.trim().toLowerCase()
  // Paginate until not full page
  while (true) {
    const { data, error } = await adminClient.listUsers({ page, perPage })
    if (error) throw error
    const users = data?.users ?? []
    const found = users.find(u => (u.email || '').toLowerCase() === target)
    if (found) return found
    if (users.length < perPage) break
    page += 1
  }
  return null
}

function assertValidRole(role) {
  const allowed = ['supreme_admin', 'campus_admin']
  if (!allowed.includes(role)) {
    throw new Error(`Invalid role: ${role}. Allowed: ${allowed.join(', ')}`)
  }
}

async function main() {
  const args = parseArgs()
  const email = args.email || args.e
  const role = (args.role || 'supreme_admin').toString()

  if (!email) {
    console.error('❌ Missing --email "user@example.com"')
    process.exit(1)
  }
  assertValidRole(role)

  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY
  if (!serviceKey) {
    console.error('❌ SUPABASE_SERVICE_ROLE_KEY is required in env')
    process.exit(1)
  }

  // Determine URL
  let url = process.env.VITE_SUPABASE_URL
  if (!url) {
    url = deriveSupabaseUrlFromServiceKey(serviceKey)
  }
  if (!url) {
    console.error('❌ VITE_SUPABASE_URL not set and could not derive from token')
    process.exit(1)
  }

  console.log(`🔗 Project: ${url}`)
  console.log(`👤 Target email: ${email}`)
  console.log(`🔒 Desired role: ${role}`)

  const supabase = createClient(url, serviceKey, {
    auth: { autoRefreshToken: false, persistSession: false }
  })

  // 1) Find auth user by email
  console.log('🔍 Looking up auth user...')
  const user = await findUserByEmail(supabase.auth.admin, email)
  if (!user) {
    console.error('❌ No auth user found with that email. Please sign up/login once first.')
    process.exit(2)
  }
  console.log(`✅ Found user id: ${user.id}`)

  // 2) Ensure profiles row exists and promote role
  console.log('🛠️  Ensuring profiles row and promoting role...')
  // Try upsert by id; include email + role
  const upsertPayload = {
    id: user.id,
    email: user.email,
    role,
  }
  const { error: upsertError } = await supabase
    .from('profiles')
    .upsert(upsertPayload, { onConflict: 'id' })

  if (upsertError) {
    console.error('❌ Failed to upsert profile:', upsertError.message)
    process.exit(3)
  }

  // 3) Read back to verify
  const { data: profile, error: readErr } = await supabase
    .from('profiles')
    .select('id,email,role')
    .eq('id', user.id)
    .single()

  if (readErr) {
    console.error('⚠️  Role set, but failed to read back profile (RLS may block):', readErr.message)
  } else {
    console.log(`✅ Profile updated: ${profile.email} → role=${profile.role}`)
  }

  console.log('🎉 Done. Try logging in to the Admin Portal again.')
}

main().catch(err => {
  console.error('❌ Unexpected error:', err?.message || err)
  process.exit(1)
})

