    import { NextResponse } from 'next/server';
    import { Connect } from '@/lib/utils/Db';
    import { CustomerpaymentModel } from '@/lib/Models';
    
    
    export const GET = async () => {
      try {
        await Connect();
        const customerpayments = await CustomerpaymentModel.find({isDeleted: false}).populate('customerId').populate('cashtypeId').sort({_id:'desc'});
        return NextResponse.json( customerpayments );
      } catch (error) {
        console.error('GET Error:', error);
        return NextResponse.json({ message: 'Failed to fetch customerpayments' }, { status: 500 });
      }
    }
    
    
    
    export const POST = async (Request) => {
      try {
        await Connect();
        const { dt, customerId, cashtypeId, taka } = await Request.json();
        const customerpayments = await CustomerpaymentModel.create({ dt, customerId, cashtypeId, taka });
        return NextResponse.json(customerpayments);
      } catch (err) {
        console.error(err);
        return NextResponse.json({ message: "POST Error", err }, { status: 500 });
      }
    }