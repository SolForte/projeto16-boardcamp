import { db } from "../database/database.js";
import dayjs from "dayjs";
import { differenceInDays } from "date-fns";

const DATE_FORMAT = "YYYY-MM-DD";

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
      rentDate: dayjs(rental.rentDate).format(DATE_FORMAT),
      daysRented: rental.daysRented,
      returnDate: rental.returnDate
        ? dayjs(rental.returnDate).format(DATE_FORMAT)
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
        dayjs().format(DATE_FORMAT),
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

export async function returnRentals(req, res) {
  try {
    const rentalId = req.params.id;
    const rentalData = await db.query(
      `SELECT rentals.*, games."pricePerDay"
       FROM rentals
       JOIN games ON rentals."gameId" = games.id 
       WHERE rentals.id = $1`,
      [rentalId]
    );

    const rental = rentalData.rows[0];
    const { pricePerDay, rentedDays, rentDate, returnDate } = rental;
    const rentDateSync = new Date(rentDate);
    const returnDateSync = new Date();
    let delayFee = null;

    if (!rental || rental.rowCount === 0) {
      res.sendStatus(404);
      return;
    }

    // If rental has already been returned, return 400
    if (returnDate !== null) {
      res.sendStatus(400);
      return;
    }

    // If return date is after rent date, calculate delay fee
    if (returnDateSync.getTime() > rentDateSync.getTime()) {
      const daysOverdue = differenceInDays(returnDateSync, rentDateSync);

      // If rental is overdue, calculate delay fee
      if (daysOverdue > rentedDays) {
        delayFee = (daysOverdue - rentedDays) * pricePerDay;
      }
    }

    // Update rental with return date and delay fee
    await db.query(
      'UPDATE rentals SET "returnDate" = $1, "delayFee" = $2 WHERE id = $3;',
      [returnDateSync, delayFee, rentalId]
    );

    res.sendStatus(200);
  } catch (error) {
    res.status(500).send(error.message);
  }
}

export async function deleteRentals(req, res) {
  const { id } = req.params;
  try {
    const rental = await db.query(`SELECT * FROM rentals WHERE id=$1`, [id]);

    if (rental.rowCount === 0) {
      res.sendStatus(404);
      return;
    }

    const { returnDate } = rental.rows[0];

    if (returnDate === null) {
      res.sendStatus(400);
      return;
    }

    await db.query(`DELETE FROM rentals WHERE id=$1`, [id]);

    res.sendStatus(200);
  } catch (error) {
    res.status(500).send(error.message);
  }
}
