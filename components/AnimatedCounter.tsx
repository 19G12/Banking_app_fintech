import CountUp from "react-countup";

const AnimatedCounter = ({amount} : {amount: number}) => {

  return (
    <div className="w-full">
        <CountUp 
            end={amount}
            start={0.00}
            decimal={"."}
            prefix={"₹"}
            decimals={2}
        />
    </div>
  )
}

export default AnimatedCounter