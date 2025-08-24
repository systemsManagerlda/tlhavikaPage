import React from "react";

export default function ProductForm({
  productForm,
  setProductForm,
  handleProductFormChange,
  removeGalleryImage,
  handleSubmitProduct,
  uploadingImages,
  setShowProductForm,
  setEditingProduct,
  editingProduct,
}) {
  // Atualizado para gerar previews
  const handleGalleryImagesChange = (e) => {
    if (!e.target.files) return;

    const files = Array.from(e.target.files);

    const newImages = files.map((file) => ({
      file,
      preview: URL.createObjectURL(file),
    }));

    // Simular um evento para usar handleProductFormChange
    const simulatedEvent = {
      target: {
        name: "gallery",
        value: [...productForm.gallery, ...newImages],
      },
    };

    handleProductFormChange(simulatedEvent);
  };

  const handleRemoveImage = (index) => {
    const newGallery = productForm.gallery.filter((_, i) => i !== index);

    const simulatedEvent = {
      target: {
        name: "gallery",
        value: newGallery,
      },
    };

    handleProductFormChange(simulatedEvent);
  };

  // Função para converter technicalSpecs object para string JSON
  const handleTechnicalSpecsChange = (e) => {
    const { name, value } = e.target;

    // Se estiver editando e technicalSpecs for um objeto, converter para string
    if (
      name === "technicalSpecs" &&
      typeof productForm.technicalSpecs === "object"
    ) {
      setProductForm((prev) => ({
        ...prev,
        technicalSpecs: JSON.stringify(value, null, 2),
      }));
    } else {
      handleProductFormChange(e);
    }
  };

  // Converter technicalSpecs para string se for objeto
  const getTechnicalSpecsValue = () => {
    if (typeof productForm.technicalSpecs === "object") {
      return JSON.stringify(productForm.technicalSpecs, null, 2);
    }
    return productForm.technicalSpecs || "";
  };

  return (
    <form onSubmit={handleSubmitProduct}>
      <div className="grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-6">
        <div className="sm:col-span-3">
          <label
            htmlFor="name"
            className="block text-sm font-medium text-gray-700"
          >
            Nome do Produto
          </label>
          <div className="mt-1">
            <input
              type="text"
              name="name"
              id="name"
              value={productForm.name || ""}
              onChange={handleProductFormChange}
              className="shadow-sm focus:ring-green-500 focus:border-green-500 block w-full sm:text-sm border-gray-300 rounded-md"
              required
            />
          </div>
        </div>

        <div className="sm:col-span-3">
          <label
            htmlFor="price"
            className="block text-sm font-medium text-gray-700"
          >
            Preço
          </label>
          <div className="mt-1 relative rounded-md shadow-sm">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <span className="text-gray-500 sm:text-sm">MZN</span>
            </div>
            <input
              type="number"
              name="price"
              id="price"
              value={productForm.price || ""}
              onChange={handleProductFormChange}
              step="0.01"
              min="0"
              className="focus:ring-green-500 focus:border-green-500 block w-full pl-10 sm:text-sm border-gray-300 rounded-md"
              required
            />
          </div>
        </div>

        <div className="sm:col-span-6">
          <label
            htmlFor="description"
            className="block text-sm font-medium text-gray-700"
          >
            Descrição
          </label>
          <div className="mt-1">
            <textarea
              id="description"
              name="description"
              rows={3}
              value={productForm.description || ""}
              onChange={handleProductFormChange}
              className="shadow-sm focus:ring-green-500 focus:border-green-500 block w-full sm:text-sm border-gray-300 rounded-md"
            />
          </div>
        </div>

        {/* Galeria */}
        <div className="sm:col-span-6">
          <label className="block text-sm font-medium text-gray-700">
            Imagens do Produto
          </label>
          <button
            type="button"
            onClick={() => handleRemoveImage(index)}
            className="absolute top-0 right-0 bg-red-500 text-white rounded-full p-1 text-xs"
          >
            ×
          </button>
          <div className="mt-1">
            <input
              type="file"
              multiple
              accept="image/*"
              onChange={handleGalleryImagesChange}
              disabled={uploadingImages}
              className="shadow-sm focus:ring-green-500 focus:border-green-500 block w-full sm:text-sm border-gray-300 rounded-md"
            />
          </div>
          {uploadingImages && (
            <div className="mt-2 text-sm text-gray-500">
              Fazendo upload das imagens...
            </div>
          )}

          {/* Preview da galeria numa linha rolável */}
          {productForm.gallery && productForm.gallery.length > 0 && (
            <div className="mt-4">
              <h4 className="text-sm font-medium text-gray-700 mb-2">
                Pré-visualização:
              </h4>
              <div className="flex space-x-2 overflow-x-auto pb-2">
                {productForm.gallery.map((imgObj, index) => (
                  <div key={index} className="relative flex-shrink-0">
                    <img
                      src={imgObj.preview || imgObj}
                      alt={`Gallery ${index}`}
                      className="h-20 w-20 object-cover rounded"
                    />
                    <button
                      type="button"
                      onClick={() => removeGalleryImage(index)}
                      className="absolute top-0 right-0 bg-red-500 text-white rounded-full p-1 text-xs"
                    >
                      ×
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Ficha técnica */}
        <div className="sm:col-span-6">
          <label
            htmlFor="technicalSpecs"
            className="block text-sm font-medium text-gray-700"
          >
            Ficha Técnica (JSON)
          </label>
          <div className="mt-1">
            <textarea
              id="technicalSpecs"
              name="technicalSpecs"
              rows={6}
              value={getTechnicalSpecsValue()}
              onChange={handleTechnicalSpecsChange}
              placeholder='{"marca": "Exemplo", "potencia": "100W", "tensão": "12V"}'
              className="shadow-sm focus:ring-green-500 focus:border-green-500 block w-full sm:text-sm border-gray-300 rounded-md font-mono text-sm"
            />
          </div>
          <p className="mt-1 text-sm text-gray-500">
            Insira os dados técnicos em formato JSON. Exemplo: {"{"}"marca":
            "SolarX", "potencia": "100W", "tensão": "12V"{"}"}
          </p>
        </div>

        <div className="sm:col-span-3">
          <label
            htmlFor="category"
            className="block text-sm font-medium text-gray-700"
          >
            Categoria
          </label>
          <div className="mt-1">
            <select
              id="category"
              name="category"
              value={productForm.category || ""}
              onChange={handleProductFormChange}
              className="shadow-sm focus:ring-green-500 focus:border-green-500 block w-full sm:text-sm border-gray-300 rounded-md"
              required
            >
              <option value="">Selecione uma categoria</option>
              <optgroup label="⚡ Energia Solar - Geração">
                <option value="painel_fotovoltaico">
                  Painéis Fotovoltaicos
                </option>
                <option value="painel_termico">Painéis Solares Térmicos</option>
                <option value="inversores">
                  Inversores (On-grid, Off-grid, Híbrido)
                </option>
                <option value="microinversores">Microinversores</option>
                <option value="controladores">
                  Controladores de Carga (PWM / MPPT)
                </option>
                <option value="kits_solares">
                  Kits de Energia Solar Completo
                </option>
              </optgroup>
              <optgroup label="🔋 Armazenamento e Backup">
                <option value="baterias_litio">
                  Baterias Lítio (LiFePO4, Íon-lítio)
                </option>
                <option value="baterias_gel">
                  Baterias Gel / AGM / Chumbo-ácido
                </option>
                <option value="banco_baterias">Banco de Baterias</option>
                <option value="ups">UPS / No-Break Solares</option>
                <option value="geradores_hibridos">
                  Geradores Solares Híbridos
                </option>
              </optgroup>
              <optgroup label="💧 Bombas e Irrigação Solar">
                <option value="bomba_submersivel">Bombas Submersíveis</option>
                <option value="bomba_superficie">Bombas de Superfície</option>
                <option value="bomba_centrifuga">Bombas Centrífugas</option>
                <option value="bomba_diafragma">Bombas de Diafragma</option>
                <option value="controladores_bomba">
                  Controladores de Bombas
                </option>
                <option value="kits_bombeamento">
                  Kits Solares de Bombeamento
                </option>
                <option value="irrigacao_gotejamento">
                  Sistemas de Irrigação por Gotejamento
                </option>
                <option value="irrigacao_aspersao">
                  Sistemas de Irrigação por Aspersão
                </option>
                <option value="reservatorios">Reservatórios / Cisternas</option>
                <option value="filtros">Filtros de Água</option>
              </optgroup>
              <optgroup label="🔌 Acessórios Elétricos e Estruturas">
                <option value="estruturas_montagem">
                  Estruturas de Montagem
                </option>
                <option value="trackers">
                  Trackers Solares (Seguidor Solar)
                </option>
                <option value="cabos_solares">Cabos Solares</option>
                <option value="conectores_mc4">Conectores MC4</option>
                <option value="disjuntores">Disjuntores / Fusíveis</option>
                <option value="string_box">
                  Quadros Elétricos (String Box)
                </option>
                <option value="caixa_controle">Caixas de Controle</option>
                <option value="protecao_surtos">
                  Dispositivos de Proteção contra Surtos (DPS)
                </option>
              </optgroup>
              <optgroup label="📡 Monitoramento e Automação">
                <option value="monitoramento_iot">
                  Sistemas de Monitoramento IoT
                </option>
                <option value="softwares">
                  Softwares de Gestão de Energia
                </option>
                <option value="sensores">
                  Sensores (Nível de Água, Irradiação, Temperatura)
                </option>
                <option value="medidores">Medidores Bidirecionais</option>
                <option value="controladores_remotos">
                  Controladores Remotos
                </option>
              </optgroup>
              <optgroup label="🌍 Sustentabilidade e Acessórios Verdes">
                <option value="iluminacao_solar">
                  Iluminação Solar (Lampadas, Postes, Holofotes)
                </option>
                <option value="carregadores_solares">
                  Carregadores Solares Portáteis
                </option>
                <option value="kits_emergencia">
                  Kits de Energia para Emergência
                </option>
                <option value="geladeiras_solares">
                  Geladeiras / Freezers Solares
                </option>
                <option value="bombas_calor">Bombas de Calor</option>
                <option value="aquecedores_solares">
                  Aquecedores de Água Solares
                </option>
              </optgroup>
            </select>
          </div>
        </div>

        <div className="sm:col-span-3">
          <label
            htmlFor="stock"
            className="block text-sm font-medium text-gray-700"
          >
            Estoque
          </label>
          <div className="mt-1">
            <input
              type="number"
              name="stock"
              id="stock"
              value={productForm.stock || ""}
              onChange={handleProductFormChange}
              min="0"
              className="shadow-sm focus:ring-green-500 focus:border-green-500 block w-full sm:text-sm border-gray-300 rounded-md"
              required
            />
          </div>
        </div>
      </div>

      <div className="mt-6 flex justify-end space-x-3">
        <button
          type="button"
          onClick={() => {
            setShowProductForm(false);
            setEditingProduct(null);
          }}
          className="bg-white py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
        >
          Cancelar
        </button>
        <button
          type="submit"
          disabled={uploadingImages}
          className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {uploadingImages
            ? "Enviando..."
            : editingProduct
            ? "Atualizar Produto"
            : "Adicionar Produto"}
        </button>
      </div>
    </form>
  );
}
