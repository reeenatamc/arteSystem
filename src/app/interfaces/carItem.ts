import { Piece } from './piece.model';

export interface CartItem extends Piece {
  quantity: number;
}