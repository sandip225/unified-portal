FROM python:3.11-slim

WORKDIR /app

# Install basic system dependencies and Chrome
RUN apt-get update && apt-get install -y \
    tesseract-ocr \
    libtesseract-dev \
    curl \
    wget \
    gnupg \
    unzip \
    ca-certificates \
    && rm -rf /var/lib/apt/lists/*

# Install Google Chrome (Updated method for newer systems)
RUN wget -q -O - https://dl.google.com/linux/linux_signing_key.pub | gpg --dearmor -o /usr/share/keyrings/googlechrome-linux-keyring.gpg \
    && echo "deb [arch=amd64 signed-by=/usr/share/keyrings/googlechrome-linux-keyring.gpg] http://dl.google.com/linux/chrome/deb/ stable main" > /etc/apt/sources.list.d/google-chrome.list \
    && apt-get update \
    && apt-get install -y google-chrome-stable \
    && rm -rf /var/lib/apt/lists/*

# Install ChromeDriver with fallback
RUN CHROME_VERSION=$(google-chrome --version | cut -d " " -f3 | cut -d "." -f1) \
    && echo "Chrome version: $CHROME_VERSION" \
    && CHROMEDRIVER_VERSION=$(curl -s "https://chromedriver.storage.googleapis.com/LATEST_RELEASE_${CHROME_VERSION}" || echo "114.0.5735.90") \
    && echo "ChromeDriver version: $CHROMEDRIVER_VERSION" \
    && wget -O /tmp/chromedriver.zip "https://chromedriver.storage.googleapis.com/${CHROMEDRIVER_VERSION}/chromedriver_linux64.zip" \
    && unzip /tmp/chromedriver.zip -d /tmp/ \
    && mv /tmp/chromedriver /usr/bin/chromedriver \
    && chmod +x /usr/bin/chromedriver \
    && rm /tmp/chromedriver.zip \
    && chromedriver --version || echo "ChromeDriver installed but version check failed"

# Copy requirements and install Python dependencies
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copy application code
COPY . .

# Create data directory for SQLite database
RUN mkdir -p /app/data

# Create required directories
RUN mkdir -p /app/screenshots && \
    mkdir -p /app/downloads && \
    chmod -R 755 /app/screenshots /app/downloads

# Expose port
EXPOSE 8000

# Health check
HEALTHCHECK --interval=30s --timeout=10s --start-period=40s --retries=3 \
    CMD curl -f http://localhost:8000/health || exit 1

# Run the application
CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8000", "--reload"]
