import {db} from "../db/database";
const saveData = (
  userName,
  education,
  occupation,
  skills,
  interests,
  mobility,
  employment_preference
) => {
  const stmt = db.prepare(`
    INSERT INTO beneficiaries
    (name, education, occupation, skills, interests, mobility, employment_preference)
    VALUES (?, ?, ?, ?, ?, ?, ?)
  `);

  stmt.run(
    userName,
    education,
    occupation,
    JSON.stringify(skills),
    JSON.stringify(interests),
    mobility,
    employment_preference
  );
};

export {saveData};