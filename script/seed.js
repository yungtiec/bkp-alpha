const db = require("../server/db");
const { User, Permission, Role } = require("../server/db/models");
Promise = require("bluebird");

async function seed() {
  await db.sync({ force: true });
  console.log("db synced!");
  await seedUser();
  await seedPermission()
}

async function seedUser() {
  const users = await Promise.all([
    User.create({ email: "cody@email.com", password: "123" }),
    User.create({ email: "murphy@email.com", password: "123" })
  ]);

  console.log(`seeded ${users.length} users`);
  console.log(`seeded successfully`);
}

async function seedPermission() {
  const permissions = await Promise.map([
    { name: "upvote" },
    { name: "annotate" },
    { name: "answer_survey" },
    { name: "create_survey" },
    { name: "approve_survey_answers" },
    { name: "approve_annotation" }
  ], entry => Permission.create(entry));
  const role = await Promise.map([
    { name: "admin" },
    { name: "open_source_user" },
    { name: "business_user" }
  ], entry => Role.create(entry))
  await Promise.map(permissions, permission => {
    return role[0].addPermission(permission.id)
  })
  await Promise.map(permissions.slice(0, 2), permission => {
    return role[1].addPermission(permission.id)
  })
  await Promise.map(permissions.slice(0, 4), permission => {
    return role[2].addPermission(permission.id)
  })
}

seed()
  .catch(err => {
    console.error(err.message);
    console.error(err.stack);
    process.exitCode = 1;
  })
  .then(() => {
    console.log("closing db connection");
    db.close();
    console.log("db connection closed");
  });

console.log("seeding...");
