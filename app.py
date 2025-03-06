from flask import Flask, render_template, request, redirect, url_for, jsonify, flash
from flask_sqlalchemy import SQLAlchemy
from datetime import datetime
import os

app = Flask(__name__)
app.config['SECRET_KEY'] = os.environ.get('SECRET_KEY', 'dev_key_for_demo')
app.config['SQLALCHEMY_DATABASE_URI'] = os.environ.get('DATABASE_URL', 'sqlite:///students.db')
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

db = SQLAlchemy(app)

class Student(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), nullable=False)
    reg_number = db.Column(db.String(20), unique=True, nullable=False)
    email = db.Column(db.String(100), unique=True)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    
    def __repr__(self):
        return f'<Student {self.reg_number}>'
    
    def to_dict(self):
        return {
            'id': self.id,
            'name': self.name,
            'reg_number': self.reg_number,
            'email': self.email,
            'created_at': self.created_at.isoformat()
        }

# Routes
@app.route('/')
def index():
    return render_template('index.html', instructor="OKELLO BENJAMIN", 
                          reg_number="JAN24/BCS/3855U/TF")

@app.route('/api/students', methods=['GET'])
def get_students():
    students = Student.query.all()
    return jsonify([student.to_dict() for student in students])

@app.route('/api/students', methods=['POST'])
def add_student():
    data = request.json
    
    new_student = Student(
        name=data['name'],
        reg_number=data['reg_number'],
        email=data.get('email', '')
    )
    
    try:
        db.session.add(new_student)
        db.session.commit()
        return jsonify(new_student.to_dict()), 201
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 400

@app.route('/dashboard')
def dashboard():
    students = Student.query.all()
    return render_template('dashboard.html', students=students)

# Create database tables before first request using Flask 2.0+ approach
with app.app_context():
    db.create_all()

if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0')