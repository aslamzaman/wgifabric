    import { NextResponse } from 'next/server';
    import { Connect } from '@/lib/utils/Db';
    import { PurchaseModel } from '@/lib/Models';
        
   
    // Soft deleted
    export const PATCH = async (Request, { params }) => {
      try {
        await Connect();
        const { id } = params;
        const purchases = await PurchaseModel.findOneAndUpdate({_id: id, isDeleted: false},{isDeleted:true},{new:true});
        return NextResponse.json(purchases);
      } catch (err) {
        return NextResponse.json({ message: "GET Error", err }, { status: 500 });
      }
    } 


    // Update data
    export const PUT = async (Request,{ params }) => {
      try {
        await Connect();
        const {id} = params;
        const { dt, supplierId, billNo, bale, meter, rupee, taka } = await Request.json();
        const purchases = await PurchaseModel.findOneAndUpdate({ _id: id }, { dt, supplierId, billNo, bale, meter, rupee, taka });
        return NextResponse.json(purchases);
      } catch (err) {
        return NextResponse.json({ message: "PUT Error", err }, { status: 500 });
      }
    }
    
    
    // Hard deleted
    export const DELETE = async ( Request, { params }) => {
      try {
        await Connect();
        const {id} = params;
        const purchases = await PurchaseModel.findOneAndDelete({_id: id});
        return NextResponse.json(purchases);
      } catch (err) {
        return NextResponse.json({ message: "DELETE Error", err }, { status: 500 });
      }
    } 