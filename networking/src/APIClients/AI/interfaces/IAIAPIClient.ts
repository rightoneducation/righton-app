export default interface IAIAPIClient {
  waegen(waegenInput: any): Promise<string>;
  waeregen(waeregenInput: any): Promise<string>;
}