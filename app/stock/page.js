"use client";
import React, { useState, useEffect } from "react";
import { GetRemoteData } from "@/lib/utils/GetRemoteData";
import { numberWithComma } from "@/lib/NumberWithComma";
import Purchase from "../purchase/page";
const date_format = dt => new Date(dt).toISOString().split('T')[0];






const Stock = () => {
    const [waitMsg, setWaitMsg] = useState("");
    const [suppliers, setSuppliers] = useState([]);

    useEffect(() => {
        const loadData = async () => {
            setWaitMsg('Please Wait...');
            try {
                const [responseSupplier, responsePurchase, responseSale] = await Promise.all([
                    
                    GetRemoteData('supplier'),
                    GetRemoteData('purchase'),
                    GetRemoteData('sale')
                ]);

                console.log(responseSupplier, responsePurchase, responseSale);
                
                const result = responseSupplier.map(supplier=>{
                    const matchingPurchase = responsePurchase.filter(purchase=>purchase.supplierId._id === supplier._id);
                    const matchingSale = responseSale.filter(sale=>sale.supplierId._id === supplier._id);
                    const totalPruschase = matchingPurchase.reduce((t, c) => t + parseFloat(c.meter), 0);
                    const totalSale = matchingSale.reduce((t, c) => t + parseFloat(c.meter), 0);
                    const balance = totalPruschase - totalSale;

                    return{
                        ...supplier,
                        balance
                    }
                })

                console.log(result);
                const sortData = result.sort((a,b)=> a.name.toUpperCase() < b.name.toUpperCase()?-1:1 );
                setSuppliers(sortData);
               // setSales(sales);
                setWaitMsg('');
            } catch (error) {
                console.error("Error fetching data:", error);
                setMsg("Failed to fetch data");
            }
        };
        loadData();
    }, []);




    const messageHandler = (data) => {
        setMsg(data);
    }

    return (
        <>
                <div className="w-full mb-3 mt-8">
                    <h1 className="w-full text-xl lg:text-3xl font-bold text-center text-blue-700">Supplier- Stock</h1>
                    <p className="w-full text-center text-blue-300">&nbsp;{waitMsg}&nbsp;</p>
                </div>    
                <div className="px-4 lg:px-6">
                    <div className="p-2 overflow-auto">  
                        <table className="w-full border border-gray-200">
                            <thead>
                                <tr className="w-full bg-gray-200">                           
                                      <th className="text-center border-b border-gray-200 px-4 py-2">SL</th>
                                      <th className="text-center border-b border-gray-200 px-4 py-2">Name</th>
                                      <th className="text-center border-b border-gray-200 px-4 py-2">Address</th>
                                      <th className="text-center border-b border-gray-200 px-4 py-2">Balance</th>
                                   
                                </tr>
                            </thead>
                            <tbody>
                                {suppliers.length ?(
                                    suppliers.map((supplier, i) => (
                                        <tr className="border-b border-gray-200 hover:bg-gray-100" key={supplier._id}>                                           
                                              <td className="text-center py-2 px-4">{i+1}</td>
                                              <td className="text-center py-2 px-4">{supplier.name}</td>
                                              <td className="text-center py-2 px-4">{supplier.address}</td>
                                              <td className="text-center py-2 px-4">{supplier.balance}</td>
                                        </tr>
                                    ))
                                ): (
                                    <tr>
                                        <td colSpan={5} className="text-center py-10 px-4">
                                            Data not available.
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </>
    );

};

export default Stock;


