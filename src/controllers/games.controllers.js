import { db } from '../database/database.js';

export async function getGames(_req, res) {
  try {
    const games = await db.query(`SELECT * FROM games`);
    res.status(200).send(games.rows);
  } catch (error) {
    res.status(500).send(error.message);
  }
}

export async function postGames(req, res) {
  const { name, image, stockTotal, pricePerDay } = req.body;
  try {
    const gameConflict = await db.query(`SELECT * FROM games WHERE name = $1`, [
      name,
    ]);
    if (gameConflict.rows.length > 0) {
      res.sendStatus(409);
      return;
    }

    await db.query(
      `INSERT INTO games (name, image, "stockTotal", "pricePerDay") VALUES ($1, $2, $3, $4)`,
      [name, image, stockTotal, pricePerDay]
    );
    res.sendStatus(201);
  } catch (error) {
    res.status(500).send(error.message);
  }
}
