import { db } from "../database/database.js";
import dayjs from "dayjs";

export async function getCustomers(_req, res) {
  try {
    const customers = await db.query(`SELECT * FROM customers`);
    const customersRows = customers.rows.map(
      ({ id, name, phone, cpf, birthday }) => ({
        id,
        name,
        phone,
        cpf,
        birthday: dayjs(birthday).format("YYYY-MM-DD"),
      })
    );
    res.status(200).send(customersRows);
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

export async function getCustomersById(req, res) {
  const { id } = req.params;
  try {
    const customers = await db.query(`SELECT * FROM customers WHERE id=$1`, [
      id,
    ]);

    if (customers.rowCount === 0) {
      res.sendStatus(404);
      return;
    }

    res
      .status(200)
      .send({
        ...customers.rows[0],
        birthday: dayjs(customers.rows[0].birthday).format("YYYY-MM-DD"),
      });
    return;
  } catch (error) {
    res.status(500).send(error.message);
    return;
  }
}

export async function updateCustomers(req, res) {
  const { id } = req.params;
  const { name, phone, cpf, birthday } = req.body;
  try {
    const cpfConflict = await db.query(
      `SELECT * FROM customers WHERE cpf=$1 AND NOT id=$2`,
      [cpf, id]
    );
    if (cpfConflict.rows.length > 0) {
      res.sendStatus(409);
      return;
    }
    await db.query(
      `UPDATE customers SET name=$1, phone=$2, cpf=$3, birthday=$4 WHERE id=$5`,
      [name, phone, cpf, birthday, id]
    );
    res.sendStatus(200);
    return;
  } catch (error) {
    res.status(500).send(error.message);
    return;
  }
}
