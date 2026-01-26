export type ProtocolMetadata = {
  name: string;
  platform_name: string;
  logo_image: string;
  account: string;
  apyid: string | null;
  description: string | null;
};

export type CreateProtocolMetadataPayload = {
  secret?: string;
  name: string;
  platform_name: string;
  logo_image: string;
  account: string;
  apyid?: string | null;
  description?: string | null;
};

export type UpdateProtocolMetadataPayload = {
  secret?: string;
  platform_name?: string;
  logo_image?: string;
  account?: string;
  apyid?: string | null;
  description?: string | null;
};

export type ProtocolMetadataListResponse = {
  success: boolean;
  count: number;
  data: ProtocolMetadata[];
};

export type ProtocolMetadataResponse = {
  success: boolean;
  data: ProtocolMetadata;
};

export type DeleteProtocolMetadataResponse = {
  success: boolean;
  message: string;
};
