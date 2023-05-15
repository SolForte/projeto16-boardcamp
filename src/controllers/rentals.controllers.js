import { db } from "../database/database.js";
import dayjs from "dayjs";

export async function getRentals(_req, res) {
  try {
    const rentalsQuery = `
      SELECT
        rentals.id,
        rentals."customerId",
        rentals."gameId",
        rentals."rentDate",
        rentals."daysRented",
        rentals."returnDate",
        rentals."originalPrice",
        rentals."delayFee",
        customers.name AS "customerName",
        games.name AS "gameName"
      FROM rentals
      JOIN customers ON customers.id = rentals."customerId"
      JOIN games ON games.id = rentals."gameId"
    `;
    const rentalsResult = await db.query(rentalsQuery);
    const rentals = rentalsResult?.rows.map((rental) => ({
      id: rental.id,
      customerId: rental.customerId,
      gameId: rental.gameId,
      rentDate: dayjs(rental.rentDate).format("YYYY-MM-DD"),
      daysRented: rental.daysRented,
      returnDate: rental.returnDate
        ? dayjs(rental.returnDate).format("YYYY-MM-DD")
        : null,
      originalPrice: rental.originalPrice,
      delayFee: rental.delayFee,
      customer: { id: rental.customerId, name: rental.customerName },
      game: { id: rental.gameId, name: rental.gameName },
    }));
    res.status(200).send(rentals);
  } catch (error) {
    res.status(500).send(error.message);
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
      rentalsQuery.rows[0].count >= stockTotal
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
