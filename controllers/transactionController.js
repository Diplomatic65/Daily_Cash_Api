const Transaction = require('../models/transactionModel'); 
const { transactionSchema } = require('../middlewares/validator');


exports.createTransaction = async (req, res) => {
    let { waiter, marchent, Premier, Edabah, Others, Credit, Promotion } = req.body;
    let eBesa = req.body["E-besa"]; // "-" destructuring ma oggola

    try {
        const { error } = transactionSchema.validate({
            waiter, marchent, Premier, Edabah, "E-besa": eBesa, Others, Credit, Promotion
        });

        if (error) {
            return res.status(401).json({ success: false, message: error.details[0].message });
        }

        // Parse to numbers
        const parseAmount = (val) => typeof val === 'string' ? parseFloat(val.replace('$', '')) : val;

        const marchentAmount = parseAmount(marchent);
        const PremierAmount = parseAmount(Premier);
        const EdabahAmount = parseAmount(Edabah);
        const eBesaAmount = parseAmount(eBesa);
        const OthersAmount = parseAmount(Others);
        const CreditAmount = parseAmount(Credit);
        const PromotionAmount = parseAmount(Promotion);

        const totalAmount = marchentAmount + PremierAmount + EdabahAmount + eBesaAmount + OthersAmount + CreditAmount + PromotionAmount;

        const newTransaction = new Transaction({
            waiter,
            marchent: marchentAmount,
            Premier: PremierAmount,
            Edabah: EdabahAmount,
            "E-besa": eBesaAmount,
            Others: OthersAmount,
            Credit: CreditAmount,
            Promotion: PromotionAmount,
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
                marchent: savedTransaction.marchent,
                Premier: savedTransaction.Premier,
                Edabah: savedTransaction.Edabah,
                "E-besa": savedTransaction["E-besa"],
                Others: savedTransaction.Others,
                Credit: savedTransaction.Credit,
                Promotion: savedTransaction.Promotion,
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
