// src/lib/db.js
import mysql from "mysql2/promise";

export const db = mysql.createPool({
  host: "ec2-3-38-180-108.ap-northeast-2.compute.amazonaws.com",
  user: "ydh960823",
  password: "Adbtmddyd2!",
  database: "ChatLogin",
});
