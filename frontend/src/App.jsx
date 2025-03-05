import { useState } from "react";
import axios from "axios";
import * as Slider from "@radix-ui/react-slider";
import Balance from "./components/Balance";

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
      const res = await axios.post(`https://dice-game-2ogt.onrender.com/roll-dice`, {
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

  // Calculate dynamic payout
  const payoutMultiplier = (1 + (chosenNumber / 100) * 1.5).toFixed(2);


  return (
    <div className="min-h-screen flex">

      <div className="bg-[#24292F] text-white p-6 w-[300px] flex flex-col">
        <div className="flex justify-between items-center mb-6">
          <button className="bg-[#3A3F44] px-4 py-2 rounded-lg text-sm">
            Manual
          </button>
          <button className="text-sm">Auto</button>
        </div>


        <div className="mb-4">
          <div className="flex justify-between items-center mb-2">
            <label className="text-sm">Bet Amount</label>
            <span className="text-sm text-gray-400">₹0.00</span>
          </div>
          <div className="relative">
            <input
              type="number"
              value={betAmount}
              onChange={(e) => setBetAmount(Number(e.target.value))}
              className="w-full p-2 rounded-lg bg-[#3A3F44] border border-[#3A3F44] text-white text-sm"
            />
            <div className="absolute right-2 top-1/2 transform -translate-y-1/2 flex items-center">
              <button className="text-sm mr-1">1/2</button>
              <button className="text-sm">2x</button>
            </div>
          </div>
        </div>


        <div className="mb-6">
          <div className="flex justify-between items-center mb-2">
            <label className="text-sm">Profit on Win</label>
            <span className="text-sm text-gray-400">₹0.00</span>
          </div>
          <input
            type="number"
            value={payoutMultiplier}
            onChange={(e) => setBetAmount(Number(e.target.value))}
            className="w-full p-2 rounded-lg bg-[#3A3F44] border border-[#3A3F44] text-white text-sm"
          />
        </div>


        <button
          onClick={handleRollDice}
          disabled={rolling}
          className={`w-full py-3 rounded-lg text-white font-bold transition-colors text-sm ${rolling
            ? "bg-gray-600 cursor-not-allowed"
            : "bg-[#64DD17] hover:bg-[#55C214]"
            }`}
        >
          {rolling ? "Rolling..." : "Bet"}
        </button>
      </div>


      <main className="flex-1 flex flex-col w-full items-center justify-center bg-[#1A1E22] text-white p-6">
        
        <div className="absolute flex top-4">

        <Balance/>
        </div>

        {/* part 2 */}
        <div className="w-full max-w-4xl">
          <Slider.Root
            className="relative flex items-center select-none touch-none w-full h-12 px-4 bg-[#3A3F44] rounded-full p-2"
            value={[chosenNumber]}
            min={0}
            max={100}
            step={1}
            onValueChange={(val) => setChosenNumber(val[0])}
          >

            <div className="absolute -top-6 left-0 right-0 flex justify-between items-start text-sm text-gray-400">
              <div>0</div>
              <div>25</div>
              <div>50</div>
              {/* <div className="relative">
            <div className="absolute -top-8 bg-white text-black px-2 py-1 rounded-md text-xs left-1/2 transform -translate-x-1/2">
              {chosenNumber}
            </div>
          </div> */}
              <div>75</div>
              <div>100</div>
            </div>

            <Slider.Track className="bg-gradient-to-r from-red-500 to-green-500 relative grow rounded-full h-4">
              <Slider.Range className="absolute h-full rounded-full" />
            </Slider.Track>
            <Slider.Thumb className="flex items-center justify-center w-8 h-8 bg-blue-500 rounded-md shadow-md cursor-pointer relative">
              <div className="absolute left-2 w-[2px] h-3 bg-white"></div>
              <div className="absolute right-2 w-[2px] h-3 bg-white"></div>
            </Slider.Thumb>
          </Slider.Root>
        </div>


        <div className="mt-6 text-center">
          {result ? (
            <>
              <p className={result.win ? "text-green-400" : "text-red-400"}>
                {result.win ? "🎉 You Win!" : "❌ You Lose!"}
              </p>
              <p className="mt-2 text-gray-400">
                Balance: ${result.newBalance.toFixed(2)}
              </p>
            </>
          ) : (
            <p className="mt-2 text-gray-400">
              Current Balance: ${balance.toFixed(2)}
            </p>
          )}
        </div>
        {/* part3 */}
        <div className="w-full max-w-4xl mt-8 bg-[#2A3445] p-4 rounded-lg flex justify-between text-sm">
          <div>
            <div className="text-gray-400 mb-1 text-xs">Multiplier</div>
            <input
              type="text"
              value={payoutMultiplier}
              className="bg-[#1E2738] text-white w-full px-3 py-2 rounded-md border border-[#3C4857]"
            />
          </div>
          <div>
            <div className="text-gray-400 mb-1 text-xs">Roll Over</div>
            <div className="flex items-center">
              <input
                type="text"
                value={chosenNumber}
                className="bg-[#1E2738] text-white w-full px-3 py-2 rounded-md border border-[#3C4857] mr-2"
              />
              <button className="text-gray-400 hover:text-white" onClick={() => {
                setChosenNumber(50);
              }}>
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
              </button>
            </div>
          </div>
          <div>
            <div className="text-gray-400 mb-1 text-xs">Win Chance</div>
            <div className="flex items-center">
              <input
                type="text"
                value={(100 - chosenNumber).toFixed(2)}
                className="bg-[#1E2738] text-white w-full px-3 py-2 rounded-md border border-[#3C4857] mr-2"
              />
              <span className="text-gray-400">%</span>
            </div>
          </div>
        </div>

      </main>
    </div>
  );
}

export default App;
