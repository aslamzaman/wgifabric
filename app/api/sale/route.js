    import { NextResponse } from 'next/server';
    import { Connect } from '@/lib/utils/Db';
    import { SaleModel } from '@/lib/Models';
    
    
    export const GET = async () => {
      try {
        await Connect();
        const sales = await SaleModel.find({isDeleted: false}).populate('customerId').populate('supplierId').sort({_id:'desc'});
        return NextResponse.json( sales );
      } catch (error) {
        console.error('GET Error:', error);
        return NextResponse.json({ message: 'Failed to fetch sales' }, { status: 500 });
      }
    }
    
    
    
    export const POST = async (Request) => {
      try {
        await Connect();
        const { dt, customerId, supplierId, meter, taka } = await Request.json();
        const sales = await SaleModel.create({ dt, customerId, supplierId, meter, taka });
        return NextResponse.json(sales);
      } catch (err) {
        console.error(err);
        return NextResponse.json({ message: "POST Error", err }, { status: 500 });
      }
    }