# 📱 Mobile Preview Guide for ROOMi Platform

**Test your ROOMi platform on real mobile devices!** This guide shows you multiple ways to preview your localhost development server on mobile phones and tablets.

---

## 🎯 **QUICK START - MOBILE PREVIEW**

### **Method 1: Network IP Access (Recommended)**

**Step 1**: Find your computer's IP address
```bash
# Windows (PowerShell)
ipconfig | findstr "IPv4"

# Windows (Command Prompt)
ipconfig

# Look for "IPv4 Address" - usually something like 192.168.1.100
```

**Step 2**: Start your development server with network access
```bash
# Option A: Vite with host flag
npm run dev -- --host

# Option B: Vite with specific IP
npm run dev -- --host 0.0.0.0

# Option C: Custom script (add to package.json)
npm run dev:mobile
```

**Step 3**: Access from mobile device
- Connect your phone to the **same WiFi network** as your computer
- Open browser on phone
- Navigate to: `http://YOUR_IP_ADDRESS:5173`
- Example: `http://192.168.1.100:5173`

---

## 🔧 **SETUP INSTRUCTIONS**

### **Configure Vite for Mobile Access**

Add this script to your `package.json`:

```json
{
  "scripts": {
    "dev": "vite",
    "dev:mobile": "vite --host 0.0.0.0 --port 5173",
    "dev:network": "vite --host"
  }
}
```

### **Update Vite Configuration**

Edit `vite.config.ts` to enable network access:

```typescript
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    host: true, // Enable network access
    port: 5173,
    strictPort: true,
  },
})
```

---

## 📱 **MOBILE PREVIEW METHODS**

### **Method 1: Same WiFi Network (Easiest)**

**Requirements:**
- Computer and phone on same WiFi
- No additional software needed

**Steps:**
1. Run `npm run dev:mobile`
2. Note the "Network" URL in terminal output
3. Open that URL on your phone

**Example Terminal Output:**
```
  VITE v4.4.5  ready in 500 ms

  ➜  Local:   http://localhost:5173/
  ➜  Network: http://192.168.1.100:5173/
  ➜  press h to show help
```

### **Method 2: QR Code Access (Convenient)**

**Install QR Code Generator:**
```bash
npm install -D qrcode-terminal
```

**Create QR Code Script:**
```javascript
// scripts/generate-qr.js
const qrcode = require('qrcode-terminal');
const os = require('os');

function getLocalIP() {
  const interfaces = os.networkInterfaces();
  for (const name of Object.keys(interfaces)) {
    for (const interface of interfaces[name]) {
      if (interface.family === 'IPv4' && !interface.internal) {
        return interface.address;
      }
    }
  }
  return 'localhost';
}

const ip = getLocalIP();
const url = `http://${ip}:5173`;
console.log(`\n📱 Mobile Preview URL: ${url}\n`);
qrcode.generate(url, {small: true});
```

**Add to package.json:**
```json
{
  "scripts": {
    "qr": "node scripts/generate-qr.js"
  }
}
```

**Usage:**
```bash
npm run dev:mobile
npm run qr  # In another terminal
```

### **Method 3: ngrok Tunnel (External Access)**

**Install ngrok:**
```bash
# Download from https://ngrok.com/
# Or use npm
npm install -g ngrok
```

**Setup:**
```bash
# Start your dev server
npm run dev

# In another terminal, create tunnel
ngrok http 5173
```

**Benefits:**
- Access from anywhere (not just local network)
- Share with remote team members
- Test on different networks

### **Method 4: Browser DevTools (Quick Testing)**

**Chrome DevTools:**
1. Open Chrome on desktop
2. Press `F12` or `Ctrl+Shift+I`
3. Click device toolbar icon (📱)
4. Select mobile device preset
5. Test responsive design

**Limitations:**
- Not real mobile browser
- Different performance characteristics
- Limited touch interaction testing

---

## 🛠️ **TROUBLESHOOTING**

### **Common Issues & Solutions**

**❌ "Site can't be reached" on mobile**
```bash
# Check if firewall is blocking
# Windows: Allow Node.js through Windows Firewall
# Mac: System Preferences > Security & Privacy > Firewall

# Verify IP address is correct
ipconfig  # Windows
ifconfig  # Mac/Linux
```

**❌ "Connection refused"**
```bash
# Ensure dev server is running with --host flag
npm run dev -- --host

# Check if port 5173 is available
netstat -an | findstr :5173  # Windows
lsof -i :5173               # Mac/Linux
```

**❌ "Slow loading on mobile"**
```bash
# Optimize for mobile development
# Add to vite.config.ts:
export default defineConfig({
  server: {
    host: true,
    hmr: {
      port: 5174, // Use different port for HMR
    },
  },
})
```

**❌ "HTTPS required for some features"**
```bash
# Generate local SSL certificate
npm install -D @vitejs/plugin-basic-ssl

# Update vite.config.ts:
import basicSsl from '@vitejs/plugin-basic-ssl'

export default defineConfig({
  plugins: [react(), basicSsl()],
  server: {
    https: true,
    host: true,
  },
})
```

---

## 📋 **MOBILE TESTING CHECKLIST**

### **Basic Functionality**
- [ ] Page loads correctly
- [ ] Navigation works
- [ ] Forms are usable
- [ ] Buttons are tappable
- [ ] Images load properly

### **ROOMi-Specific Features**
- [ ] Property search works
- [ ] Property cards display correctly
- [ ] Booking flow functions
- [ ] Payment integration works
- [ ] User authentication works
- [ ] Property details modal works

### **Performance Testing**
- [ ] Page load time < 3 seconds
- [ ] Smooth scrolling
- [ ] No layout shifts
- [ ] Touch interactions responsive
- [ ] Images optimized for mobile

### **Cross-Device Testing**
- [ ] iPhone (Safari)
- [ ] Android (Chrome)
- [ ] Tablet (iPad/Android)
- [ ] Different screen sizes
- [ ] Portrait and landscape modes

---

## 🔍 **DEBUGGING MOBILE ISSUES**

### **Remote Debugging**

**Chrome DevTools for Android:**
1. Enable Developer Options on Android
2. Enable USB Debugging
3. Connect phone to computer via USB
4. Open Chrome on phone and navigate to your site
5. On desktop Chrome: `chrome://inspect`
6. Click "Inspect" next to your device

**Safari Web Inspector for iOS:**
1. Enable Web Inspector on iPhone: Settings > Safari > Advanced
2. Connect iPhone to Mac via USB
3. Open Safari on iPhone and navigate to your site
4. On Mac Safari: Develop > [Your iPhone] > [Your Site]

### **Console Logging**
```javascript
// Add mobile-specific debugging
if (window.innerWidth < 768) {
  console.log('Mobile device detected');
  console.log('Screen size:', window.innerWidth, 'x', window.innerHeight);
  console.log('User agent:', navigator.userAgent);
}
```

### **Network Monitoring**
```javascript
// Monitor network requests on mobile
if ('connection' in navigator) {
  console.log('Connection type:', navigator.connection.effectiveType);
  console.log('Downlink speed:', navigator.connection.downlink);
}
```

---

## 🚀 **ADVANCED MOBILE FEATURES**

### **PWA Testing**
```javascript
// Test service worker registration
if ('serviceWorker' in navigator) {
  navigator.serviceWorker.register('/sw.js')
    .then(reg => console.log('SW registered:', reg))
    .catch(err => console.log('SW registration failed:', err));
}
```

### **Touch Events**
```javascript
// Test touch interactions
element.addEventListener('touchstart', (e) => {
  console.log('Touch started:', e.touches.length);
});

element.addEventListener('touchmove', (e) => {
  e.preventDefault(); // Prevent scrolling if needed
});
```

### **Device Orientation**
```javascript
// Test orientation changes
window.addEventListener('orientationchange', () => {
  console.log('Orientation changed to:', screen.orientation.angle);
});
```

---

## 📞 **SUPPORT & RESOURCES**

### **Quick Commands Reference**
```bash
# Start mobile-friendly dev server
npm run dev:mobile

# Generate QR code for easy access
npm run qr

# Check network configuration
ipconfig  # Windows
ifconfig  # Mac/Linux

# Test with ngrok tunnel
ngrok http 5173
```

### **Useful URLs**
- **Local Development**: `http://localhost:5173`
- **Network Access**: `http://YOUR_IP:5173`
- **ngrok Tunnel**: `https://random-id.ngrok.io`

### **Browser Testing**
- **Chrome Mobile**: Best for debugging
- **Safari Mobile**: iOS-specific testing
- **Firefox Mobile**: Alternative engine testing
- **Samsung Internet**: Popular Android browser

---

**Last Updated**: 2025-01-06  
**Guide Version**: 1.0  
**Maintained By**: ROOMi Development Team
