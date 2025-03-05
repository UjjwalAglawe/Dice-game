const express = require("express");
const cors = require("cors");
const crypto = require("crypto");

const app = express();
// app.use(cors());
app.use(express.json());

let userBalance = 1000; 
const corsOptions = {
    origin: '*', 
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: false, 
    preflightContinue: false,
    optionsSuccessStatus: 204
};

app.use(cors(corsOptions));

app.get('/', (req, res) => {
    res.send('Front Page!');
});

app.post("/roll-dice", (req, res) => {
    const { betAmount, chosenNumber,balance } = req.body;

  
    if (betAmount <= 0 || betAmount > balance) {
      return res.status(400).json({ error: "Invalid bet amount" });
    }
  
    const roll = Math.floor(Math.random() * 101); 
    const win = roll > chosenNumber; 
  
    
    const payoutMultiplier = 1 + (chosenNumber / 100) * 1.5;
  
    let newBalance = balance;
    if (win) {
      newBalance += betAmount * (payoutMultiplier - 1); 
    } else {
      newBalance -= betAmount; 
    }
  
    
    const hash = crypto.createHash("sha256").update(roll.toString()).digest("hex");
  
    res.json({
      roll,
      win,
      newBalance,
      hash,
    });
  });
  

app.listen(5000, () => console.log("Server running on port 5000"));
