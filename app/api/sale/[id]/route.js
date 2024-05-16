    import { NextResponse } from 'next/server';
    import { Connect } from '@/lib/utils/Db';
    import { SaleModel } from '@/lib/Models';
        
   
    // Soft deleted
    export const PATCH = async (Request, { params }) => {
      try {
        await Connect();
        const { id } = params;
        const sales = await SaleModel.findOneAndUpdate({_id: id, isDeleted: false},{isDeleted:true},{new:true});
        return NextResponse.json(sales);
      } catch (err) {
        return NextResponse.json({ message: "GET Error", err }, { status: 500 });
      }
    } 


    // Update data
    export const PUT = async (Request,{ params }) => {
      try {
        await Connect();
        const {id} = params;
        const { dt, customerId, supplierId, meter, taka } = await Request.json();
        const sales = await SaleModel.findOneAndUpdate({ _id: id }, { dt, customerId, supplierId, meter, taka });
        return NextResponse.json(sales);
      } catch (err) {
        return NextResponse.json({ message: "PUT Error", err }, { status: 500 });
      }
    }
    
    
    // Hard deleted
    export const DELETE = async ( Request, { params }) => {
      try {
        await Connect();
        const {id} = params;
        const sales = await SaleModel.findOneAndDelete({_id: id});
        return NextResponse.json(sales);
      } catch (err) {
        return NextResponse.json({ message: "DELETE Error", err }, { status: 500 });
      }
    } 