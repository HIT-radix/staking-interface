import redirectIcon from "Assets/Images/share.png";

const Controls = () => {
  return (
    <div className="w-full mt-3">
      <div
        className="btn bg-accent w-full hover:bg-accent"
        onClick={() =>
          window.open(
            "https://dashboard.radixdlt.com/network-staking/validator_rdx1swez5cqmw4d6tls0mcldehnfhpxge0mq7cmnypnjz909apqqjgx6n9/stake",
            "_blank"
          )
        }
      >
        Stake to 💚ADDIX+FOMO🐸 Node{" "}
        <span>
          <img src={redirectIcon} alt="redirectIcon" className="w-4" />
        </span>
      </div>
    </div>
  );
};

export default Controls;
