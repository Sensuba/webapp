const fs = require('fs');

// Helper function to decode base64 and parse JSON
const decodeSupercode = (supercode) => JSON.parse(Buffer.from(supercode, 'base64').toString('utf-8'));

// Helper function to encode JSON and convert to base64
const encodeSupercode = (obj) => Buffer.from(JSON.stringify(obj)).toString('base64');

// Read and parse output.json and output2.json
const output1 = JSON.parse(fs.readFileSync('output.json', 'utf-8'));
const output2 = JSON.parse(fs.readFileSync('output2.json', 'utf-8'));

// Assuming both arrays have the same length
if (output1.length !== output2.length) {
    throw new Error('The two JSON files do not have the same number of objects');
}

// Loop over each object in the arrays
output2.forEach((obj2, index) => {
    const obj1 = output1[index];

    // Decrypt the supercode from both output1 and output2
    const decrypted1 = decodeSupercode(obj1.supercode);
    const decrypted2 = decodeSupercode(obj2.supercode);

    // Replace imgLink in output2's decrypted object with imgLink from output1's decrypted object
    decrypted2.imgLink = decrypted1.imgLink;

    // Re-encrypt the modified object in output2 and store it back
    obj2.supercode = encodeSupercode(decrypted2);
});

// Write the modified output2 to copy.json
fs.writeFileSync('copy.json', JSON.stringify(output2, null, 2));

console.log('The modified JSON has been saved as copy.json');
