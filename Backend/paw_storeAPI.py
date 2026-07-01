from flask import Flask, request,jsonify, Response
from flask_cors import CORS
from paw_database import User, Products, Cart, Shipping, Invoice, Invoice_details
from authenticator import JWT_Manager,admin_only
from email_sender import send_email_confirmation

app = Flask(__name__)
CORS(app)
user_info = User()
products_info = Products()
cart_info = Cart()
shipping_ingo = Shipping()
invoice_info = Invoice()
invoice_details_info = Invoice_details()
token_handler = JWT_Manager()

@app.route('/login', methods=['POST'])
def login():
    data = request.get_json()
    try:
        
        result = user_info.user_login(data.get('email'),data.get('password'))
        
        if (result != None):
            id = result[0]
            username = result[4]
            user_role = result[6]
            token = token_handler.encode({'id':id,'role':user_role})
            data = {
                'id':id,
                'username':username,
                'role':user_role,
                'token':token
                }
            
            return jsonify(data), 200
        else:
            return Response(status=409)
    except Exception as e:
        return Response(status=500)


@app.route('/products')
def product_list():
    try:
        products = products_info.get_products()
        return jsonify(products), 200
    except Exception as e:
        return Response(status=500)


@app.route('/products', methods=['POST'])
@admin_only
def new_product():
    data = request.get_json()
    try:
        
        products = products_info.new_product(data)
        return Response(status=200)
    except Exception as e:
        return Response(status=500)


@app.route('/cart/<user_id>')
def cart_get_info(user_id):
    try:
        cart_information = cart_info.get_cart_item(user_id)
        if (cart_information != None):
            return jsonify(cart_information), 200
    except Exception as e:
        print(e)
        return Response(status=500)




@app.route('/products/details/<id>')
def details_products(id):
    try:
        details = products_info.get_product_by_id(id)
        if (details != None):
            return jsonify(details),200
        else:
            return Response(status=404)
    except Exception as e:
        print(e)
        return Response(status=500)
    

@app.route('/products', methods=['PUT'])
@admin_only
def edit_product():
    data = request.get_json()
    try:
        id = data.get('id')
        values = {
            key:value
            for key,value in data.items()
            if key != 'id'
        }
        update = products_info.update_inventory(id,values)
        
        return Response(status=200)
    except Exception as e:
        print(e)
        return Response(status=500)

@app.route('/products/details/adding/<id>',methods=['PUT'])
def product_add_stock(id):
    data = request.get_json(silent=True)
    try:
        if data:
            stock_not_use = data.get('stock')
            return_stock = products_info.update_stok_add(id,stock_not_use)
            if (return_stock == True):
                return Response(status=200)
        else:
            return_stock = products_info.update_stok_add(id,1)
            if (return_stock == True):
                return Response(status=200)
    except Exception as e:
        print(e)
        return Response(status=500)

@app.route('/products/details/reduce/<id>',methods=['PUT'])
def product_reduce_stock(id):
    try:
        return_stock = products_info.update_stok_reduce(id,1)
        if (return_stock == True):
            return Response(status=200)
    except Exception as e:
        
        print(e)
        return Response(status=500)


@app.route('/cart/details/add/<id>', methods=['PUT'])
def cart_add_quantity(id):
    try:
        add_quantity =  cart_info.update_quantity(id,'add')
        if (add_quantity == True):
            return Response(status=200)
    except Exception as e:
        
        print(e)
        return Response(status=500)

@app.route('/cart/details/reduce/<id>', methods=['PUT'])
def cart_reduce_quantity(id):
    try:
        add_quantity =  cart_info.update_quantity(id,'less')
        if (add_quantity == True):
            return Response(status=200)
    except Exception as e:
        
        print(e)
        return Response(status=500)



@app.route('/products/details/stock')
def check_stock():
    try:
        availability_stock = products_info.verify_available_stock()
        if (availability_stock != None):
            return jsonify(availability_stock),200
        else:
            return Response(status=404)
    except Exception as e:
        print(e)
        return Response(status=500)
    

@app.route('/checkout/complete', methods = ['POST'])
def complete_checkout():
    try:
        data = request.get_json()
        products = data.get('products')
        user_id = data.get('user_id')
        total = data.get('total')
        name = data.get('nombreCompleto')
        address = data.get('direccion')
        email = data.get('correo')
        phone = data.get('telefono')
        adding_shipping_a = shipping_ingo.insert_new_address(user_id,name,email,address,phone)
        
        if(adding_shipping_a != None):
            adding_invoice_new = invoice_info.insert_new_invoice(user_id,adding_shipping_a,total)
            for product in products:
                invoice_details_info.insert_invoice_details(
                    adding_invoice_new,
                    product.get('nombre'),
                    product.get('precio'),
                    product.get('cantidad')
                )
            
            product_list = invoice_details_info.get_invoice_details(adding_invoice_new)
            confirmation_email = send_email_confirmation(email,name, product_list,total)
            clening_cart = cart_info.clear_cart(user_id)
        return Response(status=200)
    except Exception as e:
        print(e)
        return Response(status=500)


@app.route('/products', methods=['DELETE'])
@admin_only
def delete_product():
    data = request.get_json()
    try:
        id = data.get('id')
        
        delete_inventory = products_info.delete_product(id)
        
        return Response(status=200)
    except Exception as e:
        print(e)
        return Response(status=500)


@app.route('/cart/new', methods = ['POST'])
def new_item_cart():
    try:
        data = request.get_json()
        user_id = data.get('user_id')
        product_id = data.get('product_id')
        quantity = data.get('cantidad')
        insert_new = cart_info.new_item_cart(user_id,product_id,quantity)
        if (insert_new == True):
            return Response(status=200)
    except Exception as e:
        print(e)
        return Response(status=500)


@app.route('/cart/delete/<id>', methods = ['DELETE'])
def delete_item(id):
    try:
        data = request.get_json()
        user_id = data.get('user_id')
        delete_row = cart_info.delete_from_cart(user_id,id)
        if (delete_row == True):
            return Response(status=200)
        else:
            return Response(status=503)
    except Exception as e:
        print(e)
        return Response(status=500)
    
if __name__ == "__main__":
    
    app.run(host='localhost', debug=True)