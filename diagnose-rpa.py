#!/usr/bin/env python3
"""
RPA Diagnostic Script
Run this inside the backend container to diagnose RPA issues
"""

import os
import subprocess
import sys

def run_command(cmd):
    """Run a command and return output"""
    try:
        result = subprocess.run(cmd, shell=True, capture_output=True, text=True)
        return result.returncode, result.stdout, result.stderr
    except Exception as e:
        return -1, "", str(e)

def check_chrome():
    """Check Chrome installation"""
    print("🔍 Checking Chrome installation...")
    
    # Check Chrome binary
    code, stdout, stderr = run_command("google-chrome --version")
    if code == 0:
        print(f"✅ Chrome installed: {stdout.strip()}")
    else:
        print(f"❌ Chrome not found: {stderr}")
        return False
    
    # Check Chrome binary location
    code, stdout, stderr = run_command("which google-chrome")
    if code == 0:
        print(f"✅ Chrome location: {stdout.strip()}")
    else:
        print(f"❌ Chrome binary not in PATH")
    
    return True

def check_chromedriver():
    """Check ChromeDriver installation"""
    print("\n🔍 Checking ChromeDriver installation...")
    
    # Check ChromeDriver
    code, stdout, stderr = run_command("chromedriver --version")
    if code == 0:
        print(f"✅ ChromeDriver installed: {stdout.strip()}")
    else:
        print(f"❌ ChromeDriver not found: {stderr}")
        return False
    
    # Check ChromeDriver location
    code, stdout, stderr = run_command("which chromedriver")
    if code == 0:
        print(f"✅ ChromeDriver location: {stdout.strip()}")
    else:
        print(f"❌ ChromeDriver binary not in PATH")
    
    return True

def check_display():
    """Check virtual display"""
    print("\n🔍 Checking virtual display...")
    
    # Check DISPLAY environment variable
    display = os.environ.get('DISPLAY')
    if display:
        print(f"✅ DISPLAY set to: {display}")
    else:
        print("❌ DISPLAY environment variable not set")
    
    # Check if Xvfb is running
    code, stdout, stderr = run_command("ps aux | grep Xvfb | grep -v grep")
    if code == 0 and stdout.strip():
        print(f"✅ Xvfb running: {stdout.strip()}")
    else:
        print("❌ Xvfb not running")
        return False
    
    return True

def check_selenium():
    """Check Selenium installation"""
    print("\n🔍 Checking Selenium installation...")
    
    try:
        import selenium
        print(f"✅ Selenium installed: {selenium.__version__}")
        
        from selenium import webdriver
        print("✅ Selenium webdriver module available")
        
        from webdriver_manager.chrome import ChromeDriverManager
        print("✅ webdriver-manager available")
        
        return True
    except ImportError as e:
        print(f"❌ Selenium import error: {e}")
        return False

def test_chrome_startup():
    """Test Chrome startup"""
    print("\n🔍 Testing Chrome startup...")
    
    try:
        from selenium import webdriver
        from selenium.webdriver.chrome.options import Options
        
        chrome_options = Options()
        chrome_options.add_argument("--headless=new")
        chrome_options.add_argument("--no-sandbox")
        chrome_options.add_argument("--disable-dev-shm-usage")
        chrome_options.add_argument("--disable-gpu")
        
        print("🚀 Attempting to start Chrome...")
        driver = webdriver.Chrome(options=chrome_options)
        
        print("✅ Chrome started successfully")
        
        # Test navigation
        driver.get("data:text/html,<html><body><h1>Test</h1></body></html>")
        print("✅ Chrome navigation test successful")
        
        driver.quit()
        print("✅ Chrome closed successfully")
        
        return True
        
    except Exception as e:
        print(f"❌ Chrome startup failed: {e}")
        return False

def main():
    """Main diagnostic function"""
    print("🔧 RPA Diagnostic Tool")
    print("=" * 50)
    
    all_good = True
    
    # Run all checks
    if not check_chrome():
        all_good = False
    
    if not check_chromedriver():
        all_good = False
    
    if not check_display():
        all_good = False
    
    if not check_selenium():
        all_good = False
    
    if not test_chrome_startup():
        all_good = False
    
    print("\n" + "=" * 50)
    if all_good:
        print("🎉 All RPA components are working correctly!")
    else:
        print("❌ RPA has issues that need to be fixed")
    
    print("=" * 50)

if __name__ == "__main__":
    main()