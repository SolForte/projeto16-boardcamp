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

export async function postRentals(req, res) {
  const { customerId, gameId, daysRented } = req.body;
  try {
    const customerQuery = await db.query(
      `SELECT * FROM customers WHERE id = $1`,
      [customerId]
    );
    const gameQuery = await db.query(`SELECT * FROM games WHERE id=$1`, [
      gameId,
    ]);
    const rentalsQuery = await db.query(
      `SELECT COUNT(*) FROM rentals WHERE "gameId"=$1 AND "returnDate" IS NULL`,
      [gameId]
    );

    const { pricePerDay, stockTotal } = gameQuery.rows[0];

    if (
      gameQuery.rowCount === 0 ||
      customerQuery.rowCount === 0 ||
      stockTotal - rentalsQuery.rows[0].count
    ) {
      res.sendStatus(400);
      return;
    }

    await db.query(
      `INSERT INTO rentals (
            "customerId",
            "gameId",
            "rentDate",
            "daysRented",
            "returnDate",
            "originalPrice",
            "delayFee"
            )
            VALUES ($1, $2, $3, $4, $5, $6, $7)`,
      [
        customerId,
        gameId,
        dayjs().format("YYYY-MM-DD"),
        daysRented,
        null,
        pricePerDay * daysRented,
        null,
      ]
    );

    res.sendStatus(201);
    return;
  } catch (error) {
    res.status(500).send(error.message);
    return;
  }
}
