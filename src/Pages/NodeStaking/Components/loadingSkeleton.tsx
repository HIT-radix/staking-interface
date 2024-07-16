import Skeleton from "react-loading-skeleton";

const LoadingSkeleton = () => {
  return (
    <div>
      <Skeleton baseColor="#242d20" highlightColor="#A0D490" width="350px" height={400} />
      <Skeleton
        baseColor="#242d20"
        highlightColor="#A0D490"
        width="350px"
        height={80}
        style={{ marginTop: 10 }}
      />
      <Skeleton
        baseColor="#242d20"
        highlightColor="#A0D490"
        width="350px"
        height={80}
        style={{ marginTop: 10 }}
      />
    </div>
  );
};

export default LoadingSkeleton;
