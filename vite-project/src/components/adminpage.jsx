import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './AdminPage.css';
function AddProduct() {
  const [product, setProduct] = useState({
    category: 'Computers',
    description: '',
    price: '',
    productname: '',
    shopname: 'shop14', // Pre-defined shopname
    stock: '',
  });
  const [products, setProducts] = useState([]);
  const [isEditing, setIsEditing] = useState(false);
  const [editProductId, setEditProductId] = useState(null);
  const [showAddProductForm, setShowAddProductForm] = useState(false); // Control the visibility of the "Add Product" form
  const apiUrl =
    'https://firestore.googleapis.com/v1/projects/digig-57d5f/databases/(default)/documents/Products';
  const [searchInput, setSearchInput] = useState('');
  const [filteredProducts, setFilteredProducts] = useState([]);
  const firebaseStorageUrl =
    'https://firebasestorage.googleapis.com/v0/b/digig-57d5f.appspot.com/o';
  useEffect(() => {
    axios
      .get(apiUrl)
      .then((response) => {
        const productList = response.data.documents.map((doc) => ({
          id: doc.name.split('/').pop(),
          fields: doc.fields,
        }));
        setProducts(productList);
        setFilteredProducts(productList);
      })
      .catch((error) => {
        console.error('Error fetching products: ', error);
      });
  }, []);
  useEffect(() => {
    const searchTerm = searchInput.toLowerCase();
    const filtered = products.filter((product) =>
      product.fields.productname.stringValue.toLowerCase().includes(searchTerm)
    );
    setFilteredProducts(filtered);
  }, [searchInput, products]);
  const handleSearch = () => {
    const searchTerm = searchInput.toLowerCase();
    const filtered = products.filter((product) =>
      product.fields.productname.stringValue.toLowerCase().includes(searchTerm)
    );
    setFilteredProducts(filtered);
  };
  const handleAddProduct = async () => {
    const imageFile = product.imageUrl;
    const imageName = imageFile.name;
    const imageRef =
      firebaseStorageUrl + '/' + encodeURIComponent(imageName) + '?alt=media';
    const payload = {
      fields: {
        category: { stringValue: product.category },
        description: { stringValue: product.description },
        price: { doubleValue: parseFloat(product.price) },
        productname: { stringValue: product.productname },
        shopname: { stringValue: product.shopname },
        stock: { integerValue: parseInt(product.stock, 10) },
        imageUrl: { stringValue: imageRef },
      },
    };
    try {
      // Upload the image to Firebase Storage
      const imageUploadResponse = await axios.post(imageRef, imageFile, {
        headers: {
          'Content-Type': imageFile.type,
        },
      });
      if (imageUploadResponse.status === 200) {
        // Image uploaded successfully, now add the product
        const productAddResponse = await axios.post(apiUrl, payload);
        if (productAddResponse.status === 200) {
          const newProduct = {
            id: productAddResponse.data.name.split('/').pop(),
            fields: payload.fields,
          };

          const updatedProducts = [...products, newProduct];
          setProducts(updatedProducts);
          setFilteredProducts(updatedProducts);
          setProduct({
            category: 'Computers',
            description: '',
            price: '',
            productname: '',
            shopname: 'shop14',
            stock: '',
            imageUrl: '',
          });

          setShowAddProductForm(false); // Close the form after adding a product

        } else {

          console.log('Error: Product addition failed');

        }

      } else {

        console.log('Error: Image upload failed');

      }

    } catch (error) {

      console.error('Error: ', error);

    }

  };
  const handleDeleteProduct = async (id) => {

    const confirmDelete = window.confirm(

      'Are you sure you want to delete this product?'

    );

    if (confirmDelete) {

      try {

        const response = await axios.delete(`${apiUrl}/${id}`);

        if (response.status === 200) {

          const updatedProducts = products.filter((product) => product.id !== id);

          setProducts(updatedProducts);

          setFilteredProducts(updatedProducts);

        } else {

          console.log('Error: Product deletion failed');

        }

      } catch (error) {

        console.error('Error: ', error);

      }

    }

  };
  const handleEditProduct = (id) => {

    const editedProduct = products.find((product) => product.id === id);

    setProduct({

      category: 'Computers',

      description: editedProduct.fields.description.stringValue,

      price: editedProduct.fields.price.doubleValue,

      productname: editedProduct.fields.productname.stringValue,

      shopname: 'shop14', // Pre-defined shopname

      stock: editedProduct.fields.stock.integerValue,

      imageUrl: editedProduct.fields.imageUrl.stringValue,

    });

    setEditProductId(id);

    setIsEditing(true);

    setShowAddProductForm(true); // Show the "Add Product" form when editing

  };
  const handleSaveEdit = async () => {

    const imageFile = product.imageUrl;

    const imageName = imageFile.name;

    const imageRef =

      firebaseStorageUrl + '/' + encodeURIComponent(imageName) + '?alt=media';



    const payload = {

      fields: {

        category: { stringValue: 'Computers' },

        description: { stringValue: product.description },

        price: { doubleValue: parseFloat(product.price) },

        productname: { stringValue: product.productname },

        shopname: { stringValue: 'Shop14' }, // Pre-defined shopname

        stock: { integerValue: parseInt(product.stock, 10) },

        imageUrl: { stringValue: imageRef },

      },

    };



    try {

      // Upload the new image to Firebase Storage

      const imageUploadResponse = await axios.post(imageRef, imageFile, {

        headers: {

          'Content-Type': imageFile.type,

        },

      });
      if (imageUploadResponse.status === 200) {

        // Image uploaded successfully, now update the product

        const productUpdateResponse = await axios.patch(

          `${apiUrl}/${editProductId}`,

          payload

        );

        if (productUpdateResponse.status === 200) {

          const updatedProducts = products.map((p) =>

            p.id === editProductId ? { ...p, fields: payload.fields } : p

          );

          setProducts(updatedProducts);

          setFilteredProducts(updatedProducts);

          setIsEditing(false);

          setEditProductId(null);

          setProduct({

            category: 'Computers',

            description: '',

            price: '',

            productname: '',

            shopname: 'shop14',

            stock: '',

            imageUrl: '',

          });

          setShowAddProductForm(false); // Close the form after saving edit

        } else {

          console.log('Error: Product editing failed');

        }

      } else {

        console.log('Error: Image upload failed');

      }

    } catch (error) {

      console.error('Error: ', error);

    }

  };
  const handleCancelEdit = () => {

    setIsEditing(false);

    setEditProductId(null);

    setProduct({

      category: 'Comuters',

      description: '',

      price: '',

      productname: '',

      shopname: 'shop14',

      stock: '',

      imageUrl: '',

    });

    setShowAddProductForm(false); // Close the form when canceling edit

  };
  return (

    <div className="add-product-pages">

      <div className="add-product-containers">

        <h1>{isEditing ? 'Edit Product' : 'Add Product'}</h1>

        {/* Button to toggle the "Add Product" form */}

        <button onClick={() => setShowAddProductForm(!showAddProductForm)}>

          {showAddProductForm ? 'Close Form' : 'Add Product'}

        </button>
        {/* "Add Product" form */}

        {showAddProductForm && (

          <div className="product-forms">

            <div>

              <label>Category</label>

              <input

                type="text"

                value={product.category}

                disabled

              />

            </div>

            <div>

              <label>Description:</label>
              <input
                type="text"
                value={product.description}
                onChange={(e) =>
                  setProduct({ ...product, description: e.target.value })
                }
              />
            </div>
            <div>
              <label>Price:</label>
              <input
                type="number"
                value={product.price}
                onChange={(e) =>
                  setProduct({ ...product, price: e.target.value })
                }
              />
            </div>
            <div>
              <label>Product Name:</label>
              <input
                type="text"
                value={product.productname}
                onChange={(e) =>
                  setProduct({ ...product, productname: e.target.value })
                }
              />
            </div>
            <div>
              <label>Shop Name:</label>
              <input
                type="text"
                value={product.shopname}
                disabled
              />
            </div>
            <div>
              <label>Stock:</label>
              <input
                type="number"
                value={product.stock}
                onChange={(e) =>
                  setProduct({ ...product, stock: e.target.value })
                }
              />
            </div>
            <div>
              <label>Image File:</label>
              <input
                type="file"
                onChange={(e) =>
                  setProduct({ ...product, imageUrl: e.target.files[0] })
                }
              />
            </div>
            {isEditing ? (
              <div>
                <button onClick={handleSaveEdit}>Save Edit</button>
                <button onClick={handleCancelEdit}>Cancel Edit</button>
              </div>
            ) : (
              <button onClick={handleAddProduct}>Add Product</button>
            )}
          </div>
        )}
      </div>
      <div className="product-lists">
        <h2 className="ProductListName">Product List</h2>
        <div className="product-searches">
          <input
            type="text"
            placeholder="Search by product name"
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
          />
          <button onClick={handleSearch}>Search</button>
        </div>
        <ul>
          {filteredProducts.map((product) => (
            <div className="product-items" key={product.id}>
              <div className="product-cards">
                <div className="product-images">
                  <img
                    src={product.fields.imageUrl?.stringValue}
                    alt={product.fields.productname?.stringValue}
                  />
                </div>
                <div className="product-details-1">
                  <strong>{product.fields.productname?.stringValue}</strong>
                  <p><strong>Description:</strong></p>
                  <p><strong>{product.fields.description?.stringValue}</strong></p>
                  <p><strong>Price: ₹{product.fields.price?.doubleValue}</strong></p>
                  <p><strong>Stock: {product.fields.stock?.integerValue}</strong></p>
                  <div className="product-buttons-2">
                    <button onClick={() => handleDeleteProduct(product.id)}>Delete</button>
                    <button onClick={() => handleEditProduct(product.id)}>Edit</button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </ul>
      </div>
    </div>
  );
}
export default AddProduct;