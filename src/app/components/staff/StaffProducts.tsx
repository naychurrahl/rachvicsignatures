import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Search, Package, Plus } from "lucide-react";
import { Product } from "@/app/data/interFaces";
import { ApiRequest, baseUrl } from "@/app/contexts/ApiRequest";
import { Input } from "@/app/components/ui/input";
import { Badge } from "@/app/components/ui/badge";
import { Button } from "@/app/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/app/components/ui/dialog";
import { Label } from "@/app/components/ui/label";
import { toast } from "sonner";
import { useApp } from "@/app/contexts/AppContext";

export function StaffProducts() {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [showDialog, setShowDialog] = useState(false);
  const [formData, setFormData] = useState<Product>({
    id: "",
    name: "",
    price: 0,
    image: "",
    stock: 0,
    category: [""],
    description: "",
  });

  const { products, setLoadProduct } = useApp();

  const buildFormData = (product: Product) => {
    const fd = new FormData();
    fd.append("id", product.id);
    fd.append("name", product.name);
    fd.append("price", product.price.toString());
    fd.append("stock", product.stock.toString());
    fd.append("category", product.category.join(", "));
    fd.append("description", product.description);
    if (imageFile) fd.append("image", imageFile);
    return fd;
  };

  const addProduct = async (product: Product) => {
    setIsProcessing(true);
    try {
      return await ApiRequest({
        url: `${baseUrl}/product`,
        method: "POST",
        body: buildFormData(product),
      });
    } catch (error) {
      toast.error("Error adding product");
      console.error("Error adding product:", error);
      throw error;
    } finally {
      setIsProcessing(false);
    }
  };

  const updateProduct = async (product: Product) => {
    setIsProcessing(true);
    try {
      return await ApiRequest({
        url: `${baseUrl}/product`,
        method: "PUT",
        body: buildFormData(product),
      });
    } catch (error) {
      toast.error("Error updating product");
      console.error("Error updating product:", error);
      throw error;
    } finally {
      setIsProcessing(false);
    }
  };

  const handleEdit = (product: Product) => {
    setSelectedProduct(product);
    setImageFile(null);
    setFormData({
      id: product.id,
      name: product.name,
      price: product.price,
      image: product.image,
      stock: product.stock,
      category: product.category,
      description: product.description,
    });
    setShowDialog(true);
  };

  const handleCreate = () => {
    setSelectedProduct(null);
    setImageFile(null);
    setFormData({
      id: "",
      name: "",
      price: 0,
      image: "",
      stock: 0,
      category: [""],
      description: "",
    });
    setShowDialog(true);
  };

  const handleSave = async () => {
    try {
      if (selectedProduct) {
        await updateProduct(formData);
      } else {
        await addProduct(formData);
      }
      toast.success(
        selectedProduct
          ? `${selectedProduct.name} updated`
          : `${formData.name} created`,
      );
      setLoadProduct((prev: boolean) => !prev);
      setImageFile(null);
      setShowDialog(false);
    } catch {
      // already toasted inside addProduct/updateProduct
    }
  };

  const filteredProducts = products.filter((product) =>
    product.name.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
      {/* Header */}
      <div className="sticky top-0 z-10 bg-white dark:bg-gray-900 border-b px-4 py-3">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center">
            <button
              onClick={() => navigate("/staff/dashboard")}
              className="p-2 -ml-2 active:scale-90 transition-transform"
            >
              <ArrowLeft className="h-6 w-6" />
            </button>
            <h1 className="text-lg ml-2">Product Management</h1>
          </div>
          <Button onClick={handleCreate} size="sm">
            <Plus className="h-4 w-4 mr-2" />
            Add Product
          </Button>
        </div>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
          <Input
            type="text"
            placeholder="Search products..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
      </div>

      <div className="p-4">
        <div className="space-y-3">
          {filteredProducts.map((product) => (
            <div
              key={product.id}
              onClick={() => handleEdit(product)}
              className="bg-white dark:bg-gray-900 rounded-lg border p-4 active:scale-98 transition-transform cursor-pointer"
            >
              <div className="flex gap-3">
                <div className="w-16 h-16 bg-gray-100 dark:bg-gray-800 rounded-lg overflow-hidden flex-shrink-0">
                  <img
                    src={product.image}
                    alt={product.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="text-sm mb-1 truncate">{product.name}</h3>
                  <p className="text-lg mb-1">${product.price.toFixed(2)}</p>
                  <div className="flex items-center gap-2">
                    <Package className="h-4 w-4 text-gray-400" />
                    <span className="text-sm text-gray-600 dark:text-gray-400">
                      Stock: {product.stock}
                    </span>
                    {product.stock < 10 && (
                      <Badge variant="destructive" className="text-xs">
                        Low
                      </Badge>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <Dialog open={showDialog} onOpenChange={setShowDialog}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>
              {selectedProduct ? "Edit Product" : "Add Product"}
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="name">Name</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
                className="mt-1"
              />
            </div>
            <div>
              <Label htmlFor="price">Price</Label>
              <Input
                id="price"
                type="number"
                step={0.01}
                value={formData.price}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    price: parseFloat(e.target.value),
                  })
                }
                className="mt-1"
              />
            </div>
            <div>
              <Label htmlFor="image">Image</Label>
              <input
                id="image"
                type="file"
                accept="image/*"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (!file) return;
                  setImageFile(file);
                  const reader = new FileReader();
                  reader.onloadend = () => {
                    setFormData({
                      ...formData,
                      image: reader.result as string,
                    });
                  };
                  reader.readAsDataURL(file);
                }}
                className="mt-1 w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:bg-gray-100 file:text-gray-700 hover:file:bg-gray-200 dark:file:bg-gray-800 dark:file:text-gray-300"
              />
              {formData.image && (
                <img
                  src={formData.image}
                  alt="Preview"
                  className="mt-2 w-full h-40 object-cover rounded-lg border"
                />
              )}
            </div>
            <div>
              <Label htmlFor="stock">Stock</Label>
              <Input
                id="stock"
                type="number"
                value={formData.stock}
                onChange={(e) =>
                  setFormData({ ...formData, stock: parseInt(e.target.value) })
                }
                className="mt-1"
              />
            </div>
            <div>
              <Label htmlFor="category">Category</Label>
              <Input
                id="category"
                value={formData.category.join(", ")}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    category: e.target.value.split(", "),
                  })
                }
                className="mt-1"
              />
            </div>
            <div>
              <Label htmlFor="description">Description</Label>
              <Input
                id="description"
                value={formData.description}
                onChange={(e) =>
                  setFormData({ ...formData, description: e.target.value })
                }
                className="mt-1"
              />
            </div>
            <Button
              onClick={handleSave}
              disabled={isProcessing}
              className="w-full"
            >
              {isProcessing
                ? selectedProduct
                  ? "Updating..."
                  : "Creating..."
                : selectedProduct
                  ? "Update Product"
                  : "Create Product"}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
