"use client";
import {
  EmptyView,
  EntityContainer,
  EntityHeader,
  EntityItem,
  EntityList,
  EntityPagination,
  EntitySearch,
  ErrorView,
  LoadingView,
} from "@/components/entity-components";
import { formatDistanceToNow } from "date-fns";
import {
  useRemoveCredential,
  useSuspenseCredentials,
} from "../hooks/use-credentials";
import React from "react";
import { useRouter } from "next/navigation";
import { useCredentialsParams } from "../hooks/use-credentials-params";
import { useEntitySearch } from "../hooks/use-entity-search";
import type { CredentialType, Credential } from "@/generated/prisma/client";
import Image from "next/image";

export const CredentialsList = () => {
  const credentialss = useSuspenseCredentials();
  return (
    <EntityList
      items={credentialss.data.items}
      getKey={(credentials) => credentials.id}
      renderItem={(credentials) => <CredentialsItem data={credentials} />}
      emptyView={<CredentialsEmpty />}
    />
  );
};

export const CredentialsSearch = () => {
  const [params, setParams] = useCredentialsParams();
  const { searchValue, onSearchChange } = useEntitySearch({
    params,
    setParams,
    debounceMs: 300,
  });
  return (
    <EntitySearch
      value={searchValue}
      onChange={onSearchChange}
      placeholder="Search credentials"
    />
  );
};

export const CredentialsHeader = ({ disabled }: { disabled?: boolean }) => {
  return (
    <EntityHeader
      title="Credentials"
      description="Create and manage your credentials"
      newButtonHref="/credentials/new"
      newButtonLabel="New credential"
      disabled={disabled}
    />
  );
};

export const CredentialsPagination = () => {
  const credentialss = useSuspenseCredentials();
  const [params, setParams] = useCredentialsParams();

  return (
    <EntityPagination
      page={params.page}
      totalPages={credentialss.data.totalPages}
      onPageChange={(page) => setParams({ ...params, page })}
      disabled={credentialss.isFetching}
    />
  );
};
export const CredentialsContainer = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  return (
    <EntityContainer
      header={<CredentialsHeader />}
      search={<CredentialsSearch />}
      pagination={<CredentialsPagination />}
    >
      {children}
    </EntityContainer>
  );
};

export const CredentialsLoading = () => {
  return <LoadingView entity="credentials" />;
};

export const CredentialsError = () => {
  return <ErrorView message="Error Loading credentials" />;
};

export const CredentialsEmpty = () => {
  const router = useRouter();
  const handleCreate = () => {
    router.push(`/credentials/new`);
  };
  return (
    <>
      <EmptyView
        onNew={handleCreate}
        message="No credentials found,Create a credential to get started."
      />
    </>
  );
};

interface CredentialsItemProps {
  data: Credential;
}

const credentialLogos: Record<CredentialType, string> = {
  OPENAI: "/openai.svg",
  ANTHROPIC: "/anthropic.svg",
  GEMINI: "/gemini.svg",
};

export const CredentialsItem = ({ data }: CredentialsItemProps) => {
  const removeCredential = useRemoveCredential();
  const handleRemove = () => {
    removeCredential.mutate({ id: data.id });
  };
  const logo = credentialLogos[data.type] || "/openai.svg";
  return (
    <EntityItem
      href={`/credentials/${data.id}`}
      title={data.name}
      subtitle={
        <>
          Updated {formatDistanceToNow(data.updatedAt, { addSuffix: true })}
          {"  "}
          &bull; Created{" "}
          {formatDistanceToNow(data.createdAt, { addSuffix: true })}{" "}
        </>
      }
      image={
        <div className="size-8 flex items-center justify-center">
          <Image src={logo} alt={data.type} width={20} height={20} />
        </div>
      }
      onRemove={handleRemove}
      isRemoving={removeCredential.isPending}
    />
  );
};
