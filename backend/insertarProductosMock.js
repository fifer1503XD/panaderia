const dns = require("dns");
dns.setServers(["8.8.8.8", "1.1.1.1"]);

const mongoose = require("mongoose");
require("dotenv").config();
const Producto = require("./models/productos");

const initialProducts = [
  {
    code: "CR001",
    name: "Croissant",
    brand: "Tuttis",
    department: "PANES",
    price1: 3000,
    price2: 2800,
    price3: 2500,
    minStock: 4,
    stock: 10
  },
  {
    code: "CR002",
    name: "Rollo de canela",
    brand: "Tuttis",
    department: "PANES",
    price1: 2000,
    price2: 1800,
    price3: 1600,
    minStock: 5,
    stock: 2
  },
  {
    code: "RP001",
    name: "Torta de chocolate",
    brand: "Tuttis",
    department: "REPOSTERIA",
    price1: 5000,
    price2: 4500,
    price3: 4000,
    minStock: 6,
    stock: 5
  },
  {
    code: "BG001",
    name: "Baguette artesanal",
    brand: "Tuttis",
    department: "PANES",
    price1: 3500,
    price2: 3200,
    price3: 3000,
    minStock: 5,
    stock: 18
  },
  {
    code: "RP002",
    name: "Muffin de arándanos",
    brand: "Tuttis",
    department: "REPOSTERIA",
    price1: 4000,
    price2: 3800,
    price3: 3500,
    minStock: 4,
    stock: 1
  },
  {
    code: "RP003",
    name: "Dona glaseada",
    brand: "Tuttis",
    department: "REPOSTERIA",
    price1: 2500,
    price2: 2200,
    price3: 2000,
    minStock: 5,
    stock: 12
  }
];

mongoose.connect(process.env.MONGODB_URI)
  .then(async () => {
    console.log("MongoDB conectado para inserción de catálogo...");
    for (const prod of initialProducts) {
      await Producto.findOneAndUpdate(
        { code: prod.code },
        prod,
        { upsert: true, new: true }
      );
    }
    console.log("¡Productos del diseño insertados/actualizados exitosamente en MongoDB!");
    await mongoose.connection.close();
    process.exit(0);
  })
  .catch((err) => {
    console.error("Error al insertar productos en MongoDB:", err);
    process.exit(1);
  });
