import { useEffect, useState } from 'react';
import styles from './style/shoppinglist.module.scss';
import { Input } from './components/Input';
import { Button } from './components/Button';
import { FaChevronDown, FaChevronUp, FaTrash } from "react-icons/fa";

interface Product {
  id: number;
  product: string;
  quantity: number;
  unitPrice: number;
  price: number;
}

const loadProductsFromLocalStorage = (): Product[] => {
  const storedProducts = localStorage.getItem('shoppingListProducts');
  const parsedStoreProducts = storedProducts ? JSON.parse(storedProducts) : [];
  return parsedStoreProducts;
};

const saveProductsToLocalStorage = (products: Product[]) => {
  localStorage.setItem('shoppingListProducts', JSON.stringify(products));
}

export function ShoppingList() {
  const [products, setProducts] = useState<Product[]>([]);
  const [product, setProduct] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [unitPrice, setUnitPrice] = useState('');
  const [totalPrice, setTotalPrice] = useState(0);
  const [selectedItem, setSelectedItem] = useState<Product | null>(null);
  const [addButtonClicked, setAddButtonClicked] = useState(false);

  useEffect(() => {
    const storedProducts = loadProductsFromLocalStorage();
    setProducts(storedProducts);

    const storedTotalPrice = localStorage.getItem('shoppingListTotalPrice');
    const parsedTotalPrice = storedTotalPrice ? parseFloat(storedTotalPrice) : 0;
    setTotalPrice(parsedTotalPrice);
  }, []);

  const handleAddItem = () => {
    if (!product || isNaN(parseFloat(unitPrice))) {
      setAddButtonClicked(true);
      return;
    }

    const priceValue = parseFloat(unitPrice.replace(',', '.')) * quantity;
    const newItem: Product = {
      id: Date.now(),
      product,
      quantity,
      unitPrice: parseFloat(unitPrice.replace(',', '.')),
      price: priceValue,
    };

    const updatedProducts = [...products, newItem];

    setProducts(updatedProducts);
    setProduct('');
    setQuantity(1);
    setUnitPrice('');

    const newTotal = totalPrice + priceValue;
    setTotalPrice(newTotal);
    setAddButtonClicked(false);

    setProducts(updatedProducts);

    saveProductsToLocalStorage(updatedProducts);

    if (newTotal !== null) {
      localStorage.setItem('shoppingListTotalPrice', newTotal.toString());
    }
  };

  const handleDeleteItem = (id: number) => {
    const updatedProducts = products.filter(item => item.id !== id);

    setProducts(updatedProducts);

    const newTotal = updatedProducts.reduce((total, item) => total + item.price, 0);
    setTotalPrice(newTotal);

    saveProductsToLocalStorage(updatedProducts);
    localStorage.setItem('shoppingListTotalPrice', newTotal.toString());
  };

  const toggleSelectedItem = (item: Product) => {
    if (selectedItem === item) {
      setSelectedItem(null);
    } else {
      setSelectedItem(item);
    }
  };

  return (
    <div className={styles.main}>
      <h1 className={styles.title}>{"Minha Lista de Compras"}</h1>
      <form onSubmit={e => { e.preventDefault(); handleAddItem(); }}>
        <Input
          type="text"
          placeholder="Produto"
          value={product}
          onChange={e => setProduct(e.target.value)}
          maxLength={30}
          required={addButtonClicked && !product}
        />
        <Input
          type="number"
          inputMode='numeric'
          placeholder="Quantidade"
          value={quantity !== null ? quantity : ''}
          onChange={e => {
            const newValue = e.target.value !== '' ? parseInt(e.target.value) : null;
            if (newValue === null || (newValue >= 1 && newValue <= 99)) {
              setQuantity(newValue !== null ? newValue : 1);
            }
          }}
          min="1"
          max="99"
          required={addButtonClicked && (quantity === null || isNaN(quantity))}
        />
        <Input
          type="text"
          placeholder="Valor Unitário"
          value={unitPrice}
          onChange={e => {
            const inputValue = e.target.value;
            const cleanedValue = inputValue.replace(/[^0-9.,]/g, '');
            const parts = cleanedValue.split(/,|\./);
            if (
              (parts[0].length <= 3 && (parts[1] === undefined || parts[1].length <= 2)) ||
              cleanedValue === ""
            ) {
              setUnitPrice(cleanedValue);
            }
          }}
          required={addButtonClicked && !unitPrice}
        />
        <Button buttonStyle="buttonAdd" onClick={() => {
          setAddButtonClicked(true);
          handleAddItem();
        }}>
          {"Adicionar"}
        </Button>
      </form>
      <ul className={styles.itensList}>
        {products.slice().reverse().map(item => (
          <li key={item.id} className={styles.listItem}>
            <div className={styles.infoProduct}>
              <span>{item.product}</span>
              <div className={styles.infoPriceItem}>
                <span>{" R$ "}{item.price.toFixed(2)}</span>
                <Button buttonStyle="buttonDetails" onClick={() => toggleSelectedItem(item)}>
                  {selectedItem === item ? <FaChevronUp size={22} /> : <FaChevronDown size={22} />}
                </Button>
                <Button buttonStyle="buttonDelete" onClick={() => handleDeleteItem(item.id)}>
                  <FaTrash size={20} />
                </Button>
              </div>
            </div>
            {selectedItem === item && (
              <div className={styles.infoDetailsItem}>
                <p>{"Detalhes do Item:"}</p>
                <p>{"Quantidade:"} {item.quantity}{" x"}</p>
                <p>{"Valor Unitário: R$"}{item.unitPrice.toFixed(2)}</p>
              </div>
            )}
          </li>
        ))}
      </ul>
      <p
        className={styles.infoPrice}
      >
        {"Total:"} {products.length > 0 ? `R$ ${totalPrice.toFixed(2)}` : 'R$ 0.00'}
      </p>
    </div>
  );
}