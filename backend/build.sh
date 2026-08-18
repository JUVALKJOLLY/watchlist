#!/usr/bin/env bash
# Exit immediately if a command exits with a non-zero status
set -o errexit

echo ">>> Installing backend Python dependencies..."
pip install -r requirements.txt

echo ">>> Applying Django migrations..."
python manage.py migrate

echo ">>> Seeding initial demo account and sample data..."
python seed_demo.py

echo ">>> Collecting static files..."
python manage.py collectstatic --no-input

echo ">>> Build completed successfully!"
