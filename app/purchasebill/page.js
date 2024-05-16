"use client";
import React, { useState, useEffect } from "react";
import Add from "@/components/purchasebill/Add";
import Edit from "@/components/purchasebill/Edit";
import Delete from "@/components/purchasebill/Delete";
const date_format = dt => new Date(dt).toISOString().split('T')[0];
import { numberWithComma } from "@/lib/NumberWithComma";



const Purchasebill = () => {
    const [purchasebills, setPurchasebills] = useState([]);
    const [msg, setMsg] = useState("Data ready");
    const [waitMsg, setWaitMsg] = useState("");
    const [total, setTotal] = useState("0");

    useEffect(() => {
        const getData = async () => {
            setWaitMsg('Please Wait...');
            try {
                const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/purchasebill`, {
                    method: "GET",
                    headers: { "Content-Type": "application/json" }
                });
                if (!response.ok) {
                    throw new Error("Failed to fetch data");
                }
                const data = await response.json();
                // console.log(data);
                setPurchasebills(data);
                const totalTaka = data.reduce((t, c) => t + (parseFloat(c.weight) * parseFloat(c.taka)), 0);
                setTotal(totalTaka);

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
                <h1 className="w-full text-xl lg:text-3xl font-bold text-center text-blue-700">Import Bill</h1>
                <p className="w-full text-center text-blue-300">&nbsp;{waitMsg}&nbsp;</p>
            </div>
            <div className="px-4 lg:px-6">
                <p className="w-full text-sm text-red-700">{msg}</p>
                <div className="p-2 overflow-auto">
                    <table className="w-full border border-gray-200">
                        <thead>
                            <tr className="w-full bg-gray-200">
                                <th className="text-center border-b border-gray-200 px-4 py-2">Date</th>
                                <th className="text-center border-b border-gray-200 px-4 py-2">Shipment</th>
                                <th className="text-center border-b border-gray-200 px-4 py-2">Bale</th>
                                <th className="text-center border-b border-gray-200 px-4 py-2">Meter</th>
                                <th className="text-center border-b border-gray-200 px-4 py-2">Weight</th>
                                <th className="text-center border-b border-gray-200 px-4 py-2">Rate</th>
                                <th className="text-center border-b border-gray-200 px-4 py-2">Total</th>
                                <th className="w-[100px] font-normal">
                                    <div className="w-full flex justify-end py-0.5 pr-4">
                                        <Add message={messageHandler} />
                                    </div>
                                </th>
                            </tr>
                        </thead>
                        <tbody>
                            {purchasebills.length ? (
                                purchasebills.map(purchasebill => (
                                    <tr className="border-b border-gray-200 hover:bg-gray-100" key={purchasebill._id}>
                                        <td className="text-center py-2 px-4">{date_format(purchasebill.dt)}</td>
                                        <td className="text-center py-2 px-4">{purchasebill.shipment}</td>
                                        <td className="text-center py-2 px-4">{purchasebill.bale}</td>
                                        <td className="text-center py-2 px-4">{purchasebill.meter}</td>
                                        <td className="text-center py-2 px-4">{purchasebill.weight}</td>
                                        <td className="text-center py-2 px-4">{purchasebill.taka}</td>
                                        <td className="text-center py-2 px-4">{parseFloat(purchasebill.taka)*parseFloat(purchasebill.weight)}</td>
                                        <td className="h-8 flex justify-end items-center space-x-1 mt-1 mr-2">
                                            <Edit message={messageHandler} id={purchasebill._id} data={purchasebills} />
                                            <Delete message={messageHandler} id={purchasebill._id} data={purchasebills} />
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan={9} className="text-center py-10 px-4">
                                        Data not available.
                                    </td>
                                </tr>
                            )}
                             <tr className="border-b border-gray-200 hover:bg-gray-100 font-bold">
                                        <td className="text-center py-2 px-4">Total</td>
                                        <td className="text-center py-2 px-4"></td>
                                        <td className="text-center py-2 px-4"></td>
                                        <td className="text-center py-2 px-4"></td>
                                        <td className="text-center py-2 px-4"></td>
                                        <td className="text-center py-2 px-4"></td>
                                        <td className="text-center py-2 px-4">{total}</td>
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

export default Purchasebill;


