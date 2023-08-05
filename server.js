const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");

const app = express();
const port = process.env.PORT || 5000;

// Configurar middleware
app.use(express.json());
app.use(cors());

// Conexão com o MongoDB
const mongoURI = "mongodb://localhost:27017/controle_financeiro";
mongoose.connect(mongoURI, { useNewUrlParser: true, useUnifiedTopology: true });
const connection = mongoose.connection;
connection.once("open", () => {
  console.log("Conexão com o MongoDB estabelecida com sucesso!");
});

// Model da transação
const Transaction = mongoose.model("Transaction", {
  description: String,
  amount: Number,
});

// Rotas
app.get("/api/transactions", async (req, res) => {
  try {
    const transactions = await Transaction.find();
    res.json(transactions);
  } catch (error) {
    res.status(500).json({ error: "Erro ao buscar as transações." });
  }
});

app.post("/api/transactions", async (req, res) => {
  const { description, amount } = req.body;
  try {
    const newTransaction = new Transaction({ description, amount });
    await newTransaction.save();
    res.status(201).json(newTransaction);
  } catch (error) {
    res.status(500).json({ error: "Erro ao adicionar a transação." });
  }
});

app.delete("/api/transactions/:id", async (req, res) => {
  const { id } = req.params;
  try {
    await Transaction.findByIdAndDelete(id);
    res.json({ message: "Transação removida com sucesso." });
  } catch (error) {
    res.status(500).json({ error: "Erro ao remover a transação." });
  }
});

// Iniciar o servidor
app.listen(port, () => {
  console.log(`Servidor rodando na porta ${port}`);
});
