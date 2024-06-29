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
import React, { useEffect, useRef, useState } from "react";
import axios from "axios";
import { Product } from "./type";
import { fetchProducts } from "./util";
import ProductItem from "./components/ProductItem";

const GRID_COLS_LENGTH = 5;

export default function Home() {
  const { user, logout } = useAuth();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [visibleProductID, setVisibleProductID] = useState<number | null>(null);
  const [draggedProductId, setDraggedProductId] = useState<number | null>(null);
  const visibleProductIDRef = useRef<number | null>(null);

  const updateVisibleProductId = (productId: number) => {
    setVisibleProductID(productId);
    visibleProductIDRef.current = productId;
  };

  useEffect(() => {
    const onKeyDown = (e: any) => {
      let visibleProductIndex = products.findIndex(
        (product) => product.id === visibleProductIDRef.current
      );

      if (visibleProductIndex === -1) {
        visibleProductIndex = 0;
      }

      let newIndex = visibleProductIndex;
      const key = e.key;

      if (key === "ArrowLeft") {
        newIndex = visibleProductIndex - 1;
        if (newIndex < 0) {
          newIndex = 0;
        }
      } else if (key === "ArrowRight") {
        newIndex = visibleProductIndex + 1;
        if (newIndex >= products.length) {
          newIndex = products.length - 1;
        }
      } else if (key === "ArrowUp") {
        if (visibleProductIndex >= GRID_COLS_LENGTH) {
          newIndex = visibleProductIndex - GRID_COLS_LENGTH;
        }
      } else if (key === "ArrowDown") {
        const totalRowsCount = Math.ceil(products.length / GRID_COLS_LENGTH);
        const currentRowIndex = Math.floor(
          visibleProductIndex / GRID_COLS_LENGTH
        );
        const isLastRow = currentRowIndex === totalRowsCount - 1;
        if (!isLastRow) {
          newIndex = visibleProductIndex + GRID_COLS_LENGTH;
        }
      }
      console.log(newIndex);

      const newVisibleProductId = products[newIndex].id;
      updateVisibleProductId(newVisibleProductId);
    };

    document.addEventListener("keydown", onKeyDown);

    return () => {
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [products]);

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

  if (!user) {
    return <h1>You are not authorized!</h1>;
  }

  if (loading) {
    return <CircularProgress />;
  }

  if (error) {
    return <Alert severity="error">This is an error Alert.</Alert>;
  }

  const onClickProductItem = (id: number) => {
    updateVisibleProductId(id);
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

    console.log(fromIndex, toIndex);
    // if dragged product and drop product not found, do nothing.
    if (fromIndex === -1 || toIndex === -1) {
      return;
    }

    const updatedProducts = [...products];

    // const [draggedItem] = updatedProducts.splice(fromIndex, 1);
    // updatedProducts.splice(toIndex, 0, draggedItem);
    updatedProducts[toIndex] = products[fromIndex];
    updatedProducts[fromIndex] = products[toIndex];
    setProducts(updatedProducts);
    setDraggedProductId(null);
    console.log(updatedProducts, products);
  };

  const gridColsSize = 12 / GRID_COLS_LENGTH;

  return (
    <Box sx={{ padding: "10px" }}>
      <Grid container spacing={2}>
        {products.map((product) => (
          <Grid item xs={gridColsSize} key={product.id}>
            <ProductItem
              product={product}
              isVisible={visibleProductID === product.id}
              onClick={onClickProductItem}
              onDragStart={handleDragStart}
              onDrop={handleDrop}
              // onKeyDown={handleProductKeyDown}
            />
          </Grid>
        ))}
            
      </Grid>
    </Box>
  );
}
