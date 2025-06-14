import ProductCard from "@/components/ui/ProductCard";
import useProducts from "@/hooks/useProducts";
import { ScrollView, StyleSheet, Text, View } from "react-native";

export default function HomeScreen() {
  const { state, setCategory, setSort, setSearch } = useProducts();
  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.contentContainer}
      showsVerticalScrollIndicator={false}
    >
      <View style={styles.header}>
        <Text style={styles.title}>Product Gallery</Text>
        <Text style={styles.subtitle}>Discover amazing products</Text>
      </View>
      
      <View style={styles.productsContainer}>
        {state.products.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
  },
  contentContainer: {
    paddingTop: 60,
    paddingHorizontal: 16,
    paddingBottom: 50, // Fixed bottom spacing issue
  },
  header: {
    marginBottom: 24,
    paddingHorizontal: 4,
  },
  title: {
    fontSize: 32,
    fontWeight: "800",
    color: "#1a1a1a",
    marginBottom: 4,
    letterSpacing: -0.5,
  },
  subtitle: {
    fontSize: 16,
    color: "#6b7280",
    fontWeight: "400",
  },
  productsContainer: {
    gap: 4, // Reduced gap since ProductCard has its own margin
  },
});