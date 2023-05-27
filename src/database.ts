import { ICompany } from "./models/Company";

const mysql = require("mysql2");
const dotemv = require("dotenv");

interface IUser {
  email: string;
  password: string;
  first_name: string;
  last_name: string;
  company: string;
  tel: string;
}

dotemv.config();

export const pool = mysql
  .createPool({
    host: process.env.MYSQL_HOST,
    user: process.env.MYSQL_USER,
    password: process.env.MYSQL_PASSWORD,
    database: process.env.MYSQL_DATABASE,
  })
  .promise();

export async function getCompanyOne(id: string) {
  const [rows] = await pool.query(`SELECT * FROM company WHERE id = ${id}`);
  return rows;
}

export async function getCompany() {
  const [rows] = await pool.query(`SELECT * FROM company`);
  return rows;
}

export async function getUsers() {
  const [rows] = await pool.query("SELECT * FROM users");
  return rows;
}

export async function getUsersInCompany(id: string) {
  const [rows] = await pool.query(
    `SELECT * FROM users WHERE company_id = ${id}`
  );
  return rows;
}

export async function createUser({
  email,
  password,
  first_name,
  last_name,
  company,
  tel,
}: IUser) {
  const [rows] = await pool.query("SELECT email FROM users WHERE email = ?", [
    email,
  ]);
  const companyAPI = await getCompany().then((res) => {
    return res.find((item: ICompany) => item.name_company === company);
  });
  if (rows.length > 0) {
    return "error";
  } else {
    if (companyAPI) {
      const result = await pool.query(
        `INSERT INTO users (email, password, first_name, last_name, company, tel, company_id) VALUES (?, ?, ?, ?, ?, ?, ?)`,
        [email, password, first_name, last_name, company, tel, companyAPI.id]
      );
      return result;
    } else {
      return "Not found Company!";
    }
  }
}

export async function getNotes() {
  const [rows] = await pool.query("SELECT * FROM notes");
  return rows;
}

export async function getNote(id: string) {
  const [rows] = await pool.query(`SELECT * FROM notes WHERE id =${id}`);
  return rows;
}

export async function createNote(title: string, contents: string) {
  const result = await pool.query(
    `INSERT INTO notes (title, contents)
     VALUES (?, ?)`,
    [title, contents]
  );
  return result;
}

// module.exports = {
//   getNotes,
//   getNote,
//   createNote,
// };

// const notes = await createNote("test2", "test2");
// const notes = await getNote(1);
// console.log(notes);
