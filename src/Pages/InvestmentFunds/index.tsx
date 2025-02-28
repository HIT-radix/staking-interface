import Chart from "react-apexcharts";

const InvesmentFunds = () => {
  return (
    <div>
      <Chart options={{ labels: [] }} series={[44, 55, 41, 17, 15]} type="donut" width="380" />
    </div>
  );
};

export default InvesmentFunds;
