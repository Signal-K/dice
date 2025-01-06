# Dockerfile for Django (Backend)

# Step 1: Build the app
FROM python:3.11-slim AS build

WORKDIR /backend

# Install dependencies
COPY backend/requirements.txt ./
RUN pip install --no-cache-dir -r requirements.txt

# Step 2: Create a production image
FROM python:3.11-slim

WORKDIR /backend

# Install runtime dependencies
COPY --from=build /backend/requirements.txt /backend/
RUN pip install --no-cache-dir -r requirements.txt

# Copy the app's source code
COPY backend/ /backend/

# Expose port 8000 for Django
EXPOSE 8000

# Start the Django app
CMD ["python", "manage.py", "runserver", "0.0.0.0:8000"]
