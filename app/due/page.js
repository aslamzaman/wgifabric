"use client";
import React, { useState, useEffect } from "react";
import Add from "@/components/due/Add";
import Details from "@/components/due/Details";
import { GetRemoteData } from "@/lib/utils/GetRemoteData";
import { numberWithComma } from "@/lib/NumberWithComma";
import { jsPDF } from "jspdf";
const date_format = dt => new Date(dt).toISOString().split('T')[0];
import { inword } from "@/lib/Inword";
require("@/lib/fonts/Poppins-Bold-normal");
require("@/lib/fonts/Poppins-Regular-normal");




const Customer = () => {
    const [customers, setCustomers] = useState([]);
    const [msg, setMsg] = useState("Data ready");
    const [waitMsg, setWaitMsg] = useState("");

    const [dt1, setDt1] = useState("");
    const [dt2, setDt2] = useState("");

    const [sales, setSales] = useState([]);
    const [newDues, setNewDues] = useState([]);
    const [totalDue, setTotalDue] = useState('0');

    useEffect(() => {
        const loadData = async () => {
            setWaitMsg('Please Wait...');
            try {

                const [customers, sales, payments] = await Promise.all([
                    GetRemoteData('customer'),
                    GetRemoteData('sale'),
                    GetRemoteData('customerpayment')
                ]);

                //    console.log(customers, sales, payments);
                setSales(sales);

                const result = customers.map(customer => {
                    const matchingSale = sales.filter(sale => sale.customerId._id === customer._id);
                    const matchingPayment = payments.filter(payment => payment.customerId._id === customer._id);


                    const totalSale = matchingSale.reduce((t, c) => t + (parseFloat(c.meter) * parseFloat(c.taka)), 0);
                    const totalPayment = matchingPayment.reduce((t, c) => t + parseFloat(c.taka), 0);
                    const balance = totalSale - totalPayment;
                    const isDues = balance > 0 ? true : false;
                    return {
                        ...customer,
                        balance,
                        isDues,
                        matchingSale,
                        matchingPayment
                    };
                });
                const sortResult = result.sort((a, b) => parseInt(a.balance) < parseInt(b.balance) ? 1 : -1);
                console.log(sortResult);
                setCustomers(sortResult);
                setWaitMsg('');

                //---------------------------------------------------

                setNewDues(sortResult);
                const total = sortResult.reduce((t, c) => t + parseFloat(c.balance), 0);
                setTotalDue(total);


            } catch (error) {
                console.error("Error fetching data:", error);
                setMsg("Failed to fetch data");
            }
        };
        loadData();
        setDt1('2024-05-01');
        setDt2(date_format(new Date()));
    }, [msg]);




    const messageHandler = (data) => {
        setMsg(data);
    }


    const printHandler = (id) => {
        // console.log(customers, id)

        setWaitMsg('Please Wait...');
        setTimeout(() => {
            const customer = customers.find(customer => customer._id === id);

            // console.log(customer);

            const doc = new jsPDF({
                orientation: "p",
                unit: "mm",
                format: "a4",
                putOnlyUsedFonts: true,
                floatPrecision: 16
            });
            doc.setFont("Poppins-Regular", "normal");
            doc.setFontSize(10);
            doc.text(`${customer.name}`, 12, 20, null, null, "left");
            doc.text(`${customer.address}`, 12, 25, null, null, "left");
            doc.text(`${customer.contact}`, 12, 30, null, null, "left");
            doc.text(`Date: ${date_format(new Date())}`, 198, 35, null, null, "right");
            doc.setFont("Poppins-Bold", "bold");
            doc.text("Sales Information", 12, 37, null, null, "left");
            doc.text("Date", 25, 43, null, null, "center");
            doc.text("Shipment", 50, 43, null, null, "center");
            doc.text("Bale & Meter", 89, 43, null, null, "center");
            doc.text("Description", 146, 43, null, null, "center");
            doc.text("Amount", 196, 43, null, null, "right");
            doc.line(12, 39, 198, 39);
            doc.line(12, 45, 198, 45);
            doc.setFont("Poppins-Regular", "normal");
            doc.setFontSize(10);
            let y = 49;
            let gt = 0;
            let totalKgs = 0;
            let totalMeter = 0;
            let totalBale = 0;
            let itemTimes = 0;
            const sale = customer.matchingSale;
            for (let i = 0; i < sale.length; i++) {
                let subTotal = parseFloat(sale[i].weight) * parseFloat(sale[i].rate);
                doc.text(`${date_format(sale[i].dt)}`, 25, y, null, null, "center");
                doc.text(`${sale[i].shipment}`, 50, y, null, null, "center");
                doc.text(`${sale[i].bale}bale;${sale[i].meter}mtr.`, 89, y, null, null, "center");
                doc.text(`${sale[i].weight} @ ${sale[i].rate}`, 146, y, null, null, "center");
                doc.text(`${numberWithComma(subTotal)}`, 196, y, null, null, "right");
                gt = gt + subTotal;
                totalKgs = totalKgs + parseFloat(sale[i].weight);
                totalMeter = totalMeter + parseFloat(sale[i].meter);
                totalBale = totalBale + parseFloat(sale[i].bale);
                itemTimes = i + 1;
                y = y + 5;
            }
            doc.setFont("Poppins-Bold", "bold");
            doc.line(12, y - 3, 198, y - 3);
            doc.text(`Total (${totalKgs}kgs at ${itemTimes} Times); [Total: Bale= ${totalBale}; Meter=${totalMeter}]`, 14, y + 1, null, null, "left");
            doc.text(`${numberWithComma(gt)}`, 196, y + 1, null, null, "right");
            doc.line(12, y + 2.5, 198, y + 2.5);


            doc.line(12, 39, 12, y + 2.5);
            doc.line(198, 39, 198, y + 2.5);

            // -------------------------------------------------------------

            let z = y + 10;
            doc.setFont("Poppins-Bold", "bold");
            doc.text("Payments Information", 12, z, null, null, "left");
            doc.line(12, z + 1, 198, z + 1);
            doc.text("Date", 30, z + 5, null, null, "center");
            doc.text("Cash Type", 90, z + 5, null, null, "center");
            doc.text("Amount", 196, z + 5, null, null, "right");
            doc.line(12, z + 6.5, 198, z + 6.5);

            doc.setFont("Poppins-Regular", "normal");
            let n = z + 11;
            let paymentTotal = 0;
            let paymentTimes = 0;
            const payment = customer.matchingPayment;
            for (let i = 0; i < payment.length; i++) {
                doc.text(`${date_format(payment[i].dt)}`, 30, n, null, null, "center");
                doc.text(`${payment[i].cashtypeId.name}`, 90, n, null, null, "center");
                doc.text(`${payment[i].taka}`, 196, n, null, null, "right");
                paymentTotal = paymentTotal + parseFloat(payment[i].taka);
                paymentTimes = i + 1;
                n = n + 5;
            }
            doc.setFont("Poppins-Bold", "bold");
            doc.line(12, n - 3, 198, n - 3);
            doc.text(`Total (${paymentTimes} Times)`, 14, n + 1, null, null, "left");
            doc.text(`${numberWithComma(paymentTotal)}`, 196, n + 1, null, null, "right");
            doc.line(12, n + 2.5, 198, n + 2.5);

            doc.line(12, z + 1, 12, n + 2.5);
            doc.line(198, z + 1, 198, n + 2.5);


            doc.line(12, n + 10, 198, n + 10);
            doc.setFont("Poppins-Bold", "bold");
            doc.text(`Total Payable: (${gt} - ${paymentTotal}) = `, 14, n + 14, null, null, "left");

            doc.text(`${numberWithComma(parseFloat(customer.balance))}`, 196, n + 14, null, null, "right");
            doc.line(12, n + 16, 198, n + 16);

            doc.line(12, n + 10, 12, n + 16);
            doc.line(198, n + 10, 198, n + 16);

            doc.setFont("Poppins-Regular", "normal");
            doc.text(`INWORD: ${inword(customer.balance).toUpperCase()}`, 12, n + 21, null, null, "left");

            /*



            //------------------------------------------------------------------------------------------------

            z = z + 8;
            doc.setFont("Poppins-Bold", "bold");
            doc.text("Payment Information", 12, z + 2, null, null, "left");
            doc.text("Date", 25, z + 8, null, null, "center");
            doc.text("Payment Type", 91, z + 8, null, null, "center");
            doc.text("Amount", 196, z + 8, null, null, "right");
            doc.line(12, z + 4, 198, z + 4);
            doc.line(12, z + 10, 198, z + 10);
            doc.setFont("Poppins-Regular", "normal");
            doc.setFontSize(8);

            let n = z + 14;
            let pgt = 0;
            const payment = customer.matchingPayments;
            for (let i = 0; i < payment.length; i++) {
                doc.text(`${date_format(payment[i].dt)}`, 25, n, null, null, "center");
                doc.text(`${payment[i].cashtypeId.name}`, 91, n, null, null, "center");
                doc.text(`${payment[i].taka}`, 196, n, null, null, "center");

                pgt = pgt + parseFloat(payment[i].taka);
                n = n + 4;
            }


            doc.setFont("Poppins-Bold", "bold");
            doc.line(12, n - 3, 198, n - 3);
            doc.text('Total', 25, n - 0.5, null, null, "right");
            doc.text(`${numberWithComma(pgt)}`, 196, n - 0.5, null, null, "right");


            //------------------------------------------------------------------------------------------------

            let p = n + 8;
            doc.text(`Balance: (${numberWithComma(dgt)} - ${numberWithComma(pgt)}) = ${numberWithComma(dgt - pgt)}/-`, 12, p + 2, null, null, "left");
*/
            doc.save(`Customer_Details_Created_${date_format(new Date())}.pdf`);
            setWaitMsg('');
        }, 0);




    }



    const searchClickHandler = () => {
        const d1 = new Date(dt1);
        const d2 = new Date(dt2);

        // search customer in date ranges
        const searchSale = sales.filter(sale => {
            const dataDate = new Date(sale.dt);
            return dataDate >= d1 && dataDate <= d2;
        })

        const result = newDues.filter(due => searchSale.some(sale => sale.customerId._id === due._id));
        console.log(result);
        setCustomers(result);
        const total = result.reduce((t, c) => t + parseFloat(c.balance), 0);
        setTotalDue(total);

    }

    const refreshClickHandler = () => {
        setCustomers(newDues);
        const total = newDues.reduce((t, c) => t + parseFloat(c.balance), 0);
        setTotalDue(total);
    }



    return (
        <>
            <div className="w-full mb-3 mt-8">
                <h1 className="w-full text-xl lg:text-3xl font-bold text-center text-blue-700">Customer Dues</h1>
                <h1 className="w-full text-xl lg:text-2xl font-bold text-center text-gray-400">Total = {numberWithComma(parseFloat(totalDue))}/-</h1>
                <p className="w-full text-center text-blue-300">&nbsp;{waitMsg}&nbsp;</p>
            </div>

            <div className="px-4 lg:px-6 overflow-auto">
                <p className="w-full text-sm text-red-700">{msg}</p>
                <div className="flex justify-end items-center space-x-2 mb-2">
                    <input onChange={e => setDt1(e.target.value)} value={dt1} type="date" id='dt1' name="dt1" required className="w-[155px] px-4 py-1.5 text-gray-600 ring-1 focus:ring-4 ring-blue-300 outline-none rounded duration-300" />
                    <span>To</span>
                    <input onChange={e => setDt2(e.target.value)} value={dt2} type="date" id='dt2' name="dt2" required className="w-[155px] px-4 py-1.5 text-gray-600 ring-1 focus:ring-4 ring-blue-300 outline-none rounded duration-300" />
                    <button onClick={searchClickHandler} className="text-center mx-0.5 px-4 py-2 bg-green-600 hover:bg-green-800 text-white font-semibold rounded-md focus:ring-1 ring-blue-200 ring-offset-2 duration-300  cursor-pointer">Search</button>
                    <button onClick={refreshClickHandler} className="text-center mx-0.5 px-4 py-2 bg-violet-600 hover:bg-violet-800 text-white font-semibold rounded-md focus:ring-1 ring-blue-200 ring-offset-2 duration-300  cursor-pointer">Refresh</button>
                </div>
                <table className="w-full border border-gray-200">
                    <thead>
                        <tr className="w-full bg-gray-200">
                            <th className="text-start border-b border-gray-200 px-4 py-2">Name</th>
                            <th className="text-center border-b border-gray-200 px-4 py-2">Dues</th>
                            <th>

                            </th>
                        </tr>
                    </thead>
                    <tbody>
                        {customers.length ? (
                            customers.map(customer => (
                                <tr className={`border-b border-gray-200 hover:bg-gray-100 ${customer.isDues ? 'text-black' : 'text-blue-500'}`} key={customer._id}>
                                    <td className="text-start py-2 px-4">
                                        <span className="font-bold"> {customer.name}</span><br />
                                        {customer.address}<br />
                                        {customer.contact}
                                    </td>
                                    <td className="text-center py-2 px-4">{numberWithComma(parseFloat(customer.balance))}/-</td>
                                    <td className="text-end py-2 px-4">
                                        <div className="flex justify-end space-x-3">
                                            <Add message={messageHandler} id={customer._id} />
                                            <Details message={messageHandler} id={customer._id} data={customers} />
                                        </div>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan={4} className="text-center py-10 px-4">
                                    Data not available.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </>
    );

};

export default Customer;


