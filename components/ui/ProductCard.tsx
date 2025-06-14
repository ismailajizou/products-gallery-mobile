import { Product } from "@/types/products";
import { Ionicons } from "@expo/vector-icons";
import { Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";

export default function ProductCard({
  product,
  handleFavorite,
  isFavorite,
  isTablet = false,
}: {
  product: Product;
  handleFavorite: (product: Product) => void;
  isFavorite: boolean;
  isTablet?: boolean;
}) {
  return (
    <View style={[styles.container, isTablet && styles.containerTablet]}>
      <View style={styles.favoriteContainer}>
        <TouchableOpacity
          style={[
            styles.favoriteButton,
            {
              backgroundColor: isFavorite
                ? "#ffebee"
                : "rgba(255, 255, 255, 0.9)",
            },
          ]}
          onPress={() => handleFavorite(product)}
        >
          <Ionicons
            name={isFavorite ? "heart" : "heart-outline"}
            size={isTablet ? 24 : 20}
            color={isFavorite ? "#e91e63" : "#666"}
          />
        </TouchableOpacity>
      </View>
      <View style={[styles.imageContainer, isTablet && styles.imageContainerTablet]}>
        <Image
          source={{ uri: product.image }}
          style={styles.image}
          resizeMode="contain"
        />
      </View>
      <View style={styles.contentContainer}>
        <Text style={[styles.category, isTablet && styles.categoryTablet]}>{product.category}</Text>
        <Text style={[styles.title, isTablet && styles.titleTablet]} numberOfLines={2}>
          {product.title}
        </Text>
        <Text style={[styles.price, isTablet && styles.priceTablet]}>${product.price}</Text>
        <Text style={[styles.description, isTablet && styles.descriptionTablet]} numberOfLines={3}>
          {product.description}
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#ffffff",
    borderRadius: 12,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
    margin: 8,
    flex: 1,
  },
  containerTablet: {
    maxWidth: 350,
    minWidth: 280,
  },
  favoriteButton: {
    padding: 8,
    borderRadius: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    elevation: 3,
  },
  imageContainer: {
    width: "100%",
    paddingVertical: 10,
    height: 180,
    backgroundColor: "#fff",
  },
  imageContainerTablet: {
    height: 220,
  },
  image: {
    width: "100%",
    height: "100%",
  },
  contentContainer: {
    padding: 16,
  },
  category: {
    fontSize: 14,
    color: "#6b7280",
    marginBottom: 8,
    textTransform: 'capitalize',
  },
  categoryTablet: {
    fontSize: 16,
    marginBottom: 10,
  },
  title: {
    fontSize: 18,
    fontWeight: "600",
    color: "#1a1a1a",
    marginBottom: 8,
    lineHeight: 24,
  },
  titleTablet: {
    fontSize: 20,
    marginBottom: 10,
    lineHeight: 26,
  },
  price: {
    fontSize: 20,
    fontWeight: "700",
    color: "#2563eb",
    marginBottom: 8,
  },
  priceTablet: {
    fontSize: 22,
    marginBottom: 10,
  },
  description: {
    fontSize: 14,
    color: "#6b7280",
    lineHeight: 20,
  },
  descriptionTablet: {
    fontSize: 16,
    lineHeight: 22,
  },
  favoriteContainer: {
    position: "absolute",
    top: 10,
    right: 10,
    zIndex: 10,
  },
});
