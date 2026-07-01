import smtplib
from email.message import EmailMessage

def send_email_confirmation(customer_email, customer_name, products, total):
    mensaje = EmailMessage()
    mensaje['Subject'] = 'Confirmación de Compra'
    mensaje['From'] = 'xxxxxx'
    mensaje['To'] = customer_email

    rows_html = ""

    for product in products:
        nombre = product.get('product_name')
        cantidad = product.get('cantidad')
        precio = product.get('precio')
        subtotal = precio * cantidad

        rows_html += f"""
        <tr>
            <td>{nombre}</td>
            <td style="text-align:center;">{cantidad}</td>
            <td style="text-align:right;">{precio:.2f}₡</td>
            <td style="text-align:right;">{subtotal:.2f}₡</td>
        </tr>
        """

    html = f"""
    <html>
        <body style="font-family: Arial, sans-serif; color: #333;">
            <h2>Hola {customer_name}</h2>

            <p>Gracias por tu compra. Aquí tienes el resumen de tu pedido:</p>

            <h3>Resumen de la compra</h3>

            <table style="width: 100%; border-collapse: collapse;">
                <thead>
                    <tr style="border-bottom: 1px solid #ddd;">
                        <th style="text-align:left; padding: 10px;">Producto</th>
                        <th style="text-align:center; padding: 10px;">Cantidad</th>
                        <th style="text-align:right; padding: 10px;">Precio Unitario</th>
                        <th style="text-align:right; padding: 10px;">Subtotal</th>
                    </tr>
                </thead>
                <tbody>
                    {rows_html}
                </tbody>
                <tfoot>
                    <tr style="border-top: 1px solid #ddd;">
                        <td colspan="3" style="text-align:right; padding: 10px;"><strong>Total:</strong></td>
                        <td style="text-align:right; padding: 10px;"><strong>{total:.2f}₡</strong></td>
                    </tr>
                </tfoot>
            </table>

            <p>Te estaremos contactando pronto con más información sobre el envío.</p>

            <p>Gracias por comprar en Paw Store.</p>
        </body>
    </html>
    """

    texto_plano = f"""
Hola {customer_name}

Gracias por tu compra.

Total: {total:.2f}₡

Gracias por comprar en Paw Store.
"""

    mensaje.set_content(texto_plano)
    mensaje.add_alternative(html, subtype='html')

    servidor_smtp = 'smtp.gmail.com'
    puerto = 465

    try:
        with smtplib.SMTP_SSL(servidor_smtp, puerto) as servidor:
            servidor.login('xxxxxx', 'xxxxxxx')
            servidor.send_message(mensaje)

        print('Correo enviado con éxito')
        return True

    except Exception as e:
        print(f'Error al enviar el correo: {e}')
        return False