const express = require('express')
const mysql = require('mysql2/promise')
const bodyParser = require('body-parser');
var cors = require('cors')
const app = express()
const port = 3000;
app.use(cors())
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
const pool = mysql.createPool({
    host:'localhost',
    user:'root',
    database:'deV',
    waitForConnections:true,
    connectionLimit:10,
    maxIdle:10,
    idleTimeout:60000,
    queueLimit:0,
    enableKeepAlive:true,
    keepAliveInitialDelay:0,
    password:""

})

app.post('/Lend', async (req,res)=>{
    try{
        const { Customer_id, Loan_amount, Loan_period, Interest, total_amount, EMI } = req.body;
        const sql = `
        INSERT INTO loans (customer_id, loan_amount, loan_period, rate_of_interest, total_amount, monthly_emi)
        VALUES (?, ?, ?, ?, ?, ?)
      `;
      const values = [Customer_id, Loan_amount, Loan_period, Interest, total_amount, EMI];
      const result = await pool.query(sql, values);
      console.log('Inserted:', result[0].affectedRows);
      res.send({
        "done":"Inserted"
      });

    }catch(err){
        console.log(err);
        res.send({
            "err" : err
        });
        
        
    }
 
})
app.post('/payment', async (req, res) => {
    try {
        console.log(req.body);
        const { Customer_id, amount, paymentType } = req.body;
        const transaction_date = new Date().toISOString().slice(0, 10); // Today's date

        const sql = `
            INSERT INTO transactions (customer_id, transaction_date, payment_amount, payment_type)
            VALUES (?, ?, ?, ?)
        `;
        const values = [Customer_id, transaction_date, amount, paymentType];
        const result = await pool.query(sql, values);
        console.log('Inserted:', result[0].affectedRows);
        
        res.json({
            "done": 'Payment made'
            
        });
    } catch (err) {
        console.error('Error in  making payment:', err);
        res.status(500).send({
            "error": err.message
        });
    }
});
app.post('/Ledger', async (req,res)=>{
    try {
        const { customer_id } = req.body;

        // Query to fetch transactions based on customer_id
        const sql = `
            SELECT transaction_id, transaction_date, payment_amount, payment_type
            FROM transactions
            WHERE customer_id = ?
        `;
        const [rows] = await pool.query(sql, [customer_id]);

        if (rows.length === 0) {
            res.status(404).json({ error: 'No transactions found for this customer' });
            return;
        }

        // Send response with transactions
        res.json(rows);
    } catch (err) {
        console.error('Error fetching transactions:', err);
        res.status(500).json({ error: 'Failed to fetch transactions' });
    }
})
app.post('/Account', async (req, res) => {
    try {
        const { customerId } = req.body;

        // Query to fetch loan details based on customer_id
        const loanSql = `
            SELECT *
            FROM loans
            WHERE customer_id = ?
        `;
        const [loanRows] = await pool.query(loanSql, [customerId]);

        if (loanRows.length === 0) {
            res.status(404).json({ error: 'No loan details found for this customer' });
            return;
        }

        // Query to calculate total amount paid from transactions table
        const transactionSql = `
            SELECT SUM(payment_amount) AS amountPaid
            FROM transactions
            WHERE customer_id = ?
        `;
        const [transactionRows] = await pool.query(transactionSql, [customerId]);

        // Combine loan details with amount paid
        const accountData = {
            ...loanRows[0], // Assuming loan details are in the first row
            amountPaid: transactionRows[0].amountPaid || 0 // Default to 0 if no transactions found
        };

        res.json(accountData);
    } catch (err) {
        console.error('Error fetching account details:', err);
        res.status(500).json({ error: 'Failed to fetch account details' });
    }
});


app.listen(port,()=>{
    console.log(`Example app listening on port ${port}`)
})

