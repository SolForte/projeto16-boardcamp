import { db } from "../database/database.js";

export async function getCustomers(_req, res) {
  try {
    const customers = await db.query(`SELECT * FROM customers`);
    res.status(200).send(customers.rows);
    return;
  } catch (error) {
    res.status(500).send(error.message);
    return;
  }
}

export async function postCustomers(req, res) {
  const { name, phone, cpf, birthday } = req.body;
  try {
    const customerConflict = await db.query(
      `SELECT * FROM customers WHERE cpf = $1`,
      [cpf]
    );
    if (customerConflict.rows.length > 0) {
      res.sendStatus(409);
      return;
    }

    await db.query(
      `INSERT INTO customers (name, phone, cpf, birthday) VALUES ($1, $2, $3, $4)`,
      [name, phone, cpf, birthday]
    );
    res.sendStatus(201);
    return;
  } catch (error) {
    res.status(500).send(error.message);
    return;
  }
}
