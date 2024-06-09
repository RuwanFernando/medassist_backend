const { getClient, spreadsheetId, range } = require('../configs/g_sheet');
const { baseURL } = require('../utils/constants');

exports.formSubmission = async (req, res) => {
    try {
        let formData = req.body;

        if(req.file === undefined || req.file === null) {
            delete formData.file;
            formData.doc = null;
        } else {
            formData.doc = baseURL(req) + req.file.path;
        }

        const sheets = await getClient();
                
        const valuesToInsert = Object.values(formData);

        await sheets.spreadsheets.values.append({
            spreadsheetId,
            range,
            insertDataOption: "INSERT_ROWS",
            valueInputOption: "RAW",
            resource: {
                values: [valuesToInsert]
            }
        });
        
        res.status(200).send('Data submitted successfully');
    } catch (error) {
        res.status(500).send(error.message);
    }
};

//gcib owan plff pbqg