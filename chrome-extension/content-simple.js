// Simple DGVCL Auto-Fill Extension
console.log('🚀 DGVCL Auto-Fill Extension Started');

// Wait for page to load
window.addEventListener('load', function() {
  console.log('📄 Page loaded, checking URL...');
  
  // Check if we're on DGVCL portal
  if (window.location.hostname === 'portal.guvnl.in') {
    console.log('✅ On DGVCL portal');
    
    // Get data from URL
    const urlParams = new URLSearchParams(window.location.search);
    const mobile = urlParams.get('mobile');
    const discom = urlParams.get('discom');
    
    console.log('📦 URL Data:', { mobile, discom });
    
    if (mobile && discom) {
      console.log('✅ Data found, waiting 2 seconds for page elements...');
      
      // Wait 2 seconds for page to fully load
      setTimeout(function() {
        
        // Get ALL inputs on the page
        const allInputs = document.querySelectorAll('input');
        console.log('Total inputs found:', allInputs.length);
        
        // Log all inputs for debugging
        allInputs.forEach(function(input, index) {
          console.log('Input ' + index + ':', {
            type: input.type,
            placeholder: input.placeholder,
            name: input.name,
            id: input.id,
            className: input.className
          });
        });
        
        // Find the FIRST text input (should be mobile)
        // Skip hidden inputs and checkboxes
        let mobileField = null;
        for (let i = 0; i < allInputs.length; i++) {
          const input = allInputs[i];
          
          // Skip non-text inputs
          if (input.type === 'hidden' || input.type === 'checkbox' || input.type === 'submit' || input.type === 'button') {
            continue;
          }
          
          // Skip captcha field (usually has "captcha" in placeholder or comes after select)
          const placeholder = (input.placeholder || '').toLowerCase();
          if (placeholder.includes('captcha')) {
            console.log('Skipping captcha field at index', i);
            continue;
          }
          
          // This should be the mobile field (first text input that's not captcha)
          mobileField = input;
          console.log('✅ Found mobile field at index', i);
          break;
        }
        
        if (mobileField) {
          mobileField.focus();
          mobileField.value = mobile;
          mobileField.dispatchEvent(new Event('input', { bubbles: true }));
          mobileField.dispatchEvent(new Event('change', { bubbles: true }));
          mobileField.style.backgroundColor = '#90EE90';
          console.log('✅ Filled mobile:', mobile);
          
          setTimeout(function() {
            mobileField.style.backgroundColor = '';
          }, 3000);
        } else {
          console.error('❌ Could not find mobile field!');
        }
        
        // Find DISCOM dropdown
        console.log('🔍 Looking for DISCOM dropdown...');
        const discomDropdown = document.querySelector('select');
        
        if (discomDropdown) {
          console.log('✅ Found DISCOM dropdown!');
          
          // Find the option
          const options = discomDropdown.options;
          for (let i = 0; i < options.length; i++) {
            if (options[i].text.includes(discom) || options[i].value.includes(discom)) {
              discomDropdown.selectedIndex = i;
              discomDropdown.dispatchEvent(new Event('change', { bubbles: true }));
              discomDropdown.style.backgroundColor = '#90EE90';
              console.log('✅ Selected DISCOM:', discom);
              
              setTimeout(function() {
                discomDropdown.style.backgroundColor = '';
              }, 3000);
              break;
            }
          }
        } else {
          console.error('❌ DISCOM dropdown not found!');
        }
        
        // Show success message
        const notification = document.createElement('div');
        notification.style.cssText = 'position:fixed;top:20px;right:20px;background:#4CAF50;color:white;padding:15px 25px;border-radius:10px;font-size:16px;z-index:999999;box-shadow:0 4px 20px rgba(0,0,0,0.3);';
        notification.textContent = '✅ Auto-filled mobile & ' + discom + '!';
        document.body.appendChild(notification);
        
        setTimeout(function() {
          notification.remove();
        }, 5000);
        
      }, 2000); // Wait 2 seconds
    } else {
      console.log('ℹ️ No data in URL');
    }
  } else {
    console.log('ℹ️ Not on DGVCL portal');
  }
});

console.log('✅ Extension script loaded successfully');
