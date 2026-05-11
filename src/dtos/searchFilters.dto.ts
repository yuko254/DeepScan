export interface UserFiltersDto {
  role_id?: BigInt;
  search?: string;
  // isActive?: boolean;
}

export interface CountryFiltersDto {
  search?: string;
}

export interface CityFiltersDto {
  search?: string;
  country_id?: bigint;
}