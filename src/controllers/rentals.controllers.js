import { db } from "../database/database.js";

export async function getRentals(_req, res) {
  try {
    const rentals = await db.query(`SELECT * FROM rentals`);
    res.status(200).send(rentals.rows);
    return;
  } catch (error) {
    res.status(500).send(error.message);
    return;
  }
}
