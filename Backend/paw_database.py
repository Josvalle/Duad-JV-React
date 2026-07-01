from sqlalchemy import create_engine, MetaData,Table, insert, select,update, delete, and_,or_, join 

engine = create_engine('postgresql://postgres:!23J0$ue@localhost:5432/postgres')
metadata_obj = MetaData()

class User:
    def __init__(self):
        self.users_table = Table('users', metadata_obj, autoload_with=engine, schema='paw_store')
    

    def user_login(self,email,password):
        try:
            user_look = select(self.users_table).where(self.users_table.c.email == email).where(self.users_table.c.password == password)
            with engine.connect() as conn:
                result = conn.execute(user_look)
                users = result.all()
                if(len(users)==0):
                    return None
                else:
                    return users[0]
        except:
            return('Something when wrong!')


class Products:
    def __init__(self):
        self.products_table = Table('products', metadata_obj, autoload_with=engine, schema='paw_store')
        
        
    def new_product(self,value):
        try:
            adding_product = insert(self.products_table).values(value)
            with engine.begin() as conn:
                result = conn.execute(adding_product)
        except Exception as e:
            print(f"Error: {e}")
            return None
    def get_products(self):
        try:
            product_list = select(self.products_table).order_by(self.products_table.c.id)
            with engine.begin() as conn:
                    query = conn.execute(product_list)
                    result = [dict(row._mapping) for row in query]
            return result
        except:
            return('Something when wrong')
    
    def get_product_by_id(self,id):
        try:
            detail_product = select(self.products_table).where(self.products_table.c.id == id)
            with engine.begin() as conn:
                    query = conn.execute(detail_product).first()
                    result = dict(query._mapping) 
            return result
        except Exception as ex:
            print(ex)
    
    def verify_available_stock(self):
        try:
            stock = select(self.products_table.c.id,self.products_table.c.stock).order_by(self.products_table.c.id)
            with engine.connect() as conn:
                    query = conn.execute(stock).mappings().all()
                    stocks = [dict(rows) for rows in query]
            return stocks
            
        except Exception as ex:
            print(ex)
    
    def update_inventory(self,id,user_inputs):
        try:
            stmt = (update(self.products_table).where(self.products_table.c.id == id).values(user_inputs))
            with engine.begin() as conn:
                    result = conn.execute(stmt)
        except:
            return('Something when wrong!')
    
    def update_stok_reduce(self,id,new_stock):
        try:
            stmt = (update(self.products_table).where(self.products_table.c.id == id).values(stock=self.products_table.c.stock - new_stock))
            with engine.begin() as conn:
                    conn.execute(stmt)
                    
                    
                    return True
        except Exception as e:
            
            print(e)
            return('Something when wrong!')
    
    def update_stok_add(self,id,new_stock):
        
        try:
            stmt = (update(self.products_table).where(self.products_table.c.id == id).values(stock=self.products_table.c.stock + new_stock))
            with engine.begin() as conn:
                    result = conn.execute(stmt)
                    
                    return True
        except Exception as e:
            print(e)
            return('Something when wrong!')
        
    def delete_product(self,id):
        try:
            delete_item = delete(self.products_table).where(self.products_table.c.id == id )
            with engine.begin() as conn:
                    result = conn.execute(delete_item)
                    
        except Exception as ex:
            print(ex)


class Cart:
    def __init__(self):
        self.cart_table = Table('cart_items', metadata_obj, autoload_with=engine, schema='paw_store')
        self.products = Products()
        self.products_table = self.products.products_table

    def new_item_cart(self,user_id_v,product_id_v,quantity):
        try:
            adding_item = insert(self.cart_table).values(user_id = user_id_v, product_id = product_id_v, cantidad = quantity)
            with engine.begin() as conn:
                result = conn.execute(adding_item)
                return True
        except Exception as e:
            print(f"Error: {e}")
            return None
    
    def get_cart_item(self,user_id):
        try:
            product_query = select(self.products_table.c.id,
                                    self.products_table.c.imagen,
                                    self.products_table.c.nombre,
                                    self.products_table.c.precio,
                                    self.cart_table.c.cantidad).join(
                                        self.products_table,
                                        self.cart_table.c.product_id == self.products_table.c.id
                                    ).where(
                                        self.cart_table.c.user_id == user_id
                                    )
            with engine.begin() as conn:
                query = conn.execute(product_query)
                result = [dict(row._mapping) for row in query]

            return result
            
        except Exception as e:
            print(f"Error: {e}")
            return('Something when wrong')
    
    def update_quantity(self,p_id,op_type):
        try:
            if(op_type == 'add'):
                add_cart = (update(self.cart_table).where(self.cart_table.c.product_id == p_id).values(cantidad = self.cart_table.c.cantidad + 1))
                with engine.begin() as conn:
                    result = conn.execute(add_cart)
                    return True
            elif(op_type ==  'less'):
                less_cart = (update(self.cart_table).where(self.cart_table.c.product_id == p_id).values(cantidad = self.cart_table.c.cantidad - 1))
                with engine.begin() as conn:
                    result = conn.execute(less_cart)
                    return True
        except Exception as e:
            print(e)
            return('Something when wrong!')
    
    
    def delete_from_cart(self,user_id, product_id):
        try:
            remove_cart_item = delete(self.cart_table).where(and_(self.cart_table.c.user_id == user_id, self.cart_table.c.product_id == product_id))
            with engine.begin() as conn:
                result = conn.execute(remove_cart_item)
                return True
        except Exception as e:
            print(e)
            return('Something when wrong!')
        
    def clear_cart(self,user_id):
        try:
            clear_cart_checkout = delete(self.cart_table).where(self.cart_table.c.user_id == user_id)
            with engine.begin() as conn:
                result = conn.execute(clear_cart_checkout)
                return True
        except Exception as e:
            print(e)
            return('Something when wrong!')
        

class Shipping:
    def __init__(self):
        self.shipping_table = Table('shipping_address', metadata_obj, autoload_with=engine, schema='paw_store')
    

    def insert_new_address(self,user_id, name, email, address, phone):
        try:
            adding_address = insert(self.shipping_table).returning(self.shipping_table.c.id).values(user_id = user_id, nombre_completo = name, correo = email, direccion = address, telefono = phone)
            with engine.begin() as conn:
                result = conn.execute(adding_address).scalar()
                return result
        except Exception as e:
            print(f"Error: {e}")
            return None


class Invoice:
    def __init__(self):
        self.invoice_table = Table('invoice', metadata_obj, autoload_with=engine, schema='paw_store')

    def insert_new_invoice(self, user_id,shipping_id,total):
        try:
            adding_invoice = insert(self.invoice_table).returning(self.invoice_table.c.id).values(user_id = user_id, shipping_id = shipping_id, total = total)
            with engine.begin() as conn:
                result = conn.execute(adding_invoice).scalar()
                return result
        except Exception as e:
            print(f"Error: {e}")
            return None


class Invoice_details:
    def __init__(self):
        self.invoice_detail_table = Table('invoice_details',metadata_obj, autoload_with=engine, schema='paw_store')
    

    def insert_invoice_details(self, invoice_id, product_name,precio,cantidad):
        try:
            adding_product_invoice = insert(self.invoice_detail_table).values(invoice_id = invoice_id, product_name = product_name, precio = precio, cantidad =cantidad)
            with engine.begin() as conn:
                    result = conn.execute(adding_product_invoice)
                    return True
        except Exception as e:
            print(f"Error: {e}")
            return None
    

    def get_invoice_details(self,invoice):
        try:
            invoice_product_list = select(self.invoice_detail_table).where(self.invoice_detail_table.c.invoice_id == invoice).order_by(self.invoice_detail_table.c.id)
            with engine.begin() as conn:
                    query = conn.execute(invoice_product_list)
                    result = [dict(row._mapping) for row in query]
            return result
        except:
            return('Something when wrong')