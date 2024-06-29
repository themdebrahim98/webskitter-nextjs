"use client";
import { useAuth } from "./context/AuthContext";
import {
  Alert,
  Box,
  Card,
  CardContent,
  CircularProgress,
  Grid,
  Typography,
} from "@mui/material";
import { useEffect, useState } from "react";
import axios from "axios";
import { Product } from "./type";
import { fetchProducts } from "./util";
import ProductItem from "./components/ProductItem";

export default function Home() {
  const { user, logout } = useAuth();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [visibleProductID, setVisibleProductID] = useState<number | null>(null);
  const [draggedProductId, setDraggedProductId] = useState<number | null>(null);

  if (!user) {
    return <h1>You are not authorized!</h1>;
  }

  useEffect(() => {
    const getDataFromApi = async () => {
      setLoading(true);
      try {
        // Api call
        const result = await fetchProducts("https://fakestoreapi.com/products");
        setProducts(result);
      } catch (error) {
        setError(error instanceof Error ? error.message : String(error));
      } finally {
        setLoading(false);
      }
    };
    getDataFromApi();
  }, []);

  if (loading) {
    return <CircularProgress />;
  }

  if (error) {
    return <Alert severity="error">This is an error Alert.</Alert>;
  }

  const onClickProductItem = (id: number) => {
    setVisibleProductID(id);
  };

  const handleDragStart = (productID: number) => {
    setDraggedProductId(productID);
  };

  const handleDrop = (dropOverProductId: number) => {
    // e.preventDefault();
    const fromIndex = products.findIndex(
      (product) => product.id === draggedProductId
    );
    const toIndex = products.findIndex(
      (product) => product.id === dropOverProductId
    );

    // if dragged product and drop product not found, do nothing.
    if (fromIndex === -1 || toIndex === -1) {
      return;
    }

    const updatedProducts = [...products];
    const [draggedItem] = updatedProducts.splice(fromIndex, 1);
    updatedProducts.splice(toIndex, 0, draggedItem);
    setProducts(updatedProducts);
    setDraggedProductId(null);
  };

  return (
    <Box sx={{ padding: "10px" }}>
      <Grid container spacing={2}>
        {products.map((product) => (
          <Grid item xs={12} sm={6} md={4} lg={3} key={product.id}>
            <ProductItem
              product={product}
              isVisible={visibleProductID === product.id}
              onClick={onClickProductItem}
              onDragStart={handleDragStart}
              onDrop={handleDrop}
            />
          </Grid>
        ))}
            
      </Grid>
    </Box>
  );
}
