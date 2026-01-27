#!/usr/bin/env python3
"""
Fix Chrome/Chromium setup in Docker container
"""
import os
import subprocess
import logging
from selenium import webdriver
from selenium.webdriver.chrome.options import Options
from selenium.webdriver.chrome.service import Service

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

def check_chrome_binaries():
    """Check available Chrome binaries"""
    binaries = [
        '/usr/bin/chromium',
        '/usr/bin/chromium-browser',
        '/usr/bin/google-chrome',
        '/usr/bin/google-chrome-stable'
    ]
    
    available = []
    for binary in binaries:
        if os.path.exists(binary):
            available.append(binary)
            logger.info(f"✅ Found: {binary}")
        else:
            logger.info(f"❌ Missing: {binary}")
    
    return available

def check_chromedriver():
    """Check ChromeDriver availability"""
    drivers = [
        '/usr/bin/chromedriver',
        '/usr/local/bin/chromedriver'
    ]
    
    available = []
    for driver in drivers:
        if os.path.exists(driver):
            available.append(driver)
            logger.info(f"✅ Found ChromeDriver: {driver}")
        else:
            logger.info(f"❌ Missing ChromeDriver: {driver}")
    
    return available

def test_chrome_simple():
    """Test Chrome with minimal options"""
    try:
        logger.info("🧪 Testing Chrome with minimal options...")
        
        chrome_options = Options()
        chrome_options.add_argument('--headless=new')
        chrome_options.add_argument('--no-sandbox')
        chrome_options.add_argument('--disable-dev-shm-usage')
        chrome_options.add_argument('--disable-gpu')
        chrome_options.add_argument('--remote-debugging-port=9222')
        chrome_options.add_argument('--disable-setuid-sandbox')
        
        # Try different Chrome binaries
        binaries = check_chrome_binaries()
        
        for binary in binaries:
            try:
                logger.info(f"🔧 Testing with binary: {binary}")
                chrome_options.binary_location = binary
                
                # Try with system chromedriver
                drivers = check_chromedriver()
                if drivers:
                    service = Service(drivers[0])
                    driver = webdriver.Chrome(service=service, options=chrome_options)
                else:
                    driver = webdriver.Chrome(options=chrome_options)
                
                # Test basic functionality
                driver.get("data:text/html,<html><body><h1>Test Page</h1></body></html>")
                title = driver.title
                
                logger.info(f"✅ SUCCESS with {binary}!")
                logger.info(f"   Title: {title}")
                
                driver.quit()
                return {"success": True, "binary": binary, "driver": drivers[0] if drivers else "default"}
                
            except Exception as e:
                logger.warning(f"❌ Failed with {binary}: {e}")
                continue
        
        logger.error("❌ All Chrome binaries failed")
        return {"success": False, "error": "No working Chrome binary found"}
        
    except Exception as e:
        logger.error(f"❌ Chrome test failed: {e}")
        return {"success": False, "error": str(e)}

def fix_permissions():
    """Fix Chrome data directory permissions"""
    try:
        logger.info("🔧 Fixing permissions...")
        
        directories = [
            '/app/chrome_automation_data',
            '/app/screenshots',
            '/app/downloads',
            '/tmp'
        ]
        
        for directory in directories:
            if os.path.exists(directory):
                os.chmod(directory, 0o755)
                logger.info(f"✅ Fixed permissions for {directory}")
            else:
                os.makedirs(directory, mode=0o755, exist_ok=True)
                logger.info(f"✅ Created directory {directory}")
        
        return True
        
    except Exception as e:
        logger.error(f"❌ Permission fix failed: {e}")
        return False

def install_missing_packages():
    """Install missing Chrome dependencies"""
    try:
        logger.info("📦 Installing missing Chrome dependencies...")
        
        packages = [
            'fonts-liberation',
            'libasound2',
            'libatk-bridge2.0-0',
            'libdrm2',
            'libxcomposite1',
            'libxdamage1',
            'libxrandr2',
            'libgbm1',
            'libxss1',
            'libnss3'
        ]
        
        # Update package list
        subprocess.run(['apt-get', 'update'], check=True, capture_output=True)
        
        # Install packages
        cmd = ['apt-get', 'install', '-y'] + packages
        result = subprocess.run(cmd, check=True, capture_output=True, text=True)
        
        logger.info("✅ Dependencies installed successfully")
        return True
        
    except subprocess.CalledProcessError as e:
        logger.error(f"❌ Package installation failed: {e}")
        return False
    except Exception as e:
        logger.error(f"❌ Unexpected error: {e}")
        return False

def main():
    """Main fix function"""
    logger.info("🚀 Starting Chrome/Chromium fix...")
    
    # Step 1: Check current state
    logger.info("📋 Step 1: Checking current state...")
    binaries = check_chrome_binaries()
    drivers = check_chromedriver()
    
    # Step 2: Fix permissions
    logger.info("📋 Step 2: Fixing permissions...")
    fix_permissions()
    
    # Step 3: Install missing packages
    logger.info("📋 Step 3: Installing missing packages...")
    install_missing_packages()
    
    # Step 4: Test Chrome
    logger.info("📋 Step 4: Testing Chrome...")
    result = test_chrome_simple()
    
    # Summary
    logger.info("\n" + "="*50)
    logger.info("🏁 CHROME FIX SUMMARY")
    logger.info("="*50)
    
    if result["success"]:
        logger.info("✅ Chrome is working!")
        logger.info(f"   Binary: {result['binary']}")
        logger.info(f"   Driver: {result['driver']}")
        logger.info("\n🎉 Selenium automation is ready!")
    else:
        logger.info("❌ Chrome fix failed")
        logger.info(f"   Error: {result.get('error', 'Unknown error')}")
        logger.info("\n🔧 Manual intervention may be required")
    
    return result

if __name__ == "__main__":
    main()