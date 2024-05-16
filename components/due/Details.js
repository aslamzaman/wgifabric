import React, { useState } from "react";
const date_format = dt => new Date(dt).toISOString().split('T')[0];
import { numberWithComma } from "@/lib/NumberWithComma";
import { inword } from "@/lib/Inword";



const Details = ({ message, id, data }) => {
    const [customer, setCustomer] = useState([]);
    const [sales, setSales] = useState([]);
    const [payments, setPayments] = useState([]);
    const [balance, setBalance] = useState('0');





    const [show, setShow] = useState(false);
    const [totalSale, setTotalSale] = useState('0');
    const [totalPayment, setTotalPayment] = useState('0');




    const showDetailsForm = () => {
        const individualData = data.find(d => d._id === id);
        console.log(individualData);
        setCustomer(individualData);
        const saleData = individualData.matchingSale;
        const paymentData = individualData.matchingPayment;

        setSales(saleData);
        setPayments(paymentData);
        setBalance(individualData.balance);

        const totalSaleTaka = saleData.reduce((t, c) => t + (parseFloat(c.meter) * parseFloat(c.taka)), 0);
        const totalPaymentTaka = paymentData.reduce((t, c) => t + parseFloat(c.taka), 0);
        setTotalSale(totalSaleTaka);
        setTotalPayment(totalPaymentTaka);



        setShow(true);
    }


    const closeDetailsForm = () => {
        setShow(false);
    }




    return (
        <>
            {show && (
                <div className="fixed inset-0 py-16 bg-black bg-opacity-30 backdrop-blur-sm z-10 overflow-auto">
                    <div className="w-11/12 mx-auto mb-10 bg-white border-2 border-gray-300 rounded-md shadow-md duration-300">
                        <div className="px-6 md:px-6 py-2 flex justify-between items-center border-b border-gray-300">
                            <h1 className="text-xl font-bold text-blue-600">Outstanding Reposts</h1>
                            <button onClick={closeDetailsForm} className="w-8 h-8 p-0.5 bg-gray-50 hover:bg-gray-300 rounded-md transition duration-500">
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-full h-full stroke-black">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>

                        </div>

                        <div className="px-6 pb-6 text-black">

                            <div className="w-full grid grid-cols-1 lg:grid-cols-2 gap-y-4 lg:gap-x-4">
                                <div className="w-full border-2 p-4 shadow-md rounded-md">
                                    <div className="px-4 lg:px-6 overflow-auto">
                                        <h1 className="text-xl font-bold text-blue-600">Sale</h1>
                                        <table className="w-full border border-gray-200">
                                            <thead>
                                                <tr className="w-full bg-gray-200">
                                                    <th className="text-center border-b border-gray-200 px-4 py-2">SL</th>
                                                    <th className="text-center border-b border-gray-200 px-4 py-2">Date</th>
                                                    <th className="text-end border-b border-gray-200 px-4 py-2">Taka</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {
                                                    sales.length ? sales.map((sale, i) => {
                                                        return (
                                                            <tr className="border-b border-gray-200 hover:bg-gray-100" key={sale._id}>
                                                                <td className="text-center py-2 px-4">{i + 1}</td>
                                                                <td className="text-center py-2 px-4">{date_format(sale.dt)}</td>
                                                                <td className="text-end py-2 px-4">{numberWithComma(parseFloat(sale.meter) * parseFloat(sale.taka))}/-</td>
                                                            </tr>
                                                        )
                                                    })
                                                        : null
                                                }
                                                <tr className="font-bold border-b border-gray-200 hover:bg-gray-100">
                                                    <td colSpan="2" className="text-start py-2 px-4">Total</td>
                                                    <td className="text-end py-2 px-4">{numberWithComma(parseFloat(totalSale))}/-</td>
                                                </tr>
                                            </tbody>
                                        </table>
                                    </div>
                                </div>
                                <div className="w-full border-2 p-4 shadow-md rounded-md">
                                    <div className="px-4 lg:px-6 overflow-auto">
                                        <h1 className="text-xl font-bold text-blue-600">Payments</h1>
                                        <table className="w-full border border-gray-200">
                                            <thead>
                                                <tr className="w-full bg-gray-200">
                                                    <th className="text-center border-b border-gray-200 px-4 py-2">SL</th>
                                                    <th className="text-center border-b border-gray-200 px-4 py-2">Date</th>
                                                    <th className="text-end border-b border-gray-200 px-4 py-2">Taka</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {
                                                    payments.length ? payments.map((payment, i) => {
                                                        return (
                                                            <tr className="border-b border-gray-200 hover:bg-gray-100" key={payment._id}>
                                                                <td className="text-center py-2 px-4">{i + 1}</td>
                                                                <td className="text-center py-2 px-4">{date_format(payment.dt)}</td>
                                                                <td className="text-end py-2 px-4">{numberWithComma(parseFloat(payment.taka))}/-</td>
                                                            </tr>
                                                        )
                                                    })
                                                        : null
                                                }
                                                <tr className="font-bold border-b border-gray-200 hover:bg-gray-100">
                                                    <td colSpan="2" className="text-start py-2 px-4">Total</td>
                                                    <td className="text-end py-2 px-4">{numberWithComma(parseFloat(totalPayment))}/-</td>
                                                </tr>
                                            </tbody>
                                        </table>
                                    </div>
                                </div>
                            </div>

                            <div className="w-full border-2 mt-4 p-4 shadow-md rounded-md">
                                <h1 className="text-start font-bold text-blue-600">Dues/Balance: ({numberWithComma(parseFloat(totalSale))} - {numberWithComma(parseFloat(totalPayment))}) = {numberWithComma(parseFloat(balance))}/-</h1>
                            </div>

                        </div>


                    </div >
                </div >
            )}
            <button onClick={showDetailsForm} title="Delete" className="px-1 rounded-md transition duration-500">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" className="w-6 h-7 stroke-black hover:stroke-gray-400">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 6.75h12M8.25 12h12m-12 5.25h12M3.75 6.75h.007v.008H3.75V6.75zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zM3.75 12h.007v.008H3.75V12zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm-.375 5.25h.007v.008H3.75v-.008zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z" />
                </svg>
            </button>
        </>
    )
}
export default Details;


