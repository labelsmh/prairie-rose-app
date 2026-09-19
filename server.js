require('dotenv').config();
const express = require('express');
const cors = require('cors');
const Airtable = require('airtable');

const app = express();
app.use(cors());
app.use(express.json());

const base = new Airtable({apiKey: process.env.AIRTABLE_TOKEN}).base(process.env.AIRTABLE_BASE_ID);

async function getAcademyMap() {
  const records = await base('ACADEMY').select().all();
  const map = {};
  records.forEach((r) => { map[r.id] = r.get('Name'); });
  return map;
}

async function getGuardianMap() {
  const records = await base('PARENT PROFILE').select().all();
  const map = {};
  records.forEach((r) => { map[r.id] = r.get('NAME'); });
  return map;
}

async function getBilletMap() {
  const records = await base('BILLET PROFILE').select().all();
  const map = {};
  records.forEach((r) => { map[r.id] = r.get('Name'); });
  return map;
}

// GET all student records
app.get('/api/students', async (req, res) => {
  try {
    const academyMap = await getAcademyMap();
    const guardianMap = await getGuardianMap();
    const billetMap = await getBilletMap();
    const records = await base('STUDENT PROFILE').select().all();

    const students = records.map((r) => {
      const academyIds = r.get('ACADEMY NAME') || [];
      const academyNames = academyIds.map((id) => academyMap[id] || id);
      const guardianIds = r.get('Guardians') || [];
      const billetIds = r.get('Billets') || [];
      const guardians = guardianIds.map((id) => ({id, name: guardianMap[id] || 'Unknown'}));
      const billets = billetIds.map((id) => ({id, name: billetMap[id] || 'Unknown'}));

      return {
        id: r.id,
        name: r.get('NAME'),
        academy: academyNames,
        year: r.get('YEAR'),
        grade: r.get('GRADE'),
        status: r.get('Status'),
        phone: r.get('PHONE'),
        email: r.get('EMAIL'),
        dob: r.get('DOB'),
        guardians,
        billets,
      };
    });

    res.json(students);
  } catch (err) {
    console.error(err);
    res.status(500).json({error: err.message});
  }
});

// GET a single guardian (Parent Profile) record
app.get('/api/guardians/:id', async (req, res) => {
  try {
    const record = await base('PARENT PROFILE').find(req.params.id);
    res.json({
      id: record.id,
      name: record.get('NAME'),
      primaryPhone: record.get('Primary Phone'),
      secondaryPhone: record.get('Secondary Phone'),
      primaryEmail: record.get('Primary Email'),
      secondaryEmail: record.get('Secondary Email'),
      primaryAddress: record.get('Primary Address'),
      secondaryAddress: record.get('Secondary Address'),
      notes: record.get('Notes'),
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({error: err.message});
  }
});

// GET a single billet record
app.get('/api/billets/:id', async (req, res) => {
  try {
    const record = await base('BILLET PROFILE').find(req.params.id);
    res.json({
      id: record.id,
      name: record.get('Name'),
      relationship: record.get('RELATIONSHIP'),
      phone: record.get('Phone'),
      email: record.get('Email'),
      address: record.get('Address'),
      notes: record.get('Notes'),
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({error: err.message});
  }
});

// UPDATE a single student record
app.patch('/api/students/:id', async (req, res) => {
  try {
    const updated = await base('STUDENT PROFILE').update(req.params.id, req.body);
    res.json(updated.fields);
  } catch (err) {
    console.error(err);
    res.status(500).json({error: err.message});
  }
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
