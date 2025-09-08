const RadixRewardsBanner = () => {
  return (
    <div className="bg-[url('https://astrolescent.com/assets/img/radix-incentives/bg.png')] bg-right bg-no-repeat bg-cover relative min-h-10 flex justify-between items-center text-white py-2 px-4">
      <img
        src="https://astrolescent.com/assets/img/radix-incentives/logo.png"
        className="h-4"
        alt="Radix Incentives Program"
      />
      <p className="text-sm sm:block hidden font-medium absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 pt-0.5">
        Earn $XRD by participating in the Radix network
      </p>

      <a
        href="https://incentives.radixdlt.com"
        target="_blank"
        className="
         focus:ring-2 focus:ring-astro focus:ring-offset-2 cursor-pointer
         bg-white text-black border hover:bg-black hover:text-white
         tracking-astro font-optical-24-550 flex items-center justify-center rounded-full px-3 py-1 text-sm mt
        "
        rel="noreferrer"
      >
        Join now
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth="1.5"
          stroke="currentColor"
          className="size-3"
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="m8.25 4.5 7.5 7.5-7.5 7.5" />
        </svg>
      </a>
    </div>
  );
};

export default RadixRewardsBanner;
