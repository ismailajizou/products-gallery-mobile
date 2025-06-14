import ProductCard from "@/components/ui/ProductCard";
import { Text, View } from "react-native";

export default function HomeScreen() {
  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
      <ProductCard product={{
        id: 1,
        title: "Product 1",
        price: 100,
        description: "Description 1",
        image: "https://placehold.co/400",
        category: "Category 1",
        rating: { rate: 4.5, count: 100 },
      }} />
    </View>
  );
}
