import { Card, CardContent, CardMedia, Typography } from "@mui/material";
import React from "react";
import { Product } from "../../type";
import styles from "./styles.module.css";

export interface ProductItemsProps {
  product: Product;
  isVisible: boolean;
  onClick: (id: number) => void;
  onDragStart: (productId: number) => void;
  onDrop: (productId: number) => void;
  //   onKeyDown: (e: React.KeyboardEvent<HTMLDivElement>) => void;
}

export default function ProductItem({
  isVisible,
  product,
  onClick,
  onDragStart,
  onDrop,
}: //   onKeyDown,
ProductItemsProps) {
  const onClickCard = () => {
    onClick(product.id);
  };

  const onCardDragStart = () => {
    onDragStart(product.id);
  };
  const onCardDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    onDrop(product.id);
  };
  const onCardDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
  };

  return (
    <Card
      className={styles.productItem}
      onClick={onClickCard}
      draggable
      onDragStart={onCardDragStart}
      onDrop={onCardDrop}
      onDragOver={onCardDragOver}
      //   onKeyDown={onKeyDown}
    >
      {!isVisible && <div className={styles.mask}></div>}

      <CardMedia
        component="img"
        height="140"
        image={product.image}
        alt={product.title}
      />
      <CardContent>
        <Typography variant="h6" component="div">
          {product.title}
        </Typography>
        <Typography variant="body2" color="textSecondary">
          {product.category}
        </Typography>
        <Typography variant="body2" color="textPrimary">
          ${product.price}
        </Typography>
        <Typography variant="body2" color="textSecondary">
          {product.description}
        </Typography>
        <Typography variant="body2" color="textSecondary">
          Rating: {product.rating.rate} ({product.rating.count} reviews)
        </Typography>
          
      </CardContent>
    </Card>
  );
}
