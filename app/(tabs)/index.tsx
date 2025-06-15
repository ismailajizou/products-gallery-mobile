import ProductCard from "@/components/ui/ProductCard";
import { CATEGORIES, SORT_OPTIONS } from "@/constants/Products";
import useProducts from "@/hooks/useProducts";
import { Picker } from "@react-native-picker/picker";
import {
  ActivityIndicator,
  Dimensions,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";

const { width: screenWidth } = Dimensions.get('window');
const isTablet = screenWidth > 600;

export default function HomeScreen() {
  const { state, setCategory, setSort, setSearch, toggleFavorite, favorites, isOnline } =
    useProducts();

  if (state.isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#3B82F6" />
        <Text style={styles.loadingText}>Loading products...</Text>
      </View>
    );
  }

  if (state.isError) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorTitle}>Oops! Something went wrong</Text>
        <Text style={styles.errorMessage}>
          {state.error || "Failed to load products"}
        </Text>
      </View>
    );
  }

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.contentContainer}
      showsVerticalScrollIndicator={false}
    >
      <View style={styles.header}>
        <Text style={styles.title}>Product Gallery</Text>
        <Text style={styles.subtitle}>Discover amazing products</Text>
        {state.isOfflineMode && (
          <View style={styles.offlineIndicator}>
            <Text style={styles.offlineText}>
              📱 Offline Mode - Showing cached products
            </Text>
          </View>
        )}
      </View>

      <View style={styles.filters}>
        <View style={styles.searchContainer}>
          <Text style={styles.filterLabel}>Search Products</Text>
          <TextInput
            placeholder="Search products..."
            value={state.search}
            onChangeText={(text) => setSearch(text)}
            style={styles.searchInput}
            placeholderTextColor="#9CA3AF"
          />
        </View>

        <View style={[styles.filtersRow, isTablet ? styles.filtersRowTablet : styles.filtersRowPhone]}>
          <View style={[styles.filterContainer, isTablet && styles.filterContainerTablet]}>
            <Text style={styles.filterLabel}>Category</Text>
            <View style={styles.pickerWrapper}>
              <Picker
                selectedValue={state.category}
                onValueChange={(itemValue) => setCategory(itemValue)}
                style={styles.picker}
              >
                {CATEGORIES.map((category) => (
                  <Picker.Item
                    key={category.value}
                    label={category.label}
                    value={category.value}
                  />
                ))}
              </Picker>
            </View>
          </View>

          <View style={[styles.filterContainer, isTablet && styles.filterContainerTablet]}>
            <Text style={styles.filterLabel}>Sort By</Text>
            <View style={styles.pickerWrapper}>
              <Picker
                selectedValue={state.sort}
                onValueChange={(itemValue) => setSort(itemValue)}
                style={styles.picker}
              >
                <Picker.Item label="Select Sort" value="" />
                {SORT_OPTIONS.map((sort) => (
                  <Picker.Item
                    key={sort.value}
                    label={sort.label}
                    value={sort.value}
                  />
                ))}
              </Picker>
            </View>
          </View>
        </View>
      </View>

      <View style={[styles.productsContainer, isTablet && styles.productsContainerTablet]}>
        {state.products.length === 0 ? (
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyTitle}>No products found</Text>
            <Text style={styles.emptyMessage}>
              {state.search || state.category
                ? "Try adjusting your filters or search terms"
                : "No products available at the moment"}
            </Text>
          </View>
        ) : (
          <View style={[styles.productsGrid, isTablet && styles.productsGridTablet]}>
            {state.products.map((product) => (
                             <ProductCard
                 key={product.id}
                 product={product}
                 handleFavorite={toggleFavorite}
                 isFavorite={favorites.includes(product.id)}
                 isTablet={isTablet}
               />
            ))}
          </View>
        )}
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
    paddingTop: isTablet ? 80 : 60,
    paddingHorizontal: 16,
    paddingBottom: 50,
  },
  header: {
    marginBottom: isTablet ? 32 : 24,
    paddingHorizontal: 4,
  },
  title: {
    fontSize: isTablet ? 40 : 32,
    fontWeight: "800",
    color: "#1a1a1a",
    marginBottom: 4,
    letterSpacing: -0.5,
  },
  subtitle: {
    fontSize: isTablet ? 18 : 16,
    color: "#6b7280",
    fontWeight: "400",
  },
  productsContainer: {
    flex: 1,
  },
  productsContainerTablet: {
    alignItems: 'center',
  },
  productsGrid: {
    flexDirection: 'column',
    gap: 4,
  },
  productsGridTablet: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    gap: 16,
  },
  filters: {
    marginBottom: isTablet ? 32 : 24,
    gap: isTablet ? 20 : 16,
  },
  searchContainer: {
    marginBottom: 8,
  },
  filterLabel: {
    fontSize: isTablet ? 16 : 14,
    fontWeight: "600",
    color: "#374151",
    marginBottom: 8,
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  searchInput: {
    height: isTablet ? 56 : 48,
    width: "100%",
    backgroundColor: "#ffffff",
    borderRadius: 12,
    paddingHorizontal: 16,
    fontSize: isTablet ? 18 : 16,
    borderWidth: 1,
    borderColor: "#E5E7EB",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  filtersRow: {
    gap: 12,
  },
  filtersRowPhone: {
    flexDirection: "column",
  },
  filtersRowTablet: {
    flexDirection: "row",
  },
  filterContainer: {
    flex: 1,
  },
  filterContainerTablet: {
    minWidth: 200,
  },
  pickerWrapper: {
    height: isTablet ? 56 : 48,
    backgroundColor: "#ffffff",
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#E5E7EB",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
    justifyContent: "center",
  },
  picker: {
    width: "100%",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f5f5f5",
    paddingHorizontal: 16,
  },
  loadingText: {
    fontSize: isTablet ? 18 : 16,
    fontWeight: "600",
    color: "#3B82F6",
    marginTop: 16,
    textAlign: "center",
  },
  errorContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f5f5f5",
    paddingHorizontal: 16,
  },
  errorTitle: {
    fontSize: isTablet ? 28 : 24,
    fontWeight: "800",
    color: "#EF4444",
    marginBottom: 8,
    textAlign: "center",
  },
  errorMessage: {
    fontSize: isTablet ? 18 : 16,
    color: "#6b7280",
    fontWeight: "400",
    textAlign: "center",
    lineHeight: 22,
  },
  emptyContainer: {
    alignItems: "center",
    paddingVertical: isTablet ? 80 : 60,
    paddingHorizontal: 20,
  },
  emptyTitle: {
    fontSize: isTablet ? 24 : 20,
    fontWeight: "700",
    color: "#374151",
    marginBottom: 8,
    textAlign: "center",
  },
  emptyMessage: {
    fontSize: isTablet ? 18 : 16,
    color: "#6b7280",
    fontWeight: "400",
    textAlign: "center",
    lineHeight: 22,
  },
  offlineIndicator: {
    backgroundColor: "#FEF3C7",
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 8,
    marginTop: 12,
    borderWidth: 1,
    borderColor: "#F59E0B",
  },
  offlineText: {
    fontSize: isTablet ? 16 : 14,
    color: "#92400E",
    fontWeight: "600",
    textAlign: "center",
  },
});
