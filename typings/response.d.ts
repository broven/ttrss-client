export interface IbaseResponse {
  seq: number;
  status: number;
}
export interface IloginSuccessRes extends IbaseResponse {
  content: {
    session_id: string;
    api_level: number;
  };
}
