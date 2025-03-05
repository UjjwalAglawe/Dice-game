import { useState } from "react";
import axios from "axios";
import * as Slider from "@radix-ui/react-slider";

function App() {
  const [betAmount, setBetAmount] = useState(10);
  const [chosenNumber, setChosenNumber] = useState(50);
  const [balance, setBalance] = useState(1000);
  const [rolling, setRolling] = useState(false);
  const [result, setResult] = useState(null);

  const handleRollDice = async () => {
    if (betAmount <= 0 || betAmount > balance) {
      alert("Invalid bet amount!");
      return;
    }

    setRolling(true);
    try {
      const res = await axios.post("http://localhost:5000/roll-dice", {
        betAmount,
        chosenNumber,
        balance
      });

      setResult(res.data);
      setBalance(res.data.newBalance);
    } catch (error) {
      console.error("Error:", error);
      alert("Failed to roll dice!");
    }
    setRolling(false);
  };

  
  const payoutMultiplier = (1 + (chosenNumber / 100) * 1.5).toFixed(2);
  return (<>
    <div className="min-h-screen flex">



      <div className="bg-gray-800 text-white p-4 w-96 flex flex-col">

        <h2 className="text-xl font-bold mb-4">Bet Settings</h2>





        <div className="mb-4">

          <label className="block mb-2 text-sm">Bet Amount</label>

          <input

            type="number"

            value={betAmount}

            onChange={(e) => setBetAmount(Number(e.target.value))}

            className="w-full p-2 rounded bg-gray-700 border border-gray-600 text-white text-sm"

          />

        </div>



        <div className="mb-4">

          <label className="block mb-2 text-sm">Profit</label>

          <input

            type="number"

            value={payoutMultiplier}

            onChange={(e) => setBetAmount(Number(e.target.value))}

            className="w-full p-2 rounded bg-gray-700 border border-gray-600 text-white text-sm"

          />

        </div>




        <button

          onClick={handleRollDice}

          disabled={rolling}

          className={`px-4 py-4 rounded text-white font-bold transition text-sm ${rolling

            ? "bg-gray-600 cursor-not-allowed"

            : "bg-green-400 hover:bg-green-700"

            }`}

        >

          {rolling ? "Rolling..." : "Bet"}

        </button>

      </div>




      <main className="flex-1 flex flex-col items-center justify-center bg-gray-900 text-white p-4">

        <h1 className="text-3xl font-bold mb-4">🎲 Stake-Style Dice Game</h1>





        <p className="mb-4 text-lg">

          💰 Balance: <span className="font-bold">${balance.toFixed(2)}</span>

        </p>





        <div className="w-full max-w-md mt-4">

          <label className="block mb-2">

            Set Your Number: <span className="font-bold">{chosenNumber}</span>

            <br />

            <br />

          </label>

          <Slider.Root

            className="relative flex items-center select-none touch-none w-full h-12 px-4 bg-slate-400 rounded-4xl p-2"

            value={[chosenNumber]}

            min={0}

            max={100}

            step={1}

            onValueChange={(val) => setChosenNumber(val[0])}

          >


            <div className="absolute -top-8 left-0 right-0 flex justify-between items-start mt-2 mb-6 text-xl text-white font-semibold">

              <div >0</div>

              <div >25</div>

              <div className=" ">50</div>

              <div className=" ">50</div>

              <div className=" ">75</div>

              <div className=" ">100</div>

            </div>



            <Slider.Track className="bg-gradient-to-r from-red-500 to-green-500 relative grow rounded-full h-4 shadow-inner">

              <Slider.Range className="absolute h-full rounded-full" />

            </Slider.Track>

            <Slider.Thumb className="flex items-center justify-center w-8 h-8 bg-blue-500 rounded-md shadow-md cursor-pointer relative">

              <div className="absolute left-2 w-[2px] h-3 bg-white"></div>

              <div className="absolute right-2 w-[2px] h-3 bg-white"></div>

            </Slider.Thumb>

          </Slider.Root>





          <p className="mt-2 text-sm text-gray-400">

            Potential Payout: <span className="text-green-400 font-bold">

              {payoutMultiplier}x

            </span>

          </p>

        </div>




        {result && (

          <div className="mt-6 text-center">

            <p className="text-lg font-bold">Rolled: {result.roll}</p>

            <p className={result.win ? "text-green-400" : "text-red-400"}>

              {result.win ? "You Win!" : "You Lose!"}

            </p>

            <p className="mt-2 text-gray-400">🔗 Hash: {result.hash}</p>

          </div>

        )}

      </main>

    </div>
  </>);
}

