import { Piece } from "./piece.model";
import { User } from "./user.model";

export interface Sale {
    id: string;
    piece: Piece[];
    saleDate: string;
    client: User;
    quantity: number;
    total: number;
    imagePayment: string;
    status: boolean;
  }