"use client";
import {
  EmptyView,
  EntityContainer,
  EntityHeader,
  EntityItem,
  EntityList,
  EntityPagination,
  ErrorView,
  LoadingView,
} from "@/components/entity-components";
import { formatDistanceToNow } from "date-fns";
import { useSuspenseExecutions } from "../hooks/use-executions";
import React from "react";
import { useRouter } from "next/navigation";
import { useExecutionsParams } from "../hooks/use-executions-params";
import type { ExecutionStatus, Execution } from "@/generated/prisma/client";
import { CheckCircle2Icon, ClockIcon, Loader2Icon, XCircleIcon } from "lucide-react";

export const ExecutionsList = () => {
  const executions = useSuspenseExecutions();
  return (
    <EntityList
      items={executions.data.items}
      getKey={(execution) => execution.id}
      renderItem={(execution) => <ExecutionsItem data={execution} />}
      emptyView={<ExecutionsEmpty />}
    />
  );
};


export const ExecutionsHeader = ({ disabled }: { disabled?: boolean }) => {
  return (
    <EntityHeader
      title="Credentials"
      description="Create and manage your credentials"
    />
  );
};

export const ExecutionsPagination = () => {
  const executions = useSuspenseExecutions();
  const [params, setParams] = useExecutionsParams();

  return (
    <EntityPagination
      page={params.page}
      totalPages={executions.data.totalPages}
      onPageChange={(page) => setParams({ ...params, page })}
      disabled={executions.isFetching}
    />
  );
};
export const ExecutionsContainer = ({ children }: { children: React.ReactNode }) => {
  return (
    <EntityContainer
      header={<ExecutionsHeader />}
      pagination={<ExecutionsPagination />}
    >
      {children}
    </EntityContainer>
  );
};

export const ExecutionsLoading = () => {
  return <LoadingView entity="executions" />;
};

export const ExecutionsError = () => {
  return <ErrorView message="Error Loading executions" />;
};

export const ExecutionsEmpty = () => {
  const router = useRouter();
  const handleCreate = () => {
    router.push(`/executions/new`);
  };
  return (
    <>
      <EmptyView
        onNew={handleCreate}
        message="You haven't executed any runs.Get started by running your first workflow"
      />
    </>
  );
};

interface ExecutionsItemProps {
  data: Execution & {
    workflow:{
      id:string;
      name:string;
    };
  };
}

const getStatusIcon=(status:ExecutionStatus)=>{
  switch(status){
    case "SUCCESS":
      return <CheckCircle2Icon className="size-5 text-green-600" />;
    case "FAILED":
      return <XCircleIcon className="size-5 text-red-600" />
    case "RUNNING":
      return <Loader2Icon className="size-5 text-blue-600 animate-spin" />
    default:
      return <ClockIcon className="size-5 text-muted-foreground" />;
  }
}

const formatStatus=(status:ExecutionStatus)=>{
  return status.charAt(0)+status.slice(1).toLowerCase();
}

export const ExecutionsItem = ({ data }: ExecutionsItemProps) => {
  const duration=data.completedAt?Math.round((new Date(data.completedAt).getTime()-new Date(data.startedAt).getTime())/1000):null;
  const subtitle=(<>
    {data.workflow.name} &bull; Started{" "}{formatDistanceToNow(data.startedAt,{addSuffix:true})}
    {duration!==null && <>&bull; Took {duration}s</>}
  </>);
  return (
    <EntityItem
      href={`/executions/${data.id}`}
      title={formatStatus(data.status)}
      subtitle={subtitle}
      image={
        <div className="size-8 flex items-center justify-center">
          {getStatusIcon(data.status)}
        </div>
      }
    />
  );
};
