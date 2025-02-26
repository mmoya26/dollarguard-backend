import { Category } from "./category";

export interface Expense {
    id?: string,
    userId: string,
    category: Category,
    amount: number,
    date: Date,
    notes?: string    
}
