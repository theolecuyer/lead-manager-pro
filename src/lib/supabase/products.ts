import { createClient } from "../../../utils/supabase/client"
import type { Database } from "./database.types"

type Product = Database["public"]["Tables"]["products"]["Row"]
type ProductInsert = Database["public"]["Tables"]["products"]["Insert"]
type ProductUpdate = Database["public"]["Tables"]["products"]["Update"]

// Read

export async function getAllProducts() {
  const supabase = createClient()

  const { data, error } = await supabase
    .from("products")
    .select("*")
    .order("name", { ascending: true })

  if (error) {
    console.error("Error fetching products:", error)
    throw new Error(error.message)
  }

  return data as Product[]
}

export async function getProductById(productId: number) {
  const supabase = createClient()

  const { data, error } = await supabase
    .from("products")
    .select("*")
    .eq("id", productId)
    .single()

  if (error) {
    console.error("Error fetching product:", error)
    throw new Error(error.message)
  }

  return data as Product
}

// Create

export interface CreateProductInput {
  name: string
  description?: string
  price: number
}

export async function createProduct(input: CreateProductInput) {
  const supabase = createClient()

  const productData: ProductInsert = {
    name: input.name,
    description: input.description || null,
    price: input.price,
  }

  const { data, error } = await supabase
    .from("products")
    .insert(productData)
    .select()
    .single()

  if (error) {
    console.error("Error creating product:", error)
    throw new Error(error.message)
  }

  return data as Product
}

// Update

export interface UpdateProductInput {
  name?: string
  description?: string
  price?: number
}

export async function updateProduct(productId: number, input: UpdateProductInput) {
  const supabase = createClient()

  const updateData: ProductUpdate = {}
  
  if (input.name !== undefined) updateData.name = input.name
  if (input.description !== undefined) updateData.description = input.description
  if (input.price !== undefined) updateData.price = input.price

  const { data, error } = await supabase
    .from("products")
    .update(updateData)
    .eq("id", productId)
    .select()
    .single()

  if (error) {
    console.error("Error updating product:", error)
    throw new Error(error.message)
  }

  return data as Product
}

// Delete

export async function deleteProduct(productId: number) {
  const supabase = createClient()

  const { error } = await supabase
    .from("products")
    .delete()
    .eq("id", productId)

  if (error) {
    console.error("Error deleting product:", error)
    throw new Error(error.message)
  }

  return true
}