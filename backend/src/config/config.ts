import * as fs from 'fs';
import * as path from 'path';

const filePath = path.join(__dirname, 'data.txt');

function readData(callback: (err: NodeJS.ErrnoException | null, data: string | null) => void) {
    fs.readFile(filePath, 'utf8', callback);
}


function writeData(data: string, callback: (err: NodeJS.ErrnoException | null) => void) {
    fs.writeFile(filePath, data, callback);
}


readData((err, data) => {
    if (err) {
        console.error("Failed to read data:", err);
        return;
    }

    if (data) {

        const lines = data.split('\n');
        const numbers = lines.map(line => parseInt(line, 10)).filter(num => !isNaN(num));

        const sum = numbers.reduce((acc, val) => acc + val, 0);
        const average = numbers.length > 0 ? sum / numbers.length : 0;

        console.log("Sum:", sum);
        console.log("Average:", average);



        const newData = `Sum: ${sum}\nAverage: ${average}`;
        writeData(newData, (err) => {
            if (err) {
                console.error("Failed to write data:", err);
            } else {
                console.log("Successfully wrote sum and average to file.");
            }

        });


    }



});