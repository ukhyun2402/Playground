require('dotenv').config();
const OracleDB = require('oracledb');
const { invoices, revenue, customers, users } = require('../app/lib/placeholder-data');
const bcrypt = require('bcrypt');

async function connectionTest(client) {
  try {
    await client.execute("SELECT 'HELLO' FROM DUAL");

    console.log("oracle connection success");
  }
  catch (err) {
    console.error("Error occur", err);
    throw err;
  }
}

async function seedUsers(client) {
  try {
    // await client.execute("CREATE TABLE TEST1.USERS (ID VARCHAR2(40) PRIMARY KEY, NAME VARCHAR2(255) NOT NULL, EMAIL VARCHAR2(2000) NOT NULL UNIQUE, PASSWORD VARCHAR2(2000) NOT NULL)");

    // console.log("Create 'users' table");

    const insertedUsers = await Promise.all(
      users.map(async user => {
        const hashedPassword = await bcrypt.hash(user.password, 10);
        return client.execute(`INSERT INTO TEST1.USERS VALUES(:0, :1, :2, :3)`, [user.id, user.name, user.email, hashedPassword]
        );
      })
    );

    console.log(`Seeded ${insertedUsers.length} users`);
    return {
      users: insertedUsers,
    };
  } catch (error) {
    console.error('Error seeding users:', error);
    throw error;
  }
  finally {
    client.close();
  }
}

async function run() {
  OracleDB.initOracleClient({ libDir: 'C:\\oracle\\instantclient_21_13' });
  OracleDB.autoCommit = true;
  const client = await OracleDB.getConnection({
    user: process.env.ORACLE_USER
    , password: process.env.ORACLE_PW
    , connectionString: process.env.ORACLE_CONNECTION_STRING
  });
  await connectionTest(client);
  await seedUsers(client);

}

run().catch((err) => {
})