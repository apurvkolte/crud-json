import { promises as fs } from 'fs';
import path from 'path';

export default async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ message: 'Only POST allowed' });
    }
    // const data = [
    //     {
    //         name: 'John',
    //         email: 'john@gmail.com',
    //         mobile: '16446',
    //         message: 'Join us',
    //     }
    // ];

    const filePath = path.join(process.cwd() + '/src/', 'crud.json');

    const newEntry = req.body;

    // Read existing file (if it exists)
    let existingData = [];
    try {
        const fileContent = await fs.readFile(filePath, 'utf-8');
        existingData = JSON.parse(fileContent)
    } catch (err) {
        existingData = []
    }

    existingData.push(newEntry);

    try {
        await fs.writeFile(filePath, JSON.stringify(existingData, null, 2));  // non-blocking and asynchronous.
        return res.status(200).json({ message: 'Data saved successfully' });

    } catch (err) {
        console.error('Error writing file:', err);
        return res.status(500).json({ message: 'Failed to save data' });
    }
}
