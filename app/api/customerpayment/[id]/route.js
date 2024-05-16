    import { NextResponse } from 'next/server';
    import { Connect } from '@/lib/utils/Db';
    import { CustomerpaymentModel } from '@/lib/Models';
        
   
    // Soft deleted
    export const PATCH = async (Request, { params }) => {
      try {
        await Connect();
        const { id } = params;
        const customerpayments = await CustomerpaymentModel.findOneAndUpdate({_id: id, isDeleted: false},{isDeleted:true},{new:true});
        return NextResponse.json(customerpayments);
      } catch (err) {
        return NextResponse.json({ message: "GET Error", err }, { status: 500 });
      }
    } 


    // Update data
    export const PUT = async (Request,{ params }) => {
      try {
        await Connect();
        const {id} = params;
        const { dt, customerId, cashtypeId, taka } = await Request.json();
        const customerpayments = await CustomerpaymentModel.findOneAndUpdate({ _id: id }, { dt, customerId, cashtypeId, taka });
        return NextResponse.json(customerpayments);
      } catch (err) {
        return NextResponse.json({ message: "PUT Error", err }, { status: 500 });
      }
    }
    
    
    // Hard deleted
    export const DELETE = async ( Request, { params }) => {
      try {
        await Connect();
        const {id} = params;
        const customerpayments = await CustomerpaymentModel.findOneAndDelete({_id: id});
        return NextResponse.json(customerpayments);
      } catch (err) {
        return NextResponse.json({ message: "DELETE Error", err }, { status: 500 });
      }
    } 