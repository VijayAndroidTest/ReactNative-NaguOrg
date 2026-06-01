// types.ts (at the root of your project)
export interface Product {
  id: string;
  name: string;
  image: string;
  MRP: number;
  DP: number;
  category: string;
  
  discount?: number;
}