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

export type InvestmentInfo = {
  platform: string;
  total: string;
  breakdown: { asset: string; value: string }[];
  index: number;
};
