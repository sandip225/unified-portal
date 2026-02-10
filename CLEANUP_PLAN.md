# Cleanup Plan - Unused Files Analysis

## 🗑️ Files to Delete

### Frontend - Unused Pages (7 files)
1. ✅ `frontend/src/pages/DirectAutomationDemo.jsx` - Not imported in App.jsx
2. ✅ `frontend/src/pages/SeleniumDemo.jsx` - Not imported in App.jsx
3. ✅ `frontend/src/pages/TorrentPowerRPA.jsx` - Not imported in App.jsx
4. ✅ `frontend/src/pages/NameChangeFormWithRPA.jsx` - Not imported anywhere
5. ✅ `frontend/src/pages/MobileDashboard.jsx` - Imported but not used in routes
6. ✅ `frontend/src/pages/admin/` - Empty folder

### Backend - Unused Files (1 file)
1. ✅ `backend/app/routers/torrent_automation_old.py` - Old version, not imported

### Root - Duplicate/Old Deployment Scripts (15+ files)
1. ✅ `deploy-to-ec2-rpa.bat` - Duplicate
2. ✅ `deploy-to-ec2.ps1` - Duplicate
3. ✅ `deploy-to-ec2.sh` - Duplicate
4. ✅ `deploy-to-new-ec2.bat` - Duplicate
5. ✅ `deploy-windows-ec2.bat` - Duplicate (keep deploy-windows-ec2.ps1)
6. ✅ `deploy-production-automation.sh` - Duplicate
7. ✅ `deploy.bat` - Old version
8. ✅ `clean-deploy.sh` - Duplicate
9. ✅ `prepare-deployment.bat` - Duplicate
10. ✅ `simple-deploy.ps1` - Duplicate

### Root - Test/Debug Files (4 files)
1. ✅ `test_chrome_setup.py` - Test file
2. ✅ `test_rpa_debug.py` - Debug file
3. ✅ `test_rpa_simple.py` - Test file
4. ✅ `diagnose-rpa.py` - Debug file

### Root - Duplicate Documentation (5 files)
1. ✅ `DASHBOARD_STATS_FIXED.md` - Old fix doc
2. ✅ `MODAL_CLOSE_BUTTON_FIXED.md` - Old fix doc
3. ✅ `RPA_POLLING_FIXED.md` - Old fix doc
4. ✅ `RPA_REALTIME_STATUS_FIXED.md` - Old fix doc
5. ✅ `NEW_HOME_REDIRECT_FIX.md` - Old fix doc

### Root - Misc Unused Files (3 files)
1. ✅ `torrent_autofill_working.js` - Old test file
2. ✅ `Govunified-portal ; git add -A ; gd fDevOpsGovunified-portal ; git branch -v` - Accidental file
3. ✅ `fix_rpa_simple.bat` - Old fix script
4. ✅ `fix_rpa_windows.ps1` - Old fix script

### Backend - Unused Service Files (Check)
1. ⚠️ `backend/app/services/torrent_power_automation.py` - Need to verify
2. ⚠️ `backend/app/services/login_assisted_service.py` - Need to verify

### Chrome Extension - Unused Files (Check)
1. ⚠️ `chrome-extension/torrent-power-autofill.js` - Need to verify
2. ⚠️ `chrome-extension/torrent-power-automation.js` - Need to verify
3. ⚠️ `chrome-extension/ai-form-automation.js` - Need to verify

---

## 📁 Files to Keep

### Essential Frontend Pages (18 files)
- ✅ Dashboard.jsx
- ✅ Login.jsx
- ✅ Register.jsx
- ✅ NewHome.jsx
- ✅ UtilityServices.jsx
- ✅ CompanyFormation.jsx
- ✅ GovernmentGrants.jsx
- ✅ Services.jsx
- ✅ ServiceFacilities.jsx
- ✅ ServiceProviders.jsx
- ✅ Applications.jsx
- ✅ Documents.jsx
- ✅ Profile.jsx
- ✅ DocumentUploadFlow.jsx
- ✅ FinalFormPage.jsx
- ✅ NameChangeApplication.jsx
- ✅ NameChangeForm.jsx
- ✅ NewConnectionForm.jsx
- ✅ TestRPA.jsx (for testing)
- ✅ TestAutomation.jsx (for testing)
- ✅ TestAutomationDirect.jsx (for testing)
- ✅ SupplierVerification.jsx
- ✅ Support.jsx

### Essential Backend Routers (14 files)
- ✅ auth.py
- ✅ users.py
- ✅ services.py
- ✅ services_api.py
- ✅ services_data.py
- ✅ applications.py
- ✅ documents.py
- ✅ whatsapp.py
- ✅ torrent_power.py
- ✅ torrent_automation.py
- ✅ demo_government_simple.py
- ✅ portal_redirect.py
- ✅ proxy.py

### Essential Deployment Files (Keep)
- ✅ docker-compose.yml
- ✅ docker-compose.prod.yml
- ✅ deploy-production.sh (main deployment)
- ✅ deploy-windows-ec2.ps1 (Windows deployment)
- ✅ nginx.conf
- ✅ nginx.prod.conf
- ✅ setup-ssl.sh
- ✅ setup-certbot-ssl.sh
- ✅ create-ssl-cert.sh
- ✅ ec2-setup.sh
- ✅ setup-selenium.ps1
- ✅ setup-windows-services.ps1

### Essential Documentation (Keep)
- ✅ README.md
- ✅ COMPLETE_DEPLOYMENT_STEPS.md
- ✅ DEPLOYMENT_COMMANDS.md
- ✅ AWS_DEPLOYMENT_GUIDE.md
- ✅ WINDOWS_EC2_DEPLOYMENT.md
- ✅ RPA_DEPLOYMENT_GUIDE.md
- ✅ RPA_TROUBLESHOOTING.md
- ✅ HTTPS_DEPLOYMENT_GUIDE.md
- ✅ SIMPLE_DEPLOYMENT.md
- ✅ QUICK_DEPLOY.md
- ✅ AI_AUTOMATION_README.md
- ✅ NEW_DOCUMENT_FLOW_IMPLEMENTATION.md
- ✅ WHATSAPP_INTEGRATION_GUIDE.md
- ✅ COMPLETE_NAVIGATION_IMPLEMENTATION.md
- ✅ NAVIGATION_IMPROVEMENTS.md
- ✅ NAVIGATION_USER_GUIDE.md
- ✅ CLEANUP_SUMMARY.md

### Essential Scripts (Keep)
- ✅ run-localhost-direct.bat
- ✅ start-localhost-simple.bat
- ✅ start-services.bat
- ✅ stop-services.bat
- ✅ restart-services.bat
- ✅ check-services.bat

---

## 📊 Summary

### Total Files to Delete: ~35 files
- Frontend: 6 files
- Backend: 1 file
- Root Deployment Scripts: 10 files
- Root Test Files: 4 files
- Root Documentation: 5 files
- Root Misc: 4 files
- Empty Folders: 1 folder

### Space Saved: Estimated ~2-3 MB
### Cleanup Impact: 
- ✅ Cleaner codebase
- ✅ Easier to navigate
- ✅ Less confusion
- ✅ Faster builds
- ✅ Better maintainability

---

## ⚠️ Before Deleting

### Backup Checklist:
- [ ] Git commit current state
- [ ] Create backup branch
- [ ] Test application after cleanup
- [ ] Verify no broken imports
- [ ] Check all routes work

### Safety Measures:
1. Delete files one by one
2. Test after each deletion
3. Keep git history
4. Can revert if needed

---

## 🚀 Execution Order

### Phase 1: Safe Deletions (Frontend unused pages)
1. Delete DirectAutomationDemo.jsx
2. Delete SeleniumDemo.jsx
3. Delete TorrentPowerRPA.jsx
4. Delete NameChangeFormWithRPA.jsx
5. Delete MobileDashboard.jsx
6. Delete admin/ folder

### Phase 2: Backend Cleanup
1. Delete torrent_automation_old.py

### Phase 3: Root Cleanup (Deployment scripts)
1. Delete duplicate deployment scripts
2. Delete test/debug files
3. Delete old documentation
4. Delete misc unused files

### Phase 4: Verification
1. Run frontend build
2. Run backend server
3. Test all routes
4. Check for errors
5. Commit changes

---

**Ready to Execute**: Yes
**Risk Level**: Low (all unused files)
**Recommended**: Create git commit before cleanup
