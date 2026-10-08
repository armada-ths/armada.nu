type StoreItem = {
  id: string
  name: string
  description?: string
  max?: number
}

export const ITEMS: StoreItem[] = [
  {
    id: "sandwich-turkey",
    name: "Sandwich (Turkey)",
    description: "Freshly made with turkey and vegetables"
  },
  {
    id: "sandwich-vegetarian",
    name: "Sandwich (Vegetarian)",
    description: "Freshly made with cheese and vegetables"
  },
  {
    id: "pain-au-chocolat",
    name: "Pain au Chocolat",
    description: "Butter pastry with chocolate"
  },
  {
    id: "cinnamon-bun",
    name: "Cinnamon bun",
    description: "Classic Swedish Kanelbulle"
  },
  {
    id: "muffin-chocolate",
    name: "Muffin (Chocolate)",
    description: "Soft and rich"
  },
  {
    id: "muffin-blueberry",
    name: "Muffin (Blueberry)",
    description: "Sweet and fruity"
  },
  {
    id: "apple-cake-vegan",
    name: "Apple Cake (Vegan)",
    description: "Plant-based apple cake"
  },
  {
    id: "chocolate-balls-vegan",
    name: "Chocolate ball (Vegan)",
    description: "Classic Swedish Chokladboll"
  },
  { id: "coffee", name: "Black Coffee", description: "Sugar on the side" },
  {
    id: "coffee-with-milk",
    name: "Coffee with Oat milk",
    description: "Sugar on the side"
  },
  { id: "tea", name: "Tea", description: "Sugar on the side" },
  {
    id: "hot-chocolate",
    name: "Oboy",
    description: "Warm and Sweet Cocoa drink"
  }
]
