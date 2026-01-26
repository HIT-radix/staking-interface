import axios from "axios";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { HEDGE_FUND_SERVER_URL } from "Constants/endpoints";
import { protocolMetadataKeys } from "./keys";
import {
  CreateProtocolMetadataPayload,
  DeleteProtocolMetadataResponse,
  ProtocolMetadata,
  ProtocolMetadataListResponse,
  ProtocolMetadataResponse,
  UpdateProtocolMetadataPayload,
} from "./types";

const BASE_URL = `${HEDGE_FUND_SERVER_URL}/admin/protocols-metadata`;

const resolveSecret = (secret?: string) =>
  secret ?? process.env.REACT_APP_HEDGE_FUND_ADMIN_SECRET ?? "";

const assertSecret = (secret: string) => {
  const normalized = secret.trim();
  if (!normalized) {
    throw new Error("Admin secret is required for protocol metadata requests.");
  }
  return normalized;
};

const fetchProtocolsMetadata = async (secret?: string): Promise<ProtocolMetadata[]> => {
  const resolvedSecret = assertSecret(resolveSecret(secret));
  const { data } = await axios.get<ProtocolMetadataListResponse>(BASE_URL, {
    params: { secret: resolvedSecret },
  });
  return data.data;
};

const fetchProtocolMetadata = async (name: string, secret?: string): Promise<ProtocolMetadata> => {
  const resolvedSecret = assertSecret(resolveSecret(secret));
  const { data } = await axios.get<ProtocolMetadataResponse>(
    `${BASE_URL}/${encodeURIComponent(name)}`,
    {
      params: { secret: resolvedSecret },
    }
  );
  return data.data;
};

const createProtocolMetadata = async (
  payload: CreateProtocolMetadataPayload
): Promise<ProtocolMetadata> => {
  const resolvedSecret = assertSecret(resolveSecret(payload.secret));
  const { data } = await axios.post<ProtocolMetadataResponse>(BASE_URL, {
    ...payload,
    secret: resolvedSecret,
  });
  return data.data;
};

const updateProtocolMetadata = async (input: {
  name: string;
  payload: UpdateProtocolMetadataPayload;
}): Promise<ProtocolMetadata> => {
  const resolvedSecret = assertSecret(resolveSecret(input.payload.secret));
  const { data } = await axios.patch<ProtocolMetadataResponse>(
    `${BASE_URL}/${encodeURIComponent(input.name)}`,
    {
      ...input.payload,
      secret: resolvedSecret,
    }
  );
  return data.data;
};

const deleteProtocolMetadata = async (input: {
  name: string;
  secret?: string;
}): Promise<string> => {
  const resolvedSecret = assertSecret(resolveSecret(input.secret));
  const { data } = await axios.delete<DeleteProtocolMetadataResponse>(
    `${BASE_URL}/${encodeURIComponent(input.name)}`,
    {
      params: { secret: resolvedSecret },
    }
  );
  return data.message;
};

export const useProtocolMetadataList = (options?: { secret?: string; enabled?: boolean }) => {
  const secret = resolveSecret(options?.secret);
  return useQuery({
    queryKey: protocolMetadataKeys.list(secret),
    queryFn: () => fetchProtocolsMetadata(secret),
    enabled: (options?.enabled ?? true) && Boolean(secret),
  });
};

export const useProtocolMetadata = (
  name: string,
  options?: { secret?: string; enabled?: boolean }
) => {
  const secret = resolveSecret(options?.secret);
  return useQuery({
    queryKey: protocolMetadataKeys.detail(name, secret),
    queryFn: () => fetchProtocolMetadata(name, secret),
    enabled: Boolean(name) && (options?.enabled ?? true) && Boolean(secret),
  });
};

export const useCreateProtocolMetadata = (defaultSecret?: string) => {
  const queryClient = useQueryClient();
  const fallbackSecret = resolveSecret(defaultSecret);

  return useMutation({
    mutationFn: (payload: CreateProtocolMetadataPayload) =>
      createProtocolMetadata({
        ...payload,
        secret: resolveSecret(payload.secret ?? fallbackSecret),
      }),
    onSuccess: (protocol, variables) => {
      const secret = resolveSecret(variables.secret ?? fallbackSecret);
      void queryClient.invalidateQueries({ queryKey: protocolMetadataKeys.list(secret) });
      void queryClient.invalidateQueries({
        queryKey: protocolMetadataKeys.detail(protocol.name, secret),
      });
    },
  });
};

export const useUpdateProtocolMetadata = (defaultSecret?: string) => {
  const queryClient = useQueryClient();
  const fallbackSecret = resolveSecret(defaultSecret);

  return useMutation({
    mutationFn: (input: { name: string; payload: UpdateProtocolMetadataPayload }) =>
      updateProtocolMetadata({
        name: input.name,
        payload: {
          ...input.payload,
          secret: resolveSecret(input.payload.secret ?? fallbackSecret),
        },
      }),
    onSuccess: (_, variables) => {
      const secret = resolveSecret(variables.payload.secret ?? fallbackSecret);
      void queryClient.invalidateQueries({ queryKey: protocolMetadataKeys.list(secret) });
      void queryClient.invalidateQueries({
        queryKey: protocolMetadataKeys.detail(variables.name, secret),
      });
    },
  });
};

export const useDeleteProtocolMetadata = (defaultSecret?: string) => {
  const queryClient = useQueryClient();
  const fallbackSecret = resolveSecret(defaultSecret);

  return useMutation({
    mutationFn: (input: { name: string; secret?: string }) =>
      deleteProtocolMetadata({
        name: input.name,
        secret: resolveSecret(input.secret ?? fallbackSecret),
      }),
    onSuccess: (_, variables) => {
      const secret = resolveSecret(variables.secret ?? fallbackSecret);
      void queryClient.invalidateQueries({ queryKey: protocolMetadataKeys.list(secret) });
      void queryClient.removeQueries({
        queryKey: protocolMetadataKeys.detail(variables.name, secret),
      });
    },
  });
};
