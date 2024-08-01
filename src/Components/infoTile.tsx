import { ReactNode } from "react";
import Skeleton from "react-loading-skeleton";

type Props = {
  title: string;
  value: string | number | ReactNode;
  isLoading: boolean;
  tooltip?: string;
};

const InfoTile = ({ title, value, isLoading, tooltip }: Props) => {
  return (
    <div className="bg-accent rounded-lg px-3 py-2 w-full">
      <p className="font-semibold text-sm opacity-80">{title}</p>
      {isLoading ? (
        <Skeleton
          baseColor="#242d20"
          highlightColor="#A0D490"
          width="50%"
          style={{ opacity: 0.5 }}
          height={30}
        />
      ) : (
        <div className="text-3xl mt-2 cursor-pointer" title={tooltip}>
          {value}
        </div>
      )}
    </div>
  );
};

export default InfoTile;
