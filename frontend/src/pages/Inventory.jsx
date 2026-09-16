import React, { useState, useEffect, useMemo, useRef } from 'react';
import {
  IconSearch,
  IconFilter,
  IconEdit,
  IconTrash,
  IconChevronDown
} from '../assets/icons';
import { getProductImage } from '../assets/productImages';
import InventoryForm from '../components/InventoryForm';
import ProductForm, { DEFAULT_CATEGORIES } from '../components/ProductForm';
import DeleteModal from '../components/DeleteModal';
import { PRODUCTS_API_URL, CATEGORIES_API_URL } from '../config/api';
import './Inventory.css';

const ITEMS_PER_PAGE = 5;

const Inventory = () => {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState(DEFAULT_CATEGORIES);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  
  // Filtros
  const [categoryFilter, setCategoryFilter] = useState('ALL');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const filterRef = useRef(null);

  // Modales
  const [selectedForInventory, setSelectedForInventory] = useState(null);
  const [selectedForEdit, setSelectedForEdit] = useState(null);
  const [selectedForDelete, setSelectedForDelete] = useState(null);
  const [isCreatingProduct, setIsCreatingProduct] = useState(false);

  // Paginación
  const [currentPage, setCurrentPage] = useState(1);

  const API_URL = PRODUCTS_API_URL;

  // Cargar categorías desde MongoDB
  const loadCategories = () => {
    fetch(CATEGORIES_API_URL)
      .then((res) => {
        if (!res.ok) throw new Error('Categories API error');
        return res.json();
      })
      .then((data) => {
        if (Array.isArray(data) && data.length > 0) {
          setCategories(data);
        }
      })
      .catch((err) => {
        console.error('Error cargando categorías desde MongoDB:', err);
      });
  };

  // Cargar productos directamente desde MongoDB
  const loadProducts = () => {
    setLoading(true);
    fetch(API_URL)
      .then((res) => {
        if (!res.ok) throw new Error('Products API error');
        return res.json();
      })
      .then((data) => {
        if (Array.isArray(data)) {
          setProducts(data);
        } else {
          setProducts([]);
        }
      })
      .catch((err) => {
        console.error('Error cargando productos desde MongoDB:', err);
        setProducts([]);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  useEffect(() => {
    loadCategories();
    loadProducts();
  }, []);

  // Cerrar el dropdown de filtro al hacer clic fuera
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (filterRef.current && !filterRef.current.contains(e.target)) {
        setIsFilterOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Formato de moneda (ej: $3.000)
  const formatCurrency = (val) => {
    if (val === undefined || val === null) return '$0';
    return '$' + Number(val).toLocaleString('es-CO');
  };

  // Determinar estado de stock y estilo
  const getProductStatus = (stock, minStock) => {
    const s = Number(stock) || 0;
    const min = Number(minStock) || 5;

    if (s <= 0) {
      return { label: 'AGOTADO', colorClass: 'status-agotado' };
    }
    if (s <= 2) {
      return { label: 'ALERTA', colorClass: 'status-alerta' };
    }
    if (s <= min) {
      return { label: 'BAJO', colorClass: 'status-bajo' };
    }
    return { label: 'ACTIVO', colorClass: 'status-activo' };
  };

  // Obtener clase de color para categoría
  const getCategoryColorClass = (dept = '') => {
    const d = dept.toUpperCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
    if (d.includes('PAN')) return 'cat-panes';
    if (d.includes('REPOST')) return 'cat-reposteria';
    if (d.includes('PASA') || d.includes('HORNEA')) return 'cat-pasabocas';
    if (d.includes('DESAYUN')) return 'cat-desayunos';
    if (d.includes('COMBO')) return 'cat-combos';
    if (d.includes('BEBIDA') && d.includes('CALIENTE')) return 'cat-bebidas-calientes';
    if (d.includes('BEBIDA') && d.includes('FRIA')) return 'cat-bebidas-frias';
    if (d.includes('CALIENTE') || d.includes('CAFE') || d.includes('TINTO') || d.includes('CAPUCHINO')) return 'cat-bebidas-calientes';
    if (d.includes('FRIA') || d.includes('JUGO') || d.includes('SMOOTHIE')) return 'cat-bebidas-frias';
    if (d.includes('GASEOSA') || d.includes('SODA')) return 'cat-gaseosas';
    if (d.includes('LACTEO') || d.includes('LECHE') || d.includes('YOGUR')) return 'cat-lacteos';
    if (d.includes('VARIO')) return 'cat-varios';
    return 'cat-default';
  };

  // Guardar Ajuste de Inventario / Producto en MongoDB
  const handleSaveInventory = (productId, updateData) => {
    const payload = typeof updateData === 'number' ? { stock: updateData } : updateData;

    fetch(`${API_URL}/${productId}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    })
      .then((res) => {
        if (!res.ok) throw new Error('Error al actualizar en MongoDB');
        return res.json();
      })
      .then((updated) => {
        setProducts((prev) =>
          prev.map((p) => (p.id === updated.id || p._id === updated.id ? { ...p, ...updated } : p))
        );
      })
      .catch((err) => {
        console.error('Error al actualizar inventario en MongoDB:', err);
        alert('Error al guardar en MongoDB: ' + err.message);
      });
  };

  // Guardar o Crear Producto en MongoDB
  const handleSaveProduct = (productData) => {
    if (productData.id) {
      // Edición de producto existente en MongoDB
      fetch(`${API_URL}/${productData.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(productData)
      })
        .then((res) => {
          if (!res.ok) throw new Error('Error al actualizar producto');
          return res.json();
        })
        .then((updated) => {
          setProducts((prev) =>
            prev.map((p) => (p.id === updated.id || p._id === updated.id ? updated : p))
          );
        })
        .catch((err) => {
          console.error('Error al actualizar producto en MongoDB:', err);
          alert('Error al actualizar producto en MongoDB: ' + err.message);
        });
    } else {
      // Creación de nuevo producto en MongoDB
      fetch(API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(productData)
      })
        .then((res) => {
          if (!res.ok) throw new Error('Error al crear producto');
          return res.json();
        })
        .then((created) => {
          setProducts((prev) => [created, ...prev]);
        })
        .catch((err) => {
          console.error('Error al registrar producto en MongoDB:', err);
          alert('Error al registrar producto en MongoDB: ' + err.message);
        });
    }
  };

  // Eliminar Producto en MongoDB
  const handleDeleteProduct = (productId) => {
    fetch(`${API_URL}/${productId}`, {
      method: 'DELETE'
    })
      .then((res) => {
        if (!res.ok) throw new Error('Error al eliminar producto');
        return res.json();
      })
      .then(() => {
        setProducts((prev) => prev.filter((p) => p.id !== productId && p._id !== productId));
      })
      .catch((err) => {
        console.error('Error al eliminar producto en MongoDB:', err);
        alert('Error al eliminar producto en MongoDB: ' + err.message);
      });
  };

  // Filtrado de productos
  const filteredProducts = useMemo(() => {
    return products.filter((product) => {
      // Búsqueda por texto (Nombre o Código)
      const term = searchTerm.toLowerCase().trim();
      const matchesSearch =
        !term ||
        product.name.toLowerCase().includes(term) ||
        (product.code && product.code.toLowerCase().includes(term)) ||
        (product.department && product.department.toLowerCase().includes(term));

      // Filtro por categoría (soporta tanto _id de Mongo como nombre de categoría)
      const selectedCatObj = categories.find((c) => c._id === categoryFilter);
      const matchesCategory =
        categoryFilter === 'ALL' ||
        product.id_categoria === categoryFilter ||
        (product.id_categoria && product.id_categoria._id === categoryFilter) ||
        (product.department &&
          (product.department.toUpperCase() === categoryFilter.toUpperCase() ||
           (selectedCatObj && selectedCatObj.nombre_categoria.toUpperCase() === product.department.toUpperCase())));

      // Filtro por estado
      const statusInfo = getProductStatus(product.stock, product.minStock);
      const matchesStatus =
        statusFilter === 'ALL' || statusInfo.label === statusFilter;

      return matchesSearch && matchesCategory && matchesStatus;
    });
  }, [products, searchTerm, categoryFilter, statusFilter]);

  // Paginación
  const totalItems = filteredProducts.length;
  const totalPages = Math.max(1, Math.ceil(totalItems / ITEMS_PER_PAGE));
  const validPage = Math.min(currentPage, totalPages);

  const paginatedProducts = useMemo(() => {
    const startIdx = (validPage - 1) * ITEMS_PER_PAGE;
    return filteredProducts.slice(startIdx, startIdx + ITEMS_PER_PAGE);
  }, [filteredProducts, validPage]);

  const startRecordIndex = totalItems === 0 ? 0 : (validPage - 1) * ITEMS_PER_PAGE + 1;
  const endRecordIndex = Math.min(validPage * ITEMS_PER_PAGE, totalItems);

  return (
    <div className="inventory-page-wrapper">
      {/* Top Toolbar: Search & Filter Capsules */}
      <div className="inventory-top-toolbar">
        {/* BUSCAR Capsule Input */}
        <div className="search-capsule-container">
          <span className="search-icon">
            <IconSearch size={22} color="#8E8E8E" />
          </span>
          <input
            type="text"
            className="search-capsule-input"
            placeholder="B U S C A R"
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setCurrentPage(1);
            }}
          />
          {searchTerm && (
            <button
              className="clear-search-btn"
              onClick={() => setSearchTerm('')}
              title="Limpiar búsqueda"
            >
              &times;
            </button>
          )}
        </div>

        {/* Right Controls: Filter & Add Product */}
        <div className="toolbar-actions">
          {/* FILTRO Capsule Button */}
          <div className="filter-dropdown-wrapper" ref={filterRef}>
            <button
              className={`filter-capsule-btn ${categoryFilter !== 'ALL' || statusFilter !== 'ALL' ? 'active-filter' : ''}`}
              onClick={() => setIsFilterOpen(!isFilterOpen)}
            >
              <IconFilter size={20} color="#8E8E8E" />
              <span className="filter-text">F I L T R O</span>
              <IconChevronDown size={14} color="#8E8E8E" />
            </button>

            {isFilterOpen && (
              <div className="filter-menu-popover">
                <div className="filter-section">
                  <span className="filter-section-title">Categoría</span>
                  <div className="filter-options">
                    <button
                      className={`filter-chip ${categoryFilter === 'ALL' ? 'selected' : ''}`}
                      onClick={() => {
                        setCategoryFilter('ALL');
                        setCurrentPage(1);
                      }}
                    >
                      Todas
                    </button>
                    {categories.map((cat) => (
                      <button
                        key={cat._id}
                        className={`filter-chip ${categoryFilter === cat._id ? 'selected' : ''}`}
                        onClick={() => {
                          setCategoryFilter(cat._id);
                          setCurrentPage(1);
                        }}
                      >
                        {cat.nombre_categoria}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="filter-section">
                  <span className="filter-section-title">Estado de Stock</span>
                  <div className="filter-options">
                    {['ALL', 'ACTIVO', 'ALERTA', 'BAJO', 'AGOTADO'].map((st) => (
                      <button
                        key={st}
                        className={`filter-chip ${statusFilter === st ? 'selected' : ''}`}
                        onClick={() => {
                          setStatusFilter(st);
                          setCurrentPage(1);
                        }}
                      >
                        {st === 'ALL' ? 'Todos' : st}
                      </button>
                    ))}
                  </div>
                </div>

                {(categoryFilter !== 'ALL' || statusFilter !== 'ALL') && (
                  <button
                    className="filter-reset-btn"
                    onClick={() => {
                      setCategoryFilter('ALL');
                      setStatusFilter('ALL');
                      setIsFilterOpen(false);
                    }}
                  >
                    Limpiar Filtros
                  </button>
                )}
              </div>
            )}
          </div>

          {/* Quick Add Product Button */}
          <button
            className="btn-add-product"
            onClick={() => setIsCreatingProduct(true)}
            title="Registrar nuevo producto"
          >
            + NUEVO PRODUCTO
          </button>
        </div>
      </div>

      {/* Main Inventory Table */}
      <div className="table-responsive-container">
        <table className="inventory-table">
          <thead>
            <tr>
              <th className="th-cell th-imagen">
                <span className="pill-header">IMAGEN</span>
              </th>
              <th className="th-cell th-nombre">
                <span className="pill-header">NOMBRE</span>
              </th>
              <th className="th-cell th-categoria">
                <span className="pill-header">CATEGORIA</span>
              </th>
              <th className="th-cell th-precio">
                <span className="pill-header">PRECIO VENTA</span>
              </th>
              <th className="th-cell th-stock">
                <span className="pill-header">STOCK</span>
              </th>
              <th className="th-cell th-estado">
                <span className="pill-header">ESTADO</span>
              </th>
              <th className="th-cell th-acciones">
                <span className="pill-header">ACCIONES</span>
              </th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan="7" className="table-empty-message">
                  Cargando productos del inventario...
                </td>
              </tr>
            ) : paginatedProducts.length === 0 ? (
              <tr>
                <td colSpan="7" className="table-empty-message">
                  No se encontraron productos con los criterios seleccionados.
                </td>
              </tr>
            ) : (
              paginatedProducts.map((product) => {
                const statusInfo = getProductStatus(product.stock, product.minStock);
                const categoryClass = getCategoryColorClass(product.department);
                const imageSrc = getProductImage(product.name, product.code, product.department);

                return (
                  <tr key={product.id} className="inventory-row">
                    {/* IMAGEN */}
                    <td className="td-cell td-imagen">
                      <div className="product-image-container">
                        <img
                          src={imageSrc}
                          alt={product.name}
                          className="product-img"
                          loading="lazy"
                        />
                      </div>
                    </td>

                    {/* NOMBRE & CÓDIGO */}
                    <td className="td-cell td-nombre">
                      <div className="product-name-block">
                        <span className="product-name-title">{product.name}</span>
                        <span className="product-code-subtitle">{product.code}</span>
                      </div>
                    </td>

                    {/* CATEGORIA */}
                    <td className="td-cell td-categoria">
                      <span className={`category-tag ${categoryClass}`}>
                        {product.department || 'GENERAL'}
                      </span>
                    </td>

                    {/* PRECIO VENTA */}
                    <td className="td-cell td-precio">
                      <span className="price-tag">
                        {formatCurrency(product.price1)}
                      </span>
                    </td>

                    {/* STOCK */}
                    <td className="td-cell td-stock">
                      <span className="stock-number">{product.stock || 0}</span>
                    </td>

                    {/* ESTADO */}
                    <td className="td-cell td-estado">
                      <span className={`status-tag ${statusInfo.colorClass}`}>
                        {statusInfo.label}
                      </span>
                    </td>

                    {/* ACCIONES */}
                    <td className="td-cell td-acciones">
                      <div className="action-buttons-group">
                        {/* Botón Editar / Ajustar Stock */}
                        <button
                          className="action-btn edit-action-btn"
                          title="Ajustar inventario / Editar producto"
                          onClick={() => setSelectedForInventory(product)}
                        >
                          <IconEdit size={19} color="var(--primary-teal)" />
                        </button>

                        {/* Botón Eliminar */}
                        <button
                          className="action-btn delete-action-btn"
                          title="Eliminar producto"
                          onClick={() => setSelectedForDelete(product)}
                        >
                          <IconTrash size={19} color="var(--status-alerta)" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {/* Footer / Pagination matching mockup: "Mostrando 1 a 5 de 200 productos" and "< 1 2 3 ... 5 >" */}
      <div className="inventory-footer-toolbar">
        <div className="record-counter">
          Mostrando {startRecordIndex} a {endRecordIndex} de {totalItems} productos
        </div>

        <div className="pagination-controls">
          <button
            className="page-btn page-arrow"
            disabled={validPage <= 1}
            onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
            title="Página anterior"
          >
            &lt;
          </button>

          {Array.from({ length: totalPages }, (_, i) => i + 1).map((num) => (
            <button
              key={num}
              className={`page-btn page-num ${validPage === num ? 'active-page' : ''}`}
              onClick={() => setCurrentPage(num)}
            >
              {num}
            </button>
          ))}

          <button
            className="page-btn page-arrow"
            disabled={validPage >= totalPages}
            onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
            title="Página siguiente"
          >
            &gt;
          </button>
        </div>
      </div>

      {/* Modal: Ajustar Inventario */}
      {selectedForInventory && (
        <InventoryForm
          product={selectedForInventory}
          categories={categories}
          onClose={() => setSelectedForInventory(null)}
          onSave={handleSaveInventory}
        />
      )}

      {/* Modal: Crear Nuevo Producto */}
      {isCreatingProduct && (
        <ProductForm
          initialData={null}
          categories={categories}
          onClose={() => setIsCreatingProduct(false)}
          onSave={handleSaveProduct}
        />
      )}

      {/* Modal: Editar Producto Completo */}
      {selectedForEdit && (
        <ProductForm
          initialData={selectedForEdit}
          categories={categories}
          onClose={() => setSelectedForEdit(null)}
          onSave={handleSaveProduct}
        />
      )}

      {/* Modal: Confirmar Eliminación */}
      {selectedForDelete && (
        <DeleteModal
          product={selectedForDelete}
          onClose={() => setSelectedForDelete(null)}
          onConfirm={handleDeleteProduct}
        />
      )}
    </div>
  );
};

export default Inventory;
