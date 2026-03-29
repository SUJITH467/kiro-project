# Bloom Wellness - Profile & Authentication System Guide

## ✅ Implementation Complete

Your Women's Health & Wellness website now has a complete user profile and authentication system. Here's what's been added:

---

## 📝 Files Created/Modified

### 1. **profile.html** (NEW)
   - Complete profile page with user information display
   - 4 tabs: Overview, Settings, Activity, Preferences
   - Profile avatar with upload capability
   - Account statistics (logs, badges, streak, points)
   - Logout functionality
   - Fully responsive design

### 2. **profile.js** (NEW)
   - Authentication check and redirect logic
   - Profile data loading and display
   - Avatar upload handling
   - Password change functionality
   - Notification settings management
   - Preference saving (wellness goals, theme)
   - Activity history loading and formatting

### 3. **index.html** (MODIFIED)
   - Updated navbar with authentication-aware sections
   - Profile dropdown menu showing when logged in
   - "Sign In" button for guests
   - "View Profile" and "Logout" options for authenticated users

### 4. **script.js** (MODIFIED)
   - `updateAuthNavbar()` - Updates navbar based on login state
   - `toggleProfileMenu()` - Opens/closes profile dropdown
   - `doLogout()` - Handles logout with confirmation
   - Authentication state checking on page load

### 5. **style.css** (MODIFIED)
   - Profile page styling (header, cards, grid layouts)
   - Profile dropdown menu styling
   - Modal window styling for password change
   - Notification toast styling
   - Fully responsive breakpoints
   - Dark mode support throughout

### 6. **auth.js** (EXISTING)
   - Already includes `logout()` function
   - Session storage management
   - User authentication logic

---

## 🔐 How It Works

### Login Flow:
1. User clicks "Sign In" button in navbar
2. Redirected to `login.html`
3. Enters email and password
4. On successful login:
   - Session stored in localStorage as `bloom_session`
   - Redirected to `index.html`
   - Navbar updates automatically

### Navbar Updates:
- **Guest State**: Shows "Sign In" button
- **Logged In State**: Shows:
  - "Start Tracking" button
  - Profile avatar mini
  - Dropdown menu with:
    - View Profile
    - Dashboard
    - Logout

### Profile Page (`/profile.html`):
- Accessible only to logged-in users
- Auto-redirects guests to login page
- Four tabs:
  - **Overview**: Personal info and stats
  - **Settings**: Security, notifications
  - **Activity**: Recent user activity
  - **Preferences**: Wellness goals, theme

---

## 🎨 Features Implemented

### ✨ Profile Features:
- [x] User name, email, age group, wellness goal display
- [x] Profile avatar with upload capability
- [x] Membership join date
- [x] Account statistics (total logs, badges, streaks, points)
- [x] Recent activity timeline
- [x] Change password functionality
- [x] Notification preferences toggle
- [x] Wellness goal selection
- [x] Theme preference (light/dark/auto)

### 🔒 Security:
- [x] Session-based authentication using localStorage
- [x] Password hashing (simple hash - suitable for localStorage)
- [x] Logout confirmation dialog
- [x] Protected profile page (redirects if not logged in)
- [x] Automatic session validation

### 🎯 User Experience:
- [x] Smooth navbar transitions
- [x] Profile dropdown menu
- [x] Animated modals
- [x] Toast notifications
- [x] Responsive design for all devices
- [x] Dark mode support

---

## 🚀 How to Use

### For End Users:

1. **First Time Visit:**
   - Click "Sign In" in navbar
   - Create new account or use demo account
   - Redirected to main page

2. **After Login:**
   - Navbar shows profile avatar and dropdown
   - Click avatar to see profile menu
   - Click "View Profile" to access profile page

3. **On Profile Page:**
   - View personal information in Overview tab
   - Change password in Settings tab
   - See recent activity history
   - Update wellness goals and preferences

4. **To Logout:**
   - Click profile avatar dropdown
   - Click "Logout"
   - Confirm logout
   - Redirected to home page

### For Developers:

#### Check if User is Logged In:
```javascript
const session = lsGet('bloom_session', null);
if (session && session.userId && !session.isGuest) {
  // User is logged in
  console.log('Welcome,', session.name);
}
```

#### Update Navbar Auth State:
```javascript
updateAuthNavbar(); // Call this whenever login state changes
```

#### Access User Data:
```javascript
const session = lsGet('bloom_session', {});
console.log('User:', session.name);
console.log('Email:', session.email);
console.log('Goal:', session.goal);
```

#### Logout Programmatically:
```javascript
doLogout(); // Will ask for confirmation
```

---

## 📱 Responsive Breakpoints

- **Desktop (1024px+):** Sidebar + Main content side-by-side
- **Tablet (768px-1023px):** Sidebar buttons in grid, main content below
- **Mobile (<768px):** Single column layout, stacked elements

---

## 🎨 Color Scheme (Integrated with Wellness Theme)

- **Primary**: Pink (#ec4899)
- **Secondary**: Purple (#a855f7)
- **Success**: Green (#16a34a)
- **Error**: Red (#e11d48)
- **Background**: Light (#fdf8ff) / Dark (#0f0a1a)

---

## 🔄 Data Flow

```
index.html
    ↓
On load: updateAuthNavbar()
    ↓
Checks localStorage['bloom_session']
    ↓
If logged in: Show profile dropdown
If guest: Show "Sign In" button
    ↓
Click dropdown: toggleProfileMenu()
    ↓
Can navigate to profile.html
    ↓
profile.html
    ↓
On load: checkAuthAndInit()
    ↓
If not logged in: Redirect to login.html
If logged in: Load and display profile
    ↓
User can update preferences or logout
```

---

## 📦 localStorage Keys Used

- `bloom_session` - Current user session
- `bloom_users` - User database
- `profile_avatar_[userId]` - User avatar image
- `notification_prefs_[userId]` - Notification settings
- `theme_pref_[userId]` - Theme preference
- `darkMode` - Dark mode setting

---

## 🛠️ Future Enhancements

- Add email verification
- Implement password reset via email
- Add profile picture crop/edit
- Social login integration
- Two-factor authentication
- User roles and permissions
- Activity logs with filtering
- Export user data as PDF

---

## ✅ Testing Checklist

- [x] Login/Signup works correctly
- [x] Session persists across page refreshes
- [x] Navbar updates on login
- [x] Profile page loads only when logged in
- [x] Guest users redirected to login
- [x] Logout clears session
- [x] Profile avatar uploads and displays
- [x] Password change works
- [x] Settings save correctly
- [x] Responsive on mobile/tablet
- [x] Dark mode works throughout
- [x] Notifications display properly

---

## 💡 Notes

- All data is stored in browser's localStorage (no backend required)
- Session lasts until user logs out or clears browser data
- Password hashing is simple (suitable for localStorage demo, not production)
- Profile page auto-redirects unauthenticated users to login
- Navbar updates dynamically without page refresh

---

## 🎉 You're All Set!

Your profile system is fully functional. Users can now:
1. ✅ Create accounts
2. ✅ Login securely
3. ✅ Access their profile
4. ✅ View and update their information
5. ✅ Logout safely

Enjoy your complete wellness platform! 🌸
