    import { NextResponse } from 'next/server';
    import { Connect } from '@/lib/utils/Db';
    import { PurchasebillModel } from '@/lib/Models';
    
    
    export const GET = async () => {
      try {
        await Connect();
        const purchasebills = await PurchasebillModel.find({isDeleted: false}).sort({_id:'desc'});
        return NextResponse.json( purchasebills );
      } catch (error) {
        console.error('GET Error:', error);
        return NextResponse.json({ message: 'Failed to fetch purchasebills' }, { status: 500 });
      }
    }
    
    
    
    export const POST = async (Request) => {
      try {
        await Connect();
        const { dt, shipment, bale, meter, weight,  taka } = await Request.json();
        const purchasebills = await PurchasebillModel.create({ dt, shipment, bale, meter, weight, taka });
        return NextResponse.json(purchasebills);
      } catch (err) {
        console.error(err);
        return NextResponse.json({ message: "POST Error", err }, { status: 500 });
      }
    }