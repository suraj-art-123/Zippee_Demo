import email
from flask import Flask, request
import psycopg2
import smtplib
from email.mime.text import MIMEText
from flask_cors import CORS
from datetime import datetime

app = Flask(__name__)
CORS(app)

# connect database
conn = psycopg2.connect(
    dbname="jay",
    user="jaya",
    password="jaya@123",
    host="localhost"
)


# api to handle signup

@app.route('/signup', methods=['POST'])
def signup():
    try:
        username = request.json['username']
        email = request.json['email']
        password = request.json['password']
        cur = conn.cursor()
        select_queryy = "SELECT * FROM users WHERE email = %s;"
        user_data = (email,)
        cur.execute(select_queryy, user_data)
        user = cur.fetchone()
        print(user)
        if user is not None and user:
            return {"msg": "Email Already Registered", "status": 201}
        user = cur.fetchone()
        insert_query = "INSERT INTO users (username, email, password) VALUES (%s, %s, %s);"
        user_data = (username, email, password)
        cur.execute(insert_query, user_data)
        conn.commit()
        return {"msg": "Registered Successfully !!!", "status": 200}
    except Exception as e:
        print(str(e))
        return {"msg": "Error occurred while adding user: {}".format(str(e))}


# api to handle Login

@app.route('/login', methods=['POST'])
def login():
    email = request.json['email']
    password = request.json['password']
    cur = conn.cursor()
    select_query = "SELECT * FROM users WHERE email = %s AND password = %s;"
    user_data = (email, password)
    cur.execute(select_query, user_data)
    user = cur.fetchone()
    if user is not None and user:
        return {"id": user[0], "msg": "Logged-in Successfully !!", "email": user[2], "status": 200}
    elif user is None:
        return {"msg": "User not found. Please register first.", "status": 201}
    else:
        return {"msg": "Invalid credentials. Please try again.", "status": 201}


# api that send email to all users

@app.route('/send-email')
def send_email():
    try:
        cur = conn.cursor()
        select_query = "SELECT email,id FROM users;"
        cur.execute(select_query)
        users = cur.fetchall()
        if users:
            smtp_server = smtplib.SMTP('smtp-relay.sendinblue.com', 587)
            smtp_server.starttls()
            smtp_server.login('suraj190897@gmail.com', '0N9MRmyCK1IOLDWn')

            # send email to each user
            for user in users:
                userid = user[1]
                message = """Dear,
                Thank you for signing up for our newsletter. We're excited to keep you updated on the latest news and promotions from our company.
                Best regards,
                <img src="http://127.0.0.1:5000/track_email?messageid={}" />
                    The Zippee Team
                """
                mailcontent = message
                isopened = False
                isdelivered = True
                delivered_at = datetime.now()
                opened_at = datetime.now()

                insert_query = "INSERT INTO sent_mail_log(userid, content, delivered, opened, delivered_at) \
                                VALUES(%s, %s, %s, %s, %s)  RETURNING id ;"
                values = (userid, mailcontent, isdelivered,
                          isopened, delivered_at)

                cur.execute(insert_query, values)
                conn.commit()
                messageid = cur.fetchone()[0]
                message = message.format(messageid)
                msg = MIMEText(message)
                msg['Subject'] = 'Test Email'
                msg['From'] = 'suraj190897@gmail.com'
                recipient = user[0]
                msg['To'] = recipient
                smtp_server.sendmail('youremail@gmail.com',
                                     recipient, msg.as_string())
            smtp_server.quit()
            return "Email sent successfully to all users."
        else:
            return "No users found in the database."
    except Exception as e:
        print(str(e))
        conn.rollback()
        return "Error occurred while sending email: {}".format(str(e))


#  track email api open or not to user mail

@app.route('/track_email', methods=['GET'])
def track_email():
    messageid = request.args.get('messageid')
    opened_at = datetime.now()
    update_query = "UPDATE sent_mail_log SET opened = TRUE, opened_at = %s WHERE id = %s;"
    update_data = (opened_at, messageid)

    try:
        cur = conn.cursor()
        cur.execute(update_query, update_data)
        conn.commit()
        return "Email opened!"
    except Exception as e:
        conn.rollback()
        return f"Error: {str(e)}"


# get api to all  users who have seen the mail

@app.route('/get_email_openstatus', methods=['GET'])
def get_email_openstatus():
    try:
        select_query = "SELECT sent_mail_log.*,users.username FROM sent_mail_log JOIN users ON users.id=sent_mail_log.userid;"
        cur = conn.cursor()
        cur.execute(select_query)
        print(cur.description)
        columns = [col[0] for col in cur.description]  # get column names
        users = [dict(zip(columns, row))
                 for row in cur.fetchall()]  # convert tuples to dicts
        return {"users": users, "status": "200"}
    except Exception as e:
        print("Error occurred: ", e)
        return {"status": "500"}


if __name__ == '__main__':
    app.run()
