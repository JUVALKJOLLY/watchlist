#!/usr/bin/env bash
# Exit on error
set -o errexit

echo ">>> Building React frontend..."
cd frontend
npm install
npm run build
cd ..

echo ">>> Setting up Django backend..."
cd backend
pip install -r requirements.txt
python manage.py migrate
python seed_demo.py
python manage.py collectstatic --no-input
cd ..

echo ">>> Fullstack build finished successfully!"
