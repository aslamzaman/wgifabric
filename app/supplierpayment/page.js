"use client";
import React, { useState, useEffect } from "react";
import Add from "@/components/supplierpayment/Add";
import Edit from "@/components/supplierpayment/Edit";
import Delete from "@/components/supplierpayment/Delete";
const date_format = dt => new Date(dt).toISOString().split('T')[0];
import { numberWithComma } from "@/lib/NumberWithComma";




const Supplierpayment = () => {
    const [supplierpayments, setSupplierpayments] = useState([]);
    const [msg, setMsg] = useState("Data ready");
    const [waitMsg, setWaitMsg] = useState("");
    const [totalRupee, setTotalRupee] = useState("0");
    const [totalTaka, setTotalTaka] = useState("0");


    useEffect(() => {
        const getData = async () => {
            setWaitMsg('Please Wait...');
            try {
                const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/supplierpayment`, {
                    method: "GET",
                    headers: { "Content-Type": "application/json" }
                });
                if (!response.ok) {
                    throw new Error("Failed to fetch data");
                }
                const data = await response.json();
                // console.log(data);
                setSupplierpayments(data);


                const totalRupee = data.reduce((t, c) => t + parseFloat(c.rupee), 0);
                const totalTaka = data.reduce((t, c) => t + parseFloat(c.taka), 0);
                setTotalRupee(totalRupee);
                setTotalTaka(totalTaka);

                setWaitMsg('');
            } catch (error) {
                console.error("Error fetching data:", error);
            }
        };
        getData();
    }, [msg]);


    const messageHandler = (data) => {
        setMsg(data);
    }


    return (
        <>
            <div className="w-full mb-3 mt-8">
                <h1 className="w-full text-xl lg:text-3xl font-bold text-center text-blue-700">Supplier Payment</h1>
                <p className="w-full text-center text-blue-300">&nbsp;{waitMsg}&nbsp;</p>
            </div>
            <div className="px-4 lg:px-6">
                <p className="w-full text-sm text-red-700">{msg}</p>
                <div className="p-2 overflow-auto">
                    <table className="w-full border border-gray-200">
                        <thead>
                            <tr className="w-full bg-gray-200">
                                <th className="text-center border-b border-gray-200 px-4 py-2">Date</th>
                                <th className="text-center border-b border-gray-200 px-4 py-2">Supplier</th>
                                <th className="text-center border-b border-gray-200 px-4 py-2">Rupee</th>
                                <th className="text-center border-b border-gray-200 px-4 py-2">Taka</th>
                                <th className="w-[100px] font-normal">
                                    <div className="w-full flex justify-end py-0.5 pr-4">
                                        <Add message={messageHandler} />
                                    </div>
                                </th>
                            </tr>
                        </thead>
                        <tbody>
                            {supplierpayments.length ? (
                                supplierpayments.map(supplierpayment => (
                                    <tr className="border-b border-gray-200 hover:bg-gray-100" key={supplierpayment._id}>
                                        <td className="text-center py-2 px-4">{date_format(supplierpayment.dt)}</td>
                                        <td className="text-center py-2 px-4">{supplierpayment.supplierId.name}</td>
                                        <td className="text-center py-2 px-4">{supplierpayment.rupee}</td>
                                        <td className="text-center py-2 px-4">{supplierpayment.taka}</td>
                                        <td className="h-8 flex justify-end items-center space-x-1 mt-1 mr-2">
                                            <Edit message={messageHandler} id={supplierpayment._id} data={supplierpayments} />
                                            <Delete message={messageHandler} id={supplierpayment._id} data={supplierpayments} />
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan={6} className="text-center py-10 px-4">
                                        Data not available.
                                    </td>
                                </tr>
                            )}
                             <tr className="border-b border-gray-200 hover:bg-gray-100 font-bold">
                                        <td className="text-center py-2 px-4">Total</td>
                                        <td className="text-center py-2 px-4"></td>
                                        <td className="text-center py-2 px-4">{totalRupee}</td>
                                        <td className="text-center py-2 px-4">{totalTaka}</td>
                                        <td className="h-8 flex justify-end items-center space-x-1 mt-1 mr-2">
                                        </td>
                                    </tr>
                        </tbody>
                    </table>
                </div>
            </div>
        </>
    );

};

export default Supplierpayment;


