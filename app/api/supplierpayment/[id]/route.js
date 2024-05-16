    import { NextResponse } from 'next/server';
    import { Connect } from '@/lib/utils/Db';
    import { SupplierpaymentModel } from '@/lib/Models';
        
   
    // Soft deleted
    export const PATCH = async (Request, { params }) => {
      try {
        await Connect();
        const { id } = params;
        const supplierpayments = await SupplierpaymentModel.findOneAndUpdate({_id: id, isDeleted: false},{isDeleted:true},{new:true});
        return NextResponse.json(supplierpayments);
      } catch (err) {
        return NextResponse.json({ message: "GET Error", err }, { status: 500 });
      }
    } 


    // Update data
    export const PUT = async (Request,{ params }) => {
      try {
        await Connect();
        const {id} = params;
        const { dt, supplierId, rupee, taka } = await Request.json();
        const supplierpayments = await SupplierpaymentModel.findOneAndUpdate({ _id: id }, { dt, supplierId, rupee, taka });
        return NextResponse.json(supplierpayments);
      } catch (err) {
        return NextResponse.json({ message: "PUT Error", err }, { status: 500 });
      }
    }
    
    
    // Hard deleted
    export const DELETE = async ( Request, { params }) => {
      try {
        await Connect();
        const {id} = params;
        const supplierpayments = await SupplierpaymentModel.findOneAndDelete({_id: id});
        return NextResponse.json(supplierpayments);
      } catch (err) {
        return NextResponse.json({ message: "DELETE Error", err }, { status: 500 });
      }
    } 