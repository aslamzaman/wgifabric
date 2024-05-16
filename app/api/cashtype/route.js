    import { NextResponse } from 'next/server';
    import { Connect } from '@/lib/utils/Db';
    import { CashtypeModel } from '@/lib/Models';
    
    
    export const GET = async () => {
      try {
        await Connect();
        const cashtypes = await CashtypeModel.find({isDeleted: false}).sort({_id:'desc'});
        return NextResponse.json( cashtypes );
      } catch (error) {
        console.error('GET Error:', error);
        return NextResponse.json({ message: 'Failed to fetch cashtypes' }, { status: 500 });
      }
    }
    
    
    
    export const POST = async (Request) => {
      try {
        await Connect();
        const { name } = await Request.json();
        const cashtypes = await CashtypeModel.create({ name });
        return NextResponse.json(cashtypes);
      } catch (err) {
        console.error(err);
        return NextResponse.json({ message: "POST Error", err }, { status: 500 });
      }
    }