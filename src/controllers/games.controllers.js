import { db } from "../database/database.js";

export async function getGames() {
  try {
    const games = await db.query("SELECT * FROM games");
    res.status(200).send(games.rows);
  } catch (error) {
    res.status(500).send(error.message);
  }
}
