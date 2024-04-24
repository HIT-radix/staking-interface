import Skeleton from "react-loading-skeleton";

const InfoTile = ({
  title,
  value,
  isLoading,
}: {
  title: string;
  value: string | number;
  isLoading: boolean;
}) => {
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
        <p className="text-4xl mt-2">{value}</p>
      )}
    </div>
  );
};

export default InfoTile;
