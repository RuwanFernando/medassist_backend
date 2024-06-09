const { google } = require('googleapis');

const clientEmail = process.env.G_SHEET_CLIENT_EMAIL;
const privateKey = "-----BEGIN PRIVATE KEY-----\nMIIEvgIBADANBgkqhkiG9w0BAQEFAASCBKgwggSkAgEAAoIBAQC5QPM/x7v6chIl\nJ4XaaeujmFsa/HiZgd9DcXK+cRhhiuwa1pZWnRdJickm3DNqBLwqpsdQV9l6IRNG\nSgC6Vh94EMhNBajW3VGeDjh3hdhrfpvFcDzYRanzjBUr0JEWDuZzuYlFPssLbmn+\nvZlAYKAoKagjeG+PKU/GrF/RKN1ohI+E8yZByuy58vviuSWfnA5g+X7uPlRGPDOw\nU50cBtdBNE+oSjNC0377r091GuRGlfnhQT3GJj0B9voiuIq7ytgCanZB3xv6GzXO\nhufBwxgrD8+WSyJumx6XwuxwrBK9+8AxfMjhpx5+dtoFyVGJDTggpYkENbRSOr2s\nDPI2s3RtAgMBAAECggEAIYitj6/Q6gCwoquhGfye9FXttfiaPxVojA2S+wC/bFbI\nrwIFpEea8cugjymAoBIb2q+meDdyzV4D3m8iaxiQaTxGedTKr5xP/CewVohyuOCq\nA2cyCGcx4L2MjooaXU8UrcGZ5OA9QoQ56Sw6e9IR47tIraUNMrHEeF73GEZIr/Sx\nyHN6u+AtYCufJIK0BBi7KvW7TS2b3vy2tBvD5gPxyJo1P0W7QhccOefA+kgQrpCz\nYTfXBNckyziKJDouSVHZlYwDP/d/QoDSEBs2XDQ6/s8003sBKNqASR6qUmNhR7Pz\nYfa0f2KRqk88LLiS9hsqj3rPPyRgz+RYHI4IOiykqQKBgQDwc6/c8rwJXnLiH0gL\nlI0iRApCyBNo5k/a6ZApzSXg84ihIaEtS+QQcp1iF8GHm9/0HdVJqp4xdyRRKtyi\nwx3Z8ayYpfufWXauvnisTqYcrSVR//UxSmCOCbhtAQN5z5u3BMVQvkd46LBDSWuY\nWzzCz/hwsqwbtvHSskv4Kfl7hQKBgQDFO4qtZB8VU9Q7OuGAhwEQD1d9TH0q7Gsh\nrBj8Kb0memING7gns8MNeL2Ihiju/M0PPmnLwB5EIECBuzsFkp0fe6uN/iT200xZ\nFDQjC5s8/qtqunUnP8gxEGb82oUiN26dvSUJ65Q7/rqCmnLui8MeYqjs4WoXZoEH\ne+UouJ5lyQKBgQCqJNJegAx6fLDCPOxX9WfgxVCVbMn/QmljOD5gtd+FzA30Jr3M\nNZVN5ixjivfQo4XXUXzpQafqzKmQHco+Cd8HpzFAWsMwQLfwcqslEgoM5KAx4/J2\nTHECUPKFf2AcQ8GlweR1fA9LCSwgkMVn67eVCmB8LpIGkm+Pbca/9cOpmQKBgApS\nkXF9ufq9xm/LJx448p9KjkOqiyqB8SF0BmK8NIAdC6CwALVjPSQpW5IXo3DOnlTb\n6WGWjn72SSoBCJfEEqEhMdten8SjTm2jFw92fgt1MLeHRrZlKi8XMqytKyadTBbJ\nXXTldX6mWFCZkMZXXkDq3Ph427qZzMr9ewLklrWxAoGBAI+wSg9Vm3DhLwpZUYYT\nFUZFapzgpl9Q8g6ftDR8oUPX1W8Z0iTL58i3AAyOCC2y0TlocxeqohzTHGZ95jWt\nE7kiYK7Uo9exhegtOk4M2hqOqbeUgAingy6V4GcQM1z68avo6BOQsSF7TyMSg0RD\nGZzFQJ1hZdCF/hjOWnSazV0n\n-----END PRIVATE KEY-----\n";

const auth = new google.auth.GoogleAuth({
    credentials: {
        client_email: clientEmail,
        private_key: privateKey
    },
    scopes: ["https://www.googleapis.com/auth/spreadsheets"]
});

const getClient = async () => {
    const client = await auth.getClient();
    return google.sheets({ version: "v4", auth: client });
};



module.exports = {
    getClient,
    spreadsheetId: process.env.G_SHEET_ID,
    range: "Sheet1!A:A" // Start appending data from column A
};
