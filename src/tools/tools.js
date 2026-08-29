import {db} from "../db/database";

// for saving data 

const saveData = (
  userName,
  education,
  occupation,
  skills,
  interests,
  mobility,
  employment_preference,
  phone
) => {
  const stmt = db.prepare(`
    INSERT INTO beneficiaries
    (name, education, occupation, skills, interests, mobility, employment_preference, phone)
    VALUES (?, ?, ?, ?, ?, ?, ?,?)
  `);

  stmt.run(
    userName,
    education,
    occupation,
    JSON.stringify(skills),
    JSON.stringify(interests),
    mobility,
    employment_preference,
    phone
  );
};

// for getting data 

const getData = () => {
  const stmt = db.prepare(`
    SELECT * FROM beneficiaries
  `);

  return stmt.all();
};

export {saveData,getData};