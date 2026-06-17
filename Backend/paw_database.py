from sqlalchemy import create_engine, MetaData,Table, insert, select,update, delete, and_,or_ 

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
        
    def update_inventory(self,id,user_inputs):
        try:
            stmt = (update(self.products_table).where(self.products_table.c.id == id).values(user_inputs))
            with engine.begin() as conn:
                    result = conn.execute(stmt)
        except:
            return('Something when wrong!')
    

    def delete_product(self,id):
        try:
            delete_item = delete(self.products_table).where(self.products_table.c.id == id )
            with engine.begin() as conn:
                    result = conn.execute(delete_item)
                    
        except Exception as ex:
            print(ex)
