import { Piece } from "./piece.model";
import { User } from "./user.model";


export interface Review {
    id: string;
    user: User;
    piece: Piece;
    score: number;
    description: string;
  }