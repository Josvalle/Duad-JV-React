from flask import Flask, request,jsonify, Response
from flask_cors import CORS
from paw_database import User, Products
from authenticator import JWT_Manager,admin_only

app = Flask(__name__)
CORS(app)
user_info = User()
products_info = Products()
token_handler = JWT_Manager()

@app.route('/login', methods=['POST'])
def login():
    data = request.get_json()
    try:
        print(data)
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


@app.route('/products/details/<id>')
def details_products(id):
    try:
        details = products_info.get_product_by_id(id)
        return jsonify(details),200
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


if __name__ == "__main__":
    
    app.run(host='localhost', debug=True)