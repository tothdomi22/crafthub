export interface MainCategory {
  description: string;
  displayName: string;
  id: number;
  uniqueName: string;
}
export interface SubCategory {
  description: string;
  displayName: string;
  id: number;
  uniqueName: string;
  mainCategory: MainCategory;
}
