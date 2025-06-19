export enum TwBreakPoints {
  xs = "xs",
  sm = "sm",
  md = "md",
  lg = "lg",
  xl = "xl",
}

export enum Environment {
  dev = "dev",
  prod = "prod",
}

export type InfoTooltipProps = {
  text: string;
  infoColor?: "green" | "white";
};

export interface InvestmentInfo {
  platform: string;
  total: string;
  breakdown: { asset: string; value: string; logo: string; platform: string; position: string }[];
  index: number;
}
