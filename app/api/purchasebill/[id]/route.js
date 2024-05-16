    import { NextResponse } from 'next/server';
    import { Connect } from '@/lib/utils/Db';
    import { PurchasebillModel } from '@/lib/Models';
        
   
    // Soft deleted
    export const PATCH = async (Request, { params }) => {
      try {
        await Connect();
        const { id } = params;
        const purchasebills = await PurchasebillModel.findOneAndUpdate({_id: id, isDeleted: false},{isDeleted:true},{new:true});
        return NextResponse.json(purchasebills);
      } catch (err) {
        return NextResponse.json({ message: "GET Error", err }, { status: 500 });
      }
    } 


    // Update data
    export const PUT = async (Request,{ params }) => {
      try {
        await Connect();
        const {id} = params;
        const { dt, shipment, bale, meter, weight, taka } = await Request.json();
        const purchasebills = await PurchasebillModel.findOneAndUpdate({ _id: id }, { dt, shipment, bale, meter, weight, taka });
        return NextResponse.json(purchasebills);
      } catch (err) {
        return NextResponse.json({ message: "PUT Error", err }, { status: 500 });
      }
    }
    
    
    // Hard deleted
    export const DELETE = async ( Request, { params }) => {
      try {
        await Connect();
        const {id} = params;
        const purchasebills = await PurchasebillModel.findOneAndDelete({_id: id});
        return NextResponse.json(purchasebills);
      } catch (err) {
        return NextResponse.json({ message: "DELETE Error", err }, { status: 500 });
      }
    } 