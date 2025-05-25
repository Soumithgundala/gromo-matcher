import { products } from "./products";

// Suggest products based on age
export function suggestProducts(age) {
  return products.filter(p => age >= p.minAge && age <= p.maxAge).map(p => p.name);
}

// Check if GP and lead have common product categories
export function isGoodMatch(leadAge, gpAge) {
  const leadProds = suggestProducts(leadAge);
  const gpProds = suggestProducts(gpAge);
  const common = leadProds.filter(p => gpProds.includes(p));
  return common.length > 0 ? common : null;
}
