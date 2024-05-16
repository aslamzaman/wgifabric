import mongoose, { Schema } from "mongoose";



    const CustomerSchema = new Schema(
        {
            name: { type: String, required: true },
            address: { type: String, required: true },
            contact: { type: String, required: true },
            isDeleted: { type: Boolean, default: false }      
        },
        {
            timestamps: true
        }
    );
    
    export const CustomerModel = mongoose.models.Customer || mongoose.model("Customer", CustomerSchema);  
//-----------------------------------------------------------------------

 const SupplierSchema = new Schema(
        {
            name: { type: String, required: true },
            address: { type: String, required: true },
            contact: { type: String, required: true },
            isDeleted: { type: Boolean, default: false }      
        },
        {
            timestamps: true
			}
    );
    
    export const SupplierModel = mongoose.models.Supplier || mongoose.model("Supplier", SupplierSchema);  
//-----------------------------------------------------------------------

const PurchaseSchema = new Schema(
        {
            dt: { type: Date, required: true },
            supplierId: { type: Schema.Types.ObjectId, ref: 'Supplier' },
            billNo: { type: String, required: true },
            bale: { type: Number, required: true },
            meter: { type: Number, required: true },
            rupee: { type: Number, required: true },
            taka: { type: Number, required: true },
            isDeleted: { type: Boolean, default: false }      
        },
        {
            timestamps: true
        }
    );
    
    export const PurchaseModel = mongoose.models.Purchase || mongoose.model("Purchase", PurchaseSchema);  
//-----------------------------------------------------------------------
const SaleSchema = new Schema(
        {
            dt: { type: Date, required: true },
            customerId: { type: Schema.Types.ObjectId, ref: 'Customer' },
            supplierId: { type: Schema.Types.ObjectId, ref: 'Supplier' },
            meter: { type: Number, required: true },
            taka: { type: Number, required: true },
            isDeleted: { type: Boolean, default: false }      
        },
        {
            timestamps: true
        }
    );
    
    export const SaleModel = mongoose.models.Sale || mongoose.model("Sale", SaleSchema);  
    
//-----------------------------------------------------------------------
const CustomerpaymentSchema = new Schema(
        {
            dt: { type: Date, required: true },
            customerId: { type: Schema.Types.ObjectId, ref: 'Customer'  },
            cashtypeId: { type: Schema.Types.ObjectId, ref: 'Cashtype'  },
            taka: { type: Number, required: true },
            isDeleted: { type: Boolean, default: false }      
        },
        {
            timestamps: true
        }
    );
    
    export const CustomerpaymentModel = mongoose.models.Customerpayment || mongoose.model("Customerpayment", CustomerpaymentSchema);  


//-----------------------------------------------------------------------
 
const SupplierpaymentSchema = new Schema(
        {
            dt: { type: Date, required: true },
            supplierId: { type: Schema.Types.ObjectId, ref: 'Supplier' },
            rupee: { type: Number, required: true },
            taka: { type: Number, required: true },
            isDeleted: { type: Boolean, default: false }      
        },
        {
            timestamps: true
        }
    );
    
    export const SupplierpaymentModel = mongoose.models.Supplierpayment || mongoose.model("Supplierpayment", SupplierpaymentSchema);  

//-----------------------------------------------------------------------
const PurchasebillSchema = new Schema(
        {
            dt: { type: Date, required: true },
            shipment: { type: String, required: true },
            bale: { type: Number, required: true },
            meter: { type: Number, required: true },
            weight: { type: Number, required: true },
            taka: { type: Number, required: true },
            isDeleted: { type: Boolean, default: false }      
        },
        {
            timestamps: true
        }
    );
    
    export const PurchasebillModel = mongoose.models.Purchasebill || mongoose.model("Purchasebill", PurchasebillSchema);  
    


//-----------------------------------------------------------------------
const CashtypeSchema = new Schema(
	{
            name: { type: String, required: true },
            isDeleted: { type: Boolean, default: false }      
        },
        {
            timestamps: true
        }
    );
    
    export const CashtypeModel = mongoose.models.Cashtype || mongoose.model("Cashtype", CashtypeSchema);  
    

//-----------------------------------------------------------------------

const UserSchema = new Schema(
    {
        user_name: String,
        pw: String
    },
    {
        timestamps: true
    }
);

export const UserModel = mongoose.models.User || mongoose.model("User", UserSchema);

