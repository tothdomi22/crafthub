export default interface ListingRequest {
  name: string;
  price: number;
  canShip: boolean;
  city: string;
  description: string;
  subCategoryId: number;
}
