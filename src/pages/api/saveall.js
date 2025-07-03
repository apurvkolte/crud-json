import { promises as fs } from 'fs';
import path from 'path';

export default async function handler(req, res) {
    if (req.method === 'POST') {
        const data = req.body; // Receive updated data

        const filePath = path.join(process.cwd(), '/src/', 'crud.json');
        try {
            await fs.writeFile(filePath, JSON.stringify(data, null, 2));
            res.status(200).json({ message: 'Data saved successfully' });
        } catch (err) {
            console.error('Error writing file:', err);
            res.status(500).json({ message: 'Failed to save data' });
        }
    } else {
        res.status(405).json({ message: 'Only POST allowed' });
    }
}
