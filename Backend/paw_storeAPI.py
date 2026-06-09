from flask import Flask, request,jsonify, Response
from flask_cors import CORS
from paw_database import User, Products

app = Flask(__name__)
CORS(app)
user_info = User()
products_info = Products()


@app.route('/login', methods=['POST'])
def login():
    data = request.get_json()
    try:
        print(data)
        result = user_info.user_login(data.get('email'),data.get('password'))
        
        if (result != None):
            username = result[4]
            user_role = result[6]
            data = {
                'username':username,
                'role':user_role
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
def new_product():
    data = request.get_json()
    try:
        
        products = products_info.new_product(data)
        return Response(status=200)
    except Exception as e:
        return Response(status=500)

@app.route('/products', methods=['PUT'])
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