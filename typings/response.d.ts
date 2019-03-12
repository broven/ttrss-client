export interface IbaseResponse {
  seq: number;
  status: number;
}
export interface Ilogin {
  session_id: string;
  api_level: number;
}
export interface IgetCategories {
  [index: number]: {
    id: number;
    title: string;
    unread: number;
    order_id?: number;
  }
}
