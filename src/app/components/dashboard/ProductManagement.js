import { useState } from "react";
import ProductForm from "./ProductForm";

export default function ProductManagement({
  editingProduct,
  setEditingProduct,
  setShowProductForm,
  products,
  setProducts,
  setStats,
  setRecentActivity,
}) {
  const [productForm, setProductForm] = useState(
    editingProduct
      ? {
          name: editingProduct.name,
          price: editingProduct.price,
          description: editingProduct.description,
          image: editingProduct.image,
          category: editingProduct.category,
          stock: editingProduct.stock || "",
          gallery: editingProduct.gallery || [],
          technicalSpecs: editingProduct.technicalSpecs || "",
        }
      : {
          name: "",
          price: "",
          description: "",
          image: "",
          category: "",
          stock: "",
          gallery: [],
          technicalSpecs: "",
        }
  );

  const [uploadingImages, setUploadingImages] = useState(false);

  const handleGalleryImagesChange = async (e) => {
    const files = Array.from(e.target.files);
    if (files.length === 0) return;

    setUploadingImages(true);

    try {
      const formData = new FormData();
      files.forEach((file) => {
        formData.append("gallery", file);
      });

      const response = await fetch("/api/upload/gallery", {
        method: "POST",
        body: formData,
      });

      const result = await response.json();

      if (result.success) {
        setProductForm((prev) => ({
          ...prev,
          gallery: [...prev.gallery, ...result.urls],
        }));
      }
    } catch (error) {
      console.error("Error uploading gallery images:", error);
      alert("Erro ao fazer upload das imagens");
    } finally {
      setUploadingImages(false);
    }
  };

  const removeGalleryImage = (index) => {
    setProductForm((prev) => ({
      ...prev,
      gallery: prev.gallery.filter((_, i) => i !== index),
    }));
  };

  const handleSubmitProduct = async (e) => {
    e.preventDefault();
    setUploadingImages(true);

    try {
      const formData = new FormData();

      // Adicionar dados do formulário
      formData.append("name", productForm.name);
      formData.append("price", productForm.price);
      formData.append("description", productForm.description || "");
      formData.append("technicalSpecs", productForm.technicalSpecs || "{}");
      formData.append("category", productForm.category);
      formData.append("stock", productForm.stock);

      // DEBUG: Verificar o que há na gallery
      console.log("Gallery content:", productForm.gallery);

      // Adicionar apenas imagens novas (que são objetos File)
      const newImages = productForm.gallery.filter((img) => img && img.file);
      console.log("New images to upload:", newImages.length);

      newImages.forEach((imgObj, index) => {
        if (imgObj.file) {
          formData.append("gallery", imgObj.file);
        }
      });

      // Adicionar imagens existentes (para edição)
      if (editingProduct) {
        const existingImages = productForm.gallery
          .filter(
            (img) =>
              img &&
              (typeof img === "string" ||
                (img.preview && img.preview.includes("amazonaws.com")))
          )
          .map((img) => (typeof img === "string" ? img : img.preview));

        console.log("Existing images:", existingImages);
        formData.append("existingImages", JSON.stringify(existingImages));
      }

      // DEBUG: Verificar FormData
      for (let [key, value] of formData.entries()) {
        console.log(key, value);
      }

      const url = editingProduct
        ? `/api/produtos/${editingProduct._id}`
        : "/api/produtos";

      const response = await fetch(url, {
        method: editingProduct ? "PUT" : "POST",
        body: formData,
      });

      if (response.ok) {
        const result = await response.json();
        console.log("Sucesso:", result);

        // Limpar formulário
        setProductForm({
          name: "",
          price: "",
          description: "",
          technicalSpecs: "",
          category: "",
          stock: "",
          gallery: [],
        });
        setShowProductForm(false);
        setEditingProduct(null);

        // Recarregar produtos
        if (typeof reloadProducts === "function") {
          reloadProducts();
        }
      } else {
        const error = await response.json();
        console.error("Erro na resposta:", error);
        alert(`Erro: ${error.error || "Erro ao salvar produto"}`);
      }
    } catch (error) {
      console.error("Erro ao enviar formulário:", error);
      alert(
        "Erro ao enviar formulário. Verifique o console para mais detalhes."
      );
    } finally {
      setUploadingImages(false);
    }
  };

  const handleProductFormChange = (e) => {
    const { name, value } = e.target;
    setProductForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  return (
    <div className="border-b border-gray-200 px-4 py-5 sm:p-6">
      <h4 className="text-lg font-medium mb-4">
        {editingProduct ? "Editar Produto" : "Adicionar Novo Produto"}
      </h4>

      <ProductForm
        productForm={productForm}
        handleProductFormChange={handleProductFormChange}
        handleGalleryImagesChange={handleGalleryImagesChange}
        removeGalleryImage={removeGalleryImage}
        handleSubmitProduct={handleSubmitProduct}
        uploadingImages={uploadingImages}
        setShowProductForm={setShowProductForm}
        setEditingProduct={setEditingProduct}
        editingProduct={editingProduct}
      />
    </div>
  );
}
