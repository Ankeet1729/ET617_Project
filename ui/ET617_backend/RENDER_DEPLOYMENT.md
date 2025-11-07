# Render Deployment Guide for Authentication Fix

## Issues Fixed

1. **Proxy Trust**: Added `app.set('trust proxy', 1)` for Render's proxy
2. **Cookie Settings**: Fixed `secure`, `sameSite`, and `httpOnly` flags for production
3. **Session Store**: Auto-create session table if it doesn't exist
4. **CORS Configuration**: Improved origin matching and logging
5. **Environment Detection**: Auto-detect Render environment

## Required Environment Variables on Render

Set these in your Render dashboard under **Environment**:

### Required Variables:
1. **SESSION_SECRET** - A strong random string (e.g., generate with `openssl rand -base64 32`)
   - ⚠️ **CRITICAL**: Change from the default or sessions won't persist properly
   
2. **FRONTEND_URL** - Your frontend URL (e.g., `https://your-frontend.onrender.com`)
   - Must match exactly (including https/http and trailing slash)

3. **NODE_ENV** - Set to `production` (Render may set this automatically)

### Database Variables:
Make sure these are set (usually from Render's PostgreSQL addon):
- **DB_USER**
- **DB_HOST**
- **DB_NAME**
- **DB_PASSWORD**
- **DB_PORT**

### Optional Variables:
- **COOKIE_DOMAIN** - Only needed if using subdomains
- **RENDER** - Automatically set by Render (used to detect production)

## Steps to Deploy on Render

### 1. Create Session Table
Run this SQL in your Render PostgreSQL database (via Render's PostgreSQL dashboard):

```sql
-- Session table for storing user sessions
CREATE TABLE IF NOT EXISTS session (
  sid VARCHAR(255) NOT NULL PRIMARY KEY,
  sess JSONB NOT NULL,
  expire TIMESTAMP NOT NULL
);

-- Create index on expire column for automatic cleanup of expired sessions
CREATE INDEX IF NOT EXISTS idx_session_expire ON session(expire);
```

### 2. Set Environment Variables
Go to your Render service → **Environment** and add:
- `SESSION_SECRET` (generate a secure random string)
- `FRONTEND_URL` (your frontend URL)
- Verify `NODE_ENV=production`

### 3. Verify CORS Settings
Make sure `FRONTEND_URL` in backend matches your actual frontend URL exactly:
- Include `https://` protocol
- No trailing slash
- Exact match (case-sensitive for domain)

### 4. Update Frontend Configuration
In your frontend `.env` or environment variables, set:
```
VITE_BACKEND_URL=https://your-backend.onrender.com
```

Make sure the frontend uses `credentials: "include"` in all fetch requests (already done in your code).

### 5. Test the Deployment

1. **Health Check**: Visit `https://your-backend.onrender.com/health`
   - Should return: `{"status":"ok","sessionStore":"connected",...}`

2. **Session Check**: After logging in, check `https://your-backend.onrender.com/api/session/check`
   - Should show your session details

3. **Check Logs**: In Render dashboard, check **Logs** tab for:
   - CORS warnings (will show blocked origins)
   - Session store errors
   - Any connection issues

## Common Issues and Solutions

### Issue: Sessions not persisting
**Solution**: 
- Verify `SESSION_SECRET` is set and different from default
- Check session table exists in database
- Verify database connection is working

### Issue: CORS errors
**Solution**:
- Check `FRONTEND_URL` matches exactly (including protocol)
- Check Render logs for CORS warnings showing blocked origins
- Ensure frontend sends requests with `credentials: "include"`

### Issue: Cookies not being set
**Solution**:
- Verify `secure: true` is used (automatic in production)
- Check `sameSite: 'none'` is set (for cross-origin)
- Ensure frontend is using HTTPS (required for secure cookies)

### Issue: "Invalid session" errors
**Solution**:
- Clear browser cookies and try again
- Check session table exists in database
- Verify session store is connected (check `/health` endpoint)

## Debugging Tips

1. **Check Render Logs**: Always check the logs first - they show CORS and session errors

2. **Test Session Endpoint**: Use `/api/session/check` to see current session state

3. **Verify Environment Variables**: Double-check all env vars are set correctly in Render dashboard

4. **Database Connection**: Verify PostgreSQL connection is working by checking logs

5. **Cookie Inspection**: In browser DevTools → Application → Cookies, check:
   - Cookie is being set
   - Cookie has `Secure` and `HttpOnly` flags
   - `SameSite` is set to `None` (in production)

## Testing Checklist

- [ ] Session table created in database
- [ ] `SESSION_SECRET` set in environment variables
- [ ] `FRONTEND_URL` set correctly
- [ ] Frontend `VITE_BACKEND_URL` points to Render backend
- [ ] Health check endpoint returns success
- [ ] Can log in as student
- [ ] Can log in as admin
- [ ] Sessions persist after page refresh
- [ ] Can access protected routes after login
- [ ] Logout works correctly

## Additional Notes

- The session table will be auto-created if `createTableIfMissing: true` is set (which it is)
- Sessions expire after 24 hours of inactivity
- Render automatically sets `RENDER` environment variable
- Cookies require HTTPS in production (Render provides this automatically)

