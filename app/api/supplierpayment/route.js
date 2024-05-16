    import { NextResponse } from 'next/server';
    import { Connect } from '@/lib/utils/Db';
    import { SupplierpaymentModel } from '@/lib/Models';
    
    
    export const GET = async () => {
      try {
        await Connect();
        const supplierpayments = await SupplierpaymentModel.find({isDeleted: false}).populate('supplierId').sort({_id:'desc'});
        return NextResponse.json( supplierpayments );
      } catch (error) {
        console.error('GET Error:', error);
        return NextResponse.json({ message: 'Failed to fetch supplierpayments' }, { status: 500 });
      }
    }
    
    
    
    export const POST = async (Request) => {
      try {
        await Connect();
        const { dt, supplierId, rupee, taka } = await Request.json();
        const supplierpayments = await SupplierpaymentModel.create({ dt, supplierId, rupee, taka });
        return NextResponse.json(supplierpayments);
      } catch (err) {
        console.error(err);
        return NextResponse.json({ message: "POST Error", err }, { status: 500 });
      }
    }