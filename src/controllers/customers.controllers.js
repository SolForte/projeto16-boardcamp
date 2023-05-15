import { db } from "../database/database.js";

export async function getCustomers(_req, res) {
  try {
    const customers = await db.query(`SELECT * FROM customers`);
    res.status(200).send(customers.rows);
  } catch (error) {
    res.status(500).send(error.message);
  }
}
