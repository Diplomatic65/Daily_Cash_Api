const Reception = require('../models/receptionModel'); 
const { receptionSchema } = require('../middlewares/validator');


exports.createReception = async (req, res) => {
    let {name, merchant, Evc, premier, edahab,  others, credit, deposit, refund, discount} = req.body;
    let eBesa = req.body["e-besa"]; // "-" destructuring ma oggola

    try {
        const { error } = receptionSchema.validate({
            name,
            merchant, Evc, premier, edahab, "e-besa": eBesa, others, credit, deposit, refund, discount
        });

        if (error) {
            return res.status(401).json({ success: false, message: error.details[0].message });
        }

        // Parse to numbers
        const parseAmount = (val) => typeof val === 'string' ? parseFloat(val.replace('$', '')) : val;

        const name = typeof name === 'string' ? name.trim() : "Unknown Reception";

        const merchantAmount = parseAmount(merchant);
        const EvcAmount = parseAmount(Evc);
        const premierAmount = parseAmount(premier);
        const edahabAmount = parseAmount(edahab);
        const eBesaAmount = parseAmount(eBesa);
        const othersAmount = parseAmount(others);
        const creditAmount = parseAmount(credit);
        const depositAmount = parseAmount(deposit);
        const refundAmount = parseAmount(refund);
        const discountAmount = parseAmount(discount);

        const totalAmount = merchantAmount + premierAmount + edahabAmount + eBesaAmount + othersAmount + creditAmount + depositAmount + refundAmount + discountAmount;

        const newReception = new Reception({
            name,
            merchant: merchantAmount,
            premier: premierAmount,
            edahab: edahabAmount,
            "e-besa": eBesaAmount,
            others: othersAmount,
            credit: creditAmount,
            deposit: depositAmount,
            refund: refundAmount,
            discount: discountAmount
        });

        const savedReception = await newReception.save();

        // Format times
        const formatDate = (d, locale) => new Intl.DateTimeFormat(locale, {
            timeZone: 'Africa/Mogadishu'
        }).format(d);

        const formatTime = (d) => new Intl.DateTimeFormat('en-GB', {
            timeZone: 'Africa/Mogadishu',
            hour: '2-digit', minute: '2-digit', second: '2-digit',
            hour12: false
        }).format(d);

        const createdAtObj = new Date(savedReception.createdAt);
        const updatedAtObj = new Date(savedReception.updatedAt);

        res.status(201).json({
            success: true,
            message: "Reception has been created",
            result: {
                _id: savedReception._id,
                merchant: savedReception.merchant,
                Evc: savedReception.Evc,
                premier: savedReception.premier,
                edahab: savedReception.edahab,
                "e-besa": savedReception["e-besa"],
                others: savedReception.others,
                credit: savedReception.credit,
                deposit: savedReception.deposit,
                refund: savedReception.refund,
                discount: savedReception.discount,
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