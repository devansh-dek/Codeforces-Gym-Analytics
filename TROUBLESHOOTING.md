# 🔧 Troubleshooting Guide

## Common Issues and Solutions

### ✅ CORS Errors (FIXED)

**Issue**: `Cross-Origin Request Blocked` errors when loading contests

**Solution**: ✅ **Already Fixed!** The application now uses Next.js API routes as a proxy. The Codeforces API calls are made server-side, bypassing CORS restrictions entirely.

**How it works**:
- Client calls `/api/contest/status` and `/api/contest/standings`
- Next.js server makes requests to Codeforces
- Data is returned to client without CORS issues

---

## Other Potential Issues

### Contest Won't Load

**Symptoms**: Error message appears after entering contest ID

**Possible Causes & Solutions**:

1. **Invalid Contest ID**
   - ✅ Verify the contest ID is correct
   - ✅ Gym contests usually have IDs ≥ 100000
   - ✅ Try these working IDs: `102391`, `505970`, `104901`

2. **Contest Not Available**
   - ❌ Contest might be private or deleted
   - ✅ Try a different contest ID
   - ✅ Use the "Try Demo" button to test the app

3. **Network Issues**
   - ✅ Check your internet connection
   - ✅ Codeforces might be down - check codeforces.com
   - ✅ Try again after a few minutes

4. **API Rate Limiting**
   - ⏳ Wait 30 seconds between requests
   - ✅ Codeforces has rate limits
   - ✅ Use demo mode while waiting

### Slow Performance

**Symptoms**: App feels sluggish, timeline scrubbing is slow

**Solutions**:

1. **Large Contest (500+ teams)**
   - ⏳ Initial load takes longer
   - ✅ This is normal - wait for completion
   - ✅ Scrubbing will be fast after loading

2. **Browser Performance**
   - ✅ Close other tabs
   - ✅ Use Chrome or Firefox for best performance
   - ✅ Clear browser cache

3. **Timeline Optimization**
   - ✅ Use preset jump buttons instead of dragging
   - ✅ Increase playback speed for faster review
   - ✅ Use keyboard shortcuts (Space, arrows)

### Data Not Updating

**Symptoms**: Standings don't change when moving timeline

**Solutions**:

1. **Check Timeline Position**
   - ✅ Ensure you're moving the slider
   - ✅ Check current time display
   - ✅ Try clicking preset buttons (15min, 30min)

2. **Reload Contest**
   - ✅ Click "Change Contest"
   - ✅ Re-enter contest ID
   - ✅ Or try demo mode first

### Build Errors

**Symptoms**: `npm run build` fails

**Solutions**:

1. **Missing Dependencies**
   ```bash
   rm -rf node_modules
   npm install
   npm run build
   ```

2. **TypeScript Errors**
   - ✅ All type errors should be fixed
   - ✅ If you see new errors, check your changes
   - ✅ Revert to last working commit

3. **Port Already in Use**
   ```bash
   # Kill process on port 3000
   lsof -ti:3000 | xargs kill -9
   npm run dev
   ```

### Deployment Issues

**Problem**: App doesn't work after deployment

**Solutions**:

1. **Vercel/Netlify Deployment**
   ```bash
   # Ensure build passes locally first
   npm run build

   # Then deploy
   vercel deploy
   # or
   netlify deploy
   ```

2. **Environment Variables**
   - ✅ API keys are optional (app works without them)
   - ✅ Set `NEXT_PUBLIC_APP_URL` for your domain
   - ✅ Don't commit `.env.local` to git

3. **API Routes Not Working**
   - ✅ Ensure you're deploying to a Node.js environment
   - ✅ Static export won't work (needs server-side rendering)
   - ✅ Vercel and Netlify support API routes automatically

## Quick Fixes

### ⚡ Fast Solutions

```bash
# Reset to working state
git checkout main
npm install
npm run build
npm run dev

# Clear all caches
rm -rf .next node_modules
npm install
npm run dev

# Test with demo mode
# Click "Try Demo Contest" button in UI
```

## Getting Help

### Before Asking for Help

1. ✅ Try the demo mode
2. ✅ Check browser console for errors (F12)
3. ✅ Verify internet connection
4. ✅ Try a different contest ID
5. ✅ Restart dev server

### Information to Provide

When reporting issues, include:
- Contest ID you're trying to load
- Browser and version
- Full error message from console
- Steps to reproduce
- Screenshot if possible

## Known Limitations

### What's NOT Supported (Yet)

❌ **Live Contest Updates**: App shows historical data only
❌ **Individual Contests**: Designed for team contests
❌ **Submission Code**: Can't view code (API limitation)
❌ **Multi-Contest Mashups**: Single contest at a time
❌ **Mobile Optimization**: Works but not fully optimized

### Workarounds

**For Live Contests**: Wait until contest ends, then load
**For Individuals**: May work but designed for teams
**For Code Viewing**: Visit Codeforces directly
**For Mashups**: Load contests separately

## Performance Tips

### Optimize Your Experience

1. **Use Keyboard Shortcuts**
   - ⌨️ Much faster than clicking
   - Space, arrows, L, C, E

2. **Preset Jumps**
   - 🚀 Faster than dragging slider
   - Use 15min, 30min, 1hr buttons

3. **Livestream Mode**
   - 🎥 Cleaner, faster rendering
   - Toggle with L key

4. **Demo Mode**
   - 🎮 Test without API calls
   - Instant loading

5. **Playback Speed**
   - ⏩ Use 5x or 10x for quick review
   - Slow to 0.5x for detailed analysis

## API Endpoint Health Check

To verify Codeforces API is working:

```bash
# Test API directly (from terminal, not browser)
curl "https://codeforces.com/api/contest.standings?contestId=102391&from=1&count=10"
```

If this fails, Codeforces API might be down.

---

## ✅ Current Status

**CORS Issues**: ✅ FIXED (using Next.js proxy)
**Build Errors**: ✅ FIXED (TypeScript resolved)
**API Integration**: ✅ WORKING
**All Features**: ✅ FUNCTIONAL

**Last Updated**: February 10, 2026

---

**Still having issues?** Check the console (F12) for detailed error messages, or try the demo mode to verify the app works correctly.
