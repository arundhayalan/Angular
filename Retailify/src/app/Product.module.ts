// product.model.ts
export interface Product {
    id:number;
    imageUrl: string;
    name: string;
    model: string;
    price: number;
    inCart: boolean;
    category: string;
    
  }