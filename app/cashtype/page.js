    "use client";
    import React, { useState, useEffect } from "react";
    import Add from "@/components/cashtype/Add";
    import Edit from "@/components/cashtype/Edit";    
    import Delete from "@/components/cashtype/Delete";


    const Cashtype = () => {
        const [cashtypes, setCashtypes] = useState([]);
        const [msg, setMsg] = useState("Data ready");
        const [waitMsg, setWaitMsg] = useState("");
    

        useEffect(() => {
            const getData = async () => {
                setWaitMsg('Please Wait...');
                try {
                    const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/cashtype`, {
                        method: "GET",
                        headers: { "Content-Type": "application/json" }
                    });
                    if (!response.ok) {
                        throw new Error("Failed to fetch data");
                    }
                    const data = await response.json();
                    // console.log(data);
                    setCashtypes(data);
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
                    <h1 className="w-full text-xl lg:text-3xl font-bold text-center text-blue-700">Cashtype</h1>
                    <p className="w-full text-center text-blue-300">&nbsp;{waitMsg}&nbsp;</p>
                </div>    
                <div className="px-4 lg:px-6">
                    <p className="w-full text-sm text-red-700">{msg}</p>  
                    <div className="p-2 overflow-auto">  
                        <table className="w-full border border-gray-200">
                            <thead>
                                <tr className="w-full bg-gray-200">                           
                                      <th className="text-center border-b border-gray-200 px-4 py-2">Name</th>
                                    <th className="w-[100px] font-normal">
                                        <div className="w-full flex justify-end py-0.5 pr-4">
                                            <Add message={messageHandler} />
                                        </div>
                                    </th>
                                </tr>
                            </thead>
                            <tbody>
                                {cashtypes.length ?(
                                    cashtypes.map(cashtype => (
                                        <tr className="border-b border-gray-200 hover:bg-gray-100" key={cashtype._id}>                                           
                                              <td className="text-center py-2 px-4">{cashtype.name}</td>
                                            <td className="h-8 flex justify-end items-center space-x-1 mt-1 mr-2">
                                                <Edit message={messageHandler} id={cashtype._id} data={cashtypes} />
                                                <Delete message={messageHandler} id={cashtype._id} data={cashtypes} />
                                            </td>
                                        </tr>
                                    ))
                                ): (
                                    <tr>
                                        <td colSpan={3} className="text-center py-10 px-4">
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
    
    export default Cashtype;
    
  
    