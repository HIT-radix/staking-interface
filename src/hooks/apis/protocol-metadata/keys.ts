export const protocolMetadataKeys = {
  all: ["protocol-metadata"] as const,
  list: (secret?: string) => ["protocol-metadata", "list", secret ?? ""] as const,
  detail: (name: string, secret?: string) =>
    ["protocol-metadata", "detail", name, secret ?? ""] as const,
};
