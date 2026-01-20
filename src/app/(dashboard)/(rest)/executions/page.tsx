import { requireAuth } from '@/lib/auth-utils'
import React from 'react'

async function page() {
  await requireAuth();
  return (
    <div>
       Executions
    </div>
  )
}

export default page
