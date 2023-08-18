import React from "react";
import api from "../api/api";
import { useLoaderData } from "react-router-dom";

export const cartLoader = async () => {
  const response = await Promise.all([api.get("/api/ecommerce/orders")]);
  return { orders: response[0].data };
};

export default function Cart() {
  const { orders } = useLoaderData();
  console.log(orders);
  return <div>Cart</div>;
}
