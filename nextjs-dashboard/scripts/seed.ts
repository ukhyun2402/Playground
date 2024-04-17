require('dotenv').config();
import OracleDB, { Connection, DBError } from "oracledb";

async function connectionTest(client: Connection) {
  try {
    await client.execute`
    SELECT 1 FROM DUAL;
    `;

    console.log("oracle connection success");
  }
  catch (err) {
    console.error("Error occur", err);
    throw err;
  }
}

async function run() {
  const client: Connection = await OracleDB.getConnection({
    user: process.env.ORACLE_USER
    , password: process.env.ORACLE_PW
    , connectionString: process.env.ORACLE_CONNECTION_STRING
  });

  await connectionTest(client);
}

run().catch((err) => {
  console.error(err);
})