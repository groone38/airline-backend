import { ICompany } from "./models/Company";

const mysql = require("mysql2");
const dotemv = require("dotenv");
const bcrypt = require("bcryptjs");

interface IUser {
  id?: string;
  email: string;
  password?: string;
  first_name?: string;
  last_name?: string;
  company?: string;
  tel?: string;
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

export async function createCompany(company: string) {
  const result = await pool.query(
    `INSERT INTO company (name_company) VALUES (?)`,
    [company]
  );

  return getCompany();
}

export async function deleteCompany(id: string) {
  const [rows] = await pool.query(`DELETE FROM company WHERE id=${id}`);
  return rows;
}

export async function getUsers() {
  const [rows] = await pool.query("SELECT * FROM users");
  return rows;
}

export async function getUserOne(id: string) {
  const [rows] = await pool.query(`SELECT * FROM users WHERE id=${id}`);
  return rows;
}

export async function getUsersInCompany(id: string) {
  const [rows] = await pool.query(
    `SELECT * FROM users WHERE company_id = ${id}`
  );
  return rows;
}

export async function putUser(
  id: string,
  { email, first_name, last_name, company, tel }: IUser
) {
  const compnay_id = await getCompany().then((res: ICompany[]) =>
    res.find((item) => item.name_company === company)
  );
  const sql = `UPDATE users SET email = ?, first_name = ?, last_name = ?, company = ?, tel = ?, company_id = ? WHERE id = ${id}`;
  const [rows] = await pool.query(sql, [
    email,
    first_name,
    last_name,
    company,
    tel,
    compnay_id?.id,
  ]);
  return rows;
}

export async function deleteUser(id: string) {
  const [rows] = await pool.query(`DELETE FROM users WHERE id=${id}`);
  return rows;
}

export async function registrUser({
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
      let hashedPassword = await bcrypt.hash(password, 6);

      const result = await pool.query(
        `INSERT INTO users (email, password, first_name, last_name, company, tel, company_id) VALUES (?, ?, ?, ?, ?, ?, ?)`,
        [
          email,
          hashedPassword,
          first_name,
          last_name,
          company,
          tel,
          companyAPI.id,
        ]
      );
      return result;
    } else {
      return "Not found Company!";
    }
  }
}

export async function authUser({ email, password }: IUser) {
  const [rows] = await pool.query("SELECT * FROM users.users WHERE email = ?", [
    email,
  ]);

  if (rows.length > 0) {
    const pas = await bcrypt.compare(password, rows[0].password);
    if (pas) {
      return rows;
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
