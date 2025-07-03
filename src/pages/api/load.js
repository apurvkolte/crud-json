import { promises as fs } from 'fs';
import path from 'path';

export default async function handler(req, res) {

    const filePath = path.join(process.cwd() + '/src/', 'crud.json');

    try {
        const fileContent = await fs.readFile(filePath, 'utf-8');
        const data = JSON.parse(fileContent);
        return res.status(200).json(data)
    } catch (err) {
        console.error('Error reading file: ', err);
        return res.status(500).json({ message: 'Failed to read data' })
    }

}
