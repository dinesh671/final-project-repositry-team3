import React from 'react'
import { useCreateProductMutation } from '../../slices/productsApiSlice';

export const ProductCreateScreen = () => {
    const [createProduct, { isLoading: loadingCreate }] =
    useCreateProductMutation();

  const createProductHandler = async () => {
    if (window.confirm('Are you sure you want to create a new product?')) {
      try {
        await createProduct();
        refetch();
      } catch (err) {
        toast.error(err?.data?.message || err.error);
      }
    }
  };
  return (
    <div>
        
    </div>
  )
}
