    import { NextResponse } from 'next/server';
    import { Connect } from '@/lib/utils/Db';
    import { PurchaseModel } from '@/lib/Models';
    
    
    export const GET = async () => {
      try {
        await Connect();
        const purchases = await PurchaseModel.find({isDeleted: false}).populate('supplierId').sort({_id:'desc'});
        return NextResponse.json( purchases );
      } catch (error) {
        console.error('GET Error:', error);
        return NextResponse.json({ message: 'Failed to fetch purchases' }, { status: 500 });
      }
    }
    
    
    
    export const POST = async (Request) => {
      try {
        await Connect();
        const { dt, supplierId, billNo, bale, meter, rupee, taka } = await Request.json();
        const purchases = await PurchaseModel.create({ dt, supplierId, billNo, bale, meter, rupee, taka });
        return NextResponse.json(purchases);
      } catch (err) {
        console.error(err);
        return NextResponse.json({ message: "POST Error", err }, { status: 500 });
      }
    }