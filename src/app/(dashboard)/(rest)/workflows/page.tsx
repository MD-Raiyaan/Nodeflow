import { WorkflowsContainer, WorkflowsError, WorkflowsList, WorkflowsLoading } from '@/features/workflows/components/workflows';
import { requireAuth } from '@/lib/auth-utils'
import { HydrateClient } from '@/trpc/server';
import {ErrorBoundary} from "react-error-boundary";
import React, { Suspense } from 'react'
import { prefetchWorkflows } from '@/features/workflows/server/prefetch';
import { SearchParams } from 'nuqs';
import { workflowsParamsLoader } from '@/features/workflows/server/params-loader';

type Props={
  searchParams:Promise<SearchParams>;
}

async function page({searchParams}:Props) {
  await requireAuth();
  const params=await workflowsParamsLoader(searchParams);
  prefetchWorkflows(params);
  
  return (
    <WorkflowsContainer>
      <HydrateClient>
        <ErrorBoundary fallback={<WorkflowsError/>}>
           <Suspense fallback={<WorkflowsLoading/>}>
              <WorkflowsList/>
           </Suspense>
        </ErrorBoundary>
      </HydrateClient>
    </WorkflowsContainer>
  );
}

export default page
