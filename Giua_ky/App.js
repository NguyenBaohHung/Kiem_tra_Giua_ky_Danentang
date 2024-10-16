import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  TextInput, 
  FlatList, 
  Image, 
  TouchableOpacity, 
  StyleSheet, 
  Keyboard, 
  TouchableWithoutFeedback, 
  Alert 
} from 'react-native';
import { db } from './firebase'; 
import { ref, set, onValue, remove } from "firebase/database"; 

const App = () => {
  const [products, setProducts] = useState([]);
  const [name, setName] = useState('');
  const [type, setType] = useState('');
  const [price, setPrice] = useState('');
  const [imageUri, setImageUri] = useState('');
  const [editingProductId, setEditingProductId] = useState(null); 

  useEffect(() => {
    const productsRef = ref(db, 'products'); 
    

    onValue(productsRef, (snapshot) => {
      const data = snapshot.val();
      const productsArray = [];
      for (let id in data) {
        productsArray.push({ id, ...data[id] }); 
      }
      setProducts(productsArray); 
    });
  }, []);

  const handleAddOrUpdateProduct = async () => {
    const product = { 
      products_name: name,
      products_type: type,
      products_price: parseInt(price), 
      image_url: imageUri || null 
    };

    const productsRef = ref(db, `products/${editingProductId ? editingProductId : Date.now()}`);

    try {
      await set(productsRef, product);
      console.log(editingProductId ? "Product updated" : "Product added");
      resetForm(); 
    } catch (error) {
      console.error("Error adding/updating document: ", error);
    }
  };

  const resetForm = () => {
    setName('');
    setType('');
    setPrice('');
    setImageUri('');
    setEditingProductId(null); 
  };

  
  const handleEditProduct = (product) => {
    setName(product.products_name);
    setType(product.products_type);
    setPrice(product.products_price.toString());
    setImageUri(product.image_url);
    setEditingProductId(product.id); 
  };

  const handleDeleteProduct = async (id) => {
    Alert.alert(
      "Confirm Delete",
      "Are you sure you want to delete this product?",
      [
        { text: "Cancel", style: "cancel" },
        { text: "OK", onPress: async () => {
            try {
              const productRef = ref(db, `products/${id}`);
              await remove(productRef);
              console.log('Product deleted with ID: ', id);
            } catch (error) {
              console.error('Error deleting product', error);
            }
          } 
        },
      ],
      { cancelable: false }
    );
  };

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
      <View style={styles.container}>
        <Text style={styles.title}>{editingProductId ? 'Edit Product' : 'Add New Product'}</Text>
        <TextInput
          placeholder="Product Name"
          value={name}
          onChangeText={setName}
          style={styles.input}
        />
        <TextInput
          placeholder="Product Type"
          value={type}
          onChangeText={setType}
          style={styles.input}
        />
        <TextInput
          placeholder="Price"
          value={price}
          onChangeText={setPrice}
          style={styles.input}
          keyboardType="numeric"
        />
        <TouchableOpacity style={styles.imageButton} onPress={() => {}}>
          <Text style={styles.imageButtonText}>Pick Image</Text>
        </TouchableOpacity>
        {imageUri ? (
          <Image source={{ uri: imageUri }} style={styles.image} />
        ) : null}
        <TouchableOpacity style={styles.addButton} onPress={handleAddOrUpdateProduct}>
          <Text style={styles.addButtonText}>{editingProductId ? 'Update Product' : 'Add Product'}</Text>
        </TouchableOpacity>

        <Text style={styles.listTitle}>Product List</Text>
        <FlatList
          data={products}
          keyExtractor={(item) => item.id} 
          renderItem={({ item }) => (
              <View style={styles.productCard}>
                  <Text style={styles.productName}>{item.products_name}</Text>
                  <Text style={styles.productType}>{item.products_type}</Text>
                  <Text style={styles.productPrice}>${item.products_price}</Text>
                  {item.image_url && (
                      <Image source={{ uri: item.image_url }} style={styles.productImage} />
                  )}
                  <View style={styles.buttonsContainer}>
                      <TouchableOpacity style={styles.editButton} onPress={() => handleEditProduct(item)}>
                          <Text style={styles.editButtonText}>Edit</Text>
                      </TouchableOpacity>
                      <TouchableOpacity style={styles.deleteButton} onPress={() => handleDeleteProduct(item.id)}>
                          <Text style={styles.deleteButtonText}>Delete</Text>
                      </TouchableOpacity>
                  </View>
              </View>
          )}
      />
      </View>
    </TouchableWithoutFeedback>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f5f5f5',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 5,
    padding: 10,
    marginBottom: 10,
    backgroundColor: '#fff',
  },
  imageButton: {
    backgroundColor: '#3498db',
    padding: 10,
    borderRadius: 5,
    marginBottom: 10,
    alignItems: 'center',
  },
  imageButtonText: {
    color: '#fff',
    fontSize: 16,
  },
  image: {
    width: 100,
    height: 100,
    alignSelf: 'center',
    marginBottom: 10,
  },
  addButton: {
    backgroundColor: '#27ae60',
    padding: 15,
    borderRadius: 5,
    alignItems: 'center',
  },
  addButtonText: {
    color: '#fff',
    fontSize: 18,
  },
  listTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    marginTop: 20,
    marginBottom: 10,
    textAlign: 'center',
  },
  productCard: {
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 10,
    marginBottom: 10,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  productName: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  productType: {
    fontSize: 16,
    color: '#7f8c8d',
  },
  productPrice: {
    fontSize: 16,
    color: '#e74c3c',
  },
  productImage: {
    width: 100,
    height: 100,
    marginTop: 10,
    borderRadius: 5,
  },
  buttonsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10,
  },
  editButton: {
    backgroundColor: '#f39c12',
    padding: 5,
    borderRadius: 5,
    width: '45%',
    alignItems: 'center',
  },
  deleteButton: {
    backgroundColor: '#e74c3c',
    padding: 5,
    borderRadius: 5,
    width: '45%',
    alignItems: 'center',
  },
  editButtonText: {
    color: '#fff',
  },
  deleteButtonText: {
    color: '#fff',
  },
});

export default App;
