const Transaction = require('../models/transactionModel'); 
const { transactionSchema } = require('../middlewares/validator');


exports.createTransaction = async (req, res) => {
    let {waiter, merchant, premier, edahab, others, credit, promotion, open } = req.body;
    let eBesa = req.body["e-besa"]; // "-" destructuring ma oggola

    try {
        const { error } = transactionSchema.validate({
            waiter, merchant, premier, edahab, "e-besa": eBesa, others, credit, promotion, open
        });

        if (error) {
            return res.status(401).json({ success: false, message: error.details[0].message });
        }

        // Parse to numbers
        const parseAmount = (val) => typeof val === 'string' ? parseFloat(val.replace('$', '')) : val;

        const waiterName = typeof waiter === 'string' ? waiter.trim() : "Unknown Waiter";
        const merchantAmount = parseAmount(merchant);
        const premierAmount = parseAmount(premier);
        const edahabAmount = parseAmount(edahab);
        const eBesaAmount = parseAmount(eBesa);
        const othersAmount = parseAmount(others);
        const creditAmount = parseAmount(credit);
        const promotionAmount = parseAmount(promotion);
        const openAmount = parseAmount(open);

        const totalAmount = merchantAmount + premierAmount + edahabAmount + eBesaAmount + othersAmount + creditAmount + promotionAmount + openAmount;

        const newTransaction = new Transaction({
            waiter: waiterName,
            merchant: merchantAmount,
            premier: premierAmount,
            edahab: edahabAmount,
            "e-besa": eBesaAmount,
            others: othersAmount,
            credit: creditAmount,
            promotion: promotionAmount,
            open: openAmount
        });

        const savedTransaction = await newTransaction.save();

        // Format times
        const formatDate = (d, locale) => new Intl.DateTimeFormat(locale, {
            timeZone: 'Africa/Mogadishu'
        }).format(d);

        const formatTime = (d) => new Intl.DateTimeFormat('en-GB', {
            timeZone: 'Africa/Mogadishu',
            hour: '2-digit', minute: '2-digit', second: '2-digit',
            hour12: false
        }).format(d);

        const createdAtObj = new Date(savedTransaction.createdAt);
        const updatedAtObj = new Date(savedTransaction.updatedAt);

        res.status(201).json({
            success: true,
            message: "Transaction has been created",
            result: {
                _id: savedTransaction._id,
                waiter: savedTransaction.waiter,
                merchant: savedTransaction.merchant,
                premier: savedTransaction.premier,
                edahab: savedTransaction.edahab,
                "e-besa": savedTransaction["e-besa"],
                others: savedTransaction.others,
                credit: savedTransaction.credit,
                promotion: savedTransaction.promotion,
                open: savedTransaction.open,
                totalAmount,
                createdDate: formatDate(createdAtObj, 'en-CA'),
                createdTime: formatTime(createdAtObj),
                updateDate: formatDate(updatedAtObj, 'en-CA'),
                updateTime: formatTime(updatedAtObj)
            }
        });

    } catch (err) {
        console.log(err);
        res.status(500).json({ success: false, message: "Internal Server Error" });
    }
};





exports.getTransaction = async (req, res) => {
    try {
        const transactions = await Transaction.find();  // Fetch all transactions

        // Format the date and time for each transaction
        const formattedTransactions = transactions.map(transaction => {
            const createdAtObj = new Date(transaction.createdAt);
            const updatedAtObj = new Date(transaction.updatedAt);

            // Format createdAt date and time
            const createdDate = new Intl.DateTimeFormat('en-CA', {
                timeZone: 'Africa/Mogadishu',
            }).format(createdAtObj); // "YYYY-MM-DD"

            const createdTime = new Intl.DateTimeFormat('en-GB', {
                timeZone: 'Africa/Mogadishu',
                hour: '2-digit',
                minute: '2-digit',
                second: '2-digit',
                hour12: false,
            }).format(createdAtObj); // "HH:MM:SS"

            // Format updatedAt date and time
            const updateDate = new Intl.DateTimeFormat('en-CA', {
                timeZone: 'Africa/Mogadishu',
            }).format(updatedAtObj); // "YYYY-MM-DD"

            const updateTime = new Intl.DateTimeFormat('en-GB', {
                timeZone: 'Africa/Mogadishu',
                hour: '2-digit',
                minute: '2-digit',
                second: '2-digit',
                hour12: false,
            }).format(updatedAtObj); // "HH:MM:SS"
               const totalAmount =
                (transaction.merchant || 0) +
                 (transaction.premier || 0) +
                 (transaction.edahab || 0) +
                  (transaction["e-besa"] || 0) +
                  (transaction.others || 0) +
                  (transaction.credit || 0) +
                  (transaction.promotion || 0) +
                  (transaction.open || 0);
            return {
                _id: transaction._id,
                waiter: transaction.waiter,
                merchant: transaction.merchant,
                premier: transaction.premier,
                edahab: transaction.edahab,
                "e-besa": transaction["e-besa"],
                others: transaction.others,
                credit: transaction.credit,
                promotion: transaction.promotion,
                open: transaction.open,

                totalAmount: totalAmount,
                createdDate,
                createdTime,
                updateDate,
                updateTime,
            };
        });


        res.status(200).json({
            success: true,
            message: 'Transactions fetched successfully',
            data: formattedTransactions,
        });
    } catch (err) {
        console.log(err);
        res.status(500).json({ success: false, message: 'Error fetching Transactions' });
    }

    
}

exports.updateTransaction = async (req, res) => {
    const { waiter, merchant, premier, edahab, "e-besa": eBesa, others, credit, promotion, open } = req.body;
    const transactionId = req.params.id;

    try {
        const existingTransaction = await Transaction.findById(transactionId);
        if (!existingTransaction) {
            return res.status(404).json({ success: false, message: 'Transaction not found' });
        }

        // Update fields correctly (include zero values)
        if (waiter !== undefined) existingTransaction.waiter = waiter;
        if (merchant !== undefined) existingTransaction.merchant = merchant;
        if (premier !== undefined) existingTransaction.premier = premier;
        if (edahab !== undefined) existingTransaction.edahab = edahab;
        if (eBesa !== undefined) existingTransaction["e-besa"] = eBesa;
        if (others !== undefined) existingTransaction.others = others;
        if (credit !== undefined) existingTransaction.credit = credit;
        if (promotion !== undefined) existingTransaction.promotion = promotion;
        if (open !== undefined) existingTransaction.open = open;

        const updatedTransaction = await existingTransaction.save();

        const updatedAtObj = new Date(updatedTransaction.updatedAt);

        const updateDate = new Intl.DateTimeFormat('en-CA', {
            timeZone: 'Africa/Mogadishu',
        }).format(updatedAtObj);

        const updateTime = new Intl.DateTimeFormat('en-GB', {
            timeZone: 'Africa/Mogadishu',
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit',
            hour12: false,
        }).format(updatedAtObj);

        res.status(200).json({
            success: true,
            message: 'Transaction updated successfully',
            result: {
                _id: updatedTransaction._id,
                waiter: updatedTransaction.waiter,
                merchant: updatedTransaction.merchant,
                premier: updatedTransaction.premier,
                edahab: updatedTransaction.edahab,
                "e-besa": updatedTransaction["e-besa"],
                others: updatedTransaction.others,
                credit: updatedTransaction.credit,
                promotion: updatedTransaction.promotion,
                open: updatedTransaction.open,
                totalAmount:
                    (updatedTransaction.merchant || 0) +
                    (updatedTransaction.premier || 0) +
                    (updatedTransaction.edahab || 0) +
                    (updatedTransaction["e-besa"] || 0) +
                    (updatedTransaction.others || 0) +
                    (updatedTransaction.credit || 0) +
                    (updatedTransaction.promotion || 0) +
                    (updatedTransaction.open || 0),
                updateDate,
                updateTime,
            },
        });
    } catch (err) {
        console.log(err);
        res.status(500).json({ success: false, message: 'Error updating Transaction' });
    }
};


exports.deleteTransaction = async (req, res) => {
    const transactionId = req.params.id;  // Get the 'id' from the URL parameter

    try {
        // Find the transaction by ID and delete it
        const result = await Transaction.findByIdAndDelete(transactionId);

        if (!result) {
            return res.status(404).json({ success: false, message: 'Transaction not found' });
        }

        res.status(200).json({
            success: true,
            message: 'Transaction deleted successfully',
        });
    } catch (err) {
        console.log(err);
        res.status(500).json({ success: false, message: 'Error deleting Transaction' });
    }


};
